import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer data-surface="ink" className="px-[var(--gutter)] py-16">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div>
          <Wordmark size="md" />
          <p className="serif mt-5 max-w-[34ch] text-[length:var(--step-1)] text-fg-2">
            Don&rsquo;t tell people what to think. Give them something worth thinking about.
          </p>
        </div>
        <div className="mono-lc grid gap-8 text-fg-3 sm:grid-cols-2 ">
          <div>
            <p className="mono mb-3 text-fg-3">Navigate</p>
            <ul className="space-y-1.5 text-fg-2">
              <li><Link className="ink-link" href="/">Front page</Link></li>
              <li><Link className="ink-link" href="/investigations/what-you-believe">No. 01 — What you believe</Link></li>
              <li><Link className="ink-link" href="/about">About</Link></li>
            </ul>
          </div>
          <div>
            <p className="mono mb-3 text-fg-3">Colophon</p>
            <p className="text-fg-2">
              Set in Fraunces, Instrument Sans and IBM Plex Mono. Built with Next.js and GSAP.
              Every illustration is drawn in code. No stock imagery, no tracking.
            </p>
          </div>
        </div>
      </div>
      <p className="mono mx-auto mt-16 max-w-[1400px] text-fg-3">
        © 2026 Palimpsest · An independent publication, first issue.
      </p>
    </footer>
  );
}
