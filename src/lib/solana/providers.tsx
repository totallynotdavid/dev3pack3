"use client";

import { type ReactNode } from "react";
import { ClusterProvider } from "./cluster-context";
import { SolanaClientProvider } from "./solana-client-context";
import { WalletProvider } from "./wallet/context";

export function SolanaProviders({ children }: { children: ReactNode }) {
  return (
    <ClusterProvider>
      <SolanaClientProvider>
        <WalletProvider>{children}</WalletProvider>
      </SolanaClientProvider>
    </ClusterProvider>
  );
}
