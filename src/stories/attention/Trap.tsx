"use client";

import { useId, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Figure 3. A stylised collective trap.
 *
 * Payoffs (illustrative, not from the study):
 *   staying  = 1 + 4·s      where s is the share of your people who stay on
 *   leaving  = 6 − 5·s
 * At s = 1 you are better off staying (5 vs 1). At s = 0 you are better off
 * leaving (6 vs 1). Everyone staying scores 5; everyone leaving scores 6.
 * No one can get from the first world to the second alone.
 */
const stay = (s: number) => 1 + 4 * s;
const leave = (s: number) => 6 - 5 * s;
const N = 100;

export function Trap() {
  const [pct, setPct] = useState(100);
  const [together, setTogether] = useState(false);
  const id = useId();
  const s = pct / 100;
  const you = { stay: stay(s), leave: leave(s) };
  const best = you.stay >= you.leave ? "stay" : "leave";
  const people = useMemo(() => Array.from({ length: N }, (_, i) => i), []);
  const onCount = together ? 0 : Math.round(N * s);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:gap-12">
      <div>
        <div
          className="grid max-w-[26rem] grid-cols-10 gap-[5px] sm:gap-1.5"
          role="img"
          aria-label={`${onCount} of ${N} people on the platform, ${N - onCount} off.`}
        >
          {people.map((i) => {
            const on = i < onCount;
            const isYou = i === 44;
            return (
              <div
                key={i}
                className="aspect-square rounded-full border transition-colors duration-300"
                style={{
                  background: isYou ? (together || best === "leave" ? "var(--parchment)" : "var(--vermilion)") : on ? "var(--ink)" : "transparent",
                  borderColor: isYou ? "var(--vermilion)" : on ? "var(--ink)" : "var(--stone-2)",
                  borderWidth: isYou ? 2 : 1,
                }}
              />
            );
          })}
        </div>
        <div className="mono-lc mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-fg-3">
          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-ink" /> on the platform</span>
          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full border border-stone-2" /> off it</span>
          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full border-2 border-vermilion" /> you</span>
        </div>

        <div className="mt-8">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={`${id}-s`} className="mono text-fg-3">Share of your people who stay on</label>
            <span className="mono-lc tabular-nums">{together ? "0%" : `${pct}%`}</span>
          </div>
          <input
            id={`${id}-s`}
            type="range"
            min={0}
            max={100}
            step={5}
            value={together ? 0 : pct}
            disabled={together}
            onChange={(e) => { setPct(Number(e.target.value)); trackEvent("instrument_trap_used", { mode: "slider" }); }}
            className="lens mt-3 disabled:opacity-40"
            aria-valuetext={`${pct} percent of your people stay on`}
          />
          <label className="mt-5 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={together}
              onChange={(e) => { setTogether(e.target.checked); trackEvent("instrument_trap_used", { mode: "together" }); }}
              className="h-4 w-4 accent-[var(--vermilion)]"
            />
            <span className="mono text-fg-2">Everyone decides at once</span>
          </label>
        </div>
      </div>

      <div className="space-y-5 border-t border-fg pt-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0" aria-live="polite">
        {!together ? (
          <>
            <div>
              <p className="mono text-fg-3">If you stay</p>
              <p className="display text-[length:var(--step-3)] leading-none tabular-nums">{you.stay.toFixed(1)}</p>
            </div>
            <div>
              <p className="mono text-fg-3">If you leave on your own</p>
              <p className="display text-[length:var(--step-3)] leading-none tabular-nums">{you.leave.toFixed(1)}</p>
            </div>
            <div className="border-t border-rule pt-4">
              <p className="mono text-fg-3">Your best move</p>
              <p className="serif mt-1 text-[length:var(--step-2)]" style={{ color: best === "stay" ? "var(--oxblood)" : "var(--lapis)" }}>
                {best === "stay" ? "Stay." : "Leave."}
              </p>
              <p className="mt-2 max-w-[30ch] text-[length:var(--step--1)] leading-relaxed text-fg-2">
                {best === "stay"
                  ? "Leaving alone costs you the people who stayed. The trap is not that you lack willpower; it is that your best move depends on everyone else's."
                  : "Below a certain point the network is not worth the time. Notice how far the slider had to go."}
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="mono text-fg-3">Everyone stays (the world we are in)</p>
              <p className="display text-[length:var(--step-3)] leading-none tabular-nums">{stay(1).toFixed(1)}<span className="mono-lc text-fg-3"> each</span></p>
            </div>
            <div>
              <p className="mono text-fg-3">Everyone leaves together</p>
              <p className="display text-[length:var(--step-3)] leading-none tabular-nums text-lapis">{leave(0).toFixed(1)}<span className="mono-lc text-fg-3"> each</span></p>
            </div>
            <div className="border-t border-rule pt-4">
              <p className="mono text-fg-3">The gap</p>
              <p className="mt-2 max-w-[30ch] text-[length:var(--step--1)] leading-relaxed text-fg-2">
                The second world is better for everyone in it, and nobody can reach it by themselves. That is what the economists mean by a collective trap. It is a coordination problem wearing the costume of a personal failing.
              </p>
            </div>
          </>
        )}
        <p className="mono-lc text-[length:var(--step--2)] text-fg-3">
          Stylised payoffs for illustration. The study&rsquo;s own numbers are in the text.
        </p>
      </div>
    </div>
  );
}
