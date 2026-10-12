import { lazy, useRef } from "react";
import { Island } from "~/components/motion/Island";
import { BrowserFrame } from "~/components/ui/BrowserFrame";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import type { ProjectDetail } from "~/lib/project";
import { cn } from "~/lib/cn";
import { useMotionAllowed } from "~/lib/motion";
import { useMediaQuery } from "~/lib/useMediaQuery";

const GalleryPinFx = lazy(() => import("~/components/motion/fx/GalleryPinFx"));

type Props = {
  images: NonNullable<ProjectDetail["gallery"]>;
  label: string;
  hint: string;
  /** Shown in each frame's address bar. */
  address?: string;
};

/**
 * The site's one pinned section. On desktop with motion allowed, vertical scroll drives the
 * strip sideways while the section is pinned. Below 1024px, or with reduced motion, it's a
 * native scroll-snap strip you can swipe, trackpad or arrow-key through.
 */
export function HorizontalGallery({ images, label, hint, address }: Props) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const motion = useMotionAllowed();
  const pinned = desktop && motion;

  return (
    <>
      <section ref={section} aria-label={label} className="overflow-clip">
        <div className={cn(pinned && "flex h-svh flex-col justify-center")}>
          <div className="container-site mb-6 flex items-baseline justify-between text-sm font-medium text-muted">
            <span>{label}</span>
            <span>
              {String(images.length).padStart(2, "0")} <span aria-hidden="true">—</span> {hint}
            </span>
          </div>
          <div
            ref={track}
            // Keyboard users can focus the strip and scroll it with arrow keys when it's native.
            tabIndex={pinned ? undefined : 0}
            role={pinned ? undefined : "region"}
            aria-label={pinned ? undefined : label}
            className={cn(
              "flex gap-4 md:gap-6",
              pinned
                ? "w-max px-[var(--spacing-gutter)] will-change-transform"
                : "snap-x snap-mandatory scroll-px-[var(--spacing-gutter)] [scrollbar-width:thin] overflow-x-auto overscroll-x-contain px-[var(--spacing-gutter)] pb-4",
            )}
          >
            {images.map((image) => (
              <figure
                key={image.src}
                className={cn(
                  "shrink-0 snap-start",
                  pinned ? "w-[min(68vw,72rem)]" : "w-[85vw] md:w-[70vw]",
                )}
              >
                <BrowserFrame label={address}>
                  <div className="relative aspect-[16/10] bg-bg-2">
                    <ResponsiveImage
                      picture={image.picture}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 68vw, 85vw"
                    />
                  </div>
                </BrowserFrame>
                {image.caption && (
                  <figcaption className="mt-3 text-sm text-muted">{image.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>
      {/* After the element, not inside it: React attaches a parent's ref only after its
        children's effects run, so an island inside would find the ref still empty. */}
      {pinned && (
        <Island>
          <GalleryPinFx section={section} track={track} />
        </Island>
      )}
    </>
  );
}
