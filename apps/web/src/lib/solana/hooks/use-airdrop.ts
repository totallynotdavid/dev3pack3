"use client";

import { useCallback, useState } from "react";
import { type Address, lamports } from "@solana/kit";
import { useSolanaClient } from "../solana-client-context";
import { useCluster } from "../cluster-context";
import { toast } from "sonner";

export function useAirdrop() {
  const client = useSolanaClient();
  const { cluster } = useCluster();
  const [isAirdropping, setIsAirdropping] = useState(false);

  const requestAirdrop = useCallback(
    async (address: Address, amount: bigint = 1_000_000_000n): Promise<void> => {
      if (!client) return;
      if (cluster === "mainnet") {
        toast.error("Airdrop not available on mainnet");
        return;
      }

      setIsAirdropping(true);
      try {
        toast.info("Requesting airdrop...");

        await client.airdrop(address, lamports(amount));

        toast.success(`Airdrop successful! ${Number(amount) / 1_000_000_000} SOL received`);
      } catch (error: any) {
        console.error("Airdrop error:", error);

        const msg = error?.message || String(error);
        const isRateLimited = msg.includes("429") || msg.includes("Internal JSON-RPC error");

        toast.error(
          isRateLimited
            ? "Devnet faucet rate-limited. Use the web faucet instead: https://faucet.solana.com"
            : "Airdrop failed. Try again later.",
        );

        throw error;
      } finally {
        setIsAirdropping(false);
      }
    },
    [client, cluster],
  );

  return { requestAirdrop, isAirdropping };
}
