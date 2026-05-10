"use client";

import { useCallback } from "react";
import { useSendTransaction } from "./use-send-transaction";
import { useWallet } from "../wallet/context";
import { toast } from "sonner";

export function useVaultWithdraw() {
  const { isSending } = useSendTransaction();
  const { wallet } = useWallet();

  const withdraw = useCallback(async () => {
    if (!wallet) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      if (!process.env.NEXT_PUBLIC_PROGRAM_ID) {
        throw new Error("Vault program is not configured");
      }

      throw new Error("Vault withdraw is not available in this build");
    } catch (error) {
      console.error("Withdraw error:", error);
      toast.error(error instanceof Error ? error.message : "Withdraw failed");
      throw error;
    }
  }, [wallet]);

  return { withdraw, isWithdrawing: isSending };
}
