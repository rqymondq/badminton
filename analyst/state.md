# State

Append-only memory for the research analyst. Every screen, every decision and every note is appended at the end as a dated entry by `scripts/append_state.py`. Nothing above the newest entry is ever edited; a correction is a new NOTE line. `/run-screen` reads this file first, every time, and reports repeat appearances, suppressed profiles, holdings and movers before pulling a single figure.

Entry types: `screen` (written by the weekly chain after the checker passes), `decisions` (written by `/log-decisions` from what you actually did), `note` (anything to remember), `run` (aborted or failed runs, so gaps are explained).

---

## 2026-11-05 — note: system created

Framework 1.0 (`framework.md`) in place: five criteria, four weighted factors, maker-checker loop, append-only state, weekly chain. No screens yet.

Live-data hosts were not reachable from the Claude Code cloud environment on this date (every financial host was blocked by the network policy; see the reachability log in `sources.md`). The first screen runs once those domains are allowed, or from a local Claude Code session with Firecrawl or Playwright connected.

## 2026-11-05 — run: aborted (05:48 UTC), live sources unreachable

Scheduled task "Weekly stock screen" fired manually at 05:47:55Z. Reachability check at 05:48:47Z failed on every insider source (openinsider.com unresolved; finviz.com and www.sec.gov refused by the proxy), so the run aborted with no figures and no watchlist. Note: `screens/2026-11-05-aborted.md`. The firing session could not push (no repository credential in task-started sessions); this entry was recorded by the parent session from its transcript.

A probe at 05:56 UTC, after network access was widened, reached openinsider.com and finviz.com. A full run was started in a session that holds push rights (session_01WU8zAiyR2KQt8ACJFPKoKZ); its result follows as the next entry.

## 2026-11-05 — run: weekly screen CHECK-FAILED, list not released

framework: 1.0 · note: screens/2026-11-05.md · status: CHECK-FAILED after 3 checker cycles · tools: curl (OpenInsider, Finviz, Yahoo, Nasdaq), WebFetch (StockAnalysis), score.py.

The first live screen ran end to end (100 OpenInsider purchase filings 2026-10-26 to 2026-11-04, 68 tickers, 25 carried, 5 passed all criteria on the vendor-basis figures) but the watchlist is **not released**: cycle 3 of the independent check still failed. Nothing here counts as a watchlist appearance.

Table on record, not released (composite; price at 2026-11-04 close, Finviz): DINO 89 ($104.57) · LRN 80 ($79.24) · MSM 76 ($116.06) · ACN 56 ($264.27) · AN 44 ($183.47). Near miss: UPBD passed four criteria and was excluded on a Nasdaq June-2026 surprise of exactly 0% (Finviz adjusted pair +2.11%).

Why it failed (checks/2026-11-05.md, cycle 3): the framework does not say which EPS basis criterion 5's "reported EPS" means; on the GAAP pairs Finviz carries, MSM and AN missed, while on the consensus basis Yahoo and Nasdaq report they beat. Also: the DINO Yahoo citation no longer showed its Earnings History table when re-opened (Nasdaq corroborates +43.82% / +20.96%), one $152 target was unlogged, and one DINO risk sentence mixed two EPS bases.

Decisions needed from the user before the next run (edit framework.md and bump the version): (1) EPS basis for criterion 5, and whether 0% passes; (2) whether "Resumed" coverage counts as an initiation for sentiment (DINO 65 vs 50). Environment: www.sec.gov and data.sec.gov refused this run (rate threshold; "undeclared automated tool" wanting a contact e-mail in the User-Agent), so FCF came from StockAnalysis, not XBRL; see the reachability log in sources.md.
