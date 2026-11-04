# PALIMPSEST — Creative Direction

> A palimpsest is a manuscript page that has been scraped clean and written over,
> where the earlier writing still shows through. Every mind is one.

## 1. Working identity

**Name:** Palimpsest
**Tagline / mission:** *Something worth thinking about.*
**Guiding principle:** Don't tell people what to think. Give them something worth thinking about.

**Why the name:** the publication's first subject is how beliefs are layered over
inherited ones. The metaphor generalises: every discipline, institution, and
argument we cover is written over something older. The wordmark embodies this
literally: a ghost layer of the word sits slightly offset beneath the primary
setting, as if an earlier hand had written it first.

## 2. Editorial personality

- **Curious before contrarian.** We challenge received wisdom *and* attractive
  counter-narratives. The goal is a better question, not a hotter take.
- **Evidence-literate.** We distinguish four registers in the writing and in
  the design: established findings, theories and interpretations, contested
  questions, and our own editorial reflections. Each has a visible marker.
- **Quiet confidence.** No exclamation marks. Short sentences carry weight.
- **The reader is an adult.** We never summarise the moral at the end.

## 3. Design principles

1. **Typography is the illustration.** The serif does the emotional work;
   the sans does the explaining; the mono annotates.
2. **Motion means a change in understanding.** If an animation does not move
   the reader from one idea to another, cut it.
3. **Light and dark are narrative states.** Parchment is the reading state.
   Ink is the thinking state. The story moves between them deliberately.
4. **Marginalia over modals.** Context lives beside the text, numbered, the way
   it does in a manuscript. Nothing pops up.
5. **The static frame must already be beautiful.** Every scene is composed for a
   screenshot before a single tween is added.
6. **Nothing is faked.** No stock imagery, no invented sources, no imagined
   readership. Where an asset would be fake, we draw it in code instead.

## 4. Visual language

- **Engraving-inspired linework:** hatching patterns, thin 1px strokes, a
  single weight. Used for the human figure (Act II) and diagrams.
- **Abstract human silhouette:** a profile in negative space formed by words,
  then by lines. Never a literal portrait.
- **Rules and registers:** hairline horizontal rules, folio numbers, running
  heads. A manuscript's apparatus reinterpreted as interface.
- **Flat colour fields:** a page is a field of one colour. Accents arrive as a
  single word, a single line, a single node.
- **Grain:** an almost invisible paper texture via SVG noise, under 4% opacity.

## 5. Colour system

| Token            | Hex       | Role                                        |
| ---------------- | --------- | ------------------------------------------- |
| `--parchment`    | `#F2EADB` | Reading surface                             |
| `--parchment-2`  | `#E7DCC6` | Secondary panels, hover                     |
| `--ink`          | `#131110` | Thinking surface, primary text on parchment |
| `--ink-2`        | `#211D1A` | Raised panels on ink                        |
| `--graphite`     | `#4B4642` | Secondary text on parchment                 |
| `--stone`        | `#9A9087` | Tertiary text, rules on ink                 |
| `--vermilion`    | `#B8321E` | The single accent. Questions. Intuition.    |
| `--oxblood`      | `#6B1E1A` | Vermilion on parchment at small sizes       |
| `--lapis`        | `#24407A` | Second lens. Reasoning. Controlled use.     |

Colour tells the reader where they are: Act I (ink), Act II (parchment),
Act III (ink, vermilion vs. lapis), Act IV (parchment split vermilion/lapis),
Act V (ink deep with lapis undertone), Act VI (parchment, dawn).

## 6. Typography

- **Fraunces** (variable; opsz 9–144, wght 100–900, SOFT, WONK). The voice.
  Used at 9pt optical size for marginalia italics and at 144 for viewport-scale
  questions. Its slightly eccentric forms give Renaissance warmth without
  costume.
- **Instrument Sans** (variable). The reading face. 17–19px body, 1.6 leading,
  measure 62–68ch.
- **IBM Plex Mono.** Folio numbers, act labels, figure numbers, evidence
  registers. The archivist's hand.

Scale: `--step--1 … --step-6` fluid via `clamp()`; display sizes use
`min(14vw, 11rem)` where a question must fill the viewport.

## 7. The role of motion

Motion is scroll-driven and scrubbed (GSAP ScrollTrigger) so that the reader
owns the clock. Three kinds only:

1. **Accumulation** — things gather (influences, fragments).
2. **Transformation** — one form becomes another (words → ring → title;
   intuition blob → judgement; split-screen weighting).
3. **Revelation** — layers reveal beneath (clip-path, mask), never fade-in.

Pinned scenes are short (≤ 300vh). Everything has a reduced-motion state that
shows the final composition statically. On touch devices, hover interactions
become tap/press and complex pins become a stacked layout.

## 8. Act concepts (one line each)

| Act | Surface   | Visual idea                                                          |
| --- | --------- | -------------------------------------------------------------------- |
| I   | Ink       | Words of influence gather from the edges into a ring, then yield the title |
| II  | Parchment | An engraved figure; influences draw lines and layers over it          |
| III | Ink       | A fluid vermilion mass (intuition) and a precise lapis instrument (reason) |
| IV  | Split     | One set of facts, two lenses; a slider reweights what is seen         |
| V   | Night     | Four faculties multiply into a field of fragments, then one question   |
| VI  | Dawn      | The ring returns, now readable; the reader adds one line of their own |
