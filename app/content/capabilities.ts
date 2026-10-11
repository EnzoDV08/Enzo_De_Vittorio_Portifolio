/*
 * The What I do panels on the home page. Every tool named here is used in one of Enzo's
 * projects or in this site's own repo (Pipelines is this site's .github/workflows). Read only by
 * app/lib/content.server.ts, so it reaches the page as loader data, not in the JS bundle.
 */
export const capabilities = [
  {
    icon: "interfaces",
    title: "Interfaces",
    headline: "Screens people enjoy using.",
    body: "Websites, web apps, mobile apps and desktop builds that are fast, accessible and easy to keep running.",
    rows: [
      { label: "Web apps & sites", value: "React · TypeScript · Vite" },
      { label: "Mobile apps", value: "React Native · Expo" },
      { label: "Desktop", value: "Electron" },
      { label: "Styling", value: "Tailwind CSS" },
    ],
    tags: ["React", "React Native", "Electron", "Performance"],
  },
  {
    icon: "apis",
    title: "APIs & integrations",
    headline: "The parts you don't see.",
    body: "Services in Node.js and .NET, and the third-party APIs a product leans on, from AI models and text-to-speech to email and analytics.",
    rows: [
      { label: "Services", value: "Node.js · .NET / C#" },
      { label: "AI", value: "OpenAI API" },
      { label: "Voice", value: "ElevenLabs text-to-speech" },
      { label: "Email & analytics", value: "EmailJS · Firebase Analytics" },
      { label: "API docs", value: "Swagger" },
      { label: "Validation", value: "Zod" },
    ],
    tags: ["Node.js", ".NET / C#", "OpenAI API", "ElevenLabs"],
  },
  {
    icon: "data",
    title: "Data",
    headline: "Data that stays correct.",
    body: "Data models, queries and access rules across SQL and NoSQL, so the data stays correct, fast to reach and locked down.",
    rows: [
      { label: "Relational", value: "PostgreSQL · MySQL · MSSQL" },
      { label: "Document", value: "MongoDB · Firestore" },
      { label: "Access", value: "Firestore security rules" },
      { label: "Tooling", value: "pgAdmin 4" },
    ],
    tags: ["PostgreSQL", "MySQL", "MongoDB", "Firestore"],
  },
  {
    icon: "pipelines",
    title: "Pipelines",
    headline: "Every change, checked and shipped.",
    body: "CI/CD with GitHub Actions: every change type-checked, linted and built, a preview for every pull request, and deploys on merge.",
    rows: [
      { label: "Pull request", value: "Checks, then a preview deploy" },
      { label: "Merge to main", value: "Checks, then a live deploy" },
      { label: "Testing", value: "Unit testing" },
      { label: "Version control", value: "Git · GitHub" },
    ],
    tags: ["GitHub Actions", "CI/CD", "Firebase Hosting", "Unit testing"],
    /** The steps in this site's .github/workflows, in order. */
    steps: ["npm ci", "Type-check", "Lint", "Build", "Deploy to Firebase Hosting"],
  },
  {
    icon: "design",
    title: "Design",
    headline: "Research first, then the pixels.",
    body: "Research-led UX, from interviews and prototypes to the design system that holds it together.",
    rows: [
      { label: "Research", value: "Interviews · usability testing" },
      { label: "Prototyping", value: "Figma" },
      { label: "Systems", value: "Design systems · service blueprints" },
      { label: "Visual", value: "Photoshop · InDesign" },
    ],
    tags: ["UX research", "Prototyping", "Design systems"],
  },
  {
    icon: "direct",
    title: "Direct",
    headline: "Stories where motion carries the message.",
    body: "Campaign sites and scroll-driven interactive stories, directed scene by scene.",
    rows: [
      { label: "Interactive stories", value: "GSAP ScrollTrigger · Canvas API" },
      { label: "Campaign sites", value: "Leke Lente Lingo, Pendoring finalist" },
      { label: "Motion", value: "GSAP · Lenis · Three.js" },
    ],
    tags: ["Campaigns", "Interactive storytelling", "Motion"],
  },
];
