import { type } from "arktype";
import type { ClusterMoniker } from "@/lib/solana/solana-client";

// Configuration boundary: Solana runtime env parsing.
const solanaEnvSchema = type({
  NEXT_PUBLIC_SOLANA_CLUSTER: "'devnet' | 'testnet' | 'mainnet' | 'localnet'",
});

type SolanaConfig = {
  cluster: ClusterMoniker;
};

export function loadSolanaConfig(
  env: Record<string, string | undefined> = process.env,
): SolanaConfig {
  const parsed = solanaEnvSchema(env);
  if (parsed instanceof type.errors) {
    throw new Error(`Invalid Solana environment configuration:\n- ${parsed.summary}`);
  }

  return {
    cluster: parsed.NEXT_PUBLIC_SOLANA_CLUSTER,
  };
}

export const solanaConfig = Object.freeze(loadSolanaConfig());
