"use client";

import { useEffect, useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

export interface ActNav { id: string; numeral: string; title: string }

/**
 * A vertical rail of act numerals (desktop) and a thin progress thread.
 * Pure DOM + IntersectionObserver; no GSAP needed here.
 */
export function StoryShell({ acts, children }: { acts: ActNav[]; children: ReactNode }) {
  const [active, setActive] = useState<string>(acts[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActive(visible.target.id);
          const act = acts.find((a) => a.id === visible.target.id);
          if (act) trackEvent("act_reached", { act: act.numeral });
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.1, 0.5] },
    );
    acts.forEach((a) => {
      const el = document.getElementById(a.id);
      if (el) io.observe(el);
    });
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
        setProgress(Math.min(1, Math.max(0, p)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [acts]);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-vermilion"
        style={{ transform: `scaleX(${progress})` }}
      />
      <nav
        aria-label="Acts"
        className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 pl-5 mix-blend-difference lg:flex"
      >
        {acts.map((a) => {
          const isActive = a.id === active;
          return (
            <a
              key={a.id}
              href={`#${a.id}`}
              aria-current={isActive ? "true" : undefined}
              className="group flex items-center gap-3 text-parchment no-underline"
            >
              <span
                className={`block h-px transition-all duration-500 ease-[var(--ease-out)] ${isActive ? "w-8 bg-parchment" : "w-3 bg-parchment/50 group-hover:w-5"}`}
              />
              <span className={`mono text-[0.7rem] transition-opacity ${isActive ? "opacity-100" : "opacity-50 group-hover:opacity-90"}`}>
                {a.numeral}
              </span>
              <span className="sr-only">{a.title}</span>
            </a>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
