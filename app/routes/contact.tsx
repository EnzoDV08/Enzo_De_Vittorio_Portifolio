import { ArrowUpRight, Download, Mail } from "lucide-react";
import { ContactForm, emailjsConfig } from "~/components/contact/ContactForm";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { CopyEmailButton } from "~/components/ui/CopyEmail";
import { GitHubIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon } from "~/components/ui/icons";
import { Section } from "~/components/ui/Section";
import { showTodos, TodoMark } from "~/components/ui/TodoMark";
import { contact } from "~/content/pages";
import { contactMethods } from "~/content/contact-methods";
import { site, socialLabels, type SocialKey } from "~/content/site";
import { isTodo } from "~/content/todo";
import { cn } from "~/lib/cn";
import { pageMeta } from "~/lib/seo";
import { whatsappHref } from "~/lib/whatsapp";

export function meta() {
  return pageMeta({ ...contact.meta, path: "/contact" });
}

/** One way to reach Enzo: icon and label up top, then the detail and what to do with it. */
function Method({
  icon,
  label,
  note,
  children,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  note: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li className={cn("flex flex-col rounded-xl border border-line p-6 sm:p-8 lg:p-10", className)}>
      <div className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line-strong">
          {icon}
        </span>
        <div>
          <h2 className="meta">{label}</h2>
          <p className="mt-1 text-sm text-muted">{note}</p>
        </div>
      </div>
      <div className="mt-10 flex flex-1 flex-col md:mt-14">{children}</div>
    </li>
  );
}

const socialIcons: Record<SocialKey, typeof GitHubIcon> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
};

/** Each profile as a tile: icon, name and handle. A TODO profile is left out. */
function SocialTiles() {
  const entries = (Object.entries(site.socials) as [SocialKey, string][]).filter(
    ([, url]) => !isTodo(url),
  );
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {entries.map(([key, url]) => {
        const Icon = socialIcons[key];
        return (
          <li key={key}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer me"
              className="group/tile flex h-full flex-col justify-between gap-4 rounded-lg border border-line-strong bg-bg p-5 transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-bg sm:min-h-32 sm:gap-6"
            >
              <span className="flex items-start justify-between">
                <Icon size={24} />
                <ArrowUpRight
                  className="size-4 text-muted transition-[color,translate] duration-300 group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5 group-hover/tile:text-bg"
                  aria-hidden
                />
              </span>
              <span>
                <span className="block text-lg font-semibold tracking-tight">
                  {socialLabels[key]}
                </span>
                <span className="block text-sm text-muted transition-colors duration-300 group-hover/tile:text-bg/70">
                  {contactMethods.handles[key]}
                </span>
                <span className="sr-only"> {contactMethods.elsewhere.newTab}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function Contact() {
  const whatsapp = whatsappHref(site.whatsapp, contact.whatsapp.message);

  return (
    <>
      <Container className="pt-32 md:pt-40">
        <p className="meta text-muted">{contact.eyebrow}</p>
        <h1 className="mt-4 display text-display">
          {contact.heading} <span className="italic-accent text-accent">{contact.accent}</span>
        </h1>
        <p className="mt-8 max-w-[44ch] text-lg text-muted">{contact.intro}</p>

        <ul className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-12">
          <Method
            icon={<Mail className="size-5" aria-hidden />}
            label={contact.email.label}
            note={contactMethods.email.note}
            className={cn(
              "theme-cobalt",
              whatsapp || showTodos ? "lg:col-span-7" : "lg:col-span-12",
            )}
          >
            <a
              href={`mailto:${site.email}`}
              className="self-start text-[clamp(1.5rem,0.9rem+2.6vw,3rem)] leading-[1.05] font-bold tracking-[-0.035em] break-all underline decoration-line-strong decoration-2 underline-offset-[0.18em] transition-colors duration-300 hover:decoration-accent"
            >
              {site.email}
            </a>
            <div className="mt-auto flex flex-wrap gap-3 pt-10">
              <Button
                href={`mailto:${site.email}`}
                external={false}
                icon={<ArrowUpRight />}
                className="max-sm:w-full"
              >
                {contact.email.write}
              </Button>
              <CopyEmailButton size="min-h-12 justify-center gap-2.5 max-sm:w-full px-6 py-3 text-[0.9375rem] tracking-[-0.01em] hover:bg-fg hover:text-bg [&>svg]:size-4" />
            </div>
          </Method>

          {(whatsapp || showTodos) && (
            <Method
              icon={<WhatsAppIcon size={20} />}
              label={contact.whatsapp.label}
              note={contactMethods.whatsapp.note}
              className="theme-night lg:col-span-5"
            >
              {whatsapp ? (
                <>
                  <p className="text-[clamp(2rem,1.2rem+3vw,3.5rem)] leading-none font-bold tracking-[-0.04em] whitespace-nowrap">
                    {site.whatsapp}
                  </p>
                  <div className="mt-auto pt-10">
                    <Button href={whatsapp} icon={<ArrowUpRight />} className="max-sm:w-full">
                      {contact.whatsapp.chat}
                    </Button>
                  </div>
                </>
              ) : (
                <TodoMark>{site.whatsapp}</TodoMark>
              )}
            </Method>
          )}

          <Method
            icon={<ArrowUpRight className="size-5" aria-hidden />}
            label={contact.elsewhere.label}
            note={contactMethods.elsewhere.note}
            className="bg-surface lg:col-span-12"
          >
            <div className="grid gap-3 lg:grid-cols-[1fr_17rem]">
              <SocialTiles />
              <a
                href={site.cv.href}
                download={site.cv.fileName}
                className="group/cv flex flex-col justify-between gap-4 rounded-lg bg-fg p-5 text-bg transition-colors duration-300 hover:bg-accent hover:text-accent-fg sm:min-h-32 sm:gap-6"
              >
                <Download
                  className="size-6 transition-transform duration-300 group-hover/cv:translate-y-0.5"
                  aria-hidden
                />
                <span>
                  <span className="block text-lg font-semibold tracking-tight">
                    {contact.elsewhere.cv}
                  </span>
                  <span className="block text-sm opacity-70">
                    {contactMethods.elsewhere.cvDetail}
                  </span>
                </span>
              </a>
            </div>
          </Method>
        </ul>
      </Container>

      {emailjsConfig && (
        <Section index={1} label={contact.form.label}>
          <div className="max-w-3xl">
            <ContactForm />
          </div>
        </Section>
      )}
    </>
  );
}
