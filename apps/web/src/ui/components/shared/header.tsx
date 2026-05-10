"use client";

import { useState, useEffect } from "react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "./logo";
import { ClusterSelect } from "../solana/cluster-select";
import { WalletButton } from "../solana/wallet-button";

const publicItems = [{ label: "Marketplace", href: "/marketplace" }];

const authItems = [
  { label: "Sell", href: "/contracts/new" },
  { label: "Wallet", href: "/dashboard/wallet" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Header() {
  const { isSignedIn, isLoaded } = useAuth();
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <header className="absolute top-0 z-50 w-full">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-8 lg:px-12">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-10 text-sm font-medium text-muted-foreground md:flex">
          {publicItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          {authItems.map((item) =>
            isLoaded && isSignedIn ? (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.href}
                type="button"
                onClick={() => setToast(true)}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </button>
            ),
          )}
        </div>

        <div className="flex items-center gap-3">
          <ClusterSelect />
          <WalletButton />
          {isLoaded && isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-1 ring-border-strong",
                },
              }}
            />
          ) : (
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-sm bg-foreground px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-neutral-800"
              >
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </nav>

      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2">
          <div className="animate-in fade-in slide-in-from-bottom-2 flex items-center gap-3 rounded-lg border border-border-strong bg-card px-5 py-3.5 shadow-card">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <p className="text-sm font-medium text-foreground">
              You need to sign in to access this section.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
