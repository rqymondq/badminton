/**
 * The numbers behind Investigation No. 02.
 *
 * Every figure here is traceable to a source in ./data.ts. Where we derive,
 * the derivation is written out so a reader (or a fact-checker) can redo it.
 */

export const META = {
  fiscalYear: 2024,
  /** Total revenue FY2024, USD. Press release, 29 Jan 2025. */
  revenue: 164.50e9,
  /** Average daily active people across Meta's apps, December 2024. */
  dap: 3.35e9,
  /** Annual worldwide average revenue per person, FY2024 (sum of quarterly ARPP). Form 10-K. */
  arppWorldwide: 49.63,
  /** Latest quarter available at time of writing. Form 10-Q, Q3 2025. */
  latest: { quarter: "Q3 2025", arpp: 14.46, dap: 3.54e9 },
  /**
   * Meta stopped publishing regional per-user figures after Q4 2023. These are
   * the last ones: Facebook-only ARPU for the quarter, by user geography.
   */
  fbArpuQ4_2023: { world: 13.12, us: 68.44, eu: 23.14, apac: 5.52, row: 4.5 },
} as const;

export type RegionKey = "us" | "eu" | "apac" | "row" | "world";

export interface Region {
  key: RegionKey;
  label: string;
  short: string;
  /** Regional / worldwide ratio from the last disclosed regional figures. */
  multiplier: number;
}

const q = META.fbArpuQ4_2023;
export const regions: Region[] = [
  { key: "us", label: "United States & Canada", short: "US & Canada", multiplier: q.us / q.world },
  { key: "eu", label: "Europe", short: "Europe", multiplier: q.eu / q.world },
  { key: "apac", label: "Asia-Pacific", short: "Asia-Pacific", multiplier: q.apac / q.world },
  { key: "row", label: "Rest of world", short: "Rest of world", multiplier: q.row / q.world },
  { key: "world", label: "Worldwide average", short: "Worldwide", multiplier: 1 },
];

export const regionByKey = (k: string | null | undefined): Region =>
  regions.find((r) => r.key === k) ?? regions[4];

/** GWI, via DataReportal Digital 2025: typical internet user, all social platforms. */
export const TYPICAL_SOCIAL_HOURS = 2 + 21 / 60;
/** Default for the instrument: a round two hours on Meta's apps. */
export const DEFAULT_HOURS = 2;
export const MIN_HOURS = 0.25;
export const MAX_HOURS = 6;

/** US federal minimum wage, unchanged since 24 July 2009. */
export const US_MIN_WAGE = 7.25;

export interface Receipt {
  region: Region;
  hoursPerDay: number;
  hoursPerYear: number;
  /** Estimated annual revenue Meta earns from one person in this region. */
  perYear: number;
  perDay: number;
  perHour: number;
  /** Hours of attention that sell for the price of one hour at the US federal minimum wage. */
  minWageHours: number;
  /** Meta's revenue per day, all people. */
  metaPerDay: number;
  /** One person's share of a day of Meta's revenue. */
  shareOfDay: number;
}

export function computeReceipt(regionKey: string | null | undefined, hours: number): Receipt {
  const region = regionByKey(regionKey);
  const hoursPerDay = clampHours(hours);
  const perYear = META.arppWorldwide * region.multiplier;
  const hoursPerYear = hoursPerDay * 365;
  const perDay = perYear / 365;
  const perHour = perYear / hoursPerYear;
  const metaPerDay = META.revenue / 365;
  return {
    region,
    hoursPerDay,
    hoursPerYear,
    perYear,
    perDay,
    perHour,
    minWageHours: US_MIN_WAGE / perHour,
    metaPerDay,
    shareOfDay: perDay / metaPerDay,
  };
}

export function clampHours(h: number) {
  if (!Number.isFinite(h)) return DEFAULT_HOURS;
  const snapped = Math.round(h * 4) / 4;
  return Math.min(MAX_HOURS, Math.max(MIN_HOURS, snapped));
}

/* Formatting */
export const usd = (n: number, digits = 2) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);

/** Prices under a dollar read better in cents. */
export function money(n: number) {
  if (n >= 1) return usd(n);
  if (n >= 0.1) return `${Math.round(n * 100)}¢`;
  return `${(n * 100).toFixed(1)}¢`;
}

export const hoursLabel = (h: number) => {
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  if (whole === 0) return `${mins} min`;
  if (mins === 0) return `${whole} h`;
  return `${whole} h ${mins} min`;
};

export const big = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

/** Share text for the receipt. No reader data beyond two public inputs. */
export function shareText(r: Receipt) {
  return `An hour of my attention sells for about ${money(r.perHour)}, according to Meta's own accounts. How much is yours worth?`;
}
