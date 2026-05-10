import { type } from "arktype";
import type { ClusterMoniker } from "@/lib/solana/solana-client";

// Configuration boundary: this is the only runtime module in apps/web/src allowed to read process.env.
const DEFAULT_AGENT_API_URL = "https://factor-bridge-agent-197950168142.us-central1.run.app/query";
const DEFAULT_STOREFRONT_URL = "http://localhost:3000";

const envSchema = type({
  POSTGRES_URL: "string > 0",
  NEXT_PUBLIC_SOLANA_CLUSTER: "'devnet' | 'testnet' | 'mainnet' | 'localnet'",
  "NEXT_PUBLIC_AGENT_API_URL?": "string > 0",
  "NEXT_PUBLIC_STOREFRONT_URL?": "string > 0",
  "NODE_ENV?": "string",
});

type LoadedConfig = {
  db: {
    postgresUrl: string;
  };
  solana: {
    cluster: ClusterMoniker;
  };
  agent: {
    apiUrl: string;
  };
  storefront: {
    url: string;
  };
  app: {
    isProduction: boolean;
  };
};

export function loadConfig(env: Record<string, string | undefined> = process.env): LoadedConfig {
  const parsed = envSchema(env);
  if (parsed instanceof type.errors) {
    throw new Error(`Invalid environment configuration:\n- ${parsed.summary}`);
  }

  return {
    db: {
      postgresUrl: parsed.POSTGRES_URL.trim(),
    },
    solana: {
      cluster: parsed.NEXT_PUBLIC_SOLANA_CLUSTER,
    },
    agent: {
      apiUrl: parsed.NEXT_PUBLIC_AGENT_API_URL?.trim() || DEFAULT_AGENT_API_URL,
    },
    storefront: {
      url: parsed.NEXT_PUBLIC_STOREFRONT_URL?.trim() || DEFAULT_STOREFRONT_URL,
    },
    app: {
      isProduction: parsed.NODE_ENV === "production",
    },
  };
}

export const config = Object.freeze(loadConfig());
