import { caseStudy as copy } from "~/content/pages";
import { isTodo, real } from "~/content/todo";
import type { GalleryImage, Project } from "~/content/types";
import type { Devices } from "./devices";
import type { Picture } from "./images";

export const indexLabel = (n: number) => String(n).padStart(2, "0");

/** "2026", "2025–2026", or null when the year is still a TODO. */
export function yearText(p: Pick<Project, "year" | "yearLabel">): string | null {
  if (p.yearLabel) return p.yearLabel;
  return isTodo(p.year) ? null : String(p.year);
}

/** Sort key: newest first, unknown years last. */
export const yearValue = (p: Pick<Project, "year">) => (isTodo(p.year) ? -Infinity : p.year);

export const disciplinesText = (p: Pick<Project, "disciplines">) => p.disciplines.join(" · ");

export type ProjectLink = { kind: "live" | "code" | "prototype"; href: string; label: string };

/** The project's real external links, best first. TODO links are left out. */
export function projectLinks(p: Pick<Project, "links">): ProjectLink[] {
  return (["live", "code", "prototype"] as const).flatMap((kind) => {
    const href = real(p.links[kind]);
    return href ? [{ kind, href, label: copy.links[kind] }] : [];
  });
}

export const caseStudyPath = (p: Pick<Project, "slug">) => `/work/${p.slug}`;

/** A light tint of the project's own colour, for the panels its devices sit on. */
export const projectTint = (p: Pick<Project, "theme">, amount = 24) =>
  p.theme?.accent
    ? `color-mix(in oklab, ${p.theme.accent} ${amount}%, var(--color-bg-2))`
    : "var(--color-bg-2)";

// ───────────── Shapes sent from route loaders (prerendered into the HTML) ─────────────

/** What a card or list row needs — no case-study text, so pages stay light. */
export type ProjectSummary = Omit<
  Project,
  "caseStudy" | "gallery" | "team" | "client" | "context" | "role"
> & {
  hasCaseStudy: boolean;
  picture?: Picture;
  devices: Devices;
};

/** Everything a case-study page needs, with images already resolved. */
export type ProjectDetail = Omit<Project, "gallery"> & {
  picture?: Picture;
  devices: Devices;
  gallery?: (GalleryImage & { picture?: Picture })[];
};
