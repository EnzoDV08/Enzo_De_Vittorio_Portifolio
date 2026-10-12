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

  // ScrollTriggers measure their start and end once, but pages keep settling after the islands
  // mount: web fonts swap in, images decode, sections grow when motion turns on. Whenever the
  // page height changes, re-measure every trigger, in page order (pins add height below them),
  // so the device stage and the pinned gallery start where their sections actually are.
  useEffect(() => {
    let frame = 0;
    let live = true;
    let height = document.body.offsetHeight;
    const refresh = () => {
      if (!live) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        height = document.body.offsetHeight;
      });
    };
    const observer = new ResizeObserver(() => {
      if (document.body.offsetHeight !== height) refresh();
    });
    observer.observe(document.body);
    void document.fonts.ready.then(refresh);
    return () => {
      live = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);
  return null;
}
