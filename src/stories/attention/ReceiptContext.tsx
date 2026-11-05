"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clampHours, computeReceipt, DEFAULT_HOURS, regionByKey, type Receipt, type RegionKey } from "./figures";

interface Ctx {
  receipt: Receipt;
  region: RegionKey;
  hours: number;
  setRegion: (k: RegionKey) => void;
  setHours: (h: number) => void;
  /** True when the page was opened from a shared receipt link. */
  fromLink: boolean;
  touched: boolean;
}

const ReceiptCtx = createContext<Ctx | null>(null);

export function useReceipt() {
  const c = useContext(ReceiptCtx);
  if (!c) throw new Error("useReceipt must be used inside ReceiptProvider");
  return c;
}

/**
 * Holds the reader's two inputs for the whole investigation so every act can
 * answer in their numbers. Reads ?r= and ?h= after mount so shared links
 * open pre-filled; nothing is written anywhere.
 */
export function ReceiptProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<RegionKey>("world");
  const [hours, setHoursState] = useState<number>(DEFAULT_HOURS);
  const [fromLink, setFromLink] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    // Deferred so the server-rendered defaults hydrate first, then the shared
    // link's values are applied in a separate tick.
    const t = setTimeout(() => {
      try {
        const sp = new URLSearchParams(window.location.search);
        const r = sp.get("r");
        const h = Number(sp.get("h"));
        let any = false;
        if (r && regionByKey(r).key === r) {
          setRegionState(r as RegionKey);
          any = true;
        }
        if (Number.isFinite(h) && h > 0) {
          setHoursState(clampHours(h));
          any = true;
        }
        if (any) setFromLink(true);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      receipt: computeReceipt(region, hours),
      region,
      hours,
      setRegion: (k) => { setRegionState(k); setTouched(true); },
      setHours: (h) => { setHoursState(clampHours(h)); setTouched(true); },
      fromLink,
      touched,
    }),
    [region, hours, fromLink, touched],
  );

  return <ReceiptCtx.Provider value={value}>{children}</ReceiptCtx.Provider>;
}
