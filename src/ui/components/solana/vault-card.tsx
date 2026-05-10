"use client";

import { useState } from "react";
import { useWallet } from "@/lib/solana/wallet/context";
import { useBalance } from "@/lib/solana/hooks/use-balance";
import { useAirdrop } from "@/lib/solana/hooks/use-airdrop";
import { useVaultDeposit } from "@/lib/solana/hooks/use-vault-deposit";
import { useVaultWithdraw } from "@/lib/solana/hooks/use-vault-withdraw";
import { lamportsToSolString } from "@/lib/solana/lamports";
import { useCluster } from "@/lib/solana/cluster-context";
import { ellipsify } from "@/lib/solana/explorer";

export function VaultCard() {
  const { wallet, status } = useWallet();
  const { cluster } = useCluster();
  const balance = useBalance(wallet?.account.address);
  const { requestAirdrop, isAirdropping } = useAirdrop();
  const { deposit, isDepositing } = useVaultDeposit();
  const { withdraw, isWithdrawing } = useVaultWithdraw();
  const [depositAmount, setDepositAmount] = useState("");

  if (status !== "connected" || !wallet) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 shadow-soft">
        <div className="mb-6 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Solana Wallet
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Connect your Solana wallet to manage crypto assets
        </p>
      </div>
    );
  }

  const handleAirdrop = async () => {
    if (!wallet) return;
    await requestAirdrop(wallet.account.address, 1_000_000_000n); // 1 SOL
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    const lamports = BigInt(Math.floor(amount * 1_000_000_000));
    await deposit(lamports);
    setDepositAmount("");
  };

  return (
    <div className="rounded-lg border border-border bg-card p-8 shadow-soft">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Solana Wallet
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-mono text-muted-foreground">
            {ellipsify(wallet.account.address, 4)}
          </span>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-8">
        <p className="mb-1 text-xs text-muted-foreground">Wallet Balance</p>
        <p className="font-display text-5xl tracking-tighter text-foreground">
          {balance.lamports != null ? lamportsToSolString(balance.lamports, 4) : "—"}
          <span className="ml-2 text-2xl font-normal text-muted-foreground">SOL</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">on {cluster}</p>
      </div>

      {/* Airdrop (only on devnet/testnet/localnet) */}
      {cluster !== "mainnet" && (
        <div className="mb-6 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
          <p className="mb-3 text-xs font-medium text-foreground">Test Network Faucet</p>
          <button
            onClick={handleAirdrop}
            disabled={isAirdropping}
            className="w-full rounded-lg border border-border-strong bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-cream disabled:opacity-50"
          >
            {isAirdropping ? "Requesting..." : "Request 1 SOL Airdrop"}
          </button>
          <p className="mt-2 text-xs text-muted-foreground">Get test SOL for development</p>
        </div>
      )}

      {/* Vault Operations */}
      <div className="space-y-4 border-t border-border pt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Vault Operations
        </p>

        {/* Deposit */}
        <div>
          <label className="mb-2 block text-xs text-muted-foreground">Deposit to Vault</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 rounded-lg border border-border-strong bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
            />
            <button
              onClick={handleDeposit}
              disabled={isDepositing || !depositAmount || parseFloat(depositAmount) <= 0}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {isDepositing ? "Depositing..." : "Deposit"}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Lock SOL in vault for offers</p>
        </div>

        {/* Withdraw */}
        <div>
          <button
            onClick={withdraw}
            disabled={isWithdrawing}
            className="w-full rounded-lg border border-border-strong bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-cream disabled:opacity-50"
          >
            {isWithdrawing ? "Withdrawing..." : "Withdraw All from Vault"}
          </button>
          <p className="mt-1 text-xs text-muted-foreground">
            Withdraw all SOL from vault to wallet
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 rounded-lg border border-dashed border-border-strong bg-secondary p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> Vault operations are currently in development. The deposit/withdraw
          functions will be available once the Anchor program is deployed to {cluster}.
        </p>
      </div>
    </div>
  );
}
