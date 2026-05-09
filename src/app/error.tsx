"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";

interface ErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	useEffect(() => {
		console.error("[Error]", error);
	}, [error]);

	const buttonBase =
		"inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring";

	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
			<div className="mx-auto max-w-md text-center">
				<div className="bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
					<AlertCircle className="h-8 w-8 text-destructive" />
				</div>

				<h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
					Something Went Wrong
				</h1>

				<p className="mb-8 text-muted-foreground">
					An unexpected error occurred. Please try again.
				</p>

				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						onClick={reset}
						className={`${buttonBase} hover:bg-primary/90 bg-primary text-primary-foreground`}
					>
						<RefreshCw className="h-4 w-4" />
						Try Again
					</button>

					<Link
						href="/marketplace"
						className={`${buttonBase} border border-input bg-background hover:bg-accent hover:text-accent-foreground`}
					>
						<Home className="h-4 w-4" />
						Go Home
					</Link>
				</div>

				<button
					onClick={() => window.history.back()}
					className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="h-3 w-3" />
					Go back
				</button>

				{error.digest && (
					<p className="text-muted-foreground/60 mt-8 text-xs">Error ID: {error.digest}</p>
				)}
			</div>
		</div>
	);
}
