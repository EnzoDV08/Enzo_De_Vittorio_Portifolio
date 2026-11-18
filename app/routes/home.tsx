import { ArrowRight } from "lucide-react";
import { lazy, useCallback, useRef, useState } from "react";
import { Island } from "~/components/motion/Island";
import { RevealText } from "~/components/motion/RevealText";
import { WorkStrip } from "~/components/project/WorkStrip";
import { Capabilities } from "~/components/sections/Capabilities";
import { IntroBento } from "~/components/sections/IntroBento";
import { Principles } from "~/components/sections/Principles";
import { Button } from "~/components/ui/Button";
import { Marquee } from "~/components/ui/Marquee";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { Section } from "~/components/ui/Section";
import { home } from "~/content/pages";
import {
  capabilityPanels,
  capabilityTags,
  introData,
  featuredSummaries,
  picturesFor,
  principleLines,
} from "~/lib/content.server";
import type { Picture } from "~/lib/images";
import { personJsonLd } from "~/lib/jsonld";
import { useMotionAllowed } from "~/lib/motion";
import { HERO_LIGHT } from "~/lib/palette";
import { pageMeta } from "~/lib/seo";
import { useHydrated } from "~/lib/useHydrated";
import type { Route } from "./+types/home";

const GradientASCII = lazy(() => import("~/components/ui/GradientASCII"));
const HeroFrameFx = lazy(() => import("~/components/motion/fx/HeroFrameFx"));
const WorkOrbitFx = lazy(() => import("~/components/motion/fx/WorkOrbitFx"));

// Runs at build time; the result is embedded in the prerendered HTML.
export function loader() {
  return {
    featured: featuredSummaries(),
    principles: principleLines(),
    panels: capabilityPanels(),
    tags: capabilityTags(),
    intro: introData(),
    portrait: picturesFor([home.hero.portrait])[home.hero.portrait],
  };
}

export function meta() {
  return pageMeta({ ...home.meta, path: "/", type: "profile", jsonLd: personJsonLd() });
}

/** Staggered CSS entrance, runs at first paint without waiting for JS, off with reduced motion. */
const delay = (ms: number) => ({ animationDelay: `${ms}ms` });


/**
 * Full-bleed night frame with the ASCII light behind centred copy. From the first scroll,
 * HeroFrameFx closes the frame in to a rounded card. Without motion it is simply a full-height section.
 */
