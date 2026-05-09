import { Badge } from "@/ui/components/ui/badge";
import { type OfferStatus } from "@/db/schema";

interface OfferStatusBadgeProps {
  status: OfferStatus;
}

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "secondary" as const,
  },
  countered: {
    label: "Countered",
    variant: "secondary" as const,
  },
  accepted: {
    label: "Accepted",
    variant: "default" as const,
  },
  rejected: {
    label: "Rejected",
    variant: "destructive" as const,
  },
  expired: {
    label: "Expired",
    variant: "destructive" as const,
  },
  withdrawn: {
    label: "Withdrawn",
    variant: "outline-solid" as const,
  },
};

export function OfferStatusBadge({ status }: OfferStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
