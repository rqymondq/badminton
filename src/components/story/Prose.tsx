import type { ReactNode } from "react";
import type { Register } from "@/content/investigations";

export function Column({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-[var(--gutter)] ${className}`}>{children}</div>
  );
}

export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`prose ${className}`}>{children}</div>;
}

/** Footnote marker that links to the bibliography. */
export function Ref({ n }: { n: number }) {
  return (
    <a href={`#src-${n}`} className="ref" aria-label={`Source ${n}`}>
      {n}
    </a>
  );
}

const registerLabel: Record<Register, string> = {
  established: "Established finding",
  theory: "Theory / interpretation",
  contested: "Contested",
  editorial: "Our reflection",
};

export function RegisterTag({ level }: { level: Register }) {
  return (
    <span className="register" data-level={level}>
      {registerLabel[level]}
    </span>
  );
}

/** Marginal note. On wide screens it sits beside the column; on narrow, below. */
export function Aside({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <aside className="my-8 border-l border-rule pl-5 text-[length:var(--step--1)] leading-relaxed text-fg-2 lg:my-0 lg:border-l-0 lg:pl-0">
      {label && <p className="mono mb-2 text-fg-3">{label}</p>}
      {children}
    </aside>
  );
}

/** Two-column reading layout: prose + marginalia rail. */
export function Spread({ children, margin }: { children: ReactNode; margin?: ReactNode }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,64ch)_minmax(14rem,20rem)] lg:gap-16">
      <div>{children}</div>
      {margin && <div className="lg:pt-2">{margin}</div>}
    </div>
  );
}

export function Pull({ children }: { children: ReactNode }) {
  return (
    <p className="serif my-12 max-w-[30ch] text-[length:var(--step-3)] leading-[1.05] text-fg">
      {children}
    </p>
  );
}

export function Figure({ n, caption, children }: { n: string; caption: ReactNode; children: ReactNode }) {
  return (
    <figure className="my-8">
      {children}
      <figcaption className="mono-lc mt-4 max-w-[60ch] text-fg-3">
        <span className="mono text-fg-2">Fig. {n}</span> <span aria-hidden>—</span> {caption}
      </figcaption>
    </figure>
  );
}
