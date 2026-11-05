# Launch readiness — Palimpsest (No. 01 and No. 02)

Prepared for the 30-day public launch experiment. Everything below was checked
in a production build with Playwright at 390, 820 and 1440 px unless marked
otherwise.

## 1. Changes made in this pass

**Editorial integrity**
- Bibliography re-verified through indexes and publisher pages. 16 of 18 entries
  are now fully confirmed and lose their dagger. Two keep it (see §2).
- Two links replaced with verified publisher pages: Royzman et al. (2015) now
  points to the open-access Cambridge Core article; Alford et al. (2005) to the
  APSR article page.
- Act II corrected: the Jennings et al. finding is now stated as the study
  states it (transmission strongest for concrete, emotional, repeated attachments);
  the Pew figures are now the chapter's own (eight in ten raised Protestant still
  Protestant; six in ten raised Catholic still Catholic; one in five raised
  Catholic now unaffiliated) instead of a looser paraphrase.
- Act III corrected: the 1993 study's finding is stated precisely (elite students
  treated the cases as taste; most others, across social classes in both
  countries, condemned them, with affect predicting judgment better than harm).
  "Moral dumbfounding" is now attributed as a later coinage rather than to the
  1993 paper.
- Act V tightened: the Faust/Haidt link is stated in one sentence as ours;
  the Taylor quotation is labelled with the German line numbering.
- Source notes expanded where a reader would want to know the study design.

**Website quality**
- Opening shortened by about 20 percent (pinned height 300svh from 380). Act III
  and Act V pins also shortened. The first line still arrives unprompted on load.
- Act III on phones now uses a cropped viewBox so the intuition mass fills the
  frame instead of sitting small in a wide canvas.
- No console errors on any page. Reduced-motion renders every scene statically.

**Analytics** — Vercel Web Analytics (`@vercel/analytics`), page views plus
five custom events (§4).

**Reader retention** — an invitation section on the front page and at the end of
the investigation. Without a provider it renders a disabled field clearly
labelled "Not yet connected" and stores nothing (§5).

**Social sharing** — Open Graph and Twitter metadata on every page; generated
1200×630 cards for the front page and for each investigation, drawn with the
site's own fonts and the ring of influences. `robots.txt` and `sitemap.xml`
added. Canonical URLs set.

## 1b. Investigation No. 02 (added 5 November 2026)

See `docs/REPORT.md` for the build summary and `docs/RESEARCH_NOTES.md` §3 for the
status of every figure. Three entries carry the dagger: the DataReportal primary page,
the Odgers *Nature* review DOI, the Haidt book site, the Simon page reference, and the
Department of Labor chart URL (details confirmed through indexes; pages not opened).

## 2. Remaining factual verification

| Item | Status | What to do |
| --- | --- | --- |
| Taylor translation wording (six lines quoted in Act V) | Ebook confirmed; wording not checked against the text | Open Gutenberg 14591, search "labor keen", compare |
| Faust line numbers 354–359 and the "two souls" line | Standard Hamburg numbering, from memory | Check against a line-numbered edition |
| *The Righteous Mind* link (righteousmind.com) | Site named in the book's Wikipedia entry; not opened | Open it, or link the publisher page instead |
| Haidt part titles quoted ("Intuitions come first…", "Morality binds and blinds") | Confirmed via the published table of contents | None |
| Mill quotation, Chapter II of *On Liberty* | Ebook confirmed; quotation from memory | Search the text for "only his own side" |

| No. 02: Orben & Przybylski comparison ratios (glasses 1.45×, potatoes 0.9×, marijuana 2.7×, bullying 4.3×, sleep ~44×) | From the OII release and press coverage | Re-read the paper's Fig. 3 medians and adjust the ladder if they differ |
| No. 02: Taylor-style "from memory" items | None; every number has a located source | — |

Nothing in either text asserts a statistic that is not in a cited source.

## 3. Website and mobile issues

Fixed this pass: opening pacing, Act III phone framing.

Known and accepted for launch:
- The act rail (left margin numerals) is desktop-only by design; phones use the
  progress thread.
- Act V's fragment field uses ~220 absolutely positioned elements; smooth on the
  tested hardware, untested on low-end Android.
- The OG image routes are rendered on demand (Vercel caches them at the edge).

Not testable from here: real touch devices, Safari, screen readers. The markup
is semantic (one h1, six act h2s, labelled instruments, live regions) but has not
been run through VoiceOver or NVDA.

## 4. Analytics configuration

- Page views work on every Vercel plan once **Web Analytics is enabled** in the
  project dashboard (Project → Analytics → Enable). Nothing else to configure.
- Custom events require a **Pro or Enterprise** plan; on Hobby they are dropped
  silently. Events sent, all category-valued, never free text:
  - `act_reached` {act: I–VI} — once per act per page load (the funnel)
  - `instrument_flash_completed` {case, typed: boolean}
  - `instrument_lens_used` {leaning: rules | loyalty | centre}
  - `instrument_ring` {action: kept | released}
  - `invitation_submitted` {provider}
- `receipt_adjusted` {region}, `instrument_trap_used` {mode}, `instrument_exit` {choice}, `share` {method} (No. 02 and share bar)
- The text a reader writes in the Flash Judgement or the ring is never sent.
- The script is loaded from `/_vercel/insights/script.js`, which only exists on
  Vercel; locally it 404s harmlessly (that is the one console notice you will
  see in local builds).

## 5. Newsletter integration

No provider is configured. Set these in Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_NEWSLETTER_ACTION=<provider form endpoint>
NEXT_PUBLIC_NEWSLETTER_PROVIDER=<name shown to readers, e.g. Buttondown>
NEXT_PUBLIC_NEWSLETTER_EMAIL_FIELD=email        # EMAIL for Mailchimp
NEXT_PUBLIC_CONTACT_EMAIL=<optional>            # shown while unconnected
```

The form POSTs straight from the browser to the provider; this site never sees
the address. Until set, the field is disabled and says so.

Also set `NEXT_PUBLIC_SITE_URL` to the production origin so share cards and the
sitemap carry the right domain.

## 6. Launch blockers

None that stop a soft launch. Before announcing widely:

1. Set `NEXT_PUBLIC_SITE_URL` (share cards show `localhost` otherwise).
2. Enable Web Analytics in the Vercel project.
3. Either connect a mailing-list provider or accept the honest placeholder.
4. Spend ten minutes on the three "from memory" quotations in §2.

## Deployment

Commits go to `claude/epic-tesla-0vzps6` on `rqymondq/badminton`. Whatever Vercel
project is linked to that repository and branch receives them; if the project's
production branch is set to `main`, promote or re-point it first.
