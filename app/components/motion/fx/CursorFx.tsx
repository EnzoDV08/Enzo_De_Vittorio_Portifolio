import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP } from "~/lib/gsap";

/** Animation island for <Cursor>. */
export default function Follower() {
  const root = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
      let shown = false;

      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!shown) {
          gsap.set(el, { x: e.clientX, y: e.clientY });
          shown = true;
        }
        x(e.clientX);
        y(e.clientY);
      };
      const over = (e: PointerEvent) => {
        const target = e.target as Element | null;
        const media = target?.closest<HTMLElement>("[data-cursor]");
        const field = target?.closest("input, textarea, select, [contenteditable='true']");
        el.dataset.state = media ? "label" : field ? "hidden" : "dot";
        if (media && text.current) text.current.textContent = media.dataset.cursor ?? "";
      };
      const leave = () => (el.dataset.state = "hidden");

      document.documentElement.classList.add("has-cursor");
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerover", over, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      return () => {
        document.documentElement.classList.remove("has-cursor");
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-state="hidden"
      className="group/cursor pointer-events-none fixed top-0 left-0 z-[70] -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className={
          "flex items-center justify-center gap-1.5 overflow-clip rounded-full text-sm font-semibold whitespace-nowrap " +
          "transition-[width,height,opacity,background-color] duration-300 ease-out-3 " +
          "size-2.5 bg-white opacity-100 mix-blend-difference " +
          "group-data-[state=hidden]/cursor:opacity-0 " +
          "group-data-[state=label]/cursor:size-24 " +
          "group-data-[state=label]/cursor:bg-lime group-data-[state=label]/cursor:mix-blend-normal"
        }
      >
        <span
          ref={text}
          className="text-night opacity-0 transition-opacity duration-200 group-data-[state=label]/cursor:opacity-100"
        />
        <ArrowRight
          className="size-4 text-night opacity-0 transition-opacity duration-200 group-data-[state=label]/cursor:opacity-100"
          strokeWidth={1.75}
        />
      </div>
    </div>
  );
}
