#!/usr/bin/env python3
"""Append-only writer for analyst/state.md. It never edits or deletes existing text.

Usage:
  python3 analyst/scripts/append_state.py --type screen --date 2026-11-10 --body-file entry.md
  python3 analyst/scripts/append_state.py --type decisions --title "re: screen 2026-11-10" --body "ACTED: ..."
  echo "text" | python3 analyst/scripts/append_state.py --type note
  python3 analyst/scripts/append_state.py --verify

--verify checks that the committed version of state.md (git HEAD) is still a
prefix of the working copy, which proves nothing earlier was changed or removed.
The weekly chain runs it before every commit.
"""
from __future__ import annotations

import argparse
import datetime as dt
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DEFAULT_STATE = HERE.parent / "state.md"
TYPES = ("screen", "decisions", "note", "run")


def verify(state: Path) -> int:
    try:
        top = subprocess.run(["git", "rev-parse", "--show-toplevel"], cwd=state.parent,
                             capture_output=True, text=True, check=True).stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("not a git repository; nothing to compare against")
        return 0
    rel = state.resolve().relative_to(Path(top).resolve()).as_posix()
    head = subprocess.run(["git", "show", f"HEAD:{rel}"], cwd=top, capture_output=True, text=True)
    if head.returncode != 0:
        print(f"{rel}: no committed version yet; nothing to compare against")
        return 0
    cur = state.read_text(encoding="utf-8")
    if cur.startswith(head.stdout):
        print(f"OK: committed history preserved ({len(cur) - len(head.stdout)} chars appended since HEAD)")
        return 0
    print(f"FAIL: {rel} no longer starts with its committed content; history was edited or deleted. Restore it with git checkout -- {rel} and append again.")
    return 1


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--state", default=str(DEFAULT_STATE))
    p.add_argument("--verify", action="store_true")
    p.add_argument("--type", choices=TYPES)
    p.add_argument("--date", help="YYYY-MM-DD; default today (UTC)")
    p.add_argument("--title", help="short title after the type")
    p.add_argument("--body", help="entry text")
    p.add_argument("--body-file", help="file with the entry text (stdin if neither given)")
    a = p.parse_args(argv)
    state = Path(a.state)

    if a.verify:
        return verify(state)
    if not a.type:
        p.error("--type is required (or --verify)")

    if a.body is not None:
        body = a.body
    elif a.body_file:
        body = Path(a.body_file).read_text(encoding="utf-8")
    else:
        body = sys.stdin.read()
    if not body.strip():
        p.error("refusing to append an empty entry")

    date = a.date or dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")
    try:
        dt.date.fromisoformat(date)
    except ValueError:
        p.error(f"--date must be YYYY-MM-DD, got {date!r}")

    header = f"## {date} — {a.type}" + (f": {a.title}" if a.title else "")
    old = state.read_text(encoding="utf-8") if state.exists() else ""
    if old and not old.endswith("\n"):
        sep = "\n\n"
    elif old.endswith("\n\n") or not old:
        sep = ""
    else:
        sep = "\n"
    entry = f"{sep}{header}\n\n{body.strip()}\n"
    new = old + entry
    assert new.startswith(old)

    backup = state.with_suffix(".md.bak")
    if old:
        backup.write_text(old, encoding="utf-8")
    state.write_text(new, encoding="utf-8")
    check = state.read_text(encoding="utf-8")
    if not check.startswith(old) or not check.endswith(entry):
        if old:
            state.write_text(old, encoding="utf-8")
        print("FAIL: write did not verify; original restored", file=sys.stderr)
        return 1
    if backup.exists():
        backup.unlink()
    print(f"appended {len(entry)} chars under {header!r} to {state}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
