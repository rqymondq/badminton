import type { Register } from "@/content/investigations";

/** The sixteen words that gather in Act I and return in Act VI. */
export const influenceWords = [
  "Family", "Language", "Place", "Class", "Era", "Religion", "School", "Friends",
  "Screens", "Accident", "Stories", "Praise", "Fear", "Hunger", "Luck", "Habit",
] as const;

export interface Influence {
  key: string;
  label: string;
  tint: "vermilion" | "lapis" | "graphite" | "ochre";
  example: string;
  note?: string;
  ref?: number;
}

/** Act II nodes. The examples are illustrative, not measurements. */
export const influences: Influence[] = [
  {
    key: "family",
    label: "Family",
    tint: "vermilion",
    example:
      "The first arguments you ever heard were someone else's. Children tend to share their parents' political leanings, most strongly in homes where politics is discussed often.",
    note: "Established in panel studies; the strength of transmission varies a lot by family.",
    ref: 8,
  },
  {
    key: "language",
    label: "Language",
    tint: "lapis",
    example:
      "The words you were handed make some distinctions easy and others effortful. Whether language shapes thought itself, or only what is convenient to say, remains argued over.",
    note: "Linguistic relativity is a live research question, not a settled one.",
  },
  {
    key: "place",
    label: "Place",
    tint: "graphite",
    example:
      "A childhood among strangers and a childhood among cousins teach different lessons about trust, long before anyone puts the lesson into words.",
  },
  {
    key: "faith",
    label: "Faith",
    tint: "ochre",
    example:
      "In the United States, most adults raised in a religion still identify with it. Of those who leave, the largest group become unaffiliated rather than converts.",
    note: "A survey finding about one country, not a law of nature.",
    ref: 10,
  },
  {
    key: "school",
    label: "School",
    tint: "lapis",
    example:
      "A curriculum is a map handed to you before you could read one. What it includes, and quietly omits, becomes the shape of the known world.",
  },
  {
    key: "friends",
    label: "Friends",
    tint: "vermilion",
    example:
      "Peers are the audience for whom opinions are first performed. The ones that win approval tend to be kept; the ones that cost it tend to be dropped.",
    note: "Haidt calls this the social part of the social intuitionist model.",
    ref: 2,
  },
  {
    key: "class",
    label: "Class",
    tint: "graphite",
    example:
      "Scarcity and abundance train different instincts about risk, patience, and whom to blame when something goes wrong.",
  },
  {
    key: "media",
    label: "Media",
    tint: "ochre",
    example:
      "The stories you absorb set the range of what seems normal, what seems possible, and what seems dangerous. A feed is a curriculum without a syllabus.",
  },
];

export interface Source {
  n: number;
  authors: string;
  year: string;
  title: string;
  venue: string;
  url: string;
  register: Register;
  note?: string;
  verify?: boolean;
}

/**
 * Bibliography. `verify: true` marks links that could not be opened from the
 * build environment and should be checked before publication.
 */
