# Palimpsest

> A manuscript page scraped clean and written over, the earlier text still showing through. Also: a mind.

Palimpsest is an independent, Renaissance-inspired publication of interactive intellectual journalism.
This repository holds the publication's front page and its first flagship investigation:

**No. 01 — How much of what you believe is actually yours?**
Six scroll-driven acts, three interactive instruments, eighteen sources.

## Running it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The investigation lives at `/investigations/what-you-believe`.

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
| `docs/CREATIVE_DIRECTION.md` | Identity, design principles, colour, type, the role of motion, one-line act concepts |
| `docs/STORYBOARD.md` | Act-by-act storyboard: what you see, what scroll changes, what you can touch, what the visual argues |
| `src/app/globals.css` | Design tokens (surfaces, type scale, registers), typographic voices |
| `src/app/page.tsx` | Front page |
| `src/app/about/page.tsx` | About |
| `src/app/investigations/[slug]/page.tsx` | Story route; maps a slug from the registry to a story component |
| `src/content/investigations.ts` | Registry of investigations and future desks |
| `src/components/story/*` | Reusable story primitives: `Act`, `ActHead`, `Prose`, `Spread`, `Aside`, `Figure`, `Pull`, `Ref`, `RegisterTag`, `StoryShell` |
| `src/stories/what-you-believe/*` | The flagship: `ActOne` … `ActSix`, `ElephantScene`, `FlashJudgement`, `Sources`, `data.ts` |
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

The build environment had no access to external hosts, so every source link in
`src/stories/what-you-believe/data.ts` is marked `verify: true` and rendered with a dagger.
The references are real works cited by DOI or stable URL; the links themselves should be opened
and confirmed before publication. See the delivery notes for the list of claims to check.

## Accessibility and motion

- Semantic landmarks, one `h1` per page, six act `h2`s, skip link, keyboard-operable instruments.
- `prefers-reduced-motion` renders every scene in its final composition with no scrubbing or pinning.
- Compact viewports swap overlaid labels for chip strips and stack the two-column spreads.
