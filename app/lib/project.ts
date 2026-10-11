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

/** A light tint of the project's own colour, for small chips and badges. */
export const projectTint = (p: Pick<Project, "theme">, amount = 24) =>
  p.theme?.accent
    ? `color-mix(in oklab, ${p.theme.accent} ${amount}%, var(--color-bg-2))`
    : "var(--color-bg-2)";

/** True for colours dark enough to need light text (relative luminance under 0.18). */
export function isDarkColor(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const digits = m?.[1];
  if (!digits) return false;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(digits.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.18;
}

/**
 * The panel a project's work sits on: its website's own background colour when known, else a
 * tint of its accent. `className` switches text to the light theme on dark surfaces.
 */
export function projectSurface(p: Pick<Project, "theme">, tint = 30) {
  const surface = p.theme?.surface;
  if (!surface) return { style: { background: projectTint(p, tint) }, className: "" };
  return { style: { background: surface }, className: isDarkColor(surface) ? "theme-night" : "" };
}

// ───────────── Shapes sent from route loaders (prerendered into the HTML) ─────────────

/** What a card or list row needs, no case-study text, so pages stay light. */
export type ProjectSummary = Omit<
  Project,
  "caseStudy" | "gallery" | "team" | "client" | "role"
> & {
  hasCaseStudy: boolean;
  picture?: Picture;
  markPicture?: Picture;
  wordmarkPicture?: Picture;
  devices: Devices;
};

/** Everything a case-study page needs, with images already resolved. */
export type ProjectDetail = Omit<Project, "gallery"> & {
  picture?: Picture;
  markPicture?: Picture;
  wordmarkPicture?: Picture;
  devices: Devices;
  gallery?: (GalleryImage & { picture?: Picture })[];
};
