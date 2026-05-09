"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "./logo";

export function Header() {
	const { isSignedIn } = useAuth();

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<nav className="container mx-auto flex items-center justify-between px-4 py-4">
				<Link href="/" className="flex items-center gap-2">
					<Logo />
					<span className="font-semibold">Marketplace</span>
				</Link>

				<div className="flex items-center gap-6">
					<Link href="/marketplace" className="text-sm font-medium hover:text-foreground/80">
						Browse
					</Link>

					{isSignedIn && (
						<>
							<Link href="/dashboard" className="text-sm font-medium hover:text-foreground/80">
								Dashboard
							</Link>
							<Link href="/contracts/new" className="text-sm font-medium hover:text-foreground/80">
								Sell Contract
							</Link>
						</>
					)}

					<div>
						{isSignedIn ? (
							<UserButton afterSignOutUrl="/" />
						) : (
							<SignInButton mode="modal">
								<button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
									Sign In
								</button>
							</SignInButton>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
