"use client";

import { useEffect, useRef, useState } from "react";

const cases = [
  {
    id: "flag",
    text: "A woman is cleaning out her closet and finds her old national flag. She doesn’t want it anymore, so she cuts it into pieces and uses the rags to clean her bathroom.",
    credit: "Paraphrased from Haidt, Koller & Dias (1993).",
  },
  {
    id: "wallet",
    text: "A man finds a wallet on a train with three hundred in cash and the owner’s identification. The owner, he realises, is a well-known billionaire. He keeps the cash and posts the wallet back.",
    credit: "An editorial case of ours, not from the literature.",
  },
];

type Phase = "idle" | "case" | "reason" | "result";

/** Wall-clock stamp, read only inside event handlers and effects. */
const stamp = () => performance.now();
type Verdict = "Wrong" | "Not wrong" | "Unsure";

const fmt = (ms: number) => (ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`);

/**
 * The Flash Judgement. Measures only the order and timing of two events,
 * in memory, in this tab. Nothing is sent or stored.
 */
export function FlashJudgement() {
  const [caseIdx, setCaseIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [reason, setReason] = useState("");
  const t0 = useRef(0);
  const tVerdict = useRef(0);
  const tFirstKey = useRef(0);
  const [timings, setTimings] = useState({ verdictMs: 0, firstKeyMs: 0, doneMs: 0, typed: false });
  const liveRef = useRef<HTMLDivElement>(null);
  const c = cases[caseIdx];

  useEffect(() => {
    if (phase === "case") t0.current = stamp();
  }, [phase]);

  const begin = () => {
    setVerdict(null); setReason(""); tFirstKey.current = 0;
    setPhase("case");
  };
  const choose = (v: Verdict) => {
    tVerdict.current = stamp();
    setVerdict(v);
    setPhase("reason");
  };
  const onType = (val: string) => {
    if (!tFirstKey.current && val.length > 0) tFirstKey.current = stamp();
    setReason(val);
  };
  const finish = () => {
    const now = stamp();
    setTimings({
      verdictMs: tVerdict.current - t0.current,
      firstKeyMs: tFirstKey.current ? tFirstKey.current - tVerdict.current : 0,
      doneMs: now - tVerdict.current,
      typed: tFirstKey.current > 0,
    });
    setPhase("result");
  };
  const next = () => {
    setCaseIdx((i) => (i + 1) % cases.length);
    setPhase("idle");
  };

  const { verdictMs, firstKeyMs, doneMs, typed } = timings;

  return (
    <div className="border border-rule p-6 md:p-8" aria-labelledby="flash-title">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p id="flash-title" className="mono text-fg-3">
          Instrument 1 <span aria-hidden className="mx-2">·</span> The Flash Judgement
        </p>
        <p className="mono-lc text-fg-3">Case {caseIdx + 1} of {cases.length}</p>
      </div>

      <div ref={liveRef} aria-live="polite" className="mt-6 min-h-[14rem]">
        {phase === "idle" && (
          <div>
            <p className="serif max-w-[40ch] text-[length:var(--step-1)]">
              You will be shown a short case. Decide as quickly as you honestly can. Then you will be asked why.
            </p>
            <p className="mono-lc mt-4 max-w-[48ch] text-fg-3">
              The instrument records two timings in this tab only. Nothing you type is stored or sent anywhere.
            </p>
            <button
              type="button"
              onClick={begin}
              className="mono mt-8 border border-fg px-5 py-3 transition-colors hover:bg-fg hover:text-bg focus-visible:bg-fg focus-visible:text-bg"
            >
              Show me the case
            </button>
          </div>
        )}

        {phase === "case" && (
          <div>
            <p className="serif max-w-[44ch] text-[length:var(--step-1)] leading-snug">{c.text}</p>
            <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Your verdict">
              {(["Wrong", "Not wrong", "Unsure"] as Verdict[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => choose(v)}
                  className="mono border border-fg px-5 py-3 transition-colors hover:bg-fg hover:text-bg focus-visible:bg-fg focus-visible:text-bg"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "reason" && (
          <form
            onSubmit={(e) => { e.preventDefault(); finish(); }}
          >
            <p className="mono text-fg-3">You said: <span className="text-accent">{verdict}</span></p>
            <label htmlFor="flash-reason" className="serif mt-3 block max-w-[40ch] text-[length:var(--step-1)]">
              Now: why?
            </label>
            <textarea
              id="flash-reason"
              value={reason}
              onChange={(e) => onType(e.target.value)}
              rows={3}
              autoFocus
              placeholder="Give the reason in a sentence."
              className="mt-4 w-full max-w-[56ch] resize-y border-b border-fg bg-transparent py-2 font-display text-[length:var(--step-1)] italic outline-none placeholder:text-fg-3 focus:border-accent-2"
              style={{ fontVariationSettings: '"opsz" 24, "SOFT" 40' }}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" className="mono border border-fg px-5 py-3 transition-colors hover:bg-fg hover:text-bg focus-visible:bg-fg focus-visible:text-bg">
                That’s my reason
              </button>
              <button type="button" onClick={finish} className="mono px-3 py-3 text-fg-3 ink-link">
                I can’t find one
              </button>
            </div>
          </form>
        )}

        {phase === "result" && (
          <div>
            <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-3">
              <div>
                <dt className="mono text-fg-3">Verdict</dt>
                <dd className="serif mt-1 text-[length:var(--step-2)] text-accent">{verdict}</dd>
                <dd className="mono-lc text-fg-3">after {fmt(verdictMs)}</dd>
              </div>
              <div>
                <dt className="mono text-fg-3">First word of a reason</dt>
                <dd className="serif mt-1 text-[length:var(--step-2)]">{typed ? fmt(firstKeyMs) : "—"}</dd>
                <dd className="mono-lc text-fg-3">{typed ? "after the verdict" : "none was typed"}</dd>
              </div>
              <div>
                <dt className="mono text-fg-3">Reason finished</dt>
                <dd className="serif mt-1 text-[length:var(--step-2)]">{fmt(doneMs)}</dd>
                <dd className="mono-lc text-fg-3">after the verdict</dd>
              </div>
            </dl>
            {reason && (
              <p className="serif mt-6 max-w-[52ch] text-[length:var(--step-0)] italic text-fg-2">&ldquo;{reason}&rdquo;</p>
            )}
            <p className="mt-6 max-w-[56ch] text-[length:var(--step-0)] leading-relaxed">
              A kitchen timer is not a laboratory, and a fast verdict is not proof that no reasoning happened.
              The instrument cannot see inside. What it can show is the order in which things appeared, and
              how long you kept looking for a reason once you already had a verdict.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button type="button" onClick={next} className="mono border border-fg px-5 py-3 transition-colors hover:bg-fg hover:text-bg focus-visible:bg-fg focus-visible:text-bg">
                Try the other case
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="mono-lc mt-6 border-t border-rule pt-3 text-fg-3">{c.credit}</p>
    </div>
  );
}
