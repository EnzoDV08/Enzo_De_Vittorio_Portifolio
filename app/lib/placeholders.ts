/**
 * Blur-up previews: every photo as a ~24px WebP, inlined as a data URL (a few hundred bytes).
 * ResponsiveImage paints it behind the <img>, so a photo shows as a soft preview the moment the
 * HTML arrives instead of an empty box, then sharpens when the real AVIF/WebP has loaded.
 *
 * Opaque photos only (JPEGs): a preview behind a transparent PNG or a contained logo would
 * stay visible around it. Openwindow.jpg is a logo, so it is left out on purpose.
 * Server-only, like the other image registries: read through lib/content.server.ts.
 */
const previews = import.meta.glob<string>(
  [
    "../assets/projects/*/*.{jpg,jpeg}",
    "../assets/about/*.{jpg,jpeg}",
    "../assets/home/*.{jpg,jpeg}",
    "../assets/Hackathon/*.{jpg,jpeg}",
  ],
  {
    eager: true,
    import: "default",
    query: { w: "24", format: "webp", quality: "45", inline: "" },
  },
);

const byKey = new Map(
  Object.entries(previews).map(([file, url]) => [file.replace("../assets/", ""), url]),
);

/** The inline preview for an asset key, e.g. "projects/sportify/cover.jpg". */
export function getPlaceholder(key: string): string | undefined {
  return byKey.get(key);
}
