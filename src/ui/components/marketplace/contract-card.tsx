import Link from "next/link";
import { type Contract } from "@/db/schema";
import { formatMoney } from "@/lib/utils.ts";
import { RiskBadge } from "./risk-badge.tsx";
import { ContractStatusBadge } from "./contract-status-badge.tsx";
import { Icon } from "@/ui/components/shared/icon";

interface ContractCardProps {
  contract: Contract;
}

export function ContractCard({ contract }: ContractCardProps) {
  const daysUntilDue = Math.max(
    0,
    Math.floor(
      (new Date(contract.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <Link href={`/marketplace/${contract.id}`} className="group block">
      <article className="relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-6 shadow-soft transition-all duration-150 ease-sentinel hover:-translate-y-1 hover:border-border-strong hover:shadow-card">
        {/* Top — eyebrow + status */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {contract.currency} · {daysUntilDue}d
            </span>
          </div>
          <ContractStatusBadge status={contract.status} />
        </div>

        {/* Middle — debtor name in display type */}
        <h3 className="mb-1 font-display text-2xl leading-tight tracking-tighter text-foreground line-clamp-2">
          {contract.debtorName}
        </h3>
        <p className="mb-8 text-sm font-medium text-muted-foreground">
          Government receivable
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Numbers row */}
        <div className="mb-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Face Value
            </p>
            <p className="font-display text-2xl tracking-tighter text-foreground">
              {formatMoney(contract.faceValue / 100)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Due In
            </p>
            <p className="font-display text-2xl tracking-tighter text-foreground">
              {daysUntilDue}
              <span className="ml-1 text-sm font-medium font-sans text-muted-foreground">
                days
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <RiskBadge risk={contract.riskCategory} />
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            View
            <Icon
              icon="solar:arrow-right-linear"
              className="text-base transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </article>
    </Link>
  );
}
