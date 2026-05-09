import { ContractForm } from "@/ui/components/marketplace/contract-form";
import { PageHeader } from "@/ui/components/shared/page-header";
import { Icon } from "@/ui/components/shared/icon";

export const metadata = {
  title: "Post a contract",
  description: "Sell your government pending payment contracts.",
};

export default function PostContractPage() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-dot-grid opacity-60" />

      <div className="relative mx-auto max-w-[900px] px-6 pb-24 pt-40 lg:px-12">
        <PageHeader
          eyebrow="Sell Side"
          title={
            <>
              Post a <span className="italic text-brand">contract</span>.
            </>
          }
          description="List a government pending-payment receivable for verified investors."
        />

        <div className="rounded-lg border border-border bg-card p-8 shadow-soft lg:p-10">
          <ContractForm />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {(
            [
              { icon: "solar:shield-check-linear", label: "Escrow Protected" },
              { icon: "solar:graph-up-linear", label: "Risk Graded" },
              { icon: "solar:bolt-linear", label: "Instant Settlement" },
            ] as const
          ).map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-md border border-border bg-card px-5 py-4 shadow-sm"
            >
              <Icon icon={item.icon} className="text-xl text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
