"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP, seeded, usePrefersReducedMotion } from "@/lib/motion";
import { ActHead } from "@/components/story/Act";
import { Column, Prose, Ref, RegisterTag, Aside, Spread, Pull } from "@/components/story/Prose";

const faculties = ["Philosophy", "Law", "Medicine", "Theology"];

const pool = [
  // Faust’s own words and the apparatus of learning
  "Habe nun, ach!", "mit heißem Bemühn", "Da steh ich nun", "ich armer Tor", "so klug als wie zuvor",
  "was die Welt im Innersten zusammenhält", "Zwei Seelen", "Magister", "Doktor", "ten years",
  "a lecture", "a gloss", "a commentary", "a commentary on the commentary", "a footnote", "a concordance",
  "a translation", "a disputation", "an index", "a quarto", "an alembic", "a skull on the desk",
  // The modern archive
  "a tab", "another tab", "a thread", "a summary", "a summary of a summary", "an explainer",
  "a notification", "a feed", "a podcast at 1.5×", "a bookmark", "a saved article", "a screenshot",
  "a citation", "a preprint", "a correction", "a retraction", "a hot take", "a cold take",
  "a dataset", "a dashboard", "a forecast", "a model", "a model of the model", "a search result",
  "a definition", "a counter-example", "an edge case", "a rule of thumb", "a figure", "a table",
  "a statistic", "a confidence interval", "a quotation", "a misquotation", "an anecdote",
  // Disciplines, old and new
  "Astronomy", "Rhetoric", "Grammar", "Logic", "Arithmetic", "Geometry", "Music", "Alchemy",
  "Anatomy", "Economics", "Statistics", "Psychology", "Sociology", "Linguistics", "Neuroscience",
  "Game theory", "Information theory", "Epistemology", "Ethics", "History", "Political science",
];

interface Frag { text: string; x: number; y: number; depth: number; tier: number; size: number; italic: boolean; rot: number }

function buildField(count: number): Frag[] {
  const rnd = seeded(23);
  const out: Frag[] = [];
  for (let i = 0; i < count; i++) {
    const tier = i < 4 ? 0 : i < 16 ? 1 : i < 48 ? 2 : i < 120 ? 3 : 4;
    out.push({
      text: i < 4 ? faculties[i] : pool[Math.floor(rnd() * pool.length)],
      x: 4 + rnd() * 92,
      y: 4 + rnd() * 92,
      depth: 0.3 + rnd() * 1.2,
      tier,
      size: tier === 0 ? 1.6 : tier === 1 ? 1.15 : tier === 2 ? 0.95 : tier === 3 ? 0.8 : 0.7,
      italic: rnd() > 0.55,
      rot: (rnd() - 0.5) * (tier > 2 ? 10 : 3),
    });
  }
  return out;
}

