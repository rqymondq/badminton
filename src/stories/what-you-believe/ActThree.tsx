import { ActHead } from "@/components/story/Act";
import { Column, Prose, Ref, RegisterTag, Aside, Spread, Pull } from "@/components/story/Prose";
import { ElephantScene } from "./ElephantScene";
import { FlashJudgement } from "./FlashJudgement";

export function ActThree() {
  return (
    <div className="pt-24 md:pt-32">
      <Column>
        <ActHead numeral="III" label="The Elephant and the Rider" theme="What if your reasons came after your conclusions?" />
        <Prose className="mb-8">
          <p className="lead">
            Jonathan Haidt asks you to picture the mind as a rider on an elephant. The rider is conscious
            reasoning: verbal, deliberate, good at explaining. The elephant is everything else: intuition,
            emotion, habit, the gut sense that something is simply <em>off</em>. The rider looks like the one
            in charge. Watch where they actually go.<Ref n={1} />
          </p>
        </Prose>
      </Column>

      <ElephantScene />

      <Column className="pb-24 pt-16 md:pb-32">
        <Spread
          margin={
            <Aside label="Registers">
              <p className="mb-2"><RegisterTag level="established" /> People confidently report reasons for choices that experiments show did not cause them.<Ref n={13} /></p>
              <p className="mb-2"><RegisterTag level="established" /> Motivated reasoning: we evaluate evidence more harshly when it threatens a conclusion we hold.<Ref n={12} /></p>
              <p className="mb-2"><RegisterTag level="theory" /> The social intuitionist model itself.<Ref n={2} /></p>
              <p><RegisterTag level="contested" /> How often reasoning changes moral judgment, and whether &ldquo;dumbfounding&rdquo; is what it seems.<Ref n={4} /><Ref n={5} /></p>
            </Aside>
          }
        >
          <Prose>
            <p className="versal">
              Haidt’s first principle, as he states it, is that intuitions come first and strategic
              reasoning second.<Ref n={1} /> The claim is not that reasoning is fake. It is that, in moral
              life especially, reasoning most often arrives as a press secretary rather than a judge: its
              job is to explain and defend a verdict the elephant has already delivered, and to do so
              persuasively, to others and to ourselves.
            </p>
            <p>
              Older research points the same way. In a classic 1977 review, Richard Nisbett and Timothy
              Wilson showed that people fluently report reasons for their choices that demonstrably did not
              produce them.<Ref n={13} /> Ziva Kunda’s survey of motivated reasoning found that we hold
              evidence to a stricter standard when it threatens what we want to believe.<Ref n={12} /> None
              of this means we are stupid. It means the rider is loyal.
            </p>
            <Pull>The rider is not a liar. The rider is a loyal advocate who arrived late.</Pull>
            <p>
              Now the caution, because this is where the metaphor gets abused. Haidt’s own model includes
              paths by which reasoning changes intuition: being persuaded by someone else’s argument, and,
              more rarely, private reflection.<Ref n={2} /> Critics argue these paths are wider than he
              allows. Joseph Paxton and Joshua Greene have made the case that deliberate reasoning shapes
              moral judgment more than the model suggests.<Ref n={5} /> Edward Royzman and colleagues
              re-ran the famous dumbfounding scenarios and found that much of the dumbfounding disappears
              once you take seriously that participants may genuinely believe harm is possible.<Ref n={4} />
            </p>
            <p>
              And there is a more hopeful reading of the whole picture. Hugo Mercier and Dan Sperber argue
              that reasoning evolved not to find truth alone in a study, but to argue: to produce reasons
              for others and to evaluate theirs.<Ref n={14} /> Reasoning that is poor in solitude becomes
              good in company. If that is right, the rider’s weakness is also a design hint: the place to
              test a belief is not inside your own head.
            </p>
            <p>
              So hold the model lightly. It is a <em>theory</em>, well-supported in parts and argued over in
              others. What it reliably does is make one habit visible: the speed with which a verdict
              arrives, and the diligence with which reasons follow. You can watch it happen.
            </p>
          </Prose>
        </Spread>

        <div className="mt-16 max-w-[800px]">
          <FlashJudgement />
        </div>
      </Column>
    </div>
  );
}
