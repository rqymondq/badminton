"use client";

import { useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";
import { ActHead } from "@/components/story/Act";
import { Column, Prose, Ref, RegisterTag, Aside, Spread, Pull } from "@/components/story/Prose";

type Lens = "rules" | "loyalty" | "both";

const facts: { text: string; lens: Lens }[] = [
  { text: "She has practised for twenty-eight years without a complete licence.", lens: "rules" },
  { text: "No patient is known to have been harmed by her care.", lens: "loyalty" },
  { text: "The examination exists to protect patients who cannot assess a doctor themselves.", lens: "rules" },
  { text: "The nearest alternative clinic is a two-hour drive. In winter it is often unreachable.", lens: "loyalty" },
  { text: "Other doctors who completed the examination were held to it.", lens: "rules" },
  { text: "She came home when no one else would.", lens: "loyalty" },
  { text: "If an exception is made, the next case will cite this one.", lens: "rules" },
  { text: "The town has petitioned, twice, to keep her.", lens: "loyalty" },
  { text: "She did not disclose it. An audit did.", lens: "both" },
];

const lenses = {
  rules: {
    name: "Equal rules",
    foundation: "Fairness as equal treatment · Respect for institutions",
    notices: "That the rule was the same for everyone, and that she alone was excused from it, by herself.",
    fears: "That rules become negotiable for whoever is sympathetic, and that the next exception will be less deserving.",
    values: "Impartiality. Protection of people who cannot judge expertise for themselves. Trust in a system that does not bend.",
    vulnerable: "It can mistake the procedure for the purpose the procedure was built to serve.",
    color: "var(--vermilion)",
  },
  loyalty: {
    name: "Standing loyalty",
    foundation: "Loyalty · Care · Reciprocity",
    notices: "Twenty-eight winters. The obligations that were honoured when no form required it.",
    fears: "That a distant institution will harm the very people it claims to protect, and feel righteous doing it.",
    values: "Reciprocity. Lived consequence over abstract rule. A community’s right to weigh its own risks.",
    vulnerable: "It can mistake affection for evidence, and familiarity for competence.",
    color: "var(--lapis)",
  },
};

export function ActFour() {
  const [t, setT] = useState(50); // 0 = all rules, 100 = all loyalty
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const w = t / 100;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".lens-wash",
          { clipPath: "inset(0 50% 0 50%)" },
          {
            clipPath: "inset(0 0% 0 0%)",
            ease: "power2.out",
            scrollTrigger: { trigger: ".lens-stage", start: "top 80%", end: "top 30%", scrub: 0.5 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const weightFor = (lens: Lens) => (lens === "rules" ? 1 - w : lens === "loyalty" ? w : 0.5 + Math.abs(w - 0.5) * 0.4);
  const activeLens = w < 0.5 ? lenses.rules : lenses.loyalty;
  const strength = Math.abs(w - 0.5) * 2; // 0 at centre, 1 at an edge

  return (
    <div ref={root} className="py-24 md:py-32">
      <Column>
        <ActHead numeral="IV" label="Two Minds, One World" theme="How can two thoughtful people look at the same issue and see different things?" />
        <Prose className="mb-12">
          <p className="lead">
            Here is a case. It is invented, but the shape of it is not. Read it once, as yourself. Then use
            the instrument to look at it through two different sets of eyes, neither of which is foolish.
          </p>
        </Prose>
      </Column>

      {/* The stage */}
      <div className="lens-stage relative">
        <div
          aria-hidden
          className="lens-wash absolute inset-0"
          style={{
            background: `linear-gradient(90deg, color-mix(in oklab, var(--vermilion) ${18 + (1 - w) * 14}%, var(--parchment)) 0%, color-mix(in oklab, var(--vermilion) ${12 + (1 - w) * 10}%, var(--parchment)) ${Math.max(28, t - 14)}%, color-mix(in oklab, var(--lapis) ${12 + w * 10}%, var(--parchment)) ${Math.min(72, t + 14)}%, color-mix(in oklab, var(--lapis) ${18 + w * 14}%, var(--parchment)) 100%)`,
            transition: "background 0.3s linear",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-ink/40" style={{ left: `${t}%`, transition: "left 0.2s linear" }} />

        <Column className="relative py-14 md:py-20">
          <div className="mx-auto max-w-[760px] text-center">
            <p className="mono text-fg-3">Instrument 2 <span aria-hidden className="mx-2">·</span> The Village Doctor</p>
            <p className="serif mt-5 text-[length:var(--step-1)] leading-snug">
              For twenty-eight years Dr. M. has been the only physician in a mountain town of nine hundred
              people. A records audit reveals that she never completed her final licensing examination:
              she left her training a term early to come home when the previous doctor died. Her patients’
              outcomes, as far as anyone can measure them, match or beat the regional average. The regulator
              must decide whether she may continue to practise.
            </p>
          </div>

          {/* Slider */}
          <div className="mx-auto mt-12 max-w-[760px]">
            <div className="mb-3 flex items-baseline justify-between">
              <label htmlFor={`${id}-lens`} className="mono" style={{ color: "var(--oxblood)" }}>
                {lenses.rules.name}
              </label>
              <span className="mono text-fg-3">Drag or use arrow keys</span>
              <span className="mono" style={{ color: "var(--lapis)" }}>{lenses.loyalty.name}</span>
            </div>
            <input
              id={`${id}-lens`}
              type="range"
              min={0}
              max={100}
              step={1}
              value={t}
              onChange={(e) => setT(Number(e.target.value))}
              onPointerUp={() => trackEvent("instrument_lens_used", { leaning: t < 40 ? "rules" : t > 60 ? "loyalty" : "centre" })}
              onKeyUp={() => trackEvent("instrument_lens_used", { leaning: t < 40 ? "rules" : t > 60 ? "loyalty" : "centre" })}
              className="lens"
              aria-valuetext={`${Math.round(100 - t)} percent equal rules, ${Math.round(t)} percent standing loyalty`}
            />
          </div>

          {/* The same facts, reweighted */}
          <ol className="mx-auto mt-14 max-w-[760px] space-y-3" aria-label="The facts of the case">
            {facts.map((f, i) => {
              const wt = weightFor(f.lens);
              const color = f.lens === "rules" ? "var(--oxblood)" : f.lens === "loyalty" ? "var(--lapis)" : "var(--ink)";
              return (
                <li
                  key={i}
                  className="grid grid-cols-[2.5rem_1fr] items-baseline gap-3 font-display"
                  style={{
                    opacity: 0.3 + wt * 0.7,
                    fontSize: `calc(var(--step-0) * ${0.95 + wt * 0.32})`,
                    fontVariationSettings: `"opsz" ${14 + wt * 30}, "SOFT" ${wt * 40}`,
                    fontWeight: 350 + wt * 300,
                    lineHeight: 1.3,
                    transition: "opacity 0.3s, font-size 0.3s, font-weight 0.3s, font-variation-settings 0.3s",
                    color: wt > 0.55 ? color : "var(--ink)",
                  }}
                >
                  <span className="mono text-fg-3" style={{ fontSize: "var(--step--2)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    {f.text}
                    {f.lens === "both" && <span className="mono ml-2 text-fg-3" style={{ fontSize: "var(--step--2)" }}>both lenses</span>}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* Interpretations */}
          <div className="mx-auto mt-14 grid max-w-[1000px] gap-8 md:grid-cols-2">
            {(["rules", "loyalty"] as const).map((k) => {
              const L = lenses[k];
              const own = k === "rules" ? 1 - w : w;
              return (
                <article
                  key={k}
                  aria-label={`${L.name} interpretation`}
                  className="border-t pt-5"
                  style={{ borderColor: L.color, opacity: 0.45 + own * 0.55, transition: "opacity 0.3s" }}
                >
                  <p className="serif text-[length:var(--step-2)]" style={{ color: L.color }}>{L.name}</p>
                  <p className="mono-lc mt-1 text-fg-3">{L.foundation}</p>
                  <dl className="mt-5 space-y-4 text-[length:var(--step--1)] leading-relaxed">
                    <div><dt className="mono text-fg-3">What it notices</dt><dd className="mt-1">{L.notices}</dd></div>
                    <div><dt className="mono text-fg-3">What it fears</dt><dd className="mt-1">{L.fears}</dd></div>
                    <div><dt className="mono text-fg-3">What it values</dt><dd className="mt-1">{L.values}</dd></div>
                    <div><dt className="mono text-fg-3">Where it is vulnerable</dt><dd className="mt-1 italic">{L.vulnerable}</dd></div>
                  </dl>
                </article>
              );
            })}
          </div>

          <p className="mono-lc mx-auto mt-10 max-w-[60ch] text-center text-fg-3" aria-live="polite">
            {strength < 0.15
              ? "At the centre, every fact weighs the same. Most of us do not live here."
              : `Leaning ${activeLens.name.toLowerCase()}: the facts that fit grow; the others fade. They are still there.`}
          </p>
        </Column>
      </div>

      <Column className="pt-20">
        <Spread
          margin={
            <Aside label="Registers">
              <p className="mb-2"><RegisterTag level="theory" /> Moral foundations theory: that moral judgment draws on several distinct intuitive systems, weighted differently across people and cultures.<Ref n={6} /></p>
              <p className="mb-2"><RegisterTag level="contested" /> Which foundations exist, and whether &ldquo;foundations&rdquo; is the right frame at all. Morality-as-cooperation is one rival.<Ref n={7} /></p>
              <p><RegisterTag level="editorial" /> The two lenses above are our composition, built loosely on those ideas. They are a teaching device, not a taxonomy.</p>
            </Aside>
          }
        >
          <Prose>
            <p className="versal">
              Notice what the instrument did not do. It did not change the facts. It changed their weight.
              The person who leans toward equal rules is not blind to twenty-eight winters; they have
              decided that a rule which bends for the sympathetic is no longer a rule. The person who leans
              toward loyalty is not indifferent to the exam; they have decided that a form is a poor
              measure of what a doctor owes a town.
            </p>
            <p>
              This is the part of Haidt’s work that travels furthest. Moral foundations theory proposes that
              human moral judgment draws on several distinct intuitive systems: care, fairness, loyalty,
              authority, sanctity, and later liberty, among candidates.<Ref n={6} /> People and cultures
              weight them differently. Where you grew up, and whom you grew up admiring, tunes the mix. When
              two people disagree, it is often not because one has reasoned badly but because they are
              running the same facts through differently weighted instruments.
            </p>
            <p>
              The theory is contested in its details. Which foundations are real, how many there are, and
              whether &ldquo;foundations&rdquo; is even the right metaphor are open questions; a rival account
              describes morality as a set of solutions to recurring problems of cooperation.<Ref n={7} />
              But the practical lesson survives the dispute. Haidt’s own phrase for it is that morality binds
              and blinds.<Ref n={1} /> It binds us to those who share our weighting, and it blinds us to the
              possibility that a different weighting is also a way of caring.
            </p>
            <Pull>Disagreement is often a difference in weighting, not in intelligence or good faith.</Pull>
            <p>
              Fact nine is the one to watch. Both lenses see it. Each reads it in its own light: a breach of
              trust, or a silence kept for the town’s sake. John Stuart Mill’s old warning applies with
              unusual force to the way we argue about each other: he who knows only his own side of the case
              knows little of that.<Ref n={18} />
            </p>
          </Prose>
        </Spread>
      </Column>
    </div>
  );
}
