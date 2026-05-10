import { ParsedTransactionWithMeta } from "@solana-labs/web3.js";
import { TransactionError } from "@/lib/wallet/errors";
import { getVaultPda } from "./vault/client";

export interface VaultBalance {
  preBalance: number;
  postBalance: number;
  delta: number;
}

export async function extractVaultBalance(
  tx: ParsedTransactionWithMeta,
  walletAddress: string,
): Promise<VaultBalance> {
  const vaultPda = await getVaultPda(walletAddress);
  const accountKeys = tx.transaction.message.accountKeys;
  const vaultIndex = accountKeys.findIndex((key) => key === vaultPda);

  if (vaultIndex === -1) {
    throw new TransactionError("Vault PDA not found in transaction", tx.transaction.signatures[0]);
  }

  const preBalance = Number(tx.meta?.preBalances?.[vaultIndex] ?? 0);
  const postBalance = Number(tx.meta?.postBalances?.[vaultIndex] ?? 0);

  return {
    preBalance,
    postBalance,
    delta: postBalance - preBalance,
  };
}
