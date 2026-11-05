"use client";

import { useState } from "react";
import { ActHead } from "@/components/story/Act";
import { Column, Prose, Ref, RegisterTag, Aside } from "@/components/story/Prose";
import { ShareBar } from "@/components/story/ShareBar";
import { useReceipt } from "./ReceiptContext";
import { money, shareText } from "./figures";
import { trackEvent } from "@/lib/analytics";

const choices = ["Nothing", "One app", "All of them", "I'd stay anyway"] as const;
type Choice = (typeof choices)[number];

const replies: Record<Choice, string> = {
  Nothing: "Then the receipt is the right price for you, and that is a perfectly good answer. Most arguments about attention assume you are a victim of it. You might just be a customer.",
  "One app": "The most common honest answer, and the one the trap is built to prevent. One app is exactly the size of exit that leaving alone punishes.",
  "All of them": "Notice that you would only do it if everyone did. That is the whole finding of Act IV in one feeling.",
  "I'd stay anyway": "Then your hour is worth more to you than to them, which is the only arrangement in this inquiry that is not a trap.",
};

export function ActFive() {
  const { receipt: r, region, hours } = useReceipt();
  const [choice, setChoice] = useState<Choice | null>(null);

  // The three prices, each converted to an hourly rate using the reader's own hours.
  const leaveAloneHour = 100 / (28 * r.hoursPerDay); // Allcott et al. median WTA, four weeks
  const allLeaveHour = 28 / (28 * r.hoursPerDay); // Bursztyn et al., TikTok, four weeks

  return (
    <div className="py-24 md:py-32">
      <Column>
        <ActHead numeral="V" label="The Ledger Closes" theme="Three prices for the same hour." />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,58ch)] lg:gap-16">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="border-t border-fg">
              {[
                { label: "What Meta earned from one of your hours", v: money(r.perHour), src: 1, tone: "var(--oxblood)" },
                { label: "What it took to pay someone to leave Facebook for a month, per one of your hours", v: money(leaveAloneHour), src: 13, tone: "var(--ink)" },
                { label: "What students would pay, per hour, to have TikTok gone for everyone", v: money(allLeaveHour), src: 15, tone: "var(--lapis)" },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-[1fr_auto] items-end gap-6 border-b border-rule py-5">
                  <p className="max-w-[28ch] text-[length:var(--step--1)] leading-snug text-fg-2">
                    {row.label}
                    <Ref n={row.src} />
                  </p>
                  <p className="display text-[length:var(--step-4)] leading-none tabular-nums" style={{ color: row.tone }}>{row.v}</p>
                </div>
              ))}
            </div>
            <p className="mono-lc mt-3 text-fg-3">
              Hourly rates use your {r.hoursPerDay} h/day. The second and third are from different studies, platforms and years; the comparison is ours.
            </p>
          </div>

          <div>
            <Prose>
              <p className="versal">
                Here is the ledger with all three prices on it. The market&rsquo;s price for your hour is the small
                one. The price at which a person would give the hour up is larger. And the price people would pay to
                have the whole arrangement end, for everyone, is somewhere in between and above zero. Three numbers,
                one hour. They do not agree, and the disagreement is the finding.
              </p>
              <p>
                In 1971 Herbert Simon wrote that a wealth of information creates a poverty of attention.<Ref n={17} />
                He was describing a design problem for organisations. Fifty years on, the poverty has a market, and
                the market has a price list, and the price list says that your attention is nearly worthless and
                nearly priceless at the same time, depending on who is asking and whether they are asking you alone.
              </p>
              <p>
                That is why the slogan fails. &ldquo;You are the product&rdquo; invites you to feel exploited at a
                price that is, frankly, too low to feel anything about. The better description is the one the
                evidence gives: you are inventory in a market that depends on you staying, inside a trap that only
                opens from the outside, in a culture that keeps telling you the lock is on your side of the door.
              </p>
            </Prose>

            <div className="mt-14 border-t border-fg pt-8">
              <p className="mono text-fg-3">Instrument 3 <span aria-hidden className="mx-2">·</span> The exit</p>
              <p className="serif mt-4 max-w-[26ch] text-[length:var(--step-2)] leading-tight">
                If everyone you know left at once, what would you leave?
              </p>
              <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Your answer">
                {choices.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={choice === c}
                    onClick={() => { setChoice(c); trackEvent("instrument_exit", { choice: c }, false); }}
                    className={`mono border px-4 py-2 transition-colors ${
                      choice === c ? "border-fg bg-fg text-bg" : "border-fg hover:bg-fg hover:text-bg"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="mt-5 max-w-[52ch] text-[length:var(--step--1)] leading-relaxed text-fg-2" aria-live="polite">
                {choice ? replies[choice] : "Nothing you choose here is stored. It only changes what this paragraph says."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-[minmax(0,60ch)_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="mono text-fg-3">Coda</p>
            <p className="display mt-6 text-[length:var(--step-4)] leading-[1.02]">
              The market put a price on your hour. <span className="text-accent">You never did.</span> The gap between those two numbers is where the argument about attention actually lives.
            </p>
            <p className="serif mt-10 max-w-[44ch] text-[length:var(--step-1)] text-fg-2">
              What would you leave, if everyone else did too? Keep the question. It is worth more than the receipt.
            </p>
            <div className="mt-10">
              <ShareBar
                title="How much is an hour of your attention worth?"
                text={shareText(r)}
                path={`/investigations/attention?r=${region}&h=${hours}`}
                label="Send the receipt to someone who'd argue with it"
              />
            </div>
          </div>
          <Aside label="Registers">
            <p className="mb-2"><RegisterTag level="editorial" /> Comparing the three prices as hourly rates is our device; they come from different studies and populations.</p>
            <p><RegisterTag level="established" /> Each underlying figure is from a primary filing or a peer-reviewed experiment.<Ref n={1} /><Ref n={13} /><Ref n={15} /></p>
          </Aside>
        </div>
      </Column>
    </div>
  );
}
