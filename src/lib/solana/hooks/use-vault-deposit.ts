"use client";

import { useCallback } from "react";
import { useSendTransaction } from "./use-send-transaction";
import { useWallet } from "../wallet/context";
import { toast } from "sonner";

export function useVaultDeposit() {
  const { send, isSending } = useSendTransaction();
  const { wallet } = useWallet();

  const deposit = useCallback(
    async (amountLamports: bigint) => {
      if (!wallet) {
        toast.error("Wallet not connected");
        return;
      }

      try {
        toast.info("Preparing deposit transaction...");

        // TODO: Implement actual vault deposit instruction
        // This requires the Anchor program to be deployed and the IDL to be available
        // For now, we'll show a placeholder message

        toast.warning("Vault deposit not yet implemented. Coming soon!");

        // Example of what the implementation would look like:
        // const vaultPda = deriveVaultPda(wallet.account.address);
        // const depositIx = await createDepositInstruction(
        //   wallet.account.address,
        //   vaultPda,
        //   amountLamports
        // );
        // const signature = await send({ instructions: [depositIx] });
        // toast.success(`Deposited successfully! Signature: ${signature}`);

        return null;
      } catch (error) {
        console.error("Deposit error:", error);
        toast.error(error instanceof Error ? error.message : "Deposit failed");
        throw error;
      }
    },
    [wallet, send],
  );

  return { deposit, isDepositing: isSending };
}
