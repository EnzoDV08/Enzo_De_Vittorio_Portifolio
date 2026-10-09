import geistFont from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import serifItalicFont from "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2?url";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";
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

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = isRouteErrorResponse(error) ? `${error.status}` : "Error";
  return (
    <main>
      <h1>{message}</h1>
    </main>
  );
}
