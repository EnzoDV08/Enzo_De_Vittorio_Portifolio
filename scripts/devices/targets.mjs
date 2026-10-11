/**
 * What scripts/devices captures and renders, per case study. A target is its live site (`url`)
 * or, when it has no public URL yet, its local production build (`dir`).
 *
 * - stops: desktop captures, in viewport heights scrolled from the top (the first is the
 *   screen on the laptop; the rest are extra gallery material)
 * - motion: capture with animation allowed (for sites that hide content under reduced motion)
 * - hide: CSS selector for overlays that don't belong in a still (cookie bars, badges)
 * - hideMobile: the same, for the phone capture only (overrides `hide` there)
 * - redact: words whose elements are hidden before capture (no location on this site)
 * - finish: the iPhone's colour in this project's renders
 */
const DV200 = "/Users/enzodevittorio/Desktop/DV 200/Semester 1/Term 1/Week 2";

export const targets = [
  {
    slug: "one-river-two-memories",
    url: "https://one-river-two-memories-fa6f1.firebaseapp.com/",
    stops: [0, 1.4, 3, 5, 6.5],
    motion: true,
    settle: 6000,
    finish: "#8a9a92",
  },
  {
    slug: "leke-lente-lingo",
    url: "https://lentebook-a7c82.web.app/",
    // An app, not a scroll: its gallery shots are the onboarding steps (see REDESIGN_NOTES.md).
    stops: [0],
    finish: "#d9dde3",
  },
  {
    slug: "honeybee-heroes",
    url: "https://honey-bee-heroes.web.app/",
    stops: [0],
    // On a phone, Mellie's speech bubble is cut off by the nav and her launcher covers the buttons.
    hideMobile: ".speech-bubble, .interaction-container",
    finish: "#b8954a",
  },
  {
    slug: "stack-studio",
    // The Stack Studio build has no public URL yet; set STACK_STUDIO_DIST to capture on another machine.
    dir: process.env.STACK_STUDIO_DIST ?? `${DV200}/Stack-Studio/dist`,
    label: "Stack Studio",
    redact: ["Centurion"],
    stops: [0, 1.2],
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
];
