import { lazy, useRef, useState } from "react";
import { Island } from "~/components/motion/Island";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { ui } from "~/content/pages";
import { caseStudyPath, disciplinesText, indexLabel, type ProjectSummary } from "~/lib/project";
import { FINE_POINTER, useMediaQuery } from "~/lib/useMediaQuery";
import { useMotionAllowed } from "~/lib/motion";
import { ProjectCard } from "./ProjectCard";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectYear } from "./ProjectYear";

const WorkPreviewFx = lazy(() => import("~/components/motion/fx/WorkPreviewFx"));

/**
 * Selected work. Fine-pointer desktops get an index of rows with a preview that follows the
 * cursor. Touch devices and narrow screens get stacked cards with their covers inline.
 * Both are in the HTML; CSS decides which shows, so prerendering needs no device guess.
 */
export function WorkList({ projects }: { projects: ProjectSummary[] }) {
  return (
    <>
      <ul className="grid gap-x-[var(--spacing-gutter)] gap-y-16 sm:grid-cols-2 lg:fine:hidden">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <ProjectCard project={project} index={i + 1} variant="feature" />
          </li>
        ))}
      </ul>
      <IndexRows projects={projects} />
    </>
  );
}

function IndexRows({ projects }: { projects: ProjectSummary[] }) {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  // Preview images load on first hover, never up front.
  const [armed, setArmed] = useState(false);
  const fine = useMediaQuery(FINE_POINTER);
  const motion = useMotionAllowed();
  const follow = fine && motion;

  return (
    <div
      ref={root}
      className="relative hidden lg:fine:block"
      onPointerEnter={() => setArmed(true)}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-line">
        {projects.map((project, i) => (
          <li key={project.slug} className="border-b border-line">
            <TransitionLink
              to={caseStudyPath(project)}
              label={project.title}
              data-cursor={ui.view}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group grid grid-cols-12 items-baseline gap-x-[var(--spacing-gutter)] py-7 transition-colors duration-300 xl:py-9"
              style={
                project.theme?.accent
                  ? ({ "--project-accent": project.theme.accent } as React.CSSProperties)
                  : undefined
              }
            >
              <span className="col-span-1 meta text-muted transition-colors duration-300 group-hover:text-[var(--project-accent,var(--color-accent))]">
                {indexLabel(i + 1)}
              </span>
              <span className="col-span-6 display text-3xl transition-[translate,color] duration-500 ease-out-3 group-hover:translate-x-3">
                {project.title}
              </span>
              <span className="col-span-3 meta text-muted">{disciplinesText(project)}</span>
              <span className="col-span-2 text-right meta text-paper">
                <ProjectYear project={project} />
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>

      {follow && (
        <>
          <div
            ref={preview}
            aria-hidden="true"
            className="pointer-events-none invisible absolute top-0 left-0 z-20 aspect-[16/10] w-[min(30vw,30rem)] -translate-x-1/2 -translate-y-1/2 overflow-clip bg-ink-2 opacity-0"
          >
            {armed &&
              projects.map((project, i) => (
                <div
                  key={project.slug}
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{ opacity: active === i ? 1 : 0 }}
                >
                  <ProjectMedia project={project} sizes="30vw" decorative />
                </div>
              ))}
          </div>
          <Island>
            <WorkPreviewFx root={root} preview={preview} />
          </Island>
        </>
      )}
    </div>
  );
}
