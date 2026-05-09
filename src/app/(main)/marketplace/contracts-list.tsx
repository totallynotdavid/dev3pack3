import { getActiveContracts } from "@/lib/db/queries/contracts";
import { ContractCard } from "@/ui/components/marketplace/contract-card";

export async function ContractsList() {
  const contracts = await getActiveContracts();

  if (contracts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30 px-8 py-12 text-center">
        <p className="text-lg text-muted-foreground">
          No contracts available yet. Check back soon!
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
