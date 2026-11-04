import type { ReactNode } from "react";

export type Surface = "ink" | "parchment" | "night";

export function Act({
  id,
  numeral,
  title,
  surface,
  children,
  className = "",
}: {
  id: string;
  numeral: string;
  title: string;
  surface: Surface;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-surface={surface}
      data-act={numeral}
      aria-labelledby={`${id}-title`}
      className={`relative ${className}`}
    >
      <h2 id={`${id}-title`} className="sr-only">
        Act {numeral}: {title}
      </h2>
      {children}
    </section>
  );
}

/** The running head that opens an act in the reading column. */
export function ActHead({ numeral, label, theme }: { numeral: string; label: string; theme: string }) {
  return (
    <header className="mb-10">
      <p className="mono text-fg-3">
        Act {numeral} <span aria-hidden className="mx-2">·</span> {label}
      </p>
      <p className="serif mt-4 max-w-[26ch] text-[length:var(--step-2)] text-fg">{theme}</p>
    </header>
  );
}
