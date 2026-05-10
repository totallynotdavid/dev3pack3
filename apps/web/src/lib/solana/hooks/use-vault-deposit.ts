"use client";

import { useCallback } from "react";
import { useSendTransaction } from "./use-send-transaction";
import { useWallet } from "../wallet/context";
import { toast } from "sonner";

export function useVaultDeposit() {
  const { isSending } = useSendTransaction();
  const { wallet } = useWallet();

  const deposit = useCallback(
    async (amountLamports: bigint) => {
      if (!wallet) {
        toast.error("Wallet not connected");
        return;
      }

      try {
        if (amountLamports <= 0n) {
          throw new Error("Deposit amount must be greater than zero");
        }

        if (!process.env.NEXT_PUBLIC_PROGRAM_ID) {
          throw new Error("Vault program is not configured");
        }

        throw new Error("Vault deposit is not available in this build");
      } catch (error) {
        console.error("Deposit error:", error);
        toast.error(error instanceof Error ? error.message : "Deposit failed");
        throw error;
      }
    },
    [wallet],
  );

  return { deposit, isDepositing: isSending };
}
