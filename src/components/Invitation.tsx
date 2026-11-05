"use client";

import { useState } from "react";
import { newsletter } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

/**
 * The invitation to hear about future investigations.
 *
 * Connected mode: when NEXT_PUBLIC_NEWSLETTER_ACTION is set, the form posts
 * directly to that provider endpoint (Buttondown, Mailchimp, ConvertKit and
 * similar all accept a plain HTML form POST). No address passes through this
 * site's own code or servers.
 *
 * Unconnected mode: the field is shown but disabled and labelled honestly.
 * Nothing is collected or stored.
 */
export function Invitation({ tone = "parchment" }: { tone?: "parchment" | "ink" }) {
  const connected = Boolean(newsletter.action);
  const [email, setEmail] = useState("");

  return (
    <section
      data-surface={tone}
      aria-labelledby="invite-title"
      className="border-t border-rule px-[var(--gutter)] py-16 md:py-20"
    >
      <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="mono text-fg-3">Future investigations</p>
          <p id="invite-title" className="display mt-3 max-w-[16ch] text-[length:var(--step-3)]">
            One question at a time, sent when it is ready.
          </p>
          <p className="mt-5 max-w-[44ch] text-[length:var(--step--1)] leading-relaxed text-fg-2">
            Palimpsest publishes slowly. The next investigation will arrive when it can bear its own weight,
            not on a schedule. If you would like to know when that happens, leave an address. Nothing else is
            asked and nothing else is sent.
          </p>
        </div>

        <div className="lg:pt-8">
          {connected ? (
            <form
              action={newsletter.action}
              method="post"
              target="_blank"
              onSubmit={() => trackEvent("invitation_submitted", { provider: newsletter.provider || "unknown" }, false)}
              className="max-w-[32rem]"
            >
              <label htmlFor="invite-email" className="mono text-fg-3">
                Your address
              </label>
              <div className="mt-3 flex items-end gap-4 border-b border-fg">
                <input
                  id="invite-email"
                  name={newsletter.emailField}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.org"
                  className="w-full bg-transparent py-2 font-display text-[length:var(--step-1)] italic outline-none placeholder:text-fg-3"
                  style={{ fontVariationSettings: '"opsz" 24, "SOFT" 40' }}
                />
                <button
                  type="submit"
                  className="mono mb-2 shrink-0 border border-fg px-4 py-2 transition-colors hover:bg-fg hover:text-bg focus-visible:bg-fg focus-visible:text-bg"
                >
                  Keep me posted
                </button>
              </div>
              <p className="mono-lc mt-3 text-fg-3">
                Handled by {newsletter.provider || "our mailing-list provider"}. Unsubscribe in one click from any message.
              </p>
            </form>
          ) : (
            <div className="max-w-[32rem]">
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor="invite-email" className="mono text-fg-3">
                  Your address
                </label>
                <span className="register" data-level="contested">
                  Not yet connected
                </span>
              </div>
              <div className="mt-3 flex items-end gap-4 border-b border-rule">
                <input
                  id="invite-email"
                  type="email"
                  disabled
                  aria-describedby="invite-note"
                  placeholder="The list is being set up"
                  className="w-full bg-transparent py-2 font-display text-[length:var(--step-1)] italic text-fg-3 outline-none placeholder:text-fg-3"
                  style={{ fontVariationSettings: '"opsz" 24, "SOFT" 40' }}
                />
                <button
                  type="button"
                  disabled
                  className="mono mb-2 shrink-0 cursor-not-allowed border border-rule px-4 py-2 text-fg-3"
                >
                  Keep me posted
                </button>
              </div>
              <p id="invite-note" className="mono-lc mt-3 text-fg-3">
                A mailing list has not been connected to this site yet, so this field does nothing and stores
                nothing.{" "}
                {newsletter.contact ? (
                  <>
                    Until it is, you can write to{" "}
                    <a href={`mailto:${newsletter.contact}`} className="ink-link text-fg-2">
                      {newsletter.contact}
                    </a>{" "}
                    and ask to be told.
                  </>
                ) : (
                  <>Check back, or bookmark the front page.</>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
