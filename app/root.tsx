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
import { Cursor } from "./components/motion/Cursor";
import { Island } from "./components/motion/Island";
import { PageTransition } from "./components/motion/PageTransition";
import { SmoothScroll } from "./components/motion/SmoothScroll";
import { ui } from "./content/pages";
import { usePathname } from "./lib/usePathname";

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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA">
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
        <Cursor />
        <RouteFocus />
      </PageTransition>
    </SmoothScroll>
  );
}

export default function App() {
  return (
    <Shell>
      <Outlet />
    </Shell>
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
