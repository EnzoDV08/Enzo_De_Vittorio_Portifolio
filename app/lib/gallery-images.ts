import { toMap, type Picture } from "./images";

// Same query as images.ts (import.meta.glob options must be literals).
const pictures = import.meta.glob<Picture>(
  ["../assets/projects/*/*.{jpg,jpeg,png}", "!../assets/projects/*/cover.*"],
  {
    eager: true,
    import: "default",
    query: { w: "480;960;1440;1920", format: "avif;webp", as: "picture" },
  },
);

const byKey = toMap(pictures);

/** Look up a case-study gallery image. */
export function getGalleryPicture(key: string): Picture | undefined {
  return byKey.get(key);
}
