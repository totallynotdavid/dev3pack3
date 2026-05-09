import { Suspense } from "react";
import { ContractsList } from "./contracts-list";

function ContractsLoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Contract Marketplace</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Buy government contracts at the best rates. Secure negotiation with instant settlements.
        </p>
      </div>

      <Suspense fallback={<ContractsLoadingSkeleton />}>
        <ContractsList />
      </Suspense>
    </div>
  );
}
