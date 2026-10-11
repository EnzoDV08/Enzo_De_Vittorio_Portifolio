import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { useLenis } from "~/components/motion/SmoothScroll";
import { AvailabilityPill } from "~/components/ui/AvailabilityPill";
import { CopyEmail } from "~/components/ui/CopyEmail";
import { Socials } from "~/components/ui/Socials";
import { nav, navCta, ui } from "~/content/pages";
import { site } from "~/content/site";
import { cn } from "~/lib/cn";
import { usePathname } from "~/lib/usePathname";

function isActive(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`);
}

/** The EDV mark: monogram in a cobalt disc. */
export function Mark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-9 place-items-center rounded-full bg-cobalt text-[0.8rem] font-black tracking-[-0.06em] text-white",
        className,
      )}
    >
      {site.monogram}
    </span>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const navigatedAway = useRef(false);
  const lenis = useLenis();

  // A floating pill: clear over the top of the page, frosted once it has moved.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
    <header className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4">
      <div className="container-site">
        <div
          className={cn(
            "relative z-10 flex h-14 items-center justify-between gap-4 rounded-full border pr-2 pl-2.5 transition-[background-color,border-color,box-shadow] duration-500 md:h-16",
            scrolled || open
              ? "border-line bg-surface/80 shadow-[0_12px_40px_-20px_rgb(12_14_22/0.35)] backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <TransitionLink
            to="/"
            className="group flex min-h-11 items-center gap-3 rounded-full pr-2"
            aria-label={`${site.name} — ${ui.home}`}
          >
            <Mark className="transition-transform duration-500 ease-out-expo group-hover:rotate-[-12deg]" />
            <span className="hidden text-[0.9375rem] font-bold tracking-[-0.02em] sm:inline">
              {site.name}
            </span>
          </TransitionLink>

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
                        "relative inline-flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] font-semibold transition-colors duration-300",
                        active ? "bg-fg text-bg" : "text-fg hover:bg-bg-2",
                      )}
                    >
                      {item.label}
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <TransitionLink
              to="/contact"
              className="hidden min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-[0.9375rem] font-semibold text-accent-fg transition-colors duration-300 hover:bg-fg hover:text-bg sm:inline-flex"
            >
              {navCta}
              <ArrowUpRight className="size-4" aria-hidden />
            </TransitionLink>
            <button
              ref={toggle}
              type="button"
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-full bg-fg px-4 text-[0.9375rem] font-semibold text-bg lg:hidden"
            >
              <span>{open ? ui.close : ui.menu}</span>
              <span aria-hidden="true" className="relative block h-2 w-4">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-[1.5px] bg-current transition-transform duration-300",
                    open && "translate-y-[3.5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-[1.5px] bg-current transition-transform duration-300",
                    open && "-translate-y-[3px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen menu below 1024px */}
      <div
        id="menu"
        ref={menu}
        hidden={!open}
        className="fixed inset-0 overflow-y-auto overscroll-contain theme-night lg:hidden"
        data-lenis-prevent
      >
        <nav aria-label="Menu" className="container-site flex min-h-full flex-col pt-28 pb-10">
          <ul>
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
                        "block display text-[clamp(3rem,15vw,5rem)] motion-safe:animate-rise",
                        isActive(pathname, item.to) && "italic-accent",
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
          </div>
        </nav>
      </div>
    </header>
  );
}
