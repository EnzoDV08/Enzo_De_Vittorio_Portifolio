import { gsap, useGSAP } from "~/lib/gsap";

type Props = {
  section: React.RefObject<HTMLElement | null>;
  frame: React.RefObject<HTMLElement | null>;
  backdrop: React.RefObject<HTMLElement | null>;
  content: React.RefObject<HTMLElement | null>;
};

/** How far the frame closes in at the end of the shrink, in px. */
function insetFor(width: number, height: number) {
  if (width < 768) return { x: 22, y: Math.round(height * 0.05), r: 32 };
  return { x: Math.round(width * 0.1), y: Math.round(height * 0.11), r: 56 };
}

/**
 * Animation island for the home hero. From the first scroll, the full-bleed frame closes in to a
 * rounded card as the page moves (clip-path, so nothing reflows and the canvas never resizes),
 * while the backdrop pushes in and the copy settles back. No pin: the page never stops moving.
 */
export default function HeroFrameFx({ section, frame, backdrop, content }: Props) {
  useGSAP(() => {
    const s = section.current;
    const f = frame.current;
    if (!s || !f) return;
    // Own GPU layers for everything that moves or sits under the crop, so a scroll frame only
    // redraws the clip outline, not the hero's contents (the portrait's colour filter, the
    // glass, the canvas). Reverted with the rest when the island unmounts.
    const layers = [
      f,
      backdrop.current,
      content.current,
      f.querySelector<HTMLElement>("[data-hero-portrait]"),
    ].filter(Boolean);
    gsap.set(layers, { willChange: "transform" });
    gsap.set(f, { willChange: "clip-path, transform" });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: s,
        start: "top top",
        // Spread over the hero's whole exit: it keeps closing in while the next section comes up,
        // never finishing early and leaving a still card to scroll past.
        end: "bottom top",
        // Lenis already smooths the scroll, so only a light catch-up on top.
        scrub: 0.35,
        invalidateOnRefresh: true,
      },
    });
    tl.fromTo(
      f,
      { clipPath: "inset(0px 0px 0px 0px round 0px)" },
      {
        clipPath: () => {
          const { x, y, r } = insetFor(window.innerWidth, window.innerHeight);
          return `inset(${y}px ${x}px ${y}px ${x}px round ${r}px)`;
        },
      },
      0,
    );
    if (backdrop.current) tl.fromTo(backdrop.current, { scale: 1 }, { scale: 1.12 }, 0);
    if (content.current) tl.fromTo(content.current, { scale: 1, opacity: 1 }, { scale: 0.92, opacity: 0.85 }, 0);
  });
  return null;
}
