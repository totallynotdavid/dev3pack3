import type { Address } from "@solana/kit";

export type SolanaChain = `solana:${string}`;

export type WalletAccount = {
  address: Address;
  publicKey: Uint8Array;
  label?: string;
};

export type WalletConnectorMetadata = {
  id: string;
  name: string;
  icon?: string;
};

export type WalletSession = {
  account: WalletAccount;
  connector: WalletConnectorMetadata;
  disconnect: () => Promise<void>;
  signTransaction?: (transaction: Uint8Array, chain: SolanaChain) => Promise<Uint8Array>;
  sendTransaction?: (transaction: Uint8Array, chain: SolanaChain) => Promise<Uint8Array>;
};

export type WalletConnector = WalletConnectorMetadata & {
  connect: (options?: { silent?: boolean }) => Promise<WalletSession>;
};
