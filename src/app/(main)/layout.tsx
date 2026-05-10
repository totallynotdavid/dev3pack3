import { Header } from "@/ui/components/shared/header";
import { Footer } from "@/ui/components/shared/footer";
import { SolanaProviders } from "@/lib/solana/providers";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SolanaProviders>
      <div className="relative flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SolanaProviders>
  );
}
