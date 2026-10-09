import { ArrowRight, ArrowUpRight, Award } from "lucide-react";
import { RevealMedia } from "~/components/motion/RevealMedia";
import { RevealText } from "~/components/motion/RevealText";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { HorizontalGallery } from "~/components/project/HorizontalGallery";
import { ProjectMedia } from "~/components/project/ProjectMedia";
import { ProjectYear } from "~/components/project/ProjectYear";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { TodoMark } from "~/components/ui/TodoMark";
import { caseStudy as copy, notFound, ui, work } from "~/content/pages";
import { site } from "~/content/site";
import { isTodo } from "~/content/todo";
import { caseStudyData } from "~/lib/content.server";
import { creativeWorkJsonLd } from "~/lib/jsonld";
import { caseStudyPath, indexLabel, projectLinks, type ProjectDetail } from "~/lib/project";
import { pageMeta } from "~/lib/seo";
import { NotFound } from "./not-found";
import type { Route } from "./+types/case-study";

// Runs at build time for every case study listed in react-router.config.ts.
export function loader({ params }: Route.LoaderArgs) {
  return caseStudyData(params.slug);
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
    image: `/og/${project.slug}.png`,
    type: "article",
    jsonLd: creativeWorkJsonLd(project),
  });
}

/** Text or a visible TODO marker. */
function Copy({ value, className }: { value: string; className?: string }) {
  return isTodo(value) ? <TodoMark>{value}</TodoMark> : <span className={className}>{value}</span>;
}

/** Two-column row: mono label on the left, content on the right. */
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
    <Container as="section" className="py-16 md:py-24">
      <div className="grid gap-y-6 border-t border-line pt-5 lg:grid-cols-12 lg:gap-x-[var(--spacing-gutter)]">
        <h2 className="meta text-muted lg:col-span-3">
          {index !== undefined && (
            <span className="text-[var(--project-accent)]">({indexLabel(index)}) </span>
          )}
          {label}
        </h2>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </Container>
  );
}

type GalleryItem = NonNullable<ProjectDetail["gallery"]>[number];

function InlineImage({ image }: { image: GalleryItem }) {
  return (
    <Container as="figure" className="py-8 md:py-12">
      <RevealMedia className="aspect-[16/10] bg-ink-2">
        <ResponsiveImage
          picture={image.picture}
          alt={image.alt}
          fill
          sizes="(min-width: 1600px) 1520px, 94vw"
        />
      </RevealMedia>
      {image.caption && <figcaption className="mt-3 meta text-muted">{image.caption}</figcaption>}
    </Container>
  );
}

function Credits({ project }: { project: ProjectDetail }) {
  const team = project.team;
  return (
    <dl className="grid gap-x-[var(--spacing-gutter)] gap-y-6 sm:grid-cols-2">
      {!Array.isArray(team) && (
        <div>
          <dt className="meta text-muted">{site.name}</dt>
          <dd className="mt-1">
            <Copy value={project.role} />
          </dd>
        </div>
      )}
      {Array.isArray(team) &&
        team.map((member) => (
          <div key={member.name}>
            <dt className="meta text-muted">{member.name}</dt>
            <dd className="mt-1">
              <Copy value={member.role} />
            </dd>
          </div>
        ))}
      {isTodo(team) && (
        <div className="sm:col-span-2">
          <TodoMark>{team}</TodoMark>
        </div>
      )}
      {project.client && (
        <div>
          <dt className="meta text-muted">{copy.meta.client}</dt>
          <dd className="mt-1">
            <Copy value={project.client} />
          </dd>
        </div>
      )}
    </dl>
  );
}

