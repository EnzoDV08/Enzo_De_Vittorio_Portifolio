import { lazy, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Island } from "~/components/motion/Island";
import { home } from "~/content/pages";
import { cn } from "~/lib/cn";
import { useMotionAllowed } from "~/lib/motion";
import { HERO_LIGHT } from "~/lib/palette";
import { indexLabel } from "~/lib/project";

const GradientASCII = lazy(() => import("~/components/ui/GradientASCII"));

export type PrincipleCard = { label: string; line: string; emphasis: string };

/**
 * How I work, on the page itself. On the left, the heading, a big counter and a progress bar stay
 * put (sticky from lg) while the cards scroll past on the right; the card crossing the middle of
 * the screen lights up and the counter follows it.
 *
 * The lit card carries the hero's animated ASCII light. It is ONE canvas, not one per card: a
 * layer behind the cards that glides to whichever card is lit (transform + clip-path, so the
 * canvas is never resized mid-move), and that card's text turns light over it.
 * Prerendered and with reduced motion every card is lit in the plain style, with no canvas.
 */
export function Principles({ items }: { items: PrincipleCard[] }) {
  const labelId = useId();
  const motion = useMotionAllowed();
  const list = useRef<HTMLOListElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  /** Which card has light text: follows active halfway through the glide, when the light
   *  is crossing between the two cards, so no text is ever light on chalk or dark on night. */
  const [lightText, setLightText] = useState(0);
  useEffect(() => {
    const id = window.setTimeout(() => setLightText(active), 420);
    return () => window.clearTimeout(id);
  }, [active]);
  /** Where the light layer sits: active card's top and height, and the tallest card's height. */
  const [glide, setGlide] = useState<{ top: number; height: number; max: number } | null>(null);

  useEffect(() => {
    if (!motion) return;
    // A zero-height line through the middle of the screen: whichever card it crosses is active.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = cards.current.indexOf(entry.target as HTMLLIElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    cards.current.forEach((card) => card && io.observe(card));
    return () => io.disconnect();
  }, [motion]);

  // Measure the lit card (and again whenever the cards change size, e.g. fonts or a resize).
  useLayoutEffect(() => {
    if (!motion || !list.current) return;
    const measure = () => {
      const card = cards.current[active];
      if (!card) return;
      const max = Math.max(...cards.current.map((c) => c?.offsetHeight ?? 0));
      setGlide({ top: card.offsetTop, height: card.offsetHeight, max });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list.current);
    return () => ro.disconnect();
  }, [motion, active]);

  return (
    <section aria-labelledby={labelId} className="pt-section">
      <div className="container-site">
        <div className="py-4 md:py-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: stays beside the cards while they scroll. */}
            <div className="lg:sticky lg:top-32 lg:self-start lg:pt-16">
              <h2 id={labelId} className="max-w-[14ch] display text-[clamp(2.25rem,1.4rem+3vw,4.5rem)]">
                {home.howIWork.heading}{" "}
                <span className="italic-accent">{home.howIWork.accent}</span>
              </h2>
              {/* The counter and progress follow the lit card; decorative. */}
              <div aria-hidden="true" className="mt-8 hidden lg:block">
                {/* An odometer: every number stacked in a one-number window. Moving on, the
                  current one slides up and out while the next slides up from underneath. */}
                <div className="h-[1.1em] overflow-clip display text-[clamp(6rem,4rem+6vw,11rem)] leading-[1.1]">
                  <div
                    className="transition-transform duration-[900ms] ease-expo-in-out"
                    style={{ transform: `translateY(${-active * 1.1}em)` }}
                  >
                    {items.map((item, i) => (
                      <span
                        key={item.line}
                        className="block h-[1.1em] bg-linear-to-b from-fg to-fg/25 bg-clip-text text-transparent"
                      >
                        {indexLabel(i + 1)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-8 h-px w-60 bg-line-strong">
                  <div
                    className="h-full bg-fg transition-[width] duration-700 ease-out-expo"
                    style={{ width: `${((active + 1) / items.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* A short tail lets the last card settle beside the pinned heading before it releases. */}
            <ol ref={list} className="relative flex flex-col gap-4 lg:pt-[18svh] lg:pb-8">
              {/* The light: one canvas, gliding to the lit card. */}
              {motion && glide && (
                <li
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 overflow-clip bg-night transition-[transform,clip-path] duration-[900ms] ease-expo-in-out"
                  style={{
                    height: glide.max,
                    transform: `translateY(${glide.top}px)`,
                    clipPath: `inset(0 0 ${glide.max - glide.height}px 0 round var(--radius-lg))`,
                  }}
                >
                  <div className="absolute inset-0 hero-glow" />
                  <Island>
                    <GradientASCII
                      colors={HERO_LIGHT}
                      shape="horizon"
                      cellSize={14}
                      density={0.7}
                      gradientOpacity={0.75}
                      glow={0.3}
                      dpr={1.25}
                      scrollFps={30}
                      mouseInteraction={false}
                      clickEffect="none"
                    />
                  </Island>
                  {/* Keeps the text side dark enough to read. */}
                  <div className="absolute inset-0 bg-linear-to-r from-night/85 via-night/45 to-transparent" />
                </li>
              )}
              {items.map((item, i) => {
                const current = i === active;
                const glowing = motion && glide !== null && i === lightText;
                const lit = !motion || current;
                return (
                  <li
                    key={item.line}
                    ref={(el) => {
                      cards.current[i] = el;
                    }}
                    className={cn(
                      "relative flex min-h-[16rem] flex-col justify-center rounded-lg border p-7 transition-[opacity,background-color,border-color,color] duration-700 md:min-h-[18rem] md:p-10 [&_*]:transition-colors [&_*]:duration-300",
                      glowing
                        ? "border-white/15 bg-transparent on-night"
                        : lit
                          ? "border-line-strong bg-bg-2 opacity-100"
                          : "border-line bg-transparent opacity-35",
                    )}
                  >
                    <p className="meta text-muted">
                      {indexLabel(i + 1)} · {item.label}
                    </p>
                    <p className="mt-5 display text-[clamp(1.75rem,1.2rem+1.8vw,3rem)]">
                      {item.line} <span className="italic-accent">{item.emphasis}</span>
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
