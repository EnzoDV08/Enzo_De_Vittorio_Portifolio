import { todo } from "./todo";
import type { Maybe } from "./types";

export type Recognition = {
  title: string;
  detail: Maybe<string>;
  year: number;
  /** Short uppercase line for the marquee. */
  marquee: string;
};

export const recognition: Recognition[] = [
  {
    title: "Pendoring Finalist",
    detail: "Leke Lente Lingo",
    year: 2026,
    marquee: "Pendoring Finalist — Leke Lente Lingo",
  },
  {
    title: "Hackathon Winner",
    detail: todo("hackathon event name"),
    year: 2024,
    marquee: "Hackathon Winner — 2024",
  },
  {
    title: "Top 10",
    detail: "Industrial Design Chandelier",
    year: 2023,
    marquee: "Top 10 — Industrial Design Chandelier",
  },
];
