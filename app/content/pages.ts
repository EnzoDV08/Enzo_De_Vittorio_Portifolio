/** Page copy. Components read from here; they never hard-code what visitors read. */

export const nav = [
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export const navCta = "Let's talk";

export const home = {
  meta: {
    title: "Enzo De Vittorio, Developer & UX Designer",
    description:
      "Enzo De Vittorio is a full-stack developer and UX designer: interfaces for web, mobile and desktop, the APIs and databases behind them, and the pipelines that ship them. Co-founder of Stack Studio.",
  },
  hero: {
    eyebrow: "Full-stack Developer · UX Designer",
    // The headline, split so the last phrase takes the italic accent.
    lead: "Looks good.",
    accent: "Works well.",
    intro:
      "I'm Enzo De Vittorio. I design and build websites and apps, from what people see to the systems behind them.",
    primary: "See the work",
    secondary: "About me",
    /** Cut-out portrait standing behind the headline (decorative: the name is in the copy). */
    portrait: "about/Enzo Transparent.png",
  },
  proof: {
    label: "At a glance",
    caseStudies: "In-depth case studies",
    projects: "Projects on this site",
    award: "Pendoring Finalist",
    awardDetail: "Leke Lente Lingo, 2026",
    awardLogo: "logos/pendoring.png",
    studio: "Co-founded",
    studioDetail: "Stack Studio",
    studioLogo: "projects/stack-studio/mark.png",
  },
  work: {
    label: "Selected work",
    intro: "Selected projects, each on the devices it lives on. Open one for the full story.",
    allWork: "All work",
    view: "View case study",
    keys: "Left and right arrow keys show the other projects.",
  },
  whatIDo: {
    label: "What I do",
    heading: "From idea,",
    accent: "to launch.",
    intro: "Six parts of a product, front to back. Open one to see what goes into it.",
    practice: "In practice",
    pipelineLabel: "This site's pipeline",
  },
  tools: {
    label: "Toolkit",
    heading: "The languages and tools",
    accent: "I ship with.",
    cta: "Full toolkit",
  },
  howIWork: { label: "How I work", heading: "Four rules I build", accent: "every project by." },
  studio: {
    label: "Now",
    line: "Co-founder of Stack Studio, a two-person studio building brand-led, cinematic websites with Armand Naudé.",
    cta: "Read the studio case study",
  },
  /** The bento under How I work: a quick intro, every card leads to /about. */
  intro: {
    tab: "About me",
    heading: "Quick intro",
    greeting: "I'm",
    projects: "Projects",
    tools: "Tools I work with",
    award: "Pendoring Finalist",
    awardDetail: "Leke Lente Lingo, 2026",
    awardLogo: "logos/pendoring.png",
    studio: "Co-founded",
    studioDetail: "Stack Studio",
    studioLogo: "projects/stack-studio/mark.png",
    /** Encoded by `npm run videos` (EXTRAS in scripts/optimize-videos.mjs). */
    video: "stack-studio-promo",
    videoLabel: "Stack Studio promo",
    /** Runs round the spinning badge. */
    badge: "Developer · Designer · Portfolio 2026 · ",
    cta: "More about me",
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
    title: "Work, Enzo De Vittorio",
    description:
      "Selected and earlier work by Enzo De Vittorio: interactive storytelling, campaigns, UX and production web development.",
  },
  heading: "Work",
  intro: "Interactive stories, campaigns, UX and production builds, newest first.",
  filterLabel: "Filter by discipline",
  all: "All",
  featuredLabel: "Case studies",
  moreLabel: "More work",
  earlierLabel: "Earlier work",
  earlierIntro: "Where it started, student builds and prototypes, grouped by year.",
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
  screen: "The live site",
  /** After the project title, as the screen capture's alt text. */
  screenAlt: "the top of the site in a browser window",
  challenge: "The challenge",
  approach: "The approach",
  gallery: "Screens",
  galleryHint: "Scroll",
  highlights: "Highlights",
  stack: "Built with",
  credits: "Credits",
  next: "Next project",
};

export const about = {
  meta: {
    title: "About, Enzo De Vittorio",
    description:
      "Full-stack developer and UX designer. Open Window Institute graduate, Class of 2025, with a PGDip in Creative Practice (Interactive Development) completed in 2026.",
  },
  heading: "A developer",
  accent: "who designs.",
  portrait: {
    src: "about/E + I-115.jpg",
    alt: "Enzo seated outdoors in tall grass, resting a hand on his chin",
  },
  bio: [
    "I'm Enzo, a developer who designs. I graduated in 2025 from Open Window Institute, where I studied User Experience Design and Interactive Development. I completed my PGDip in Creative Practice, focused on Interactive Development, in 2026.",
    "I work across the whole stack: interfaces for web, mobile and desktop, the APIs and integrations behind them, the databases that hold the data, and the CI/CD pipelines that test and ship it.",
    "I build things to be felt: function first, then the feeling. Accessible on every device, and honest, with no dark patterns or tricks to keep people clicking.",
  ],
  quick: [
    { label: "PGDip", value: "Completed 2026" },
    { label: "Running", value: "Stack Studio" },
  ],
  coreStack: "Website stack",
  coreStackIntro: "My go-to tools for building websites.",
  coreStackDescription: "From the interface and build tools to services and databases.",
  toolkit: "Beyond websites",
  toolkitIntro:
    "Other tools I've mastered for mobile apps, desktop software and interactive experiences.",
  experience: "My experiences",
  education: "My qualifications",
  recognition: "Recognition",
  offScreen: "Off-screen",
  cv: "Download CV",
  work: "See the work",
};

export const contact = {
  meta: {
    title: "Contact, Enzo De Vittorio",
    description:
      "Get in touch with Enzo De Vittorio by email, WhatsApp or message, about a project, a role or a collaboration.",
  },
  heading: "Say",
  accent: "hello.",
  eyebrow: "Contact",
  intro: "Email, WhatsApp or the form below, whichever is easiest. Tell me what you're working on.",
  socialsLabel: "Elsewhere",
  email: { label: "Email", write: "Write an email" },
  whatsapp: {
    label: "WhatsApp",
    chat: "Chat on WhatsApp",
    /** Pre-filled in the chat, so the first message has context. */
    message: "Hi Enzo, I found you through your portfolio.",
  },
  elsewhere: { label: "Elsewhere", cv: "Download CV" },
  form: {
    label: "Or send a message",
    name: "Name",
    email: "Email",
    topic: "I'm reaching out about",
    topics: ["A project", "A job opportunity", "A collaboration", "Something else"],
    message: "Message",
    honeypot: "Leave this field empty",
    submit: "Send message",
    sending: "Sending…",
    success: "Thanks, your message is on its way.",
    failure: "Something went wrong sending that. Please email me directly instead.",
    errors: {
      name: "Please tell me your name.",
      email: "Please enter a valid email address.",
      message: "Please write a short message (at least 10 characters).",
    },
  },
};

export const notFound = {
  meta: { title: "Not found, Enzo De Vittorio", description: "This page doesn't exist." },
  heading: "Lost in the",
  accent: "scroll.",
  copy: "That page doesn't exist, or it moved. Here's some work instead.",
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
