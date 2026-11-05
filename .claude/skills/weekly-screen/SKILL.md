---
name: weekly-screen
description: The full weekly chain for the stock research analyst - read analyst/state.md, run the screen with live data, hand it to an independent checker, fix and re-check up to three cycles, finalise the dated note, append the state entry, commit. Use when the user says "weekly screen", "run the weekly", "do the full run", or when a scheduled task asks for the weekly run.
---

# Weekly screen: the whole chain

Run every step. Never skip the checker because the screen looks fine. An agent that grades its own homework reports a great week every week.

1. **Preflight.** `git status` must show nothing modified under `analyst/`. Read `analyst/README.md`, `analyst/framework.md` and `analyst/sources.md`. Do the tool and reachability check from `/run-screen`. If live sources are unreachable, follow the ABORTED path in `/run-screen`, then go to step 7 so the gap is recorded and committed.
2. **Screen.** Follow `/run-screen` to a DRAFT note and its input JSON.
3. **Check with fresh eyes.** Run `/check-screen` as a fresh subagent (Agent tool, general-purpose) whose prompt contains only: the text of `.claude/skills/check-screen/SKILL.md`, the paths of `analyst/framework.md`, the note and the input JSON, and the instruction to write the report file. Do not pass it your reasoning, your candidate list or your fetched pages. If no subagent tool exists, run the checker yourself after re-reading only the note and the framework, and state that limitation in the report.
4. **Fix loop.** On FAIL, go back to `/run-screen` for exactly the companies and figures named: re-fetch from live sources (never patch a number by hand), re-run `score.py`, update the note, and send it to a new fresh checker. At most three cycles. If the third check still fails, set `status: CHECK-FAILED`, move the ranked table under a heading "Not released: failed check" with the checker's findings beside it, and continue, so the failure is on record. Only a passed watchlist reaches the user.
5. **Finalise.** On PASS set `status: CHECKED-PASS`, `checked_utc`, `check_cycles`, and paste the checker verdict into section 8 of the note.
6. **State.** Build the entry from `analyst/templates/state-entry.md`: date, every watchlisted name with score and previous score if any, price at list, repeats and movers, holdings risk notes, blank decision lines. Append it: `python3 analyst/scripts/append_state.py --type screen --date YYYY-MM-DD --body-file <entry>`. Then `python3 analyst/scripts/append_state.py --verify` must print OK.
7. **Commit.** `git add analyst/` and commit as `Weekly screen YYYY-MM-DD: PASS` (or `CHECK-FAILED`, or `ABORTED`). In a cloud session also `git push -u origin <current branch>`. Never open a pull request from this chain.
8. **Report** in a few lines: verdict, cycles, the ranked names with scores, the note path, and the one question that closes the loop: which names did you act on, which did you pass on, and why? The answer goes into state.md with `/log-decisions`.
