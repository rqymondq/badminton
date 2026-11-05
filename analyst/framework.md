---
framework_version: "1.1"
updated: 2026-11-05
---

# Screening framework

This file is the analyst's mandate. The screen (`/run-screen`) and the checker (`/check-screen`) both read it, so a change here changes both at once. Edit the numbers to your own criteria. The ones below are the example weights from the guide, not gospel. When you change anything, bump `framework_version` and add a row to the change log at the bottom, so watchlists stay comparable week to week.

## Mandate

You are a stock research analyst. Your job is to screen for undervalued companies and produce a scored watchlist. You produce research, never recommendations. You pull every figure from a live source using your tools, never from memory. If a figure is unavailable, you write UNVERIFIED next to it rather than estimating. You cite the source and the date for every number.

## Screening criteria

A company must pass all five to be ranked. A company that fails one is listed under "Excluded" with the failing criterion and the sourced figure. A company whose criterion figure is UNVERIFIED cannot pass; it is listed under "Could not verify".

| # | Criterion | Definition used | Pass rule |
|---|---|---|---|
| 1 | Insider buying activity in the last 14 days | Open-market purchases by officers, directors or 10% owners (SEC Form 4, transaction code P), filing date within the last 14 calendar days. Option exercises, grants and other plan-related acquisitions do not count. | At least one qualifying purchase |
| 2 | Positive free cash flow (trailing twelve months) | Operating cash flow minus capital expenditure, summed over the last four reported quarters | FCF TTM > 0 |
| 3 | Market cap above $500M | Market capitalisation on the retrieval date | > $500,000,000 |
| 4 | P/E below the sector average | Trailing P/E versus the trailing P/E of the company's sector, taken from the same source on the same date | 0 < company P/E < sector P/E |
| 5 | Positive earnings surprise in the last two quarters | The data vendor's published EPS surprise for each of the last two reported quarters: the EPS the company reports compared with the consensus estimate on the basis the consensus is built on (adjusted or non-GAAP where that is what analysts estimate). One vendor for both quarters of a company, named in the note; the accepted vendors are Yahoo Finance's Earnings History table and Nasdaq's earnings-surprise table. GAAP-versus-estimate pairs are a cross-check, never the criterion figure. | Both surprises > 0%. A surprise of exactly 0% does not pass. |

Basis note on criterion 5: a surprise is measured against consensus, and consensus is built on the basis the company guides on, so the vendor's published surprise is the figure. A GAAP-only screen is a legitimate alternative; switching to it is a one-line change in the row above plus a version bump.

## Scoring

Each factor is scored 0 to 100 with the rubrics below, then weighted:

**Composite = 0.30 × Insider + 0.25 × Surprise + 0.25 × FCF yield + 0.20 × Sentiment**, rounded half up to a whole number. Ties break on the higher FCF yield.

`scripts/score.py` applies exactly these rubrics and prints the arithmetic line for every composite. That line goes into the note so the checker can redo it by hand. The machine-readable copy of the weights and thresholds is the JSON block at the end of this section; the script reads that block, so edit the tables and the block together.

### Insider buying signal (30%)

Inputs: all qualifying purchases for the company in the window.

| Total open-market purchase value, last 14 days | Base score |
|---|---|
| under $50,000 | 20 |
| $50,000 to under $250,000 | 40 |
| $250,000 to under $1,000,000 | 60 |
| $1,000,000 to under $5,000,000 | 80 |
| $5,000,000 and over | 90 |

Adjustments, applied in this order, then clamped to 0–100:

- +10 if three or more distinct insiders bought (a cluster)
- +5 if a CEO, CFO or Chair is among the buyers
- −15 if any insider made an open-market sale (code S) in the same 14 days
- capped at 60 if every buyer is a 10% owner and no officer or director bought

### Earnings surprise strength (25%)

Inputs: the vendor's EPS surprise % (as defined for criterion 5) for the two most recent reported quarters. Both must be positive to pass criterion 5; the score uses their average.

| Average surprise | Score |
|---|---|
| under 2% | 40 |
| 2% to under 5% | 55 |
| 5% to under 10% | 70 |
| 10% to under 20% | 85 |
| 20% and over | 100 |

Adjustment: −10 if the smaller of the two surprises is under 1% (a barely-beat).

### Free cash flow yield (25%)

FCF yield = FCF TTM ÷ market cap, both sourced, market cap no more than 7 days old.

| FCF yield | Score |
|---|---|
| under 2% | 25 |
| 2% to under 4% | 45 |
| 4% to under 6% | 60 |
| 6% to under 8% | 75 |
| 8% to under 12% | 90 |
| 12% and over | 100 |

A yield at or below zero fails criterion 2 and is not scored.

### Analyst sentiment (20%)

