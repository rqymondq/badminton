import Link from "next/link";

/**
 * The wordmark is a palimpsest: a ghost layer of the word sits beneath the
 * primary setting, as if an earlier hand had written it first.
 */
export function Wordmark({ size = "md", href = "/" }: { size?: "sm" | "md" | "xl"; href?: string }) {
  const sizes = { sm: "text-[1.1rem]", md: "text-[1.5rem]", xl: "text-[length:var(--step-5)]" } as const;
  return (
    <Link href={href} aria-label="Palimpsest — home" className="group inline-block no-underline">
      <span className={`relative inline-block display ${sizes[size]} tracking-[-0.02em] leading-none`}>
        <span
          aria-hidden
          className="absolute left-[0.06em] top-[0.07em] select-none text-accent opacity-40 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-[0.03em] group-hover:translate-y-[0.03em] italic"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1', fontWeight: 300 }}
        >
          Palimpsest
        </span>
        <span className="relative" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1', fontWeight: 500 }}>
          Palimpsest
        </span>
      </span>
    </Link>
  );
}
