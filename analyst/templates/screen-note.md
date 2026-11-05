---
date: YYYY-MM-DD
run_started_utc: YYYY-MM-DDTHH:MM:SSZ
framework_version: "1.0"
status: DRAFT
checked_utc:
check_cycles: 0
tools_used: []
input_json: screens/YYYY-MM-DD.input.json
---

# Screen — YYYY-MM-DD

> Research, not advice. Every figure below carries a source and a date, or the word UNVERIFIED. The scores rank what the data shows; they do not know whether a company is a good investment, and neither does the agent.

## 1. Memory briefing (from state.md)

- Screens on record: N (first: YYYY-MM-DD)
- Repeat appearances: TICKER — 61 (YYYY-MM-DD) → 66 (YYYY-MM-DD), rising
- Suppressed profiles (passed on more than N times): TICKER — reasons given: "…", "…". Profile in one sentence: …
- Holdings, with updated risk notes: TICKER — price $X (source, date) vs $Y at list date (±Z%); new filings since: …
- Movers from the last N weeks of lists: TICKER — $X (list date) → $Y (today, source) = ±Z%

## 2. Method and universe

- Insider source: URL, retrieved YYYY-MM-DDTHH:MMZ, rows returned N
- Cutoffs applied: purchases ≥ $100,000 per company; market cap > $500M; at most 25 candidates by purchase value
- Candidates carried into figure pulls: N — TICKER, TICKER, …
- Tools used, and anything that was refused or blocked: …

## 3. Ranked watchlist

| Rank | Ticker | Company | Composite | Insider | Surprise | FCF yield | Sentiment | Price vs IV estimate |
|---|---|---|---|---|---|---|---|---|

### 1. Company name (TICKER)

- Composite: 0.30×I + 0.25×E + 0.25×F + 0.20×A = … + … + … + … = …  → NN (rounded half up)
- Thesis: one sentence; every claim traceable to a row of the source log.
- Top risk: one sentence, specific to this company, with the figure or filing behind it.
- Price vs intrinsic value: price $X (source, date) vs ESTIMATE $Y (15 × TTM FCF per share: FCF $…, shares …) → Z% discount/premium. Consensus target $T from N analysts (source, date), if shown.
- Criteria: insider ✓ ($value, N buyers, trade dates) · FCF TTM ✓ ($…) · market cap ✓ ($…) · P/E ✓ (x vs sector y) · surprises ✓ (q1 %, q2 %)

| Factor | Raw input | Sub-score | Source | As of |
|---|---|---|---|---|
| Insider | | | | |
| Surprise | | | | |
| FCF yield | | | | |
| Sentiment | | | | |

## 4. Unranked: UNVERIFIED scoring inputs

| Ticker | Company | Factors scored | UNVERIFIED | What was tried |
|---|---|---|---|---|

## 5. Could not verify: UNVERIFIED criterion figures

| Ticker | Company | Criterion | What was tried |
|---|---|---|---|

## 6. Excluded: failed a criterion, or a suppressed profile

| Ticker | Company | Failed criterion / reason | Figure | Source | As of |
|---|---|---|---|---|---|

## 7. Source log

| Ticker | Figure | Value | Source URL | Source as-of | Retrieved UTC | Tool |
|---|---|---|---|---|---|---|

## 8. Checker verdict

pending — see checks/YYYY-MM-DD.md
