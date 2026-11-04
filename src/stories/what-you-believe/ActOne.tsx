"use client";

import { useRef } from "react";
import { gsap, useGSAP, seeded } from "@/lib/motion";
import { influenceWords } from "./data";
import { Column, Prose } from "@/components/story/Prose";

/* Typographic variety for the sixteen words: size class, weight, italic. */
const voices = [
  ["text-[length:var(--step-3)]", 300, false], ["text-[length:var(--step-1)]", 500, true], ["text-[length:var(--step-2)]", 400, false],
  ["text-[length:var(--step-4)]", 200, true], ["text-[length:var(--step-1)]", 600, false], ["text-[length:var(--step-2)]", 300, true],
  ["text-[length:var(--step-3)]", 500, false], ["text-[length:var(--step-1)]", 400, true], ["text-[length:var(--step-2)]", 600, false],
  ["text-[length:var(--step-4)]", 300, false], ["text-[length:var(--step-1)]", 400, false], ["text-[length:var(--step-3)]", 200, true],
  ["text-[length:var(--step-2)]", 500, true], ["text-[length:var(--step-1)]", 300, false], ["text-[length:var(--step-3)]", 400, true],
  ["text-[length:var(--step-2)]", 200, false],
] as const;

const line1 = "You did not begin with a blank mind.".split(" ");

