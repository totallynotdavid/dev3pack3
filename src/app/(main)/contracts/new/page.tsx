import { ContractForm } from "@/ui/components/marketplace/contract-form";

export const metadata = {
	title: "Post a Contract",
	description: "Sell your pending payment contracts",
};

export default function PostContractPage() {
	return (
		<div className="container mx-auto max-w-2xl px-4 py-8">
			<div className="mb-8">
				<h1 className="text-4xl font-bold">Post a Contract</h1>
				<p className="mt-2 text-lg text-muted-foreground">
					List your government pending payment contract for investors to purchase.
				</p>
			</div>

			<div className="rounded-lg border border-border bg-card p-6">
				<ContractForm />
			</div>
		</div>
	);
}
