import { address, type Address } from "@solana/kit";
import { CLUSTERS, type ClusterMoniker } from "./solana-client";

type JsonObject = Record<string, unknown>;

type WalletSyncRequest = {
  signature: string;
  walletAddress: Address;
};

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

function getStringField(value: JsonObject, key: string): string | undefined {
  const field = value[key];
  return typeof field === "string" ? field : undefined;
}

export function parseWalletSyncRequestBody(body: unknown): WalletSyncRequest {
  if (!isObject(body)) {
    throw new Error("Invalid request body");
  }

  const signature = getStringField(body, "signature")?.trim();
  const walletAddressRaw = getStringField(body, "walletAddress")?.trim();

  if (!signature || !walletAddressRaw) {
    throw new Error("Missing signature or walletAddress");
  }

  return {
    signature,
    walletAddress: address(walletAddressRaw),
  };
}

export function parseApiErrorMessage(body: unknown, fallback: string): string {
  if (!isObject(body)) return fallback;
  const message = getStringField(body, "error");
  return message && message.length > 0 ? message : fallback;
}

function isClusterMoniker(value: string): value is ClusterMoniker {
  return CLUSTERS.some((cluster) => cluster === value);
}

export function resolveSolanaCluster(
  clusterValue: string | undefined,
  fallback: ClusterMoniker = "devnet",
): ClusterMoniker {
  if (!clusterValue) return fallback;
  return isClusterMoniker(clusterValue) ? clusterValue : fallback;
}
