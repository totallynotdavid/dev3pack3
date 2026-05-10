import { describe, expect, it } from "bun:test";
import { loadConfig } from "./env";

describe("loadConfig", () => {
  it("fails when required variables are missing", () => {
    expect(() => loadConfig({})).toThrow(/POSTGRES_URL is required/);
  });

  it("fails when enum variables are invalid", () => {
    expect(() =>
      loadConfig({
        POSTGRES_URL: "postgres://example",
        NEXT_PUBLIC_SOLANA_CLUSTER: "invalid-cluster",
      }),
    ).toThrow(/NEXT_PUBLIC_SOLANA_CLUSTER must be one of: devnet, testnet, mainnet, localnet/);
  });

  it("returns typed config for valid environment", () => {
    const parsed = loadConfig({
      POSTGRES_URL: "postgres://example",
      NEXT_PUBLIC_SOLANA_CLUSTER: "devnet",
      NEXT_PUBLIC_AGENT_API_URL: "https://agent.example/query",
      NEXT_PUBLIC_STOREFRONT_URL: "https://storefront.example",
      NODE_ENV: "production",
    });

    expect(parsed.db.postgresUrl).toBe("postgres://example");
    expect(parsed.solana.cluster).toBe("devnet");
    expect(parsed.agent.apiUrl).toBe("https://agent.example/query");
    expect(parsed.storefront.url).toBe("https://storefront.example");
    expect(parsed.app.isProduction).toBe(true);
  });
});
