# Sources

Where each figure comes from, how to record it, and how to pull it politely. Official sources first. Every figure in a note carries: the value as the page shows it, the source URL, the source's own as-of date, the retrieval time in UTC, and the tool used.

## Tool order

1. **Firecrawl** (MCP tools `firecrawl_scrape`, `firecrawl_search`): clean text from a page, best for tables.
2. **A browser** (Playwright MCP tools, or a Playwright script run with `node`): for screeners that need filters set, numbers behind dropdowns, and click-through disclaimers.
3. **WebFetch / WebSearch / curl**: the fallback. WebFetch has a small model summarise the page, so ask it to quote the exact label and value, and prefer machine-readable endpoints (SEC JSON) where they exist.

Memory is never a source. Training data is months old and worthless for live markets.

## Figure by figure

| Figure | Primary | Official confirmation | Fallback | Record |
|---|---|---|---|---|
| Insider purchases, last 14 days | OpenInsider screener, purchases only, filing date last 14 days, value ≥ $100k, 100 rows per page (the page maximum); when a page is full and its oldest filing date is still inside the window, fetch `page=2`, then 3, up to 5, pausing between requests: `http://openinsider.com/screener?s=&o=&pl=&ph=&ll=&lh=&fd=14&fdr=&td=0&tdr=&fdlyl=&fdlyh=&daysago=&xp=1&vl=100&vh=&ocl=&och=&sic1=-1&sicl=100&sich=9999&grp=0&nfl=&nfh=&nil=&nih=&nol=&noh=&v2l=&v2h=&oc2l=&oc2h=&sortcol=0&cnt=100&page=1` | The Form 4 linked from each row on sec.gov: Table I, transaction code P, column (A) | Finviz insider page, buys: `https://finviz.com/insidertrading.ashx?tc=1`; SEC current Form 4 feed: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=4&output=atom` | filing date, trade date, insider, title, price, quantity, value, Form 4 URL |
| Insider sales in the same window | OpenInsider, same screener with `xs=1` instead of `xp=1`, filtered to the ticker | Linked Form 4, code S | Finviz `insidertrading.ashx?tc=2` | as above |
| Market cap, price, shares outstanding, trailing P/E | StockAnalysis statistics: `https://stockanalysis.com/stocks/<ticker>/statistics/` | — | Yahoo key statistics: `https://finance.yahoo.com/quote/<TICKER>/key-statistics/`; Finviz quote: `https://finviz.com/quote.ashx?t=<TICKER>` | value, page date |
| Sector trailing P/E | Finviz groups, valuation view: `https://finviz.com/groups.ashx?g=sector&v=120`, with the company's sector from its Finviz quote page | — | Damodaran industry P/E (updated each January, date it): `https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/pedata.html` | sector name, sector P/E, company P/E, same source and date for both |
| Free cash flow, TTM | SEC XBRL company facts (official): `https://data.sec.gov/api/xbrl/companyconcept/CIK<10 digits>/us-gaap/NetCashProvidedByUsedInOperatingActivities.json` and `.../PaymentsToAcquirePropertyPlantAndEquipment.json`, last four quarters summed (a 10-K value is a full year; derive Q4 as FY minus the nine-month YTD figure) | that is the official source | StockAnalysis cash flow statement, TTM column: `https://stockanalysis.com/stocks/<ticker>/financials/cash-flow-statement/?p=trailing` ("Free Cash Flow"); Yahoo cash flow page | OCF, capex, FCF, period ends, which source |
| EPS surprise, last two quarters | Yahoo earnings calendar for the symbol: `https://finance.yahoo.com/calendar/earnings?symbol=<TICKER>` (EPS estimate, reported, surprise %) | the 8-K earnings release on sec.gov for the reported figure | Nasdaq earnings: `https://www.nasdaq.com/market-activity/stocks/<ticker>/earnings`; Zacks: `https://www.zacks.com/stock/research/<TICKER>/earnings-calendar` | quarter end, estimate, reported, surprise % |
| Rating upgrades and downgrades, last 90 days | Finviz quote page ratings table (date, action, firm, from → to) | — | MarketBeat: `https://www.marketbeat.com/stocks/<EXCHANGE>/<TICKER>/forecast/`; Yahoo analysis page, "Upgrades & Downgrades" | each action with date, firm, from, to |
| Consensus price target (reference only) | Same page as the ratings | — | — | value, number of analysts, date |
| CIK for a ticker | `https://www.sec.gov/files/company_tickers.json` | official | the EDGAR company search | CIK, 10 digits zero-padded |

