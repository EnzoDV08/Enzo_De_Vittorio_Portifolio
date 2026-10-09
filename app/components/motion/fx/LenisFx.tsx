import Lenis from "lenis";
import { useEffect } from "react";
import { ScrollTrigger, gsap } from "~/lib/gsap";

/** Creates Lenis on GSAP's ticker and hands it up. Destroyed on unmount (e.g. reduced motion). */
export default function LenisFx({ onReady }: { onReady: (lenis: Lenis | null) => void }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      anchors: { offset: -80 },
      lerp: 0.11,
      // Let nested scrollers (menus, galleries, textareas) scroll on their own.
      allowNestedScroll: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    onReady(lenis);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      onReady(null);
    };
  }, [onReady]);
  return null;
}
