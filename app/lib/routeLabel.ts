import { getProject } from "~/content/projects";
import { nav, ui } from "~/content/pages";

/** Human title for a path — shown in the page-transition wipe. */
export function routeLabel(path: string): string {
  const pathname = path.split(/[?#]/)[0] ?? "/";
  if (pathname === "/" || pathname === "") return ui.home;
  const project = pathname.match(/^\/work\/([^/]+)/);
  if (project) return getProject(project[1])?.title ?? "";
  return nav.find((item) => item.to === pathname)?.label ?? "";
}
