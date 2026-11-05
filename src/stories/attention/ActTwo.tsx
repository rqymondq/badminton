import { ActHead } from "@/components/story/Act";
import { Column, Prose, Ref, RegisterTag, Aside, Spread, Pull, Figure } from "@/components/story/Prose";
import { DotField } from "./DotField";

const ledger = [
  { year: "1833", line: "Benjamin Day sells the New York Sun for a penny, a sixth of the going rate, and makes up the difference by selling the readers to advertisers.", ref: 19 },
  { year: "1971", line: "Herbert Simon: “a wealth of information creates a poverty of attention.” The scarce thing has changed sides.", ref: 17 },
  { year: "1973", line: "Richard Serra and Carlota Schoolman buy television airtime to broadcast six minutes of white text on blue: the audience is the product delivered.", ref: 18 },
  { year: "2024", line: "Meta books $164.5 billion, almost all of it advertising, from 3.35 billion people a day. Per person, per year: $49.63.", ref: 2 },
] as const;

export function ActTwo() {
  return (
    <div className="py-24 md:py-32">
      <Column>
        <ActHead numeral="II" label="The Market" theme="You are not the product. You are the inventory, and inventory is cheap." />

        <Spread
          margin={
            <Aside label="Registers">
              <p className="mb-2"><RegisterTag level="established" /> Meta&rsquo;s revenue, daily actives and per-person figures are from its own filings.<Ref n={1} /><Ref n={2} /></p>
              <p className="mb-2"><RegisterTag level="editorial" /> Scaling the worldwide per-person figure by the last regional ratios Meta disclosed is our estimate, not Meta&rsquo;s number.<Ref n={3} /></p>
              <p><RegisterTag level="established" /> Global ad spend and the three-company share are WARC forecasts.<Ref n={6} /></p>
            </Aside>
          }
        >
          <Prose>
            <p className="versal">
              Here is how the price on your receipt comes to exist. Each time you open the app, a space on your
              screen is auctioned to advertisers in the time it takes the page to draw. Meta&rsquo;s filings
              describe the business plainly: nearly all of its revenue comes from advertising, and advertisers pay
              per impression or per action.<Ref n={1} /> The winning bid for one impression is a fraction of a cent.
              Multiply by the impressions in an hour and you get the line on the receipt. Multiply by everyone, and
              you get the company.
            </p>
            <p>
              The arithmetic is the point. In 2024 Meta reported $164.5 billion in revenue from 3.35 billion daily
              people: $49.63 a person for the year, or thirteen and a half cents a day.<Ref n={2} /> The last time
              the company broke that figure out by region, a user in the United States or Canada was worth about five
              times the world average and a user in the rest of the world about a third of it.<Ref n={3} /> Those
              are the ratios behind your receipt.
            </p>
          </Prose>
        </Spread>

        <Figure
          n="1"
          caption={
            <>
              One day of Meta&rsquo;s audience. Each dot is five million people; the field fills as you scroll. The red
              dot is you and the people who share your five-millionth of the market. Figures from Meta&rsquo;s 2024
              results; your share uses the regional estimate on your receipt.
            </>
          }
        >
          <DotField />
        </Figure>

        <Spread>
          <Prose>
            <p>
              So the slogan is half right and half misleading. You are being sold; that part is true. But you are not
              being sold as a product. A product has a price that someone weighs. You are sold as inventory: in bulk,
              by the thousand impressions, at a price nobody has to think about. The economics of inventory are not
              the economics of a product. Nobody tries to make you worth more. They try to have more of you.
            </p>
            <Pull>Cheap things are sold in bulk. The business was never your attention. It is your attention, multiplied.</Pull>
            <p>
              That is why the small number explains the large effects. If an hour of you sells for thirty cents,
              the only way to build a $164 billion company is to be present for a great many hours, of a great many
              people, as reliably as possible. Every design decision that follows, the infinite scroll, the
              notification, the autoplay, is an inventory decision. The incentive is not to make your hour valuable.
              It is to make your hours numerous.
            </p>
            <p>
              None of this is new, exactly. Advertising-funded media is older than the telegraph. What is new is the
              resolution: the penny press sold readers to advertisers by the edition; the feed sells them by the
              glance, with a bid for each one.
            </p>
          </Prose>
        </Spread>

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,64ch)_minmax(14rem,20rem)] lg:gap-16">
          <div>
            <p className="mono text-fg-3">Ledger</p>
            <ol className="mt-4 divide-y divide-rule border-t border-rule">
              {ledger.map((l) => (
                <li key={l.year} className="grid grid-cols-[4.5rem_1fr] gap-4 py-4">
                  <span className="display text-[length:var(--step-2)] leading-none text-fg">{l.year}</span>
                  <p className="serif-text text-[length:var(--step-0)] text-fg-2">
                    {l.line}
                    <Ref n={l.ref} />
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <Aside label="Scale">
            <p className="mb-3">
              Global advertising spend in 2025 was forecast at about $1.19 trillion. Three companies, Alphabet, Meta and
              Amazon, take more than half of it outside China.<Ref n={6} />
            </p>
            <p>
              The receipt is small because the market is large. The two facts are the same fact.
            </p>
          </Aside>
        </div>
      </Column>
    </div>
  );
}
