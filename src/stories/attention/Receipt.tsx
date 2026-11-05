"use client";

import { useEffect, useId, useState } from "react";
import { useReceipt } from "./ReceiptContext";
import { big, hoursLabel, MAX_HOURS, META, MIN_HOURS, money, regions, shareText, TYPICAL_SOCIAL_HOURS, US_MIN_WAGE, usd } from "./figures";
import { ShareBar } from "@/components/story/ShareBar";
import { trackEvent } from "@/lib/analytics";

/** A zig-zag edge, as on a torn thermal receipt. */
function teeth(n = 36, depth = 10): string {
  const pts: string[] = [];
  const step = 100 / n;
  // top edge
  for (let i = 0; i <= n; i++) pts.push(`${(i * step).toFixed(2)}% ${i % 2 === 0 ? 0 : depth}px`);
  // bottom edge
  for (let i = n; i >= 0; i--) pts.push(`${(i * step).toFixed(2)}% calc(100% - ${i % 2 === 0 ? 0 : depth}px)`);
  return `polygon(${pts.join(", ")})`;
}
const CLIP = teeth();

function Line({ label, value, strong = false, i }: { label: string; value: string; strong?: boolean; i: number }) {
  return (
    <div
      className="receipt-line flex items-baseline gap-2"
      style={{ ["--i" as string]: i }}
    >
      <span className={`mono-lc ${strong ? "text-ink" : "text-graphite"}`}>{label}</span>
      <span aria-hidden className="mb-[0.35em] flex-1 border-b border-dotted border-stone-2" />
      <span className={`mono-lc tabular-nums ${strong ? "text-ink" : "text-graphite"}`}>{value}</span>
    </div>
  );
}

export function Receipt({ withInputs = true, withShare = true }: { withInputs?: boolean; withShare?: boolean }) {
  const { receipt: r, region, hours, setRegion, setHours, touched } = useReceipt();
  const id = useId();
  const [printed, setPrinted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPrinted(true), 50);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (touched) trackEvent("receipt_adjusted", { region }, true);
  }, [touched, region]);

  const sharePath = `/investigations/attention?r=${region}&h=${hours}`;

  return (
    <div className="w-full max-w-[34rem]">
      {withInputs && (
        <div className="mb-6 space-y-5">
          <fieldset>
            <legend className="mono text-fg-3">Where do you mostly live?</legend>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Region">
              {regions.map((reg) => {
                const on = reg.key === region;
                return (
                  <button
                    key={reg.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setRegion(reg.key)}
                    className={`mono border px-3 py-1.5 text-[0.72rem] transition-colors ${
                      on ? "border-parchment bg-parchment text-ink" : "border-stone text-stone-2 hover:border-parchment hover:text-parchment"
                    }`}
                  >
                    {reg.short}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${id}-hours`} className="mono text-fg-3">
                Hours a day on Meta&rsquo;s apps
              </label>
              <span className="mono-lc tabular-nums text-fg">{hoursLabel(hours)}</span>
            </div>
            <input
              id={`${id}-hours`}
              type="range"
              min={MIN_HOURS}
              max={MAX_HOURS}
              step={0.25}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="lens mt-3"
              aria-valuetext={`${hoursLabel(hours)} a day`}
            />
            <p className="mono-lc mt-2 text-fg-3">
              Facebook, Instagram, WhatsApp, Messenger, Threads. The typical internet user reports {hoursLabel(TYPICAL_SOCIAL_HOURS)} a day on social media across all platforms.
            </p>
          </div>
        </div>
      )}

      <div
        className={`receipt-paper relative bg-parchment-2 px-6 py-7 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:px-8 ${printed ? "is-printed" : ""}`}
        style={{ clipPath: CLIP }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="receipt-line flex items-baseline justify-between" style={{ ["--i" as string]: 0 }}>
          <span className="mono text-ink">Palimpsest</span>
          <span className="mono text-graphite">Receipt No. 02</span>
        </div>
        <p className="receipt-line mono-lc mt-1 text-graphite" style={{ ["--i" as string]: 1 }}>
          Attention sold to advertisers via Meta Platforms, Inc. · FY{META.fiscalYear} figures
        </p>
        <div className="my-4 border-t border-dashed border-stone-2" />
        <div className="space-y-2">
          <Line i={2} label="Issued to" value={`One person, ${r.region.short}`} />
          <Line i={3} label="Attention supplied" value={`${hoursLabel(r.hoursPerDay)} / day`} />
          <Line i={4} label="Quantity" value={`${big(r.hoursPerYear)} hours / year`} />
          <Line i={5} label={`Revenue to Meta, ${META.fiscalYear}`} value={usd(r.perYear)} strong />
          <Line i={6} label="Per day" value={money(r.perDay)} />
        </div>
        <div className="my-4 border-t border-dashed border-stone-2" />
        <div className="receipt-line flex items-end justify-between gap-4" style={{ ["--i" as string]: 7 }}>
          <span className="mono text-ink">Price per hour</span>
          <span className="display text-[length:var(--step-4)] leading-none text-oxblood tabular-nums">{money(r.perHour)}</span>
        </div>
        <div className="my-4 border-t border-dashed border-stone-2" />
        <div className="space-y-2">
          <Line i={8} label="US federal minimum wage" value={`${usd(US_MIN_WAGE)} / hour`} />
          <Line i={9} label="Your hour, as sold" value={`1 / ${big(Math.round(r.minWageHours))} of that`} strong />
        </div>
        <p className="receipt-line mono-lc mt-5 text-[length:var(--step--2)] text-graphite" style={{ ["--i" as string]: 10 }}>
          Estimate from Meta&rsquo;s filed figures: worldwide revenue per person, scaled by the last regional ratios the company disclosed. Method and sources at the end.
        </p>
      </div>

      {withShare && (
        <div className="mt-6">
          <ShareBar
            compact
            title="How much is an hour of your attention worth?"
            text={shareText(r)}
            path={sharePath}
            label="Share your receipt"
          />
          <p className="mono-lc mt-2 text-fg-3">The link carries only your two choices: region and hours.</p>
        </div>
      )}
    </div>
  );
}
