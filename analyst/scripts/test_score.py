#!/usr/bin/env python3
"""Tests for score.py and append_state.py. Inputs here are synthetic test fixtures, not market data.

Run: python3 analyst/scripts/test_score.py
"""
from __future__ import annotations

import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import score  # noqa: E402

CFG = score.load_config(score.DEFAULT_FRAMEWORK)


def company(**over):
    base = copy.deepcopy(score.EXAMPLE_INPUT["companies"][0])
    for k, v in over.items():
        if isinstance(v, dict) and isinstance(base.get(k), dict):
            base[k].update(v)
        else:
            base[k] = v
    return base


class Rubrics(unittest.TestCase):
    def test_band_edges(self):
        bands = CFG["insider"]["value_bands_usd"]
        self.assertEqual(score.band(49999, bands), 20)
        self.assertEqual(score.band(50000, bands), 40)
        self.assertEqual(score.band(999999.99, bands), 60)
        self.assertEqual(score.band(1000000, bands), 80)
        self.assertEqual(score.band(5000000, bands), 90)

    def test_insider_adjustments(self):
        s, _ = score.insider_score({"purchase_value_usd": 1250000, "n_buyers": 3, "senior_buyer": True}, CFG)
        self.assertEqual(s, 95)  # 80 + 10 + 5
        s, _ = score.insider_score({"purchase_value_usd": 1250000, "n_buyers": 1, "any_sale": True}, CFG)
        self.assertEqual(s, 65)  # 80 - 15
        s, _ = score.insider_score({"purchase_value_usd": 6000000, "n_buyers": 1, "ten_percent_owner_only": True}, CFG)
        self.assertEqual(s, 60)  # capped
        s, _ = score.insider_score({"purchase_value_usd": 0}, CFG)
        self.assertEqual(s, 0)
        s, why = score.insider_score(None, CFG)
        self.assertIsNone(s)
        self.assertIn("UNVERIFIED", why)

    def test_surprise(self):
        self.assertEqual(score.surprise_score({"q1_pct": 6.1, "q2_pct": 3.4}, CFG)[0], 55)   # avg 4.75
        self.assertEqual(score.surprise_score({"q1_pct": 30, "q2_pct": 0.5}, CFG)[0], 75)    # 85 - 10 weak beat
        self.assertEqual(score.surprise_score({"q1_pct": 5, "q2_pct": -1}, CFG)[0], 0)
        self.assertIsNone(score.surprise_score({"q1_pct": 5, "q2_pct": None}, CFG)[0])

    def test_fcf_yield(self):
        self.assertEqual(score.fcf_yield_score({"fcf_ttm_usd": 180e6, "market_cap_usd": 2.6e9}, CFG)[0], 75)  # 6.92%
        self.assertEqual(score.fcf_yield_score({"fcf_ttm_usd": 1, "market_cap_usd": 1e9}, CFG)[0], 25)
        self.assertEqual(score.fcf_yield_score({"fcf_ttm_usd": -5, "market_cap_usd": 1e9}, CFG)[0], 0)
        self.assertIsNone(score.fcf_yield_score({"fcf_ttm_usd": 5, "market_cap_usd": None}, CFG)[0])

    def test_sentiment(self):
        self.assertEqual(score.sentiment_score({"upgrades": 2, "downgrades": 1}, CFG)[0], 65)
        self.assertEqual(score.sentiment_score({"upgrades": 0, "downgrades": 5}, CFG)[0], 10)
        self.assertEqual(score.sentiment_score({"upgrades": 7, "downgrades": 0}, CFG)[0], 100)
        s, why = score.sentiment_score({"upgrades": 0, "downgrades": 0}, CFG)
        self.assertEqual(s, 50)
        self.assertIn("no rating actions", why)


