import { influenceWords } from "@/stories/what-you-believe/data";

/** A compact, CSS-only version of the ring of influences, used on the front page. */
export function RingMark({ className = "" }: { className?: string }) {
  const n = influenceWords.length;
  return (
    <div className={`relative aspect-square ${className}`} aria-hidden>
      <div className="absolute inset-0 motion-safe:[animation:turn_160s_linear_infinite]">
        {influenceWords.map((w, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const r = 46;
          return (
            <span
              key={w}
              className="serif absolute whitespace-nowrap text-[clamp(0.7rem,1.1vw,1rem)] motion-safe:[animation:turn_160s_linear_infinite_reverse]"
              style={{
                left: `${50 + Math.cos(a) * r}%`,
                top: `${50 + Math.sin(a) * r}%`,
                translate: "-50% -50%",
                color: i % 5 === 0 ? "var(--accent)" : "var(--fg-2)",
                fontVariationSettings: '"opsz" 24, "SOFT" 30',
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div className="absolute inset-[22%] rounded-full border border-rule" />
      <div className="absolute inset-[38%] rounded-full border border-dashed border-rule" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="display text-[clamp(2rem,5vw,4.5rem)] text-accent">?</span>
      </div>
    </div>
  );
}