function Hero({ portrait }: { portrait: Picture | undefined }) {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const motion = useMotionAllowed();
  return (
    <>
      <section ref={section} aria-labelledby="hero-heading" data-nav="night" className="relative">
        <div ref={frame} className="relative isolate flex min-h-svh flex-col overflow-clip theme-night">
          <div ref={backdrop} aria-hidden="true" className="absolute inset-0 -z-10">
            <div className="absolute inset-0 hero-glow" />
            {/* WebGL, so client only. With reduced motion it draws one still frame. */}
            {hydrated && (
              <Island>
                <GradientASCII
                  colors={HERO_LIGHT}
                  shape="horizon"
                  cellSize={16}
                  density={0.75}
                  gradientOpacity={0.75}
                  glow={0.35}
                  // Soft, glowing glyphs: 1.25x looks the same as 1.5x for ~30% fewer pixels.
                  dpr={1.25}
                  scrollFps={30}
                  // 120/144Hz screens would otherwise draw it twice as often for no visible gain.
                  fps={60}
                />
              </Island>
            )}
          </div>

          <div aria-hidden="true" className="absolute inset-0 -z-10 hero-scrim" />

          {/* The copy and Enzo share one stack, in three layers: the first headline line (z-1)
            stands large behind him, the portrait (z-2) in front of it, and the rest (z-3) in
            front of both. They also share HeroFrameFx's settle on scroll, so his head stays put
            over the words while the frame closes in. */}
          <div
            ref={content}
            className="relative isolate flex flex-1 flex-col items-center justify-center container-site pt-28 pb-24 text-center"
          >
            {/* Decorative (the name is in the copy), so no alt. */}
            {portrait && (
              <div
                aria-hidden="true"
                data-hero-portrait
                // Larger than the frame and lifted, so the frame crops at the waist: in the cut-out
                // the head starts ~20% down, so -16% / 155% puts it ~15% from the top of the hero.
                className="pointer-events-none absolute inset-x-0 top-[-8%] z-[2] flex h-[125%] justify-center motion-safe:animate-portrait-in md:top-[-16%] md:h-[155%]"
                style={delay(150)}
              >
                <ResponsiveImage
                  picture={portrait}
                  alt=""
                  sizes="(orientation: landscape) 104vh, 140vw"
                  eager
                  className="h-full! w-auto! max-w-none hero-portrait"
                />
              </div>
            )}
            <p
              className="relative z-[3] glass rounded-full px-4 py-2 meta text-fg motion-safe:animate-fade-up"
              style={delay(0)}
            >
              {home.hero.eyebrow}
            </p>
            <h1 id="hero-heading" className="mt-6 display md:mt-8">
              {/* Behind the portrait from lg up, and larger, so his head stands in front of the
                words. On phones and tablets his head is large next to the line and would hide
                most of it, so there it stays in front. The LCP line rises from partly visible, so
                it counts as painted on frame one. */}
              <span
                className="relative z-[3] line-mask text-[clamp(3.75rem,0.75rem+12vw,14.5rem)] leading-[0.88] lg:z-[1]"
                style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
              >
                <span className="block motion-safe:animate-rise-short" style={delay(80)}>
                  {home.hero.lead}
                </span>
              </span>{" "}
              {/* Extra room below keeps italic descenders inside the line mask. */}
              <span
                className="relative z-[3] line-mask text-[clamp(3.5rem,1rem+10vw,11.5rem)]"
                style={{ paddingBottom: "0.24em", marginBottom: "-0.24em" }}
              >
                <span className="block motion-safe:animate-rise-short" style={delay(160)}>
                  {home.hero.leadRest}{" "}
                  <span className="italic-accent pr-[0.06em]">{home.hero.accent}</span>
                </span>
              </span>
            </h1>
            <p
              className="relative z-[3] mt-7 max-w-[44ch] text-lg text-fg/80 motion-safe:animate-fade-up md:mt-9"
              style={delay(320)}
            >
              {home.hero.intro}
            </p>
            <div
              className="relative z-[3] mt-9 flex flex-wrap justify-center gap-3 motion-safe:animate-fade-up"
              style={delay(420)}
            >
              <Button to="/work" variant="solid" icon={<ArrowRight />}>
                {home.hero.primary}
              </Button>
              <Button to="/about" variant="ghost">
                {home.hero.secondary}
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* After the section, not inside it: refs attach only after children's effects run. */}
      {motion && (
        <Island>
          <HeroFrameFx section={section} frame={frame} backdrop={backdrop} content={content} />
        </Island>
      )}
    </>
  );
}

type Featured = Route.ComponentProps["loaderData"]["featured"];

/**
 * Selected work. With motion, the room of screens (WorkOrbitFx, lazy, WebGL2); prerendered, with
 * reduced motion, while it loads or without WebGL2, the same projects as a flat strip.
 */
function SelectedWork({ projects }: { projects: Featured }) {
  const motion = useMotionAllowed();
  const [failed, setFailed] = useState(false);
  const fail = useCallback(() => setFailed(true), []);
  const fallback = <WorkStrip projects={projects} />;
  if (!motion || failed) return fallback;
  return (
    <Island fallback={fallback}>
      <WorkOrbitFx projects={projects} onFail={fail} />
    </Island>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { featured, panels, tags, principles, portrait, intro } = loaderData;

  return (
    <>
      <Hero portrait={portrait} />

      {/* What I do, as a ticker: room to breathe after the hero, and before the work. */}
      <Marquee label={home.whatIDo.label} items={tags} className="mt-6 md:mt-10" />

      {/* Selected work */}
      <div className="mt-20 md:mt-32">
        <SelectedWork projects={featured} />
      </div>

      {/* What I do */}
      <Section index={2} label={home.whatIDo.label}>
        <div className="mb-10 flex flex-col gap-6 md:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <RevealText className="max-w-[16ch] display text-3xl">
            {home.whatIDo.heading} <span className="italic-accent">{home.whatIDo.accent}</span>
          </RevealText>
          <p className="max-w-[40ch] text-lg text-muted">{home.whatIDo.intro}</p>
        </div>
        <Capabilities panels={panels} />
      </Section>

      {/* How I work */}
      <Principles items={principles} />

      {/* A quick about-me: every card leads to /about. */}
      <IntroBento data={intro} />
    </>
  );
}
