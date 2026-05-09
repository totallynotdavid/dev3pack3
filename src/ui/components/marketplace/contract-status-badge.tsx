import { type ContractStatus } from "@/db/schema";

interface ContractStatusBadgeProps {
  status: ContractStatus;
}

const statusConfig: Record<ContractStatus, { label: string; dot: string; bg: string; text: string }> = {
  active: {
    label: "Active",
    dot: "bg-brand",
    bg: "bg-card",
    text: "text-foreground",
  },
  under_negotiation: {
    label: "Negotiating",
    dot: "bg-foreground",
    bg: "bg-card",
    text: "text-foreground",
  },
  sold: {
    label: "Sold",
    dot: "bg-success",
    bg: "bg-card",
    text: "text-foreground",
  },
  expired: {
    label: "Expired",
    dot: "bg-destructive",
    bg: "bg-card",
    text: "text-muted-foreground",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-neutral-300",
    bg: "bg-card",
    text: "text-muted-foreground",
  },
};

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border border-border ${config.bg} px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden />
      {config.label}
    </span>
  );
}
