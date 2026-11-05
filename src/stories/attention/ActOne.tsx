"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { Column, Prose } from "@/components/story/Prose";
import { Receipt } from "./Receipt";
import { useReceipt } from "./ReceiptContext";
import { money } from "./figures";

export function ActOne() {
  const root = useRef<HTMLDivElement>(null);
  const { receipt: r, fromLink } = useReceipt();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".t-line", { yPercent: 105 });
        gsap.to(".t-line", { yPercent: 0, stagger: 0.12, duration: 1.1, delay: 0.2, ease: "power3.out" });
        gsap.from(".t-sub", { opacity: 0, y: 12, duration: 0.8, delay: 1.1, ease: "power2.out" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div className="relative min-h-[100svh] pb-20 pt-24 md:pt-28">
        <p className="mono absolute left-[var(--gutter)] top-[4.75rem] text-fg-3">
          Act I <span aria-hidden className="mx-2">·</span> The Receipt
        </p>
        <p className="mono absolute right-[var(--gutter)] top-[4.75rem] text-fg-3">No. 02</p>

        <Column className="mt-6">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <h1>
                <span className="block overflow-hidden pb-[0.1em]">
                  <span className="t-line display-light block text-[length:var(--step-2)] text-fg-2">How much is</span>
                </span>
                <span className="block overflow-hidden pb-[0.12em]">
                  <span className="t-line display block text-[length:var(--step-4)] text-fg">an hour of your</span>
                </span>
                <span className="block overflow-hidden pb-[0.15em]">
                  <span className="t-line display-strong block text-[length:var(--step-4)] text-vermilion-2">attention worth?</span>
                </span>
              </h1>
              <p className="t-sub serif mt-8 max-w-[34ch] text-[length:var(--step-1)] text-fg-2">
                {fromLink ? "Someone sent you their receipt. " : ""}
                According to Meta&rsquo;s own accounts, in your case: about{" "}
                <span className="text-fg tabular-nums">{money(r.perHour)}</span>. Print yours, then find out why a number
                that small runs so much of the day.
              </p>
              <p className="t-sub mono-lc mt-6 text-fg-3">Adjust the two inputs. Everything below answers in your numbers.</p>
            </div>
            <div className="lg:justify-self-end">
              <Receipt />
            </div>
          </div>
        </Column>
      </div>

      <div aria-hidden className="h-[22svh] bg-gradient-to-b from-ink to-parchment" />

      <div data-surface="parchment" className="pb-24 pt-4">
        <Column>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,64ch)_minmax(14rem,20rem)] lg:gap-16">
            <Prose>
              <p className="lead">
                Everyone has heard that if you are not paying for the product, you are the product. The line is
                fifty years old and it has never once come with a price tag. So we went and found one. It is on the
                receipt above, and it is smaller than almost anyone guesses.
              </p>
              <p>
                That smallness is the puzzle this investigation is built around. A market that pays a fraction of a
                cent a minute for your attention has, by most accounts, reorganised the news, politics, childhood and
                the shape of an ordinary evening. Either the price is wrong, or the price is beside the point. We
                think it is the second, and the reasons turn out to be more interesting than the slogan.
              </p>
            </Prose>
            <aside className="mono-lc text-fg-3">
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-rule pt-4">
                <dt className="mono">Desk</dt>
                <dd>Power</dd>
                <dt className="mono">Reading</dt>
                <dd>About eight minutes</dd>
                <dt className="mono">Form</dt>
                <dd>Five acts, three instruments</dd>
                <dt className="mono">Sources</dt>
                <dd>
                  <a href="#sources" className="ink-link">
                    Twenty, at the end
                  </a>
                </dd>
              </dl>
              <p className="mt-6 text-[length:var(--step--2)] leading-relaxed">
                Markers like <span className="register" data-level="established">Established</span>{" "}
                <span className="register" data-level="contested">Contested</span>{" "}
                <span className="register" data-level="editorial">Ours</span> show how much weight a claim can bear.
              </p>
            </aside>
          </div>
        </Column>
      </div>
    </div>
  );
}
