"use client";

import { track } from "@vercel/analytics";

/**
 * A thin wrapper over Vercel Web Analytics custom events.
 *
 * Rules: no free text, no identifiers, no content from the reflection
 * instruments. Values are short category strings only. Events are
 * de-duplicated per page load so a reader scrolling back and forth does not
 * inflate counts.
 */
type Value = string | number | boolean;
const sent = new Set<string>();

export function trackEvent(name: string, props?: Record<string, Value>, once = true) {
  try {
    const key = `${name}:${JSON.stringify(props ?? {})}`;
    if (once && sent.has(key)) return;
    sent.add(key);
    track(name, props);
  } catch {
    /* analytics must never break the page */
  }
}
