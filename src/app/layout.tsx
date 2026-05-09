import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { type ReactNode } from "react";
import { rootMetadata } from "@/lib/seo";

export const metadata = rootMetadata;

export default function RootLayout(props: { children: ReactNode }) {
	const { children } = props;

	return (
		<ClerkProvider>
			<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} min-h-dvh`}>
				<body className="min-h-dvh font-sans">{children}</body>
			</html>
		</ClerkProvider>
	);
}
