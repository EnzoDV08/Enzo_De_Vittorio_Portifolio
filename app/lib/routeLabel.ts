import { nav, ui } from "~/content/pages";

/** Title for a path in the page wipe, when the link didn't pass one (project links do). */
export function routeLabel(path: string): string {
  const pathname = path.split(/[?#]/)[0] ?? "/";
  if (pathname === "/" || pathname === "") return ui.home;
  return nav.find((item) => item.to === pathname)?.label ?? "";
}
