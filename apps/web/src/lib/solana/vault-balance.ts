import { Address, Lamports } from "@solana/kit";
import { TransactionError } from "@/lib/wallet/errors";
import { getVaultPda } from "./vault/client";

export interface VaultBalance {
  preBalance: number;
  postBalance: number;
  delta: number;
}

type GetTransactionResponse = {
  transaction: {
    message: {
      accountKeys: readonly Address[];
    };
  };
  meta: {
    preBalances: readonly Lamports[];
    postBalances: readonly Lamports[];
  } | null;
};

export async function extractVaultBalance(
  tx: GetTransactionResponse,
  walletAddress: Address,
): Promise<VaultBalance> {
  if (!tx.meta) {
    throw new TransactionError("Transaction metadata not available");
  }

  const vaultPda = await getVaultPda(walletAddress);
  const accountKeys = tx.transaction.message.accountKeys;
  const vaultIndex = accountKeys.findIndex((key) => key === vaultPda);

  if (vaultIndex === -1) {
    throw new TransactionError("Vault PDA not found in transaction");
  }

  const preBalance = Number(tx.meta.preBalances[vaultIndex]);
  const postBalance = Number(tx.meta.postBalances[vaultIndex]);

  return {
    preBalance,
    postBalance,
    delta: postBalance - preBalance,
  };
}
