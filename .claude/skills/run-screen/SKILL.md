---
name: run-screen
description: Run the stock screen defined in analyst/framework.md with live data and write a dated, sourced, scored watchlist note to analyst/screens/. Use whenever the user says "run a screen", "run the screen", "screen", "new watchlist" or asks for this week's watchlist. Research only, never recommendations; every figure sourced and dated or marked UNVERIFIED.
---

# Run a screen

You are the stock research analyst defined in `analyst/framework.md`. Read that file first, in full, every time. It holds the criteria, the weights, the rubrics, the output format and the hard rules. This skill holds the procedure. `analyst/sources.md` holds where each figure comes from.

## Before anything: tools and reachability

1. Work out which live-data tools this session has, in this order of preference: Firecrawl (MCP tools named `firecrawl_*`), a browser (Playwright MCP tools, or a Playwright script run with `node`), then WebFetch, WebSearch or curl. Memory is never a source.
2. Make one request to the primary insider source in `analyst/sources.md`. If the host is blocked or does not resolve, make one request to the first fallback. If no insider source is reachable, stop here: write `analyst/screens/YYYY-MM-DD.md` from the template with `status: ABORTED` and the blocked hosts named, append a `run` entry to state.md with `analyst/scripts/append_state.py --type run`, add a row to the reachability log in sources.md, and tell the user which domains to allow. Do not continue with partial or remembered figures. Do not invent a watchlist.
3. Record the UTC start time. Every figure you log gets the source's own as-of date and your retrieval time.

## Step 1: memory briefing

Read `analyst/state.md` top to bottom. Before pulling any data, write section 1 of the note:

- Repeat appearances: names on any previous watchlist, their score each time, direction of change.
- Suppressed profiles: names the user has passed on more than `memory.pass_suppress_after` times (config block in framework.md), with the reasons they gave. Do not surface those names again; if one would otherwise make the list, put it under Excluded with the reason "passed on N times". Describe the common profile of the passes in one sentence so the user can see what the system has learned.
- Holdings: names the user acted on or said they hold. For each, an updated risk note from live data this run (price now versus the list date, any new filing or rating action).
- Movers: names from lists in the last `memory.movers_lookback_weeks` weeks whose price has moved more than `memory.mover_threshold_pct` percent since their list date, with both prices and dates.

If state.md holds no screens yet, say so in one line and move on.

## Step 2: candidate universe

- Pull open-market insider purchases (Form 4 code P) filed in the last 14 days from the primary insider source. Record URL and retrieval time.
- Keep companies whose total purchase value in the window is at least `screen.min_purchase_value_usd_per_company`. Collapse to one row per ticker: total value, distinct buyers, most senior buyer title, whether any insider sold in the window.
- Drop anything at or below `screen.min_market_cap_usd` as soon as you have a sourced market cap.
- If more than `screen.max_candidates` remain, keep the largest by purchase value and say so in the note.
- One request at a time per host, no retries on a refusal, terms and robots respected (sources.md).

## Step 3: figures per candidate

For each candidate, each with source URL and as-of date: market cap; trailing P/E and the sector trailing P/E from the same source; FCF TTM (official cash-flow figures first, otherwise a named aggregator's TTM); EPS surprise % for the last two reported quarters; rating upgrades and downgrades in the last 90 days; current price; shares outstanding; consensus price target if the page shows one.

- Quote figures as the page shows them. When a tool summarises a page for you (WebFetch does), ask it to quote the exact label and value. Prefer machine-readable endpoints where they exist.
- A figure you could not get is UNVERIFIED. Write the word, note what you tried, move on. Never fill it from memory, from a similar company, or from last week's note.
- Add every figure to the source log table as you go, not at the end.

## Step 4: criteria, then scores

- Build the scoring input JSON (`python3 analyst/scripts/score.py --schema` shows the shape; `null` for anything UNVERIFIED) and save it as `analyst/screens/YYYY-MM-DD.input.json`.
- Run `python3 analyst/scripts/score.py analyst/screens/YYYY-MM-DD.input.json`. The script applies the criteria and rubrics from framework.md, refuses to rank a company that fails a criterion or has an UNVERIFIED criterion figure, leaves partial inputs unranked, and prints the arithmetic line for each composite. Paste its output into the note. Never hand-compute a composite that differs from it.

## Step 5: write the note

Use `analyst/templates/screen-note.md`. For each ranked company: name and ticker, composite with arithmetic line, one-line thesis (every claim traceable to a source-log row), top risk (specific, with the figure or filing behind it), price versus the intrinsic value ESTIMATE with its method, the five criteria with figures, the factor table. Then the unranked UNVERIFIED companies, the could-not-verify companies, the excluded companies with the failing criterion, the full source log, and the checker section left as "pending". Set `status: DRAFT`. A draft is not a deliverable.

## Step 6: hand off

- Inside the weekly chain (`/weekly-screen`): return the note path and stop. The chain runs the checker with fresh eyes.
- Run on its own: say plainly that the note is a DRAFT pending `/check-screen` and offer to run the checker now. Do not append the screen entry to state.md; that happens after a PASS.

## Language

Score, rank, flag risk. Never recommend an action, never size a position, never write buy, sell, hold, accumulate or should. If you catch yourself writing one, rewrite the sentence as an observation with a figure in it.
