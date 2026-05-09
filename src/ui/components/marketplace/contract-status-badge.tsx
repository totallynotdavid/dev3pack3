import { Badge } from "@/ui/components/ui/badge";
import { type ContractStatus } from "@/lib/db";

interface ContractStatusBadgeProps {
  status: ContractStatus;
}

const statusConfig = {
  active: {
    label: "Active",
    variant: "default" as const,
  },
  under_negotiation: {
    label: "Negotiating",
    variant: "secondary" as const,
  },
  sold: {
    label: "Sold",
    variant: "default" as const,
  },
  expired: {
    label: "Expired",
    variant: "destructive" as const,
  },
  cancelled: {
    label: "Cancelled",
    variant: "outline-solid" as const,
  },
};

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
