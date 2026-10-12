import { lazy, useRef } from "react";
import { Island } from "~/components/motion/Island";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { cn } from "~/lib/cn";
import type { Picture } from "~/lib/images";
import { useMotionAllowed } from "~/lib/motion";

const HeroWallFx = lazy(() => import("~/components/motion/fx/HeroWallFx"));

export type HeroWallColumn = { key: string; picture: Picture }[];

/** Seconds a screen takes to drift its own height plus the gap. */
const SECONDS_PER_SCREEN = 9;
/**
 * Copies of each column. The loop moves one copy's height, and the wall is centred on its
 * middle, so four copies keep the box filled at every point of the loop.
 */
const WALL_COPIES = 4;
const LIGHTS = ["#ff5f57", "#febc2e", "#28c840"];

/**
 * The home hero's tilted wall of project screens. Each column repeats its screens and drifts one
 * copy's height, so the loop is seamless; neighbouring columns run in opposite directions and
 * start at different points. HeroWallFx slows it on hover. The drift is CSS, so it starts at first paint and stands still with reduced motion;
 * once the page has hydrated, HeroWallFx takes it over and ties it to the page scroll.
 * Decorative, the projects themselves are listed right below the hero.
 */
export function HeroWall({ columns }: { columns: HeroWallColumn[] }) {
  const root = useRef<HTMLDivElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const motion = useMotionAllowed();
  return (
    <>
      <div ref={root} aria-hidden="true" className="group/wall absolute inset-0 overflow-hidden">
        <div
          ref={wall}
          className="absolute top-1/2 left-1/2 flex w-[165%] screen-wall gap-4 md:gap-6"
        >
          {columns.map((column, c) => (
            <div key={c} className="min-w-0 flex-1">
              <div
                data-wall-column
                className={cn(
                  "flex flex-col gap-4 pb-4 md:gap-6 md:pb-6",
                  "group-data-[fx=on]/wall:animate-none motion-safe:animate-wall",
                  c % 2 === 1 && "[animation-direction:reverse]",
                )}
                style={{
                  animationDuration: `${column.length * SECONDS_PER_SCREEN}s`,
                  animationDelay: `${-((c * 0.37) % 1) * column.length * SECONDS_PER_SCREEN}s`,
                }}
              >
                {Array.from({ length: WALL_COPIES }, () => column)
                  .flat()
                  .map((screen, i) => (
                    <div
                      key={`${screen.key}-${i}`}
                      className="overflow-clip rounded-lg bg-white shadow-[0_30px_60px_-30px_rgb(5_8_30/0.55)]"
                    >
                      <div className="flex h-5 items-center gap-1 px-2.5 md:h-6 md:gap-1.5 md:px-3">
                        {LIGHTS.map((color) => (
                          <i
                            key={color}
                            className="size-1.5 rounded-full md:size-2"
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                      <div className="aspect-[16/10]">
                        <ResponsiveImage
                          picture={screen.picture}
                          alt=""
                          sizes="(min-width: 1024px) 18vw, 40vw"
                          className="size-full object-cover object-top"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* After the element, not inside it: React attaches a parent's ref only after its
        children's effects run, so an island inside would find the ref still empty. */}
      {motion && (
        <Island>
          <HeroWallFx root={root} wall={wall} copies={WALL_COPIES} />
        </Island>
      )}
    </>
  );
}
