# Palimpsest — report on the first product version

5 November 2026. Branch `claude/epic-tesla-0vzps6` on `rqymondq/badminton`.

## 1. What was built

**A second, stronger flagship: No. 02, "How much is an hour of your attention worth?"**
Chosen over polishing No. 01 alone because the brief asked for a surprising finding
in the first fifteen seconds and something a reader would send to a friend. No. 01's
hook is contemplative; No. 02's is a number from Meta's own filings, personal to the
reader, and smaller than anyone guesses. Five acts, three instruments, twenty sources:

- **Act I, The Receipt.** Two inputs (region, hours a day) and a receipt that prints the
  reader's own price per hour, with the minimum-wage comparison. Every later act answers
  in the reader's numbers. The share link carries only the two inputs and renders its own
  card (`/api/og/receipt`).
- **Act II, The Market.** A field of 670 dots, one per five million daily people, with the
  reader's dot in vermilion; the mechanism of the auction; a four-line ledger from the
  penny press to 2024. Argument: you are inventory, not a product, and inventory is sold in bulk.
- **Act III, The Panic.** The Orben & Przybylski comparison ladder (bullying, marijuana,
  glasses, technology, potatoes, sleep) with an interactive gloss; Odgers, the National
  Academies, and Haidt's case, each marked by register. Argument: the average effect is
  tiny and contested; "the cause" is the panic's mistake.
- **Act IV, The Trap.** The three causal economics papers as large-numeral evidence rows,
  then the collective-trap finding ($59 to leave alone, $28 to have it gone for all) and a
  stylised simulation where the reader's best move flips as their friends leave.
- **Act V, The Ledger Closes.** Three prices for the same hour in the reader's own hours;
  a private four-way choice; a coda; share; hand-off to No. 01.

**Product surfaces.** Front page re-led with No. 02 (receipt motif) and No. 01 beneath (ring
motif); an `/investigations` index; desk statuses that reflect what has published; a share
bar (native share, copy, Bluesky, X, LinkedIn, email; no third-party scripts) on both
investigations; a hand-off section at the end of each piece; JSON-LD Article data;
personalised Open Graph metadata for shared receipts. No. 01 untouched except for share and hand-off.

**Design system.** Documented in `docs/DESIGN_SYSTEM.md`: three surfaces, two accents, three
typefaces with specified optical sizes, the manuscript apparatus (act labels, versals,
registers, refs, figures, instruments), three motion verbs, and the rule that each
investigation declares one motif. No. 02 introduces the receipt-and-ledger motif.

**Strategy.** `docs/STRATEGY.md` (audience, differentiation, distribution, retention,
business model, validation thresholds, a 30-day plan, risks) and `docs/RESEARCH_NOTES.md`
(what comparable publications actually earn and how; the virality evidence; the status of
every figure in No. 02).

## 2. Design decisions and why

- **Instrument first, essay second.** The receipt is above the fold on every viewport; the
  prose begins only after the reader has a number. This is the whole differentiation thesis.
- **The reader's numbers propagate.** A single context carries region and hours through all
  five acts, so the dot field, the three prices and the share text are theirs. Reading
  becomes something the reader did.
- **Registers everywhere.** Every margin and every bibliography entry marks Established /
  Theory / Contested / Ours. No. 02 argues against both the moral panic and the complacency,
  and the registers are what make that credible rather than merely balanced.
- **Figures say what they are not.** Each caption states the figure's limit (not a model,
  not the study's data, our derivation). The trap simulation is labelled stylised in two places.
- **No cards, no grids.** Index and front page are typographic rows with hairlines; motifs
  (receipt, ring) stand in for imagery.
- **Mobile alternatives, not scaled-down desktop.** The ladder becomes stacked HTML rows under
  640px; the elephant scene uses a cropped viewBox; overlaid labels become chip strips.

## 3. Tests performed

Production build (`next build`, 18 routes), TypeScript, ESLint: clean.
Playwright, Chromium, against the production server:
- No. 02 suite (24 checks): home and index links; receipt updates on region and hours
  (6.8¢ → 35¢ → 18¢ at 4 h); subhead mirrors receipt; copied share text carries params;
  ladder keyboard; trap flips at 20% and the "everyone decides" view; exit choice; twenty
  source links; ref anchors; one h1 and five h2s; shared link pre-fills region and hours;
  shared link's `og:image` is the receipt card and it renders as PNG; JSON-LD; reduced
  motion shows the receipt immediately; no horizontal overflow on phone for story, index
  and home. All pass; no console errors.
- No. 01 suite (22 checks): all pass.
- Screenshot sweeps at 1440 and 390 px; two visual review passes fixed: Act I title
  overflow at desktop and phone widths, "3,350 m" → "3.35 bn", oversized trap circles,
  the sleep bar's label running off the chart, and illegible ladder labels on phones.

Not tested: real touch hardware, Safari, screen readers, low-end Android performance on
the 670-dot field and the 220-fragment field.

## 4. Remaining setup

- `NEXT_PUBLIC_SITE_URL` for correct share-card origins; Vercel Web Analytics enabled in
  the project (custom events need Pro); `NEXT_PUBLIC_NEWSLETTER_*` to connect a provider
  (the invitation is honestly disabled until then). See `.env.example`.
- Five No. 02 sources carry the dagger (details confirmed, page not opened): the
  DataReportal primary page, the Odgers DOI, Haidt's book site, Simon's page reference, the
  DOL minimum-wage chart. One judgement call to re-check against the paper: the ladder's
  comparison ratios come from the Oxford Internet Institute's summary rather than the
  paper's Fig. 3 medians.
- The regional per-hour figures are our estimate (2024 worldwide ARPP scaled by Meta's last
  disclosed regional ratios, Q4 2023). The piece says so on the receipt and in the sources.
- The analytics script 404s locally by design; it exists only on Vercel.

## 5. Candid assessment: risks and what to do next

**Risks**
1. *The receipt may not travel.* The whole distribution plan leans on readers sending
   their number. If share rate is under 3% in week one, the hook is wrong.
2. *Cadence.* A piece of this kind is a week or more of work. Two pieces are a path, not a
   library; retention is an email address until No. 03 exists.
3. *Being wrong in public.* The numbers are traceable, the derivations are written out, and
   researcher outreach is in the plan, but a figure quoted from an index rather than the
   paper is a figure we have not fully seen.
4. *Topic crowding.* Attention and belief are the common ground of every smart publication.
   Form and stance are the only defensible differences; No. 03 must hold the same standard.
5. *A studio eats the calendar.* If commissions arrive, as The Pudding's model suggests they
   might, they must be capped.

**What to do next, in order**
1. Ship this branch; set the three environment variables; finish the dagger checks.
2. Record the receipt printing at 9:16 and the Flash Judgement; send the thirty emails
   (researchers cited, curators, adjacent newsletters) with region-prefilled links.
3. Watch the funnel (`act_reached`, `receipt_adjusted`, `share`) for a week before
   changing anything. Decide against the thresholds in `docs/STRATEGY.md` §7.
4. Choose No. 03 from reader questions, on the desk with the most of them. Candidates that
   fit the form: "Who decided what you'd see today?" (Power), "How much of history did you
   get from one country?" (History).
5. Repository hygiene: this work lives in a repository named `badminton`; a dedicated
   `palimpsest` repository is a ten-minute move (see the earlier instructions) and should
   happen before the public URL is shared.