export const sources: Source[] = [
  {
    n: 1,
    authors: "Haidt, J.",
    year: "2012",
    title: "The Righteous Mind: Why Good People Are Divided by Politics and Religion",
    venue: "Pantheon Books",
    url: "https://righteousmind.com/",
    register: "theory",
    note: "Source of the elephant-and-rider metaphor as used here and the phrase 'intuitions come first, strategic reasoning second'. The metaphor first appears in Haidt's The Happiness Hypothesis (2006).",
    verify: true,
  },
  {
    n: 2,
    authors: "Haidt, J.",
    year: "2001",
    title: "The emotional dog and its rational tail: A social intuitionist approach to moral judgment",
    venue: "Psychological Review, 108(4), 814–834",
    url: "https://doi.org/10.1037/0033-295X.108.4.814",
    register: "theory",
    note: "The academic statement of the model. It explicitly includes links for reasoned persuasion and private reflection changing intuitions.",
    verify: true,
  },
  {
    n: 3,
    authors: "Haidt, J., Koller, S. H., & Dias, M. G.",
    year: "1993",
    title: "Affect, culture, and morality, or is it wrong to eat your dog?",
    venue: "Journal of Personality and Social Psychology, 65(4), 613–628",
    url: "https://doi.org/10.1037/0022-3514.65.4.613",
    register: "established",
    note: "The 'harmless taboo' scenarios paraphrased in Act III come from this study.",
    verify: true,
  },
  {
    n: 4,
    authors: "Royzman, E. B., Kim, K., & Leeman, R. F.",
    year: "2015",
    title: "The curious tale of Julie and Mark: Unraveling the moral dumbfounding effect",
    venue: "Judgment and Decision Making, 10(4), 296–313",
    url: "https://journal.sjdm.org/15/15213a/jdm15213a.html",
    register: "contested",
    note: "Argues that much apparent 'dumbfounding' dissolves when participants' real beliefs about harm are taken seriously.",
    verify: true,
  },
  {
    n: 5,
    authors: "Paxton, J. M., & Greene, J. D.",
    year: "2010",
    title: "Moral reasoning: Hints and allegations",
    venue: "Topics in Cognitive Science, 2(3), 511–527",
    url: "https://doi.org/10.1111/j.1756-8765.2010.01096.x",
    register: "contested",
    note: "A sympathetic critique: reasoning may influence moral judgment more than the social intuitionist model allows.",
    verify: true,
  },
  {
    n: 6,
    authors: "Graham, J., Haidt, J., Koleva, S., Motyl, M., Iyer, R., Wojcik, S. P., & Ditto, P. H.",
    year: "2013",
    title: "Moral foundations theory: The pragmatic validity of moral pluralism",
    venue: "Advances in Experimental Social Psychology, 47, 55–130",
    url: "https://doi.org/10.1016/B978-0-12-407236-7.00002-4",
    register: "theory",
    note: "The foundations (care, fairness, loyalty, authority, sanctity, and later liberty) that inform the two lenses of Act IV.",
    verify: true,
  },
  {
    n: 7,
    authors: "Curry, O. S., Mullins, D. A., & Whitehouse, H.",
    year: "2019",
    title: "Is it good to cooperate? Testing the theory of morality-as-cooperation in 60 societies",
    venue: "Current Anthropology, 60(1), 47–69",
    url: "https://doi.org/10.1086/701478",
    register: "contested",
    note: "A rival account of moral pluralism. Included so that moral foundations theory is not presented as the only map.",
    verify: true,
  },
  {
    n: 8,
    authors: "Jennings, M. K., Stoker, L., & Bowers, J.",
    year: "2009",
    title: "Politics across generations: Family transmission reexamined",
    venue: "The Journal of Politics, 71(3), 782–799",
    url: "https://doi.org/10.1017/S0022381609090719",
    register: "established",
    verify: true,
  },
  {
    n: 9,
    authors: "Alford, J. R., Funk, C. L., & Hibbing, J. R.",
    year: "2005",
    title: "Are political orientations genetically transmitted?",
    venue: "American Political Science Review, 99(2), 153–167",
    url: "https://doi.org/10.1017/S0003055405051579",
    register: "contested",
    note: "Twin-study evidence that some variation in political attitudes is heritable. The size and meaning of the effect are debated.",
    verify: true,
  },
  {
    n: 10,
    authors: "Pew Research Center",
    year: "2016",
    title: "Links between childhood religious upbringing and current religious identity",
    venue: "Report chapter, 26 October 2016",
    url: "https://www.pewresearch.org/religion/2016/10/26/links-between-childhood-religious-upbringing-and-current-religious-identity/",
    register: "established",
    verify: true,
  },
  {
    n: 11,
    authors: "Henrich, J., Heine, S. J., & Norenzayan, A.",
    year: "2010",
    title: "The weirdest people in the world?",
    venue: "Behavioral and Brain Sciences, 33(2–3), 61–83",
    url: "https://doi.org/10.1017/S0140525X0999152X",
    register: "established",
    note: "Why findings from Western, educated, industrialised, rich, democratic samples should not be assumed universal.",
    verify: true,
  },
  {
    n: 12,
    authors: "Kunda, Z.",
    year: "1990",
    title: "The case for motivated reasoning",
    venue: "Psychological Bulletin, 108(3), 480–498",
    url: "https://doi.org/10.1037/0033-2909.108.3.480",
    register: "established",
    verify: true,
  },
  {
    n: 13,
    authors: "Nisbett, R. E., & Wilson, T. D.",
    year: "1977",
    title: "Telling more than we can know: Verbal reports on mental processes",
    venue: "Psychological Review, 84(3), 231–259",
    url: "https://doi.org/10.1037/0033-295X.84.3.231",
    register: "established",
    note: "People confidently report reasons for choices that experiments show did not cause them.",
    verify: true,
  },
  {
    n: 14,
    authors: "Mercier, H., & Sperber, D.",
    year: "2011",
    title: "Why do humans reason? Arguments for an argumentative theory",
    venue: "Behavioral and Brain Sciences, 34(2), 57–74",
    url: "https://doi.org/10.1017/S0140525X10000968",
    register: "theory",
    note: "Proposes that reasoning evolved to persuade and to evaluate others' arguments, which explains why it works better in groups than alone.",
    verify: true,
  },
  {
    n: 15,
    authors: "Rozenblit, L., & Keil, F.",
    year: "2002",
    title: "The misunderstood limits of folk science: An illusion of explanatory depth",
    venue: "Cognitive Science, 26(5), 521–562",
    url: "https://doi.org/10.1207/s15516709cog2605_1",
    register: "established",
    note: "People overestimate how well they understand how things work until asked to explain them.",
    verify: true,
  },
  {
    n: 16,
    authors: "Goethe, J. W. von",
    year: "1808",
    title: "Faust: Der Tragödie erster Teil",
    venue: "Project Gutenberg, ebook 2229 (German text)",
    url: "https://www.gutenberg.org/ebooks/2229",
    register: "established",
    verify: true,
  },
  {
    n: 17,
    authors: "Goethe, J. W. von, trans. Bayard Taylor",
    year: "1870",
    title: "Faust: A Tragedy, Part I",
    venue: "Project Gutenberg, ebook 14591 (public-domain English translation)",
    url: "https://www.gutenberg.org/ebooks/14591",
    register: "established",
    note: "The English lines quoted in Act V follow Taylor's translation; glosses marked 'our gloss' are ours.",
    verify: true,
  },
  {
    n: 18,
    authors: "Mill, J. S.",
    year: "1859",
    title: "On Liberty",
    venue: "Project Gutenberg, ebook 34901",
    url: "https://www.gutenberg.org/ebooks/34901",
    register: "established",
    note: "Chapter II: 'He who knows only his own side of the case knows little of that.'",
    verify: true,
  },
];
