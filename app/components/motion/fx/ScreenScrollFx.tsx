import { gsap, useGSAP } from "~/lib/gsap";

type Ref<T> = React.RefObject<T | null>;

type Props = {
  section: Ref<HTMLElement>;
  frame: Ref<HTMLElement>;
  viewport: Ref<HTMLElement>;
  page: Ref<HTMLElement>;
  /** Capture height / width, so the scroll distance is known before the image loads. */
  ratio: number;
  /** False when the capture is one screen tall: the window only slides up. */
  scrolls: boolean;
};

/**
 * Animation island for <ScreenScroll>. Two scrubbed tweens:
 *  1. as the section arrives, the window slides up out of a slight tilt and settles;
 *  2. while the section is held (CSS sticky), the site scrolls inside the window, from its top
 *     to the bottom of the capture.
 */
export default function ScreenScrollFx({ section, frame, viewport, page, ratio, scrolls }: Props) {
  useGSAP(() => {
    const s = section.current;
    const f = frame.current;
    const vp = viewport.current;
    const pg = page.current;
    if (!s || !f || !vp || !pg) return;

    gsap.fromTo(
      f,
      { yPercent: 16, scale: 0.9, rotateX: 12, transformPerspective: 1800, transformOrigin: "50% 100%" },
      {
        yPercent: 0,
        scale: 1,
        rotateX: 0,
        ease: "none",
        scrollTrigger: { trigger: s, start: "top bottom", end: "top 12%", scrub: 0.6 },
      },
    );

    if (!scrolls) return;
    gsap.fromTo(
      pg,
      { y: 0 },
      {
        // How far the capture overhangs the screen, from its known proportions.
        y: () => -Math.max(0, vp.offsetWidth * ratio - vp.offsetHeight),
        ease: "none",
        scrollTrigger: {
          trigger: s,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      },
    );
  });
  return null;
}
