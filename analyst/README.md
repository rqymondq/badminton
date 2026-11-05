# Research analyst

A stock research analyst that runs inside Claude Code. It screens companies against fixed criteria, scores them the same way every run, has its work checked by a second pass that assumes it is wrong, remembers what you did with each list, and runs on a schedule. Built from the guide *How to Create a Stock Research Analyst with Claude Fable*.

**Not financial advice.** The agent produces research, not recommendations, and it can be confidently wrong about a number. Verify every figure against the primary source before you risk money on it. Past performance does not guarantee future results. Treat the whole thing as a research assistant with a fast pen and no judgement: it compresses a morning of data gathering into minutes, and it does not know whether a company is a good investment. Neither does a score.

## What is where

| Path | Role |
|---|---|
| `framework.md` | The mandate: criteria, weights, rubrics, output format, hard rules. The one file to edit when your criteria change. |
| `sources.md` | Where each figure comes from, how to pull it politely, and which hosts the current environment can reach. |
| `state.md` | Append-only memory. Every screen, every decision, every aborted run. |
| `screens/` | One dated note per run, with its scoring input JSON beside it. |
| `checks/` | The checker's report for each run. |
| `scripts/score.py` | Deterministic scoring: criteria, rubrics, composite arithmetic written out. |
| `scripts/append_state.py` | The only way `state.md` gets written. Refuses to alter history; `--verify` proves it against git. |
| `scripts/test_score.py` | Tests for both scripts, on synthetic fixtures. |
| `templates/` | Skeletons for the screen note, the checker report and the state entry. |
| `../.claude/skills/` | The four skills Claude Code loads from this repository: `run-screen`, `check-screen`, `weekly-screen`, `log-decisions`. |

Open this folder in Obsidian as a vault if you like reading there; every file is plain Markdown.

## The loop

```
state.md ──read first──▶ run-screen ──DRAFT note──▶ check-screen (fresh eyes)
    ▲                        ▲                             │
    │                        └──── FAIL: named figures ────┤  (max 3 cycles)
    │                                                      │ PASS
    └──── append entry ◀── finalise note ◀─────────────────┘
    ▲
    └──── log-decisions ◀── you read it (10 minutes) and decide
```

1. `run-screen` reads `state.md`, pulls live figures with whatever tools the session has, scores them with `score.py`, and writes a DRAFT note.
2. `check-screen` runs in a fresh context with only the framework and the note. It re-sources two figures, recomputes two composites by hand, tests every thesis, every criterion and every risk, and reports PASS or FAIL. It never fixes.
3. A FAIL goes back to the screen for the named figures, re-fetched live, then to a new checker. Three cycles at most. Only a passed list is released.
4. On PASS the note is finalised and a dated entry is appended to `state.md`.
5. You read the list and tell the agent what you did: `log-decisions`. That sentence is what sharpens the next list. Names you pass on more than twice stop being surfaced; names you hold get a risk note every run.

## Commands

Say it in plain words; the skills trigger on intent.

| You say | Skill | What happens |
|---|---|---|
| "run a screen" | `run-screen` | Live screen, DRAFT note in `screens/` |
| "check the screen" | `check-screen` | Independent check, report in `checks/` |
| "run the weekly screen" | `weekly-screen` | The whole chain, state entry, commit. This is what the scheduled task runs. |
| "I bought X, passed on Y because Z" | `log-decisions` | Append-only decisions entry |

Scripts, from the repository root:

```bash
python3 analyst/scripts/test_score.py
```

```bash
python3 analyst/scripts/score.py --schema
```

```bash
python3 analyst/scripts/append_state.py --verify
```

## Setup: giving it hands

Claude on its own works from training data months old, which is worthless for live markets. The skills look for tools in this order and use the best one present.

### A. Claude Code on your own machine (closest to the guide)

- **Firecrawl** (search and scrape to clean text): `claude mcp add firecrawl -e FIRECRAWL_API_KEY=your-key -- npx -y firecrawl-mcp`
- **Playwright** (a real browser for screeners with ten filters, numbers behind dropdowns, click-through disclaimers): `claude mcp add playwright -- npx -y @playwright/mcp@latest`
- **Obsidian**: open `analyst/` as a vault (File → Open folder as vault). If you use the Obsidian MCP, point it at this folder.

The guide's shortcut works as written: tell Claude Code "Install Firecrawl and Playwright for me, walk me through it step by step for my machine, and run the commands you need to run." Check the two commands above against the current Firecrawl and Playwright MCP docs before running them.

Then, from the repository root: `claude`, and say "run the weekly screen".

### B. Claude Code cloud (where this was built)

The skills fall back to WebFetch, WebSearch and curl, but outbound hosts are limited by the environment's network policy, and a session reads that policy once, when it starts. On 2026-11-05 every financial host was blocked until the policy was widened; after that, fresh sessions reached openinsider.com and finviz.com, while www.sec.gov and stockanalysis.com answered 403 to a bare curl (the SEC wants a descriptive User-Agent; StockAnalysis wants browser headers). The reachability log and the domain list are in `sources.md`; the steps are at https://code.claude.com/docs/en/cloud-environments#network-access. A cloud run that cannot reach any insider source writes an ABORTED note and never invents a figure.

### C. The weekly scheduled task

A scheduled task named **Weekly stock screen** fires every Monday at 05:40 America/New_York into a standing session called **Weekly screen runner**. That session was created with this repository as its source, so it holds push rights; a session that a scheduled task starts from scratch does not, which is how the first run lost its commit. Each firing resumes the runner: it pulls the branch, runs `weekly-screen`, and commits and pushes the note, the check and the state entry. You wake up to a passed, sourced, ranked watchlist, or to an honest ABORTED note. To change the day or time, or to stop it, ask Claude Code to update or delete the scheduled task named Weekly stock screen; if the runner session is ever archived, ask for a new runner created with the repository as its source and the task re-bound to it.

## Weekly rhythm

1. Monday morning: read `screens/<date>.md`. Ten minutes. Check the numbers you care about against the primary source linked in the source log.
2. Decide. The one thing no agent should do for you.
3. Tell the agent: "I bought X, passed on Y because Z." `log-decisions` appends it.
4. Week four the list is sharper. Month three it is calibrated to what you actually do, not what you said you wanted.

## Adapting it

- **Criteria and weights**: edit the tables in `framework.md` and the JSON block beneath them together, bump `framework_version`, add a change-log row. Both the screen and the checker pick the change up on the next run, and every note records the version it used.
- **Universe cutoffs, memory thresholds, intrinsic value multiple**: same JSON block.
- **Sources**: `sources.md`.
- **The checker's checks**: `.claude/skills/check-screen/SKILL.md`. Keep "recalculate two scores by hand"; it is the highest-value line.

## Hard rules

1. Every number gets a source and a date, or it gets marked UNVERIFIED. No exceptions.
2. The agent produces research, never recommendations. It can score, rank and flag risk. You decide, always.
3. The checker never fixes, it only reports, and the screen never grades itself.
4. Scrape politely and legally: official sources where they exist, the terms of each site respected, no hammering a screener with automated requests.
5. Never delete history. `state.md` is append-only.
