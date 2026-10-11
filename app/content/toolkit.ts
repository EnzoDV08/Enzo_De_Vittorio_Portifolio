/*
 * What Enzo works with. Every item is used in at least one of his repos or project files
 * (see REDESIGN_NOTES.md → "Toolkit evidence"). No skill levels: they'd be invented.
 * `logo` is a file in public/logos (simple-icons, CC0, or devicon, MIT); items without one
 * show a monogram tile.
 */
export type Tool = { name: string; logo?: string; monogram?: string };
export type ToolGroup = { group: string; blurb: string; items: Tool[] };

/** Programming and markup languages — shown big on About. */
export const languages: Tool[] = [
  { name: "TypeScript", logo: "typescript" },
  { name: "JavaScript", logo: "javascript" },
  { name: "C#", logo: "csharp" },
  { name: "PHP", logo: "php" },
  { name: "SQL", logo: "mysql" },
  { name: "HTML", logo: "html5" },
  { name: "CSS", logo: "css3" },
];

export const toolkit: ToolGroup[] = [
  {
    group: "Frameworks",
    blurb: "Front ends, apps and the odd desktop build.",
    items: [
      { name: "React", logo: "react" },
      { name: "React Native", logo: "react" },
      { name: "Expo", logo: "expo" },
      { name: "Vite", logo: "vite" },
      { name: "Astro", logo: "astro" },
      { name: "Vue", logo: "vuedotjs" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
      { name: ".NET", logo: "dotnet" },
      { name: "Node.js", logo: "nodedotjs" },
      { name: "Electron", logo: "electron" },
    ],
  },
  {
    group: "Backend & data",
    blurb: "Auth, databases, hosting and forms that close the loop.",
    items: [
      { name: "Firebase", logo: "firebase" },
      { name: "Firestore", logo: "firebase" },
      { name: "PostgreSQL", logo: "postgresql" },
      { name: "MySQL", logo: "mysql" },
      { name: "MSSQL", logo: "mssql" },
      { name: "MongoDB", logo: "mongodb" },
      { name: "EmailJS", monogram: "@" },
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
      { name: "Canvas API", monogram: "Cv" },
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
    blurb: "Characters that talk back.",
    items: [
      { name: "OpenAI API", logo: "openai" },
      { name: "ElevenLabs", logo: "elevenlabs" },
    ],
  },
  {
    group: "Workflow",
    blurb: "How it ships.",
    items: [
      { name: "Git", logo: "git" },
      { name: "GitHub", logo: "github" },
    ],
  },
];

/** Every tool with a logo, once — for the home page logo strip. */
export const logoWall: Tool[] = [...languages, ...toolkit.flatMap((g) => g.items)].filter(
  (tool, i, all) => tool.logo && all.findIndex((t) => t.logo === tool.logo) === i,
);

export const offScreen = ["Rock climbing", "Cooking", "Road trips", "Cinema", "Music", "Gaming"];

const aliases: Record<string, string> = {
  "vanilla js": "JavaScript",
  tailwind: "Tailwind CSS",
  daisyui: "Tailwind CSS",
  html: "HTML",
  css: "CSS",
};

/**
 * The tool behind a stack entry ("GSAP ScrollTrigger" → GSAP, "Firebase Hosting" → Firebase),
 * so case studies can show the right mark. Unknown entries come back as a plain tool.
 */
export function toolFor(entry: string): Tool {
  const all = [...languages, ...toolkit.flatMap((g) => g.items)];
  const key = entry.toLowerCase();
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
