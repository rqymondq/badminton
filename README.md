# Palimpsest

> A manuscript page scraped clean and written over, the earlier text still showing through. Also: a mind.

Palimpsest is an independent, Renaissance-inspired publication of interactive intellectual journalism.
This repository holds the publication's front page, an investigations index, and two investigations:

**No. 02 — How much is an hour of your attention worth?** (lead)
Five acts, three instruments (a receipt you print with your own inputs, an association ladder, a
collective-trap simulation), twenty sources. Shareable personalised receipt cards.

**No. 01 — How much of what you believe is actually yours?**
Six acts, three instruments, eighteen sources.

## Running it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Investigations live at `/investigations`, `/investigations/attention` and `/investigations/what-you-believe`.

```bash
npm run build   # production build (static, no backend)
npm run start   # serve the build
npm run lint    # eslint
```

Requires Node 20+. No environment variables, database, authentication or third-party services.
Fonts are self-hosted via Fontsource; every illustration is drawn in code.

## Where things are

| Path | What |
| --- | --- |
| `docs/STRATEGY.md` | Audience, differentiation, distribution, retention, business model, validation, the 30-day plan |
| `docs/RESEARCH_NOTES.md` | Market research and the evidence base for No. 02, with verification status |
| `docs/DESIGN_SYSTEM.md` | Surfaces, colour, type, apparatus, motion rules, per-investigation motifs |
| `docs/REPORT.md` | Final report: what was built, tests, limitations, risks, next steps |
| `docs/CREATIVE_DIRECTION.md` | Original identity brief, design principles, one-line act concepts |
| `docs/STORYBOARD.md`, `docs/STORYBOARD-02.md` | Act-by-act storyboards for No. 01 and No. 02 |
| `src/app/globals.css` | Design tokens (surfaces, type scale, registers), typographic voices |
| `src/app/page.tsx` | Front page |
| `src/app/about/page.tsx` | About |
| `src/app/investigations/page.tsx` | Investigations index |
| `src/app/investigations/[slug]/page.tsx` | Story route; maps a slug to a story component; JSON-LD; personalised share metadata |
| `src/app/api/og/receipt/route.tsx` | Personalised receipt share card (two public inputs) |
| `src/content/investigations.ts` | Registry of investigations and future desks |
| `src/components/story/*` | Reusable story primitives: `Act`, `ActHead`, `Prose`, `Spread`, `Aside`, `Figure`, `Pull`, `Ref`, `RegisterTag`, `StoryShell`, `Sources`, `ShareBar`, `NextInvestigation` |
| `src/stories/attention/*` | No. 02: `figures.ts` (every number and its derivation), `Receipt`, `DotField`, `Ladder`, `Trap`, `ActOne` … `ActFive`, `data.ts` |
| `src/stories/what-you-believe/*` | No. 01: `ActOne` … `ActSix`, `ElephantScene`, `FlashJudgement`, `data.ts` |
| `src/lib/motion.ts` | GSAP + ScrollTrigger registration, reduced-motion and compact-viewport hooks, seeded RNG |

## Adding an investigation

1. Add an entry to `investigations` in `src/content/investigations.ts`.
2. Create `src/stories/<slug>/index.tsx` exporting a default component. Compose it from the story primitives, or build its own structure: nothing forces a template.
3. Register the component in the `stories` map in `src/app/investigations/[slug]/page.tsx`.

## Evidence registers

Claims in the text carry one of four registers, visible as small marks:
**Established** (replicated or widely accepted), **Theory** (interpretive framework),
**Contested** (live dispute), **Ours** (editorial reflection). Sources use the same marks.

## Verification note

Sources in `src/stories/what-you-believe/data.ts` were verified through indexes and publisher
pages. Entries still marked `verify: true` (rendered with a dagger) have confirmed citation details
but a link or quotation that could not be opened from the build environment. The remaining items
are listed in `docs/LAUNCH_READINESS.md`.

## Configuration

Copy `.env.example` to `.env.local` (or set the variables in Vercel). All are optional:
`NEXT_PUBLIC_SITE_URL` for share cards and the sitemap, the `NEXT_PUBLIC_NEWSLETTER_*`
group to connect a mailing-list provider, `NEXT_PUBLIC_CONTACT_EMAIL` for the unconnected state.
Vercel Web Analytics is included and needs only to be enabled in the Vercel project.
See `docs/LAUNCH_READINESS.md` for the full checklist.

## Accessibility and motion

- Semantic landmarks, one `h1` per page, six act `h2`s, skip link, keyboard-operable instruments.
- `prefers-reduced-motion` renders every scene in its final composition with no scrubbing or pinning.
- Compact viewports swap overlaid labels for chip strips and stack the two-column spreads.
