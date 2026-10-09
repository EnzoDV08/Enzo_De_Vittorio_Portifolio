import { useRef } from "react";
import { EASE_IN, SplitText, gsap, useGSAP } from "~/lib/gsap";
import { inViewAtMount } from "~/lib/inView";
import { useReducedMotion } from "~/lib/useReducedMotion";

type Tag = "h1" | "h2" | "h3" | "p" | "blockquote";
type Props = { as?: Tag; className?: string; children: React.ReactNode; id?: string };

/**
 * Heading whose lines rise out of a mask as it scrolls into view (GSAP SplitText).
 * Plain, fully visible text with reduced motion, before hydration, or if it's already on screen.
 */
export function RevealText({ as = "h2", className, children, id }: Props) {
  // All allowed tags are block text elements; type them as one so the ref fits.
  const Tag = as as "h2";
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el || inViewAtMount(el)) return;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1,
            stagger: 0.08,
            ease: EASE_IN,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
      });
      return () => split.revert();
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
