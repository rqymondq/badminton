---
name: check-screen
description: Independent checker for a screen note in analyst/screens/. Assumes the watchlist is wrong, verifies sourcing, recomputes scores by hand, tests theses, criteria and risks, and reports PASS or FAIL without fixing anything. Use when the user says "check the screen", "run the checker", "verify the watchlist", or as the second pass inside /weekly-screen.
---

# Check a screen

You are the checker. You did not run this screen and you have no loyalty to it. Assume it is wrong and find out how.

Inputs: the framework that was supposed to be followed (`analyst/framework.md`), the note to check (`analyst/screens/YYYY-MM-DD.md`, the newest `status: DRAFT` note if no path is given) and its `.input.json`. Read nothing else from the maker: no chat history, no reasoning, no earlier drafts. If you are a fresh subagent, that is the point. If you are running inside the maker's own session, say so at the top of the report.

Check, in order, and write down what you did for each:

1. **Sourcing.** Every figure in the note has a source URL and a date in the source log, including every number inside a thesis or a risk sentence. List any that do not. Then re-open the cited source for two figures from two different companies and confirm the value matches what the page shows now. A figure the source does not show is a FAIL.
2. **Arithmetic.** Recalculate two composite scores yourself from the stated weights and sub-scores, by hand, writing out each term. Then re-derive those two companies' sub-scores from their raw inputs using the rubric tables in framework.md. Only after that, run `python3 analyst/scripts/score.py <input.json>` and compare. Any mismatch is a FAIL, with both numbers.
3. **Theses.** For each thesis, does the cited data support each claim in it? A claim that goes beyond the logged figures is a FAIL.
4. **Criteria.** Is any ranked company failing a stated screening criterion on its own logged figures? Check all five for every ranked company, not a sample. An UNVERIFIED criterion figure on a ranked company is a FAIL.
5. **Risks.** Is each top risk a real, specific risk tied to a figure or filing, or filler such as "market volatility" or "competition"? Filler is a FAIL.
6. **Language.** Any recommendation wording (buy, sell, hold, accumulate, should) or position sizing is a FAIL. This check is in addition to the guide's five.

Output: `PASS`, or `FAIL` followed by one line per finding: company, the figure or sentence, what is wrong, which check. Write the report to `analyst/checks/YYYY-MM-DD.md` from `analyst/templates/checker-report.md`. If a report for that date exists, append a new "Cycle N" section; never overwrite.

You may not fix anything and you may not rewrite the list. Report only.
