import { db } from "@/db";
import { type Contract, type Offer } from "@/db/schema";
import { contracts, offers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import { RiskBadge } from "@/ui/components/marketplace/risk-badge";
import { ContractStatusBadge } from "@/ui/components/marketplace/contract-status-badge";
import { OfferForm } from "@/ui/components/marketplace/offer-form";
import { OfferList } from "@/ui/components/marketplace/offer-list";
import { Icon } from "@/ui/components/shared/icon";

async function getContract(id: string): Promise<Contract | null> {
  const result = await db.select().from(contracts).where(eq(contracts.id, id));
  return result.length > 0 ? result[0] : null;
}

async function getContractOffers(contractId: string): Promise<Offer[]> {
  return db
    .select()
    .from(offers)
    .where(eq(offers.contractId, contractId))
    .orderBy(desc(offers.createdAt));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = await getContract(id);

  return {
    title: contract ? `${contract.debtorName} — Sentinel` : "Contract Not Found",
    description: contract
      ? `${contract.debtorName} · ${formatMoney(contract.faceValue / 100)} ${contract.currency}`
      : "Contract details",
  };
}

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = await getContract(id);

  if (!contract) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-40 lg:px-12">
        <div className="rounded-lg border border-border bg-card px-8 py-16 text-center shadow-soft">
          <h1 className="font-display text-4xl tracking-tighter text-foreground">
            Contract not found
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            This contract no longer exists or has been removed.
          </p>
          <Link
            href="/marketplace"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-foreground px-7 py-3.5 text-sm font-medium text-primary-foreground hover:bg-neutral-800"
          >
            Back to marketplace
            <Icon icon="solar:arrow-right-linear" className="text-lg" />
          </Link>
        </div>
      </div>
    );
  }

  const offerList = await getContractOffers(contract.id);
  const daysUntilDue = Math.max(
    0,
    Math.floor((new Date(contract.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );

  const isOpen = contract.status === "active" || contract.status === "under_negotiation";

  return (
    <div className="relative">
      {/* Decorative dotted background band */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-dot-grid opacity-60" />

      <div className="relative mx-auto max-w-[1400px] px-6 pb-24 pt-40 lg:px-12">
        <Link
          href="/marketplace"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon icon="solar:arrow-left-linear" className="text-base" />
          All contracts
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Hero card */}
            <article className="rounded-lg border border-border bg-card p-8 shadow-soft lg:p-10">
              <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Government receivable · {contract.currency}
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

            {offerList.length > 0 ? (
              <div className="mt-10">
                <div className="mb-6 flex items-end justify-between">
                  <h2 className="font-display text-3xl tracking-tighter text-foreground">
                    Offers <span className="text-muted-foreground">({offerList.length})</span>
                  </h2>
                </div>
                <OfferList offers={offerList} contractId={contract.id} />
              </div>
            ) : null}
          </div>

          {/* Sticky offer panel */}
          <aside>
            {isOpen ? (
              <div className="sticky top-32 rounded-lg border border-border bg-card p-7 shadow-card">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Make an Offer
                  </span>
                </div>
                <h2 className="mb-6 font-display text-3xl leading-tight tracking-tighter text-foreground">
                  Negotiate <span className="italic text-brand">directly</span>.
                </h2>
                <OfferForm contractId={contract.id} faceValue={contract.faceValue} />
              </div>
            ) : (
              <div className="sticky top-32 rounded-lg border border-border bg-card p-7 text-center shadow-soft">
                <p className="font-display text-xl text-foreground">No longer accepting offers</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  This contract is currently {contract.status.replace(/_/g, " ")}.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
