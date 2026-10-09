import { gsap, useGSAP } from "~/lib/gsap";

type Props = {
  root: React.RefObject<HTMLElement | null>;
  preview: React.RefObject<HTMLElement | null>;
};

/** Animation island for the work index: the preview follows the cursor and fades in and out. */
export default function WorkPreviewFx({ root, preview }: Props) {
  useGSAP(() => {
    const area = root.current;
    const el = preview.current;
    if (!area || !el) return;
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    const show = (on: boolean) =>
      gsap.to(el, {
        autoAlpha: on ? 1 : 0,
        scale: on ? 1 : 0.92,
        duration: on ? 0.5 : 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    const move = (e: PointerEvent) => {
      const box = area.getBoundingClientRect();
      x(e.clientX - box.left);
      y(e.clientY - box.top);
    };
    const enter = (e: PointerEvent) => {
      const box = area.getBoundingClientRect();
      gsap.set(el, { x: e.clientX - box.left, y: e.clientY - box.top });
      show(true);
    };
    const leave = () => show(false);
    area.addEventListener("pointerenter", enter);
    area.addEventListener("pointerleave", leave);
    area.addEventListener("pointermove", move, { passive: true });
    return () => {
      area.removeEventListener("pointerenter", enter);
      area.removeEventListener("pointerleave", leave);
      area.removeEventListener("pointermove", move);
    };
  });
  return null;
}
