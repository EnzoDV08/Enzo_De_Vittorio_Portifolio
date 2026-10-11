import { ArrowRight, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useRef, useState } from "react";
import { RevealMedia } from "~/components/motion/RevealMedia";
import { RevealText } from "~/components/motion/RevealText";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Marquee } from "~/components/ui/Marquee";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { Section } from "~/components/ui/Section";
import { LogoTile } from "~/components/ui/LogoTile";
import { SectionLabel } from "~/components/ui/SectionLabel";
import { TodoMark } from "~/components/ui/TodoMark";
import { ToolChip, ToolLogo } from "~/components/ui/ToolLogo";
import { education } from "~/content/education";
import { experience } from "~/content/experience";
import { about } from "~/content/pages";
import { recognition, type Recognition } from "~/content/recognition";
import { site } from "~/content/site";
import { isTodo } from "~/content/todo";
import { coreStack, offScreen, toolkit } from "~/content/toolkit";
import type { TimelineEntry } from "~/content/types";
import { picturesFor, portrait } from "~/lib/content.server";
import type { Picture } from "~/lib/images";
import { personJsonLd } from "~/lib/jsonld";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/about";

export function loader() {
  return {
    portrait: portrait(),
    recognition,
    pictures: picturesFor([
      ...[...experience, ...education].flatMap((entry) => (entry.logo ? [entry.logo] : [])),
      ...recognition.flatMap((item) => [
        ...(item.images ?? []).map((image) => image.src),
        ...(item.logo ? [item.logo] : []),
      ]),
    ]),
  };
}

export function meta() {
  return pageMeta({ ...about.meta, path: "/about", type: "profile", jsonLd: personJsonLd() });
}

type Pictures = Record<string, Picture | undefined>;

