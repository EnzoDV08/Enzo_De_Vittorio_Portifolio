import { EASE_IN, SplitText, gsap, useGSAP } from "~/lib/gsap";
import { inViewAtMount } from "~/lib/inView";

/**
 * Animation half of <RevealText>: SplitText lines rise out of a mask on scroll. Masks get a
 * little padding so descenders and italic overhangs aren't clipped mid-animation, and the
 * split is reverted once it has played, leaving the original markup behind.
 */
export default function RevealTextFx({ target }: { target: React.RefObject<HTMLElement | null> }) {
  useGSAP(() => {
    const el = target.current;
    if (!el || inViewAtMount(el)) return;
    const split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      // Lines only (words stay whole) and the split is reverted after playing, so the text
      // reads normally; SplitText's aria-label would be invalid on <p>.
      aria: "none",
      onSplit: (self) => {
        gsap.set(self.masks, {
          paddingBottom: "0.14em",
          marginBottom: "-0.14em",
          paddingInline: "0.1em",
          marginInline: "-0.1em",
        });
        return gsap.from(self.lines, {
          yPercent: 115,
          duration: 1,
          stagger: 0.08,
          ease: EASE_IN,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          onComplete: () => self.revert(),
        });
      },
    });
    return () => split.revert();
  });
  return null;
}
