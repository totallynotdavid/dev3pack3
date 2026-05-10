import assert from "node:assert/strict";
import { describe, it } from "node:test";

process.env.POSTGRES_URL ??= "postgres://test";
process.env.NEXT_PUBLIC_SOLANA_CLUSTER ??= "devnet";

const { loadConfig } = await import("./env");

describe("loadConfig", () => {
  it("fails when required variables are missing", () => {
    assert.throws(() => loadConfig({}), /POSTGRES_URL is required/);
  });

  it("fails when enum variables are invalid", () => {
    assert.throws(
      () =>
        loadConfig({
          POSTGRES_URL: "postgres://example",
          NEXT_PUBLIC_SOLANA_CLUSTER: "invalid-cluster",
        }),
      /NEXT_PUBLIC_SOLANA_CLUSTER must be one of: devnet, testnet, mainnet, localnet/,
    );
  });

  it("returns typed config for valid environment", () => {
    const parsed = loadConfig({
      POSTGRES_URL: "postgres://example",
      NEXT_PUBLIC_SOLANA_CLUSTER: "devnet",
      NEXT_PUBLIC_AGENT_API_URL: "https://agent.example/query",
      NEXT_PUBLIC_STOREFRONT_URL: "https://storefront.example",
      NODE_ENV: "production",
    });

    assert.equal(parsed.db.postgresUrl, "postgres://example");
    assert.equal(parsed.solana.cluster, "devnet");
    assert.equal(parsed.agent.apiUrl, "https://agent.example/query");
    assert.equal(parsed.storefront.url, "https://storefront.example");
    assert.equal(parsed.app.isProduction, true);
  });
});
