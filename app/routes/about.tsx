import { ArrowRight, Download } from "lucide-react";
import { RevealMedia } from "~/components/motion/RevealMedia";
import { RevealText } from "~/components/motion/RevealText";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Marquee } from "~/components/ui/Marquee";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { Section } from "~/components/ui/Section";
import { SectionLabel } from "~/components/ui/SectionLabel";
import { showTodos, TodoMark } from "~/components/ui/TodoMark";
import { ToolChip, ToolLogo } from "~/components/ui/ToolLogo";
import { education } from "~/content/education";
import { experience } from "~/content/experience";
import { about } from "~/content/pages";
import { recognition } from "~/content/recognition";
import { site } from "~/content/site";
import { isTodo } from "~/content/todo";
import { languages, offScreen, toolkit } from "~/content/toolkit";
import type { TimelineEntry } from "~/content/types";
import { portrait } from "~/lib/content.server";
import { personJsonLd } from "~/lib/jsonld";
import { indexLabel } from "~/lib/project";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/about";

export function loader() {
  return { portrait: portrait() };
}

export function meta() {
  return pageMeta({ ...about.meta, path: "/about", type: "profile", jsonLd: personJsonLd() });
}

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="grid gap-3">
      {entries.map((entry) => (
        <li
          key={`${entry.title}-${entry.org}`}
          className="grid gap-x-[var(--spacing-gutter)] gap-y-2 rounded-lg border border-line bg-surface p-6 md:grid-cols-12 md:items-baseline md:p-8"
        >
          <p className="text-sm font-semibold text-muted md:col-span-3">
            {isTodo(entry.period) ? <TodoMark>{entry.period}</TodoMark> : entry.period}
          </p>
          <div className="md:col-span-9">
            <h3 className="display text-2xl">{entry.title}</h3>
            <p className="mt-1.5 text-muted">{entry.org}</p>
            {entry.note &&
              (isTodo(entry.note) ? (
                <TodoMark className="mt-2">{entry.note}</TodoMark>
              ) : (
                <p className="mt-1 text-sm text-muted">{entry.note}</p>
              ))}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function About({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Container className="pt-32 md:pt-40">
        <div className="grid gap-x-[var(--spacing-gutter)] gap-y-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h1 className="display text-[clamp(3.25rem,9vw,9rem)]">
              {about.heading} <span className="italic-accent">{about.accent}</span>
            </h1>
            <div className="mt-10 max-w-prose space-y-5 text-lg text-fg/85">
              {about.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <dl className="mt-10 flex flex-wrap gap-2">
              {about.quick.map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong py-2 pr-4 pl-2 text-sm"
                >
                  <dt className="rounded-full bg-fg px-2.5 py-0.5 text-xs font-semibold text-bg">
                    {item.label}
                  </dt>
                  <dd className="font-semibold">{item.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                href={site.cv.href}
                download={site.cv.fileName}
                external={false}
                icon={<Download />}
              >
                {about.cv}
              </Button>
              <Button to="/work" variant="ghost" icon={<ArrowRight />}>
                {about.work}
              </Button>
            </div>
          </div>
          <div className="relative lg:col-span-5">
            {/* Offset cobalt card behind the portrait, with a lime sticker. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-4 translate-y-4 rotate-[3deg] rounded-xl bg-cobalt md:translate-x-6 md:translate-y-6"
            />
            <RevealMedia className="relative aspect-[4/5] rounded-xl bg-bg-2">
              <ResponsiveImage
                picture={loaderData.portrait}
                alt={about.portraitAlt}
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 90vw"
              />
            </RevealMedia>
            <span
              aria-hidden="true"
              className="absolute -top-5 -left-3 grid size-24 rotate-[-12deg] place-items-center rounded-full bg-lime text-center text-sm leading-tight font-black tracking-tight text-night md:size-28"
            >
              Built to
              <br />
              be felt.
            </span>
          </div>
        </div>
      </Container>

      {/* 01 — Languages */}
      <Section index={1} label={about.languages}>
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <RevealText className="display text-3xl">{about.languagesIntro}</RevealText>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {languages.map((lang, i) => (
            <li
              key={lang.name}
              className="group flex aspect-[4/5] flex-col justify-between rounded-lg border border-line bg-surface p-5 transition-colors duration-300 hover:border-cobalt hover:bg-cobalt hover:text-white lg:aspect-[3/4]"
            >
              <span className="meta text-muted transition-colors group-hover:text-white/70">
                {indexLabel(i + 1)}
              </span>
              <ToolLogo tool={lang} className="size-12 md:size-14" />
              <span className="display text-2xl">{lang.name}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 02 — Tools & frameworks */}
      <section aria-labelledby="toolkit-label" className="pt-section">
        <Container>
          <div className="rounded-xl p-6 theme-night sm:p-10 lg:p-16">
            <SectionLabel id="toolkit-label" index={2}>
              {about.toolkit}
            </SectionLabel>
            <p className="mt-8 max-w-[34ch] text-lg text-muted">{about.toolkitIntro}</p>
            <div className="mt-12 grid gap-x-[var(--spacing-gutter)] gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {toolkit.map((group) => (
                <div key={group.group} className="border-t border-line pt-6">
                  <h3 className="display text-2xl">{group.group}</h3>
                  <p className="mt-2 text-sm text-muted">{group.blurb}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {group.items.map((tool) => (
                      <li key={tool.name}>
                        <ToolChip tool={tool} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 03 — Experience */}
      <Section index={3} label={about.experience}>
        <Timeline entries={experience} />
      </Section>

      {/* 04 — Education */}
      <Section index={4} label={about.education} spacing="tight">
        <Timeline entries={education} />
      </Section>

      {/* 05 — Recognition */}
      <Section index={5} label={about.recognition} spacing="tight">
        <ul className="grid gap-3 md:grid-cols-3">
          {recognition.map((item, i) => (
            <li
              key={item.title}
              className={
                i === 0
                  ? "flex flex-col rounded-lg bg-lime p-6 text-night md:p-8"
                  : "flex flex-col rounded-lg border border-line bg-surface p-6 md:p-8"
              }
            >
              <p className="display text-5xl tabular-nums md:text-6xl">{item.year}</p>
              <h3 className="mt-12 display text-2xl">{item.title}</h3>
              {(showTodos || !isTodo(item.detail)) && (
                <div className="mt-1.5 opacity-75">
                  {isTodo(item.detail) ? <TodoMark>{item.detail}</TodoMark> : item.detail}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Section>

      {/* 06 — Off-screen */}
      <Section index={6} label={about.offScreen} spacing="tight" />
      <Marquee label={about.offScreen} items={offScreen} className="mt-6" />
    </>
  );
}
