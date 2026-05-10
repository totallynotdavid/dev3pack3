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
        <div key={offer.id} className="rounded-md border border-border bg-card p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Offer Amount
              </p>
              <p className="font-display text-3xl tracking-tighter text-foreground">
                {formatMoney(offer.amount / 100)}
              </p>
            </div>
            <OfferStatusBadge status={offer.status} />
          </div>

          {offer.counterAmount ? (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Counter Offer
              </p>
              <p className="font-display text-2xl tracking-tighter text-brand">
                {formatMoney(offer.counterAmount / 100)}
              </p>
            </div>
          ) : null}

          <p className="mt-4 text-xs font-medium text-muted-foreground">
            {new Date(offer.createdAt).toLocaleDateString()} ·{" "}
            {new Date(offer.createdAt).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
}
