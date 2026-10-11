import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import type { ProjectSummary } from "~/lib/project";

type Props = {
  project: Pick<ProjectSummary, "picture" | "coverAlt" | "title" | "theme">;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Inside a link that already names the project: empty alt. */
  decorative?: boolean;
};

/** A project's cover, filling its (positioned, sized) parent. Placeholder if it doesn't exist yet. */
export function ProjectMedia({ project, sizes, priority, className, decorative }: Props) {
  return (
    <ResponsiveImage
      picture={project.picture}
      alt={decorative ? "" : project.coverAlt}
      sizes={sizes}
      priority={priority}
      fill
      className={className}
      placeholder={{ title: project.title, accent: project.theme?.accent }}
    />
  );
}
