import type { Todo } from "./todo";

export type Discipline = "Development" | "UX" | "Campaign" | "Interactive" | "Brand";

/** A real value, or an explicit TODO for Enzo. Never a guess. */
export type Maybe<T> = T | Todo;

export type TeamMember = { name: string; role: Maybe<string> };

export type GalleryImage = {
  /** Path relative to app/assets, e.g. "projects/mpg-foundation/gallery-1.jpg". */
  src: string;
  alt: string;
  caption?: string;
};

export type CaseStudy = {
  /** 2–3 sentences. Every text block on the site is ≤ 60 words. */
  challenge: Maybe<string>;
  approach: { heading: string; body: string }[];
  highlights: string[];
  /** Real results only. */
  outcome: Maybe<string>;
};

export type Project = {
  slug: string;
  title: string;
  /** One line, max ~12 words. */
  tagline: string;
  /** Required on every project. A TODO when it can't be confirmed — see REDESIGN_NOTES.md. */
  year: Maybe<number>;
  /** Shown instead of `year` when work spans years, e.g. "2025–2026". */
  yearLabel?: string;
  disciplines: Discipline[];
  /** Enzo's role, specific. */
  role: Maybe<string>;
  team?: TeamMember[] | Todo;
  /** Real organisation, or "Self-directed" / "Academic". */
  client?: Maybe<string>;
  /** e.g. "PGDip — PP 410" */
  context?: string;
  stack: string[];
  links: { live?: Maybe<string>; code?: Maybe<string>; prototype?: Maybe<string> };
  /** Lead projects: large on home, full case study. */
  featured: boolean;
  /** Older work shown under "Earlier work" on /work, grouped by year. */
  earlier?: boolean;
  status?: "in-progress";
  order: number;
  recognition?: string;
  /** Used only on this project's case study and its card hover state. */
  theme?: { accent: string };
  /** Path relative to app/assets. Missing files render a designed placeholder. */
  cover: string;
  coverAlt: string;
  gallery?: GalleryImage[];
  caseStudy?: CaseStudy;
};

export type TimelineEntry = {
  title: string;
  org: string;
  period: Maybe<string>;
  note?: string;
};
