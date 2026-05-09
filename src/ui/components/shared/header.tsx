"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "./logo";

const navItems: { label: string; href: string }[] = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Sell", href: "/contracts/new" },
  { label: "Wallet", href: "/dashboard/wallet" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="absolute top-0 z-50 w-full">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-8 lg:px-12">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-10 text-sm font-medium text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
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
    </header>
  );
}
