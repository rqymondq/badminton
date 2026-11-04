import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About",
  description: "What Palimpsest is, how it works, and what it refuses to do.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" data-surface="parchment" className="px-[var(--gutter)] py-16 md:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <p className="mono text-fg-3">About</p>
            <h1 className="display mt-3 text-[length:var(--step-4)] leading-[1]">A publication for the unfinished mind</h1>
          </div>
          <div className="prose">
            <p className="lead">
              Palimpsest is an independent, Renaissance-inspired publication of interactive intellectual
              journalism. Its purpose is simple to state and hard to do: make people more curious about
              the forces that shape their lives.
            </p>
            <h2 className="serif mt-12 text-[length:var(--step-2)]">What we believe about believing</h2>
            <p>
              People get absorbed, understandably, in the immediate. The political, economic, historical,
              psychological, and philosophical forces that shape a life mostly operate out of sight. We
              want to interrupt that, not with outrage but with fascination. Our guiding principle is a
              sentence we try to live up to in every piece: <em>Don&rsquo;t tell people what to think. Give
              them something worth thinking about.</em>
            </p>
            <h2 className="serif mt-12 text-[length:var(--step-2)]">How a piece is built</h2>
            <p>
              Each investigation is an interactive experience, designed and written together. Motion is
              used only where it changes understanding. Every illustration is drawn in code; there is no
              stock imagery. Claims carry one of four registers so you can see how much weight they bear:
            </p>
            <ul className="mt-4 space-y-2">
              <li><span className="register" data-level="established">Established</span> <span className="text-fg-2">— a finding replicated or widely accepted in its field.</span></li>
              <li><span className="register" data-level="theory">Theory</span> <span className="text-fg-2">— an interpretive framework with evidence behind it, and arguments against.</span></li>
              <li><span className="register" data-level="contested">Contested</span> <span className="text-fg-2">— a live scholarly dispute.</span></li>
              <li><span className="register" data-level="editorial">Ours</span> <span className="text-fg-2">— our own reflection, offered as such.</span></li>
            </ul>
            <h2 className="serif mt-12 text-[length:var(--step-2)]">What we refuse</h2>
            <p>
              No invented quotations, statistics, or studies. No fabricated documents dressed as history.
              No tracking, accounts, or paywalls in this first issue. No pretending to be larger or older
              than we are: this is the first piece, and the desks you see on the front page are intentions,
              not archives.
            </p>
            <h2 className="serif mt-12 text-[length:var(--step-2)]">Colophon</h2>
            <p className="text-fg-2">
              Set in Fraunces, Instrument Sans and IBM Plex Mono. Built with Next.js, TypeScript, Tailwind
              CSS and GSAP. The name comes from the manuscript page that has been scraped and written over,
              where the earlier hand still shows through.
            </p>
            <p className="mt-10">
              <Link href="/investigations/what-you-believe" className="mono ink-link">
                Read the first investigation →
              </Link>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
