import { Address } from "@solana/kit";
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
      accountKeys: Address[];
    };
  };
  meta: {
    preBalances: number[];
    postBalances: number[];
  };
};

export async function extractVaultBalance(
  tx: GetTransactionResponse,
  walletAddress: string,
): Promise<VaultBalance> {
  const vaultPda = await getVaultPda(walletAddress);
  const accountKeys = tx.transaction.message.accountKeys;
  const vaultIndex = accountKeys.findIndex((key) => key === vaultPda);

  if (vaultIndex === -1) {
    throw new TransactionError("Vault PDA not found in transaction");
  }

  const preBalance = tx.meta.preBalances[vaultIndex];
  const postBalance = tx.meta.postBalances[vaultIndex];

  return {
    preBalance,
    postBalance,
    delta: postBalance - preBalance,
  };
}
