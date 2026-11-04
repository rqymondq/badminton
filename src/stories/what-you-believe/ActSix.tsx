"use client";

import { useId, useRef, useState } from "react";
import { gsap, useGSAP, usePrefersReducedMotion } from "@/lib/motion";
import { influenceWords } from "./data";
import { ActHead } from "@/components/story/Act";
import { Column, Prose, Ref, RegisterTag, Aside, Pull } from "@/components/story/Prose";

type Kept = { text: string } | null;

export function ActSix() {
  const root = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  const [kept, setKept] = useState<Kept>(null);
  const [released, setReleased] = useState(false);
  const reduced = usePrefersReducedMotion();
  const id = useId();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const words = gsap.utils.toArray<HTMLElement>(".ring-word", ringRef.current!);
        gsap.from(words, {
          opacity: 0,
          scale: 0.6,
          stagger: { each: 0.04, from: "random" },
          ease: "power3.out",
          duration: 1,
          scrollTrigger: { trigger: ringRef.current, start: "top 75%", end: "top 35%", scrub: 0.6 },
        });
        // Slow turning; counter-rotate the words so they stay upright.
        gsap.to(".ring-turn", { rotation: 360, duration: 180, repeat: -1, ease: "none" });
        gsap.to(words, { rotation: -360, duration: 180, repeat: -1, ease: "none" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const keep = () => {
    const text = draft.trim();
    if (!text) return;
    setKept({ text });
    setReleased(false);
  };
  const release = () => {
    setReleased(true);
    setKept(null);
    setDraft("");
  };

  const n = influenceWords.length;

  return (
    <div ref={root} className="py-24 md:py-32">
      <Column>
        <ActHead numeral="VI" label="The Unfinished Mind" theme="Perhaps thinking independently doesn’t mean thinking without influence." />

        <div className="grid gap-12 lg:grid-cols-[minmax(24rem,1fr)_minmax(0,58ch)] lg:gap-16">
          {/* The ring returns */}
          <div className="relative mx-auto aspect-square w-full max-w-[560px] lg:sticky lg:top-8 lg:self-start" ref={ringRef} aria-hidden>
            <div className="ring-turn absolute inset-0">
              {influenceWords.map((w, i) => {
                const a = (i / n) * Math.PI * 2 - Math.PI / 2;
                const r = 46;
                return (
                  <span
                    key={w}
                    className="ring-word serif absolute text-[length:var(--step--1)] text-fg"
                    style={{
                      left: `${50 + Math.cos(a) * r}%`,
                      top: `${50 + Math.sin(a) * r}%`,
                      transform: "translate(-50%, -50%)",
                      fontVariationSettings: '"opsz" 24, "SOFT" 20',
                    }}
                  >
                    {w}
                  </span>
                );
              })}
            </div>
            <div className="absolute inset-[18%] rounded-full border border-rule" />
            <div className="absolute inset-[34%] rounded-full border border-dashed border-rule" />
            <div className="absolute inset-0 flex items-center justify-center px-10 text-center">
              {kept ? (
                <p
                  className="serif text-[length:var(--step-1)] italic text-accent"
                  style={{ fontVariationSettings: '"opsz" 36, "SOFT" 60', animation: reduced ? "none" : "breathe 6s ease-in-out infinite" }}
                >
                  {kept.text}
                </p>
              ) : released ? (
                <p className="mono text-fg-3">let go</p>
              ) : (
                <p className="mono text-fg-3">you</p>
              )}
            </div>
          </div>

          <div>
            <Prose>
              <p className="versal">
                Here is the ring again. In the opening it gathered around an empty centre and became a
                worldview before you could read the words. You can read them now. That is most of what has
                changed, and it is not nothing.
              </p>
              <p>
                It would be easy to end with an escape fantasy: strip away the inheritance, silence the
                elephant, reason from nowhere. Nobody does this. The research we have walked through
                suggests nobody can.<Ref n={2} /><Ref n={13} /> Every thinker who ever examined a received
                belief did it with tools they had also received: a language, a logic, a sense of what
                counts as a good reason. Independence of that kind is not available to anyone.
              </p>
              <p>
                But there is another kind. It consists not in having no influences but in being able to
                name them; not in having no intuitions but in noticing when one has arrived before its
                reasons; not in refusing inheritance but in auditing it, slowly, one belief at a time,
                preferably in the company of someone who weights the world differently.<Ref n={14} /> On
                this account, an independent mind is not an uninfluenced one. It is an unfinished one.
              </p>
              <Pull>Not a mind without influences. A mind that can read its own.</Pull>
            </Prose>

            {/* The private instrument */}
            <div className="mt-14 border-t border-fg pt-8">
              <p className="mono text-fg-3">Instrument 3 <span aria-hidden className="mx-2">·</span> One line, for you</p>
              <label htmlFor={`${id}-belief`} className="serif mt-4 block text-[length:var(--step-2)] leading-tight">
                What is one belief you&rsquo;ve never seriously questioned?
              </label>
              <textarea
                id={`${id}-belief`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                placeholder="Write it here. Or just think it."
                disabled={Boolean(kept)}
                className="mt-6 w-full resize-none border-b border-fg bg-transparent py-2 font-display text-[length:var(--step-1)] italic outline-none placeholder:text-fg-3 focus:border-accent disabled:opacity-60"
                style={{ fontVariationSettings: '"opsz" 30, "SOFT" 50' }}
              />
              <div className="mt-5 flex flex-wrap items-center gap-4">
                {!kept ? (
                  <button
                    type="button"
                    onClick={keep}
                    disabled={!draft.trim()}
                    className="mono border border-fg px-5 py-3 transition-colors hover:bg-fg hover:text-bg focus-visible:bg-fg focus-visible:text-bg disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Keep it in the ring
                  </button>
                ) : (
                  <button type="button" onClick={release} className="mono border border-fg px-5 py-3 transition-colors hover:bg-fg hover:text-bg focus-visible:bg-fg focus-visible:text-bg">
                    Let it go
                  </button>
                )}
                <p className="mono-lc text-fg-3">
                  Nothing you write here is stored or sent. It lives in this tab, and leaves with it.
                </p>
              </div>
              <p className="mt-6 max-w-[52ch] text-[length:var(--step--1)] leading-relaxed text-fg-2" aria-live="polite">
                {kept
                  ? "It sits among the others now: not because it was given to you, but because you looked at it. That is the only difference this inquiry has been about."
                  : released
                    ? "Gone. Though you may find it is still there tomorrow. Most of them are."
                    : "You don’t have to write it down. Naming it, even silently, is the first act of examination."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-[minmax(0,60ch)_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="mono text-fg-3">Coda</p>
            <p className="display mt-6 text-[length:var(--step-4)] leading-[1.02]">
              The question was never whether your beliefs were given to you. <span className="text-accent">They were.</span> The question is what you do with them now that you know.
            </p>
            <p className="serif mt-10 max-w-[44ch] text-[length:var(--step-1)] text-fg-2">
              Faust leaves his study. What he finds there is another story, and a long one. Yours is still open.
            </p>
          </div>
          <Aside label="Registers">
            <p className="mb-2"><RegisterTag level="editorial" /> The account of independence as examination rather than absence of influence is ours.</p>
            <p><RegisterTag level="theory" /> That reasoning works better in exchange than in isolation.<Ref n={14} /></p>
          </Aside>
        </div>
      </Column>
    </div>
  );
}
