import { useEffect } from "react";

declare const __SITE_BUILD_ID__: string;

// Loaded after hydration (see root.tsx): nothing here is needed for the first paint, so it
// stays out of every page's initial JavaScript.
const RELOADED_FOR = "site-reloaded-for";
const RELOAD_SCROLL = "site-reload-scroll";

/**
 * Move an open tab onto a newer Netlify build, without ever reloading in front of the visitor
 * (a reload replays the page's entrance, which reads as the page loading twice). Checked on
 * load, every minute and when the tab is shown again. Once a newer build is out:
 *  - the next click on a link to this site is a normal page load of the new site, instead of
 *    the old app routing to it;
 *  - if the tab goes into the background first, it reloads there, unseen, and comes back at
 *    the same scroll position.
 */
export default function SiteVersionCheck() {
  useEffect(() => {
    if (import.meta.env.DEV) return;

    // Back from an update reload: tidy the cache-busting query out of the address bar, and
    // return to where the page was.
    const here = new URL(window.location.href);
    if (here.searchParams.has("_site_v")) {
      here.searchParams.delete("_site_v");
      window.history.replaceState(window.history.state, "", here.href);
      try {
        const saved = JSON.parse(sessionStorage.getItem(RELOAD_SCROLL) ?? "null") as {
          path: string;
          y: number;
        } | null;
        sessionStorage.removeItem(RELOAD_SCROLL);
        if (saved?.path === here.pathname) window.scrollTo(0, saved.y);
      } catch {
        // No storage: it simply opens at the top.
      }
    }

    /** The newer build's version, once one is out. */
    let newer: string | null = null;
    // A new URL bypasses any cached copy of the document.
    const fresh = (href: string) => {
      const url = new URL(href, window.location.href);
      url.searchParams.set("_site_v", newer ?? "");
      return url.href;
    };

    /** Reload onto the new build, only while the tab is hidden, and once per version (if an
     *  edge briefly serves the old HTML after a deploy, this can't turn into a loop). */
    const reloadUnseen = () => {
      if (!newer || !document.hidden) return;
      try {
        if (sessionStorage.getItem(RELOADED_FOR) === newer) return;
        sessionStorage.setItem(RELOADED_FOR, newer);
        sessionStorage.setItem(
          RELOAD_SCROLL,
          JSON.stringify({ path: window.location.pathname, y: window.scrollY }),
        );
      } catch {
        return;
      }
      window.location.replace(fresh(window.location.href));
    };

    let inFlight = false;
    const check = async () => {
      if (inFlight || newer) return;
      inFlight = true;
      try {
        const response = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) return;
        const latest = (await response.json()) as { version?: unknown };
        if (typeof latest.version !== "string" || latest.version === __SITE_BUILD_ID__) return;
        newer = latest.version;
        reloadUnseen();
      } catch {
        // Keep the current page usable when the visitor is offline.
      } finally {
        inFlight = false;
      }
    };

    // Capture on window runs before the router's own click handling, so the browser loads the
    // page itself. Same-page anchors, new tabs, downloads and modified clicks are left alone.
    const onClick = (event: MouseEvent) => {
      if (!newer || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(fresh(url.href));
    };

    const onVisibility = () => {
      if (document.hidden) reloadUnseen();
      else void check();
    };

    void check();
    const timer = window.setInterval(() => void check(), 60_000);
    window.addEventListener("click", onClick, true);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
