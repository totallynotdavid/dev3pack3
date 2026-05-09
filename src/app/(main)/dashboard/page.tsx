import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { db } from "@/db";
import { users, contracts, offers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatMoney } from "@/lib/utils";
import { PageHeader } from "@/ui/components/shared/page-header";
import { Icon } from "@/ui/components/shared/icon";
import { OfferStatusBadge } from "@/ui/components/marketplace/offer-status-badge";
import { ContractStatusBadge } from "@/ui/components/marketplace/contract-status-badge";

async function getUserData(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  const myContracts = await db
    .select()
    .from(contracts)
    .where(eq(contracts.sellerId, userId))
    .orderBy(desc(contracts.createdAt))
    .limit(5);

  const myOffers = await db
    .select()
    .from(offers)
    .where(eq(offers.buyerId, userId))
    .orderBy(desc(offers.createdAt))
    .limit(5);

  return { user, myContracts, myOffers };
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const { user, myContracts, myOffers } = await getUserData(userId);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-dot-grid opacity-60" />

      <div className="relative mx-auto max-w-[1400px] px-6 pb-24 pt-40 lg:px-12">
        <PageHeader
          eyebrow="Operations"
          title={
            <>
              Welcome back, <span className="italic text-brand">{user.fullName?.split(" ")[0] || "trader"}</span>.
            </>
          }
          description="Track your contracts, monitor open offers, and manage settlement in one place."
          trailing={
            <Link
              href="/contracts/new"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-neutral-800"
            >
              Post Contract
              <Icon icon="solar:arrow-right-linear" className="text-lg" />
            </Link>
          }
        />

        {/* Wallet banner */}
        <div className="mb-12 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-8 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Wallet Balance
                </span>
              </div>
              <Link
                href="/dashboard/wallet"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Manage →
              </Link>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <p className="font-display text-6xl tracking-tighter text-foreground">
                {formatMoney(user.walletBalance / 100)}
              </p>
              <Link
                href="/dashboard/wallet"
                className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-card px-6 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-secondary"
              >
                <Icon icon="solar:wallet-money-linear" className="text-lg" />
                Top Up
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-8 shadow-soft">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Activity
              </span>
            </div>
            <dl className="space-y-4">
              <div className="flex items-baseline justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Contracts posted</dt>
                <dd className="font-display text-2xl tracking-tighter text-foreground">
                  {myContracts.length}
                </dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Offers made</dt>
                <dd className="font-display text-2xl tracking-tighter text-foreground">
                  {myOffers.length}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* My Contracts */}
          <section className="rounded-lg border border-border bg-card p-7 shadow-soft">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Sell Side
                  </span>
                </div>
                <h2 className="font-display text-3xl tracking-tighter text-foreground">
                  My Contracts
                </h2>
              </div>
              <Link
                href="/contracts/new"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Post new →
              </Link>
            </div>

            {myContracts.length === 0 ? (
              <p className="rounded-md border border-dashed border-border-strong bg-secondary px-5 py-8 text-center text-sm text-muted-foreground">
                No contracts posted yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {myContracts.map((contract) => (
                  <li key={contract.id}>
                    <Link
                      href={`/dashboard/contracts/${contract.id}`}
                      className="flex items-center justify-between py-4 transition-colors hover:bg-secondary/50"
                    >
                      <div>
                        <p className="font-display text-lg tracking-tighter text-foreground">
                          {contract.debtorName}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground">
                          {formatMoney(contract.faceValue / 100)} {contract.currency}
                        </p>
                      </div>
                      <ContractStatusBadge status={contract.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* My Offers */}
          <section className="rounded-lg border border-border bg-card p-7 shadow-soft">
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Buy Side
                </span>
              </div>
              <h2 className="font-display text-3xl tracking-tighter text-foreground">
                My Offers
              </h2>
            </div>

            {myOffers.length === 0 ? (
              <p className="rounded-md border border-dashed border-border-strong bg-secondary px-5 py-8 text-center text-sm text-muted-foreground">
                No offers made yet. Browse contracts to make an offer.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {myOffers.map((offer) => (
                  <li key={offer.id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-display text-lg tracking-tighter text-foreground">
                        {formatMoney(offer.amount / 100)}
                      </p>
                      {offer.counterAmount ? (
                        <p className="text-xs font-medium text-brand">
                          Counter {formatMoney(offer.counterAmount / 100)}
                        </p>
                      ) : (
                        <p className="text-xs font-medium text-muted-foreground">
                          {new Date(offer.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <OfferStatusBadge status={offer.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
