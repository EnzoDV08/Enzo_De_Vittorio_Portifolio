import { ArrowRight } from "lucide-react";
import { useId } from "react";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { Button } from "~/components/ui/Button";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { home } from "~/content/pages";
import { disciplinesText, projectHref, type ProjectSummary } from "~/lib/project";

/**
 * Selected work without the 3D room: the same projects as a native scroll-snap strip, each one
 * the carousel's centre screen laid flat (disciplines, title, screenshot). It is what the page
 * prerenders, and what stays with reduced motion or without WebGL2. Plain CSS, nothing to load.
 */
export function WorkStrip({ projects }: { projects: ProjectSummary[] }) {
  const labelId = useId();
  return (
    <section id="work" aria-labelledby={labelId} className="py-10 md:py-16">
      <h2 id={labelId} className="sr-only">
        {home.work.label}
      </h2>
      <div className="motion-safe:lens-edges">
        <ol
          aria-labelledby={labelId}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain px-[max(var(--spacing-gutter),calc(50vw-min(32rem,42vw)))] pb-4 scrollbar-none md:gap-10"
        >
          {projects.map((project) => (
            <li key={project.slug} className="w-[min(64rem,84vw)] shrink-0 snap-center">
              <TransitionLink
                to={projectHref(project)}
                label={project.title}
                className="group flex flex-col items-center text-center"
              >
                <span className="inline-flex rounded-full glass px-3.5 py-1.5 meta text-fg">
                  {disciplinesText(project)}
                </span>
                <span className="mt-3 line-mask display text-[clamp(2.25rem,1.2rem+4vw,6rem)]">
                  {project.title}
                </span>
                <span className="relative mt-6 block aspect-16/10 w-full overflow-clip rounded-lg bg-bg-2">
                  {/* The video's first frame when there is one (it matches the carousel), else
                    the cover. */}
                  {project.video?.poster ? (
                    <img
                      src={project.video.poster}
                      alt=""
                      width={1600}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out-3 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <ResponsiveImage
                      picture={project.picture}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 64rem, 84vw"
                      className="transition-transform duration-700 ease-out-3 group-hover:scale-[1.02]"
                    />
                  )}
                </span>
              </TransitionLink>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-8 flex justify-center">
        <Button to="/work" variant="ghost" icon={<ArrowRight />}>
          {home.work.allWork}
        </Button>
      </div>
    </section>
  );
}
