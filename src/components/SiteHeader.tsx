import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function SiteHeader({
  tone = "parchment",
  transparent = false,
}: {
  tone?: "parchment" | "ink";
  transparent?: boolean;
}) {
  return (
    <header
      data-surface={tone}
      className="relative z-40 flex items-center justify-between px-[var(--gutter)] py-5"
      style={transparent ? { background: "transparent" } : undefined}
    >
      <Wordmark size="sm" />
      <nav aria-label="Primary" className="flex items-center gap-6">
        <Link href="/investigations" className="mono ink-link">
          Investigations
        </Link>
        <Link href="/#desks" className="mono ink-link hidden sm:inline">
          Desks
        </Link>
        <Link href="/about" className="mono ink-link">
          About
        </Link>
      </nav>
    </header>
  );
}
