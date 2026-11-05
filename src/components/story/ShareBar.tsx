"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Sharing without widgets. Native share sheet where the browser offers one,
 * copy-to-clipboard everywhere, plus plain intent links. No third-party scripts.
 */
export function ShareBar({
  title,
  text,
  path,
  label = "Share this investigation",
  compact = false,
}: {
  title: string;
  text: string;
  /** Path with any query string, e.g. /investigations/attention?h=2&r=us */
  path: string;
  label?: string;
  compact?: boolean;
}) {
  const [url, setUrl] = useState(path);
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Deferred past hydration: the server cannot know the origin or the share API.
    const t = setTimeout(() => {
      setUrl(new URL(path, window.location.origin).toString());
      setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    }, 0);
    return () => clearTimeout(t);
  }, [path]);

  const share = async () => {
    try {
      await navigator.share({ title, text, url });
      trackEvent("share", { method: "native" }, false);
    } catch {
      /* dismissed */
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      trackEvent("share", { method: "copy" }, false);
    } catch {
      setCopied(false);
    }
  };
  const enc = encodeURIComponent;
  const links = [
    { name: "Bluesky", href: `https://bsky.app/intent/compose?text=${enc(`${text} ${url}`)}` },
    { name: "X", href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { name: "Email", href: `mailto:?subject=${enc(title)}&body=${enc(`${text}\n\n${url}`)}` },
  ];

  const btn =
    "mono border border-fg px-4 py-2 transition-colors hover:bg-fg hover:text-bg focus-visible:bg-fg focus-visible:text-bg";

  return (
    <div className={compact ? "" : "border-t border-rule pt-6"} aria-label={label}>
      {!compact && <p className="mono text-fg-3">{label}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {canShare && (
          <button type="button" onClick={share} className={btn}>
            Share
          </button>
        )}
        <button type="button" onClick={copy} className={btn} aria-live="polite">
          {copied ? "Copied" : "Copy link"}
        </button>
        {links.map((l) => (
          <a
            key={l.name}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("share", { method: l.name.toLowerCase() }, false)}
            className="mono ink-link px-1 py-2 text-fg-2"
          >
            {l.name}
          </a>
        ))}
      </div>
    </div>
  );
}
