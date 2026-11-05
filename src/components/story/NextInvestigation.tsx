import Link from "next/link";
import { investigations } from "@/content/investigations";

/** The hand-off at the end of a piece: one other investigation, chosen in order. */
export function NextInvestigation({ current }: { current: string }) {
  const others = investigations.filter((i) => i.slug !== current);
  const next = others[0];
  if (!next) return null;
  return (
    <section aria-labelledby="next-title" className="border-t border-rule px-[var(--gutter)] py-16 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-[auto_1fr] md:gap-12">
        <p id="next-title" className="mono text-fg-3">Continue</p>
        <div>
          <p className="mono text-fg-3">
            Investigation {next.number} <span aria-hidden className="mx-2">·</span> {next.desk} <span aria-hidden className="mx-2">·</span> {next.readingTime}
          </p>
          <Link href={`/investigations/${next.slug}`} className="group mt-3 block no-underline">
            <span className="display block max-w-[20ch] text-[length:var(--step-3)] leading-[1.02] text-fg transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">
              {next.title}
            </span>
          </Link>
          <p className="mt-3 max-w-[52ch] text-[length:var(--step--1)] leading-relaxed text-fg-2">{next.promise}</p>
          <Link href={`/investigations/${next.slug}`} className="mono ink-link mt-5 inline-block">
            Begin <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
