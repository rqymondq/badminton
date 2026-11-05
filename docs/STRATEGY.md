# Palimpsest — strategy for the first 100 readers and beyond

Written as the founding team would write it for itself: short on vision, long on
what we will actually do, and honest about what we do not know. Evidence is cited
to `docs/RESEARCH_NOTES.md`; everything else is a hypothesis to be tested.

## 1. What Palimpsest is, in one paragraph

An independent publication of interactive investigations. Each piece takes one
question people think they already have an answer to, hands the reader an
instrument to use on themselves, and walks through the best evidence on both
sides with a visible mark for how much weight each claim can bear. We do not
tell people what to think. We give them a number, a test, or a trap they did
not know they were in, and then a question worth keeping.

## 2. Audience: who it is for first

Not "curious people". The first audience is **people who already pay attention
to how their attention is spent**: readers of newsletters like The Browser and
Tangle, listeners to long-form podcasts, people who share Kurzgesagt videos and
Pudding essays, the subset of 25–40-year-olds who read Aeon pieces to the end.
They are over-served with opinion and under-served with *things to do with their
own mind*: they can read a thousand essays about social media and never once be
handed their own receipt.

Their existing habits: morning email, two or three group chats where links are
traded, YouTube and podcasts at length, short-form video as discovery. They
choose a new source when a friend sends something that makes them feel
something *and* gives them a line to repeat.

Why they would choose this over what they have: the instruments. Nobody else
gives them a result about themselves attached to serious sourcing. That is the
wedge; the editorial stance (challenge both sides) is the reason they stay.

## 3. Differentiation, candidly

What is genuinely different:
1. **The instrument-first form.** A personal result in the first fifteen seconds (a receipt, a timed verdict), then the investigation. This is rare outside data-journalism studios and absent from essay publications.
2. **Registers of certainty** on every claim and every source. We have not found another general-audience publication that marks Established / Theory / Contested / Ours in the margin.
3. **Challenging both narratives in the same piece.** No. 02 argues against the panic *and* against the complacency; No. 01 argues against "you chose your beliefs" *and* against "your beliefs are merely inherited".

What is not different, and we should stop pretending otherwise: the topics. Attention, belief, power and history are the common ground of every smart publication. If Palimpsest competes on topic it loses. It competes on form and stance, and only if the form keeps being as good as the first two pieces.

## 4. Distribution: reaching readers with no audience and no budget

The pieces must carry their own distribution. Four mechanisms, in order of expected return:

1. **Personalised share cards.** Every reader of No. 02 can send a receipt with their own numbers; the link renders a card with those numbers. This is the single most important growth feature we have, because it turns a reader into a sender with something of their own to show. We will measure share clicks per reader (target ≥ 8%).
2. **Short-form adaptations of the instruments, not the essays.** A 30–45 second vertical video of a receipt printing ("an hour of your attention sells for 36 cents") ends with the link. The *instrument* is the ad for the investigation. Three cuts per piece, posted natively on TikTok, Reels, Shorts, and as a thread on Bluesky and X. No budget needed; the asset is a screen recording of the actual page.
3. **Direct outreach to the thirty people who would care.** Curators (The Browser, Dense Discovery, Sentiers, Hacker News "Show", r/dataisbeautiful, r/TrueReddit), the researchers cited (an honest email saying "we cited your work, here is how; tell us if we got it wrong" is both ethics and distribution), and a handful of newsletter writers in the adjacent space.
4. **Search.** Both pieces answer questions people type ("how much is my attention worth", "where do beliefs come from"). Metadata, JSON-LD, sitemap and canonical URLs are in place; results take months, so this is the slow lane.

What we will not do: paid acquisition, growth hacks, engagement bait, posting the essay text as threads (the essay is the destination, not the ad).

## 5. Retention: why someone comes back

The honest answer is that with two pieces, retention is an email address, not a habit. So:
- The invitation is restrained and appears twice: on the front page and after each coda, when the reader has just finished something. Copy promises *one question at a time, sent when it is ready*, which is true.
- Each piece ends by handing off to the other. Two is not a library, but it is a path.
- Over the first year, retention comes from a cadence readers can feel (one investigation every 4–6 weeks) and from a short between-issue letter that is itself worth reading: one question, one finding, one thing we got wrong.

## 6. Business model: paths that do not betray the mission

