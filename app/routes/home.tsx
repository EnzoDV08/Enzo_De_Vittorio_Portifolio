import { ArrowRight } from "lucide-react";
import { DeviceStill } from "~/components/devices/DeviceStill";
import { RevealText } from "~/components/motion/RevealText";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { ProjectShowcase } from "~/components/project/ProjectShowcase";
import { Capabilities } from "~/components/sections/Capabilities";
import { HeroWall } from "~/components/sections/HeroWall";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { LogoTile } from "~/components/ui/LogoTile";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { LogoMarquee, Marquee } from "~/components/ui/Marquee";
import { Section } from "~/components/ui/Section";
import { SectionLabel } from "~/components/ui/SectionLabel";
import { home, ui } from "~/content/pages";
import { principles } from "~/content/principles";
import { site } from "~/content/site";
import { logoWall } from "~/content/toolkit";
import {
  capabilityPanels,
  capabilityTags,
  featuredSummaries,
  heroPortrait,
  heroWall,
  picturesFor,
  workStats,
} from "~/lib/content.server";
import { personJsonLd } from "~/lib/jsonld";
import { caseStudyPath, indexLabel } from "~/lib/project";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/home";

// Runs at build time; the result is embedded in the prerendered HTML.
export function loader() {
  return {
    featured: featuredSummaries(),
    wall: heroWall(),
    portrait: heroPortrait(),
    panels: capabilityPanels(),
    tags: capabilityTags(),
    stats: workStats(),
    logos: picturesFor([home.proof.awardLogo, home.proof.studioLogo]),
  };
}

export function meta() {
  return pageMeta({ ...home.meta, path: "/", type: "profile", jsonLd: personJsonLd() });
}

/** Staggered CSS entrance, runs at first paint without waiting for JS, off with reduced motion. */
const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

type HeroProps = Pick<Route.ComponentProps["loaderData"], "wall" | "portrait">;

