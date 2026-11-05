import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RingMark } from "@/components/RingMark";
import { ReceiptMark } from "@/components/ReceiptMark";
import { Invitation } from "@/components/Invitation";
import type { Metadata } from "next";
import { desks, investigations } from "@/content/investigations";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: "Palimpsest — Something worth thinking about" },
};

export default function Home() {
  const lead = investigations[0];
  const second = investigations[1];
  const published = new Set(investigations.map((i) => i.desk));
  const issueDate = new Date(lead.published).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

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

        {/* Lead investigation: No. 02 */}
        <section id="investigations" data-surface="ink" className="relative overflow-hidden px-[var(--gutter)] py-20 md:py-28">
          <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
            <div>
              <p className="mono text-fg-3">
                Investigation {lead.number} <span aria-hidden className="mx-2">·</span> {lead.desk}{" "}
                <span aria-hidden className="mx-2">·</span> {lead.readingTime} <span aria-hidden className="mx-2">·</span>{" "}
                <span className="text-accent">Latest</span>
              </p>
              <Link href={`/investigations/${lead.slug}`} className="group mt-8 block no-underline">
                <span className="display-light block text-[length:var(--step-2)] text-fg-2">How much is</span>
                <span className="display block text-[length:var(--step-5)] text-fg">an hour of your</span>
                <span className="display-strong block text-[length:var(--step-5)] text-vermilion-2 transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-2">
                  attention worth?
                </span>
              </Link>
              <p className="mt-8 max-w-[52ch] text-[length:var(--step-0)] leading-relaxed text-fg-2">{lead.dek}</p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link
                  href={`/investigations/${lead.slug}`}
                  className="mono inline-flex items-center gap-3 border border-fg px-5 py-3 no-underline transition-colors hover:bg-fg hover:text-bg focus-visible:bg-fg focus-visible:text-bg"
                >
                  Print your receipt <span aria-hidden>→</span>
                </Link>
                <p className="mono-lc text-fg-3">{lead.shape}</p>
              </div>
            </div>
            <ReceiptMark className="mx-auto w-full max-w-[22rem] lg:max-w-[24rem]" />
          </div>
        </section>

        {/* Second investigation: No. 01 */}
        <section data-surface="parchment" className="border-b border-rule px-[var(--gutter)] py-16 md:py-24">
          <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div data-surface="ink" className="order-2 mx-auto w-full max-w-[18rem] p-5 lg:order-1 lg:max-w-[22rem]">
              <RingMark />
            </div>
            <div className="order-1 lg:order-2">
              <p className="mono text-fg-3">
                Investigation {second.number} <span aria-hidden className="mx-2">·</span> {second.desk}{" "}
                <span aria-hidden className="mx-2">·</span> {second.readingTime}
              </p>
              <Link href={`/investigations/${second.slug}`} className="group mt-5 block no-underline">
                <span className="display block max-w-[16ch] text-[length:var(--step-4)] leading-[1] text-fg transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">
                  {second.title}
                </span>
              </Link>
              <p className="mt-6 max-w-[52ch] text-[length:var(--step-0)] leading-relaxed text-fg-2">{second.promise}</p>
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <Link href={`/investigations/${second.slug}`} className="mono ink-link">
                  Begin the inquiry <span aria-hidden>→</span>
                </Link>
                <Link href="/investigations" className="mono ink-link text-fg-3">
                  All investigations
                </Link>
              </div>
            </div>
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
                Two desks have published. The rest are concepts in preparation, not published work. Each desk opens with the question it exists to keep asking.
              </p>
            </div>
            <ol className="divide-y divide-rule">
              {desks.map((d) => (
                <li key={d.name} className="grid grid-cols-[3rem_1fr] items-baseline gap-4 py-7 md:grid-cols-[4rem_12rem_1fr_auto] md:gap-8">
                  <span className="mono text-fg-3">{d.numeral}</span>
                  <span className="display text-[length:var(--step-2)]">{d.name}</span>
                  <span className="serif col-span-2 text-[length:var(--step-1)] text-fg-2 md:col-span-1">{d.question}</span>
                  <span className="register col-start-2 md:col-start-4" data-level={published.has(d.name) ? "established" : "contested"}>
                    {published.has(d.name) ? "1 investigation" : "In preparation"}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Invitation />

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
