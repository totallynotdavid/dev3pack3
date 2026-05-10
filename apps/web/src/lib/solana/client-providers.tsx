"use client";

import { useState, useEffect, type ReactNode, type ComponentType } from "react";

type ProviderProps = { children: ReactNode };

export function ClientSolanaProviders({ children }: ProviderProps) {
  const [Providers, setProviders] = useState<ComponentType<ProviderProps> | null>(null);

  useEffect(() => {
    void import("./providers").then((mod) => {
      // Functional update form so React doesn't treat the component as an updater fn
      setProviders(() => mod.SolanaProviders);
    });
  }, []);

  if (!Providers) return <>{children}</>;
  return <Providers>{children}</Providers>;
}
