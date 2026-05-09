import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { type ReactNode } from "react";
import { rootMetadata } from "@/lib/seo/index.ts";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geist_mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata = rootMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geist_mono.variable} min-h-dvh`}
    >
      <body className="min-h-dvh font-sans">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
