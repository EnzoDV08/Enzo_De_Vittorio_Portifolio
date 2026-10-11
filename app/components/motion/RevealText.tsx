import { lazy, useRef } from "react";
import { Island } from "~/components/motion/Island";
import { useMotionAllowed } from "~/lib/motion";

const RevealTextFx = lazy(() => import("./fx/RevealTextFx"));

type Tag = "h1" | "h2" | "h3" | "p" | "blockquote";
type Props = { as?: Tag; className?: string; children: React.ReactNode; id?: string };

/**
 * Heading whose lines rise out of a mask as it scrolls into view (GSAP SplitText).
 * The text itself is plain, prerendered and always readable; the animation is a lazy island.
 */
export function RevealText({ as = "h2", className, children, id }: Props) {
  // All allowed tags are block text elements; type them as one so the ref fits.
  const Tag = as as "h2";
  const ref = useRef<HTMLHeadingElement>(null);
  const motion = useMotionAllowed();
  return (
    <>
      <Tag ref={ref} id={id} className={className}>
        {children}
      </Tag>
      {motion && (
        <Island>
          <RevealTextFx target={ref} />
        </Island>
      )}
    </>
  );
}
