"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type } from "arktype";
import type { ClusterMoniker } from "./solana-client";
import { CLUSTERS } from "./solana-client";
import { getExplorerUrl } from "./explorer";

type ClusterContextValue = {
  cluster: ClusterMoniker;
  setCluster: (cluster: ClusterMoniker) => void;
  getExplorerUrl: (path: string) => string;
};

const ClusterContext = createContext<ClusterContextValue | null>(null);

const STORAGE_KEY = "solana-cluster";
const clusterSchema = type("'devnet' | 'testnet' | 'mainnet' | 'localnet'");

function getInitialCluster(): ClusterMoniker {
  if (typeof window === "undefined") return "devnet";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = clusterSchema(stored);
    if (!(parsed instanceof type.errors)) {
      return parsed;
    }
  }
  return "devnet";
}

export { CLUSTERS };

export function ClusterProvider({ children }: { children: ReactNode }) {
  const [cluster, setClusterState] = useState<ClusterMoniker>(getInitialCluster);

  const setCluster = useCallback((c: ClusterMoniker) => {
    setClusterState(c);
    localStorage.setItem(STORAGE_KEY, c);
  }, []);

  const explorerUrl = useCallback((path: string) => getExplorerUrl(path, cluster), [cluster]);

  return (
    <ClusterContext.Provider value={{ cluster, setCluster, getExplorerUrl: explorerUrl }}>
      {children}
    </ClusterContext.Provider>
  );
}

const DEFAULT_CLUSTER: ClusterContextValue = {
  cluster: "devnet",
  setCluster: () => {},
  getExplorerUrl: (path) => getExplorerUrl(path, "devnet"),
};

export function useCluster() {
  return useContext(ClusterContext) ?? DEFAULT_CLUSTER;
}
