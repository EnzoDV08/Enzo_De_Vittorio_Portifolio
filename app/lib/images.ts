/**
 * Every image under app/assets is turned into AVIF + WebP at four widths by vite-imagetools.
 * Content files refer to images by path relative to app/assets, e.g. "projects/sportify/cover.jpg".
 */
export type Picture = {
  /** format → srcset */
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
};

const pictures = import.meta.glob<Picture>("../assets/**/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
  query: { w: "480;960;1440;1920", format: "avif;webp", as: "picture" },
});

const byKey = new Map<string, Picture>(
  Object.entries(pictures).map(([file, picture]) => [file.replace("../assets/", ""), picture]),
);

/** Look up a processed image. Returns undefined when the file hasn't been added yet. */
export function getPicture(key: string | undefined): Picture | undefined {
  return key ? byKey.get(key) : undefined;
}
