import { ArrowRight, ArrowUpRight } from "lucide-react";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { RevealMedia } from "~/components/motion/RevealMedia";
import { TagList } from "~/components/ui/Tag";
import { ui, work } from "~/content/pages";
import { cn } from "~/lib/cn";
import {
  caseStudyPath,
  disciplinesText,
  indexLabel,
  projectLinks,
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
  feature: "(min-width: 768px) 50vw, 100vw",
  compact: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  earlier: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
};

/**
 * Project card in three weights. The title is the one link; it stretches over the whole card.
 * Case studies open in-app; everything else opens its live site, code or prototype.
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
  const accent = project.theme?.accent;

  const title = (
    <span className="relative">
      {project.title}
      {project.status === "in-progress" && (
        <span className="ml-3 align-middle meta text-accent">{work.inProgress}</span>
      )}
    </span>
  );

  return (
    <article
      className="group relative flex flex-col"
      style={accent ? ({ "--project-accent": accent } as React.CSSProperties) : undefined}
    >
      <RevealMedia
        className={cn("bg-ink-2", variant === "earlier" ? "aspect-[4/3]" : "aspect-[16/10]")}
        innerClassName="transition-transform duration-700 ease-out-3 group-hover:scale-[1.03]"
      >
        {internal ? (
          // Duplicate of the title link for pointer users; hidden from keyboard and screen readers.
          <TransitionLink
            to={caseStudyPath(project)}
            label={project.title}
            tabIndex={-1}
            aria-hidden="true"
            data-cursor={ui.view}
            className="absolute inset-0 block"
          >
            <ProjectMedia project={project} sizes={sizes ?? sizesFor[variant]} />
          </TransitionLink>
        ) : external ? (
          <a
            href={external.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 block"
          >
            <ProjectMedia project={project} sizes={sizes ?? sizesFor[variant]} />
          </a>
        ) : (
          <div className="absolute inset-0">
            <ProjectMedia project={project} sizes={sizes ?? sizesFor[variant]} />
          </div>
        )}
      </RevealMedia>

      <div className="mt-4 flex items-center justify-between gap-4 meta text-muted">
        <span className="flex items-center gap-3">
          {index !== undefined && (
            <span className="text-paper transition-colors duration-300 group-hover:text-[var(--project-accent,var(--color-accent))]">
              {indexLabel(index)}
            </span>
          )}
          <span>{disciplinesText(project)}</span>
        </span>
        <ProjectYear project={project} />
      </div>

      <Heading
        className={cn(
          "mt-3 display",
          variant === "feature" && "text-2xl md:text-3xl",
          variant === "compact" && "text-xl md:text-2xl",
          variant === "earlier" && "text-lg text-paper/90 md:text-xl",
        )}
      >
        {internal ? (
          <TransitionLink
            to={caseStudyPath(project)}
            label={project.title}
            className="transition-colors duration-300 hover:text-[var(--project-accent,var(--color-accent))]"
          >
            {title}
          </TransitionLink>
        ) : external ? (
          <a
            href={external.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 hover:text-[var(--project-accent,var(--color-accent))]"
          >
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

      <p
        className={cn(
          "mt-2 max-w-prose text-muted",
          variant === "earlier" ? "text-sm" : "text-base",
        )}
      >
        {project.tagline}
      </p>

      {variant !== "feature" && <TagList items={project.stack.slice(0, 5)} className="mt-4" />}

      {(internal || external) && (
        <p
          aria-hidden="true"
          className="mt-5 inline-flex items-center gap-2 meta text-paper transition-colors duration-300 group-hover:text-[var(--project-accent,var(--color-accent))]"
        >
          {internal ? work.caseStudy : external?.label}
          {internal ? <ArrowRight className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
        </p>
      )}
    </article>
  );
}
