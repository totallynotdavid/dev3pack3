import Link from "next/link";
import { CopyrightText } from "./copyright-text";
import { Logo } from "./logo";

const footerLinks: { label: string; href: string }[] = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Sell a contract", href: "/contracts/new" },
  { label: "Wallet", href: "/dashboard/wallet" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm font-display text-2xl leading-tight tracking-tight text-foreground">
              Better business decisions, settled in{" "}
              <span className="italic text-brand">minutes</span>.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Network
              </p>
              <ul className="space-y-3 text-sm font-medium text-foreground">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-brand">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Trust
              </p>
              <ul className="space-y-3 text-sm font-medium text-foreground">
                <li>Escrow protected</li>
                <li>Real-time settlement</li>
                <li>Risk graded</li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Status
              </p>
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
                All systems operational
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs font-medium text-muted-foreground sm:flex-row sm:items-center">
          <p>
            <CopyrightText />
          </p>
          <p className="uppercase tracking-widest">Contract Trading Network</p>
        </div>
      </div>
    </footer>
  );
}
