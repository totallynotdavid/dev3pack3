import Link from "next/link";
import { Icon } from "@/ui/components/shared/icon";
import { RadarCanvas } from "@/ui/components/shared/radar-canvas";

export function SentinelHero() {
  return (
    <section className="relative flex min-h-screen items-center pb-12 pt-24 lg:pb-0 lg:pt-0">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-16 px-6 lg:grid-cols-12 lg:gap-8 lg:px-12">
        {/* Left column — copy */}
        <div className="relative z-10 flex flex-col justify-center lg:col-span-5">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-2.5 w-2.5 bg-brand" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Smart Contract Trading
            </span>
          </div>

          <h1 className="mb-6 font-display text-5xl leading-[1.05] tracking-tighter text-foreground sm:text-6xl lg:text-[72px]">
            Insights Fuel <br />
            <span className="italic font-normal text-brand">Better</span> <br />
            Investment Decisions
          </h1>

          <p className="mb-10 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Buy government pending-payment contracts at the best rates. Negotiate
            securely with instant escrow settlement and live risk grading.
          </p>

          <div className="mb-14 flex flex-wrap items-center gap-4">
            <Link
              href="/marketplace#contracts"
              className="group flex items-center gap-2 rounded-md bg-foreground px-7 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-neutral-800"
            >
              Browse Contracts
              <Icon
                icon="solar:arrow-right-linear"
                className="text-lg transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/contracts/new"
              className="group flex items-center gap-2 rounded-md border border-border-strong bg-card px-7 py-3.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
            >
              Sell a Contract
              <Icon
                icon="solar:arrow-right-linear"
                className="text-lg text-muted-foreground transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <p className="flex items-start gap-3 text-sm font-medium text-muted-foreground">
            <Icon
              icon="solar:shield-check-linear"
              className="mt-0.5 shrink-0 text-xl text-muted-foreground"
            />
            Protecting working capital across global supply chains <br className="hidden sm:block" />
            and public-sector receivables.
          </p>
        </div>

        {/* Right column — graphic */}
        <div className="relative flex justify-center lg:col-span-7 lg:justify-end">
          <div
            className="relative flex aspect-[4/3] w-full max-w-[800px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-card shadow-soft bg-dot-grid"
          >
            {/* Decorative orange corner */}
            <div className="absolute bottom-0 right-0 z-0 h-1/2 w-1/2 translate-x-1/4 translate-y-1/4 rounded-tl-[4rem] bg-brand opacity-90" />
            <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-1/3 w-full bg-gradient-to-t from-card to-transparent" />

            {/* Top-left dots */}
            <div className="absolute left-12 top-12 z-0 grid grid-cols-4 gap-2 opacity-40">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="h-1 w-1 rounded-full bg-neutral-400" />
              ))}
            </div>

            {/* Central radar lens */}
            <div className="relative z-10 flex items-center justify-center">
              {/* Outer ring */}
              <div className="absolute h-[340px] w-[340px] rounded-full bg-secondary shadow-lens-inset sm:h-[480px] sm:w-[480px]" />

              {/* Middle raised ring */}
              <div className="absolute flex h-[280px] w-[280px] items-center justify-center rounded-full border border-border bg-card shadow-press sm:h-[380px] sm:w-[380px]">
                {/* Inner dark lens */}
                <div className="relative z-10 h-[210px] w-[210px] overflow-hidden rounded-full bg-[#18181b] shadow-lens-deep ring-4 ring-secondary sm:h-[280px] sm:w-[280px]">
                  <RadarCanvas />
                  {/* Crosshairs */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-px w-full bg-white/20" />
                    <div className="absolute h-full w-px bg-white/20" />
                    <div className="absolute h-3 w-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  </div>
                </div>
              </div>

              {/* Axis lines */}
              <div className="absolute z-0 h-[500px] w-px bg-border-strong" />
              <div className="absolute z-0 h-px w-[500px] bg-border-strong" />
            </div>

            {/* Floating card — top right */}
            <div className="absolute right-8 top-8 z-30 w-48 rounded-lg border border-border bg-card p-5 shadow-card sm:right-12 sm:top-12">
              <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
                Settlement Speed
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              </div>
              <svg
                className="mb-2 h-10 w-full overflow-visible"
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,25 Q10,15 20,20 T40,10 T60,25 T80,5 T100,15"
                  fill="none"
                  stroke="#FF5722"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M0,25 Q10,15 20,20 T40,10 T60,25 T80,5 T100,15 L100,30 L0,30 Z"
                  fill="url(#orange-fade)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="orange-fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5722" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-3xl font-medium tracking-tighter text-foreground">
                12s
              </div>
            </div>

            {/* Floating card — bottom left */}
            <div className="absolute bottom-8 left-8 z-30 w-56 rounded-lg border border-border bg-card p-5 shadow-card sm:bottom-12 sm:left-12">
              <div className="mb-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                Contracts Settled
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              </div>
              <div className="mb-4 flex h-10 items-end gap-1.5">
                {[30, 50, 40, 80, 60, 70, 50, 90].map((h, i) => (
                  <div
                    key={i}
                    className={`relative h-full w-full rounded-xs ${
                      h === 80 ? "bg-brand" : "bg-muted"
                    }`}
                    style={{ height: `${h}%` }}
                  >
                    {h === 80 && (
                      <span className="absolute -top-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-foreground" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-medium tracking-tighter text-foreground">
                  8,432
                </div>
                <div className="mb-1 flex items-center gap-1 text-xs font-medium text-brand">
                  <Icon icon="solar:arrow-up-linear" /> 24%
                </div>
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">
                vs previous month
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