## Politeness and legality

- The SEC asks automated clients to send a descriptive User-Agent of the form `Name email@example.com` and to stay well under 10 requests per second. Do both.
- Read each site's terms before using it through a tool. Where a site forbids automated access, use it only through a browser session you drive yourself, or use an alternative in the table. The SEC is the official source and allows automated access under its fair-access policy.
- One request at a time per host. At most five screener pages per run, paced, and only as many as the 14-day window needs. No retries on a refusal (403, 429, captcha); record the refusal and move to the fallback.
- Never bypass a paywall, captcha or login.
- Cache within the run: a figure fetched once goes into the source log and is reused from there.
- Nothing scraped here is redistributed; the notes are private research.

## Reachability log

The chain checks reachability before every run. Keep this table honest; it tells a future run what to expect.

| Date | Environment | Result |
|---|---|---|
| 2026-11-05 | Claude Code cloud, environment for `rqymondq/badminton` | Every host above blocked by the environment's network policy (proxy returned 403 to CONNECT; WebFetch could not resolve the hosts). Reachable: github.com, registry.npmjs.org, pypi.org only. WebSearch works but returns snippets, which are not a source for figures. |
| 2026-11-05 05:48 UTC | Fresh session started by the scheduled task (same environment) | Still blocked: openinsider.com unresolved; finviz.com, www.sec.gov, stockanalysis.com, finance.yahoo.com refused (proxy 403). Run aborted. |
| 2026-11-05 05:56 UTC | Fresh probe session after network access was widened | openinsider.com 200, finviz.com 301; www.sec.gov and stockanalysis.com 403 to a bare curl (site-side: SEC wants a declared User-Agent, StockAnalysis wants browser headers). The screen is runnable from fresh sessions. |
| 2026-11-05 05:59–06:40 UTC (full run) | Claude Code cloud, environment for `rqymondq/badminton` | Reachable by curl with a browser User-Agent: openinsider.com (screener and per-ticker pages), finviz.com (screener, groups and quote pages; old `.ashx` URLs redirect to `/screener/stocks`, `/groups`, `/stock`), finance.yahoo.com (quote analysis pages; the earnings calendar page ignores `symbol=` in its server render). Reachable by WebFetch only: stockanalysis.com (cash flow statement pages; bare curl was not tried with full browser headers because the session's permission classifier declined it). Refused, no retry: www.sec.gov (403 "Request Rate Threshold Exceeded" on the first request with User-Agent `badminton-analyst/1.0 (+https://github.com/rqymondq/badminton)`), data.sec.gov (403 "Undeclared Automated Tool" with the same User-Agent; the SEC wants a contact e-mail in the User-Agent and the run was told not to send one). api.nasdaq.com earnings-surprise endpoint: 404. Not tried: marketbeat.com, zacks.com, nasdaq.com HTML pages. |

### Domains to allow for the cloud run

Allow these under Network access → Allowed domains in the environment settings (keep "Allow package managers" ticked). Steps: https://code.claude.com/docs/en/cloud-environments#network-access

```
openinsider.com
www.openinsider.com
finviz.com
www.sec.gov
data.sec.gov
efts.sec.gov
stockanalysis.com
finance.yahoo.com
query1.finance.yahoo.com
query2.finance.yahoo.com
www.marketbeat.com
www.nasdaq.com
api.nasdaq.com
www.zacks.com
pages.stern.nyu.edu
```

A local Claude Code session on your own machine has no such proxy; the only limits there are the sites' own terms and rate limits.
