import { getWallets } from "@wallet-standard/app";
import type { Wallet as StandardWallet } from "@wallet-standard/base";
import {
  StandardConnect,
  StandardDisconnect,
  type StandardConnectMethod,
  type StandardDisconnectMethod,
} from "@wallet-standard/features";
import {
  SolanaSignTransaction,
  SolanaSignAndSendTransaction,
  type SolanaSignAndSendTransactionMethod,
  type SolanaSignTransactionMethod,
} from "@solana/wallet-standard-features";
import { address } from "@solana/kit";
import type {
  SolanaChain,
  WalletConnector,
  WalletConnectorMetadata,
  WalletSession,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isConnectMethod(value: unknown): value is StandardConnectMethod {
  return typeof value === "function";
}

function isDisconnectMethod(value: unknown): value is StandardDisconnectMethod {
  return typeof value === "function";
}

function isSignTransactionMethod(value: unknown): value is SolanaSignTransactionMethod {
  return typeof value === "function";
}

function isSignAndSendTransactionMethod(value: unknown): value is SolanaSignAndSendTransactionMethod {
  return typeof value === "function";
}

function getConnectMethod(wallet: StandardWallet): StandardConnectMethod {
  const feature = wallet.features[StandardConnect];
  if (!isRecord(feature)) {
    throw new Error("Wallet does not support connect");
  }
  const connect = feature.connect;
  if (!isConnectMethod(connect)) {
    throw new Error("Wallet does not support connect");
  }
  return connect;
}

function getDisconnectMethod(wallet: StandardWallet): StandardDisconnectMethod | undefined {
  const feature = wallet.features[StandardDisconnect];
  if (!isRecord(feature)) {
    return undefined;
  }
  const disconnect = feature.disconnect;
  return isDisconnectMethod(disconnect) ? disconnect : undefined;
}

function getSignTransactionMethod(wallet: StandardWallet): SolanaSignTransactionMethod | undefined {
  const feature = wallet.features[SolanaSignTransaction];
  if (!isRecord(feature)) {
    return undefined;
  }
  const signTransaction = feature.signTransaction;
  return isSignTransactionMethod(signTransaction) ? signTransaction : undefined;
}

function getSignAndSendTransactionMethod(
  wallet: StandardWallet,
): SolanaSignAndSendTransactionMethod | undefined {
  const feature = wallet.features[SolanaSignAndSendTransaction];
  if (!isRecord(feature)) {
    return undefined;
  }
  const signAndSendTransaction = feature.signAndSendTransaction;
  return isSignAndSendTransactionMethod(signAndSendTransaction) ? signAndSendTransaction : undefined;
}

function isSolanaWallet(wallet: StandardWallet): boolean {
  return (
    StandardConnect in wallet.features && wallet.chains.some((chain) => chain.startsWith("solana:"))
  );
}

function createConnector(wallet: StandardWallet): WalletConnector {
  const metadata: WalletConnectorMetadata = {
    id: wallet.name,
    name: wallet.name,
    icon: wallet.icon,
  };

  return {
    ...metadata,
    connect: async (options) => {
      const connect = getConnectMethod(wallet);
      const { accounts } = await connect(options?.silent ? { silent: true } : undefined);

      const account = accounts[0] ?? wallet.accounts[0];
      if (!account) throw new Error("No accounts available");

      const walletAccount = {
        address: address(account.address),
        publicKey: new Uint8Array(account.publicKey),
        label: account.label,
      };

      const disconnect = getDisconnectMethod(wallet);
      const signTransaction = getSignTransactionMethod(wallet);
      const signAndSendTransaction = getSignAndSendTransactionMethod(wallet);

      const session: WalletSession = {
        account: walletAccount,
        connector: metadata,
        disconnect: async () => {
          if (disconnect) {
            await disconnect();
          }
        },
        signTransaction: signTransaction
          ? async (transaction: Uint8Array, chain: SolanaChain) => {
              const [result] = await signTransaction({
                account,
                transaction,
                chain,
              });
              return new Uint8Array(result.signedTransaction);
            }
          : undefined,
        sendTransaction: signAndSendTransaction
          ? async (transaction: Uint8Array, chain: SolanaChain) => {
              const [result] = await signAndSendTransaction({
                account,
                transaction,
                chain,
              });
              return new Uint8Array(result.signature);
            }
          : undefined,
      };

      return session;
    },
  };
}

export function discoverWallets(): WalletConnector[] {
  const wallets = getWallets();
  return wallets.get().filter(isSolanaWallet).map(createConnector);
}

export function watchWallets(onChange: (connectors: WalletConnector[]) => void): () => void {
  const wallets = getWallets();

  function update() {
    onChange(wallets.get().filter(isSolanaWallet).map(createConnector));
  }

  const offRegister = wallets.on("register", update);
  const offUnregister = wallets.on("unregister", update);

  return () => {
    offRegister();
    offUnregister();
  };
}
