import { Act } from "@/components/story/Act";
import { StoryShell, type ActNav } from "@/components/story/StoryShell";
import { Sources } from "@/components/story/Sources";
import { Invitation } from "@/components/Invitation";
import { NextInvestigation } from "@/components/story/NextInvestigation";
import { ReceiptProvider } from "./ReceiptContext";
import { sources } from "./data";
import { ActOne } from "./ActOne";
import { ActTwo } from "./ActTwo";
import { ActThree } from "./ActThree";
import { ActFour } from "./ActFour";
import { ActFive } from "./ActFive";

export const acts: ActNav[] = [
  { id: "act-i", numeral: "I", title: "The Receipt" },
  { id: "act-ii", numeral: "II", title: "The Market" },
  { id: "act-iii", numeral: "III", title: "The Panic" },
  { id: "act-iv", numeral: "IV", title: "The Trap" },
  { id: "act-v", numeral: "V", title: "The Ledger Closes" },
];

export default function Attention() {
  return (
    <ReceiptProvider>
      <StoryShell acts={acts}>
        <article>
          <Act id="act-i" numeral="I" title="The Receipt" surface="ink">
            <ActOne />
          </Act>
          <Act id="act-ii" numeral="II" title="The Market" surface="parchment">
            <ActTwo />
          </Act>
          <div aria-hidden className="h-[20svh] bg-gradient-to-b from-parchment to-[#0e1220]" />
          <Act id="act-iii" numeral="III" title="The Panic" surface="night">
            <ActThree />
          </Act>
          <div aria-hidden className="h-[20svh] bg-gradient-to-b from-[#0e1220] to-parchment" />
          <Act id="act-iv" numeral="IV" title="The Trap" surface="parchment">
            <ActFour />
          </Act>
          <Act id="act-v" numeral="V" title="The Ledger Closes" surface="parchment" className="border-t border-rule">
            <ActFive />
            <NextInvestigation current="attention" />
            <Invitation />
            <Sources
              sources={sources}
              startHere={[
                "Meta's 2024 Form 10-K, the section on average revenue per person, for the number itself.",
                "Orben & Przybylski (2019), for how much an analysis can depend on who is analysing.",
                "Roth's VoxEU column on collective traps, for the idea that reframes the whole argument.",
              ]}
            />
          </Act>
        </article>
      </StoryShell>
    </ReceiptProvider>
  );
}
