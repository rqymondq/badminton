export type Register = "established" | "theory" | "contested" | "editorial";

export interface Investigation {
  slug: string;
  number: string; // editorial numbering, e.g. "No. 01"
  title: string;
  dek: string;
  desk: Desk;
  readingTime: string;
  published: string; // ISO date
  status: "published";
  /** Short line used on index cards: what the reader actually does. */
  promise: string;
  /** Counts for the running head. */
  shape: string;
  /** Visual motif key for index cards. */
  motif: "ring" | "receipt";
}

export type Desk = "Mind" | "Power" | "Society" | "History" | "Philosophy" | "Culture";

export const investigations: Investigation[] = [
  {
    slug: "attention",
    number: "No. 02",
    title: "How much is an hour of your attention worth?",
    dek: "Meta’s own accounts put a price on it. The price is far smaller than you think, and that turns out to be the whole problem. An inquiry into the market for your attention, the panic about it, and the trap underneath.",
    desk: "Power",
    readingTime: "8 min",
    published: "2026-11-05",
    status: "published",
    promise: "Print your own receipt in the first ten seconds. Then find out why the number is so small.",
    shape: "Five acts · three instruments · twenty sources",
    motif: "receipt",
  },
  {
    slug: "what-you-believe",
    number: "No. 01",
    title: "How much of what you believe is actually yours?",
    dek: "An interactive inquiry into where our convictions come from, why our reasons so often arrive after our conclusions, and what independent thought could still mean.",
    desk: "Mind",
    readingTime: "7 min",
    published: "2026-11-04",
    status: "published",
    promise: "Take a twenty-second test on yourself, then watch your reasons arrive after your verdict.",
    shape: "Six acts · three instruments · eighteen sources",
    motif: "ring",
  },
];

/** Future desks. These are editorial concepts, not published work. */
export const desks: { name: Desk; numeral: string; question: string }[] = [
  { name: "Mind", numeral: "I", question: "Why does a brain that evolved to survive believe what it believes?" },
  { name: "Power", numeral: "II", question: "Who decides, who pays, and who never gets asked?" },
  { name: "Society", numeral: "III", question: "What holds strangers together, and what quietly pulls them apart?" },
  { name: "History", numeral: "IV", question: "Which stories survived, and who did the choosing?" },
  { name: "Philosophy", numeral: "V", question: "What are we actually asking when we ask how to live?" },
  { name: "Culture", numeral: "VI", question: "What does the art of a moment know that the moment doesn't?" },
];

export function getInvestigation(slug: string) {
  return investigations.find((i) => i.slug === slug);
}
