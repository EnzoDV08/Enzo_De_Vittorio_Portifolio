import { Download } from "lucide-react";
import { RevealMedia } from "~/components/motion/RevealMedia";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { Section } from "~/components/ui/Section";
import { TagList } from "~/components/ui/Tag";
import { TodoMark } from "~/components/ui/TodoMark";
import { education } from "~/content/education";
import { experience } from "~/content/experience";
import { about } from "~/content/pages";
import { recognition } from "~/content/recognition";
import { site } from "~/content/site";
import { isTodo } from "~/content/todo";
import { offScreen, toolkit } from "~/content/toolkit";
import type { TimelineEntry } from "~/content/types";
import { portrait } from "~/lib/content.server";
import { personJsonLd } from "~/lib/jsonld";
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
    <ol className="border-t border-line">
      {entries.map((entry) => (
        <li
          key={`${entry.title}-${entry.org}`}
          className="grid gap-x-[var(--spacing-gutter)] gap-y-2 border-b border-line py-6 md:grid-cols-12"
        >
          <p className="meta text-muted md:col-span-3">
            {isTodo(entry.period) ? <TodoMark>{entry.period}</TodoMark> : entry.period}
          </p>
          <div className="md:col-span-9">
            <h3 className="display text-xl">{entry.title}</h3>
            <p className="mt-1 text-muted">
              {entry.org}
              {entry.place && <span> — {entry.place}</span>}
            </p>
            {entry.note &&
              (isTodo(entry.note) ? (
                <TodoMark className="mt-2">{entry.note}</TodoMark>
              ) : (
                <p className="mt-1 meta text-muted">{entry.note}</p>
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
      <Container className="pt-32 md:pt-44">
        <div className="grid gap-x-[var(--spacing-gutter)] gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="display text-[clamp(3rem,8.5vw,8.5rem)]">
              {about.heading} <span className="serif-accent text-accent">{about.accent}</span>
            </h1>
            <div className="mt-12 max-w-prose space-y-5 text-lg text-paper/90">
              {about.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-10">
              <Button
                href={site.cv.href}
                download={site.cv.fileName}
                external={false}
                variant="ghost"
                icon={<Download />}
              >
                {about.cv}
              </Button>
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-4">
            <RevealMedia className="aspect-[4/5] max-w-md bg-ink-2">
              <ResponsiveImage
                picture={loaderData.portrait}
                alt={about.portraitAlt}
                fill
                priority
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="grayscale-[35%]"
              />
            </RevealMedia>
            <p className="mt-3 meta text-muted">{site.location}</p>
          </div>
        </div>
      </Container>

      <Section index={1} label={about.experience}>
        <Timeline entries={experience} />
      </Section>

      <Section index={2} label={about.education} spacing="tight">
        <Timeline entries={education} />
      </Section>

      <Section index={3} label={about.recognition} spacing="tight">
        <ul className="border-t border-line">
          {recognition.map((item) => (
            <li
              key={item.title}
              className="grid gap-x-[var(--spacing-gutter)] gap-y-2 border-b border-line py-6 md:grid-cols-12"
            >
              <p className="meta text-muted md:col-span-3">{item.year}</p>
              <div className="md:col-span-9">
                <h3 className="display text-xl">{item.title}</h3>
                <div className="mt-1 text-muted">
                  {isTodo(item.detail) ? <TodoMark>{item.detail}</TodoMark> : item.detail}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section index={4} label={about.toolkit} spacing="tight">
        <dl className="grid gap-x-[var(--spacing-gutter)] gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {toolkit.map((group) => (
            <div key={group.group} className="border-t border-line pt-5">
              <dt className="display text-xl">{group.group}</dt>
              <dd className="mt-4">
                <TagList items={group.items} />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section index={5} label={about.offScreen} spacing="tight">
        <p className="max-w-[24ch] display text-3xl">
          {offScreen.map((item, i) => (
            <span key={item}>
              {i > 0 && <span className="text-muted"> · </span>}
              {i === offScreen.length - 1 ? <span className="serif-accent">{item}</span> : item}
            </span>
          ))}
        </p>
      </Section>
    </>
  );
}
