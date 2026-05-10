import {
  getTransactionEncoder,
  getTransactionDecoder,
  signatureBytes,
  assertIsTransactionWithinSizeLimit,
  type Transaction,
  type TransactionWithLifetime,
  type TransactionWithinSizeLimit,
  type TransactionSigner,
  type TransactionSendingSigner,
  type TransactionModifyingSigner,
} from "@solana/kit";
import type { WalletSession } from "./types";

type SignableTransaction = Transaction | (Transaction & TransactionWithLifetime);

function encodeTransaction(tx: SignableTransaction): Uint8Array {
  const encoded = getTransactionEncoder().encode(tx);
  return new Uint8Array(encoded.buffer, encoded.byteOffset, encoded.byteLength);
}

function createSendingSigner(session: WalletSession, chain: string): TransactionSendingSigner {
  return {
    address: session.account.address,
    signAndSendTransactions: async (transactions) =>
      Promise.all(
        transactions.map(async (tx) => {
          const sigBytes = await session.sendTransaction!(encodeTransaction(tx), chain);
          return signatureBytes(sigBytes);
        }),
      ),
  };
}

/**
 * Uses TransactionModifyingSigner so the full signed transaction returned
 * by the wallet is preserved. This is critical because wallet-standard
 * signTransaction may return a modified transaction (e.g. added memo,
 * changed compute budget). Extracting only signatures and applying them
 * to the original message would cause a signature/message mismatch.
 */
function createModifyingSigner(session: WalletSession, chain: string): TransactionModifyingSigner {
  const decoder = getTransactionDecoder();
  return {
    address: session.account.address,
    modifyAndSignTransactions: async (transactions) =>
      Promise.all(
        transactions.map(async (tx) => {
          const signedBytes = await session.signTransaction!(encodeTransaction(tx), chain);
          const signedTx = decoder.decode(signedBytes);
          assertIsTransactionWithinSizeLimit(signedTx);
          const lifetimeConstraint =
            "lifetimeConstraint" in tx ? { lifetimeConstraint: tx.lifetimeConstraint } : {};
          return Object.freeze({
            ...signedTx,
            ...lifetimeConstraint,
          }) as Transaction & TransactionWithinSizeLimit & TransactionWithLifetime;
        }),
      ),
  };
}

export function createWalletSigner(session: WalletSession, chain: string): TransactionSigner {
  if (session.signTransaction) {
    return createModifyingSigner(session, chain);
  }
  if (session.sendTransaction) {
    return createSendingSigner(session, chain);
  }
  throw new Error("Wallet does not support transaction signing");
}
