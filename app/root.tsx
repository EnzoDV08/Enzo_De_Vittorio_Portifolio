import geistFont from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import serifItalicFont from "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2?url";
import { useEffect, useRef } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
} from "react-router";
import type { Route } from "./+types/root";
import { Footer } from "./components/layout/Footer";
import { Nav } from "./components/layout/Nav";
import { Cursor } from "./components/motion/Cursor";
import { PageTransition } from "./components/motion/PageTransition";
import { SmoothScroll } from "./components/motion/SmoothScroll";
import { ui } from "./content/pages";
import NotFound from "./routes/not-found";
import "./styles/app.css";

export const links: Route.LinksFunction = () => [
  // The two files the hero paints with. Everything else loads on demand.
  { rel: "preload", href: geistFont, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  {
    rel: "preload",
    href: serifItalicFont,
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
        <meta name="theme-color" content="#0b0b0d" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <div className="grain" aria-hidden="true" />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** After client-side navigation, move focus to the new page and announce it. */
function RouteFocus() {
  const { pathname } = useLocation();
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
          className="fixed top-3 left-3 z-[90] -translate-y-24 rounded-sm bg-accent px-4 py-3 meta text-accent-ink focus:translate-y-0"
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
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <Shell>
        <NotFound />
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
