"use client";

import { useCallback } from "react";
import { useSendTransaction } from "./use-send-transaction";
import { useWallet } from "../wallet/context";
import { getVaultPda, buildDepositInstruction } from "../vault/client";
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

      const signerAddress = wallet.account.address;
      const vaultPda = await getVaultPda(signerAddress);
      const instruction = await buildDepositInstruction(signerAddress, vaultPda, amountLamports);

      const signature = await send({ instructions: [instruction] });

      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature, walletAddress: signerAddress }),
      });

      if (!res.ok) {
        const { error } = (await res.json()) as { error: string };
        throw new Error(error ?? "Failed to record deposit");
      }

      toast.success(`${Number(amountLamports) / 1_000_000_000} SOL deposited to vault`);
      return signature;
    },
    [wallet, send],
  );

  return { deposit, isDepositing: isSending };
}
