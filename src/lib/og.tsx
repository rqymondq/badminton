import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { influenceWords } from "@/stories/what-you-believe/data";

export const ogSize = { width: 1200, height: 630 };

const palette = {
  ink: "#131110",
  parchment: "#F2EADB",
  stone: "#9A9087",
  stone2: "#C2B7A9",
  vermilion: "#D9502F",
  oxblood: "#6B1E1A",
};

async function fonts() {
  const dir = join(process.cwd(), "src/assets/fonts");
  const [display, displayItalic, sans, mono] = await Promise.all([
    readFile(join(dir, "fraunces-display.ttf")),
    readFile(join(dir, "fraunces-display-italic.ttf")),
    readFile(join(dir, "instrument-sans.ttf")),
    readFile(join(dir, "plex-mono.ttf")),
  ]);
  return [
    { name: "Fraunces", data: display, weight: 500 as const, style: "normal" as const },
    { name: "Fraunces", data: displayItalic, weight: 300 as const, style: "italic" as const },
    { name: "Instrument Sans", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Plex Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

/** The ring of influences, rendered with absolute positioning (Satori has no grid). */
function Ring({ cx, cy, r, size = 20, dim = false }: { cx: number; cy: number; r: number; size?: number; dim?: boolean }) {
  const n = influenceWords.length;
  return (
    <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width: ogSize.width, height: ogSize.height }}>
      <div
        style={{
          position: "absolute",
          left: cx - r * 0.62,
          top: cy - r * 0.62,
          width: r * 1.24,
          height: r * 1.24,
          borderRadius: 999,
          border: `1px solid ${dim ? "rgba(242,234,219,0.18)" : "rgba(242,234,219,0.25)"}`,
        }}
      />
      {influenceWords.map((w, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              left: cx + Math.cos(a) * r,
              top: cy + Math.sin(a) * r,
              transform: "translate(-50%, -50%)",
              fontFamily: "Fraunces",
              fontStyle: i % 3 === 1 ? "italic" : "normal",
              fontSize: size,
              color: i % 5 === 0 ? palette.vermilion : dim ? palette.stone : palette.stone2,
              whiteSpace: "nowrap",
            }}
          >
            {w}
          </div>
        );
      })}
    </div>
  );
}

const Mono = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ fontFamily: "Plex Mono", fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color: palette.stone, ...style }}>
    {children}
  </div>
);

