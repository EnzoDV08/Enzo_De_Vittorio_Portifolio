import { gsap, ScrollTrigger, useGSAP } from "~/lib/gsap";

type Props = {
  section: React.RefObject<HTMLElement | null>;
  track: React.RefObject<HTMLElement | null>;
};

/** Animation island for <HorizontalGallery>: pin the section and scrub the strip sideways. */
export default function GalleryPinFx({ section, track }: Props) {
  useGSAP(() => {
    const el = track.current;
    if (!el) return;
    const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
    gsap.to(el, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section.current,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // The pin's start is measured once, but the page above keeps settling after this mounts:
    // web fonts swap in, images decode, other islands resize their sections. Re-measure
    // whenever the page height changes, so the pin starts where the section actually is.
    // The pin is the only thing that adds height, so put triggers back in page order first.
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
    refresh();

    return () => {
      live = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  });
  return null;
}
