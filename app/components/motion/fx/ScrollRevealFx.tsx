import { EASE_IN, ScrollTrigger, gsap, useGSAP } from "~/lib/gsap";

/** Where each kind of reveal starts from. Transform and opacity only: nothing re-lays out. */
const FROM: Record<string, gsap.TweenVars> = {
  up: { y: 56, autoAlpha: 0 },
  /** Slides in from the right: for items in a row (carousels, list rows). */
  left: { x: 80, autoAlpha: 0 },
  /** Rises while settling from slightly smaller: for big cards and panels. */
  scale: { y: 40, scale: 0.94, autoAlpha: 0 },
  fade: { autoAlpha: 0 },
};

/**
 * Animation island for <ScrollReveal>. Every [data-reveal] in <main> that is still below the
 * fold rises into place as it scrolls into view; whatever arrives together (a row of cards)
 * comes in as one staggered batch. [data-parallax="n"] drifts n% of its height against the
 * scroll. Elements already on screen are left alone, so nothing flashes, and with reduced
 * motion this island never mounts: the markup is simply static.
 */
export default function ScrollRevealFx() {
  useGSAP(() => {
    const root = document.getElementById("main");
    if (!root) return;

    // Only what is below the fold is hidden, so a reveal is never seen popping in, and a page
    // restored mid-scroll keeps everything above it visible.
    const fold = window.innerHeight * 0.92;
    const items = gsap.utils
      .toArray<HTMLElement>("[data-reveal]", root)
      .filter((el) => el.getBoundingClientRect().top > fold);
    for (const el of items) gsap.set(el, FROM[el.dataset.reveal ?? ""] ?? FROM.up!);

    const shown = new WeakSet<Element>();
    const show = (batch: Element[]) => {
      const fresh = batch.filter((el) => !shown.has(el));
      if (!fresh.length) return;
      fresh.forEach((el) => shown.add(el));
      gsap.to(fresh, {
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 1.1,
        ease: EASE_IN,
        stagger: 0.08,
        overwrite: true,
        // Leave no inline transform behind: no lingering GPU layers, and hover effects that
        // use transform work as before.
        clearProps: "transform,opacity,visibility",
      });
    };
    if (items.length) {
      ScrollTrigger.batch(items, {
        start: "top 90%",
        interval: 0.08,
        batchMax: 6,
        onEnter: show,
        // Jumped straight past (End key, a long anchor link): reveal rather than stay hidden.
        onLeave: show,
      });
    }

    for (const el of gsap.utils.toArray<HTMLElement>("[data-parallax]", root)) {
      const amount = Number(el.dataset.parallax) || 4;
      gsap.fromTo(
        el,
        { yPercent: amount },
        {
          yPercent: -amount,
          ease: "none",
          // Stay on the GPU between scrubs, instead of being promoted and dropped (and redrawn)
          // every time the scroll stops and starts.
          force3D: true,
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }
  });
  return null;
}
