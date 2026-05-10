import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, walletTransactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/db/queries/users";
import { createSolanaClient } from "@/lib/solana/solana-client";
import { getVaultPda } from "@/lib/solana/vault/client";
import { type Address } from "@solana/kit";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { signature, walletAddress } = (await request.json()) as {
      signature: string;
      walletAddress: string;
    };

    if (!signature || !walletAddress) {
      return NextResponse.json({ error: "Missing signature or walletAddress" }, { status: 400 });
    }

    // Verify the transaction on-chain and extract the actual deposited amount
    const cluster = (process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? "devnet") as Parameters<
      typeof createSolanaClient
    >[0];
    const client = createSolanaClient(cluster);

    const tx = await client.rpc
      .getTransaction(signature as Parameters<typeof client.rpc.getTransaction>[0], {
        commitment: "confirmed",
        encoding: "json" as const,
        maxSupportedTransactionVersion: 0,
      })
      .send();

    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found or not confirmed" },
        { status: 400 },
      );
    }

    // Find the vault PDA in the transaction accounts and read its balance delta
    const vaultPda = await getVaultPda(walletAddress as Address);
    const accountKeys = tx.transaction.message.accountKeys;
    const vaultIndex = accountKeys.findIndex(
      (k) => k === (vaultPda as unknown as (typeof accountKeys)[number]),
    );

    if (vaultIndex === -1) {
      return NextResponse.json({ error: "Vault PDA not found in transaction" }, { status: 400 });
    }

    const preBalance = Number(tx.meta?.preBalances?.[vaultIndex] ?? 0);
    const postBalance = Number(tx.meta?.postBalances?.[vaultIndex] ?? 0);
    const depositedLamports = postBalance - preBalance;

    if (depositedLamports <= 0) {
      return NextResponse.json({ error: "No deposit detected in transaction" }, { status: 400 });
    }

    await getOrCreateUser(userId, "", "");

    // Atomically credit wallet balance and record the transaction
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ walletBalance: sql`wallet_balance + ${depositedLamports}` })
        .where(eq(users.id, userId));

      await tx.insert(walletTransactions).values({
        userId,
        amount: depositedLamports,
        type: "deposit",
      });
    });

    return NextResponse.json({ success: true, amount: depositedLamports });
  } catch (error) {
    console.error("Deposit sync error:", error);
    return NextResponse.json({ error: "Failed to record deposit" }, { status: 500 });
  }
}
