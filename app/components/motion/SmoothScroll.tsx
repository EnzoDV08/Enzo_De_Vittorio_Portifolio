import type Lenis from "lenis";
import { Island } from "~/components/motion/Island";
import { createContext, lazy, useContext, useEffect, useState } from "react";
import { useLocation, useNavigationType } from "react-router";
import { loadGsap, useMotionAllowed } from "~/lib/motion";
import { usePathname } from "~/lib/usePathname";

const LenisFx = lazy(() => import("./fx/LenisFx"));
const LenisContext = createContext<Lenis | null>(null);

/** The active Lenis instance, or null (reduced motion, prerender, before it loads). */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
 * Uses native scroll position (no transforms), so keyboard scrolling, find-in-page and anchor
 * links keep working. Loaded after hydration as a lazy island; absent with reduced motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const motion = useMotionAllowed();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const { hash } = useLocation();
  const pathname = usePathname();
  const navigationType = useNavigationType();

  // New page. <ScrollRestoration> has already set the position (top for links, the saved spot
  // for back/forward); bring Lenis in line so leftover inertia can't drag the page elsewhere.
  useEffect(() => {
    if (lenis) {
      const top = navigationType === "POP" || hash ? window.scrollY : 0;
      lenis.scrollTo(top, { immediate: true, force: true });
      lenis.resize();
    }
    let frame = 0;
    if (motion) {
      void loadGsap().then(({ ScrollTrigger }) => {
        frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    }
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run per page, not per lenis change
  }, [pathname]);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
      {motion && (
        <Island>
          <LenisFx onReady={setLenis} />
        </Island>
      )}
    </LenisContext.Provider>
  );
}
