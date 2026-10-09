import type { MetaDescriptor } from "react-router";
import { site } from "~/content/site";

type PageMeta = {
  title: string;
  description: string;
  /** Path without trailing slash, e.g. "/work". */
  path: string;
  /** Path to a 1200×630 image under /og. */
  image?: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  jsonLd?: object | object[];
};

export const absoluteUrl = (path: string) => `${site.url}${path === "/" ? "" : path}`;

/** Title, description, canonical, Open Graph, Twitter card and optional JSON-LD for a route. */
export function pageMeta({
  title,
  description,
  path,
  image = "/og/default.png",
  type = "website",
  noindex = false,
  jsonLd,
}: PageMeta): MetaDescriptor[] {
  const url = absoluteUrl(path);
  const img = `${site.url}${image}`;
  const meta: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: site.name },
    { property: "og:locale", content: "en_ZA" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: img },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: img },
  ];
  if (noindex) meta.push({ name: "robots", content: "noindex" });
  if (jsonLd) meta.push({ "script:ld+json": jsonLd });
  return meta;
}
