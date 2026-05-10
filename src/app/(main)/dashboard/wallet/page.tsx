import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, walletTransactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { WalletBalance } from "@/ui/components/marketplace/wallet-balance";
import { formatMoney } from "@/lib/utils";
import { PageHeader } from "@/ui/components/shared/page-header";
import { VaultCard } from "@/ui/components/solana/vault-card";

export default async function WalletPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  const transactions = await db
    .select()
    .from(walletTransactions)
    .where(eq(walletTransactions.userId, userId))
    .orderBy(desc(walletTransactions.createdAt))
    .limit(20);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-dot-grid opacity-60" />

      <div className="relative mx-auto max-w-[1100px] px-6 pb-24 pt-40 lg:px-12">
        <PageHeader
          eyebrow="Treasury"
          title={
            <>
              Your <span className="italic text-brand">wallet</span>.
            </>
          }
          description="Manage fiat (Stripe) and crypto (Solana) balances. Funds settle into escrow when offers are accepted."
        />

        {/* Solana Wallet */}
        <div className="mb-8">
          <VaultCard />
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Balance + deposit */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-border bg-card p-8 shadow-soft">
              <div className="mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Current Balance
                </span>
              </div>
              <p className="mb-10 font-display text-7xl tracking-tighter text-foreground">
                {formatMoney(user.walletBalance / 100)}
              </p>

              <div className="border-t border-border pt-8">
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Deposit
                </p>
                <WalletBalance />
              </div>
            </div>
          </div>

          {/* Transaction history */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border bg-card p-7 shadow-soft">
              <div className="mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Activity
                </span>
              </div>

              {transactions.length === 0 ? (
                <p className="rounded-md border border-dashed border-border-strong bg-secondary px-5 py-8 text-center text-sm text-muted-foreground">
                  No transactions yet.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <li key={tx.id} className="flex items-center justify-between py-3.5">
                      <div>
                        <p className="text-sm font-medium capitalize text-foreground">{tx.type}</p>
                        <p className="text-xs font-medium text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p
                        className={`font-display text-lg tracking-tighter ${
                          tx.amount > 0 ? "text-success" : "text-foreground"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : "−"}
                        {formatMoney(Math.abs(tx.amount) / 100)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
