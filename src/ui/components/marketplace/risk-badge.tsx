import { type RiskCategory } from "@/db/schema";

interface RiskBadgeProps {
  risk: RiskCategory;
}

const riskConfig: Record<RiskCategory, { label: string; dot: string; text: string; bg: string }> = {
  low: {
    label: "Low Risk",
    dot: "bg-success",
    text: "text-foreground",
    bg: "bg-secondary",
  },
  medium: {
    label: "Medium Risk",
    dot: "bg-brand",
    text: "text-foreground",
    bg: "bg-secondary",
  },
  high: {
    label: "High Risk",
    dot: "bg-destructive",
    text: "text-foreground",
    bg: "bg-secondary",
  },
};

export function RiskBadge({ risk }: RiskBadgeProps) {
  const config = riskConfig[risk] ?? riskConfig.medium;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border border-border ${config.bg} px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden />
      {config.label}
    </span>
  );
}
