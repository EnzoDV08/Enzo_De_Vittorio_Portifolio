import { todo } from "./todo";

export const site = {
  name: "Enzo De Vittorio",
  shortName: "Enzo",
  monogram: "EDV",
  roles: ["Developer & UX Designer", "Co-founder, Stack Studio"],
  /** Mono line above the hero. */
  descriptor: "Developer & UX Designer",
  location: "Centurion / Pretoria, South Africa",
  clock: { place: "Centurion, ZA", timeZone: "Africa/Johannesburg", zone: "SAST" },
  tagline: "Built to be felt.",
  availability: "Available for freelance & graduate roles — 2027",
  email: todo(
    "real email address (the old site's buttons used enzo.devittorio5@gmail.com — confirm)",
  ),
  socials: {
    github: "https://github.com/EnzoDV08",
    linkedin: todo("full LinkedIn profile URL"),
    instagram: "https://www.instagram.com/enzo_devittorio/",
  },
  cv: {
    href: "/Enzo-De-Vittorio-CV.pdf",
    fileName: "Enzo-De-Vittorio-CV.pdf",
  },
  /**
   * Canonical origin for SEO, OG and sitemap URLs. The Firebase default domain is used until
   * a custom domain exists — see CONTENT_TODO.md.
   */
  url: "https://myportfolio-8c863.web.app",
  studio: {
    name: "Stack Studio",
    legalName: "StackStudio (Pty) Ltd",
    partner: "Armand Naudé",
    url: todo("Stack Studio website URL"),
  },
  education: { institution: "Open Window Institute", url: "https://www.openwindow.co.za" },
} as const;

export type SocialKey = keyof typeof site.socials;
export const socialLabels: Record<SocialKey, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  instagram: "Instagram",
};
