import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DeviceStill } from "~/components/devices/DeviceStill";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { Tag } from "~/components/ui/Tag";
import { ToolLogo } from "~/components/ui/ToolLogo";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { ui, work } from "~/content/pages";
import { toolFor } from "~/content/toolkit";
import { cn } from "~/lib/cn";
import {
  caseStudyPath,
  disciplinesText,
  indexLabel,
  projectLinks,
  projectSurface,
  type ProjectSummary,
} from "~/lib/project";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectYear } from "./ProjectYear";

type Variant = "feature" | "compact" | "earlier" | "work";

type Props = {
  project: ProjectSummary;
  index?: number;
  variant?: Variant;
  headingLevel?: "h2" | "h3";
  sizes?: string;
};

const sizesFor: Record<Variant, string> = {
  feature: "(min-width: 768px) 46vw, 92vw",
  compact: "(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw",
  earlier: "(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw",
  work: "(min-width: 1280px) 29vw, (min-width: 640px) 46vw, 92vw",
};

/**
 * Project card in three weights. The title is the one link; its ::after stretches over the
 * whole card so the media is clickable too. Case studies open in-app (shown on their devices);
 * everything else opens its live site, code or prototype.
 */
export function ProjectCard({
  project,
  index,
  variant = "compact",
  headingLevel = "h3",
  sizes,
}: Props) {
  const Heading = headingLevel;
  const internal = project.hasCaseStudy;
  const external = projectLinks(project)[0];
  const showDevices = (variant === "feature" || variant === "work") && project.devices.laptop;
  const uniform = variant === "work";
  const linkClass =
    "outline-none after:absolute after:inset-0 after:z-10 after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent";

  const title = (
    <>
      {project.title}
      {project.status === "in-progress" && (
        <span className="ml-3 inline-block translate-y-[-0.2em] rounded-full bg-lime px-2.5 py-0.5 align-middle text-xs font-semibold tracking-normal text-night">
          {work.inProgress}
        </span>
      )}
    </>
  );

  const surface = projectSurface(project, 24);

  return (
    <article
      className={cn(
        "group relative flex w-full flex-col",
        uniform && "h-[37rem] rounded-lg border border-line bg-surface p-3 sm:h-[35rem]",
      )}
      data-cursor={internal ? ui.view : undefined}
    >
      <div
        className={cn(
          "relative overflow-clip rounded-lg",
          surface.className,
          uniform
            ? "h-56 shrink-0"
            : showDevices
              ? "aspect-[5/4] px-[9%] pt-[12%]"
              : "aspect-[16/10]",
          variant === "earlier" && "aspect-[4/3] rounded-md",
        )}
        style={surface.style}
      >
        {showDevices ? (
          <div
            className={cn(
              "transition-transform duration-700 ease-out-expo group-hover:-translate-y-[3%] group-hover:scale-[1.02]",
              uniform && "absolute inset-[7%] flex items-center justify-center",
            )}
          >
            <DeviceStill devices={project.devices} sizes={sizes ?? sizesFor[variant]} decorative />
          </div>
        ) : (
          <div className="absolute inset-[3%] overflow-clip rounded-md shadow-[0_18px_45px_-26px_rgba(0,0,0,0.55)] transition-transform duration-700 ease-out-expo group-hover:scale-[1.035]">
            <ProjectMedia project={project} sizes={sizes ?? sizesFor[variant]} decorative />
          </div>
        )}
        {index !== undefined && (
          <span className="absolute top-4 left-4 grid h-8 min-w-8 place-items-center rounded-full bg-surface/85 px-2 meta text-fg backdrop-blur md:top-5 md:left-5">
            {indexLabel(index)}
          </span>
        )}
        {project.markPicture && (
          <span className="absolute top-4 right-4 grid size-12 place-items-center rounded-md bg-[#111216] p-2 shadow-lg md:top-5 md:right-5 md:size-14">
            <ResponsiveImage
              picture={project.markPicture}
              alt=""
              sizes="56px"
              className="size-full object-contain"
            />
          </span>
        )}
      </div>

      <div
        className={cn(
          "mt-5 flex items-center justify-between gap-4 text-sm text-muted",
          uniform && "px-2",
        )}
      >
        <span>{disciplinesText(project)}</span>
        <ProjectYear project={project} />
      </div>

      <Heading
        className={cn(
          "mt-2 display",
          variant === "feature" && "text-2xl md:text-[2.5rem]",
          variant === "compact" && "text-xl md:text-2xl",
          variant === "earlier" && "text-lg md:text-xl",
          uniform && "line-clamp-2 min-h-[3.75rem] px-2 text-2xl leading-tight",
        )}
      >
        {internal ? (
          <TransitionLink to={caseStudyPath(project)} label={project.title} className={linkClass}>
            {title}
          </TransitionLink>
        ) : external ? (
          <a href={external.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {title}
            <span className="sr-only">
              {" "}
              , {external.label} {ui.newTab}
            </span>
          </a>
        ) : (
          title
        )}
      </Heading>

      {project.context && (
        <p
          className={cn(
            "mt-1 font-semibold tracking-wide text-accent",
            variant === "feature" ? "text-sm" : "text-xs",
            uniform && "line-clamp-1 px-2",
          )}
        >
          {project.context}
        </p>
      )}

      <p
        className={cn(
          "mt-2 max-w-prose text-muted",
          variant === "earlier" ? "text-sm" : "text-base",
          uniform && "line-clamp-2 px-2",
        )}
      >
        {project.tagline}
      </p>

      {variant !== "feature" && (
        <ul className={cn("mt-4 flex flex-wrap gap-1.5", uniform && "px-2")}>
          {project.stack.slice(0, uniform ? 3 : 4).map((entry) => (
            <li key={entry}>
              <Tag className="gap-1.5 pl-2">
                <ToolLogo tool={toolFor(entry)} className="size-3.5" />
                {entry}
              </Tag>
            </li>
          ))}
        </ul>
      )}

      {(internal || external) && (
        <p
          aria-hidden="true"
          className={cn(
            // Pinned to the bottom, so it lines up across cards of one height.
            "mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold transition-colors duration-300 group-hover:text-accent",
            uniform && "px-2 pt-4 pb-2",
          )}
        >
          {internal ? work.caseStudy : external?.label}
          {internal ? (
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          ) : (
            <ArrowUpRight className="size-4" />
          )}
        </p>
      )}
    </article>
  );
}
