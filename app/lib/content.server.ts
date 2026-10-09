// Server-only (build-time) bridge between app/content and the routes. Route loaders call these
// during prerendering; the results are embedded in each page's HTML. Because this is a
// .server module, React Router guarantees none of it — the content files, the image
// registries — ever ships in the browser bundle.
import {
  caseStudies,
  earlierProjects,
  featuredProjects,
  getProject,
  moreProjects,
  nextCaseStudy,
} from "~/content/projects";
import type { Project } from "~/content/types";
import { getGalleryPicture } from "./gallery-images";
import { getPicture } from "./images";
import type { ProjectDetail, ProjectSummary } from "./project";

export function toSummary(p: Project): ProjectSummary {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- dropping heavy fields on purpose
  const { caseStudy, gallery, team, client, context, role, ...rest } = p;
  return { ...rest, hasCaseStudy: Boolean(caseStudy), picture: getPicture(p.cover) };
}

function toDetail(p: Project): ProjectDetail {
  return {
    ...p,
    picture: getPicture(p.cover),
    gallery: p.gallery?.map((image) => ({ ...image, picture: getGalleryPicture(image.src) })),
  };
}

export const featuredSummaries = () => featuredProjects.map(toSummary);

export function workSummaries() {
  return {
    featured: featuredProjects.map(toSummary),
    more: moreProjects.map(toSummary),
    earlier: earlierProjects.map(toSummary),
  };
}

export function caseStudyData(slug: string | undefined) {
  const project = getProject(slug);
  if (!project?.caseStudy) return null;
  return { project: toDetail(project), next: toSummary(nextCaseStudy(project.slug)) };
}

export const caseStudySlugs = () => caseStudies.map((p) => p.slug);

export const portrait = () => getPicture("about/portrait.jpg");
