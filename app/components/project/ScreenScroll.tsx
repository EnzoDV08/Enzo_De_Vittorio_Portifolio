import { lazy, useRef } from "react";
import { Island } from "~/components/motion/Island";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { cn } from "~/lib/cn";
import type { Picture } from "~/lib/images";
import { useMotionAllowed } from "~/lib/motion";
import { useMediaQuery } from "~/lib/useMediaQuery";

const ScreenScrollFx = lazy(() => import("~/components/motion/fx/ScreenScrollFx"));

/** Screen proportions: 16:10, like the captures (scripts/devices/capture-scroll.mjs). */
const SCREEN_RATIO = 10 / 16;

type Props = {
  /** Tall capture of the top of the site. */
  picture: Picture;
  alt: string;
  /** Shown in the address pill. */
  address: string;
  label: string;
};

/**
 * The case study's live site, in a browser window. With motion, the window
 * slides up into place as it arrives, then holds (CSS sticky) while the site scrolls inside it
 * for a short stretch, the top of the page, not all of it, and the page moves on.
 * The layout is CSS (motion-safe), so it is the same before and after JS; ScreenScrollFx only
 * animates. With reduced motion it is a still window showing the top of the site.
 */
export function ScreenScroll({ picture, alt, address, label }: Props) {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const motion = useMotionAllowed();
  const desktop = useMediaQuery("(min-width: 768px)");
  const ratio = picture.img.h / picture.img.w;
  // A capture taller than the screen has something to scroll through; one screen tall doesn't.
  const scrolls = ratio > SCREEN_RATIO * 1.1;

  return (
    <>
      <section
        ref={section}
        aria-label={label}
        className={cn(
          "relative mt-12 hidden md:mt-16 md:block",
          scrolls && "motion-safe:h-[210svh]",
        )}
      >
        <div
          className={cn(
            // Held below the fixed nav (pt), centred in what is left of the screen.
            scrolls &&
              "motion-safe:sticky motion-safe:top-0 motion-safe:flex motion-safe:h-svh motion-safe:items-center motion-safe:pt-20 motion-safe:pb-4",
          )}
        >
          <div className="container-site w-full">
            <div
              ref={frame}
              className="relative mx-auto w-full max-w-[min(100%,calc((100svh-15rem)*1.6))] rounded-[clamp(14px,1.6vw,26px)] border border-white/12 bg-[#0d0f17] p-[clamp(6px,0.7vw,10px)] shadow-[0_40px_120px_-40px_rgb(0_0_0/0.35)]"
            >
              <div aria-hidden="true" className="relative flex h-9 items-center px-2 md:h-11">
                <span className="flex gap-1.5">
                  <i className="size-2.5 rounded-full bg-white/25" />
                  <i className="size-2.5 rounded-full bg-white/25" />
                  <i className="size-2.5 rounded-full bg-white/25" />
                </span>
                <span className="absolute left-1/2 max-w-[55%] -translate-x-1/2 truncate rounded-full border border-white/15 px-4 py-1 text-[0.72rem] text-white/70 md:text-xs">
                  https://<span className="text-white">{address}</span>
                </span>
              </div>
              <div
                ref={viewport}
                className="bg-black relative aspect-16/10 overflow-clip rounded-[clamp(10px,1.1vw,18px)]"
              >
                <div ref={page} className="absolute inset-x-0 top-0 will-change-transform">
                  <ResponsiveImage
                    picture={picture}
                    alt={alt}
                    sizes="(min-width: 1280px) 76vw, 92vw"
                    className="block"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {motion && desktop && (
        <Island>
          <ScreenScrollFx
            section={section}
            frame={frame}
            viewport={viewport}
            page={page}
            ratio={ratio}
            scrolls={scrolls}
          />
        </Island>
      )}
    </>
  );
}
