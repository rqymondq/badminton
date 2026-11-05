import { ActHead } from "@/components/story/Act";
import { Column, Prose, Ref, RegisterTag, Aside, Spread, Pull, Figure } from "@/components/story/Prose";
import { Trap } from "./Trap";

const evidence = [
  {
    n: "22%",
    unit: "of the effect of losing a job",
    what: "The Facebook rollout",
    line: "When Facebook arrived at a US college in 2004–2006, students’ mental health worsened: an effect on an index of poor mental health about a fifth the size of job loss. The mechanism the authors find is unfavourable social comparison.",
    ref: 12,
  },
  {
    n: "$100",
    unit: "to give it up for a month",
    what: "The deactivation experiment",
    line: "Before the 2018 midterms, about 2,700 US users were offered money to deactivate Facebook for four weeks. The median wanted $100. The ones who did reported higher well-being, were less polarised, knew less news, and used Facebook less for weeks afterwards.",
    ref: 13,
  },
  {
    n: "31%",
    unit: "of use they did not want",
    what: "The self-control experiment",
    line: "Given a tool to cap their own daily use, people cut it; the authors estimate roughly a third of social media use comes from self-control problems the users themselves recognise. People are partly naive about their own habits.",
    ref: 14,
  },
] as const;

export function ActFour() {
  return (
    <div className="py-24 md:py-32">
      <Column>
        <ActHead numeral="IV" label="The Trap" theme="What if the problem was never willpower?" />

        <Spread
          margin={
            <Aside label="Registers">
              <p className="mb-2"><RegisterTag level="established" /> All three experiments are peer-reviewed, published in the American Economic Review, and causal by design.<Ref n={12} /><Ref n={13} /><Ref n={14} /></p>
              <p className="mb-2"><RegisterTag level="established" /> The collective-trap figures are the authors&rsquo; own, from their published summary.<Ref n={15} /><Ref n={16} /></p>
              <p><RegisterTag level="editorial" /> The simulation below is a stylised model of the idea, not the study&rsquo;s data.</p>
            </Aside>
          }
        >
          <Prose>
            <p className="versal">
              Economists do not usually ask whether something correlates with happiness. They ask what happens when
              you change it, for some people and not others, and compare. Three such studies exist for social media,
              and together they tell a story the correlational charts cannot.
            </p>
          </Prose>
        </Spread>

        <ol className="mt-10 divide-y divide-rule border-t border-rule">
          {evidence.map((e) => (
            <li key={e.what} className="grid gap-3 py-7 md:grid-cols-[14rem_1fr] md:gap-10">
              <div>
                <p className="display text-[length:var(--step-4)] leading-none text-accent tabular-nums">{e.n}</p>
                <p className="mono-lc mt-1 text-fg-3">{e.unit}</p>
              </div>
              <div>
                <p className="serif text-[length:var(--step-1)]">{e.what}</p>
                <p className="mt-2 max-w-[62ch] text-[length:var(--step-0)] leading-relaxed text-fg-2">
                  {e.line}
                  <Ref n={e.ref} />
                </p>
              </div>
            </li>
          ))}
        </ol>

        <Spread>
          <Prose className="mt-16">
            <p>
              Put the three together. Access to the platform measurably harmed the first cohort that got it. People
              who leave it feel better and come back less. And a third of the time people spend on it is time they
              would, by their own account, rather not. None of this is the full-blown rewiring of the panic. All of it
              is real, and all of it points at the same strange shape: a product people use more than they want to,
              value, and would be relieved to lose.
            </p>
            <p>
              The fourth study names the shape. In 2023 Leonardo Bursztyn and colleagues asked about a thousand US
              college students two questions. First: how much would you need to be paid to deactivate TikTok, or
              Instagram, for four weeks, while everyone else stayed? On average, $59 and $47. Second: how much would
              you pay to have the platform switched off for <em>everyone</em> at your university, including you? On
              average, $28 for TikTok and $10 for Instagram.<Ref n={15} /><Ref n={16} /> The same people. A positive
              price to leave alone; a positive price to have it gone for all.
            </p>
            <Pull>People will pay to keep a thing they would also pay to abolish. That is not confusion. It is a trap.</Pull>
          </Prose>
        </Spread>

        <Figure
          n="3"
          caption={
            <>
              A stylised collective trap. Move the slider to change how many of your people stay on; watch your best
              move flip. Then let everyone decide at once. Payoffs are illustrative; the shape is the point.
            </>
          }
        >
          <Trap />
        </Figure>

        <Spread>
          <Prose>
            <p>
              The authors call it a product market trap, and the logic is older than the phone: if the value of a
              thing to you depends on everyone else using it, then the question &ldquo;do you want it?&rdquo; has two
              different answers depending on who else is asked. Fear of missing out, in their data, is the hinge.
              You stay because they stay. They stay because you do. Everyone would take the exit if it came with
              everyone else; nobody takes it alone.
            </p>
            <p>
              This reframes the whole argument of Act III. The panic looks for damage in the minutes and finds a
              little. The economists look for it in the market and find a trap that the minutes cannot show, because
              the trap is not inside any one person. It is between them. And a market that sells your hour for thirty
              cents has every incentive to keep the trap shut: inventory that leaves together is inventory lost.
            </p>
            <p>
              What follows from this is genuinely contested. If the trap is collective, individual advice, put the
              phone down, delete the app, is advice to defect alone, which the trap punishes. The policy responses on
              offer, age limits, design rules, phone-free schools, are collective by construction, which is why they
              appeal even to people who doubt the harm evidence, and alarm people who notice that &ldquo;collective
              solution&rdquo; is also a phrase for &ldquo;someone decides for you.&rdquo; We leave that one open.
            </p>
          </Prose>
        </Spread>
      </Column>
    </div>
  );
}
