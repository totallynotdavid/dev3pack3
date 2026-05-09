import Link from "next/link";
import { type Contract } from "@/db/schema";
import { formatMoney } from "@/lib/utils.ts";
import { RiskBadge } from "./risk-badge.tsx";
import { ContractStatusBadge } from "./contract-status-badge.tsx";

interface ContractCardProps {
  contract: Contract;
}

export function ContractCard({ contract }: ContractCardProps) {
  const daysUntilDue = Math.floor(
    (new Date(contract.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Link href={`/marketplace/${contract.id}`}>
      <div className="rounded-lg border border-border bg-card p-6 transition hover:shadow-lg">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{contract.debtorName}</h3>
            <p className="text-sm text-muted-foreground">{contract.currency}</p>
          </div>
          <ContractStatusBadge status={contract.status} />
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Face Value</span>
            <span className="font-semibold">{formatMoney(contract.faceValue / 100)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Due in</span>
            <span className="font-semibold">{daysUntilDue} days</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge risk={contract.riskCategory} />
        </div>
      </div>
    </Link>
  );
}
