import { useRef } from "react";
import { cn } from "~/lib/cn";
import { EASE_IN, gsap, useGSAP } from "~/lib/gsap";
import { inViewAtMount } from "~/lib/inView";
import { useReducedMotion } from "~/lib/useReducedMotion";

type Props = { children: React.ReactNode; className?: string; innerClassName?: string };

/** Media that wipes open from the bottom (clip-path) while settling from 1.1× scale. */
export function RevealMedia({ children, className, innerClassName }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el || inViewAtMount(el)) return;
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } })
        .fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EASE_IN },
        )
        .fromTo(inner.current, { scale: 1.1 }, { scale: 1, duration: 1.4, ease: EASE_IN }, "<");
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-clip", className)}>
      <div ref={inner} className={cn("relative size-full", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