export default function CaseStudy({ loaderData }: Route.ComponentProps) {
  if (!loaderData?.project.caseStudy) return <NotFound />;
  const { project, next } = loaderData;
  const cs = loaderData.project.caseStudy;
  const links = projectLinks(project);
  const gallery = project.gallery ?? [];
  // First gallery image sits between Challenge and Approach. The rest form the pinned strip
  // when there are at least two; a single leftover image stays inline.
  const [lead, ...rest] = gallery;
  const accent = project.theme?.accent ?? "var(--color-accent)";

  const metaRow = [
    { label: copy.meta.role, value: <Copy value={project.role} /> },
    { label: copy.meta.year, value: <ProjectYear project={project} /> },
    {
      label: project.context ? copy.meta.context : copy.meta.client,
      value: <Copy value={project.context ?? project.client ?? ""} />,
    },
    { label: copy.meta.stack, value: project.stack.join(" · ") },
  ];

  return (
    <article style={{ "--project-accent": accent } as React.CSSProperties}>
      <Container className="pt-32 md:pt-44">
        <p className="meta text-muted">
          <TransitionLink to="/work" className="inline-flex min-h-11 items-center hover:text-paper">
            {work.heading}
          </TransitionLink>
          <span aria-hidden="true"> / </span>
          <span className="text-[var(--project-accent)]">{project.disciplines.join(" · ")}</span>
        </p>
        <h1 className="mt-4 display text-[clamp(2.75rem,9vw,9.5rem)]">{project.title}</h1>
        <p className="mt-6 max-w-[40ch] text-xl text-paper/90">{project.tagline}</p>

        <dl className="mt-12 grid gap-x-[var(--spacing-gutter)] gap-y-6 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {metaRow.map((item) => (
            <div key={item.label}>
              <dt className="meta text-muted">{item.label}</dt>
              <dd className="mt-2 meta text-paper">{item.value}</dd>
            </div>
          ))}
        </dl>

        {(links.length > 0 || project.recognition) && (
          <div className="mt-10 flex flex-wrap items-center gap-3">
            {links.map((link, i) => (
              <Button
                key={link.kind}
                href={link.href}
                variant={i === 0 ? "accent" : "ghost"}
                icon={<ArrowUpRight />}
              >
                {link.label}
              </Button>
            ))}
            {project.recognition && (
              <p className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-[var(--project-accent)] px-4 meta text-paper">
                <Award className="size-3.5 text-[var(--project-accent)]" aria-hidden />
                {project.recognition}
              </p>
            )}
          </div>
        )}
      </Container>

      <div className="relative mt-14 aspect-[16/10] max-h-[92svh] w-full overflow-clip bg-ink-2 md:mt-20">
        <ProjectMedia project={project} sizes="100vw" priority />
      </div>

      <Row label={copy.challenge} index={1}>
        {isTodo(cs.challenge) ? (
          <TodoMark>{cs.challenge}</TodoMark>
        ) : (
          <RevealText as="p" className="max-w-[30ch] display text-2xl leading-[1.15]">
            {cs.challenge}
          </RevealText>
        )}
      </Row>

      {lead && <InlineImage image={lead} />}

      <Row label={copy.approach} index={2}>
        <ol className="grid gap-x-[var(--spacing-gutter)] gap-y-12 md:grid-cols-2">
          {cs.approach.map((block, i) => (
            <li key={block.heading} className="border-t border-line pt-5">
              <span className="meta text-[var(--project-accent)]">{indexLabel(i + 1)}</span>
              <h3 className="mt-3 display text-xl">{block.heading}</h3>
              <p className="mt-3 max-w-[48ch] text-muted">{block.body}</p>
            </li>
          ))}
        </ol>
      </Row>

      {rest.length >= 2 && (
        <div className="py-12 md:py-16">
          <HorizontalGallery images={rest} label={copy.gallery} hint={copy.galleryHint} />
        </div>
      )}
      {rest.length === 1 && rest[0] && <InlineImage image={rest[0]} />}

      <Row label={copy.highlights} index={3}>
        <ol className="divide-y divide-line border-y border-line">
          {cs.highlights.map((item, i) => (
            <li key={item} className="flex gap-6 py-4 md:gap-10">
              <span className="pt-1 meta text-[var(--project-accent)]">{indexLabel(i + 1)}</span>
              <span className="text-lg">{item}</span>
            </li>
          ))}
        </ol>
      </Row>

      <Row label={copy.outcome} index={4}>
        {isTodo(cs.outcome) ? (
          <TodoMark>{cs.outcome}</TodoMark>
        ) : (
          <p className="max-w-[30ch] display text-2xl leading-[1.15]">{cs.outcome}</p>
        )}
      </Row>

      <Row label={copy.credits} index={5}>
        <Credits project={project} />
      </Row>

      <Container as="nav" aria-label={copy.next} className="pt-12 md:pt-20">
        <TransitionLink
          to={caseStudyPath(next)}
          label={next.title}
          data-cursor={ui.view}
          className="group block border-t border-line pt-5"
          style={
            next.theme?.accent
              ? ({ "--next-accent": next.theme.accent } as React.CSSProperties)
              : undefined
          }
        >
          <span className="flex items-center justify-between meta text-muted">
            <span>{copy.next}</span>
            <ArrowRight
              className="size-4 transition-transform duration-500 ease-out-3 group-hover:translate-x-1"
              aria-hidden
            />
          </span>
          <span className="mt-6 block display text-[clamp(2.5rem,8vw,8rem)] transition-colors duration-300 group-hover:text-[var(--next-accent,var(--color-accent))]">
            {next.title}
          </span>
          {/* Cover peek — only when there's real imagery; a placeholder would repeat the title. */}
          {next.picture && (
            <span className="relative mt-8 block aspect-[21/7] overflow-clip bg-ink-2">
              <span className="absolute inset-0 block transition-transform duration-700 ease-out-3 group-hover:scale-[1.04]">
                <ProjectMedia project={next} sizes="(min-width: 1600px) 1520px, 94vw" decorative />
              </span>
            </span>
          )}
        </TransitionLink>
      </Container>
    </article>
  );
}
