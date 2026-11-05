import { ActHead } from "@/components/story/Act";
import { Column, Prose, Ref, RegisterTag, Aside, Spread, Pull, Figure } from "@/components/story/Prose";
import { Ladder } from "./Ladder";

export function ActThree() {
  return (
    <div className="py-24 md:py-32">
      <Column>
        <ActHead numeral="III" label="The Panic" theme="Is it hurting us? The honest answer depends on what you count, and that is the problem." />

        <Spread
          margin={
            <Aside label="Registers">
              <p className="mb-2"><RegisterTag level="contested" /> Whether social media is a principal cause of the rise in adolescent anxiety and depression.<Ref n={9} /><Ref n={10} /></p>
              <p className="mb-2"><RegisterTag level="established" /> That the average correlational association is small, and that analytic choices can move it in either direction.<Ref n={7} /></p>
              <p><RegisterTag level="established" /> That a 2023 National Academies review found the evidence insufficient for a population-level causal claim, while noting potential for both harm and benefit.<Ref n={11} /></p>
            </Aside>
          }
        >
          <Prose>
            <p className="versal">
              If the market is that large and the incentive that blunt, surely it is doing damage. This is the
              comfortable narrative now, across the political spectrum: the phones did it. Jonathan Haidt&rsquo;s
              <em> The Anxious Generation</em> made the case in 2024 that a &ldquo;great rewiring&rdquo; of childhood
              around smartphones and social media is the principal cause of a rise in teenage anxiety and
              depression.<Ref n={10} /> It is plausible, it is widely believed, and the best available evidence does
              not support it as stated.
            </p>
            <p>
              In 2019 Amy Orben and Andrew Przybylski took three large datasets, about 355,000 adolescents in the
              United Kingdom and the United States, and asked a different question: not whether technology use
              correlates with well-being, but how much the answer depends on how you ask. They ran the analysis every
              defensible way, hundreds of thousands of specifications. The association was negative, tiny, and
              unstable: at most 0.4% of the variation in well-being, with a median coefficient around
              −0.035.<Ref n={7} /> To make that legible they compared it with other things in the same
              datasets.<Ref n={8} />
            </p>
          </Prose>
        </Spread>

        <Figure
          n="2"
          caption={
            <>
              How strongly six things are associated with adolescent well-being, relative to technology use (the red
              bar, set to 1). Ratios as summarised by the Oxford Internet Institute from Orben &amp; Przybylski
              (2019). The sleep bar is broken: it runs off the chart. Select a bar to read more.
            </>
          }
        >
          <Ladder />
        </Figure>

        <Spread>
          <Prose>
            <p>
              Wearing glasses was more negatively associated with well-being than using technology. Eating potatoes
              was about the same. Being bullied was four times worse; getting enough sleep, forty times better. If
              you had only this chart, the policy conclusion would be bedtimes, not bans.
            </p>
            <p>
              The critics of the panic have more than one chart. Candice Odgers, reviewing Haidt&rsquo;s book
              in <em>Nature</em>, argued that its central causal claim is not supported by the research, that
              longitudinal studies following children through their phones find social media a poor predictor of
              later mental health, and that the arrow may point the other way: anxious children may become heavier
              users.<Ref n={9} /> A National Academies committee, reviewing the whole literature in 2023, concluded
              that the evidence does not establish that social media changes adolescent health at the population
              level, while finding it can both harm and help, differently for different people.<Ref n={11} />
            </p>
            <Pull>A thing can be both overstated and real. The panic&rsquo;s mistake is the word &ldquo;the&rdquo;: the cause, the phones, the generation.</Pull>
            <p>
              Hold on to the last clause of that committee&rsquo;s finding, because it is where the honest version
              of the worry lives. A small average effect is consistent with a large effect on some people. Haidt&rsquo;s
              defenders argue the averages hide exactly that, and that waiting for perfect causal evidence is its own
              choice.<Ref n={10} /> The critics answer that a theory which can absorb any evidence is not a theory.
              This is a live dispute between serious people, and we are not going to settle it for you.
            </p>
            <p>
              What we can do is notice what the correlational evidence cannot see at all. It measures hours against
              happiness, one person at a time. But the receipt in Act I was not about one person. It was about
              inventory. If the harm is in the market rather than the minutes, you would need a different kind of
              study to find it. There are three.
            </p>
          </Prose>
        </Spread>
      </Column>
    </div>
  );
}
