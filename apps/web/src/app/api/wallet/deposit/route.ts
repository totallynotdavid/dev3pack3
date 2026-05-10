import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, walletTransactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/db/queries/users";
import { createSolanaClient } from "@/lib/solana/solana-client";
import { getVaultPda } from "@/lib/solana/vault/client";
import {
  parseWalletSyncRequestBody,
  resolveSolanaCluster,
} from "@/lib/solana/wallet-sync-boundary";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { signature, walletAddress } = parseWalletSyncRequestBody(await request.json());

    // Verify the transaction on-chain and extract the actual deposited amount
    const cluster = resolveSolanaCluster(process.env.NEXT_PUBLIC_SOLANA_CLUSTER);
    const client = createSolanaClient(cluster);

    const tx = await client.rpc
      .getTransaction(signature, {
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
    const vaultPda = await getVaultPda(walletAddress);
    const accountKeys = tx.transaction.message.accountKeys;
    const vaultIndex = accountKeys.findIndex((accountKey) => {
      if (typeof accountKey === "string") {
        return accountKey === vaultPda;
      }
      if (typeof accountKey !== "object" || accountKey === null) {
        return false;
      }
      if (!("address" in accountKey)) {
        return false;
      }
      const keyAddress = accountKey.address;
      return typeof keyAddress === "string" && keyAddress === vaultPda;
    });

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
    await db.transaction(async (trx) => {
      await trx
        .update(users)
        .set({ walletBalance: sql`wallet_balance + ${depositedLamports}` })
        .where(eq(users.id, userId));

      await trx.insert(walletTransactions).values({
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
