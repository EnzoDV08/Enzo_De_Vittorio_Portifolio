import satoshiFont from "./styles/fonts/Satoshi-Variable.woff2?url";
import satoshiItalicFont from "./styles/fonts/Satoshi-VariableItalic.woff2?url";
import { useEffect, useRef } from "react";
import { lazy } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";
import { Footer } from "./components/layout/Footer";
import { Nav } from "./components/layout/Nav";
import { Island } from "./components/motion/Island";
import { PageTransition } from "./components/motion/PageTransition";
import { SmoothScroll } from "./components/motion/SmoothScroll";
import { ui } from "./content/pages";
import { usePathname } from "./lib/usePathname";

declare const __SITE_BUILD_ID__: string;

// Only needed when something throws a 404 at runtime (e.g. /work/<unknown> on client nav).
const NotFound = lazy(() => import("./routes/not-found").then((m) => ({ default: m.NotFound })));
// Rendered with `precedence` so React 19 hoists it above the module preloads, the one
// render-blocking request should start first, not last.
import appCss from "./styles/app.css?url";

export const links: Route.LinksFunction = () => [
  // The two files the hero paints with. Everything else loads on demand.
  { rel: "preload", href: satoshiFont, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  {
    rel: "preload",
    href: satoshiItalicFont,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "icon", href: "/favicon-32.png", sizes: "32x32", type: "image/png" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
];

/** Pages that open on a night hero (data-nav="night"); see the scrollbar rule in app.css. */
const NIGHT_TOP = new Set(["/"]);

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <html lang="en-ZA" data-night-top={NIGHT_TOP.has(pathname) ? "" : undefined}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#eceef2" />
        <link rel="stylesheet" href={appCss} precedence="default" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** After client-side navigation, move focus to the new page and announce it. */
function RouteFocus() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}

const RELOADED_FOR = "site-reloaded-for";

/**
 * Refresh an open tab when Netlify publishes a newer build: checked on load, every minute, when
 * the tab comes back into focus, and on every in-app navigation (so a link clicked after a
 * deploy lands on the new site, not the old app's cached code).
 */
function SiteVersionCheck() {
  const pathname = usePathname();
  const checkNow = useRef<() => void>(() => {});

  useEffect(() => {
    if (import.meta.env.DEV) return;

    // Back from an update reload: tidy the cache-busting query out of the address bar.
    const here = new URL(window.location.href);
    if (here.searchParams.has("_site_v")) {
      here.searchParams.delete("_site_v");
      window.history.replaceState(window.history.state, "", here.href);
    }

    let inFlight = false;
    const check = async () => {
      if (document.hidden || inFlight) return;
      inFlight = true;
      try {
        const response = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) return;
        const latest = (await response.json()) as { version?: unknown };
        if (typeof latest.version !== "string" || latest.version === __SITE_BUILD_ID__) return;

        // Reload once per new version: if an edge briefly serves the old HTML after publishing
        // the new version file, this stops a reload loop (the next check after it settles, or
        // the next visit, picks the new site up).
        try {
          if (sessionStorage.getItem(RELOADED_FOR) === latest.version) return;
          sessionStorage.setItem(RELOADED_FOR, latest.version);
        } catch {
          // Storage blocked: the query below still makes the reload fetch fresh HTML.
        }
        // A new URL bypasses any cached copy of the document: a hard refresh.
        const url = new URL(window.location.href);
        url.searchParams.set("_site_v", latest.version);
        window.location.replace(url.href);
      } catch {
        // Keep the current page usable when the visitor is offline.
      } finally {
        inFlight = false;
      }
    };
    checkNow.current = () => void check();

    void check();
    const timer = window.setInterval(() => void check(), 60_000);
    const onReturn = () => void check();
    window.addEventListener("focus", onReturn);
    document.addEventListener("visibilitychange", onReturn);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onReturn);
      document.removeEventListener("visibilitychange", onReturn);
    };
  }, []);

  // Every in-app navigation is a moment to look for a newer build too.
  useEffect(() => {
    checkNow.current();
  }, [pathname]);

  return null;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <PageTransition>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[90] -translate-y-24 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-fg focus:translate-y-0"
        >
          {ui.skip}
        </a>
        <Nav />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer />
        <RouteFocus />
      </PageTransition>
    </SmoothScroll>
  );
}

export default function App() {
  return (
    <>
      <SiteVersionCheck />
      <Shell>
        <Outlet />
      </Shell>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // Unknown URLs normally render the "*" route. A 404 can still be thrown at runtime, e.g. a
  // client navigation to /work/<unknown> finds no prerendered data, so show the same page.
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <Shell>
        <Island>
          <NotFound />
        </Island>
      </Shell>
    );
  }
  const detail = import.meta.env.DEV && error instanceof Error ? error.stack : undefined;
  return (
    <main id="main" className="container-site py-section">
      <h1 className="display text-4xl">{ui.error}</h1>
      {detail && <pre className="mt-8 overflow-auto text-sm text-muted">{detail}</pre>}
    </main>
  );
}