Ranked by fit with the evidence in the research notes:
1. **Reader support (donations/membership) with no paywall**, Aeon/OWID style. Fits the mission; requires an audience of tens of thousands before it pays anyone. Benchmark: ~1–3% of engaged readers.
2. **A studio.** The Pudding's model: the public pieces are the portfolio; museums, universities, foundations and publishers commission interactive explainers. This is the most realistic early revenue and it funds the public work without ads or paywalls. Risk: client work eats the calendar.
3. **Grants** for public-interest explanatory journalism and research communication. Slow, but the registers-of-certainty approach is exactly what science-communication funders say they want.
4. **Licensing and syndication** of finished pieces to publications that cannot build them.

What we rule out for now: display advertising (incoherent with No. 02), a paywall before 10,000 subscribers, sponsorship inside investigations.

## 7. Validation: the smallest experiments that could tell us the truth

Vanity: pageviews, follower counts, time-on-page averages.
Evidence of real interest:
- **Completion**: share of readers who reach Act IV (`act_reached` events). Target ≥ 35% of those who reach Act II.
- **Instrument use**: share who adjust the receipt or finish the Flash Judgement. Target ≥ 50%.
- **Sharing**: share clicks per reader ≥ 8%; shared-link opens as a fraction of all opens ≥ 20% by week four.
- **Return**: email sign-ups per 100 readers ≥ 2 (with the invitation only shown after reading, this is a real signal).
- **Unprompted**: anyone writing about it without being asked.

If after 30 days completion is under 20% or sharing under 3%, the form is not working and we rethink before writing No. 03.

## 8. The 30-day plan

**Week 1 — Make it true, then make it visible.**
- Day 1–2: finish the three "from memory" checks (`docs/LAUNCH_READINESS.md`), set `NEXT_PUBLIC_SITE_URL`, enable Vercel Analytics, connect a mailing-list provider (Buttondown: one env var).
- Day 3: record three screen captures of the receipt printing at 9:16; one of the Flash Judgement. Cut to 30–45 seconds with captions, no voiceover needed.
- Day 4–5: write to the eight researchers cited across both pieces. Write to ten curators and newsletter writers with a two-sentence note and the receipt link pre-filled to their region.
- Day 6–7: post No. 02 natively: Bluesky, X, LinkedIn (the receipt as the hook), TikTok/Reels/Shorts (the recordings). One Hacker News "Show HN" for the instrument, framed as what it is.

**Week 2 — Learn from the first hundred.**
- Read the funnel daily. Which act loses people? Fix the one worst drop with copy or pacing, not features.
- Reply to every email and every comment that engages seriously. Ask three readers for a fifteen-minute call.
- Post No. 01's Flash Judgement cut. Cross-link in every post.

**Week 3 — Second wave.**
- Publish a short between-issue letter to whoever subscribed: one finding we cut, one thing a reader corrected, the question for No. 03.
- Pitch two podcasts in the adjacent space with the receipt as the hook.
- Submit both pieces to the Information is Beautiful Awards and the SND digital awards when windows open; not for the award, for the curators who read the entries.

**Week 4 — Decide.**
- Against the thresholds in §7, answer one question: is the form working? If yes, commission No. 03 on the desk with the most reader questions. If no, run three reader interviews before touching code.
- Write up what happened, publicly, as the first "colophon letter". Transparency about a small launch is itself on-brand.

## 9. Biggest risks

1. **Nobody shares.** The receipt is our bet. If share rate is under 3% in week one, the hook is wrong, not the audience.
2. **We are too slow.** One piece every 4–6 weeks with a team of one or two is the real cadence. The between-issue letter and the evergreen quality of the pieces are the mitigations.
3. **We get something wrong in public.** The registers and the sources are the defence; the researcher outreach is the early-warning system. Corrections go at the top of the piece, dated.
4. **We drift into a side.** The test for every piece: does it make a reader on each side uncomfortable at least once? No. 02 passes; we should check No. 03 against it before publishing.
5. **The studio eats the publication.** If commissions arrive, cap them at half the calendar.

## 10. What to do next, in order

1. Ship this branch to the production URL; complete the three verification checks.
2. Enable analytics and the mailing list (both are environment variables away).
3. Record the receipt video and send the thirty emails.
4. Watch the funnel for a week before changing anything.
5. Choose No. 03 from reader questions, not from our own list.
