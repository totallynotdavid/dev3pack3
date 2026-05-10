import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, walletTransactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/db/queries/users";
import { createSolanaClient } from "@/lib/solana/solana-client";
import { parseWalletSyncRequestBody } from "@/lib/solana/wallet-sync-boundary";
import { extractVaultBalance } from "@/lib/solana/vault-balance";
import { handleWalletError, ValidationError, TransactionError, RpcError, DatabaseError } from "@/lib/wallet/errors";
import { solanaConfig } from "@/config/env-solana";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { signature, walletAddress } = parseWalletSyncRequestBody(await request.json());

    const client = createSolanaClient(solanaConfig.cluster);

    let tx;
    try {
      tx = await client.rpc
        .getTransaction(signature, {
          commitment: "confirmed",
          encoding: "json" as const,
          maxSupportedTransactionVersion: 0,
        })
        .send();
    } catch (e) {
      throw new RpcError("Failed to fetch transaction from blockchain", e);
    }

    if (!tx) {
      throw new TransactionError("Transaction not found or not confirmed", signature);
    }

    const vault = await extractVaultBalance(tx, walletAddress);

    if (vault.delta <= 0) {
      throw new ValidationError("No deposit detected in transaction");
    }

    await getOrCreateUser(userId, "", "");

    try {
      await db.transaction(async (trx) => {
        await trx
          .update(users)
          .set({ walletBalance: sql`wallet_balance + ${vault.delta}` })
          .where(eq(users.id, userId));

        await trx.insert(walletTransactions).values({
          userId,
          amount: vault.delta,
          type: "deposit",
        });
      });
    } catch (e) {
      throw new DatabaseError("Failed to record deposit", e);
    }

    return NextResponse.json({ success: true, amount: vault.delta });
  } catch (error) {
    return handleWalletError(error);
  }
}
