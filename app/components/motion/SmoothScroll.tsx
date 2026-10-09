import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigationType } from "react-router";
import { ScrollTrigger, gsap } from "~/lib/gsap";
import { useReducedMotion } from "~/lib/useReducedMotion";

const LenisContext = createContext<Lenis | null>(null);

/** The active Lenis instance, or null (reduced motion, prerender, before hydration). */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
 * Uses native scroll position (no transforms), so keyboard scrolling, find-in-page and anchor
 * links all keep working. Off entirely with reduced motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({
      autoRaf: false,
      anchors: { offset: -80 },
      lerp: 0.11,
      // Let nested scrollers (menus, galleries, textareas) scroll on their own.
      allowNestedScroll: true,
    });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // New page. <ScrollRestoration> has already set the position (top for links, the saved spot
  // for back/forward); bring Lenis in line so leftover inertia can't drag the page elsewhere.
  useEffect(() => {
    if (lenis) {
      const top = navigationType === "POP" || hash ? window.scrollY : 0;
      lenis.scrollTo(top, { immediate: true, force: true });
      lenis.resize();
    }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run per page, not per lenis change
  }, [pathname]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
