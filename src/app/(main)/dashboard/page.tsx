import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import sql from "@/lib/db";
import { type User, type Contract, type Offer } from "@/lib/db";
import { Button } from "@/ui/components/ui/button";
import { formatMoney } from "@/lib/utils";

async function getUserData(userId: string) {
  const users = await sql<User[]>`SELECT * FROM users WHERE id = ${userId}`;
  const user = users[0];

  const myContracts = await sql<Contract[]>`
    SELECT * FROM contracts WHERE seller_id = ${userId} ORDER BY created_at DESC LIMIT 5
  `;

  const myOffers = await sql<Offer[]>`
    SELECT * FROM offers WHERE buyer_id = ${userId} ORDER BY created_at DESC LIMIT 5
  `;

  return { user, myContracts, myOffers };
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const { user, myContracts, myOffers } = await getUserData(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Welcome back, {user.full_name || "User"}!
        </p>
      </div>

      {/* Wallet Balance Card */}
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Wallet Balance</p>
            <p className="text-3xl font-bold">{formatMoney(user.wallet_balance / 100)}</p>
          </div>
          <div className="flex items-end">
            <Button asChild>
              <Link href="/dashboard/wallet">Top Up Wallet</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* My Contracts */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Contracts ({myContracts.length})</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/contracts/new">Post New</Link>
            </Button>
          </div>

          {myContracts.length === 0 ? (
            <p className="text-muted-foreground">No contracts posted yet.</p>
          ) : (
            <div className="space-y-3">
              {myContracts.map((contract) => (
                <Link key={contract.id} href={`/marketplace/${contract.id}`}>
                  <div className="rounded border border-border/50 p-3 hover:bg-muted">
                    <p className="font-semibold">{contract.debtor_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatMoney(contract.face_value / 100)} {contract.currency}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Offers */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-bold">My Offers ({myOffers.length})</h2>

          {myOffers.length === 0 ? (
            <p className="text-muted-foreground">
              No offers made yet. Browse contracts to make an offer.
            </p>
          ) : (
            <div className="space-y-3">
              {myOffers.map((offer) => (
                <div key={offer.id} className="rounded border border-border/50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Offer: {formatMoney(offer.amount / 100)}</p>
                      <p className="text-sm text-muted-foreground capitalize">{offer.status}</p>
                    </div>
                    {offer.counter_amount && (
                      <p className="text-orange-600">
                        Counter: {formatMoney(offer.counter_amount / 100)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
