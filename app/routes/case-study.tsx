import { ArrowRight, ArrowUpRight, Award } from "lucide-react";
import { preload } from "react-dom";
import { data } from "react-router";
import { DeviceStage } from "~/components/devices/DeviceStage";
import { DeviceStill } from "~/components/devices/DeviceStill";
import { RevealMedia } from "~/components/motion/RevealMedia";
import { RevealText } from "~/components/motion/RevealText";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { HorizontalGallery } from "~/components/project/HorizontalGallery";
import { ProjectMedia } from "~/components/project/ProjectMedia";
import { ProjectYear } from "~/components/project/ProjectYear";
import { BrowserFrame } from "~/components/ui/BrowserFrame";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { SectionLabel } from "~/components/ui/SectionLabel";
import { showTodos, TodoMark } from "~/components/ui/TodoMark";
import { ToolChip } from "~/components/ui/ToolLogo";
import { caseStudy as copy, notFound, ui, work } from "~/content/pages";
import { site } from "~/content/site";
import { isTodo, real } from "~/content/todo";
import { toolFor } from "~/content/toolkit";
import { caseStudyData } from "~/lib/content.server";
import { lastFrameSrc, lastFrameSrcSet } from "~/lib/devices";
import { creativeWorkJsonLd } from "~/lib/jsonld";
import {
  caseStudyPath,
  indexLabel,
  projectLinks,
  projectTint,
  type ProjectDetail,
} from "~/lib/project";
import { pageMeta } from "~/lib/seo";
import { NotFound } from "./not-found";
import type { Route } from "./+types/case-study";

// Runs at build time for every case study listed in react-router.config.ts.
export function loader({ params }: Route.LoaderArgs) {
  return caseStudyData(params.slug);
}

// In the browser, data comes from the prerendered .data file. A slug that was never
// prerendered (e.g. /work/typo) has no file, so turn that into a real 404 page instead of an
// error.
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  try {
    const result = await serverLoader();
    if (result) return result;
  } catch {
    // fall through
  }
  throw data(null, { status: 404 });
}

export function meta({ params, loaderData }: Route.MetaArgs) {
  const project = loaderData?.project;
  if (!project) {
    return pageMeta({ ...notFound.meta, path: `/work/${params.slug}`, noindex: true });
  }
  return pageMeta({
    title: `${project.title} — ${site.name}`,
    description: project.tagline,
    path: caseStudyPath(project),
    image: `/og/${project.slug}.jpg`,
    type: "article",
    jsonLd: creativeWorkJsonLd(project),
  });
}

/** Text, a dev-only TODO marker, or (in production) nothing. */
function Copy({ value, className }: { value: string; className?: string }) {
  return isTodo(value) ? <TodoMark>{value}</TodoMark> : <span className={className}>{value}</span>;
}

/** Shown when it's real content, or in dev so the gap is visible. */
const present = (value: unknown) => showTodos || !isTodo(value);

/** Two-column row: numbered label pill on the left, content on the right. */
function Row({
  label,
  index,
  children,
}: {
  label: string;
  index?: number;
  children: React.ReactNode;
}) {
  return (
    <Container as="section" className="pt-20 md:pt-32">
      <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-[var(--spacing-gutter)]">
        <h2 className="lg:col-span-3">
          <SectionLabel index={index}>{label}</SectionLabel>
        </h2>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </Container>
  );
}

type GalleryItem = NonNullable<ProjectDetail["gallery"]>[number];

function InlineImage({ image, address }: { image: GalleryItem; address?: string }) {
  return (
    <Container as="figure" className="pt-16 md:pt-24">
      <RevealMedia className="rounded-md">
        <BrowserFrame label={address}>
          <div className="relative aspect-[16/10] bg-bg-2">
            <ResponsiveImage
              picture={image.picture}
              alt={image.alt}
              fill
              sizes="(min-width: 1600px) 1520px, 94vw"
            />
          </div>
        </BrowserFrame>
      </RevealMedia>
      {image.caption && <figcaption className="mt-3 text-sm text-muted">{image.caption}</figcaption>}
    </Container>
  );
}

