import { getActiveContracts } from "@/lib/db/queries/contracts";
import { ContractCard } from "@/ui/components/marketplace/contract-card";

export async function ContractsList() {
  const contracts = await getActiveContracts();

  if (contracts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card px-8 py-16 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <span className="h-2.5 w-2.5 bg-brand" aria-hidden />
        </div>
        <p className="font-display text-2xl text-foreground">
          No contracts available yet.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          New listings appear here as soon as sellers post them.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {contracts.map((contract) => (
        <ContractCard key={contract.id} contract={contract} />
      ))}
    </div>
  );
}