class Composite(unittest.TestCase):
    def test_arithmetic_and_half_up(self):
        c, line = score.composite({"insider": 80, "surprise": 70, "fcf_yield": 60, "sentiment": 50}, CFG["weights"])
        self.assertEqual(c, 67)  # 24 + 17.5 + 15 + 10 = 66.5 → 67 half up
        self.assertIn("66.50", line)
        c, _ = score.composite({"insider": 100, "surprise": 100, "fcf_yield": 100, "sentiment": 100}, CFG["weights"])
        self.assertEqual(c, 100)

    def test_example_company_ranked(self):
        out = score.run({"as_of": "test", "companies": [company()]}, CFG)
        self.assertEqual(len(out["ranked"]), 1)
        r = out["ranked"][0]
        # 95, 55, 75, 65 → 28.5 + 13.75 + 18.75 + 13 = 74
        self.assertEqual(r["composite"], 74)
        self.assertIn("→ 74", r["arithmetic"])
        self.assertAlmostEqual(r["intrinsic_value"]["estimate"], 42.86, places=2)

    def test_failed_criterion_is_excluded(self):
        out = score.run({"as_of": "t", "companies": [company(valuation={"pe": 25, "sector_pe": 19.8})]}, CFG)
        self.assertEqual(out["ranked"], [])
        self.assertEqual(out["excluded"][0]["reason"], "failed: P/E below sector average")
        out = score.run({"as_of": "t", "companies": [company(fcf={"market_cap_usd": 400e6})]}, CFG)
        self.assertIn("market cap", out["excluded"][0]["reason"])

    def test_unverified_criterion_not_ranked(self):
        out = score.run({"as_of": "t", "companies": [company(valuation={"sector_pe": None})]}, CFG)
        self.assertEqual(out["ranked"], [])
        self.assertEqual(len(out["could_not_verify"]), 1)

    def test_unverified_factor_unranked(self):
        out = score.run({"as_of": "t", "companies": [company(sentiment=None)]}, CFG)
        self.assertEqual(out["ranked"], [])
        self.assertEqual(len(out["unranked_partial"]), 1)
        self.assertIn("3 of 4", out["unranked_partial"][0]["reason"])

    def test_ordering_and_tiebreak(self):
        a = company(ticker="AAA")
        b = company(ticker="BBB", fcf={"fcf_ttm_usd": 200e6})  # same bands, higher yield
        out = score.run({"as_of": "t", "companies": [a, b]}, CFG)
        self.assertEqual([r["ticker"] for r in out["ranked"]], ["BBB", "AAA"])

    def test_markdown_renders(self):
        out = score.run({"as_of": "t", "companies": [company(), company(ticker="ZZZ", insider=None)]}, CFG)
        md = score.to_markdown(out)
        self.assertIn("| 1 | XMPL |", md)
        self.assertIn("UNVERIFIED", md)
        self.assertIn("rounded half up", md)


class AppendState(unittest.TestCase):
    def test_append_only(self):
        with tempfile.TemporaryDirectory() as d:
            state = Path(d) / "state.md"
            state.write_text("# State\n\n---\n", encoding="utf-8")
            script = HERE / "append_state.py"
            r = subprocess.run([sys.executable, str(script), "--state", str(state), "--type", "note",
                                "--date", "2026-01-02", "--title", "t", "--body", "hello"],
                               capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, r.stderr)
            txt = state.read_text(encoding="utf-8")
            self.assertTrue(txt.startswith("# State\n\n---\n"))
            self.assertTrue(txt.endswith("## 2026-01-02 — note: t\n\nhello\n"))
            r = subprocess.run([sys.executable, str(script), "--state", str(state), "--type", "run", "--body", "  "],
                               capture_output=True, text=True)
            self.assertNotEqual(r.returncode, 0)
            self.assertEqual(state.read_text(encoding="utf-8"), txt)  # untouched
            r = subprocess.run([sys.executable, str(script), "--state", str(state), "--type", "run", "--date", "bad"],
                               input="x", capture_output=True, text=True)
            self.assertNotEqual(r.returncode, 0)


if __name__ == "__main__":
    unittest.main(verbosity=1)
