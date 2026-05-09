import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, walletTransactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { WalletBalance } from "@/ui/components/marketplace/wallet-balance";
import { formatMoney } from "@/lib/utils";

async function getWalletData(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  const transactions = await db
    .select()
    .from(walletTransactions)
    .where(eq(walletTransactions.userId, userId))
    .orderBy(desc(walletTransactions.createdAt))
    .limit(20);

  return { user, transactions };
}

export default async function WalletPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const { user, transactions } = await getWalletData(userId);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Wallet</h1>

      {/* Wallet Balance Card */}
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-4xl font-bold">{formatMoney(user.walletBalance / 100)}</p>
        </div>
        <WalletBalance />
      </div>

      {/* Transaction History */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-2xl font-bold">Transaction History</h2>

        {transactions.length === 0 ? (
          <p className="text-muted-foreground">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-t pt-3 first:border-0 first:pt-0"
              >
                <div>
                  <p className="font-semibold capitalize">{tx.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className={`font-semibold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                  {tx.amount > 0 ? "+" : ""}
                  {formatMoney(Math.abs(tx.amount) / 100)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
