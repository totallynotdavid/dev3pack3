import { type OfferStatus } from "@/db/schema";

interface OfferStatusBadgeProps {
  status: OfferStatus;
}

const statusConfig: Record<OfferStatus, { label: string; dot: string }> = {
  pending: { label: "Pending", dot: "bg-foreground" },
  countered: { label: "Countered", dot: "bg-brand" },
  accepted: { label: "Accepted", dot: "bg-success" },
  rejected: { label: "Rejected", dot: "bg-destructive" },
  expired: { label: "Expired", dot: "bg-neutral-400" },
  withdrawn: { label: "Withdrawn", dot: "bg-neutral-300" },
};

export function OfferStatusBadge({ status }: OfferStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-card px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-foreground">
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden />
      {config.label}
    </span>
  );
}
