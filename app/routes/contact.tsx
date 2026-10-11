import { ContactForm, emailjsConfig } from "~/components/contact/ContactForm";
import { AvailabilityPill } from "~/components/ui/AvailabilityPill";
import { Container } from "~/components/ui/Container";
import { CopyEmail } from "~/components/ui/CopyEmail";
import { Section } from "~/components/ui/Section";
import { Socials } from "~/components/ui/Socials";
import { contact } from "~/content/pages";
import { site } from "~/content/site";
import { pageMeta } from "~/lib/seo";

export function meta() {
  return pageMeta({ ...contact.meta, path: "/contact" });
}

export default function Contact() {
  return (
    <>
      <Container className="flex min-h-[80svh] flex-col justify-end pt-32 pb-10 md:pt-40">
        <h1 className="display text-display">
          {contact.heading} <span className="italic-accent text-accent">{contact.accent}</span>
        </h1>
        <p className="mt-8 max-w-[40ch] text-lg text-muted">{contact.intro}</p>
        <CopyEmail large className="mt-10" />
        <div className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-sm font-semibold text-muted">{contact.socialsLabel}</p>
            <Socials withLabels className="mt-4" />
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <AvailabilityPill>{site.availability}</AvailabilityPill>
          </div>
        </div>
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
