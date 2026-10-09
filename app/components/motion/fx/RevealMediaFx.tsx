import { EASE_IN, gsap, useGSAP } from "~/lib/gsap";
import { inViewAtMount } from "~/lib/inView";

type Props = {
  frame: React.RefObject<HTMLElement | null>;
  inner: React.RefObject<HTMLElement | null>;
};

/** Animation half of <RevealMedia>: clip-path wipe from the bottom while settling from 1.1×. */
export default function RevealMediaFx({ frame, inner }: Props) {
  useGSAP(() => {
    const el = frame.current;
    if (!el || inViewAtMount(el)) return;
    gsap
      .timeline({
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      })
      .fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EASE_IN },
      )
      .fromTo(inner.current, { scale: 1.1 }, { scale: 1, duration: 1.4, ease: EASE_IN }, "<");
  });
  return null;
}
