import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Newsreader } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { type ReactNode } from "react";
import { rootMetadata } from "@/lib/seo";

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
      className={`${inter.variable} ${newsreader.variable} ${GeistMono.variable} min-h-dvh`}
    >
      <ClerkProvider>
        <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
