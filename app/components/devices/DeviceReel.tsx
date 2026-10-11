import { ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { home, ui } from "~/content/pages";
import { cn } from "~/lib/cn";
import { useMotionAllowed } from "~/lib/motion";
import { caseStudyPath, indexLabel, type ProjectSummary } from "~/lib/project";
import { useHydrated } from "~/lib/useHydrated";
import { DeviceStill } from "./DeviceStill";

const INTERVAL = 4200;

/**
 * Hero showreel: the same laptop and phone, cycling through the selected projects. Every
 * render shares one pose, so the cross-fade reads as the screens changing. Only the first
 * project is in the prerendered HTML; the rest arrive after hydration. Autoplay needs motion,
 * pauses on hover/focus or with the button (WCAG 2.2.2), and stops while the tab is hidden.
 */
export function DeviceReel({ projects }: { projects: ProjectSummary[] }) {
  const reel = projects.filter((p) => p.devices.laptop);
  const hydrated = useHydrated();
  const motion = useMotionAllowed();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const playing = motion && !paused && !held && reel.length > 1;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % reel.length);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [playing, reel.length]);

  const current = reel[active];
  if (!current) return null;

  return (
    <div
      className="relative"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <TransitionLink
        to={caseStudyPath(current)}
        label={current.title}
        data-cursor={ui.view}
        aria-label={`${home.hero.reelLink} ${current.title}`}
        className="relative block aspect-[7/5] w-full"
      >
        {reel.map((project, i) =>
          i === 0 || hydrated ? (
            <div
              key={project.slug}
              aria-hidden={i !== active}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out-3",
                i === active ? "opacity-100" : "opacity-0",
              )}
            >
              <DeviceStill
                devices={project.devices}
                sizes="(min-width: 1600px) 900px, (min-width: 1024px) 56vw, 92vw"
                phoneSizes="(min-width: 1024px) 16vw, 28vw"
                priority={i === 0}
                decorative={i !== active}
              />
            </div>
          ) : null,
        )}
      </TransitionLink>

      <div className="mt-10 flex items-center justify-between gap-4 md:mt-12">
        <p className="flex min-w-0 items-baseline gap-3" aria-live="polite">
          <span className="meta text-muted tabular-nums">
            {indexLabel(active + 1)} / {indexLabel(reel.length)}
          </span>
          <TransitionLink
            to={caseStudyPath(current)}
            label={current.title}
            className="group inline-flex min-h-11 items-center gap-2 truncate font-semibold tracking-tight"
          >
            {current.title}
            <ArrowRight
              className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </TransitionLink>
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <ul className="hidden items-center gap-1.5 sm:flex">
            {reel.map((project, i) => (
              <li key={project.slug}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`${home.hero.reelShow} ${project.title}`}
                  aria-current={i === active}
                  className="group grid size-6 place-items-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-500",
                      i === active ? "w-5 bg-accent" : "w-1.5 bg-line-strong group-hover:bg-fg",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
          {motion && reel.length > 1 && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? home.hero.reelPlay : home.hero.reelPause}
              className="grid size-11 place-items-center rounded-full border border-line-strong transition-colors hover:border-fg"
            >
              {paused ? (
                <Play className="size-3.5" aria-hidden />
              ) : (
                <Pause className="size-3.5" aria-hidden />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
