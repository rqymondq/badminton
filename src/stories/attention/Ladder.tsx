"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { gsap, useGSAP, useIsCompact } from "@/lib/motion";
import { ladder } from "./data";

const CAP = 4.6; // bars longer than this are broken
const UNIT = 70; // px per ratio unit at viewBox scale

/**
 * Figure 2. Associations with adolescent well-being relative to technology use.
 * Technology is the reference bar; the others arrive around it on scroll.
 */
export function Ladder() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>(3);
  const id = useId();
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const compact = useIsCompact(640);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", ok: "(prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const bars = gsap.utils.toArray<SVGRectElement>(".bar", root.current!);
          const labels = gsap.utils.toArray<SVGGElement>(".lbl", root.current!);
          if (ctx.conditions?.reduce) return;
          bars.forEach((b) => gsap.set(b, { scaleX: 0, transformOrigin: b.dataset.dir === "neg" ? "100% 50%" : "0% 50%" }));
          gsap.set(labels, { opacity: 0 });
          const order = [3, 4, 2, 1, 0, 5];
          const tl = gsap.timeline({
            scrollTrigger: { trigger: root.current, start: "top 70%", end: "center 35%", scrub: 0.6 },
            defaults: { ease: "power2.out" },
          });
          order.forEach((k, j) => {
            tl.to(bars[k], { scaleX: 1, duration: 0.25 }, j * 0.15).to(labels[k], { opacity: 1, duration: 0.15 }, j * 0.15 + 0.05);
          });
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = ladder.length;
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else return;
    e.preventDefault();
    setActive(next);
    btns.current[next]?.focus();
  };

  const rowH = 54;
  const W = 900;
  const zero = 560; // x of the zero axis
  const H = ladder.length * rowH + 40;

  const gloss = (
    <div id={`${id}-gloss`} aria-live="polite" className="mt-4 border-t border-rule pt-4">
      <p className="serif text-[length:var(--step-1)]">{ladder[active].label}</p>
      <p className="mt-2 max-w-[60ch] text-[length:var(--step--1)] leading-relaxed text-fg-2">{ladder[active].gloss}</p>
    </div>
  );

  if (compact) {
    // Phones: stacked rows with HTML bars, so labels stay legible.
    const ZERO = 64; // percent of track width where the axis sits
    return (
      <div ref={root}>
        <ol className="space-y-3" aria-label="Comparisons">
          {ladder.map((row, i) => {
            const neg = row.ratio < 0;
            const mag = Math.min(Math.abs(row.ratio), CAP);
            const pct = (mag / CAP) * (neg ? ZERO : 100 - ZERO);
            const isRef = row.key === "tech";
            const on = active === i;
            return (
              <li key={row.key}>
                <button
                  ref={(el) => { btns.current[i] = el; }}
                  type="button"
                  aria-pressed={on}
                  aria-controls={`${id}-gloss`}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className="block w-full text-left"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className={`serif text-[length:var(--step-0)] ${on ? "text-fg" : "text-fg-2"}`}>{row.label}</span>
                    <span className="mono-lc text-fg-3">{isRef ? "reference" : `${row.ratio > 0 ? "+" : ""}${row.ratio}×`}</span>
                  </span>
                  <span className="relative mt-1.5 block h-3 w-full">
                    <span aria-hidden className="absolute inset-y-0 w-px bg-fg/40" style={{ left: `${ZERO}%` }} />
                    <span
                      aria-hidden
                      className="absolute inset-y-0"
                      style={{
                        left: neg ? `${ZERO - pct}%` : `${ZERO}%`,
                        width: `${pct}%`,
                        background: isRef ? "var(--vermilion-2)" : neg ? "var(--stone-2)" : "var(--lapis-2)",
                        opacity: on ? 1 : 0.75,
                      }}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="mono-lc mt-2 text-[length:var(--step--2)] text-fg-3">← lower well-being · higher →. Sleep runs off the chart.</p>
        {gloss}
      </div>
    );
  }

  return (
    <div ref={root}>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby={`${id}-t`}>
          <title id={`${id}-t`}>
            Horizontal bars showing how strongly six things are associated with adolescent well-being, relative to technology use.
          </title>
          {/* axis */}
          <line x1={zero} x2={zero} y1={10} y2={H - 10} stroke="currentColor" strokeOpacity="0.35" />
          <text x={zero - 8} y={H - 2} textAnchor="end" fill="currentColor" fillOpacity="0.5" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.5">
            LOWER WELL-BEING ←
          </text>
          <text x={zero + 8} y={H - 2} fill="currentColor" fillOpacity="0.5" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.5">
            → HIGHER
          </text>
          {ladder.map((row, i) => {
            const y = 20 + i * rowH;
            const neg = row.ratio < 0;
            const mag = Math.min(Math.abs(row.ratio), CAP);
            const len = mag * UNIT;
            const x = neg ? zero - len : zero;
            const isRef = row.key === "tech";
            const on = active === i;
            const broken = Math.abs(row.ratio) > CAP;
            return (
              <g key={row.key} aria-hidden>
                <rect
                  className="bar"
                  data-dir={neg ? "neg" : "pos"}
                  x={x}
                  y={y + 8}
                  width={len}
                  height={rowH - 24}
                  fill={isRef ? "var(--vermilion-2)" : neg ? "var(--stone-2)" : "var(--lapis-2)"}
                  fillOpacity={on ? 1 : 0.75}
                  style={{ transition: "fill-opacity 0.3s" }}
                />
                {broken && (
                  <g stroke="var(--bg)" strokeWidth="4">
                    <line x1={zero + len - 26} x2={zero + len - 14} y1={y + 4} y2={y + rowH - 20} />
                    <line x1={zero + len - 18} x2={zero + len - 6} y1={y + 4} y2={y + rowH - 20} />
                  </g>
                )}
                <g className="lbl">
                  {/* Label: left of the bar for negatives; left of the axis for positives (the empty side). */}
                  <text
                    x={neg ? zero - len - 10 : zero - 10}
                    y={y + rowH / 2 + 1}
                    textAnchor="end"
                    fill="currentColor"
                    fontFamily="var(--font-display)"
                    fontSize="18"
                    fontWeight={on ? 600 : 400}
                  >
                    {row.label}
                  </text>
                  {/* Ratio: right of the axis for negatives; inside the bar for positives. */}
                  <text
                    x={zero + 10}
                    y={y + rowH / 2 + 1}
                    textAnchor="start"
                    fill={neg ? "currentColor" : "var(--parchment)"}
                    fillOpacity={neg ? 0.7 : 1}
                    fontFamily="var(--font-mono)"
                    fontSize="13"
                  >
                    {isRef ? "reference" : `${row.ratio > 0 ? "+" : ""}${row.ratio}× ${!neg && broken ? "(off the chart)" : ""}`}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* accessible row buttons over the chart */}
        <div role="group" aria-label="Comparisons" className="absolute inset-0">
          {ladder.map((row, i) => (
            <button
              key={row.key}
              ref={(el) => { btns.current[i] = el; }}
              type="button"
              aria-pressed={active === i}
              aria-controls={`${id}-gloss`}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className="absolute left-0 w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-lapis-2"
              style={{ top: `${((20 + i * rowH) / H) * 100}%`, height: `${(rowH / H) * 100}%` }}
            >
              <span className="sr-only">{row.label}</span>
            </button>
          ))}
        </div>
      </div>

      {gloss}
    </div>
  );
}
