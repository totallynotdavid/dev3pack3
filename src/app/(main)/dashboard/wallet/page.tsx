import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/ui/components/shared/page-header";
import { VaultCard } from "@/ui/components/solana/vault-card";

export default async function WalletPage() {
  const { userId } = await auth();
  if (!userId) return null;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-dot-grid opacity-60" />

      <div className="relative mx-auto max-w-[1100px] px-6 pb-24 pt-40 lg:px-12">
        <PageHeader
          eyebrow="Treasury"
          title={
            <>
              Your <span className="italic text-brand">wallet</span>.
            </>
          }
          description="Manage your Solana balance. Funds settle into escrow when offers are accepted."
        />

        {/* Solana Wallet */}
        <div className="mb-8">
          <VaultCard />
        </div>

      </div>
    </div>
  );
}
