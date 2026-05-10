"use client";

import { useState, useEffect, type ReactNode, type ComponentType } from "react";

type ProviderProps = { children: ReactNode };

export function ClientSolanaProviders({ children }: ProviderProps) {
  const [Providers, setProviders] = useState<ComponentType<ProviderProps> | null>(null);

  useEffect(() => {
    const loadProviders = async () => {
      const mod = await import("./providers");
      // Functional update form so React doesn't treat the component as an updater fn
      setProviders(() => mod.SolanaProviders);
    };

    void loadProviders();
  }, []);

  if (!Providers) return <>{children}</>;
  return <Providers>{children}</Providers>;
}
