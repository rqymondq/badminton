# Palimpsest design system

A manuscript's apparatus, reinterpreted as interface. One system; each
investigation gets its own motif inside it.

## Surfaces
Three surfaces, set with `data-surface` on a section; every token re-maps beneath them.
- **parchment** `#F2EADB` — the reading state.
- **ink** `#131110` — the thinking state (openings, instruments that need focus).
- **night** `#0E1220` — doubt, dispute, the archive (Act V of No. 01, Act III of No. 02).
Transitions between surfaces are 20svh gradient bands, never hard cuts.

## Colour
Vermilion `#B8321E` / `#D9502F` is the house accent: questions, the reader's own mark, the reference bar. Lapis `#24407A` / `#4A6FB5` is the second lens: reasoning, the alternative, the positive bar. Oxblood `#6B1E1A` is vermilion on parchment at small sizes and for prices. Ochre `#A8803A` appears only as a tint. Stone and graphite carry secondary text. Nothing else.

## Type
- **Fraunces** (variable: opsz 9–144, wght, SOFT, WONK): display and voice. `.display` at opsz 144 for viewport statements; `.serif` at opsz 48 for pull quotes and act themes; `.serif-text` at opsz 14 for quoted matter.
- **Instrument Sans**: all reading text, 17–19px, 1.65 leading, 64ch measure.
- **IBM Plex Mono**: act labels, folio numbers, figure numbers, registers, receipts. Uppercase with 0.06em tracking as `.mono`; lowercase as `.mono-lc`.
Fluid scale `--step--2 … --step-6` via clamp; display sizes use `text-[length:var(--step-n)]` (Tailwind v4 needs the `length:` hint).

## Apparatus
- **Act label**: `Act II · The Market` in mono, top-left of every act.
- **Theme line**: the act's one-sentence question in `.serif`.
- **Versal**: a vermilion drop cap opens the first paragraph of each act.
- **Registers**: four marks that state how much weight a claim can bear: Established (filled dot), Theory (half), Contested (empty), Ours (diamond). Used in margins and in every bibliography entry.
- **Refs**: superscript mono numerals linking to `#src-n`.
- **Figures**: numbered, captioned in mono-lc; the caption always says what the figure is *not* (not a model, not the study's data).
- **Instruments**: numbered interactive tools the reader uses on themselves. Rule: an instrument returns something personal, stores nothing, and says so in plain words beneath it.

## Motion
Scroll-scrubbed with GSAP ScrollTrigger so the reader owns the clock. Three verbs only: accumulate, transform, reveal. Pinned scenes ≤ 300–400svh. Every scene has a reduced-motion state that is its final composition. Instruments animate once on mount (the receipt prints), never on every input change.

## Per-investigation motifs
- **No. 01 — the ring.** Sixteen words of influence on an orbit; the engraved profile; the breathing vermilion mass.
- **No. 02 — the receipt and the ledger.** Thermal-receipt paper on ink, dotted leaders, tabular numerals, a field of dots for scale, bars around a zero axis, a ten-by-ten grid of people.
A new investigation must declare one motif and one accent use before it declares anything else.

## Layout
`Column` (1200px, gutters) → `Spread` (64ch prose + 14–20rem margin). Figures break the measure. Index and front page use full-bleed typographic rows with hairline dividers; never cards with shadows, never three-column grids.

## Interaction and accessibility
Every interactive control is a native button, radio, range or checkbox with a visible label; overlaid hit areas carry `sr-only` text; results are announced through `aria-live`. Keyboard arrows move between nodes and bars. The act rail is `nav[aria-label=Acts]`. One `h1` per page, one `h2` per act.
