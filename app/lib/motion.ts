import type * as GsapModule from "./gsap";
import { useHydrated } from "./useHydrated";
import { useReducedMotion } from "./useReducedMotion";

/**
 * True once the page has hydrated and the visitor hasn't asked for reduced motion.
 * Motion "islands" (components/motion/fx) only mount when this is true, which keeps GSAP,
 * its plugins and Lenis out of the initial JavaScript entirely.
 */
export function useMotionAllowed(): boolean {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  return hydrated && !reduced;
}

let gsapModule: Promise<typeof GsapModule> | null = null;

/** Load (once) the GSAP module. Called after hydration so the first interaction is instant. */
export function loadGsap() {
  gsapModule ??= import("./gsap");
  return gsapModule;
}
