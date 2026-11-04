import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RingMark } from "@/components/RingMark";
import { desks, investigations } from "@/content/investigations";

export default function Home() {
  const featured = investigations[0];
  const issueDate = new Date(featured.published).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* Masthead */}
        <section data-surface="parchment" className="px-[var(--gutter)] pb-20 pt-10 md:pb-28 md:pt-16">
          <div className="mx-auto max-w-[1400px]">
            <div className="mono flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-fg pb-3 text-fg-3">
              <span>First issue <span aria-hidden className="mx-2">·</span> {issueDate}</span>
              <span>An independent publication</span>
              <span>Mind · Power · Society · History · Philosophy · Culture</span>
            </div>

            <h1 className="relative mt-10 leading-none md:mt-14">
              <span
                aria-hidden
                className="display absolute left-[0.04em] top-[0.05em] select-none italic text-accent opacity-[0.28] text-[clamp(3.6rem,13.5vw,14rem)]"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1', fontWeight: 300 }}
              >
                Palimpsest
              </span>
              <span
                className="display relative block text-[clamp(3.6rem,13.5vw,14rem)]"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1', fontWeight: 500 }}
              >
                Palimpsest
              </span>
            </h1>

            <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.4fr_1fr]">
              <p className="serif max-w-[26ch] text-[length:var(--step-3)] leading-[1.08] text-fg">
                Don&rsquo;t tell people what to think. Give them something worth thinking about.
              </p>
              <div className="max-w-[46ch] border-l border-rule pl-6">
                <p className="serif-text italic text-fg-2">
                  pal·imp·sest <span className="mono-lc not-italic text-fg-3">(n.)</span>
                </p>
                <p className="mt-2 text-[length:var(--step--1)] leading-relaxed text-fg-2">
                  A manuscript page scraped clean and written over, the earlier text still showing
                  through. Also: a mind. Palimpsest is a publication of interactive intellectual
                  journalism about the political, economic, historical, psychological, and philosophical
                  forces that write on us before we learn to write back.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured investigation */}
        <section id="investigations" data-surface="ink" className="relative overflow-hidden px-[var(--gutter)] py-20 md:py-28">
          <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <div>
              <p className="mono text-fg-3">
                Investigation {featured.number} <span aria-hidden className="mx-2">·</span> {featured.desk}{" "}
                <span aria-hidden className="mx-2">·</span> {featured.readingTime}
              </p>
              <Link href={`/investigations/${featured.slug}`} className="group mt-8 block no-underline">
                <span className="display-light block text-[length:var(--step-2)] text-fg-2">How much</span>
                <span className="display block text-[length:var(--step-5)] text-fg">of what you believe</span>
                <span className="display block text-[length:var(--step-3)] italic text-fg-2" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1' }}>
                  is actually
                </span>
                <span className="display-strong block text-[length:var(--step-5)] text-vermilion-2 transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-2">
                  yours?
                </span>
              </Link>
              <p className="mt-8 max-w-[52ch] text-[length:var(--step-0)] leading-relaxed text-fg-2">{featured.dek}</p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link
                  href={`/investigations/${featured.slug}`}
                  className="mono inline-flex items-center gap-3 border border-fg px-5 py-3 no-underline transition-colors hover:bg-fg hover:text-bg focus-visible:bg-fg focus-visible:text-bg"
                >
                  Begin the inquiry <span aria-hidden>→</span>
                </Link>
                <p className="mono-lc text-fg-3">Six acts · three instruments · eighteen sources</p>
              </div>
            </div>
            <RingMark className="mx-auto w-full max-w-[420px] lg:max-w-none" />
          </div>
        </section>

        {/* Desks */}
        <section id="desks" data-surface="parchment" className="px-[var(--gutter)] py-20 md:py-28">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-fg pb-4">
              <div>
                <p className="mono text-fg-3">The desks</p>
                <p className="display mt-2 text-[length:var(--step-3)]">Six standing questions</p>
              </div>
              <p className="mono-lc max-w-[40ch] text-fg-3">
                Future editorial territories. These are concepts in preparation, not published work. Each desk opens with the question it exists to keep asking.
              </p>
            </div>
            <ol className="divide-y divide-rule">
              {desks.map((d) => (
                <li key={d.name} className="grid grid-cols-[3rem_1fr] items-baseline gap-4 py-7 md:grid-cols-[4rem_12rem_1fr_auto] md:gap-8">
                  <span className="mono text-fg-3">{d.numeral}</span>
                  <span className="display text-[length:var(--step-2)]">{d.name}</span>
                  <span className="serif col-span-2 text-[length:var(--step-1)] text-fg-2 md:col-span-1">{d.question}</span>
                  <span className="register col-start-2 md:col-start-4" data-level="contested">In preparation</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* About, briefly */}
        <section id="about" data-surface="parchment" className="border-t border-rule px-[var(--gutter)] py-20 md:py-28">
          <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="mono text-fg-3">About</p>
              <p className="display mt-2 text-[length:var(--step-3)]">What this is</p>
            </div>
            <div className="prose">
              <p className="lead">
                Palimpsest exists to make people more curious about the world: to expose readers to
                unfamiliar ideas, to challenge assumptions, and to make difficult subjects genuinely
                fascinating.
              </p>
              <p>
                We hold no fixed political or philosophical line. We will challenge conventional wisdom
                when the evidence allows, and we will challenge attractive, sensational narratives when the
                evidence demands. Curiosity matters more to us than contrarianism. Every investigation is
                built as an interactive experience because some ideas are better walked through than read
                about, and every one marks its claims by how much weight they can bear.
              </p>
              <p>
                This is the first issue. There is no team page because there is, as yet, nothing to put on
                it that would be true. <Link href="/about" className="ink-link">Read more about the project.</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
