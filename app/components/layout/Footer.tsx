import { ArrowRight, ArrowUp, Download } from "lucide-react";
import { useLocation } from "react-router";
import { RevealText } from "~/components/motion/RevealText";
import { useLenis } from "~/components/motion/SmoothScroll";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { CopyEmail } from "~/components/ui/CopyEmail";
import { Socials } from "~/components/ui/Socials";
import { about, contactCta, nav, ui } from "~/content/pages";
import { site } from "~/content/site";

/** The closing "Let's build something." block. Shown at the foot of every page but /contact. */
function ContactCta() {
  return (
    <section aria-labelledby="cta-heading" className="pt-section pb-20 md:pb-28">
      <Container>
        <div className="border-t border-line pt-5">
          <RevealText
            id="cta-heading"
            className="mt-12 display text-[clamp(3rem,12vw,12rem)] md:mt-20"
          >
            {contactCta.heading}{" "}
            <span className="serif-accent text-accent">{contactCta.accent}</span>
          </RevealText>
          <div className="mt-12 flex flex-col gap-8 md:mt-16 lg:flex-row lg:items-end lg:justify-between">
            <CopyEmail large />
            <div className="flex flex-wrap items-center gap-3">
              <Socials />
              <Button to="/contact" variant="ghost" icon={<ArrowRight />}>
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
  const { pathname } = useLocation();
  const lenis = useLenis();
  const toTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0 });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <footer id="footer">
      {pathname !== "/contact" && <ContactCta />}
      <Container className="pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="grid gap-8 border-t border-line pt-6 md:grid-cols-12 md:items-start">
          <p className="meta text-muted md:col-span-4">
            © {new Date().getFullYear()} {site.name}
            <br />
            {ui.footer.built}
          </p>
          <nav aria-label="Footer" className="md:col-span-5">
            <ul className="flex flex-wrap gap-x-1 gap-y-1">
              {nav.map((item) => (
                <li key={item.to}>
                  <TransitionLink
                    to={item.to}
                    className="inline-flex min-h-11 items-center px-2 meta text-muted transition-colors hover:text-paper md:first:-ml-2"
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
              <li>
                <a
                  href={site.cv.href}
                  download={site.cv.fileName}
                  className="inline-flex min-h-11 items-center gap-1.5 px-2 meta text-muted transition-colors hover:text-paper"
                >
                  <Download className="size-3" aria-hidden />
                  {about.cv}
                </a>
              </li>
            </ul>
          </nav>
          <div className="md:col-span-3 md:justify-self-end">
            <button
              type="button"
              onClick={toTop}
              className="inline-flex min-h-11 items-center gap-2 meta text-muted transition-colors hover:text-paper"
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
