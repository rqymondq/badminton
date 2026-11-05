#!/usr/bin/env python3
"""Deterministic scoring for the stock research analyst.

Reads the weights and rubric thresholds from the JSON block that follows the
line ``<!-- scoring-config -->`` in analyst/framework.md, applies the five
screening criteria and the four factor rubrics to the raw inputs you give it,
and prints every step of the arithmetic so a checker can redo it by hand.

It never estimates. A missing input is UNVERIFIED: a missing criterion figure
keeps the company out of the ranking, a missing factor input leaves it unranked.

Usage:
  python3 analyst/scripts/score.py INPUT.json             markdown report
  python3 analyst/scripts/score.py INPUT.json --json      machine-readable
  python3 analyst/scripts/score.py --schema               input schema and example
  python3 analyst/scripts/score.py --framework PATH ...   another framework file
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

HERE = Path(__file__).resolve().parent
DEFAULT_FRAMEWORK = HERE.parent / "framework.md"
MARKER = "<!-- scoring-config -->"
FACTORS = ("insider", "surprise", "fcf_yield", "sentiment")
CRITERIA = ("insider_14d", "fcf_positive", "market_cap", "pe_below_sector", "surprise_positive_2q")

EXAMPLE_INPUT = {
    "as_of": "YYYY-MM-DD",
    "companies": [
        {
            "ticker": "XMPL",
            "name": "Example Corp (illustrative input only, not data)",
            "insider": {
                "purchase_value_usd": 1250000,
                "n_buyers": 3,
                "senior_buyer": True,
                "any_sale": False,
                "ten_percent_owner_only": False,
            },
            "surprise": {"q1_pct": 6.1, "q2_pct": 3.4},
            "fcf": {"fcf_ttm_usd": 180000000, "market_cap_usd": 2600000000},
            "valuation": {"pe": 14.2, "sector_pe": 19.8},
            "sentiment": {"upgrades": 2, "downgrades": 1},
            "price": 41.3,
            "shares_outstanding": 63000000,
        }
    ],
}

SCHEMA_NOTES = """Input: a JSON object {"as_of": "YYYY-MM-DD", "companies": [...]}.
Each company carries the raw, sourced figures (keep the sources in the note's source log):
  insider     purchase_value_usd (total open-market buys, last 14 days), n_buyers (distinct insiders),
              senior_buyer (true if a CEO/CFO/Chair bought), any_sale (true if any insider sold, code S,
              in the window), ten_percent_owner_only (true if no officer or director bought)
  surprise    q1_pct, q2_pct (EPS surprise %, two most recent reported quarters, most recent first)
  fcf         fcf_ttm_usd, market_cap_usd
  valuation   pe (trailing), sector_pe (trailing, same source and date)
  sentiment   upgrades, downgrades (rating actions, last 90 days)
  price, shares_outstanding  (optional; used only for the intrinsic value ESTIMATE)
Use null for any figure you could not source. Never type a guessed number."""


# ----------------------------------------------------------------------------
# config
# ----------------------------------------------------------------------------
def load_config(path: Path) -> dict:
    text = Path(path).read_text(encoding="utf-8")
    if MARKER not in text:
        sys.exit(f"{path}: marker {MARKER!r} not found")
    after = text.split(MARKER, 1)[1]
    m = re.search(r"```json\s*\n(.*?)\n```", after, re.S)
    if not m:
        sys.exit(f"{path}: no ```json block after the marker")
    cfg = json.loads(m.group(1))
    total = sum(cfg["weights"][f] for f in FACTORS)
    if abs(total - 1.0) > 1e-9:
        sys.exit(f"{path}: weights sum to {total}, not 1.0")
    return cfg


# ----------------------------------------------------------------------------
# helpers
# ----------------------------------------------------------------------------
def is_num(x) -> bool:
    return isinstance(x, (int, float)) and not isinstance(x, bool)


def band(value: float, bands: list) -> int | None:
    """bands: [[lower_bound_inclusive, score], ...] ascending. None if below the first."""
    score = None
    for lower, s in bands:
        if value >= lower:
            score = s
    return score


def clamp(x: float, lo: int = 0, hi: int = 100) -> int:
    return int(max(lo, min(hi, x)))


def money(x: float) -> str:
    return f"${x:,.0f}"


# ----------------------------------------------------------------------------
# factor rubrics: each returns (score or None, explanation)
# ----------------------------------------------------------------------------
def insider_score(d: dict | None, cfg: dict):
    c = cfg["insider"]
    if not d or not is_num(d.get("purchase_value_usd")):
        return None, "UNVERIFIED: purchase value missing"
    v = d["purchase_value_usd"]
    if v <= 0:
        return 0, "no qualifying open-market purchase in the window"
    base = band(v, c["value_bands_usd"])
    score = base
    steps = [f"purchases {money(v)} → base {base}"]
    n = d.get("n_buyers")
    if is_num(n) and n >= c["cluster_min_buyers"]:
        score += c["cluster_bonus"]
        steps.append(f"{int(n)} buyers, cluster +{c['cluster_bonus']}")
    if d.get("senior_buyer") is True:
        score += c["senior_buyer_bonus"]
        steps.append(f"CEO/CFO/Chair bought +{c['senior_buyer_bonus']}")
    if d.get("any_sale") is True:
        score -= c["sale_penalty"]
        steps.append(f"insider sale in window −{c['sale_penalty']}")
    if d.get("ten_percent_owner_only") is True and score > c["ten_percent_owner_only_cap"]:
        score = c["ten_percent_owner_only_cap"]
        steps.append(f"10% owners only, capped at {score}")
    score = clamp(score)
    steps.append(f"= {score}")
    return score, "; ".join(steps)


def surprise_score(d: dict | None, cfg: dict):
    c = cfg["surprise"]
    if not d or not (is_num(d.get("q1_pct")) and is_num(d.get("q2_pct"))):
        return None, "UNVERIFIED: an EPS surprise figure is missing"
    q1, q2 = d["q1_pct"], d["q2_pct"]
    if min(q1, q2) <= 0:
        return 0, f"not positive in both quarters ({q1}%, {q2}%)"
    avg = (q1 + q2) / 2
    base = band(avg, c["avg_bands_pct"])
    score = base
    steps = [f"({q1}% + {q2}%) / 2 = {avg:.2f}% → {base}"]
    if min(q1, q2) < c["weak_beat_threshold_pct"]:
        score -= c["weak_beat_penalty"]
        steps.append(f"weakest beat under {c['weak_beat_threshold_pct']}% −{c['weak_beat_penalty']}")
    score = clamp(score)
    steps.append(f"= {score}")
    return score, "; ".join(steps)


def fcf_yield_pct(d: dict | None):
    if not d or not (is_num(d.get("fcf_ttm_usd")) and is_num(d.get("market_cap_usd"))):
        return None
    if d["market_cap_usd"] <= 0:
        return None
    return d["fcf_ttm_usd"] / d["market_cap_usd"] * 100


def fcf_yield_score(d: dict | None, cfg: dict):
    c = cfg["fcf_yield"]
    y = fcf_yield_pct(d)
    if y is None:
        return None, "UNVERIFIED: FCF TTM or market cap missing"
    if y <= 0:
        return 0, f"FCF yield {y:.2f}% is not positive"
    s = band(y, c["bands_pct"])
    return s, f"{money(d['fcf_ttm_usd'])} / {money(d['market_cap_usd'])} = {y:.2f}% → {s}"


def sentiment_score(d: dict | None, cfg: dict):
    c = cfg["sentiment"]
    if not d or not (is_num(d.get("upgrades")) and is_num(d.get("downgrades"))):
        return None, "UNVERIFIED: rating actions missing"
    up, down = int(d["upgrades"]), int(d["downgrades"])
    net = up - down
    key = str(max(-2, min(3, net)))
    s = c["net_scores"][key]
    note = "" if (up or down) else f" (no rating actions in {c['lookback_days']} days)"
    return s, f"{up} up − {down} down = net {net:+d} → {s}{note}"


# ----------------------------------------------------------------------------
# criteria: True pass, False fail, None UNVERIFIED
# ----------------------------------------------------------------------------
def criteria(co: dict, cfg: dict) -> dict:
    sc = cfg["screen"]
    ins = co.get("insider") or {}
    f = co.get("fcf") or {}
    v = co.get("valuation") or {}
    s = co.get("surprise") or {}
    out = {}
    pv = ins.get("purchase_value_usd")
    out["insider_14d"] = (pv > 0) if is_num(pv) else None
    out["fcf_positive"] = (f["fcf_ttm_usd"] > 0) if is_num(f.get("fcf_ttm_usd")) else None
    out["market_cap"] = (f["market_cap_usd"] > sc["min_market_cap_usd"]) if is_num(f.get("market_cap_usd")) else None
    if is_num(v.get("pe")) and is_num(v.get("sector_pe")):
        out["pe_below_sector"] = 0 < v["pe"] < v["sector_pe"]
    else:
        out["pe_below_sector"] = None
    if is_num(s.get("q1_pct")) and is_num(s.get("q2_pct")):
        out["surprise_positive_2q"] = s["q1_pct"] > 0 and s["q2_pct"] > 0
    else:
        out["surprise_positive_2q"] = None
    return out


CRITERION_LABEL = {
    "insider_14d": "insider buying in last 14 days",
    "fcf_positive": "positive FCF TTM",
    "market_cap": "market cap above minimum",
    "pe_below_sector": "P/E below sector average",
    "surprise_positive_2q": "positive EPS surprise, last two quarters",
}


# ----------------------------------------------------------------------------
# composite
# ----------------------------------------------------------------------------
def composite(scores: dict, weights: dict):
    """Exact decimal arithmetic, rounded half up. Returns (int, arithmetic line)."""
    terms, total = [], Decimal("0")
    for f in FACTORS:
        w = Decimal(str(weights[f]))
        s = Decimal(str(scores[f]))
        t = (w * s).quantize(Decimal("0.01"))
        terms.append((w, s, t))
        total += t
    rounded = int(total.quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    lhs = " + ".join(f"{w:.2f}×{s}" for w, s, _ in terms)
    mid = " + ".join(f"{t}" for _, _, t in terms)
    return rounded, f"{lhs} = {mid} = {total} → {rounded} (rounded half up)"


def intrinsic_value(co: dict, cfg: dict):
    iv = cfg["intrinsic_value"]
    f = co.get("fcf") or {}
    if iv.get("method") != "fcf_multiple":
        return None
    if not (is_num(f.get("fcf_ttm_usd")) and is_num(co.get("shares_outstanding")) and co["shares_outstanding"] > 0):
        return None
    per_share = f["fcf_ttm_usd"] / co["shares_outstanding"]
    est = per_share * iv["fcf_multiple"]
    out = {"fcf_per_share": round(per_share, 4), "multiple": iv["fcf_multiple"], "estimate": round(est, 2)}
    if is_num(co.get("price")) and co["price"] > 0:
        out["price"] = co["price"]
        out["discount_pct"] = round((est - co["price"]) / co["price"] * 100, 1)
    return out


# ----------------------------------------------------------------------------
# evaluation
# ----------------------------------------------------------------------------
def evaluate(co: dict, cfg: dict) -> dict:
    crit = criteria(co, cfg)
    failed = [k for k, v in crit.items() if v is False]
    unverified_crit = [k for k, v in crit.items() if v is None]
    res = {
        "ticker": co.get("ticker", "?"),
        "name": co.get("name", ""),
        "criteria": crit,
        "fcf_yield_pct": fcf_yield_pct(co.get("fcf")),
        "intrinsic_value": intrinsic_value(co, cfg),
    }
    if failed:
        res["status"] = "EXCLUDED"
        res["reason"] = "failed: " + ", ".join(CRITERION_LABEL[k] for k in failed)
        return res
    if unverified_crit:
        res["status"] = "COULD_NOT_VERIFY"
        res["reason"] = "UNVERIFIED criterion: " + ", ".join(CRITERION_LABEL[k] for k in unverified_crit)
        return res
    scored = {
        "insider": insider_score(co.get("insider"), cfg),
        "surprise": surprise_score(co.get("surprise"), cfg),
        "fcf_yield": fcf_yield_score(co.get("fcf"), cfg),
        "sentiment": sentiment_score(co.get("sentiment"), cfg),
    }
    res["factors"] = {k: {"score": v[0], "explanation": v[1]} for k, v in scored.items()}
    missing = [k for k, v in scored.items() if v[0] is None]
    if missing:
        n = len(FACTORS) - len(missing)
        res["status"] = "UNRANKED_PARTIAL"
        res["reason"] = f"UNVERIFIED (partial: {n} of {len(FACTORS)} factors scored; missing {', '.join(missing)})"
        return res
    score, line = composite({k: v[0] for k, v in scored.items()}, cfg["weights"])
    res["status"] = "RANKED"
    res["composite"] = score
    res["arithmetic"] = line
    return res


def run(data: dict, cfg: dict) -> dict:
    results = [evaluate(co, cfg) for co in data.get("companies", [])]
    ranked = [r for r in results if r["status"] == "RANKED"]
    ranked.sort(key=lambda r: (-r["composite"], -(r["fcf_yield_pct"] or 0)))
    for i, r in enumerate(ranked, 1):
        r["rank"] = i
    return {
        "as_of": data.get("as_of"),
        "framework_version": cfg.get("framework_version"),
        "weights": cfg["weights"],
        "ranked": ranked,
        "unranked_partial": [r for r in results if r["status"] == "UNRANKED_PARTIAL"],
        "could_not_verify": [r for r in results if r["status"] == "COULD_NOT_VERIFY"],
        "excluded": [r for r in results if r["status"] == "EXCLUDED"],
    }


# ----------------------------------------------------------------------------
# markdown
# ----------------------------------------------------------------------------
def crit_marks(crit: dict) -> str:
    sym = {True: "✓", False: "✗", None: "UNVERIFIED"}
    return " · ".join(f"{CRITERION_LABEL[k]} {sym[v]}" for k, v in crit.items())


def to_markdown(out: dict) -> str:
    w = out["weights"]
    L = [f"# Scores — as of {out['as_of']} (framework {out['framework_version']})", ""]
    L.append(f"Weights: insider {w['insider']}, surprise {w['surprise']}, FCF yield {w['fcf_yield']}, sentiment {w['sentiment']}. Composite rounded half up.")
    L.append("")
    L.append("## Ranked")
    L.append("")
    if out["ranked"]:
        L.append("| Rank | Ticker | Insider | Surprise | FCF yield | Sentiment | Composite |")
        L.append("|---|---|---|---|---|---|---|")
        for r in out["ranked"]:
            f = r["factors"]
            L.append(f"| {r['rank']} | {r['ticker']} | {f['insider']['score']} | {f['surprise']['score']} | {f['fcf_yield']['score']} | {f['sentiment']['score']} | **{r['composite']}** |")
        L.append("")
        for r in out["ranked"]:
            L.append(f"### {r['rank']}. {r['name']} ({r['ticker']})" if r["name"] else f"### {r['rank']}. {r['ticker']}")
            L.append(f"- Criteria: {crit_marks(r['criteria'])}")
            for k in FACTORS:
                L.append(f"- {k}: {r['factors'][k]['explanation']}")
            L.append(f"- Composite: {r['arithmetic']}")
            iv = r.get("intrinsic_value")
            if iv:
                s = f"- Intrinsic value ESTIMATE: FCF/share {iv['fcf_per_share']} × {iv['multiple']} = {iv['estimate']}"
                if "price" in iv:
                    s += f"; price {iv['price']} → {iv['discount_pct']:+.1f}% (positive = price below estimate)"
                L.append(s + ". Model output from sourced inputs, not a sourced figure.")
            else:
                L.append("- Intrinsic value ESTIMATE: not computed (FCF, shares outstanding or price missing)")
            L.append("")
    else:
        L.append("None ranked.")
        L.append("")
    for title, key in (("Unranked: UNVERIFIED scoring inputs", "unranked_partial"),
                       ("Could not verify: UNVERIFIED criterion figures", "could_not_verify"),
                       ("Excluded: failed a criterion", "excluded")):
        L.append(f"## {title}")
        L.append("")
        if out[key]:
            for r in out[key]:
                L.append(f"- {r['ticker']}: {r['reason']} — {crit_marks(r['criteria'])}")
                for k in FACTORS:
                    if "factors" in r:
                        L.append(f"  - {k}: {r['factors'][k]['explanation']}")
        else:
            L.append("None.")
        L.append("")
    return "\n".join(L)


# ----------------------------------------------------------------------------
# cli
# ----------------------------------------------------------------------------
def main(argv=None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("input", nargs="?", help="JSON input file, or - for stdin")
    p.add_argument("--framework", default=str(DEFAULT_FRAMEWORK))
    p.add_argument("--json", action="store_true", help="print JSON instead of markdown")
    p.add_argument("--schema", action="store_true", help="print the input schema and an example")
    a = p.parse_args(argv)
    if a.schema:
        print(SCHEMA_NOTES)
        print()
        print(json.dumps(EXAMPLE_INPUT, indent=2))
        return 0
    if not a.input:
        p.error("INPUT.json is required (or --schema)")
    cfg = load_config(Path(a.framework))
    raw = sys.stdin.read() if a.input == "-" else Path(a.input).read_text(encoding="utf-8")
    data = json.loads(raw)
    out = run(data, cfg)
    print(json.dumps(out, indent=2) if a.json else to_markdown(out))
    return 0


if __name__ == "__main__":
    sys.exit(main())
