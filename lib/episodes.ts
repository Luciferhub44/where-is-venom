export interface Episode {
  num: number;
  title: string;
  body: string;
  quote: string;
  /** Exact filename as it sits in public/episodes/ */
  video: string;
}

// Episodes 1–5 use the narrative written for the original site. Episodes
// 6–12 are drawn directly from the creator's own captions on each video
// (trimmed where the source filename itself was cut short) — nothing here
// is invented dialogue.
export const EPISODES: Episode[] = [
  {
    num: 1,
    title: "The Silence",
    body: `For over two years, people kept asking: "Where is Venom?" Some thought He left the country. Some thought He stopped creating. Some had no idea what happened. This is the story we were never ready to tell.`,
    quote: `"Some thought Venom left the country. Some thought Venom stopped creating."`,
    video: "For everyone who has asked about Venom over the years…Thank you🤍Episode 1.mp4",
  },
  {
    num: 2,
    title: "The Day Everything Changed",
    body: `Two years ago, my brother's life changed in a matter of seconds. Sharing this story isn't easy, but I promised myself that if God brought him through it, I would tell it honestly.`,
    quote: `"I promised myself that if God brought him through it, I would tell it honestly."`,
    video: "We thought he would be okay.Episode 2 ❤️#venomzcustomz.mp4",
  },
  {
    num: 3,
    title: "Every Second Mattered",
    body: `The doctors knew something wasn't right, and every second suddenly mattered. In the chaos of emergency rooms and beeping machines, we learned that hope isn't just a feeling—it's a fight.`,
    quote: `"The doctors knew something wasn't right, and every second suddenly mattered."`,
    video: "The moment we realized this was bigger than we thought.Episode 3. ❤️#Whereisvenom #Venomstory #h.mp4",
  },
  {
    num: 4,
    title: "The Darkest Day",
    body: `The doctor looked at us and said, "Your brother is in a coma." Nothing could have prepared us for that moment. This episode takes you through the fear, the prayers, and the hope we held onto when everything seemed uncertain.`,
    quote: `"Your brother is in a coma. Nothing could have prepared us for that moment."`,
    video: "The hardest part of our story begins here.Episode 4.#WhereIsVenom.mp4",
  },
  {
    num: 5,
    title: "Hope Was All We Had",
    body: `Hope was all we had. Through the longest days of waiting, prayer became the only language that made sense. Thank you for walking this journey with us.`,
    quote: `"Hope was all we had. Thank you for walking this journey with us."`,
    video: "Hope was all we had.Episode 5.Thank you for walking this journey with us❤️🙏#WhereIsVenom.mp4",
  },
  {
    num: 6,
    title: "Harder to Edit Than the Last",
    body: `Every episode has been harder to edit than the last. Not because I've forgotten these moments…`,
    quote: `"Every episode has been harder to edit than the last."`,
    video: "Every episode has been harder to edit than the last.Not because I’ve forgotten these moments, bu.mp4",
  },
  {
    num: 7,
    title: "Healing Isn't Always Loud",
    body: `One thing this journey has taught us is that healing isn't always loud. Sometimes it looks like…`,
    quote: `"Healing isn't always loud."`,
    video: "One thing this journey has taught us is that healing isn’t always loud. Sometimes it looks like .mp4",
  },
  {
    num: 8,
    title: "Episode 8",
    body: `Some moments become even more precious when you look back on them.`,
    quote: `"Some moments become even more precious when you look back on them."`,
    video: "Some moments become even more precious when you look back on them. ❤️Episode 8..mp4",
  },
  {
    num: 9,
    title: "Some Days, Hope Was Enough",
    body: `Some days, hope was enough.`,
    quote: `"Some days, hope was enough."`,
    video: "Some days, hope was enough❤️.mp4",
  },
  {
    num: 10,
    title: `"Just One More Surgery"`,
    body: `We kept telling ourselves… "Just one more surgery." We had no idea how many more were still ahead…`,
    quote: `"Just one more surgery — we had no idea how many more were still ahead."`,
    video: "We kept telling ourselves…“Just one more surgery.”We had no idea how many more were still ahead .mp4",
  },
  {
    num: 11,
    title: "Some Memories Are Still Hard to Revisit",
    body: `Some memories are still hard to revisit. Every time I sit down to edit these episodes…`,
    quote: `"Some memories are still hard to revisit."`,
    video: "Some memories are still hard to revisit.Every time I sit down to edit these episodes, I’m remind.mp4",
  },
  {
    num: 12,
    title: "Twelve Episodes Later — Thank You",
    body: `Twelve episodes later, all I can say is thank you. Our family has read every prayer, seen every share and felt every act of kindness.`,
    quote: `"Twelve episodes later, all I can say is thank you."`,
    video: "Twelve episodes later, all I can say is thank you.Our family has read every prayer, every encour.mp4",
  },
];

export function episodeVideoSrc(filename: string): string {
  return `/episodes/${encodeURIComponent(filename)}`;
}
