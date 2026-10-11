/**
 * What scripts/devices captures and renders, per case study. A target is its live site (`url`)
 * or, when it has no public URL yet, its local production build (`dir`).
 *
 * - stops: desktop captures, in viewport heights scrolled from the top (the first is the
 *   screen on the laptop; the rest are extra gallery material)
 * - motion: capture with animation allowed (for sites that hide content under reduced motion)
 * - hide: CSS selector for overlays that don't belong in a still (cookie bars, badges)
 * - redact: words whose elements are hidden before capture (no location on this site)
 * - finish: the iPhone's colour in this project's renders
 */
const DV200 = "/Users/enzodevittorio/Desktop/DV 200/Semester 1/Term 1/Week 2";

export const targets = [
  {
    slug: "one-river-two-memories",
    url: "https://one-river-two-memories-fa6f1.firebaseapp.com/",
    stops: [0, 1.4, 3, 5],
    motion: true,
    settle: 6000,
    finish: "#8a9a92",
  },
  {
    slug: "leke-lente-lingo",
    url: "https://lentebook-a7c82.web.app/",
    stops: [0],
    finish: "#d9dde3",
  },
  {
    slug: "honeybee-heroes",
    url: "https://honey-bee-heroes.web.app/",
    stops: [0],
    finish: "#b8954a",
  },
  {
    slug: "stack-studio",
    dir: `${DV200}/Stack-Studio/dist`,
    label: "Stack Studio",
    redact: ["Centurion"],
    stops: [0, 1.2, 4],
    motion: true,
    settle: 6000,
    finish: "#2b2d33",
  },
  {
    slug: "mpg-foundation",
    url: "https://mpgf.org.za/",
    stops: [0],
    finish: "#9bb88a",
  },
  {
    slug: "chronovoyage",
    url: "https://crono-voyage.web.app/",
    stops: [0],
    finish: "#c8693a",
  },
];
