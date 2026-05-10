"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { type Address, type Lamports } from "@solana/kit";
import { getVaultPda } from "../vault/client";
import { useCluster } from "../cluster-context";
import { useSolanaClient } from "../solana-client-context";

export function useVaultBalance(userAddress?: Address) {
  const { cluster } = useCluster();
  const client = useSolanaClient();

  const { data, isLoading, error, mutate } = useSWR(
    userAddress && client ? (["vault-balance", cluster, userAddress] as const) : null,
    async ([, , addr]) => {
      const vaultPda = await getVaultPda(addr);
      const { value } = await client!.rpc.getBalance(vaultPda).send();
      return value;
    },
    { refreshInterval: 60_000, revalidateOnFocus: true },
  );

  useEffect(() => {
    if (!userAddress || !client) return;

    const abortController = new AbortController();

    const subscribe = async () => {
      try {
        const vaultPda = await getVaultPda(userAddress);
        const notifications = await client.rpcSubscriptions
          .accountNotifications(vaultPda, { commitment: "confirmed" })
          .subscribe({ abortSignal: abortController.signal });

        for await (const notification of notifications) {
          mutate(notification.value.lamports, { revalidate: false });
        }
      } catch {
        // SWR polling remains as fallback
      }
    };

    void subscribe();
    return () => abortController.abort();
  }, [userAddress, client, mutate]);

  return {
    lamports: (data ?? null) as Lamports | null,
    isLoading,
    error,
    mutate,
  };
}
