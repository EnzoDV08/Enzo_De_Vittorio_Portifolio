import { ArrowRight, ArrowUp, Download } from "lucide-react";
import { RevealText } from "~/components/motion/RevealText";
import { useLenis } from "~/components/motion/SmoothScroll";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { CopyEmail } from "~/components/ui/CopyEmail";
import { WhatsAppIcon } from "~/components/ui/icons";
import { Socials } from "~/components/ui/Socials";
import { about, contact, contactCta, nav, ui } from "~/content/pages";
import { site } from "~/content/site";
import { usePathname } from "~/lib/usePathname";
import { whatsappHref } from "~/lib/whatsapp";
import { Mark } from "./Nav";

/** The closing "Let's build something." block. Shown at the foot of every page but /contact. */
function ContactCta() {
  const whatsapp = whatsappHref(site.whatsapp, contact.whatsapp.message);
  return (
    <section aria-labelledby="cta-heading" className="pt-8 pb-7 md:pt-10 md:pb-8">
      <Container>
        <div className="grid gap-5 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="text-muted">{contactCta.eyebrow}</p>
            <RevealText id="cta-heading" className="mt-1 display text-[clamp(2rem,1.45rem+2vw,3.5rem)]">
              {contactCta.heading} <span className="italic-accent">{contactCta.accent}</span>
            </RevealText>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
            <div className="hidden sm:block"><CopyEmail /></div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden items-center gap-3 sm:flex">
                <Socials />
                {whatsapp && (
                  <Button href={whatsapp} variant="ghost" icon={<WhatsAppIcon size={16} />}>
                    {contact.whatsapp.label}
                  </Button>
                )}
              </div>
              <Button to="/contact" icon={<ArrowRight />}>
                {contactCta.write}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Footer() {
  const pathname = usePathname();
  const lenis = useLenis();
  const toTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0 });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <footer
      id="footer"
      className="mt-20 overflow-clip rounded-t-xl theme-night md:mt-24"
    >
      {pathname !== "/contact" && <ContactCta />}
      <Container className="pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="grid gap-3 border-t border-line pt-3 md:grid-cols-12 md:items-center">
          <div className="flex items-center gap-3 md:col-span-4">
            <Mark />
            <p className="text-sm text-muted">
              © {new Date().getFullYear()} {site.name}
              <br />
              {ui.footer.built}
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-5">
            <ul className="flex flex-wrap gap-x-1 gap-y-1">
              {nav.map((item) => (
                <li key={item.to}>
                  <TransitionLink
                    to={item.to}
                    className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-muted transition-colors hover:text-fg md:first:-ml-3"
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
              <li>
                <a
                  href={site.cv.href}
                  download={site.cv.fileName}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-muted transition-colors hover:text-fg"
                >
                  <Download className="size-3.5" aria-hidden />
                  {about.cv}
                </a>
              </li>
            </ul>
          </nav>
          <div className="md:col-span-3 md:justify-self-end">
            <button
              type="button"
              onClick={toTop}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-semibold transition-colors hover:border-fg"
            >
              {ui.footer.top}
              <ArrowUp className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
