import { ArrowUpRight, Download, Mail } from "lucide-react";
import { ContactForm, emailjsConfig } from "~/components/contact/ContactForm";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { CopyEmail } from "~/components/ui/CopyEmail";
import { WhatsAppIcon } from "~/components/ui/icons";
import { Section } from "~/components/ui/Section";
import { Socials } from "~/components/ui/Socials";
import { showTodos, TodoMark } from "~/components/ui/TodoMark";
import { contact } from "~/content/pages";
import { site } from "~/content/site";
import { cn } from "~/lib/cn";
import { pageMeta } from "~/lib/seo";
import { whatsappHref } from "~/lib/whatsapp";

export function meta() {
  return pageMeta({ ...contact.meta, path: "/contact" });
}

/** One way to reach Enzo: icon, label, the detail itself, and what to do with it. */
function Method({
  icon,
  label,
  children,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "flex flex-col rounded-xl border border-line p-6 transition-transform duration-500 ease-out-expo md:p-8 fine:hover:-translate-y-1",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full border border-line-strong">
        {icon}
      </span>
      <h2 className="mt-8 meta text-muted">{label}</h2>
      <div className="mt-3 flex flex-1 flex-col">{children}</div>
    </li>
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

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
          <Method
            icon={<Mail className="size-5" aria-hidden />}
            label={contact.email.label}
            className="theme-cobalt"
          >
            <CopyEmail className="mt-1" />
            <Button href={`mailto:${site.email}`} external={false} className="mt-auto self-start">
              {contact.email.write}
            </Button>
          </Method>

          {(whatsapp || showTodos) && (
            <Method
              icon={<WhatsAppIcon size={20} />}
              label={contact.whatsapp.label}
              className="theme-night"
            >
              {whatsapp ? (
                <>
                  <p className="text-2xl font-bold tracking-tight">{site.whatsapp}</p>
                  <Button href={whatsapp} icon={<ArrowUpRight />} className="mt-8 self-start">
                    {contact.whatsapp.chat}
                  </Button>
                </>
              ) : (
                <TodoMark>{site.whatsapp}</TodoMark>
              )}
            </Method>
          )}

          <Method
            icon={<ArrowUpRight className="size-5" aria-hidden />}
            label={contact.elsewhere.label}
            className="bg-surface"
          >
            <Socials withLabels />
            <a
              href={site.cv.href}
              download={site.cv.fileName}
              className="mt-8 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
            >
              <Download className="size-4" aria-hidden />
              {contact.elsewhere.cv}
            </a>
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
