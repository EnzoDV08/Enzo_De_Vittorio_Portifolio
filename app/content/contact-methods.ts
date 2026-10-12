import type { SocialKey } from "./site";

/*
 * Extra copy for the contact page's method cards. Kept apart from pages.ts, which ships with
 * every page, so it only loads on /contact.
 */
export const contactMethods = {
  email: { note: "Best for projects, roles and anything with detail." },
  whatsapp: { note: "Quickest for a short question." },
  elsewhere: {
    note: "Code, work history and the CV.",
    cvDetail: "PDF, one page",
    newTab: "(opens in a new tab)",
  },
  /** The profile names in site.socials' URLs, shown under each link. */
  handles: {
    github: "EnzoDV08",
    linkedin: "enzo-de-vittorio",
    instagram: "@enzo_devittorio",
  } satisfies Record<SocialKey, string>,
};
