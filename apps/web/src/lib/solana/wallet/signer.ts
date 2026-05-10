import {
  getTransactionEncoder,
  getTransactionDecoder,
  signatureBytes,
  assertIsTransactionWithinSizeLimit,
  type Transaction,
  type TransactionWithLifetime,
  type TransactionSigner,
  type TransactionSendingSigner,
  type TransactionModifyingSigner,
} from "@solana/kit";
import type { SolanaChain, WalletSession } from "./types";

type SignableTransaction = Transaction | (Transaction & TransactionWithLifetime);

function encodeTransaction(tx: SignableTransaction): Uint8Array {
  const encoded = getTransactionEncoder().encode(tx);
  return new Uint8Array(encoded.buffer, encoded.byteOffset, encoded.byteLength);
}

function createSendingSigner(session: WalletSession, chain: SolanaChain): TransactionSendingSigner {
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
function createModifyingSigner(
  session: WalletSession,
  chain: SolanaChain,
): TransactionModifyingSigner {
  const decoder = getTransactionDecoder();
  return {
    address: session.account.address,
    modifyAndSignTransactions: async (transactions) =>
      Promise.all(
        transactions.map(async (tx) => {
          if (!("lifetimeConstraint" in tx)) {
            throw new Error("Wallet signer requires transaction lifetime constraint");
          }
          const signedBytes = await session.signTransaction!(encodeTransaction(tx), chain);
          const signedTx = decoder.decode(signedBytes);
          assertIsTransactionWithinSizeLimit(signedTx);
          return Object.freeze({
            ...signedTx,
            lifetimeConstraint: tx.lifetimeConstraint,
          });
        }),
      ),
  };
}

export function createWalletSigner(session: WalletSession, chain: SolanaChain): TransactionSigner {
  if (session.signTransaction) {
    return createModifyingSigner(session, chain);
  }
  if (session.sendTransaction) {
    return createSendingSigner(session, chain);
  }
  throw new Error("Wallet does not support transaction signing");
}
