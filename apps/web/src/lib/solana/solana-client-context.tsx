"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createSolanaClient, type SolanaClient } from "./solana-client";
import { useCluster } from "./cluster-context";

const SolanaClientContext = createContext<SolanaClient | null>(null);

export function SolanaClientProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const client = useMemo(() => createSolanaClient(cluster), [cluster]);

  return <SolanaClientContext.Provider value={client}>{children}</SolanaClientContext.Provider>;
}

export function useSolanaClient() {
  return useContext(SolanaClientContext);
}
