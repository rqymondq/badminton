import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RingMark } from "@/components/RingMark";
import { ReceiptMark } from "@/components/ReceiptMark";
import { Invitation } from "@/components/Invitation";
import { desks, investigations } from "@/content/investigations";

export const metadata: Metadata = {
  title: "Investigations",
  description: "Every Palimpsest investigation, in order. Each one is a question, an interactive inquiry, and a bibliography.",
  alternates: { canonical: "/investigations" },
};

export default function InvestigationsIndex() {
  const byDesk = new Map<string, number>();
  investigations.forEach((i) => byDesk.set(i.desk, (byDesk.get(i.desk) ?? 0) + 1));
  return (
    <>
      <SiteHeader />
      <main id="main" data-surface="parchment">
        <section className="px-[var(--gutter)] pb-10 pt-12 md:pt-16">
          <div className="mx-auto max-w-[1400px]">
            <p className="mono text-fg-3">Investigations</p>
            <h1 className="display mt-3 max-w-[18ch] text-[length:var(--step-4)] leading-[1]">
              Every piece is a question we could not answer in a paragraph.
            </h1>
            <p className="serif mt-6 max-w-[48ch] text-[length:var(--step-1)] text-fg-2">
              Each investigation is built to be walked through rather than read: a scroll-driven narrative, two or
              three instruments you can use on yourself, and a bibliography that says how sure we are.
            </p>
          </div>
        </section>

        <section className="px-[var(--gutter)] pb-20">
          <ol className="mx-auto max-w-[1400px] divide-y divide-rule border-t border-fg">
            {investigations.map((inv, idx) => (
              <li key={inv.slug} className="grid gap-8 py-12 md:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] md:gap-16 md:py-16">
                <div>
                  <p className="mono text-fg-3">
                    {inv.number} <span aria-hidden className="mx-2">·</span> {inv.desk} <span aria-hidden className="mx-2">·</span> {inv.readingTime}
                    {idx === 0 && (
                      <>
                        <span aria-hidden className="mx-2">·</span>
                        <span className="text-accent">Latest</span>
                      </>
                    )}
                  </p>
                  <Link href={`/investigations/${inv.slug}`} className="group mt-4 block no-underline">
                    <span className="display block max-w-[18ch] text-[length:var(--step-4)] leading-[1] text-fg transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">
                      {inv.title}
                    </span>
                  </Link>
                  <p className="mt-6 max-w-[58ch] text-[length:var(--step-0)] leading-relaxed text-fg-2">{inv.dek}</p>
                  <p className="serif-text mt-4 max-w-[52ch] italic text-fg-2">{inv.promise}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-6">
                    <Link
                      href={`/investigations/${inv.slug}`}
                      className="mono inline-flex items-center gap-3 border border-fg px-5 py-3 no-underline transition-colors hover:bg-fg hover:text-bg focus-visible:bg-fg focus-visible:text-bg"
                    >
                      Begin <span aria-hidden>→</span>
                    </Link>
                    <p className="mono-lc text-fg-3">{inv.shape}</p>
                  </div>
                </div>
                <div className="self-center">
                  {inv.motif === "receipt" ? (
                    <ReceiptMark className="mx-auto w-full max-w-[20rem]" />
                  ) : (
                    <div data-surface="ink" className="mx-auto w-full max-w-[20rem] p-6">
                      <RingMark />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-rule px-[var(--gutter)] py-16 md:py-20">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-fg pb-4">
              <div>
                <p className="mono text-fg-3">The desks</p>
                <p className="display mt-2 text-[length:var(--step-3)]">Six standing questions</p>
              </div>
              <p className="mono-lc max-w-[44ch] text-fg-3">
                Two desks have published. The rest are editorial territories in preparation, each named by the question it exists to keep asking.
              </p>
            </div>
            <ol className="divide-y divide-rule">
              {desks.map((d) => {
                const n = byDesk.get(d.name) ?? 0;
                return (
                  <li key={d.name} className="grid grid-cols-[3rem_1fr] items-baseline gap-4 py-6 md:grid-cols-[4rem_12rem_1fr_auto] md:gap-8">
                    <span className="mono text-fg-3">{d.numeral}</span>
                    <span className="display text-[length:var(--step-2)]">{d.name}</span>
                    <span className="serif col-span-2 text-[length:var(--step-1)] text-fg-2 md:col-span-1">{d.question}</span>
                    <span className="register col-start-2 md:col-start-4" data-level={n > 0 ? "established" : "contested"}>
                      {n > 0 ? `${n} investigation${n > 1 ? "s" : ""}` : "In preparation"}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
        <Invitation />
      </main>
      <SiteFooter />
    </>
  );
}
