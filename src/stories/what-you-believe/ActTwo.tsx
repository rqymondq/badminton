"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { influences, type Influence } from "./data";
import { ActHead } from "@/components/story/Act";
import { Column, Prose, Ref, RegisterTag, Aside, Figure, Pull } from "@/components/story/Prose";

const tints: Record<Influence["tint"], string> = {
  vermilion: "#B8321E",
  lapis: "#24407A",
  graphite: "#4B4642",
  ochre: "#A8803A",
};

// Figure geometry (viewBox 0 0 600 600)
const CX = 300;
const CY = 320;
const R = 252;
const nodePos = influences.map((_, i) => {
  const a = (i / influences.length) * Math.PI * 2 - Math.PI / 2;
  return { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R };
});

// Engraving-style profile, facing right.
const profile =
  "M232 560 C236 500 228 450 222 414 C198 384 176 332 180 270 C186 190 238 136 306 136 C368 136 406 184 408 240 C410 262 404 276 396 285 C404 292 412 300 408 309 C404 317 392 319 388 323 C394 331 396 339 390 345 C384 351 380 357 386 363 C378 373 366 379 352 381 C340 397 330 421 332 445 C334 468 352 494 380 520 C410 530 430 545 440 560 Z";

export function ActTwo() {
  const root = useRef<HTMLDivElement>(null);
  const fig = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>(0);
  const panelId = useId();
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", ok: "(prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const lines = gsap.utils.toArray<SVGLineElement>(".inf-line", fig.current!);
          const discs = gsap.utils.toArray<SVGCircleElement>(".inf-disc", fig.current!);
          lines.forEach((l) => {
            const len = Math.hypot(
              Number(l.getAttribute("x2")) - Number(l.getAttribute("x1")),
              Number(l.getAttribute("y2")) - Number(l.getAttribute("y1")),
            );
            l.style.strokeDasharray = `${len}`;
            l.style.strokeDashoffset = ctx.conditions?.reduce ? "0" : `${len}`;
          });
          if (ctx.conditions?.reduce) {
            gsap.set(discs, { attr: { r: 118 }, opacity: 1 });
            return;
          }
          gsap.set(discs, { attr: { r: 0 }, opacity: 0 });
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: fig.current, start: "top 85%", end: "center 40%", scrub: 0.6 },
          });
          tl.to(lines, { strokeDashoffset: 0, stagger: 0.08, duration: 0.6 }, 0).to(
            discs,
            { attr: { r: 118 }, opacity: 1, stagger: 0.07, duration: 0.55, ease: "power2.out" },
            0.25,
          );
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = influences.length;
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    btnRefs.current[next]?.focus();
  };

  const current = influences[active];

  return (
    <div ref={root} className="py-24 md:py-32">
      <Column>
        <ActHead numeral="II" label="The Inheritance" theme="Before we learn to question the world, we learn how to see it." />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,60ch)_minmax(0,1fr)] lg:gap-20">
          <Prose>
            <p className="versal">
              Nobody chooses their first language. Nobody chooses the arguments that were had at the
              dinner table, or the ones that were never had. By the time a child can ask whether something
              is true, the child already has a working theory of what truth sounds like, who is allowed to
              say it, and which questions are rude.
            </p>
            <p>
              Some of this inheritance is measurable. In long-running panel studies, the political
              leanings of parents predict those of their adult children, most reliably in households where
              politics was discussed and both parents agreed.<Ref n={8} /> Among American adults raised in
              a religion, most still identify with it; of those who leave, the largest group do not convert
              but simply stop affiliating.<Ref n={10} /> Twin studies suggest that even some variation in
              political attitudes has a heritable component, though how large, and what exactly is being
              inherited, is disputed.<Ref n={9} />
            </p>
            <p>
              Most of it is not measurable at all. The particular quiet of a particular house. Which
              emotions were safe to show. Whether money was discussed or merely feared. What the adults
              laughed at. The map of the world a school handed over before anyone could read a map. The
              feed that became, without a syllabus, a curriculum.
            </p>
            <p>
              Two cautions. First, almost everything psychology knows about belief was learned from a
              narrow slice of humanity: Western, educated, industrialised, rich, democratic
              populations.<Ref n={11} /> Findings from that slice should not be assumed to describe
              everyone. Second, nothing here means your beliefs are <em>merely</em> inherited. A belief
              handed down can be true. A belief you arrived at alone can be false. Origin is not verdict.
            </p>
            <Pull>An inherited belief is not therefore wrong. But its origin is worth looking at, if only because you never had to.</Pull>
            <p>
              What the inheritance does is set the starting point. It decides which ideas feel obvious and
              which feel strange, which arguments feel like home and which feel like a threat. Everything
              that follows in this inquiry happens from that starting point, including the reasoning you
              will later use to defend it.
            </p>
          </Prose>

          {/* Figure 1 */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Figure
              n="1"
              caption={
                <>
                  A worldview as a layering of influences. Conceptual, not a model: the discs are not
                  proportions and the lines are not causal weights. Select an influence to read an example.
                </>
              }
            >
              <div ref={fig} className="relative mx-auto w-full max-w-[560px]">
                <svg viewBox="0 0 600 600" className="h-auto w-full text-ink" role="img" aria-labelledby={`${panelId}-svgtitle`}>
                  <title id={`${panelId}-svgtitle`}>An engraved human profile surrounded by eight influences, each connected by a line and a translucent disc.</title>
                  <defs>
                    <pattern id={`${panelId}-hatch`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(38)">
                      <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="0.8" />
                    </pattern>
                    <pattern id={`${panelId}-cross`} patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(-50)">
                      <line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" strokeWidth="0.6" />
                    </pattern>
                    <clipPath id={`${panelId}-clip`}>
                      <path d={profile} />
                    </clipPath>
                  </defs>

                  {/* Orbit ring */}
                  <circle cx={CX} cy={CY} r={R} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeDasharray="2 6" />

                  {/* Connecting lines */}
                  {nodePos.map((p, i) => (
                    <line
                      key={i}
                      className="inf-line"
                      x1={p.x}
                      y1={p.y}
                      x2={CX + (p.x - CX) * 0.22}
                      y2={CY + (p.y - CY) * 0.22}
                      stroke={tints[influences[i].tint]}
                      strokeWidth={active === i ? 1.6 : 0.9}
                      strokeOpacity={active === i ? 1 : 0.6}
                    />
                  ))}

                  {/* Figure */}
                  <path d={profile} fill={`url(#${panelId}-hatch)`} opacity="0.75" />
                  <path d={profile} fill={`url(#${panelId}-cross)`} opacity="0.35" clipPath={`url(#${panelId}-clip)`} />
                  <path d={profile} fill="none" stroke="currentColor" strokeWidth="1.4" />

                  {/* Layered discs, multiply blend */}
                  <g style={{ mixBlendMode: "multiply" }}>
                    {nodePos.map((p, i) => (
                      <circle
                        key={i}
                        className="inf-disc"
                        cx={CX + (p.x - CX) * 0.42}
                        cy={CY + (p.y - CY) * 0.42}
                        r={0}
                        fill={tints[influences[i].tint]}
                        fillOpacity={active === i ? 0.3 : 0.14}
                        style={{ transition: "fill-opacity 0.4s" }}
                      />
                    ))}
                  </g>

                  {/* Node markers (visual only; buttons overlay for interaction) */}
                  {nodePos.map((p, i) => (
                    <g key={i} aria-hidden>
                      <circle cx={p.x} cy={p.y} r={active === i ? 9 : 5} fill={tints[influences[i].tint]} style={{ transition: "r 0.3s" }} />
                      <circle cx={p.x} cy={p.y} r={16} fill="none" stroke={tints[influences[i].tint]} strokeOpacity={active === i ? 0.9 : 0} style={{ transition: "stroke-opacity 0.3s" }} />
                    </g>
                  ))}
                </svg>

                {/* Interactive overlay buttons positioned on the nodes (wide screens) */}
                <div role="group" aria-label="Influences" className="hidden md:block">
                  {influences.map((inf, i) => {
                    const p = nodePos[i];
                    const left = (p.x / 600) * 100;
                    const top = (p.y / 600) * 100;
                    const rightSide = p.x > CX + 1;
                    const leftSide = p.x < CX - 1;
                    return (
                      <button
                        key={inf.key}
                        ref={(el) => { btnRefs.current[i] = el; }}
                        type="button"
                        aria-pressed={active === i}
                        aria-controls={`${panelId}-panel`}
                        onClick={() => setActive(i)}
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onKeyDown={(e) => onKey(e, i)}
                        className={`mono absolute -translate-y-1/2 whitespace-nowrap px-2 py-1 text-[0.72rem] transition-colors ${
                          active === i ? "text-ink" : "text-graphite hover:text-ink"
                        }`}
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          transform: `translate(${rightSide ? "22px" : leftSide ? "calc(-100% - 22px)" : "-50%"}, ${p.y < CY - 1 && !rightSide && !leftSide ? "calc(-50% - 22px)" : p.y > CY + 1 && !rightSide && !leftSide ? "calc(-50% + 22px)" : "-50%"})`,
                        }}
                      >
                        {inf.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Figure>

            {/* Compact screens: a strip of chips instead of overlaid labels */}
            <div role="group" aria-label="Influences" className="-mx-1 flex flex-wrap gap-1.5 md:hidden">
              {influences.map((inf, i) => (
                <button
                  key={inf.key}
                  type="button"
                  aria-pressed={active === i}
                  aria-controls={`${panelId}-panel`}
                  onClick={() => setActive(i)}
                  className={`mono border px-3 py-1.5 text-[0.7rem] transition-colors ${
                    active === i ? "border-ink bg-ink text-parchment" : "border-rule text-graphite"
                  }`}
                >
                  {inf.label}
                </button>
              ))}
            </div>

            <div
              id={`${panelId}-panel`}
              aria-live="polite"
              className="mt-2 border-t border-rule pt-5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="serif text-[length:var(--step-1)]" style={{ color: tints[current.tint] }}>
                  {current.label}
                </p>
                <p className="mono text-fg-3">Illustrative</p>
              </div>
              <p className="mt-3 max-w-[52ch] text-[length:var(--step-0)] leading-relaxed text-fg">
                {current.example}
                {current.ref && <Ref n={current.ref} />}
              </p>
              {current.note && (
                <p className="mono-lc mt-3 max-w-[52ch] text-fg-3">{current.note}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,60ch)_minmax(0,1fr)] lg:gap-20">
          <Aside label="Registers used in this act">
            <p className="mb-2"><RegisterTag level="established" /> Parent–child transmission of political and religious identity.<Ref n={8} /><Ref n={10} /></p>
            <p className="mb-2"><RegisterTag level="contested" /> The size and meaning of heritable components of attitudes.<Ref n={9} /></p>
            <p><RegisterTag level="editorial" /> The claim that origin is not verdict. That is a position, not a finding.</p>
          </Aside>
        </div>
      </Column>
    </div>
  );
}
