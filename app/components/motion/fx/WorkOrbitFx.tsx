import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { Button } from "~/components/ui/Button";
import { home } from "~/content/pages";
import { cn } from "~/lib/cn";
import type { Picture } from "~/lib/images";
import { disciplinesText, projectHref, type ProjectSummary } from "~/lib/project";
import {
  createOrbit,
  orbitLayout,
  type Orbit,
  type OrbitLayout,
  type VideoSource,
} from "./orbitRenderer";

/** Pointer travel (px) after which a press counts as a drag, not a click. */
const DRAG_SLOP = 6;
/** Pause (ms) after the last sideways wheel event before settling on a project. */
const WHEEL_SETTLE = 160;
/** A gesture that moves the room at least this far (in screens) always lands on the next one. */
const COMMIT = 0.08;

/**
 * Where a gesture that started on screen `from` and has the room at `at` should land: nowhere
 * for a nudge, otherwise at least one screen in the direction it went. So one mouse-wheel notch
 * or a short drag moves exactly one project, and a long swipe moves several.
 */
function landing(from: number, at: number) {
  const travelled = at - from;
  if (Math.abs(travelled) < COMMIT) return from;
  return from + Math.sign(travelled) * Math.max(1, Math.round(Math.abs(travelled)));
}

/** The cover's webp at the smallest width that still fills a texture layer. */
function textureUrl(picture: Picture | undefined) {
  const srcset = picture?.sources.webp;
  if (!srcset) return picture?.img.src;
  const candidates = srcset
    .split(",")
    .map((entry) => entry.trim().split(/\s+/))
    .map(([url = "", w = "0"]) => ({ url, w: parseInt(w, 10) || 0 }))
    .sort((a, b) => a.w - b.w);
  return (candidates.find((c) => c.w >= 1440) ?? candidates.at(-1))?.url ?? picture?.img.src;
}

/**
 * A project's loop as sources in order of preference: AV1 (smallest, most browsers), then
 * H.264 (everything else). Codec strings match scripts/optimize-videos.mjs.
 */
function videoSources(project: ProjectSummary): VideoSource[] | undefined {
  const video = project.video;
  if (!video) return undefined;
  const sources: VideoSource[] = [];
  if (video.av1) sources.push({ src: video.av1, type: 'video/webm; codecs="av01.0.08M.08"' });
  if (video.h264) sources.push({ src: video.h264, type: 'video/mp4; codecs="avc1.640028"' });
  return sources.length ? sources : undefined;
}

/**
 * The disciplines pill. It stays in place; when the text changes its width eases to fit the new
 * text (stretching for longer, shrinking for shorter) while the words cross-fade.
 */
function MorphPill({ text }: { text: string }) {
  const measure = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = measure.current;
    if (!el) return;
    const update = () => setWidth(el.getBoundingClientRect().width);
    update();
    // Fonts swapping in change the width too.
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);
  return (
    <p
      className="relative inline-flex justify-center overflow-clip rounded-full glass py-1.5 meta whitespace-nowrap text-fg transition-[width] duration-700 ease-out-expo"
      style={{ width: width === null ? undefined : width }}
    >
      {/* Invisible copy at natural size, measured for the width the pill eases to. */}
      <span ref={measure} aria-hidden="true" className="invisible absolute left-0 px-3.5">
        {text}
      </span>
      <span key={text} className="px-3.5 animate-fade-up [animation-duration:500ms]">
        {text}
      </span>
    </p>
  );
}

type Props = {
  projects: ProjectSummary[];
  /** No WebGL2: the page swaps the static showcase back in. */
  onFail: () => void;
};

/**
 * The home page's selected work as a room lined with screens (see orbitRenderer). The page
 * scrolls past it normally; it plays its entrance once when it comes into view. Turn it by
 * dragging (mouse or touch), a sideways swipe on a touchpad, a sideways (or shift+) mouse wheel,
 * the arrow buttons, or clicking a side screen. It loops, and settles on the nearest project.
 * Only mounted with motion allowed; otherwise the home page shows <WorkStrip>.
 */
