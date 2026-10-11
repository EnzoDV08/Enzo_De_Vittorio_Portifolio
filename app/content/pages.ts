/** Page copy. Components read from here; they never hard-code what visitors read. */

export const nav = [
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export const navCta = "Let's talk";

export const home = {
  meta: {
    title: "Enzo De Vittorio — Developer & UX Designer",
    description:
      "Enzo De Vittorio designs and builds websites and interactive stories that are built to be felt — function first, then the feeling. Developer, UX designer and co-founder of Stack Studio.",
  },
  hero: {
    eyebrow: "Enzo De Vittorio — Developer & UX Designer",
    // The headline, split so the last word takes the italic accent.
    lead: "I design & build websites you can",
    accent: "feel.",
    intro:
      "Interactive stories, campaigns and production sites — researched like a UX designer, engineered like a developer, and finished with motion.",
    primary: "See the work",
    secondary: "About me",
    reelLink: "Open the case study for",
    reelShow: "Show",
    reelPlay: "Play the showreel",
    reelPause: "Pause the showreel",
  },
  proof: {
    label: "At a glance",
    caseStudies: "In-depth case studies",
    projects: "Projects on this site",
    award: "Pendoring Finalist",
    awardDetail: "Leke Lente Lingo, 2026",
    studio: "Co-founded",
    studioDetail: "Stack Studio",
  },
  work: {
    label: "Selected work",
    intro: "Six projects, each with the device it lives on. Open one for the full story.",
    allWork: "All work",
    view: "View case study",
  },
  whatIDo: {
    label: "What I do",
    heading: "One person,",
    accent: "the whole stack.",
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
  tools: {
    label: "Toolkit",
    heading: "The languages and tools",
    accent: "I ship with.",
    cta: "Full toolkit",
  },
  howIWork: { label: "How I work" },
  studio: {
    label: "Now",
    line: "Co-founder of Stack Studio — a two-person studio building brand-led, cinematic websites with Armand Naudé.",
    cta: "Read the studio case study",
  },
};

export const contactCta = {
  eyebrow: "Got a project, a role or an idea?",
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
  featuredLabel: "Case studies",
  moreLabel: "More work",
  earlierLabel: "Earlier work",
  earlierIntro: "Where it started — student builds and prototypes, grouped by year.",
  yearFilterLabel: "Filter earlier work by year",
  allYears: "All years",
  unknownYear: "Undated",
  yearTbc: "Year TBC",
  inProgress: "In progress",
  empty: "Nothing in this discipline yet.",
  shown: "projects shown",
  caseStudy: "Case study",
};

export const caseStudy = {
  meta: { role: "Role", year: "Year", context: "Context", client: "Client", stack: "Stack" },
  links: { live: "Live site", code: "Code", prototype: "Prototype" },
  devices: "The project on desktop and mobile",
  desktop: "Desktop",
  mobile: "Mobile",
  scrollHint: "Scroll to open",
  challenge: "The challenge",
  approach: "The approach",
  gallery: "Screens",
  galleryHint: "Scroll",
  highlights: "Highlights",
  stack: "Built with",
  outcome: "Outcome",
  credits: "Credits",
  next: "Next project",
};

export const about = {
  meta: {
    title: "About — Enzo De Vittorio",
    description:
      "Developer who designs. Software Development and UX Design at Open Window Institute, PGDip in Creative Practice, co-founder of Stack Studio. Languages, tools and experience.",
  },
  heading: "A developer",
  accent: "who designs.",
  portraitAlt: "Portrait of Enzo De Vittorio",
  bio: [
    "I'm Enzo — a developer who designs. I studied Software Development and UX Design as a double major at Open Window Institute, and I'm finishing a PGDip in Creative Practice focused on interactive development.",
    "With Armand Naudé I run Stack Studio, a two-person studio building brand-led, cinematic websites.",
    "I build things to be felt: function first, then the feeling — accessible on every device, and never designed to trick.",
  ],
  quick: [
    { label: "Studying", value: "PGDip Creative Practice" },
    { label: "Running", value: "Stack Studio" },
    { label: "Open to", value: "Freelance & graduate roles" },
  ],
  languages: "Languages",
  languagesIntro: "What I write every week.",
  toolkit: "Tools & frameworks",
  toolkitIntro: "Every one of these is in a project on this site or in my repos.",
  experience: "Experience",
  education: "Education",
  recognition: "Recognition",
  offScreen: "Off-screen",
  cv: "Download CV",
  work: "See the work",
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
