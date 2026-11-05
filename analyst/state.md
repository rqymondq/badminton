# State

Append-only memory for the research analyst. Every screen, every decision and every note is appended at the end as a dated entry by `scripts/append_state.py`. Nothing above the newest entry is ever edited; a correction is a new NOTE line. `/run-screen` reads this file first, every time, and reports repeat appearances, suppressed profiles, holdings and movers before pulling a single figure.

Entry types: `screen` (written by the weekly chain after the checker passes), `decisions` (written by `/log-decisions` from what you actually did), `note` (anything to remember), `run` (aborted or failed runs, so gaps are explained).

---

## 2026-11-05 — note: system created

Framework 1.0 (`framework.md`) in place: five criteria, four weighted factors, maker-checker loop, append-only state, weekly chain. No screens yet.

Live-data hosts were not reachable from the Claude Code cloud environment on this date (every financial host was blocked by the network policy; see the reachability log in `sources.md`). The first screen runs once those domains are allowed, or from a local Claude Code session with Firecrawl or Playwright connected.
