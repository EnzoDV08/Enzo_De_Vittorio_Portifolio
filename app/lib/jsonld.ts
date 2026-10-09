import { education } from "~/content/education";
import { site } from "~/content/site";
import { isTodo, real } from "~/content/todo";
import type { Project } from "~/content/types";
import { absoluteUrl } from "./seo";

const realValues = (values: readonly string[]) => values.filter((v) => !isTodo(v));

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: site.descriptor,
    ...(isTodo(site.email) ? {} : { email: `mailto:${site.email}` }),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Centurion",
      addressRegion: "Gauteng",
      addressCountry: "ZA",
    },
    sameAs: realValues(Object.values(site.socials)),
    alumniOf: {
      "@type": "EducationalOrganization",
      name: education[0]?.org ?? site.education.institution,
      url: site.education.url,
    },
    worksFor: {
      "@type": "Organization",
      name: site.studio.name,
      legalName: site.studio.legalName,
      ...(isTodo(site.studio.url) ? {} : { url: site.studio.url }),
    },
  };
}

export function creativeWorkJsonLd(project: Project) {
  const live = real(project.links.live);
  const year = real(project.year);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.tagline,
    description: project.caseStudy && real(project.caseStudy.challenge),
    url: absoluteUrl(`/work/${project.slug}`),
    ...(year ? { dateCreated: String(year) } : {}),
    ...(live ? { sameAs: live } : {}),
    image: absoluteUrl(`/og/${project.slug}.jpg`),
    keywords: [...project.disciplines, ...project.stack].join(", "),
    creator: { "@type": "Person", name: site.name, url: site.url },
    ...(Array.isArray(project.team)
      ? {
          contributor: project.team
            .filter((m) => m.name !== site.name)
            .map((m) => ({ "@type": "Person", name: m.name })),
        }
      : {}),
  };
}
