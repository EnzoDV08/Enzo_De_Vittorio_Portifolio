/**
 * Every image under app/assets becomes AVIF + WebP at four widths (vite-imagetools).
 * Content refers to images by path relative to app/assets, e.g. "projects/sportify/cover.jpg".
 *
 * Covers and the portrait are needed on most pages and live here. Case-study gallery images
 * live in ./gallery-images so their metadata only ships with case-study pages.
 */
import { getPlaceholder } from "./placeholders";

export type Picture = {
  /** format → srcset */
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
  /** Tiny inline preview shown until the image loads (photos only, see ./placeholders). */
  placeholder?: string;
};

const pictures = import.meta.glob<Picture>(
  [
    "../assets/projects/*/cover.{jpg,jpeg,png}",
    "../assets/projects/*/{mark,wordmark}.{jpg,jpeg,png}",
    "../assets/about/*.{jpg,jpeg,png}",
    "../assets/home/*.{jpg,jpeg,png}",
  ],
  {
    eager: true,
    import: "default",
    query: { w: "480;960;1440;1920", format: "avif;webp", as: "picture" },
  },
);

export function toMap(modules: Record<string, Picture>) {
  return new Map(
    Object.entries(modules).map(([file, p]) => {
      const key = file.replace("../assets/", "");
      const placeholder = getPlaceholder(key);
      return [key, placeholder ? { ...p, placeholder } : p];
    }),
  );
}

const byKey = toMap(pictures);

/** Look up a cover or portrait. Undefined when the file hasn't been added yet. */
export function getPicture(key: string | undefined): Picture | undefined {
  return key ? byKey.get(key) : undefined;
}
