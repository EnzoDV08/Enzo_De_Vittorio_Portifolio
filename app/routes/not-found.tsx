import { ArrowLeft } from "lucide-react";
import { ProjectCard } from "~/components/project/ProjectCard";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { notFound } from "~/content/pages";
import { featuredSummaries } from "~/lib/content.server";
import type { ProjectSummary } from "~/lib/project";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/not-found";

export function loader() {
  return { featured: featuredSummaries().slice(0, 3) };
}

export function meta() {
  return pageMeta({ ...notFound.meta, path: "/404", noindex: true });
}

export default function NotFoundRoute({ loaderData }: Route.ComponentProps) {
  return <NotFound featured={loaderData.featured} />;
}

/** Also rendered by the root error boundary, where there is no loader data. */
export function NotFound({ featured = [] }: { featured?: ProjectSummary[] }) {
  return (
    <>
      <Container className="flex min-h-[80svh] flex-col justify-end pt-32 pb-16">
        <p className="meta text-muted">404</p>
        <h1 className="mt-6 display text-display">
          {notFound.heading} <span className="serif-accent text-accent">{notFound.accent}</span>
        </h1>
        <p className="mt-8 max-w-prose text-lg text-muted">{notFound.copy}</p>
        <div className="mt-10">
          <Button to="/" icon={<ArrowLeft />}>
            {notFound.home}
          </Button>
        </div>
      </Container>
      {featured.length > 0 && (
        <Container className="pb-section">
          <ul className="grid gap-x-[var(--spacing-gutter)] gap-y-16 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <li key={project.slug}>
                <ProjectCard project={project} index={i + 1} variant="compact" headingLevel="h2" />
              </li>
            ))}
          </ul>
        </Container>
      )}
    </>
  );
}
