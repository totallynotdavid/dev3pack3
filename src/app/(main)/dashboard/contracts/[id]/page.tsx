import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { contracts, offers, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatMoney } from "@/lib/utils";
import { Icon } from "@/ui/components/shared/icon";
import { RiskBadge } from "@/ui/components/marketplace/risk-badge";
import { ContractStatusBadge } from "@/ui/components/marketplace/contract-status-badge";
import { OfferStatusBadge } from "@/ui/components/marketplace/offer-status-badge";
import { SellerOfferActions } from "@/ui/components/marketplace/seller-offer-actions";

async function getContractWithOffers(contractId: string, sellerId: string) {
  const [contract] = await db
    .select()
    .from(contracts)
    .where(eq(contracts.id, contractId));

  if (!contract || contract.sellerId !== sellerId) return null;

  const contractOffers = await db
    .select({
      id: offers.id,
      amount: offers.amount,
      currency: offers.currency,
      counterAmount: offers.counterAmount,
      status: offers.status,
      expiresAt: offers.expiresAt,
      createdAt: offers.createdAt,
      buyerName: users.fullName,
      buyerEmail: users.email,
    })
    .from(offers)
    .leftJoin(users, eq(offers.buyerId, users.id))
    .where(eq(offers.contractId, contractId))
    .orderBy(desc(offers.createdAt));

  return { contract, offers: contractOffers };
}

export default async function SellerContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const data = await getContractWithOffers(id, userId);

  if (!data) notFound();

  const { contract, offers: offerList } = data;

  const daysUntilDue = Math.max(
    0,
    Math.floor((new Date(contract.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );

  const pendingOffers = offerList.filter(
    (o) => o.status === "pending" || o.status === "countered",
  );

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-dot-grid opacity-60" />

      <div className="relative mx-auto max-w-[1400px] px-6 pb-24 pt-40 lg:px-12">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon icon="solar:arrow-left-linear" className="text-base" />
          My Dashboard
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: contract details */}
          <div className="lg:col-span-2 space-y-8">
            <article className="rounded-lg border border-border bg-card p-8 shadow-soft lg:p-10">
              <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Your contract · {contract.currency}
                    </span>
                  </div>
                  <h1 className="font-display text-4xl leading-[1.05] tracking-tighter text-foreground sm:text-5xl">
                    {contract.debtorName}
                  </h1>
                </div>
                <ContractStatusBadge status={contract.status} />
              </div>

              <div className="mb-8 grid gap-6 border-t border-border pt-8 md:grid-cols-3">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Face Value
                  </p>
                  <p className="font-display text-4xl tracking-tighter text-foreground">
                    {formatMoney(contract.faceValue / 100)}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Due Date
                  </p>
                  <p className="font-display text-2xl tracking-tighter text-foreground">
                    {new Date(contract.dueDate).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {daysUntilDue} days from today
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Risk
                  </p>
                  <RiskBadge risk={contract.riskCategory} />
                </div>
              </div>

              {contract.documentUrl ? (
                <div className="rounded-md border border-border bg-secondary p-5">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Contract Document
                  </p>
                  <a
                    href={contract.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
                  >
                    <Icon icon="solar:document-linear" className="text-lg" />
                    View document
                  </a>
                </div>
              ) : null}
            </article>

            {/* Offers section */}
            <section>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Incoming
                    </span>
                  </div>
                  <h2 className="font-display text-3xl tracking-tighter text-foreground">
                    Offers{" "}
                    <span className="text-muted-foreground">({offerList.length})</span>
                  </h2>
                </div>
                {pendingOffers.length > 0 && (
                  <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                    {pendingOffers.length} pending
                  </span>
                )}
              </div>

              {offerList.length === 0 ? (
                <p className="rounded-md border border-dashed border-border-strong bg-secondary px-5 py-10 text-center text-sm text-muted-foreground">
                  No offers yet. Your contract is visible in the marketplace.
                </p>
              ) : (
                <div className="space-y-4">
                  {offerList.map((offer) => {
                    const canAct =
                      (offer.status === "pending" || offer.status === "countered") &&
                      contract.status !== "sold" &&
                      contract.status !== "cancelled";

                    return (
                      <div
                        key={offer.id}
                        className="rounded-lg border border-border bg-card p-6 shadow-soft"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                              Offer Amount
                            </p>
                            <p className="font-display text-3xl tracking-tighter text-foreground">
                              {formatMoney(offer.amount / 100)}{" "}
                              <span className="text-lg text-muted-foreground">
                                {offer.currency}
                              </span>
                            </p>
                            {offer.buyerName && (
                              <p className="mt-1 text-xs font-medium text-muted-foreground">
                                from {offer.buyerName}
                              </p>
                            )}
                          </div>
                          <OfferStatusBadge status={offer.status} />
                        </div>

                        {offer.counterAmount ? (
                          <div className="mt-4 border-t border-border pt-4">
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                              Your Counter
                            </p>
                            <p className="font-display text-2xl tracking-tighter text-brand">
                              {formatMoney(offer.counterAmount / 100)}
                            </p>
                          </div>
                        ) : null}

                        <p className="mt-3 text-xs text-muted-foreground">
                          Received{" "}
                          {new Date(offer.createdAt).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · expires{" "}
                          {new Date(offer.expiresAt).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>

                        {canAct && (
                          <SellerOfferActions
                            contractId={contract.id}
                            offerId={offer.id}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right: summary panel */}
          <aside>
            <div className="sticky top-32 space-y-4">
              <div className="rounded-lg border border-border bg-card p-7 shadow-soft">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Summary
                  </span>
                </div>
                <dl className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Total offers</dt>
                    <dd className="font-display text-2xl tracking-tighter text-foreground">
                      {offerList.length}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Pending</dt>
                    <dd className="font-display text-2xl tracking-tighter text-foreground">
                      {pendingOffers.length}
                    </dd>
                  </div>
                  {offerList.length > 0 && (
                    <div className="flex items-baseline justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Best offer</dt>
                      <dd className="font-display text-xl tracking-tighter text-brand">
                        {formatMoney(Math.max(...offerList.map((o) => o.amount)) / 100)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <Link
                href="/marketplace"
                className="flex items-center justify-between rounded-lg border border-border bg-card px-6 py-4 text-sm font-medium text-muted-foreground shadow-soft transition-colors hover:bg-secondary hover:text-foreground"
              >
                View in marketplace
                <Icon icon="solar:arrow-right-up-linear" className="text-base" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
