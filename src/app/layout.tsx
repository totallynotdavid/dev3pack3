import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { type ReactNode } from "react";
import { rootMetadata } from "@/lib/seo";
import { SolanaProviders } from "@/lib/solana/providers";
import { ToasterWrapper } from "@/ui/components/shared/toaster-wrapper";

export const metadata = rootMetadata;

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${newsreader.variable} min-h-dvh`}
    >
      <ClerkProvider>
        <SolanaProviders>
          <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
            {children}
            <ToasterWrapper />
          </body>
        </SolanaProviders>
      </ClerkProvider>
    </html>
  );
}
