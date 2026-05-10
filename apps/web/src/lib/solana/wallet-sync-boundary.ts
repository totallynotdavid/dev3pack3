import { address, signature, type Address, type Signature } from "@solana/kit";
import { type } from "arktype";

type WalletSyncRequest = {
  signature: Signature;
  walletAddress: Address;
};

const walletSyncBodySchema = type({
  signature: "string > 0",
  walletAddress: "string > 0",
});

const apiErrorSchema = type({
  "error?": "string > 0",
});

export function parseWalletSyncRequestBody(body: unknown): WalletSyncRequest {
  const parsed = walletSyncBodySchema(body);
  if (parsed instanceof type.errors) {
    throw new Error(`Invalid wallet sync payload: ${parsed.summary}`);
  }

  return {
    signature: signature(parsed.signature.trim()),
    walletAddress: address(parsed.walletAddress.trim()),
  };
}

export function parseApiErrorMessage(body: unknown, fallback: string): string {
  const parsed = apiErrorSchema(body);
  if (parsed instanceof type.errors) return fallback;
  return parsed.error ?? fallback;
}