function Hero({ wall, portrait }: HeroProps) {
  return (
    <section aria-labelledby="hero-heading" className="relative pt-24 md:pt-28">
      <Container>
        <div className="grid items-center gap-x-[var(--spacing-gutter)] gap-y-12 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-12">
          <div className="lg:col-span-6 xl:col-span-5">
            <p className="text-sm font-semibold text-muted motion-safe:animate-fade-up" style={delay(0)}>
              {home.hero.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className="mt-5 display text-[clamp(2.9rem,1.2rem+5.4vw,7rem)] md:mt-6"
            >
              <span className="line-mask">
                {/* The LCP line rises from partly visible, so it counts as painted on frame one. */}
                <span className="block motion-safe:animate-rise-short" style={delay(80)}>
                  {home.hero.lead}{" "}
                  <span className="italic-accent pr-[0.06em]">{home.hero.accent}</span>
                </span>
              </span>
            </h1>
            <p
              className="mt-7 max-w-[40ch] text-lg text-fg/80 motion-safe:animate-fade-up"
              style={delay(320)}
            >
              {home.hero.intro}
            </p>
            <div className="mt-9 flex flex-wrap gap-3 motion-safe:animate-fade-up" style={delay(420)}>
              <Button to="/work" icon={<ArrowRight />}>
                {home.hero.primary}
              </Button>
              <Button to="/about" variant="ghost">
                {home.hero.secondary}
              </Button>
            </div>
          </div>

          <div
            className="relative motion-safe:animate-fade-up lg:col-span-6 lg:self-stretch lg:py-8 xl:col-span-7"
            style={delay(200)}
          >
            <div className="relative aspect-4/3 lg:h-full lg:min-h-[34rem] lg:aspect-auto">
              <div className="absolute inset-0 overflow-hidden rounded-xl theme-cobalt">
                <div aria-hidden="true" className="absolute inset-0 opacity-45 dot-grid" />
                <HeroWall columns={wall} />
              </div>
              <div className="absolute top-0 right-0 aspect-square w-[30%] rounded-bl-[calc(var(--radius-lg)+0.875rem)] bg-bg pb-3 pl-3 sm:w-[32%] sm:pb-3.5 sm:pl-3.5">
                <span aria-hidden="true" className="absolute top-0 right-full notch-curve" />
                <span aria-hidden="true" className="absolute top-full right-0 notch-curve" />
                <div className="relative size-full overflow-hidden rounded-lg">
                  <ResponsiveImage
                    picture={portrait.picture}
                    alt={portrait.alt}
                    fill
                    sizes="(min-width: 1024px) 18vw, 30vw"
                    className="object-[center_28%]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

type ProofProps = Pick<Route.ComponentProps["loaderData"], "stats" | "logos">;

function Proof({ stats, logos }: ProofProps) {
  const items = [
    { big: indexLabel(stats.caseStudies), small: home.proof.caseStudies },
    { big: String(stats.projects), small: home.proof.projects },
    { big: home.proof.award, small: home.proof.awardDetail, logo: logos[home.proof.awardLogo] },
    { big: home.proof.studio, small: home.proof.studioDetail, logo: logos[home.proof.studioLogo] },
  ];
  return (
    <section aria-label={home.proof.label} className="pt-16 md:pt-24">
      <Container>
        <dl className="grid grid-cols-2 gap-px overflow-clip rounded-lg border border-line bg-line lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.small} className="flex flex-col-reverse justify-end gap-2 bg-bg p-6 md:p-8">
              <dt className="text-sm text-muted">{item.small}</dt>
              <dd
                className={
                  "logo" in item
                    ? "text-[clamp(1.375rem,1rem+1.4vw,2.25rem)] leading-tight font-bold tracking-[-0.03em]"
                    : "display text-[clamp(3rem,2rem+4vw,6rem)] text-accent"
                }
              >
                {"logo" in item && <LogoTile picture={item.logo} className="mb-4 size-14 md:size-16" />}
                {item.big}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { featured, wall, portrait, panels, tags, stats, logos } = loaderData;
  const studio = featured.find((p) => p.slug === site.studio.caseStudy);

  return (
    <>
      <Hero wall={wall} portrait={portrait} />
      <Proof stats={stats} logos={logos} />

      {/* 01, Selected work */}
      <Section id="work" index={1} label={home.work.label}>
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[44ch] text-lg text-muted">{home.work.intro}</p>
          <Button to="/work" variant="ghost" icon={<ArrowRight />}>
            {home.work.allWork}
          </Button>
        </div>
        <ProjectShowcase projects={featured} />
      </Section>

      {/* 02, What I do */}
      <Section index={2} label={home.whatIDo.label}>
        <div className="mb-10 flex flex-col gap-6 md:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <RevealText className="max-w-[16ch] display text-4xl">
            {home.whatIDo.heading} <span className="italic-accent">{home.whatIDo.accent}</span>
          </RevealText>
          <p className="max-w-[40ch] text-lg text-muted">{home.whatIDo.intro}</p>
        </div>
        <Capabilities panels={panels} />
      </Section>

      <Marquee
        label={home.whatIDo.label}
        items={tags}
        className="mt-16 md:mt-24"
      />

      {/* 03, Toolkit */}
      <Section index={3} label={home.tools.label} spacing="tight">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <RevealText className="max-w-[18ch] display text-3xl">
            {home.tools.heading} <span className="italic-accent">{home.tools.accent}</span>
          </RevealText>
          <Button to="/about" variant="ghost" icon={<ArrowRight />}>
            {home.tools.cta}
          </Button>
        </div>
      </Section>
      <LogoMarquee tools={logoWall} label={home.tools.label} />

      {/* 04, How I work */}
      <section aria-labelledby="principles-label" className="pt-section">
        <Container>
          <div className="overflow-clip rounded-xl p-6 theme-cobalt sm:p-10 lg:p-16">
            <SectionLabel id="principles-label" index={4}>
              {home.howIWork.label}
            </SectionLabel>
            <ol className="mt-12 space-y-6 md:mt-16 md:space-y-8">
              {principles.map((p, i) => (
                <li key={p.line} className="grid grid-cols-12 items-baseline gap-x-4 border-t border-line pt-5">
                  <span className="col-span-2 meta text-muted md:col-span-1">{indexLabel(i + 1)}</span>
                  <RevealText as="p" className="col-span-10 display text-4xl md:col-span-11">
                    {p.line} <span className="italic-accent">{p.emphasis}</span>
                  </RevealText>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 05, Now */}
      <Section index={5} label={home.studio.label}>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <RevealText as="p" className="display text-3xl">
              {home.studio.line}
            </RevealText>
            {studio && (
              <Button to={caseStudyPath(studio)} variant="solid" icon={<ArrowRight />} className="mt-10">
                {home.studio.cta}
              </Button>
            )}
          </div>
          {studio?.devices.laptop && (
            <TransitionLink
              to={caseStudyPath(studio)}
              label={studio.title}
              tabIndex={-1}
              aria-hidden="true"
              data-cursor={ui.view}
              className="block rounded-xl bg-night px-[10%] pt-[10%] pb-[8%] lg:col-span-6"
            >
              <DeviceStill
                devices={studio.devices}
                sizes="(min-width: 1024px) 40vw, 80vw"
                laptopOnly
                decorative
              />
            </TransitionLink>
          )}
        </div>
      </Section>
    </>
  );
}
