"use client";

import useSWR from "swr";
import { type Address, type Lamports } from "@solana/kit";
import { useCluster } from "../cluster-context";

export function useVaultBalance(userAddress?: Address) {
  const { cluster } = useCluster();

  const { data, isLoading, error, mutate } = useSWR(
    userAddress ? (["vault-balance", cluster, userAddress] as const) : null,
    async () => {
      if (!process.env.NEXT_PUBLIC_PROGRAM_ID) {
        throw new Error("Vault program is not configured");
      }

      throw new Error("Vault balance is not available in this build");
    },
    { refreshInterval: 60_000, revalidateOnFocus: true },
  );

  return {
    lamports: (data ?? null) as Lamports | null,
    isLoading,
    error,
    mutate,
  };
}
