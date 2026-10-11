import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { loadGsap, useMotionAllowed } from "~/lib/motion";
import { routeLabel } from "~/lib/routeLabel";
import { normalizePath } from "~/lib/usePathname";
import { prefersReducedMotion } from "~/lib/useReducedMotion";
import { useLenis } from "./SmoothScroll";

type Go = (to: string, label?: string) => void;
type GsapModule = Awaited<ReturnType<typeof loadGsap>>;
const TransitionContext = createContext<Go | null>(null);

/** Navigate with the cobalt-panel wipe (falls back to plain navigation). */
export function useTransitionNavigate(): Go {
  const go = useContext(TransitionContext);
  const navigate = useNavigate();
  return go ?? ((to) => void navigate(to));
}

const COVER = 0.3;
const REVEAL = 0.34;

/**
 * Full-screen cobalt panel that wipes up over the old page, shows the destination title in lime,
 * then wipes off the new one. ~650ms end to end. Skipped with reduced motion, on back/forward,
 * and before GSAP has loaded (it's fetched in the background right after hydration).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const lenis = useLenis();
  const motion = useMotionAllowed();
  const panel = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const pending = useRef(false);
  const lib = useRef<GsapModule | null>(null);

  useEffect(() => {
    if (!motion) return;
    void loadGsap().then((mod) => (lib.current = mod));
  }, [motion]);

  const go = useCallback<Go>(
    (to, title) => {
      const samePage =
        normalizePath(to.split(/[?#]/)[0] ?? "/") === normalizePath(location.pathname);
      const g = lib.current;
      if (samePage || pending.current || prefersReducedMotion() || !g || !panel.current) {
        void navigate(to);
        return;
      }
      pending.current = true;
      if (label.current) label.current.textContent = title ?? routeLabel(to);
      lenis?.stop();
      g.gsap
        .timeline()
        .set(panel.current, { yPercent: 100, visibility: "visible" })
        .to(panel.current, { yPercent: 0, duration: COVER, ease: g.EASE_PAGE })
        .fromTo(
          label.current,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.18 },
          "-=0.1",
        )
        .add(() => void navigate(to));
    },
    [location.pathname, navigate, lenis],
  );

  // The new page has rendered underneath the panel: wipe it away.
  useLayoutEffect(() => {
    const g = lib.current;
    if (!pending.current || !g) return;
    pending.current = false;
    lenis?.start();
    g.gsap
      .timeline()
      .to(label.current, { autoAlpha: 0, duration: 0.12 })
      .to(panel.current, { yPercent: -100, duration: REVEAL, ease: g.EASE_PAGE }, "<0.04")
      .set(panel.current, { visibility: "hidden" });
  }, [location.key, lenis]);

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div
        ref={panel}
        aria-hidden="true"
        className="invisible fixed inset-0 z-[80] flex items-end theme-cobalt will-change-transform"
      >
        <div className="container-site pt-5 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          <p ref={label} className="display text-[clamp(2.5rem,8vw,7rem)] text-lime" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
