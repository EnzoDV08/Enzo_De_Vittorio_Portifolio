import { useRef, type PointerEvent } from "react";
import { useSearchParams } from "react-router";
import { ProjectCard } from "~/components/project/ProjectCard";
import { Container } from "~/components/ui/Container";
import { FilterChips } from "~/components/ui/FilterChips";
import { Section } from "~/components/ui/Section";
import { work } from "~/content/pages";
import { disciplines } from "~/content/disciplines";
import { isTodo } from "~/content/todo";
import type { Discipline } from "~/content/types";
import { workSummaries } from "~/lib/content.server";
import { yearValue, type ProjectSummary } from "~/lib/project";
import { pageMeta } from "~/lib/seo";
import { useHydrated } from "~/lib/useHydrated";
import type { Route } from "./+types/work";

export function loader() {
  return workSummaries();
}

export function meta() {
  return pageMeta({ ...work.meta, path: "/work" });
}

const TBC = "tbc";
const yearKey = (p: ProjectSummary) => (isTodo(p.year) ? TBC : String(p.year));

/** Earlier work grouped by year, newest first, unconfirmed years last. */
function groupByYear(list: ProjectSummary[]) {
  const groups = new Map<string, ProjectSummary[]>();
  for (const p of [...list].sort((a, b) => yearValue(b) - yearValue(a) || a.order - b.order)) {
    const key = yearKey(p);
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  return [...groups.entries()];
}

function YearCarousel({ year, projects }: { year: string; projects: ProjectSummary[] }) {
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    scrollLeft: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);

  const finishDrag = (event: PointerEvent<HTMLUListElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    if (current.moved) {
      suppressClick.current = true;
      event.currentTarget.style.scrollSnapType = "";
      event.currentTarget.classList.remove("select-none");
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }
    drag.current = null;
  };

  return (
    <section aria-labelledby={`year-${year}`}>
      <div className="flex items-center justify-between gap-4 border-t border-line pt-5">
        <h2 id={`year-${year}`} className="display text-3xl tabular-nums">
          {year === TBC ? work.unknownYear : year}
        </h2>
        <span className="meta text-muted">{String(projects.length).padStart(2, "0")}</span>
      </div>
      <div className="relative left-1/2 mt-8 w-screen -translate-x-1/2 [--lens-width:clamp(2rem,6vw,5rem)] motion-safe:lens-edges">
        <ul
          aria-label={`${year} projects`}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            suppressClick.current = false;
            drag.current = {
              id: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              scrollLeft: event.currentTarget.scrollLeft,
              moved: false,
            };
          }}
          onPointerMove={(event) => {
            const current = drag.current;
            if (!current || current.id !== event.pointerId || event.buttons !== 1) return;
            const dx = event.clientX - current.x;
            if (!current.moved) {
              if (Math.abs(dx) < 6 || Math.abs(dx) <= Math.abs(event.clientY - current.y)) return;
              current.moved = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              event.currentTarget.style.scrollSnapType = "none";
              event.currentTarget.classList.add("select-none");
            }
            event.preventDefault();
            event.currentTarget.scrollLeft = current.scrollLeft - dx;
          }}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onDragStart={(event) => event.preventDefault()}
          onClickCapture={(event) => {
            if (!suppressClick.current) return;
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }}
          className="year-carousel-track flex cursor-grab snap-x snap-mandatory gap-[var(--spacing-gutter)] overflow-x-auto overscroll-x-contain pb-4 active:cursor-grabbing"
        >
          {projects.map((project) => (
            <li
              key={project.slug}
              className="w-[85%] shrink-0 snap-start sm:w-[52%] lg:w-[calc((min(100vw,var(--container-site))-2*var(--spacing-gutter))/4)]"
            >
              <ProjectCard project={project} variant="earlier" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Work({ loaderData }: Route.ComponentProps) {
  const { featured: featuredProjects, more: moreProjects, earlier: earlierProjects } = loaderData;
  const earlierYears = groupByYear(earlierProjects).map(([key]) => key);
  // Filters live in the URL (?d=ux&y=2024). Read them only after hydration so the prerendered
  // "All" HTML hydrates cleanly, then re-render with the filter applied.
  const hydrated = useHydrated();
  const [params, setParams] = useSearchParams();
  const dParam = hydrated ? params.get("d") : null;
  const yParam = hydrated ? params.get("y") : null;
  const discipline = disciplines.find((d) => d.toLowerCase() === dParam) ?? null;
  const year = yParam && earlierYears.includes(yParam) ? yParam : null;

  const setParam = (key: "d" | "y", value: string | null) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );

  const matches = (p: ProjectSummary) =>
    !discipline || p.disciplines.includes(discipline as Discipline);
  const featured = featuredProjects.filter(matches);
  const more = moreProjects.filter(matches);
  const earlier = groupByYear(earlierProjects.filter(matches)).filter(
    ([key]) => !year || key === year,
  );
  const total = featured.length + more.length + earlier.reduce((n, [, g]) => n + g.length, 0);

  return (
    <>
      <Container className="pt-32 md:pt-40">
        <h1 className="display text-display">
          {work.heading}
          <sup className="ml-2 align-top text-[0.28em] font-bold tracking-normal text-accent tabular-nums">
            {String(
              featuredProjects.length + moreProjects.length + earlierProjects.length,
            ).padStart(2, "0")}
          </sup>
        </h1>
        <div className="mt-10 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-start md:justify-between">
          <p className="max-w-[40ch] text-lg text-muted">{work.intro}</p>
          <FilterChips
            label={work.filterLabel}
            value={discipline?.toLowerCase() ?? null}
            onChange={(v) => setParam("d", v)}
            options={[
              { value: null, label: work.all },
              ...disciplines.map((d) => ({ value: d.toLowerCase(), label: d })),
            ]}
          />
        </div>
        <p role="status" className="sr-only">
          {total} {work.shown}
        </p>
      </Container>

      {total === 0 && (
        <Container className="py-section">
          <p className="display text-2xl text-muted">{work.empty}</p>
        </Container>
      )}

      {featured.length > 0 && (
        <Section index={1} label={work.featuredLabel} spacing="tight">
          {/* auto-rows-fr: every row as tall as the tallest card, so all case studies match. */}
          <ul className="grid gap-x-[var(--spacing-gutter)] gap-y-16 md:auto-rows-fr md:grid-cols-2 md:gap-y-20">
            {featured.map((project) => (
              <li key={project.slug} className="flex">
                <ProjectCard
                  project={project}
                  index={featuredProjects.indexOf(project) + 1}
                  variant="feature"
                  headingLevel="h2"
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {more.length > 0 && (
        <Section index={2} label={work.moreLabel}>
          <ul className="grid gap-x-[var(--spacing-gutter)] gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} variant="compact" headingLevel="h2" />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {earlierProjects.some(matches) && (
        <Section index={3} label={work.earlierLabel}>
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <p className="max-w-[40ch] text-muted">{work.earlierIntro}</p>
            <FilterChips
              label={work.yearFilterLabel}
              value={year}
              onChange={(v) => setParam("y", v)}
              options={[
                { value: null, label: work.allYears },
                ...earlierYears.map((key) => ({
                  value: key,
                  label: key === TBC ? work.unknownYear : key,
                })),
              ]}
            />
          </div>
          <div className="mt-14 space-y-20">
            {earlier.map(([key, group]) => (
              <YearCarousel key={`${key}-${discipline ?? "all"}`} year={key} projects={group} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
