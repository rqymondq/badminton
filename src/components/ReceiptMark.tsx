import { computeReceipt, hoursLabel, money, usd, META } from "@/stories/attention/figures";

/** A static receipt motif for index cards. Worldwide average, two hours a day. */
export function ReceiptMark({ className = "" }: { className?: string }) {
  const r = computeReceipt("world", 2);
  const row = (l: string, v: string, strong = false) => (
    <div className={`flex items-baseline gap-2 ${strong ? "text-ink" : "text-graphite"}`}>
      <span className="mono-lc text-[0.7rem]">{l}</span>
      <span aria-hidden className="mb-[0.3em] flex-1 border-b border-dotted border-stone-2" />
      <span className="mono-lc text-[0.7rem] tabular-nums">{v}</span>
    </div>
  );
  return (
    <div className={`relative ${className}`} aria-hidden>
      <div
        className="bg-parchment-2 px-5 py-5 text-ink shadow-[0_30px_50px_-30px_rgba(0,0,0,0.7)]"
        style={{ clipPath: "polygon(0 0, 3% 8px, 6% 0, 9% 8px, 12% 0, 15% 8px, 18% 0, 21% 8px, 24% 0, 27% 8px, 30% 0, 33% 8px, 36% 0, 39% 8px, 42% 0, 45% 8px, 48% 0, 51% 8px, 54% 0, 57% 8px, 60% 0, 63% 8px, 66% 0, 69% 8px, 72% 0, 75% 8px, 78% 0, 81% 8px, 84% 0, 87% 8px, 90% 0, 93% 8px, 96% 0, 100% 8px, 100% calc(100% - 8px), 96% 100%, 93% calc(100% - 8px), 90% 100%, 87% calc(100% - 8px), 84% 100%, 81% calc(100% - 8px), 78% 100%, 75% calc(100% - 8px), 72% 100%, 69% calc(100% - 8px), 66% 100%, 63% calc(100% - 8px), 60% 100%, 57% calc(100% - 8px), 54% 100%, 51% calc(100% - 8px), 48% 100%, 45% calc(100% - 8px), 42% 100%, 39% calc(100% - 8px), 36% 100%, 33% calc(100% - 8px), 30% 100%, 27% calc(100% - 8px), 24% 100%, 21% calc(100% - 8px), 18% 100%, 15% calc(100% - 8px), 12% 100%, 9% calc(100% - 8px), 6% 100%, 3% calc(100% - 8px), 0 100%)" }}
      >
        <div className="flex items-baseline justify-between">
          <span className="mono text-[0.68rem] text-ink">Palimpsest</span>
          <span className="mono text-[0.68rem] text-graphite">Receipt No. 02</span>
        </div>
        <div className="my-3 border-t border-dashed border-stone-2" />
        <div className="space-y-1.5">
          {row("Issued to", "One person, worldwide")}
          {row("Attention supplied", `${hoursLabel(r.hoursPerDay)} / day`)}
          {row(`Revenue to Meta, ${META.fiscalYear}`, usd(r.perYear), true)}
        </div>
        <div className="my-3 border-t border-dashed border-stone-2" />
        <div className="flex items-end justify-between gap-3">
          <span className="mono text-[0.68rem] text-ink">Price per hour</span>
          <span className="display text-[clamp(2rem,4vw,3.2rem)] leading-none text-oxblood tabular-nums">{money(r.perHour)}</span>
        </div>
      </div>
    </div>
  );
}
