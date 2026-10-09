/** Page copy. Components read from here; they never hard-code what visitors read. */

export const nav = [
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export const home = {
  meta: {
    title: "Enzo De Vittorio — Developer & UX Designer",
    description:
      "Enzo De Vittorio designs and engineers immersive web experiences — function first, then the feeling. Developer, UX designer and co-founder of Stack Studio in Centurion, South Africa.",
  },
  hero: {
    // The display line, split so the last word can take the serif accent.
    lead: "Built to be",
    accent: "felt.",
    intro: "I design and engineer immersive web experiences — function first, then the feeling.",
    primary: "View work",
    secondary: "Download CV",
    scrollCue: "Scroll",
  },
  work: { label: "Selected work", allWork: "All work" },
  recognitionLabel: "Recognition",
  whatIDo: {
    label: "What I do",
    columns: [
      {
        title: "Build",
        body: "Front-end and full-stack builds that are fast, smooth and easy to keep running.",
        tags: ["Front-end", "Full-stack", "Firebase", "Performance"],
      },
      {
        title: "Design",
        body: "Research-led UX — from interviews and prototypes to the design system that holds it together.",
        tags: ["UX research", "Prototyping", "Design systems"],
      },
      {
        title: "Direct",
        body: "Campaigns and interactive stories where motion carries the message.",
        tags: ["Campaigns", "Interactive storytelling", "Motion"],
      },
    ],
  },
  howIWork: { label: "How I work" },
  studio: {
    label: "Stack Studio",
    line: "Co-founder of Stack Studio — a two-person studio building brand-led, cinematic websites.",
    withPartner: "With Armand Naudé, from Centurion.",
    cta: "Visit Stack Studio",
  },
};

export const contactCta = {
  heading: "Let's build",
  accent: "something.",
  copy: "Copy email",
  copied: "Copied",
  write: "Write to me",
};

export const work = {
  meta: {
    title: "Work — Enzo De Vittorio",
    description:
      "Selected and earlier work by Enzo De Vittorio: interactive storytelling, campaigns, UX and production web development.",
  },
  heading: "Work",
  intro: "Interactive stories, campaigns, UX and production builds — newest first.",
  filterLabel: "Filter by discipline",
  all: "All",
  featuredLabel: "Selected",
  moreLabel: "More work",
  earlierLabel: "Earlier work",
  earlierIntro: "Where it started — student builds and prototypes, grouped by year.",
  yearFilterLabel: "Filter earlier work by year",
  allYears: "All years",
  unknownYear: "Year to confirm",
  yearTbc: "Year TBC",
  inProgress: "In progress",
  empty: "Nothing in this discipline yet.",
  shown: "projects shown",
  caseStudy: "Case study",
};

export const caseStudy = {
  meta: { role: "Role", year: "Year", context: "Context", client: "Client", stack: "Stack" },
  links: { live: "Live site", code: "Code", prototype: "Prototype" },
  challenge: "Challenge",
  approach: "Approach",
  gallery: "Gallery",
  galleryHint: "Scroll",
  highlights: "Highlights",
  outcome: "Outcome",
  credits: "Credits",
  next: "Next project",
};

export const about = {
  meta: {
    title: "About — Enzo De Vittorio",
    description:
      "Developer who designs. Software Development and UX Design at Open Window Institute, PGDip in Creative Practice, co-founder of Stack Studio.",
  },
  heading: "A developer",
  accent: "who designs.",
  portraitAlt: "Portrait of Enzo De Vittorio",
  bio: [
    "I'm Enzo — a developer who designs. I studied Software Development and UX Design as a double major at Open Window Institute in Pretoria, and I'm finishing a PGDip in Creative Practice focused on interactive development.",
    "With Armand Naudé I run Stack Studio, a two-person studio in Centurion building brand-led, cinematic websites.",
    "I build things to be felt: function first, then the feeling — accessible on every device, and never designed to trick.",
  ],
  experience: "Experience",
  education: "Education",
  recognition: "Recognition",
  toolkit: "Toolkit",
  offScreen: "Off-screen",
  cv: "Download CV",
};

export const contact = {
  meta: {
    title: "Contact — Enzo De Vittorio",
    description:
      "Get in touch with Enzo De Vittorio about freelance projects, graduate roles or collaborations.",
  },
  heading: "Say",
  accent: "hello.",
  intro: "Freelance project, job opportunity or collaboration — email is fastest.",
  socialsLabel: "Elsewhere",
  form: {
    label: "Or send a message",
    name: "Name",
    email: "Email",
    topic: "I'm reaching out about",
    topics: ["Freelance project", "Job opportunity", "Collaboration", "Other"],
    message: "Message",
    honeypot: "Leave this field empty",
    submit: "Send message",
    sending: "Sending…",
    success: "Thanks — your message is on its way.",
    failure: "Something went wrong sending that. Please email me directly instead.",
    errors: {
      name: "Please tell me your name.",
      email: "Please enter a valid email address.",
      message: "Please write a short message (at least 10 characters).",
    },
  },
};

export const notFound = {
  meta: { title: "Not found — Enzo De Vittorio", description: "This page doesn't exist." },
  heading: "Lost in the",
  accent: "scroll.",
  copy: "That page doesn't exist — or it moved. Here's some work instead.",
  home: "Back home",
};

export const ui = {
  skip: "Skip to content",
  menu: "Menu",
  close: "Close",
  home: "Home",
  newTab: "(opens in a new tab)",
  view: "View",
  footer: { built: "Designed & built by Enzo De Vittorio", top: "Back to top" },
  todo: "To come",
  error: "Something broke.",
};
