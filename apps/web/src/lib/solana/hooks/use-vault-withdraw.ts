"use client";

import { useCallback } from "react";
import { useSendTransaction } from "./use-send-transaction";
import { useWallet } from "../wallet/context";
import { getVaultPda, buildWithdrawInstruction } from "../vault/client";
import { toast } from "sonner";

export function useVaultWithdraw() {
  const { send, isSending } = useSendTransaction();
  const { wallet } = useWallet();

  const withdraw = useCallback(async () => {
    if (!wallet) {
      toast.error("Wallet not connected");
      return;
    }

    const signerAddress = wallet.account.address;
    const vaultPda = await getVaultPda(signerAddress);
    const instruction = await buildWithdrawInstruction(signerAddress, vaultPda);

    const signature = await send({ instructions: [instruction] });

    const res = await fetch("/api/wallet/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signature, walletAddress: signerAddress }),
    });

    if (!res.ok) {
      const { error } = (await res.json()) as { error: string };
      throw new Error(error ?? "Failed to record withdrawal");
    }

    toast.success("SOL withdrawn from vault");
    return signature;
  }, [wallet, send]);

  return { withdraw, isWithdrawing: isSending };
}
