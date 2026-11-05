---
name: log-decisions
description: Close the loop after a screen by recording which watchlist names the user acted on, passed on (and why), is holding or sold, as an append-only entry in analyst/state.md so future screens calibrate to real decisions. Use when the user says things like "I bought X", "I passed on Y because", "log my decisions", "I'm holding Z", "stop showing me that kind of company".
---

# Log decisions

This single sentence a week is what feeds the calibration. An agent that never learns your decisions stays a stranger.

1. Read the newest `screen` entry in `analyst/state.md` to know which list the user means. If a ticker they name sits on several lists, ask which date.
2. Turn what they said into lines, keeping their words for the reasons:
   - `ACTED: TICKER — <their words>`
   - `PASSED: TICKER — reason: <their words>` (no reason given → `reason: none given`)
   - `HOLDING: TICKER — since <date if given>`
   - `SOLD: TICKER — <their words>`
   - `NOTE: <anything else to remember, such as a profile to stop surfacing>`
3. Append: `python3 analyst/scripts/append_state.py --type decisions --date <today> --title "re: screen YYYY-MM-DD" --body-file <entry>`. Never edit an earlier entry, even to correct it; a correction is a new NOTE line.
4. Read the appended entry back to the user in two lines. If a name has now been passed on more than twice, say that its profile will stop being surfaced.
5. Commit `analyst/state.md` (and push in a cloud session).

No judgement on the decisions. Record them.
