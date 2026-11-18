import { lazy } from "react";
import { Island } from "~/components/motion/Island";
import { useMotionAllowed } from "~/lib/motion";

const ScrollRevealFx = lazy(() => import("./fx/ScrollRevealFx"));

/**
 * Scroll reveals for the page: mark elements with data-reveal ("up" | "left" | "scale" | "fade")
 * or data-parallax="n" and place this once, last in the page. One small lazy island drives
 * them all. Without motion it renders nothing and the page is simply static.
 * Never put data-reveal / data-parallax on an element with a CSS transition on transform or
 * opacity (the transition would drag every frame); mark a wrapper instead.
 */
export function ScrollReveal() {
  const motion = useMotionAllowed();
  if (!motion) return null;
  return (
    <Island>
      <ScrollRevealFx />
    </Island>
  );
}
