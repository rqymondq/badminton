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
}

export type Desk = "Mind" | "Power" | "Society" | "History" | "Philosophy" | "Culture";

export const investigations: Investigation[] = [
  {
    slug: "what-you-believe",
    number: "No. 01",
    title: "How much of what you believe is actually yours?",
    dek: "An interactive inquiry into where our convictions come from, why our reasons so often arrive after our conclusions, and what independent thought could still mean.",
    desk: "Mind",
    readingTime: "7 min",
    published: "2026-11-04",
    status: "published",
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
