import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Palimpsest — Something worth thinking about",
    template: "%s — Palimpsest",
  },
  description:
    "An independent, Renaissance-inspired publication of interactive intellectual journalism. We don’t tell you what to think. We give you something worth thinking about.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    siteName: "Palimpsest",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#131110",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-3 focus:py-2 focus:text-parchment mono"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
