import { Badge } from "@/ui/components/ui/badge";
import { type RiskCategory } from "@/db/schema";

interface RiskBadgeProps {
  risk: RiskCategory;
}

const riskConfig = {
  low: {
    label: "Low Risk",
    variant: "default" as const,
  },
  medium: {
    label: "Medium Risk",
    variant: "secondary" as const,
  },
  high: {
    label: "High Risk",
    variant: "destructive" as const,
  },
};

export function RiskBadge({ risk }: RiskBadgeProps) {
  const config = riskConfig[risk] ?? riskConfig.medium;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
