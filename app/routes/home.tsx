import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { RevealText } from "~/components/motion/RevealText";
import { WorkList } from "~/components/project/WorkList";
import { AvailabilityPill } from "~/components/ui/AvailabilityPill";
import { Button } from "~/components/ui/Button";
import { Clock } from "~/components/ui/Clock";
import { Container } from "~/components/ui/Container";
import { Marquee } from "~/components/ui/Marquee";
import { Section } from "~/components/ui/Section";
import { TagList } from "~/components/ui/Tag";
import { TodoMark } from "~/components/ui/TodoMark";
import { home } from "~/content/pages";
import { principles } from "~/content/principles";
import { recognition } from "~/content/recognition";
import { site } from "~/content/site";
import { isTodo } from "~/content/todo";
import { featuredSummaries } from "~/lib/content.server";
import { personJsonLd } from "~/lib/jsonld";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/home";

// Runs at build time; the result is embedded in the prerendered HTML.
export function loader() {
  return { featured: featuredSummaries() };
}

export function meta() {
  return pageMeta({ ...home.meta, path: "/", type: "profile", jsonLd: personJsonLd() });
}

/** Staggered CSS entrance — runs at first paint without waiting for JS, off with reduced motion. */
const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-svh flex-col justify-end pt-28 pb-8 md:pb-10"
    >
      <Container>
        <p className="meta text-muted motion-safe:animate-fade-up" style={delay(0)}>
          {site.name} <span aria-hidden="true">—</span> {site.descriptor}
        </p>

        <h1 id="hero-heading" className="mt-6 display text-[clamp(3rem,17vw,11rem)] md:mt-8">
          <span className="line-mask">
            <span className="block motion-safe:animate-rise" style={delay(80)}>
              {home.hero.lead}
            </span>
          </span>
          <span className="line-mask">
            <span className="block motion-safe:animate-rise" style={delay(180)}>
              <span className="pr-[0.04em] serif-accent text-accent">{home.hero.accent}</span>
            </span>
          </span>
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p
              className="max-w-[34ch] text-lg text-paper/90 motion-safe:animate-fade-up"
              style={delay(420)}
            >
              {home.hero.intro}
            </p>
            <div
              className="mt-8 flex flex-wrap gap-3 motion-safe:animate-fade-up"
              style={delay(520)}
            >
              <Button to="/work" icon={<ArrowRight />}>
                {home.hero.primary}
              </Button>
              <Button
                href={site.cv.href}
                download={site.cv.fileName}
                external={false}
                variant="ghost"
                icon={<Download />}
              >
                {home.hero.secondary}
              </Button>
            </div>
          </div>
          <div
            className="flex flex-col items-start gap-4 motion-safe:animate-fade-up lg:col-span-6 lg:items-end"
            style={delay(620)}
          >
            <AvailabilityPill>{site.availability}</AvailabilityPill>
            {/* The nav carries the clock from md up. */}
            <Clock
              place={site.clock.place}
              timeZone={site.clock.timeZone}
              zone={site.clock.zone}
              className="meta text-muted md:hidden"
            />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-line pt-4 meta text-muted md:mt-16">
          <span>{site.location}</span>
          <a href="#work" className="inline-flex min-h-11 items-center gap-2 hover:text-paper">
            {home.hero.scrollCue}
            <ArrowDown className="size-3.5" aria-hidden />
          </a>
        </div>
      </Container>
    </section>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Hero />

      <Section
        id="work"
        index={1}
        label={home.work.label}
        rule={false}
        className="pt-16! md:pt-24!"
      >
        <WorkList projects={loaderData.featured} />
        <div className="mt-12 flex justify-end">
          <Button to="/work" variant="ghost" icon={<ArrowRight />}>
            {home.work.allWork}
          </Button>
        </div>
      </Section>

      <Marquee label={home.recognitionLabel} items={recognition.map((r) => r.marquee)} />

      <Section index={2} label={home.whatIDo.label}>
        <ul className="grid gap-x-[var(--spacing-gutter)] gap-y-14 md:grid-cols-3">
          {home.whatIDo.columns.map((col) => (
            <li key={col.title} className="border-t border-line pt-6">
              <h2 className="display text-3xl">{col.title}</h2>
              <p className="mt-4 max-w-[36ch] text-muted">{col.body}</p>
              <TagList items={col.tags} className="mt-6" />
            </li>
          ))}
        </ul>
      </Section>

      <Section index={3} label={home.howIWork.label}>
        <ol className="space-y-6 md:space-y-10">
          {principles.map((p, i) => (
            <li
              key={p.line}
              className="grid grid-cols-12 items-baseline gap-x-[var(--spacing-gutter)]"
            >
              <span className="col-span-2 meta text-muted md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <RevealText as="p" className="col-span-10 display text-4xl md:col-span-11">
                {p.line} <span className="serif-accent">{p.emphasis}</span>
              </RevealText>
            </li>
          ))}
        </ol>
      </Section>

      <Section index={4} label={home.studio.label}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <RevealText as="p" className="display text-3xl lg:col-span-9">
            {home.studio.line}
          </RevealText>
          <div className="space-y-5 lg:col-span-3 lg:justify-self-end lg:text-right">
            <p className="meta text-muted">{home.studio.withPartner}</p>
            {isTodo(site.studio.url) ? (
              <TodoMark>{site.studio.url}</TodoMark>
            ) : (
              <Button href={site.studio.url} variant="ghost" icon={<ArrowUpRight />}>
                {home.studio.cta}
              </Button>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