export default function WorkOrbitFx({ projects, onFail }: Props) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const orbit = useRef<Orbit | null>(null);
  const position = useRef(0);
  const suppressClick = useRef(false);
  const labelId = useId();
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [layout, setLayout] = useState<OrbitLayout | null>(null);
  const current = projects[active];

  // The overlay (title, link) is placed from the same geometry the shader uses.
  useEffect(() => {
    const update = () => {
      const el = section.current;
      if (el) setLayout(orbitLayout(el.clientWidth, el.clientHeight));
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const el = canvas.current;
    const stage = section.current;
    if (!el || !stage) return;
    let instance: Orbit | null = null;
    let io: IntersectionObserver | null = null;
    // Build the room (shader compile, texture storage) once the browser is idle, not in the
    // frames right after hydration, where it would stutter the hero's entrance. The room sits
    // below the hero, so it is ready long before anyone scrolls to it.
    const build = () => {
      instance = createOrbit(el, {
        // A project with a preview loop starts on its first frame, so play-in is seamless.
        urls: projects.map((p) => p.video?.poster ?? textureUrl(p.picture)),
        videos: projects.map(videoSources),
        onActive: setActive,
      });
      if (!instance) {
        onFail();
        return;
      }
      orbit.current = instance;
      const built = instance;
      // The entrance plays once, when most of the section is on screen.
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          built.reveal();
          setRevealed(true);
          io?.disconnect();
        },
        // Later: once the section is well into view (its middle past the lower third of the
        // screen), not as soon as its top peeks in.
        { threshold: 0.6, rootMargin: "0px 0px -12% 0px" },
      );
      io.observe(stage);
    };
    const idle = "requestIdleCallback" in window;
    const handle = idle
      ? window.requestIdleCallback(build, { timeout: 1200 })
      : window.setTimeout(build, 200);
    return () => {
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      io?.disconnect();
      instance?.dispose();
      orbit.current = null;
    };
  }, [projects, onFail]);

  /** Viewport px that move the room by one screen, at the front wall. */
  const pxPerScreen = useCallback(() => {
    const el = section.current;
    if (!el) return 600;
    const l = orbitLayout(el.clientWidth, el.clientHeight);
    return (l.slot / l.tanX) * (el.clientWidth / 2);
  }, []);

  const moveTo = useCallback((value: number) => {
    position.current = value;
    orbit.current?.setTarget(value);
  }, []);

  /** Step to the next / previous screen (it loops, so never stops at an end). */
  const step = useCallback(
    (by: number) => moveTo(Math.round(position.current) + by),
    [moveTo],
  );

  // Sideways wheel / touchpad swipe turns the room; vertical wheel still scrolls the page.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let settle = 0;
    let from: number | null = null;
    const onWheel = (e: WheelEvent) => {
      const dx = e.deltaX || (e.shiftKey ? e.deltaY : 0);
      if (Math.abs(dx) <= Math.abs(e.shiftKey ? 0 : e.deltaY) || e.ctrlKey) return;
      // Ours, not the page's: stop smooth scroll and the browser's swipe-to-go-back.
      e.preventDefault();
      e.stopPropagation();
      from ??= Math.round(position.current);
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientWidth : 1;
      moveTo(position.current + (dx * unit) / pxPerScreen());
      clearTimeout(settle);
      settle = window.setTimeout(() => {
        moveTo(landing(from ?? Math.round(position.current), position.current));
        from = null;
      }, WHEEL_SETTLE);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      clearTimeout(settle);
      el.removeEventListener("wheel", onWheel);
    };
  }, [moveTo, pxPerScreen]);

  // Drag with mouse or touch (touch-action: pan-y leaves vertical swipes to the page).
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if ((e.target as HTMLElement).closest("button")) return;
      const id = e.pointerId;
      const from = Math.round(position.current);
      let lastX = e.clientX;
      let lastT = e.timeStamp;
      let travel = 0;
      let velocity = 0; // screens per second
      const perScreen = pxPerScreen();
      suppressClick.current = false;
      const move = (ev: PointerEvent) => {
        if (ev.pointerId !== id) return;
        const dx = ev.clientX - lastX;
        const dt = Math.max(1, ev.timeStamp - lastT) / 1000;
        lastX = ev.clientX;
        lastT = ev.timeStamp;
        travel += Math.abs(dx);
        if (travel > DRAG_SLOP) {
          suppressClick.current = true;
          // Grabbing hand everywhere in the section while dragging, even over the link.
          section.current?.setAttribute("data-dragging", "");
        }
        const delta = -dx / perScreen;
        velocity = velocity * 0.6 + (delta / dt) * 0.4;
        moveTo(position.current + delta);
      };
      const end = (ev: PointerEvent) => {
        if (ev.pointerId !== id) return;
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        section.current?.removeAttribute("data-dragging");
        // A flick carries on a little, then lands on a whole screen. A press without a drag
        // (a click) stays put.
        if (travel <= DRAG_SLOP) return moveTo(from);
        const fling = Math.max(-2, Math.min(2, velocity * 0.22));
        moveTo(landing(from, position.current + fling));
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
    },
    [moveTo, pxPerScreen],
  );

  // A drag never also clicks; a click on a side screen brings it to the centre.
  const onClickCapture = useCallback(
    (e: React.MouseEvent) => {
      if (suppressClick.current) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick.current = false;
        return;
      }
      const target = e.target as HTMLElement;
      if (target.closest("a, button") || !layout || !section.current) return;
      const rect = section.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      if (Math.abs(x) > layout.panelW / 2) step(Math.sign(x));
    },
    [layout, step],
  );

  return (
    <section
      ref={section}
      id="work"
      aria-labelledby={labelId}
      onPointerDown={onPointerDown}
      onClickCapture={onClickCapture}
      className="relative h-[72svh] max-h-[64rem] min-h-[34rem] cursor-grab md:h-svh touch-pan-y overflow-x-clip overscroll-x-contain select-none active:cursor-grabbing data-dragging:cursor-grabbing [&[data-dragging]_*]:cursor-grabbing!"
    >
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 block size-full" />
      <h2 id={labelId} className="sr-only">
        {home.work.label}
      </h2>

      {current && layout && (
        <div
          className={cn(
            "transition-opacity delay-500 duration-700",
            revealed ? "opacity-100" : "opacity-0",
          )}
        >
          {/* The centre screen is the link to its case study. */}
          <TransitionLink
            to={projectHref(current)}
            label={current.title}
            draggable={false}
            aria-keyshortcuts="ArrowLeft ArrowRight"
            onKeyDown={(e) => {
              // Keyboard turning, now that there are no arrow buttons.
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
              e.preventDefault();
              step(e.key === "ArrowRight" ? 1 : -1);
            }}
            className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-lg"
            style={{ width: `${layout.panelW * 100}%`, height: `${layout.panelH * 100}%` }}
          >
            <span className="sr-only">
              {home.work.view}: {current.title}. {home.work.keys}
            </span>
          </TransitionLink>

          {/* Anchored to the centre screen's top edge. --title is the largest the title gets. */}
          <div
            aria-live="polite"
            className="pointer-events-none absolute inset-x-0 z-20 text-center [--title:clamp(2.5rem,1.2rem+5.2vw,8.5rem)]"
            style={{ bottom: `${50 + layout.panelH * 50}%` }}
          >
            {/* The disciplines pill stays put: placed above the tallest a title can be, and
              never re-keyed, so only its text changes from project to project. */}
            <div
              className="absolute inset-x-0 flex justify-center"
              style={{ bottom: "calc(var(--title) * 1.2 + 0.75rem)" }}
            >
              <MorphPill text={disciplinesText(current)} />
            </div>
            {/* The title, lifted so even the tails of g / y clear the screen. Always one line:
              long titles scale down to fit narrow screens instead of wrapping, so the block
              never changes height. Re-keyed so it rises in on change. Font size on the mask
              itself, so its em padding (room for the descenders) is in the title's size. */}
            <div
              className="flex justify-center container-site"
              style={{ transform: "translateY(calc(var(--title) * -0.3))" }}
            >
              <h3
                className="line-mask display whitespace-nowrap"
                style={{
                  fontSize: `min(var(--title), calc((100vw - 2.5rem) / ${(current.title.length * 0.55).toFixed(2)}))`,
                  paddingBottom: "0.25em",
                  marginBottom: "-0.25em",
                }}
              >
                <span key={current.slug} className="block animate-rise">
                  {current.title}
                </span>
              </h3>
            </div>
          </div>

          {/* All work, just under the centre screen. */}
          <div
            className={cn(
              "absolute inset-x-0 z-10 flex justify-center transition-opacity delay-700 duration-700",
              revealed ? "opacity-100" : "opacity-0",
            )}
            style={{ top: `calc(${50 + layout.panelH * 50}% + 1.25rem)` }}
          >
            <Button to="/work" variant="ghost" icon={<ArrowRight />}>
              {home.work.allWork}
            </Button>
          </div>
        </div>
      )}

    </section>
  );
}