function Timeline({ entries, pictures }: { entries: TimelineEntry[]; pictures: Pictures }) {
  return (
    <ol className="grid gap-3">
      {entries.map((entry) => (
        <li
          key={`${entry.title}-${entry.org}`}
          className="relative grid gap-x-[var(--spacing-gutter)] gap-y-2 rounded-lg border border-line bg-surface p-6 md:grid-cols-12 md:items-center md:p-8"
        >
          <p className="text-sm font-semibold text-muted md:col-span-3">
            {isTodo(entry.period) ? <TodoMark>{entry.period}</TodoMark> : entry.period}
          </p>
          {entry.logo && (
            <div className="absolute top-5 right-5 md:static md:order-last md:col-span-2 md:justify-self-end">
              <LogoTile picture={pictures[entry.logo]} className="md:size-16" />
            </div>
          )}
          <div className={entry.logo ? "pr-16 md:col-span-7 md:pr-0" : "md:col-span-9"}>
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
        <div className="grid gap-x-gutter gap-y-16 lg:grid-cols-12 lg:items-center">
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
          <div className="lg:col-span-5">
            <Portrait photo={loaderData.portrait} />
          </div>
        </div>
      </Container>

      {/* 01, Core stack */}
      <Section index={1} label={about.coreStack}>
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <RevealText className="display text-3xl">{about.coreStackIntro}</RevealText>
        </div>
        <ul className="core-stack-grid">
          {coreStack.map((tool) => (
            <li key={tool.name} className="core-stack-card">
              <span aria-hidden="true" className="core-stack-orbit" />
              <span className="core-stack-mark">
                <ToolLogo tool={tool} className="core-stack-logo" />
              </span>
              <span className="core-stack-copy">
                <span className="core-stack-name">{tool.name}</span>
                <span className="core-stack-detail">{tool.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 02, Tools & frameworks */}
      <section aria-labelledby="toolkit-label" className="pt-section">
        <Container>
          <div className="rounded-xl theme-night p-6 sm:p-10 lg:p-16">
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

      {/* 03, Experience */}
      <Section index={3} label={about.experience}>
        <Timeline entries={experience} pictures={loaderData.pictures} />
      </Section>

      {/* 04, Education */}
      <Section index={4} label={about.education} spacing="tight">
        <Timeline entries={education} pictures={loaderData.pictures} />
      </Section>

      {/* 05, Recognition */}
      <Section index={5} label={about.recognition} spacing="tight">
        <ul className="grid gap-3 md:grid-cols-3">
          {loaderData.recognition.map((item, i) => (
            <RecognitionCard
              key={item.title}
              item={item}
              index={i}
              pictures={loaderData.pictures}
            />
          ))}
        </ul>
      </Section>

      {/* 06, Off-screen */}
      <Section index={6} label={about.offScreen} spacing="tight" />
      <Marquee label={about.offScreen} items={offScreen} className="mt-6" />
    </>
  );
}

type Photo = { src: string; alt: string; picture: Picture | undefined };

/** Circular badge text: the tagline, twice round the ring. */
const badgeText = `${site.tagline.replace(/\.$/, "")} • `.repeat(2).toUpperCase();

function Portrait({ photo }: { photo: Photo }) {
  return (
    <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Cobalt arch behind the frame, and a hairline arch echoing it the other way. */}
      <div
        aria-hidden="true"
        className="arch absolute inset-x-0 top-0 translate-x-3 -translate-y-3 bg-cobalt md:translate-x-5 md:-translate-y-5"
      />
      <div
        aria-hidden="true"
        className="arch absolute inset-x-0 top-0 -translate-x-3 translate-y-3 border border-line-strong md:-translate-x-5 md:translate-y-5"
      />
      <RevealMedia className="arch relative bg-bg-2">
        <ResponsiveImage
          picture={photo.picture}
          alt={photo.alt}
          fill
          priority
          sizes="(min-width: 1024px) 38vw, (min-width: 448px) 448px, 90vw"
          className="object-[center_18%]"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-night/70 via-night/25 to-transparent p-5 pt-20 text-white sm:p-6 sm:pt-24">
          <span className="display block text-xl">{site.name}</span>
          <span className="mt-2 block font-mono text-[0.65rem] font-semibold tracking-[0.14em] uppercase opacity-80">
            {site.roles.join(" / ")}
          </span>
        </figcaption>
      </RevealMedia>
      <span
        aria-hidden="true"
        className="absolute top-[30%] -left-3 grid size-24 place-items-center rounded-full bg-lime text-night shadow-xl sm:size-28 md:-left-8 md:size-32"
      >
        <svg viewBox="0 0 120 120" className="absolute inset-0 size-full motion-safe:animate-spin-slow">
          <defs>
            <path id="portrait-badge-ring" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
          </defs>
          <text className="fill-current font-mono text-[10.5px] font-semibold">
            <textPath href="#portrait-badge-ring" textLength="282" lengthAdjust="spacing">
              {badgeText}
            </textPath>
          </text>
        </svg>
        <span className="display text-base sm:text-lg">{site.monogram}</span>
      </span>
    </figure>
  );
}

type Props = {
  item: Recognition;
  index: number;
  pictures: Record<string, Picture | undefined>;
};

function RecognitionCard({ item, index, pictures }: Props) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const images = item.images ?? [];
  const hasCarousel = images.length > 2;
  const move = (direction: number) =>
    setActive((current) => (current + direction + images.length) % images.length);

  return (
    <li
      className={`flex min-w-0 flex-col overflow-hidden rounded-lg border ${
        index === 0 ? "border-lime bg-lime text-night" : "border-line bg-surface"
      }`}
    >
      <div
        className={`relative h-48 overflow-hidden ${item.mockups ? "bg-[#c8e8ff]" : "bg-night"}`}
      >
        {item.mockups ? (
          <>
            <span
              aria-hidden="true"
              className="absolute -top-20 right-0 size-60 rounded-full border-[28px] border-white/30"
            />
            <img
              src={item.mockups.laptop}
              width={800}
              height={571}
              alt="Leke Lente Lingo website shown on a laptop"
              loading="lazy"
              decoding="async"
              className="absolute bottom-[-8%] left-[3%] w-[60%] drop-shadow-xl"
            />
            <img
              src={item.mockups.phone}
              width={440}
              height={587}
              alt="Leke Lente Lingo mobile website shown on a phone"
              loading="lazy"
              decoding="async"
              className="absolute right-[5%] bottom-[-10%] h-[96%] w-auto drop-shadow-xl"
            />
          </>
        ) : hasCarousel ? (
          <div
            className="flex size-full touch-pan-y items-center justify-center gap-1.5 bg-[#342723] px-2"
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const endX = event.changedTouches[0]?.clientX;
              if (touchStartX.current !== null && endX !== undefined) {
                const distance = endX - touchStartX.current;
                if (Math.abs(distance) > 40) move(distance < 0 ? 1 : -1);
              }
              touchStartX.current = null;
            }}
          >
            {[-1, 0, 1].map((offset) => {
              const image = images[(active + offset + images.length) % images.length];
              if (!image) return null;
              return (
                <div
                  key={`${offset}-${image.src}`}
                  className={`relative shrink-0 overflow-hidden rounded-sm border border-white/20 shadow-lg transition-all duration-300 ${
                    offset === 0 ? "z-10 aspect-[3/4] h-[92%]" : "aspect-[3/4] h-[78%] opacity-65"
                  }`}
                >
                  <ResponsiveImage
                    picture={pictures[image.src]}
                    alt={offset === 0 ? image.alt : ""}
                    fill
                    sizes="(min-width: 768px) 160px, 150px"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid size-full grid-cols-2 gap-1">
            {images.map((image) => (
              <div key={image.src} className="relative min-w-0 overflow-hidden">
                <ResponsiveImage
                  picture={pictures[image.src]}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 24vw, 70vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex min-h-10 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {item.logo && (
              <span className="relative size-10 shrink-0 overflow-hidden rounded-sm bg-white ring-1 ring-night/10">
                <ResponsiveImage
                  picture={pictures[item.logo]}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain! p-0.5"
                />
              </span>
            )}
            <span className="truncate font-mono text-[0.65rem] font-semibold tracking-[0.08em] uppercase">
              {item.logoLabel}
            </span>
          </div>
          <span className="shrink-0 font-mono text-[0.65rem] font-semibold tracking-[0.12em] uppercase opacity-60">
            {item.year} / {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="mt-4 display text-[clamp(1.5rem,2vw,2rem)] leading-[1.08]">{item.title}</h3>
        <p className="mt-1 text-sm leading-snug opacity-70">{item.detail}</p>
        {hasCarousel && (
          <div className="mt-auto flex items-center justify-between gap-2 pt-5">
            <div
              className="flex items-center gap-0.5"
              role="group"
              aria-label="Choose a chandelier photo"
            >
              {images.map((image, imageIndex) => (
                <button
                  key={image.src}
                  type="button"
                  aria-label={`Show photo ${imageIndex + 1} of ${images.length}`}
                  aria-pressed={active === imageIndex}
                  onClick={() => setActive(imageIndex)}
                  className="grid size-7 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${active === imageIndex ? "w-5 bg-fg" : "w-1.5 bg-fg/35"}`}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span aria-live="polite" className="mr-1 font-mono text-[0.65rem] opacity-60">
                {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                aria-label="Previous chandelier photo"
                onClick={() => move(-1)}
                className="grid size-9 place-items-center rounded-full border border-line-strong transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent fine:hover:bg-bg-2"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next chandelier photo"
                onClick={() => move(1)}
                className="grid size-9 place-items-center rounded-full border border-line-strong transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent fine:hover:bg-bg-2"
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
        {item.showcase && (
          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-4 text-xs font-semibold">
            {item.project && (
              <a
                href={item.project}
                className="underline underline-offset-4 focus-visible:outline-2"
              >
                View project ↗
              </a>
            )}
            <a
              href={item.showcase}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 focus-visible:outline-2"
            >
              Pendoring entry ↗
            </a>
          </div>
        )}
      </div>
    </li>
  );
}
