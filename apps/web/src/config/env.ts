import { CLUSTERS, type ClusterMoniker } from "@/lib/solana/solana-client";

// Configuration boundary: this is the only runtime module in apps/web/src allowed to read process.env.
const DEFAULT_AGENT_API_URL = "https://factor-bridge-agent-197950168142.us-central1.run.app/query";
const DEFAULT_STOREFRONT_URL = "http://localhost:3000";

type EnvSource = Record<string, string | undefined>;

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

type ParseHelpers = {
  mustString: (name: string) => string;
  optionalString: (name: string) => string | undefined;
  mustEnum: <T extends string>(name: string, allowed: readonly T[]) => T;
};

function parseWithValidation(
  env: EnvSource,
  parse: (helpers: ParseHelpers) => LoadedConfig,
): LoadedConfig {
  const errors: string[] = [];

  const mustString = (name: string): string => {
    const value = env[name]?.trim();
    if (!value) {
      errors.push(`${name} is required`);
      return "";
    }
    return value;
  };

  const optionalString = (name: string): string | undefined => {
    const value = env[name]?.trim();
    if (value && value.length > 0) return value;
    return undefined;
  };

  const mustEnum = <T extends string>(name: string, allowed: readonly T[]): T => {
    const value = mustString(name);
    const matched = allowed.find((entry) => entry === value);
    if (!matched) {
      errors.push(`${name} must be one of: ${allowed.join(", ")}`);
      return allowed[0];
    }
    return matched;
  };

  const parsed = parse({ mustString, optionalString, mustEnum });
  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration:\n- ${errors.join("\n- ")}`);
  }

  return parsed;
}

export function loadConfig(env: EnvSource = process.env): LoadedConfig {
  return parseWithValidation(env, ({ mustString, optionalString, mustEnum }) => ({
    db: {
      postgresUrl: mustString("POSTGRES_URL"),
    },
    solana: {
      cluster: mustEnum("NEXT_PUBLIC_SOLANA_CLUSTER", CLUSTERS),
    },
    agent: {
      apiUrl: optionalString("NEXT_PUBLIC_AGENT_API_URL") ?? DEFAULT_AGENT_API_URL,
    },
    storefront: {
      url: optionalString("NEXT_PUBLIC_STOREFRONT_URL") ?? DEFAULT_STOREFRONT_URL,
    },
    app: {
      isProduction: optionalString("NODE_ENV") === "production",
    },
  }));
}

export const config = Object.freeze(loadConfig());