export function ActFive() {
  const scene = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const field = useMemo(() => buildField(220), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", ok: "(prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const el = scene.current!;
          const counter = el.querySelector<HTMLElement>(".counter")!;
          const fieldEl = el.querySelector<HTMLElement>(".field")!;
          const q = el.querySelector<HTMLElement>(".question")!;
          const fac = el.querySelector<HTMLElement>(".faculties")!;
          const vars = { t1: 0, t2: 0, t3: 0, t4: 0, y: 0, blur: 0, dim: 1, count: 4 };
          const apply = () => {
            fieldEl.style.setProperty("--t1", String(vars.t1));
            fieldEl.style.setProperty("--t2", String(vars.t2));
            fieldEl.style.setProperty("--t3", String(vars.t3));
            fieldEl.style.setProperty("--t4", String(vars.t4));
            fieldEl.style.setProperty("--y", `${vars.y}px`);
            fieldEl.style.setProperty("--blur", `${vars.blur}px`);
            fieldEl.style.setProperty("--dim", String(vars.dim));
            counter.textContent = vars.count >= 219 ? "…" : String(Math.round(vars.count)).padStart(3, "0");
          };
          if (ctx.conditions?.reduce) {
            Object.assign(vars, { t1: 1, t2: 1, t3: 1, t4: 1, blur: 2.5, dim: 0.35, count: 219 });
            apply();
            gsap.set(q, { opacity: 1, y: 0 });
            gsap.set(fac, { opacity: 0 });
            return;
          }
          apply();
          gsap.set(q, { opacity: 0, y: 30 });
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 },
            onUpdate: apply,
          });
          tl.to(vars, { y: -260, duration: 1 }, 0)
            .to(fac, { opacity: 0, y: -40, duration: 0.1 }, 0.12)
            .to(vars, { t1: 1, count: 16, duration: 0.14, ease: "power1.out" }, 0.1)
            .to(vars, { t2: 1, count: 48, duration: 0.16, ease: "power1.out" }, 0.26)
            .to(vars, { t3: 1, count: 120, duration: 0.16, ease: "power1.in" }, 0.42)
            .to(vars, { t4: 1, count: 219, duration: 0.16, ease: "power2.in" }, 0.56)
            .to(vars, { blur: 3, dim: 0.3, duration: 0.14 }, 0.7)
            .to(q, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.76)
            .to({}, { duration: 0.12 });
        },
      );
      return () => mm.revert();
    },
    { scope: scene, dependencies: [reduced] },
  );

  return (
    <div>
      <Column className="pt-24 md:pt-32">
        <ActHead numeral="V" label="The Search for Understanding" theme="What does it mean to truly know something?" />
        <Prose className="mb-6">
          <p className="lead">
            In 1808 Goethe published the first part of a play about a scholar who had mastered every
            faculty his university offered and found, at the end of it, that he understood nothing he
            actually wanted to understand. The scholar’s name was Faust.<Ref n={16} />
          </p>
        </Prose>
      </Column>

      {/* The field */}
      <div ref={scene} className={reduced ? "relative h-[100svh]" : "pin-scene h-[480svh]"}>
        <div className="pin-frame">
          <p className="mono absolute left-[var(--gutter)] top-6 z-20 text-fg-3">
            Fragments <span aria-hidden className="mx-2">·</span> <span className="counter tabular-nums">004</span>
          </p>
          <p className="mono absolute right-[var(--gutter)] top-6 z-20 text-fg-3">Faust, scene i</p>

          <div
            className="field absolute inset-0"
            aria-hidden
            style={{
              // @ts-expect-error custom properties
              "--t1": 0, "--t2": 0, "--t3": 0, "--t4": 0, "--y": "0px", "--blur": "0px", "--dim": 1,
              filter: "blur(var(--blur))",
              opacity: "var(--dim)",
              transition: "none",
            }}
          >
            {field.map((f, i) =>
              f.tier === 0 ? null : (
                <span
                  key={i}
                  className={`absolute whitespace-nowrap font-display ${f.italic ? "italic" : ""}`}
                  style={{
                    left: `${f.x}%`,
                    top: `${f.y}%`,
                    fontSize: `calc(var(--step-0) * ${f.size})`,
                    fontVariationSettings: '"opsz" 14, "SOFT" 30',
                    opacity: `var(--t${f.tier})`,
                    transform: `translate(-50%, calc(-50% + var(--y) * ${f.depth.toFixed(2)})) rotate(${f.rot.toFixed(1)}deg) scale(calc(0.8 + 0.2 * var(--t${f.tier})))`,
                    color: f.tier >= 3 ? "var(--fg-3)" : f.tier === 2 ? "var(--fg-2)" : "var(--fg)",
                  }}
                >
                  {f.text}
                </span>
              ),
            )}
          </div>

          {/* The four faculties: the first fragments */}
          <div className="faculties absolute inset-0 flex items-center justify-center px-[var(--gutter)]">
            <p className="display text-center text-[length:var(--step-4)] italic leading-[1.05] text-fg" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}>
              {faculties.map((f, i) => (
                <span key={f} className="inline-block">
                  {f}
                  {i < faculties.length - 1 && <span aria-hidden className="mx-[0.35em] text-fg-3">·</span>}
                </span>
              ))}
            </p>
          </div>

          {/* The question emerges from the noise */}
          <div className="question absolute inset-0 z-10 flex items-center justify-center px-[var(--gutter)]">
            <p className="display max-w-[16ch] text-center text-[length:var(--step-5)] text-fg">
              Does knowing more necessarily mean <em className="text-accent">understanding</em> more?
            </p>
          </div>
        </div>
      </div>

      <Column className="pb-24 pt-20 md:pb-32">
        <Spread
          margin={
            <Aside label="Faust, scene i, in Bayard Taylor’s translation">
              <blockquote className="serif-text italic text-fg">
                I&rsquo;ve studied now Philosophy<br />
                And Jurisprudence, Medicine,&mdash;<br />
                And even, alas! Theology,&mdash;<br />
                From end to end, with labor keen;<br />
                And here, poor fool! with all my lore<br />
                I stand, no wiser than before.
              </blockquote>
              <p className="mono-lc mt-3 text-fg-3">Goethe, Faust I, lines 354–359.<Ref n={17} /></p>
              <p className="mt-6 mb-2"><RegisterTag level="established" /> The illusion of explanatory depth.<Ref n={15} /></p>
              <p><RegisterTag level="editorial" /> The parallel between Faust&rsquo;s study and a modern feed is our reading, not Goethe&rsquo;s argument and not Haidt&rsquo;s.</p>
            </Aside>
          }
        >
          <Prose>
            <p className="versal">
              Faust’s complaint is not that he knows too little. He has, by his own account, studied
              everything there was to study. What he wants is something the accumulation never delivered:
              to recognise, in his phrase, what holds the world together in its innermost part. Knowledge
              was the inheritance his age offered him, four faculties deep, and he took all of it. It left
              him standing where he started.<Ref n={16} />
            </p>
            <p>
              The connection to Haidt is not that Goethe anticipated moral psychology. It is an editorial
              one, and it should be held as such. Faust’s learning was, in a sense, the inheritance of Act
              II at its most refined: a complete set of approved ways of seeing. His crisis was the
              discovery that a complete set of inherited answers is not the same as understanding. The
              play’s response to that crisis is one we won’t spoil here. The question is the part that
              travels.
            </p>
            <p>
              Because the accumulation has not stopped. A reader today holds more information than any
              Renaissance library, and much of it arrives pre-interpreted: a summary of a summary, a verdict
              with the reasoning removed. There is good evidence that this changes how we feel about what
              we know. Leonid Rozenblit and Frank Keil found that people confidently overestimate how well
              they understand ordinary mechanisms, zips, toilets, bicycles, until they are asked to explain
              one step by step, at which point the confidence collapses.<Ref n={15} /> The feeling of
              understanding is cheap. Understanding itself is not.
            </p>
            <Pull>Information accumulates. Understanding has to be done, each time, by someone.</Pull>
            <p>
              None of this is an argument that knowledge is futile, or that Faust should have read less.
              It is a distinction. To know something, in the sense that matters here, is to have examined
              it: to be able to say where it came from, what would change your mind, and what it would cost
              you to be wrong. By that measure, a person with a few beliefs they have genuinely worked
              through may understand more than one with thousands they have merely received.
            </p>
            <p>
              Faust says, in one of the play’s most quoted lines, that two souls live in his breast.
              <Ref n={17} /> It is tempting to hear the elephant and the rider in that. We’d rather leave it
              as he left it: a divided creature, restless with what it has been given, and not yet finished.
            </p>
          </Prose>
        </Spread>
      </Column>
    </div>
  );
}
