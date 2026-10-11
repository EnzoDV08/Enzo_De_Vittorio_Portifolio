import { ScrollTrigger, gsap, useGSAP } from "~/lib/gsap";

type Props = {
  root: React.RefObject<HTMLDivElement | null>;
  wall: React.RefObject<HTMLDivElement | null>;
  /** How many times each column repeats its screens; the loop moves one copy. */
  copies: number;
};

/** How much page scroll speed (px/s) carries into the columns. */
const SCROLL_PULL = 0.4;
/** Fastest a column may move, in px/s, however hard the page is flung. */
const MAX_SPEED = 2600;

/**
 * Animation island for <HeroWall>. Takes over from the CSS drift without a jump and keeps every
 * column looping in its own direction, but now the page scroll pushes it: scrolling down speeds
 * the columns up, scrolling back up throws them the other way, and the push eases off when the
 * scroll stops. As the hero leaves, the whole wall straightens out and leans in.
 */
export default function HeroWallFx({ root, wall, copies }: Props) {
  useGSAP(() => {
    const box = root.current;
    const inner = wall.current;
    if (!box || !inner) return;
    const stacks = [...inner.querySelectorAll<HTMLElement>("[data-wall-column]")];
    if (stacks.length === 0) return;

    // Hand over from the CSS animation at exactly the point it had reached.
    const columns = stacks.map((el, i) => {
      const y = new DOMMatrixReadOnly(getComputedStyle(el).transform).m42;
      const seconds = parseFloat(el.style.animationDuration) || 36;
      return { el, y, seconds, dir: i % 2 === 0 ? -1 : 1, copy: 0, base: 0 };
    });
    box.dataset.fx = "on";
    const setters = columns.map((c) => gsap.quickSetter(c.el, "y", "px"));

    const measure = () => {
      for (const c of columns) {
        c.copy = c.el.offsetHeight / copies;
        c.base = c.copy / c.seconds;
      }
    };
    measure();

    let push = 0;
    let slow = 1;
    let slowTarget = 1;
    let visible = true;
    const trigger = ScrollTrigger.create({
      trigger: box,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (visible = self.isActive),
      onUpdate: (self) => (push = gsap.utils.clamp(-MAX_SPEED, MAX_SPEED, self.getVelocity())),
      onRefresh: measure,
    });

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      push *= Math.pow(0.04, dt);
      slow += (slowTarget - slow) * Math.min(1, dt * 4);
      if (!visible) return;
      columns.forEach((c, i) => {
        const speed = gsap.utils.clamp(-MAX_SPEED, MAX_SPEED, c.base * slow + push * SCROLL_PULL);
        c.y = gsap.utils.wrap(-c.copy, 0, c.y + c.dir * speed * dt);
        setters[i]!(c.y);
      });
    };
    gsap.ticker.add(tick);

    // Hovering the wall lets it drift slowly, so a screen can be looked at.
    const hold = () => (slowTarget = 0.15);
    const release = () => (slowTarget = 1);
    box.addEventListener("pointerenter", hold);
    box.addEventListener("pointerleave", release);

    // The wall straightens out and leans in as the hero scrolls away.
    gsap.set(inner, { x: 0, y: 0, xPercent: -50, yPercent: -50, rotation: -20, scale: 1 });
    gsap.to(inner, {
      rotation: -8,
      scale: 1.22,
      ease: "none",
      scrollTrigger: { trigger: box, start: "top top+=96", end: "bottom top", scrub: 0.8 },
    });

    return () => {
      gsap.ticker.remove(tick);
      trigger.kill();
      box.removeEventListener("pointerenter", hold);
      box.removeEventListener("pointerleave", release);
      delete box.dataset.fx;
    };
  });

  return null;
}
