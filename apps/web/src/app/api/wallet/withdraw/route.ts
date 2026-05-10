import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, walletTransactions, offers } from "@/db/schema";
import { eq, sql, and, inArray } from "drizzle-orm";
import { createSolanaClient } from "@/lib/solana/solana-client";
import { getVaultPda } from "@/lib/solana/vault/client";
import { parseWalletSyncRequestBody } from "@/lib/solana/wallet-sync-boundary";
import { config } from "@/config/env";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { signature, walletAddress } = parseWalletSyncRequestBody(await request.json());

    // Block withdraw if user has pending or countered offers (SOL is committed as collateral)
    const activeOffers = await db.query.offers.findMany({
      where: and(eq(offers.buyerId, userId), inArray(offers.status, ["pending", "countered"])),
    });

    if (activeOffers.length > 0) {
      return NextResponse.json(
        { error: "Cannot withdraw while you have active offers. Wait for them to be resolved." },
        { status: 400 },
      );
    }

    // Verify the transaction on-chain and extract the actual withdrawn amount
    const client = createSolanaClient(config.solana.cluster);

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

    const vaultPda = await getVaultPda(walletAddress);
    const accountKeys = tx.transaction.message.accountKeys;
    const vaultIndex = accountKeys.findIndex((accountKey) => accountKey === vaultPda);

    if (vaultIndex === -1) {
      return NextResponse.json({ error: "Vault PDA not found in transaction" }, { status: 400 });
    }

    const preBalance = Number(tx.meta?.preBalances?.[vaultIndex] ?? 0);
    const postBalance = Number(tx.meta?.postBalances?.[vaultIndex] ?? 0);
    const withdrawnLamports = preBalance - postBalance;

    if (withdrawnLamports <= 0) {
      return NextResponse.json({ error: "No withdrawal detected in transaction" }, { status: 400 });
    }

    // Debit wallet balance and record transaction
    await db.transaction(async (trx) => {
      await trx
        .update(users)
        .set({ walletBalance: sql`GREATEST(wallet_balance - ${withdrawnLamports}, 0)` })
        .where(eq(users.id, userId));

      await trx.insert(walletTransactions).values({
        userId,
        amount: -withdrawnLamports,
        type: "withdraw",
      });
    });

    return NextResponse.json({ success: true, amount: withdrawnLamports });
  } catch (error) {
    console.error("Withdrawal sync error:", error);
    return NextResponse.json({ error: "Failed to record withdrawal" }, { status: 500 });
  }
}