/** Front page card: the palimpsest wordmark and the mission. */
export async function frontImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: palette.parchment, color: palette.ink, position: "relative" }}>
        <div style={{ position: "absolute", left: 64, top: 56, right: 64, display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${palette.ink}`, paddingBottom: 14 }}>
          <Mono style={{ color: palette.ink }}>First issue · An independent publication</Mono>
          <Mono style={{ color: palette.ink }}>Mind · Power · Society · History</Mono>
        </div>
        <div style={{ position: "absolute", left: 60, top: 140, display: "flex" }}>
          <div style={{ position: "absolute", left: 6, top: 8, fontFamily: "Fraunces", fontStyle: "italic", fontSize: 190, color: palette.oxblood, opacity: 0.28, lineHeight: 1 }}>Palimpsest</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 190, lineHeight: 1, letterSpacing: -4 }}>Palimpsest</div>
        </div>
        <div style={{ position: "absolute", left: 64, top: 400, width: 800, display: "flex", fontFamily: "Fraunces", fontSize: 44, lineHeight: 1.15 }}>
          Don’t tell people what to think. Give them something worth thinking about.
        </div>
        <div style={{ position: "absolute", left: 64, bottom: 52, display: "flex" }}>
          <Mono>pal·imp·sest (n.) a page written over, the earlier hand still showing through</Mono>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}

/** Investigation card: the title composition on ink with the ring of influences. */
export async function investigationImage(opts: { number: string; desk: string; readingTime: string }) {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: palette.ink, color: palette.parchment, position: "relative" }}>
        <Ring cx={930} cy={315} r={215} size={22} dim />
        <div style={{ position: "absolute", left: 64, top: 56, display: "flex", gap: 18 }}>
          <Mono style={{ color: palette.parchment }}>Palimpsest</Mono>
          <Mono>{`· Investigation ${opts.number} · ${opts.desk} · ${opts.readingTime}`}</Mono>
        </div>
        <div style={{ position: "absolute", left: 64, top: 124, display: "flex", flexDirection: "column", width: 640 }}>
          <div style={{ fontFamily: "Fraunces", fontSize: 34, color: palette.stone2, lineHeight: 1 }}>How much</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 86, lineHeight: 0.96, letterSpacing: -2, marginTop: 10 }}>of what you believe</div>
          <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 52, color: palette.stone2, lineHeight: 1, marginTop: 12 }}>is actually</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 112, lineHeight: 0.92, color: palette.vermilion, marginTop: 4 }}>yours?</div>
        </div>
        <div style={{ position: "absolute", left: 760, bottom: 52, display: "flex" }}>
          <Mono>Six acts · three instruments</Mono>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}

/** Investigation No. 02: a receipt for one hour of attention, with the sender's inputs. */
export async function receiptImage(opts: { region: string; hours: number }) {
  const { computeReceipt, money, usd, big, hoursLabel, US_MIN_WAGE, META } = await import("@/stories/attention/figures");
  const r = computeReceipt(opts.region, opts.hours);
  const row = (label: string, value: string, strong = false) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, fontFamily: "Plex Mono", fontSize: 18, color: strong ? palette.ink : "#4B4642" }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: palette.ink, color: palette.parchment, position: "relative" }}>
        <div style={{ position: "absolute", left: 64, top: 56, display: "flex", gap: 18 }}>
          <Mono style={{ color: palette.parchment }}>Palimpsest</Mono>
          <Mono>· Investigation No. 02 · Power</Mono>
        </div>
        <div style={{ position: "absolute", left: 64, top: 130, display: "flex", flexDirection: "column", width: 560 }}>
          <div style={{ fontFamily: "Fraunces", fontSize: 34, color: palette.stone2, lineHeight: 1 }}>How much is</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 78, lineHeight: 0.98, letterSpacing: -2, marginTop: 10 }}>an hour of your</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 78, lineHeight: 0.98, letterSpacing: -2, color: palette.vermilion }}>attention worth?</div>
          <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 30, color: palette.stone2, marginTop: 28, lineHeight: 1.2 }}>
            {`In ${r.region.short}, by Meta’s own accounts: about ${money(r.perHour)}.`}
          </div>
        </div>
        {/* the receipt */}
        <div style={{ position: "absolute", right: 64, top: 48, width: 420, display: "flex", flexDirection: "column", background: "#E7DCC6", color: palette.ink, padding: "28px 30px", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Plex Mono", fontSize: 16, letterSpacing: 2, textTransform: "uppercase" }}>
            <span>Palimpsest</span>
            <span style={{ color: "#4B4642" }}>Receipt No. 02</span>
          </div>
          <div style={{ display: "flex", borderTop: "1px dashed #9A9087", marginTop: 6 }} />
          {row("Issued to", `One person, ${r.region.short}`)}
          {row("Attention supplied", `${hoursLabel(r.hoursPerDay)} / day`)}
          {row("Quantity", `${big(r.hoursPerYear)} h / year`)}
          {row(`Revenue to Meta, ${META.fiscalYear}`, usd(r.perYear), true)}
          <div style={{ display: "flex", borderTop: "1px dashed #9A9087", marginTop: 6 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontFamily: "Plex Mono", fontSize: 16, letterSpacing: 2, textTransform: "uppercase" }}>Price per hour</span>
            <span style={{ fontFamily: "Fraunces", fontSize: 76, lineHeight: 0.9, color: palette.oxblood }}>{money(r.perHour)}</span>
          </div>
          <div style={{ display: "flex", borderTop: "1px dashed #9A9087", marginTop: 6 }} />
          {row("US federal minimum wage", `${usd(US_MIN_WAGE)} / hour`)}
          {row("Your hour, as sold", `1 / ${big(Math.round(r.minWageHours))} of that`, true)}
        </div>
        <div style={{ position: "absolute", left: 64, bottom: 52, display: "flex" }}>
          <Mono>Five acts · three instruments · twenty sources</Mono>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
