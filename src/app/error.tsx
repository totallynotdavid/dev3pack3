"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/ui/components/shared/icon";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Error]", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-60" />

      <div className="relative mx-auto max-w-xl rounded-lg border border-border bg-card p-10 text-center shadow-soft lg:p-14">
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="h-2.5 w-2.5 bg-destructive" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Unexpected Error
          </span>
        </div>

        <h1 className="font-display text-5xl leading-[1.05] tracking-tighter text-foreground sm:text-6xl">
          Something <span className="italic text-brand">broke</span>.
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          An unexpected error occurred. Try again, or head back to a known good place.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="group inline-flex items-center gap-2 rounded-md bg-foreground px-7 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-neutral-800"
          >
            Try again
            <Icon
              icon="solar:arrow-right-linear"
              className="text-lg transition-transform group-hover:translate-x-1"
            />
          </button>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-card px-7 py-3.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
          >
            Go to marketplace
          </Link>
        </div>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon icon="solar:arrow-left-linear" className="text-sm" />
          Go back
        </button>

        {error.digest ? (
          <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Error ID · {error.digest}
          </p>
        ) : null}
      </div>
    </div>
  );
}
