import { type Offer } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { OfferStatusBadge } from "./offer-status-badge";

interface OfferListProps {
	offers: Offer[];
	contractId?: string;
}

export function OfferList({ offers }: OfferListProps) {
	return (
		<div className="space-y-3">
			{offers.map((offer) => (
				<div key={offer.id} className="rounded-lg border border-border bg-card p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Offer Amount</p>
							<p className="text-lg font-semibold">{formatMoney(offer.amount / 100)}</p>
						</div>
						<OfferStatusBadge status={offer.status} />
					</div>

					{offer.counter_amount && (
						<div className="mt-3 pt-3 border-t">
							<p className="text-sm text-muted-foreground">Counter Offer</p>
							<p className="text-lg font-semibold text-orange-600">{formatMoney(offer.counter_amount / 100)}</p>
						</div>
					)}

					<p className="mt-3 text-xs text-muted-foreground">
						{new Date(offer.created_at).toLocaleDateString()} at {new Date(offer.created_at).toLocaleTimeString()}
					</p>
				</div>
			))}
		</div>
	);
}