export function ActOne() {
  const scene = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          ok: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const reduce = Boolean(ctx.conditions?.reduce);
          const f = frame.current!;
          const words = gsap.utils.toArray<HTMLElement>(".inf-word", f);
          const rnd = seeded(7);
          const jitter = words.map(() => (rnd() - 0.5) * 0.5);
          const n = words.length;
          const W = () => f.clientWidth;
          const H = () => f.clientHeight;
          const angle = (i: number) => (i / n) * Math.PI * 2 - Math.PI / 2 + jitter[i];

          // Three positions: beyond the frame, a tight orbit, and the framing ellipse.
          const start = (i: number, axis: "x" | "y") => {
            const r = Math.max(W(), H()) * 0.78;
            return axis === "x" ? Math.cos(angle(i)) * r : Math.sin(angle(i)) * r;
          };
          const orbit = (i: number, axis: "x" | "y") => {
            const r = Math.min(W(), H()) * (0.22 + (i % 3) * 0.05);
            return axis === "x" ? Math.cos(angle(i)) * r : Math.sin(angle(i)) * r;
          };
          const halo = (i: number, axis: "x" | "y") => {
            const rx = W() * 0.44;
            const ry = H() * 0.42;
            return axis === "x" ? Math.cos(angle(i)) * rx : Math.sin(angle(i)) * ry;
          };

          gsap.set(words, { xPercent: -50, yPercent: -50 });

          if (reduce) {
            // Final composition, static.
            gsap.set(words, {
              x: (i) => halo(i, "x"),
              y: (i) => halo(i, "y"),
              opacity: 0.45,
              scale: 0.8,
            });
            gsap.set(".line1-word", { yPercent: 0 });
            // The opening line becomes a kicker above the title.
            gsap.set(".line1", { opacity: 0.8, y: () => -H() * 0.34, scale: 0.5 });
            gsap.set(".title-line", { yPercent: 0 });
            gsap.set(".cue", { opacity: 0 });
            return;
          }

          gsap.set(words, { x: (i) => start(i, "x"), y: (i) => start(i, "y"), opacity: 0, scale: 1.1 });
          gsap.set(".title-line", { yPercent: 105 });
          gsap.set(".line1-word", { yPercent: 110 });
          // The first line arrives on its own, before the reader has done anything.
          gsap.to(".line1-word", { yPercent: 0, stagger: 0.09, duration: 1.1, delay: 0.5, ease: "power3.out" });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scene.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          tl.to(".cue", { opacity: 0, duration: 0.03 }, 0.04)
            .to(
              words,
              {
                x: (i) => orbit(i, "x"),
                y: (i) => orbit(i, "y"),
                opacity: 1,
                scale: 1,
                duration: 0.34,
                stagger: { each: 0.012, from: "random" },
                ease: "power2.out",
              },
              0.12,
            )
            .to(".line1", { y: -40, opacity: 0, duration: 0.08, ease: "power1.in" }, 0.42)
            .to(
              words,
              {
                x: (i) => orbit(i, "x") * 0.72,
                y: (i) => orbit(i, "y") * 0.72,
                duration: 0.08,
                ease: "power1.inOut",
              },
              0.48,
            )
            .to(
              words,
              {
                x: (i) => halo(i, "x"),
                y: (i) => halo(i, "y"),
                opacity: 0.45,
                scale: 0.8,
                duration: 0.2,
                stagger: { each: 0.006, from: "center" },
                ease: "power3.inOut",
              },
              0.56,
            )
            .to(".title-line", { yPercent: 0, stagger: 0.05, duration: 0.18, ease: "power3.out" }, 0.64)
            .to({}, { duration: 0.12 }); // hold
        },
      );
      return () => mm.revert();
    },
    { scope: scene },
  );

  return (
    <>
      <div ref={scene} className="pin-scene h-[340svh] md:h-[380svh]">
        <div ref={frame} className="pin-frame">
          {/* Act label */}
          <p className="mono absolute left-[var(--gutter)] top-[4.75rem] z-10 text-fg-3">
            Act I <span aria-hidden className="mx-2">·</span> The Question
          </p>
          <p className="mono absolute right-[var(--gutter)] top-[4.75rem] z-10 text-fg-3">No. 01</p>

          {/* Opening line */}
          <p className="line1 serif absolute left-1/2 top-1/2 w-[min(90vw,22ch)] -translate-x-1/2 -translate-y-1/2 text-center text-[length:var(--step-3)] leading-[1.1] text-fg">
            {line1.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span className="line1-word inline-block will-change-transform">{w}&nbsp;</span>
              </span>
            ))}
          </p>

          {/* Sixteen influences */}
          <div aria-hidden className="absolute left-1/2 top-1/2 h-0 w-0">
            {influenceWords.map((w, i) => {
              const [size, weight, italic] = voices[i % voices.length];
              return (
                <span
                  key={w}
                  className={`inf-word absolute whitespace-nowrap font-display will-change-transform ${size} ${italic ? "italic" : ""}`}
                  style={{
                    fontWeight: weight,
                    fontVariationSettings: `"opsz" 96, "SOFT" ${italic ? 60 : 20}, "WONK" 1`,
                    color: i % 5 === 0 ? "var(--vermilion-2)" : "var(--parchment)",
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>

          {/* The title */}
          <h1 className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-[var(--gutter)] text-center">
            <span className="block overflow-hidden pb-[0.1em]">
              <span className="title-line display-light block text-[length:var(--step-2)] text-fg-2 will-change-transform">How much</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="title-line display block text-[length:var(--step-6)] text-fg will-change-transform">of what you believe</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="title-line display block text-[length:var(--step-4)] italic text-fg-2 will-change-transform" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1' }}>
                is actually
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.15em]">
              <span className="title-line display-strong block text-[length:var(--step-6)] text-vermilion-2 will-change-transform">yours?</span>
            </span>
          </h1>

          {/* Scroll cue */}
          <p className="cue mono absolute bottom-8 left-1/2 -translate-x-1/2 text-fg-3">
            Scroll <span aria-hidden>↓</span>
          </p>
        </div>
      </div>

      {/* Transition band: ink dissolves into parchment */}
      <div aria-hidden className="h-[28svh] bg-gradient-to-b from-ink to-parchment" />

      {/* Prologue in the reading column */}
      <div data-surface="parchment" className="pb-24 pt-4">
        <Column>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,64ch)_minmax(14rem,20rem)] lg:gap-16">
            <Prose>
              <p className="lead">
                We all hold opinions about morality, politics, religion, success, identity, and what makes
                a life meaningful. We experience them as ours. But each of us arrived in a world that was
                already talking, and we learned to speak before we learned to doubt.
              </p>
              <p>
                This is an inquiry into where convictions come from. It draws on the moral psychology of
                Jonathan Haidt, on a two-hundred-year-old play about a scholar who knew everything and
                understood nothing, and on a body of research about how people actually arrive at the
                views they defend. It will not tell you which of your beliefs to keep. It will try to show
                you where to look.
              </p>
            </Prose>
            <aside className="mono-lc text-fg-3">
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-rule pt-4">
                <dt className="mono">Desk</dt>
                <dd>Mind</dd>
                <dt className="mono">Reading</dt>
                <dd>About seven minutes</dd>
                <dt className="mono">Form</dt>
                <dd>Six acts, three instruments</dd>
                <dt className="mono">Sources</dt>
                <dd>
                  <a href="#sources" className="ink-link">
                    Eighteen, at the end
                  </a>
                </dd>
              </dl>
              <p className="mt-6 text-[length:var(--step--2)] leading-relaxed">
                Markers like <span className="register" data-level="established">Established</span>{" "}
                <span className="register" data-level="theory">Theory</span>{" "}
                <span className="register" data-level="contested">Contested</span>{" "}
                <span className="register" data-level="editorial">Ours</span> show how much weight a claim can bear.
              </p>
            </aside>
          </div>
        </Column>
      </div>
    </>
  );
}
