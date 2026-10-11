import { todo } from "./todo";

/*
 * Site-wide facts. No location anywhere on the site, by Enzo's request — not in copy, meta,
 * JSON-LD or OG images.
 */
export const site = {
  name: "Enzo De Vittorio",
  shortName: "Enzo",
  monogram: "EDV",
  roles: ["Developer & UX Designer", "Co-founder, Stack Studio"],
  /** Mono line above the hero. */
  descriptor: "Developer & UX Designer",
  tagline: "Built to be felt.",
  availability: "Open to freelance & graduate roles — 2027",
  /** The address the previous site's buttons used. */
  email: "enzo.devittorio5@gmail.com",
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
    /** stackstudio.co.za still serves a placeholder page, so it isn't linked yet. */
    url: todo("Stack Studio website URL (once the new site is live)"),
    caseStudy: "stack-studio",
  },
  education: { institution: "Open Window Institute", url: "https://www.openwindow.co.za" },
} as const;

export type SocialKey = keyof typeof site.socials;
export const socialLabels: Record<SocialKey, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  instagram: "Instagram",
};
