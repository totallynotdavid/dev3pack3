import { Suspense } from "react";
import { ContractsList } from "./contracts-list";
import { SentinelHero } from "@/ui/components/marketplace/sentinel-hero";
import { Chatbot } from "@/ui/components/marketplace/chatbot";

export const metadata = {
  title: "Sentinel — Better Investment Decisions",
  description:
    "Buy government pending-payment contracts at the best rates. Secure negotiation, instant settlement.",
};

function ContractsLoadingSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-[260px] animate-pulse rounded-lg border border-border bg-card"
        />
      ))}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <>
      <SentinelHero />

      <section
        id="contracts"
        className="relative border-t border-border bg-background"
      >
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-28">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:mb-14 sm:gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2.5 w-2.5 bg-brand" aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Live Marketplace
                </span>
              </div>
              <h2 className="font-display text-4xl leading-[1.05] tracking-tighter text-foreground sm:text-5xl lg:text-6xl">
                Available <span className="italic text-brand">Contracts</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Each contract is verified, risk-graded, and held in escrow until
                settlement. Open an offer and negotiate directly with the seller.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Risk graded
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                Escrow protected
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8 xl:gap-12">
            <div className="min-w-0 flex-1">
              <Suspense fallback={<ContractsLoadingSkeleton />}>
                <ContractsList />
              </Suspense>
            </div>
            <aside className="w-full lg:w-[360px] xl:w-[400px] lg:flex-shrink-0">
              <div className="mb-5 flex items-center gap-3 lg:hidden">
                <span className="h-px flex-1 bg-border-strong" aria-hidden />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  AI Assistant
                </span>
                <span className="h-px flex-1 bg-border-strong" aria-hidden />
              </div>
              <div className="lg:sticky lg:top-8">
                <Chatbot />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
