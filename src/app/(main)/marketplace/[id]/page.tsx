import sql, { type Contract, type Offer } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { RiskBadge } from "@/ui/components/marketplace/risk-badge";
import { ContractStatusBadge } from "@/ui/components/marketplace/contract-status-badge";
import { OfferForm } from "@/ui/components/marketplace/offer-form";
import { OfferList } from "@/ui/components/marketplace/offer-list";

async function getContract(id: string): Promise<Contract | null> {
	const result = await sql<Contract[]>`
    SELECT * FROM contracts WHERE id = ${id}
  `;
	return result.length > 0 ? result[0] : null;
}

async function getContractOffers(contractId: string): Promise<Offer[]> {
	return sql<Offer[]>`
    SELECT * FROM offers
    WHERE contract_id = ${contractId}
    ORDER BY created_at DESC
  `;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const contract = await getContract(id);

	return {
		title: contract
			? `${contract.debtor_name} - Contract Marketplace`
			: "Contract Not Found",
		description: contract
			? `${contract.debtor_name} - ${formatMoney(contract.face_value / 100)} ${contract.currency}`
			: "Contract details",
	};
}

export default async function ContractDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const contract = await getContract(id);

	if (!contract) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30 px-8 py-12 text-center">
					<h1 className="text-2xl font-bold">Contract Not Found</h1>
					<p className="mt-2 text-muted-foreground">This contract no longer exists or has been removed.</p>
				</div>
			</div>
		);
	}

	const offers = await getContractOffers(contract.id);
	const daysUntilDue = Math.floor(
		(new Date(contract.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
	);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid gap-8 lg:grid-cols-3">
				{/* Main Content */}
				<div className="lg:col-span-2">
					<div className="rounded-lg border border-border bg-card p-6">
						<div className="mb-6 flex items-start justify-between">
							<div>
								<h1 className="text-3xl font-bold">{contract.debtor_name}</h1>
								<p className="text-lg text-muted-foreground">{contract.currency}</p>
							</div>
							<ContractStatusBadge status={contract.status} />
						</div>

						<div className="mb-6 grid gap-4 md:grid-cols-2">
							<div>
								<p className="text-sm text-muted-foreground">Face Value</p>
								<p className="text-2xl font-semibold">{formatMoney(contract.face_value / 100)}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Due Date</p>
								<p className="text-2xl font-semibold">
									{new Date(contract.due_date).toLocaleDateString()} ({daysUntilDue} days)
								</p>
							</div>
						</div>

						<div className="mb-6 flex items-center gap-2">
							<RiskBadge risk={contract.risk_category} />
						</div>

						{contract.document_url && (
							<div className="rounded-lg bg-muted p-4">
								<p className="text-sm text-muted-foreground">Contract Document</p>
								<a
									href={contract.document_url}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-2 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
								>
									View Document
								</a>
							</div>
						)}
					</div>

					{/* Offers Section */}
					{offers.length > 0 && (
						<div className="mt-8">
							<h2 className="mb-4 text-2xl font-bold">Offers ({offers.length})</h2>
							<OfferList offers={offers} contractId={contract.id} />
						</div>
					)}
				</div>

				{/* Offer Form Sidebar */}
				<div>
					{contract.status === "active" || contract.status === "under_negotiation" ? (
						<div className="sticky top-20 rounded-lg border border-border bg-card p-6">
							<h2 className="mb-4 text-xl font-bold">Make an Offer</h2>
							<OfferForm contractId={contract.id} faceValue={contract.face_value} />
						</div>
					) : (
						<div className="sticky top-20 rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30 px-6 py-8 text-center">
							<p className="text-muted-foreground">This contract is no longer available for offers.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
