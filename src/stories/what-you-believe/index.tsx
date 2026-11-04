import { Act } from "@/components/story/Act";
import { StoryShell, type ActNav } from "@/components/story/StoryShell";
import { ActOne } from "./ActOne";
import { ActTwo } from "./ActTwo";
import { ActThree } from "./ActThree";
import { ActFour } from "./ActFour";
import { ActFive } from "./ActFive";
import { ActSix } from "./ActSix";
import { Sources } from "./Sources";

export const acts: ActNav[] = [
  { id: "act-i", numeral: "I", title: "The Question" },
  { id: "act-ii", numeral: "II", title: "The Inheritance" },
  { id: "act-iii", numeral: "III", title: "The Elephant and the Rider" },
  { id: "act-iv", numeral: "IV", title: "Two Minds, One World" },
  { id: "act-v", numeral: "V", title: "The Search for Understanding" },
  { id: "act-vi", numeral: "VI", title: "The Unfinished Mind" },
];

export default function WhatYouBelieve() {
  return (
    <StoryShell acts={acts}>
      <article>
        <Act id="act-i" numeral="I" title="The Question" surface="ink">
          <ActOne />
        </Act>
        <Act id="act-ii" numeral="II" title="The Inheritance" surface="parchment">
          <ActTwo />
        </Act>
        <div aria-hidden className="h-[20svh] bg-gradient-to-b from-parchment to-ink" />
        <Act id="act-iii" numeral="III" title="The Elephant and the Rider" surface="ink">
          <ActThree />
        </Act>
        <div aria-hidden className="h-[20svh] bg-gradient-to-b from-ink to-parchment" />
        <Act id="act-iv" numeral="IV" title="Two Minds, One World" surface="parchment">
          <ActFour />
        </Act>
        <div aria-hidden className="h-[20svh] bg-gradient-to-b from-parchment to-[#0e1220]" />
        <Act id="act-v" numeral="V" title="The Search for Understanding" surface="night">
          <ActFive />
        </Act>
        <div aria-hidden className="h-[24svh] bg-gradient-to-b from-[#0e1220] via-[#5b4a3f] to-parchment" />
        <Act id="act-vi" numeral="VI" title="The Unfinished Mind" surface="parchment">
          <ActSix />
          <Sources />
        </Act>
      </article>
    </StoryShell>
  );
}
