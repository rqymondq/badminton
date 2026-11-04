import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" data-surface="parchment" className="flex min-h-[70svh] flex-col items-start justify-center px-[var(--gutter)]">
        <p className="mono text-fg-3">Folio not found</p>
        <p className="display mt-4 max-w-[16ch] text-[length:var(--step-4)]">This page was scraped clean before anything was written on it.</p>
        <Link href="/" className="mono ink-link mt-8">Return to the front page →</Link>
      </main>
    </>
  );
}
