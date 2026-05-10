import { address, signature, type Address, type Signature } from "@solana/kit";

type JsonObject = Record<string, unknown>;

type WalletSyncRequest = {
  signature: Signature;
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

  const rawSignature = getStringField(body, "signature")?.trim();
  const walletAddressRaw = getStringField(body, "walletAddress")?.trim();

  if (!rawSignature || !walletAddressRaw) {
    throw new Error("Missing signature or walletAddress");
  }

  return {
    signature: signature(rawSignature),
    walletAddress: address(walletAddressRaw),
  };
}

export function parseApiErrorMessage(body: unknown, fallback: string): string {
  if (!isObject(body)) return fallback;
  const message = getStringField(body, "error");
  return message && message.length > 0 ? message : fallback;
}
