"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { type Address } from "@solana/kit";
import { useCluster } from "../cluster-context";
import { useSolanaClient } from "../solana-client-context";

export function useBalance(address?: Address) {
  const { cluster } = useCluster();
  const client = useSolanaClient();

  const { data, isLoading, error, mutate } = useSWR(
    address && client ? (["balance", cluster, address] as const) : null,
    async ([, , addr]) => {
      const { value } = await client!.rpc.getBalance(addr).send();
      return value;
    },
    { refreshInterval: 60_000, revalidateOnFocus: true },
  );

  useEffect(() => {
    const noopCleanup = () => {};
    if (!address || !client) return noopCleanup;

    const abortController = new AbortController();

    const subscribe = async () => {
      try {
        const notifications = await client.rpcSubscriptions
          .accountNotifications(address, { commitment: "confirmed" })
          .subscribe({ abortSignal: abortController.signal });

        for await (const notification of notifications) {
          const lamports = notification.value.lamports;
          void mutate(lamports, { revalidate: false });
        }
      } catch {
        // SWR polling and focus revalidation remain as fallback
      }
    };

    void subscribe();

    const cleanup = () => {
      abortController.abort();
    };
    return cleanup;
  }, [address, client, mutate]);

  return {
    lamports: data ?? null,
    isLoading,
    error,
    mutate,
  };
}
