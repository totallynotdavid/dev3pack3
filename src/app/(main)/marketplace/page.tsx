import sql from "@/lib/db";
import { type Contract } from "@/lib/db";
import { ContractCard } from "@/ui/components/marketplace/contract-card";

async function getActiveContracts(): Promise<Contract[]> {
	const contracts = await sql<Contract[]>`
    SELECT * FROM contracts
    WHERE status = 'active'
    ORDER BY created_at DESC
    LIMIT 50
  `;

	return contracts;
}

export default async function MarketplacePage() {
	const contracts = await getActiveContracts();

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-4xl font-bold">Contract Marketplace</h1>
				<p className="mt-2 text-lg text-muted-foreground">
					Buy government contracts at the best rates. Secure negotiation with instant settlements.
				</p>
			</div>

			{contracts.length === 0 ? (
				<div className="rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30 px-8 py-12 text-center">
					<p className="text-lg text-muted-foreground">No contracts available yet. Check back soon!</p>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{contracts.map((contract) => (
						<ContractCard key={contract.id} contract={contract} />
					))}
				</div>
			)}
		</div>
	);
}
