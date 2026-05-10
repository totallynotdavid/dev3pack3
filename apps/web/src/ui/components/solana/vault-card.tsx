"use client";

import { useState } from "react";
import { useWallet } from "@/lib/solana/wallet/context";
import { useBalance } from "@/lib/solana/hooks/use-balance";
import { useVaultBalance } from "@/lib/solana/hooks/use-vault-balance";
import { useAirdrop } from "@/lib/solana/hooks/use-airdrop";
import { useVaultDeposit } from "@/lib/solana/hooks/use-vault-deposit";
import { useVaultWithdraw } from "@/lib/solana/hooks/use-vault-withdraw";
import { lamportsToSolString } from "@/lib/solana/lamports";
import { useCluster } from "@/lib/solana/cluster-context";
import { ellipsify } from "@/lib/solana/explorer";
import { Label } from "@/ui/components/ui/label";

export function VaultCard() {
  const { wallet, status } = useWallet();
  const { cluster } = useCluster();
  const balance = useBalance(wallet?.account.address);
  const vault = useVaultBalance(wallet?.account.address);
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
        <p className="text-sm text-muted-foreground">Connect your Solana wallet to manage funds</p>
      </div>
    );
  }

  const vaultLamports = vault.lamports ?? 0n;
  const vaultIsEmpty = vaultLamports === 0n;

  const handleAirdrop = async () => {
    await requestAirdrop(wallet.account.address, 1_000_000_000n);
  };

  const handleDeposit = async () => {
    const sol = parseFloat(depositAmount);
    if (isNaN(sol) || sol <= 0) return;
    await deposit(BigInt(Math.floor(sol * 1_000_000_000)));
    setDepositAmount("");
    await Promise.all([balance.mutate(), vault.mutate()]);
  };

  const handleWithdraw = async () => {
    await withdraw();
    await Promise.all([balance.mutate(), vault.mutate()]);
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

      {/* Balances */}
      <div className="mb-8 grid grid-cols-2 gap-6">
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Wallet</p>
          <p className="font-display text-3xl tracking-tighter text-foreground">
            {balance.lamports != null ? lamportsToSolString(balance.lamports, 4) : "—"}
            <span className="ml-1 text-base font-normal text-muted-foreground">SOL</span>
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Vault (locked)</p>
          <p className="font-display text-3xl tracking-tighter text-foreground">
            {vault.lamports != null ? lamportsToSolString(vault.lamports, 4) : "—"}
            <span className="ml-1 text-base font-normal text-muted-foreground">SOL</span>
          </p>
        </div>
      </div>
      <p className="mb-8 -mt-4 text-xs text-muted-foreground">on {cluster}</p>

      {/* Airdrop (devnet / testnet only) */}
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
        </div>
      )}

      {/* Vault operations */}
      <div className="space-y-4 border-t border-border pt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Vault
        </p>

        {vaultIsEmpty ? (
          <div>
            <Label htmlFor="vault-lock-amount" className="mb-2 block text-xs text-muted-foreground">
              Lock SOL as offer collateral
            </Label>
            <div className="flex gap-2">
              <input
                id="vault-lock-amount"
                type="number"
                step="0.01"
                min="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.00 SOL"
                className="flex-1 rounded-lg border border-border-strong bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
              />
              <button
                onClick={handleDeposit}
                disabled={isDepositing || !depositAmount || parseFloat(depositAmount) <= 0}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
              >
                {isDepositing ? "Locking..." : "Lock"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-xs text-muted-foreground">
              {lamportsToSolString(vaultLamports, 4)} SOL locked. Withdraw to release funds.
            </p>
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="w-full rounded-lg border border-border-strong bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-cream disabled:opacity-50"
            >
              {isWithdrawing ? "Withdrawing..." : "Withdraw All"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
