"use client";

import { useCallback } from "react";
import { useSendTransaction } from "./use-send-transaction";
import { useWallet } from "../wallet/context";
import { toast } from "sonner";

export function useVaultWithdraw() {
  const { send, isSending } = useSendTransaction();
  const { wallet } = useWallet();

  const withdraw = useCallback(async () => {
    if (!wallet) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      toast.info("Preparing withdraw transaction...");

      // TODO: Implement actual vault withdraw instruction
      // This requires the Anchor program to be deployed and the IDL to be available

      toast.warning("Vault withdraw not yet implemented. Coming soon!");

      // Example of what the implementation would look like:
      // const vaultPda = deriveVaultPda(wallet.account.address);
      // const withdrawIx = await createWithdrawInstruction(
      //   wallet.account.address,
      //   vaultPda
      // );
      // const signature = await send({ instructions: [withdrawIx] });
      // toast.success(`Withdrawn successfully! Signature: ${signature}`);

      return null;
    } catch (error) {
      console.error("Withdraw error:", error);
      toast.error(
        error instanceof Error ? error.message : "Withdraw failed"
      );
      throw error;
    }
  }, [wallet, send]);

  return { withdraw, isWithdrawing: isSending };
}