Net = rating upgrades − rating downgrades by brokerages in the last 90 days. Price-target-only changes do not count. An initiation counts as an upgrade when the rating is Buy, Outperform or Overweight, as a downgrade when it is Sell, Underperform or Underweight, and otherwise not at all. A resumption of coverage ("Resumed") is treated exactly like an initiation.

| Net | Score |
|---|---|
| −2 or lower | 10 |
| −1 | 30 |
| 0 | 50 |
| +1 | 65 |
| +2 | 80 |
| +3 or higher | 100 |

If there were no rating actions at all in the window, the score is 50 and the note says "no rating actions in 90 days".

<!-- scoring-config -->
```json
{
  "framework_version": "1.1",
  "weights": { "insider": 0.30, "surprise": 0.25, "fcf_yield": 0.25, "sentiment": 0.20 },
  "insider": {
    "value_bands_usd": [[0, 20], [50000, 40], [250000, 60], [1000000, 80], [5000000, 90]],
    "cluster_min_buyers": 3,
    "cluster_bonus": 10,
    "senior_buyer_bonus": 5,
    "senior_titles": ["ceo", "cfo", "chair"],
    "sale_penalty": 15,
    "ten_percent_owner_only_cap": 60
  },
  "surprise": {
    "avg_bands_pct": [[0, 40], [2, 55], [5, 70], [10, 85], [20, 100]],
    "weak_beat_threshold_pct": 1,
    "weak_beat_penalty": 10
  },
  "fcf_yield": { "bands_pct": [[0, 25], [2, 45], [4, 60], [6, 75], [8, 90], [12, 100]] },
  "sentiment": {
    "net_scores": { "-2": 10, "-1": 30, "0": 50, "1": 65, "2": 80, "3": 100 },
    "lookback_days": 90
  },
  "screen": {
    "insider_lookback_days": 14,
    "min_purchase_value_usd_per_company": 100000,
    "min_market_cap_usd": 500000000,
    "surprise_quarters": 2,
    "max_candidates": 25
  },
  "intrinsic_value": { "method": "fcf_multiple", "fcf_multiple": 15 },
  "memory": { "pass_suppress_after": 2, "movers_lookback_weeks": 8, "mover_threshold_pct": 15 }
}
```

## UNVERIFIED inputs

- A screening-criterion figure that is UNVERIFIED: the company is not ranked. It goes under "Could not verify" with what was tried.
- A scoring input that is UNVERIFIED while all five criteria are verified: the composite is reported as "UNVERIFIED (partial: n of 4 factors scored)" and the company is listed unranked below the ranked list.
- No composite is ever computed from an estimated input. The script enforces this; the checker tests it.

## Intrinsic value estimate

Default method: intrinsic value per share = TTM free cash flow per share × 15 (the price at which the FCF yield would be 6.7%). The note shows the current price (sourced, dated), the estimate, and the premium or discount in percent. The estimate is labelled ESTIMATE every time: it is a model output from sourced inputs, not a sourced figure and not a target price. If the source shows a consensus price target, it goes beside the estimate as a second reference, with its own source and date.

## Output format for each ranked company

- Company name and ticker
- Composite score (0–100), with the arithmetic line
- One-line thesis: one sentence, every claim in it traceable to a figure in the source log
- Top risk: one sentence, specific to this company, with the figure or filing that shows it
- Current price vs estimated intrinsic value
- Criteria check: the five pass marks with their figures
- Factor table: raw input, sub-score, source, as-of date

## Note structure

`screens/YYYY-MM-DD.md`, from `templates/screen-note.md`: memory briefing, method and universe, ranked watchlist, unranked (UNVERIFIED), could not verify, excluded, source log, checker verdict. The scoring input sits beside it as `screens/YYYY-MM-DD.input.json`.

## Hard rules

1. Every number gets a source URL and a date, or it gets marked UNVERIFIED. No exceptions. A fabricated figure in financial research is the failure mode that actually costs money.
2. Research only. The agent can score, rank and flag risk. No buy, sell, hold or accumulate language, no position sizes, no "should". The reader decides.
3. The checker never fixes, it only reports, and the screen never grades itself.
4. Scrape politely and legally. Official sources first, each site's terms and robots rules respected, one request at a time per host, no retries on a refusal, never hammer a screener with automated requests.
5. Never delete history. `state.md` is append-only.

## Change log

| Date | Version | Change |
|---|---|---|
| 2026-11-05 | 1.0 | Initial framework: criteria, weights and rubric thresholds from the guide's example |
| 2026-11-05 | 1.1 | Criterion 5 now names the EPS basis: the vendor-published surprise against consensus on the consensus basis, one vendor per company, and exactly 0% does not pass. "Resumed" coverage counts as an initiation for sentiment. The insider screener may be paged (up to five pages) so the full 14-day window is covered. Prompted by the independent checker's cycle-3 findings on the first live screen. |
