import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { cn } from "~/lib/cn";
import type { Picture } from "~/lib/images";

export type HeroWallColumn = { key: string; picture: Picture }[];

/** Seconds a screen takes to drift its own height plus the gap. */
const SECONDS_PER_SCREEN = 9;

/**
 * The home hero's tilted wall of project screens. Each column holds two copies of its screens
 * and drifts half its height, so the loop is seamless; neighbouring columns run in opposite
 * directions. Pure CSS: it starts at first paint, pauses on hover, and stands still with reduced
 * motion. Decorative, the projects themselves are listed right below the hero.
 */
export function HeroWall({ columns }: { columns: HeroWallColumn[] }) {
  return (
    <div aria-hidden="true" className="group/wall absolute inset-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 flex w-[165%] gap-4 screen-wall md:gap-6">
        {columns.map((column, c) => (
          <div key={c} className={cn("min-w-0 flex-1", c % 2 === 1 && "-mt-[18%]")}>
            <div
              className={cn(
                "flex flex-col gap-4 pb-4 md:gap-6 md:pb-6",
                "motion-safe:animate-wall group-hover/wall:[animation-play-state:paused]",
                c % 2 === 1 && "[animation-direction:reverse]",
              )}
              style={{ animationDuration: `${column.length * SECONDS_PER_SCREEN}s` }}
            >
              {[...column, ...column].map((screen, i) => (
                <div
                  key={`${screen.key}-${i}`}
                  className="overflow-clip rounded-lg bg-white shadow-[0_30px_60px_-30px_rgb(5_8_30/0.55)]"
                >
                  <div className="flex h-5 items-center gap-1 px-2.5 md:h-6 md:gap-1.5 md:px-3">
                    <i className="size-1.5 rounded-full bg-[#ff5f57] md:size-2" />
                    <i className="size-1.5 rounded-full bg-[#febc2e] md:size-2" />
                    <i className="size-1.5 rounded-full bg-[#28c840] md:size-2" />
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
  );
}
