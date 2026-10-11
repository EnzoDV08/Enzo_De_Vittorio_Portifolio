import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DeviceStill } from "~/components/devices/DeviceStill";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { TagList } from "~/components/ui/Tag";
import { ui, work } from "~/content/pages";
import { cn } from "~/lib/cn";
import {
  caseStudyPath,
  disciplinesText,
  indexLabel,
  projectLinks,
  projectTint,
  type ProjectSummary,
} from "~/lib/project";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectYear } from "./ProjectYear";

type Variant = "feature" | "compact" | "earlier";

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
  const showDevices = variant === "feature" && project.devices.laptop;
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

  return (
    <article className="group relative flex flex-col" data-cursor={internal ? ui.view : undefined}>
      <div
        className={cn(
          "relative overflow-clip rounded-lg",
          showDevices ? "aspect-[5/4] px-[9%] pt-[12%]" : "aspect-[16/10] bg-bg-2",
          variant === "earlier" && "aspect-[4/3] rounded-md",
        )}
        style={showDevices ? { background: projectTint(project) } : undefined}
      >
        {showDevices ? (
          <div className="transition-transform duration-700 ease-out-expo group-hover:-translate-y-[3%] group-hover:scale-[1.02]">
            <DeviceStill devices={project.devices} sizes={sizes ?? sizesFor[variant]} decorative />
          </div>
        ) : (
          <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
            <ProjectMedia project={project} sizes={sizes ?? sizesFor[variant]} decorative />
          </div>
        )}
        {index !== undefined && (
          <span className="absolute top-4 left-4 grid h-8 min-w-8 place-items-center rounded-full bg-surface/85 px-2 meta text-fg backdrop-blur md:top-5 md:left-5">
            {indexLabel(index)}
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm text-muted">
        <span>{disciplinesText(project)}</span>
        <ProjectYear project={project} />
      </div>

      <Heading
        className={cn(
          "mt-2 display",
          variant === "feature" && "text-2xl md:text-[2.5rem]",
          variant === "compact" && "text-xl md:text-2xl",
          variant === "earlier" && "text-lg md:text-xl",
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
              — {external.label} {ui.newTab}
            </span>
          </a>
        ) : (
          title
        )}
      </Heading>

      <p className={cn("mt-2 max-w-prose text-muted", variant === "earlier" ? "text-sm" : "text-base")}>
        {project.tagline}
      </p>

      {variant !== "feature" && <TagList items={project.stack.slice(0, 4)} className="mt-4" />}

      {(internal || external) && (
        <p
          aria-hidden="true"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-300 group-hover:text-accent"
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
