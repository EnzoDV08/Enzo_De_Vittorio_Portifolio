import { ArrowRight, Award } from "lucide-react";
import { DeviceStill } from "~/components/devices/DeviceStill";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { TagList } from "~/components/ui/Tag";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { home, ui } from "~/content/pages";
import { cn } from "~/lib/cn";
import {
  caseStudyPath,
  disciplinesText,
  indexLabel,
  projectSurface,
  type ProjectSummary,
} from "~/lib/project";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectYear } from "./ProjectYear";

/**
 * The home page's selected work: one big panel per project, each on a tint of its own colour
 * with the project on its laptop and phone. From lg up the panels are sticky, so each one
 * slides up over the last like a stack of cards, plain CSS, nothing to load.
 */
export function ProjectShowcase({ projects }: { projects: ProjectSummary[] }) {
  return (
    <ol className="space-y-5 lg:space-y-8">
      {projects.map((project, i) => (
        <li
          key={project.slug}
          className="lg:sticky"
          style={{ top: `calc(5.5rem + ${i * 0.9}rem)` } as React.CSSProperties}
        >
          <article
            data-cursor={ui.view}
            className={cn(
              "group relative grid overflow-clip rounded-xl lg:min-h-[min(78svh,50rem)] lg:grid-cols-12",
              projectSurface(project).className,
            )}
            style={projectSurface(project).style}
          >
            <div className="relative z-10 flex flex-col p-6 pb-0 sm:p-9 sm:pb-0 lg:col-span-5 lg:p-12 xl:p-14">
              <div className="flex items-center gap-3 text-sm font-medium text-fg/75">
                <span className="grid h-8 min-w-8 place-items-center rounded-full bg-fg px-2 meta text-bg">
                  {indexLabel(i + 1)}
                </span>
                <span>{disciplinesText(project)}</span>
                <span aria-hidden="true">·</span>
                <ProjectYear project={project} />
              </div>
              {project.wordmarkPicture && (
                <span className="mt-9 inline-flex w-fit items-center rounded-md bg-[#111216] px-4 py-3 lg:mt-12">
                  <ResponsiveImage
                    picture={project.wordmarkPicture}
                    alt=""
                    sizes="152px"
                    className="w-32 sm:w-38"
                  />
                </span>
              )}
              <h3 className="mt-8 display text-[clamp(2.5rem,1.6rem+3.6vw,5.5rem)] lg:mt-auto">
                <TransitionLink
                  to={caseStudyPath(project)}
                  label={project.title}
                  className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
                >
                  {project.title}
                </TransitionLink>
              </h3>
              <p className="mt-5 max-w-[34ch] text-lg text-fg/80">{project.tagline}</p>
              <TagList
                items={project.stack.slice(0, 4)}
                className="mt-6 [&_span]:border-fg/25 [&_span]:text-fg/75"
              />
              <div className="mt-8 flex flex-wrap items-center gap-3 lg:mb-2">
                <span
                  aria-hidden="true"
                  className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-fg px-6 text-[0.9375rem] font-semibold text-bg transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-fg"
                >
                  {home.work.view}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                {project.recognition && (
                  <span className="inline-flex min-h-12 items-center gap-2 rounded-full bg-lime px-5 text-sm font-semibold text-night">
                    <Award className="size-4" aria-hidden />
                    {project.recognition}
                  </span>
                )}
              </div>
            </div>
            <div className="relative px-6 pt-10 pb-12 sm:px-12 lg:col-span-7 lg:self-center lg:py-14 lg:pr-14 lg:pl-0">
              {project.devices.laptop ? (
                <div className="transition-transform duration-700 ease-out-expo group-hover:-translate-y-[2%] group-hover:scale-[1.015]">
                  <DeviceStill
                    devices={project.devices}
                    sizes="(min-width: 1600px) 860px, (min-width: 1024px) 54vw, 88vw"
                    phoneSizes="(min-width: 1024px) 16vw, 26vw"
                    decorative
                  />
                </div>
              ) : (
                <div className="relative aspect-[16/10] overflow-clip rounded-md">
                  <ProjectMedia
                    project={project}
                    sizes="(min-width: 1024px) 54vw, 88vw"
                    decorative
                  />
                </div>
              )}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
