"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { useReceipt } from "./ReceiptContext";
import { big, META, money, usd } from "./figures";

const PER_DOT = 5_000_000;
const COLS = 34;

/**
 * Figure 1. One day of Meta's audience as a field of dots, one dot per five
 * million people; the reader's dot in vermilion. Scroll fills the field.
 */
export function DotField() {
  const root = useRef<HTMLDivElement>(null);
  const { receipt: r } = useReceipt();
  const n = Math.round(META.dap / PER_DOT);
  const rows = Math.ceil(n / COLS);
  const dots = useMemo(() => Array.from({ length: n }, (_, i) => ({ i, x: i % COLS, y: Math.floor(i / COLS) })), [n]);
  const you = Math.floor(n * 0.62);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", ok: "(prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const field = root.current!.querySelector<SVGSVGElement>(".dot-field")!;
          const you = root.current!.querySelector<SVGGElement>(".you")!;
          const caps = gsap.utils.toArray<HTMLElement>(".cap", root.current!);
          if (ctx.conditions?.reduce) {
            field.style.setProperty("--p", "1");
            gsap.set(you, { opacity: 1 });
            gsap.set(caps, { opacity: 1 });
            return;
          }
          field.style.setProperty("--p", "0");
          gsap.set(you, { opacity: 0, transformOrigin: "50% 50%" });
          gsap.set(caps, { opacity: 0, y: 10 });
          const vars = { p: 0 };
          const tl = gsap.timeline({
            scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 60%", scrub: 0.6 },
            defaults: { ease: "none" },
          });
          tl.to(vars, { p: 1, duration: 0.7, onUpdate: () => field.style.setProperty("--p", String(vars.p)) }, 0)
            .to(caps[0], { opacity: 1, y: 0, duration: 0.1 }, 0.1)
            .to(caps[1], { opacity: 1, y: 0, duration: 0.1 }, 0.45)
            .to(you, { opacity: 1, scale: 1, duration: 0.1 }, 0.72)
            .to(caps[2], { opacity: 1, y: 0, duration: 0.1 }, 0.78);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  const w = COLS * 20;
  const h = rows * 20;
  return (
    <div ref={root} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="dot-field h-auto w-full text-ink"
        style={{ ["--n" as string]: n }}
        role="img"
        aria-label={`${big(n)} dots, one for every five million people who use a Meta app on an average day. One dot, in red, stands for you.`}
      >
        {dots.map((d) => (
          <circle
            key={d.i}
            cx={d.x * 20 + 10}
            cy={d.y * 20 + 10}
            r={5.2}
            fill={d.i === you ? "transparent" : "currentColor"}
            style={{ ["--i" as string]: d.i }}
          />
        ))}
        <g className="you">
          <circle cx={(you % COLS) * 20 + 10} cy={Math.floor(you / COLS) * 20 + 10} r={7.5} fill="var(--vermilion)" />
          <circle cx={(you % COLS) * 20 + 10} cy={Math.floor(you / COLS) * 20 + 10} r={12} fill="none" stroke="var(--vermilion)" strokeWidth="1" />
        </g>
      </svg>
      <div className="space-y-6">
        <div className="cap">
          <p className="display text-[length:var(--step-3)] leading-none tabular-nums">{(META.dap / 1e9).toFixed(2)}<span className="text-fg-3"> bn</span></p>
          <p className="mono-lc mt-1 text-fg-3">people on a Meta app on an average day, December {META.fiscalYear}. One dot is {big(PER_DOT)} people.</p>
        </div>
        <div className="cap">
          <p className="display text-[length:var(--step-3)] leading-none tabular-nums">{usd(r.metaPerDay / 1e6, 0)}<span className="text-fg-3"> m</span></p>
          <p className="mono-lc mt-1 text-fg-3">revenue, every day, nearly all of it from advertising.</p>
        </div>
        <div className="cap">
          <p className="display text-[length:var(--step-3)] leading-none tabular-nums text-accent">{money(r.perDay)}</p>
          <p className="mono-lc mt-1 text-fg-3">
            your share of that day, in {r.region.short}. You and {big(PER_DOT - 1)} others are the red dot.
          </p>
        </div>
      </div>
    </div>
  );
}
