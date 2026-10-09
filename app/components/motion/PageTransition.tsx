import { createContext, useCallback, useContext, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { EASE_PAGE, gsap } from "~/lib/gsap";
import { routeLabel } from "~/lib/routeLabel";
import { prefersReducedMotion } from "~/lib/useReducedMotion";
import { useLenis } from "./SmoothScroll";

type Go = (to: string) => void;
const TransitionContext = createContext<Go | null>(null);

/** Navigate with the ink-panel wipe (falls back to plain navigation). */
export function useTransitionNavigate(): Go {
  const go = useContext(TransitionContext);
  const navigate = useNavigate();
  return go ?? ((to) => void navigate(to));
}

const COVER = 0.3;
const REVEAL = 0.34;

/**
 * Full-screen ink panel that wipes up over the old page, shows the destination title in mono,
 * then wipes off the new one. ~650ms end to end. Skipped entirely with reduced motion and on
 * back/forward (those should feel instant).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const pending = useRef(false);

  const go = useCallback<Go>(
    (to) => {
      const samePage = to.split(/[?#]/)[0] === location.pathname;
      if (samePage || pending.current || prefersReducedMotion() || !panel.current) {
        void navigate(to);
        return;
      }
      pending.current = true;
      if (label.current) label.current.textContent = routeLabel(to);
      lenis?.stop();
      gsap
        .timeline()
        .set(panel.current, { yPercent: 100, visibility: "visible" })
        .to(panel.current, { yPercent: 0, duration: COVER, ease: EASE_PAGE })
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
    if (!pending.current) return;
    pending.current = false;
    lenis?.start();
    gsap
      .timeline()
      .to(label.current, { autoAlpha: 0, duration: 0.12 })
      .to(panel.current, { yPercent: -100, duration: REVEAL, ease: EASE_PAGE }, "<0.04")
      .set(panel.current, { visibility: "hidden" });
  }, [location.key, lenis]);

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div
        ref={panel}
        aria-hidden="true"
        className="invisible fixed inset-0 z-[80] flex items-end bg-ink-2 will-change-transform"
      >
        <div className="container-site border-t border-line pt-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <p ref={label} className="meta text-paper" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
