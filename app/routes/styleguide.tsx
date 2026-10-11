import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { AvailabilityPill } from "~/components/ui/AvailabilityPill";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { GitHubIcon, InstagramIcon, LinkedInIcon, FigmaIcon } from "~/components/ui/icons";
import { Marquee } from "~/components/ui/Marquee";
import { ProjectPlaceholder } from "~/components/ui/ProjectPlaceholder";
import { Section } from "~/components/ui/Section";
import { SectionLabel } from "~/components/ui/SectionLabel";
import { Tag, TagList } from "~/components/ui/Tag";

// Dev-only page (see routes.ts). Strings here describe the design system itself, not Enzo.
export function meta() {
  return [{ title: "Styleguide" }, { name: "robots", content: "noindex" }];
}

const colors = [
  ["bg", "bg-bg"],
  ["bg-2", "bg-bg-2"],
  ["bg-3", "bg-bg-3"],
  ["surface", "bg-surface"],
  ["line", "bg-line"],
  ["line-strong", "bg-line-strong"],
  ["fg", "bg-fg"],
  ["cobalt", "bg-cobalt"],
  ["lime", "bg-lime"],
  ["night", "bg-night"],
  ["muted", "bg-muted"],
  ["accent", "bg-accent"],
  ["signal", "bg-signal"],
] as const;

const sizes = [
  ["text-xs", "text-xs"],
  ["text-sm", "text-sm"],
  ["text-base", "text-base"],
  ["text-lg", "text-lg"],
  ["text-xl", "text-xl"],
  ["text-2xl", "text-2xl"],
  ["text-3xl", "text-3xl"],
  ["text-4xl", "text-4xl"],
] as const;

export default function Styleguide() {
  return (
    <main className="pb-section">
      <Container className="pt-16">
        <SectionLabel>Design system — dev only</SectionLabel>
        <h1 className="mt-6 display text-display">
          Styleguide <span className="italic-accent text-accent">tokens</span>.
        </h1>
      </Container>

      <Section index={1} label="Colour">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {colors.map(([name, cls]) => (
            <li key={name}>
              <div className={`${cls} aspect-[4/3] border border-line`} />
              <p className="mt-2 meta text-muted">--color-{name}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section index={2} label="Type">
        <div className="space-y-6">
          <p className="display text-display">Display</p>
          {sizes.toReversed().map(([name, cls]) => (
            <p key={name} className={`${cls} display`}>
              {name} — Satoshi
            </p>
          ))}
          <p className="italic-accent text-3xl">Satoshi italic accent</p>
          <p className="meta text-muted">Geist Mono meta — 0.06em tracking, uppercase</p>
          <p className="max-w-prose text-base text-muted">
            Body copy is Satoshi 450 at 16–18px with 1.6 line height and a 65ch measure. Muted text
            uses --color-muted, which clears WCAG AA on chalk, night and cobalt.
          </p>
        </div>
      </Section>

      <Section index={3} label="Buttons & tags">
        <div className="flex flex-wrap items-center gap-4">
          <Button to="/_styleguide" icon={<ArrowRight />}>
            Accent
          </Button>
          <Button href="/Enzo-De-Vittorio-CV.pdf" variant="ghost" icon={<Download />} download>
            Ghost
          </Button>
          <Button href="https://example.com" variant="quiet" icon={<ArrowUpRight />}>
            Quiet external
          </Button>
          <Button variant="ghost" onClick={() => undefined}>
            Button element
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Tag>2026</Tag>
          <TagList items={["React", "TypeScript", "GSAP"]} />
        </div>
        <div className="mt-8 flex gap-4 text-fg">
          <GitHubIcon />
          <LinkedInIcon />
          <InstagramIcon />
          <FigmaIcon />
        </div>
      </Section>

      <Section index={4} label="Signature details">
        <div className="flex flex-wrap items-center gap-6">
          <AvailabilityPill>Availability pill</AvailabilityPill>
        </div>
      </Section>

      <Marquee label="Marquee sample" items={["MARQUEE ITEM ONE", "MARQUEE ITEM TWO"]} />

      <Section index={5} label="Placeholders">
        <div className="grid gap-6 md:grid-cols-3">
          <ProjectPlaceholder title="Themed" accent="#E8A33D" />
          <ProjectPlaceholder title="Earth" accent="#8FA68A" />
          <ProjectPlaceholder title="Unthemed" />
        </div>
      </Section>
    </main>
  );
}