function Credits({ project }: { project: ProjectDetail }) {
  const team = project.team;
  const cells: { label: string; value: string }[] = [];
  if (!Array.isArray(team) && present(project.role))
    cells.push({ label: site.name, value: project.role });
  if (Array.isArray(team))
    for (const member of team)
      if (present(member.role)) cells.push({ label: member.name, value: member.role });
  if (project.client && present(project.client))
    cells.push({ label: copy.meta.client, value: project.client });
  return (
    <>
      <dl className="grid gap-px overflow-clip rounded-lg border border-line bg-line sm:grid-cols-2">
        {cells.map((cell) => (
          <div key={cell.label} className="bg-bg p-6">
            <dt className="text-sm text-muted">{cell.label}</dt>
            <dd className="mt-1 text-lg font-semibold">
              <Copy value={cell.value} />
            </dd>
          </div>
        ))}
      </dl>
      {isTodo(team) && <TodoMark className="mt-4">{team}</TodoMark>}
    </>
  );
}

export default function CaseStudy({ loaderData }: Route.ComponentProps) {
  if (!loaderData?.project.caseStudy) return <NotFound />;
  const { project, next } = loaderData;
  const cs = loaderData.project.caseStudy;
  const { laptop } = project.devices;
  // The device still is the largest thing above the fold. React hoists high-priority image
  // preloads to the top of <head>, ahead of the module preloads.
  if (laptop) {
    preload(lastFrameSrc(laptop), {
      as: "image",
      type: "image/webp",
      imageSrcSet: lastFrameSrcSet(laptop),
      imageSizes: "80vw",
      fetchPriority: "high",
    });
  }
  const links = projectLinks(project);
  const live = real(project.links.live);
  const address = live ? new URL(live).hostname.replace(/^www\./, "") : project.title;
  const gallery = project.gallery ?? [];
  // First gallery image sits between Challenge and Approach. The rest form the pinned strip
  // when there are at least two; a single leftover image stays inline.
  const [lead, ...rest] = gallery;
  const accent = project.theme?.accent ?? "var(--color-cobalt)";

  const metaRow = [
    { label: copy.meta.role, raw: project.role, value: <Copy value={project.role} /> },
    { label: copy.meta.year, raw: project.year, value: <ProjectYear project={project} /> },
    {
      label: project.context ? copy.meta.context : copy.meta.client,
      raw: project.context ?? project.client ?? "",
      value: <Copy value={project.context ?? project.client ?? ""} />,
    },
  ].filter((item) => present(item.raw) && item.raw !== "");

  return (
    <article style={{ "--project-accent": accent } as React.CSSProperties}>
      <Container className="pt-32 md:pt-40">
        <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <TransitionLink
            to="/work"
            className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-fg"
          >
            {work.heading}
          </TransitionLink>
          <span aria-hidden="true" className="text-muted">
            /
          </span>
          {project.disciplines.map((d) => (
            <span
              key={d}
              className="rounded-full px-3 py-1"
              style={{ background: projectTint(project, 40) }}
            >
              {d}
            </span>
          ))}
        </p>
        <h1 className="mt-6 display text-[clamp(3rem,10vw,10.5rem)]">{project.title}</h1>
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <p className="max-w-[36ch] text-xl text-fg/85 lg:col-span-7">{project.tagline}</p>
          {(links.length > 0 || project.recognition) && (
            <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
              {project.recognition && (
                <p className="inline-flex min-h-12 items-center gap-2 rounded-full bg-lime px-5 text-sm font-semibold text-night">
                  <Award className="size-4" aria-hidden />
                  {project.recognition}
                </p>
              )}
              {links.map((link, i) => (
                <Button
                  key={link.kind}
                  href={link.href}
                  variant={i === 0 ? "solid" : "ghost"}
                  icon={<ArrowUpRight />}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <dl className="mt-12 grid gap-px overflow-clip rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {metaRow.map((item) => (
            <div key={item.label} className="bg-bg p-5 md:p-6">
              <dt className="text-sm text-muted">{item.label}</dt>
              <dd className="mt-1.5 font-semibold">{item.value}</dd>
            </div>
          ))}
          <div className="bg-bg p-5 sm:col-span-2 md:p-6 lg:col-span-4">
            <dt className="text-sm text-muted">{copy.meta.stack}</dt>
            <dd className="mt-1.5 font-semibold">{project.stack.join(" · ")}</dd>
          </div>
        </dl>
      </Container>

      {/* The devices. Full-bleed tint of the project's colour. */}
      {laptop ? (
        <div className="mt-12 md:mt-16">
          <div className="relative mx-[var(--spacing-gutter)] rounded-xl" style={{ background: projectTint(project, 34) }}>
            <div aria-hidden="true" className="absolute inset-0 rounded-xl opacity-70 dot-grid" />
            <DeviceStage
              devices={project.devices}
              label={copy.devices}
              captions={{ laptop: copy.desktop, phone: copy.mobile }}
              hint={copy.scrollHint}
              className="relative"
            />
          </div>
        </div>
      ) : (
        <Container className="mt-12 md:mt-16">
          <BrowserFrame label={address}>
            <div className="relative aspect-[16/10] bg-bg-2">
              <ProjectMedia project={project} sizes="94vw" priority />
            </div>
          </BrowserFrame>
        </Container>
      )}

      {present(cs.challenge) && (
        <Row label={copy.challenge} index={1}>
          {isTodo(cs.challenge) ? (
            <TodoMark>{cs.challenge}</TodoMark>
          ) : (
            <RevealText as="p" className="max-w-[26ch] display text-3xl">
              {cs.challenge}
            </RevealText>
          )}
        </Row>
      )}

      {lead && <InlineImage image={lead} address={address} />}

      <Row label={copy.approach} index={2}>
        <ol className="grid gap-4 md:grid-cols-2">
          {cs.approach.map((block, i) => (
            <li key={block.heading} className="flex flex-col rounded-lg border border-line bg-surface p-6 md:p-8">
              <span
                className="grid size-10 place-items-center rounded-full meta text-fg"
                style={{ background: projectTint(project, 55) }}
              >
                {indexLabel(i + 1)}
              </span>
              <h3 className="mt-8 display text-2xl">{block.heading}</h3>
              <p className="mt-3 max-w-[48ch] text-muted">{block.body}</p>
            </li>
          ))}
        </ol>
      </Row>

      {rest.length >= 2 && (
        <div className="pt-20 md:pt-28">
          <HorizontalGallery
            images={rest}
            label={copy.gallery}
            hint={copy.galleryHint}
            address={address}
          />
        </div>
      )}
      {rest.length === 1 && rest[0] && <InlineImage image={rest[0]} address={address} />}

      <Row label={copy.highlights} index={3}>
        <ol className="divide-y divide-line border-y border-line">
          {cs.highlights.map((item, i) => (
            <li key={item} className="flex items-baseline gap-6 py-5 md:gap-10">
              <span className="meta text-muted">{indexLabel(i + 1)}</span>
              <span className="text-xl font-semibold tracking-tight">{item}</span>
            </li>
          ))}
        </ol>
        <h3 className="mt-12 text-sm font-semibold text-muted">{copy.stack}</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((entry) => (
            <li key={entry}>
              <ToolChip tool={toolFor(entry)} />
            </li>
          ))}
        </ul>
      </Row>

      {present(cs.outcome) && (
        <Row label={copy.outcome} index={4}>
          {isTodo(cs.outcome) ? (
            <TodoMark>{cs.outcome}</TodoMark>
          ) : (
            <p className="max-w-[30ch] display text-2xl">{cs.outcome}</p>
          )}
        </Row>
      )}

      <Row label={copy.credits} index={present(cs.outcome) ? 5 : 4}>
        <Credits project={project} />
      </Row>

      <Container as="nav" aria-label={copy.next} className="pt-20 md:pt-32">
        <article
          data-cursor={ui.view}
          className="group relative grid overflow-clip rounded-xl lg:grid-cols-12"
          style={{ background: projectTint(next, 30) }}
        >
          <div className="relative z-10 flex flex-col justify-between gap-8 p-6 sm:p-10 lg:col-span-5 lg:p-14">
            <p className="flex items-center gap-2 text-sm font-semibold text-fg/70">
              {copy.next}
              <ArrowRight
                className="size-4 transition-transform duration-500 group-hover:translate-x-1"
                aria-hidden
              />
            </p>
            <div>
              <h2 className="display text-[clamp(2.5rem,6vw,6rem)]">
                <TransitionLink
                  to={caseStudyPath(next)}
                  label={next.title}
                  className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
                >
                  {next.title}
                </TransitionLink>
              </h2>
              <p className="mt-4 max-w-[34ch] text-lg text-fg/80">{next.tagline}</p>
            </div>
          </div>
          <div className="px-6 pb-12 sm:px-12 lg:col-span-7 lg:py-14 lg:pr-14 lg:pl-0">
            {next.devices.laptop ? (
              <div className="transition-transform duration-700 ease-out-expo group-hover:-translate-y-[2%]">
                <DeviceStill devices={next.devices} sizes="(min-width: 1024px) 50vw, 88vw" decorative />
              </div>
            ) : (
              <div className="relative aspect-[16/10] overflow-clip rounded-md">
                <ProjectMedia project={next} sizes="(min-width: 1024px) 50vw, 88vw" decorative />
              </div>
            )}
          </div>
        </article>
      </Container>
    </article>
  );
}
