// Server-only (build-time) bridge between app/content and the routes. Route loaders call these
// during prerendering; the results are embedded in each page's HTML. Because this is a
// .server module, React Router guarantees none of it, the content files, the image
// registries, ever ships in the browser bundle.
import {
  caseStudies,
  earlierProjects,
  featuredProjects,
  getProject,
  moreProjects,
  nextCaseStudy,
} from "~/content/projects";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { capabilities } from "~/content/capabilities";
import { heroPortrait as heroPortraitEntry, heroWall as heroWallEntries } from "~/content/hero-wall";
import { about } from "~/content/pages";
import { principles } from "~/content/principles";
import type { Project } from "~/content/types";
import { deviceSpecs, type DeviceKind, type DeviceSequence, type Devices } from "./devices";
import { getGalleryPicture } from "./gallery-images";
import { getPicture } from "./images";
import { getRecognitionPicture } from "./recognition-images";
import type { ProjectDetail, ProjectSummary } from "./project";

const deviceAlt: Record<DeviceKind, (title: string) => string> = {
  laptop: (title) => `${title} open in a browser on a MacBook Pro`,
  phone: (title) => `${title} on an iPhone`,
};

/** The project's rendered device sequences, only the ones whose frames exist. */
function devicesFor(p: Project): Devices {
  const devices: Devices = {};
  for (const kind of Object.keys(deviceSpecs) as DeviceKind[]) {
    const spec = deviceSpecs[kind];
    const width = spec.widths[spec.widths.length - 1]!;
    const base = `/devices/${p.slug}/${kind}/`;
    const last = `frame-${String(spec.frames - 1).padStart(2, "0")}-${width}.webp`;
    if (!existsSync(join(process.cwd(), "public", base, last))) continue;
    const still = spec.still;
    const stillWidth = still?.widths[still.widths.length - 1];
    const hasStill =
      still &&
      stillWidth &&
      existsSync(join(process.cwd(), "public", base, `still-${stillWidth}.webp`));
    const sequence: DeviceSequence = {
      kind,
      frames: spec.frames,
      widths: spec.widths,
      width,
      height: Math.round(width / spec.aspect),
      base,
      alt: deviceAlt[kind](p.title),
      ...(hasStill
        ? {
            still: {
              widths: still.widths,
              width: stillWidth,
              height: Math.round(stillWidth / still.aspect),
            },
          }
        : {}),
    };
    devices[kind] = sequence;
  }
  return devices;
}

export function toSummary(p: Project): ProjectSummary {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- dropping heavy fields on purpose
  const { caseStudy, gallery, team, client, role, ...rest } = p;
  return {
    ...rest,
    hasCaseStudy: Boolean(caseStudy),
    picture: getPicture(p.cover),
    markPicture: getPicture(p.mark),
    wordmarkPicture: getPicture(p.wordmark),
    devices: devicesFor(p),
  };
}

function toDetail(p: Project): ProjectDetail {
  return {
    ...p,
    picture: getPicture(p.cover),
    markPicture: getPicture(p.mark),
    wordmarkPicture: getPicture(p.wordmark),
    devices: devicesFor(p),
    gallery: p.gallery?.map((image) => ({ ...image, picture: getGalleryPicture(image.src) })),
  };
}

export const featuredSummaries = () => featuredProjects.map(toSummary);

/** The home hero's wall of project screenshots, column by column. */
export const heroWall = () =>
  heroWallEntries.map((column) =>
    column.flatMap((key) => {
      const picture = getGalleryPicture(key);
      return picture ? [{ key, picture }] : [];
    }),
  );

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

export const portrait = () => ({ ...about.portrait, picture: getPicture(about.portrait.src) });

/** The How I work lines, sent as page data so the copy stays out of the JS bundle. */
export const principleLines = () => principles.map((p) => ({ ...p }));

/** The What I do panels. Pipelines also carries this site's CI steps. */
export const capabilityPanels = () =>
  capabilities.map((panel) => ({ ...panel, steps: panel.steps ?? null }));

/** Every panel's tags, for the marquee under What I do. */
export const capabilityTags = () => capabilities.flatMap((panel) => panel.tags);

export const heroPortrait = () => ({
  ...heroPortraitEntry,
  picture: getPicture(heroPortraitEntry.src),
});

/** Pictures by asset key: covers, gallery screens, portraits, logos or recognition photos. */
export function picturesFor(keys: string[]) {
  return Object.fromEntries(
    keys.map((key) => [
      key,
      getPicture(key) ?? getGalleryPicture(key) ?? getRecognitionPicture(key),
    ]),
  );
}

/** Counts for the home page proof strip, derived, never typed in. */
export function workStats() {
  return {
    caseStudies: caseStudies.length,
    projects: featuredProjects.length + moreProjects.length + earlierProjects.length,
  };
}
