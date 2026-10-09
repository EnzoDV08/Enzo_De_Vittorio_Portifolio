import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { useLenis } from "~/components/motion/SmoothScroll";
import { AvailabilityPill } from "~/components/ui/AvailabilityPill";
import { Clock } from "~/components/ui/Clock";
import { CopyEmail } from "~/components/ui/CopyEmail";
import { Socials } from "~/components/ui/Socials";
import { nav, ui } from "~/content/pages";
import { site } from "~/content/site";
import { cn } from "~/lib/cn";

function isActive(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function Nav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const navigatedAway = useRef(false);
  const lenis = useLenis();

  // Solid bar once the page has moved; transparent over the top of the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu when a link inside it navigates.
  useEffect(() => {
    navigatedAway.current = true;
    setOpen(false);
  }, [pathname]);

  // Open menu: lock scroll, make the rest of the page inert, trap Esc, focus the first link.
  useEffect(() => {
    if (!open) return;
    navigatedAway.current = false;
    const toggleButton = toggle.current;
    const root = document.documentElement;
    const outside = ["main", "footer"].map((id) => document.getElementById(id));
    lenis?.stop();
    root.style.overflow = "hidden";
    outside.forEach((el) => el?.setAttribute("inert", ""));
    menu.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      outside.forEach((el) => el?.removeAttribute("inert"));
      root.style.overflow = "";
      lenis?.start();
      // Closed with the button or Esc: give focus back to the toggle. Navigated: the page owns focus.
      if (!navigatedAway.current) toggleButton?.focus();
    };
  }, [open, lenis]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
        "border-b",
        scrolled || open ? "border-line bg-ink" : "border-transparent bg-transparent",
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <TransitionLink
          to="/"
          className="group flex min-h-11 items-center gap-3"
          aria-label={`${site.name} — ${ui.home}`}
        >
          <span className="display text-xl tracking-[-0.03em] text-paper transition-colors group-hover:text-accent">
            {site.monogram}
          </span>
          <span className="hidden meta text-muted sm:inline">{site.name}</span>
        </TransitionLink>

        <Clock
          place={site.clock.place}
          timeZone={site.clock.timeZone}
          zone={site.clock.zone}
          className="hidden meta text-muted md:block"
        />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = isActive(pathname, item.to);
              return (
                <li key={item.to}>
                  <TransitionLink
                    to={item.to}
                    aria-current={pathname === item.to ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center px-3 meta transition-colors duration-300",
                      active ? "text-paper" : "text-muted hover:text-paper",
                    )}
                  >
                    {active && <span aria-hidden="true" className="mr-2 size-1.5 bg-accent" />}
                    {item.label}
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          ref={toggle}
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
          className="-mr-3 inline-flex min-h-11 min-w-11 items-center gap-2 px-3 meta text-paper lg:hidden"
        >
          <span>{open ? ui.close : ui.menu}</span>
          <span aria-hidden="true" className="relative block h-2 w-5">
            <span
              className={cn(
                "absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300",
                open && "translate-y-1 rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300",
                open && "-translate-y-[3px] -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      {/* Full-screen menu below 1024px */}
      <div
        id="menu"
        ref={menu}
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto overscroll-contain bg-ink md:top-[4.5rem] lg:hidden"
        data-lenis-prevent
      >
        <nav aria-label="Menu" className="container-site flex min-h-full flex-col pt-8 pb-10">
          <ul className="border-t border-line">
            {nav.map((item, i) => (
              <li key={item.to} className="border-b border-line">
                <TransitionLink
                  to={item.to}
                  aria-current={pathname === item.to ? "page" : undefined}
                  className="group flex items-baseline gap-4 py-4"
                >
                  <span className="w-8 meta text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="line-mask">
                    <span
                      className={cn(
                        "block display text-4xl motion-safe:animate-rise",
                        isActive(pathname, item.to) ? "text-accent" : "text-paper",
                      )}
                      style={{ animationDelay: `${80 + i * 60}ms` }}
                    >
                      {item.label}
                    </span>
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-6 pt-12">
            <AvailabilityPill>{site.availability}</AvailabilityPill>
            <CopyEmail />
            <Socials withLabels />
            <Clock
              place={site.clock.place}
              timeZone={site.clock.timeZone}
              zone={site.clock.zone}
              className="meta text-muted"
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
