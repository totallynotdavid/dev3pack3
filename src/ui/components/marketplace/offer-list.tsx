import { type Offer } from "@/db/schema";
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

          {offer.counterAmount && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-muted-foreground">Counter Offer</p>
              <p className="text-lg font-semibold text-orange-600">
                {formatMoney(offer.counterAmount / 100)}
              </p>
            </div>
          )}

          <p className="mt-3 text-xs text-muted-foreground">
            {new Date(offer.createdAt).toLocaleDateString()} at{" "}
            {new Date(offer.createdAt).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
}
