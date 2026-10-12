import { gsap, useGSAP } from "~/lib/gsap";

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
  });
  return null;
}
