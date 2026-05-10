import Link from "next/link";
import { Icon } from "@/ui/components/shared/icon";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-60" />

      <div className="relative mx-auto max-w-xl rounded-lg border border-border bg-card p-10 text-center shadow-soft lg:p-14">
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="h-2.5 w-2.5 bg-brand" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Error 404
          </span>
        </div>

        <h1 className="font-display text-5xl leading-[1.05] tracking-tighter text-foreground sm:text-6xl">
          Page <span className="italic text-brand">not found</span>.
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/marketplace"
            className="group inline-flex items-center gap-2 rounded-md bg-foreground px-7 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-neutral-800"
          >
            Go to marketplace
            <Icon
              icon="solar:arrow-right-linear"
              className="text-lg transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-card px-7 py-3.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
