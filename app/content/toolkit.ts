/*
 * What Enzo works with. Every item is used in at least one of his repos or project files
 * (see REDESIGN_NOTES.md → "Toolkit evidence"). No skill levels: they'd be invented.
 * `logo` is a file in public/logos (simple-icons, CC0, or devicon, MIT); items without one
 * show a monogram tile.
 */
export type Tool = { name: string; logo?: string; monogram?: string };
export type ToolGroup = { group: string; blurb: string; items: Tool[] };

/** Programming and markup languages used to identify case-study stack entries. */
export const languages: Tool[] = [
  { name: "TypeScript", logo: "typescript" },
  { name: "JavaScript", logo: "javascript" },
  { name: "C#", logo: "csharp" },
  { name: "PHP", logo: "php" },
  { name: "SQL", logo: "mysql" },
  { name: "HTML", logo: "html5" },
  { name: "CSS", logo: "css3" },
];

/** The website stack Enzo reaches for most, from front end through data. */
export const coreStack: (Tool & { detail: string })[] = [
  { name: "React", logo: "react", detail: "Interactive interfaces" },
  { name: "TypeScript", logo: "typescript", detail: "Typed code throughout" },
  { name: "Vite", logo: "vite", detail: "Fast builds and previews" },
  { name: "Tailwind CSS", logo: "tailwindcss", detail: "Responsive design systems" },
  { name: "Node.js", logo: "nodedotjs", detail: "APIs and services" },
  { name: "Firebase", logo: "firebase", detail: "Auth and deployment" },
  { name: "Firestore", logo: "firebase", detail: "Real-time app data" },
  { name: "PostgreSQL", logo: "postgresql", detail: "Structured SQL data" },
];

export const toolkit: ToolGroup[] = [
  {
    group: "Apps & frameworks",
    blurb: "Mobile apps, desktop software and other web frameworks.",
    items: [
      { name: "React Native", logo: "react" },
      { name: "Expo", logo: "expo" },
      { name: "Flutter", monogram: "Fl" },
      { name: "Astro", logo: "astro" },
      { name: "Vue", logo: "vuedotjs" },
      { name: "Bootstrap", logo: "bootstrap" },
      { name: "C#", logo: "csharp" },
      { name: ".NET", logo: "dotnet" },
      { name: "Electron", logo: "electron" },
    ],
  },
  {
    group: "Backend & data",
    blurb: "More data stores, API tools and validation for different projects.",
    items: [
      { name: "pgAdmin 4", logo: "postgresql" },
      { name: "MySQL", logo: "mysql" },
      { name: "MSSQL", logo: "mssql" },
      { name: "MongoDB", logo: "mongodb" },
      { name: "EmailJS", monogram: "@" },
      { name: "Swagger", logo: "swagger" },
      { name: "Zod", logo: "zod" },
    ],
  },
  {
    group: "Motion & 3D",
    blurb: "Scroll-driven stories and things you can turn around.",
    items: [
      { name: "GSAP", logo: "gsap" },
      { name: "ScrollTrigger", logo: "gsap" },
      { name: "Lenis", monogram: "Le" },
      { name: "Three.js", logo: "threedotjs" },
      { name: "Canvas API", logo: "html5" },
    ],
  },
  {
    group: "Design",
    blurb: "Research first, then the pixels.",
    items: [
      { name: "Figma", logo: "figma" },
      { name: "Photoshop", monogram: "Ps" },
      { name: "InDesign", monogram: "Id" },
      { name: "Prototyping" },
      { name: "Usability testing" },
      { name: "Service blueprints" },
    ],
  },
  {
    group: "AI & audio",
    blurb: "Models, assistants and voices for interactive apps.",
    items: [
      { name: "OpenAI API", logo: "openai" },
      { name: "Claude AI", monogram: "Cl" },
      { name: "Hugging Face", monogram: "HF" },
      { name: "ElevenLabs", logo: "elevenlabs" },
    ],
  },
  {
    group: "Pipelines & workflow",
    blurb: "How it's checked, built and shipped.",
    items: [
      { name: "Git", logo: "git" },
      { name: "GitHub", logo: "github" },
      { name: "GitHub Actions", monogram: "GA" },
      { name: "CI/CD pipelines", monogram: "CI" },
      { name: "Unit testing", monogram: "✓" },
    ],
  },
];

/** Every tool with a logo, once, for the home page logo strip. */
export const logoWall: Tool[] = [
  ...languages,
  ...coreStack,
  ...toolkit.flatMap((g) => g.items),
].filter((tool, i, all) => tool.logo && all.findIndex((t) => t.logo === tool.logo) === i);

export const offScreen = ["Rock climbing", "Cooking", "Road trips", "Cinema", "Music", "Gaming"];

const aliases: Record<string, string> = {
  "vanilla js": "JavaScript",
  tailwind: "Tailwind CSS",
  daisyui: "Tailwind CSS",
  html: "HTML",
  css: "CSS",
  "openai gpt-4o-mini": "OpenAI API",
};

/**
 * The tool behind a stack entry ("GSAP ScrollTrigger" → GSAP, "Firebase Hosting" → Firebase),
 * so case studies can show the right mark. Unknown entries come back as a plain tool.
 */
export function toolFor(entry: string): Tool {
  const all = [...languages, ...coreStack, ...toolkit.flatMap((g) => g.items)];
  const key = entry.toLowerCase();
  // An exact name keeps its monogram when it has no logo (Lenis, EmailJS).
  const exact = all.find((t) => t.name.toLowerCase() === key);
  if (exact) return exact;
  const alias = aliases[key];
  if (alias) {
    const tool = all.find((t) => t.name === alias);
    if (tool) return { ...tool, name: entry };
  }
  const match = all
    .filter((t) => t.logo && key.includes(t.name.toLowerCase()))
    .sort((a, b) => b.name.length - a.name.length)[0];
  return match ? { name: entry, logo: match.logo } : { name: entry };
}
