import { useLocation } from "react-router";

/** "/work/" → "/work". The root stays "/". */
export const normalizePath = (path: string) =>
  path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

/**
 * The current pathname without a trailing slash. Prerendering requests "/contact/" while the
 * browser (Firebase, trailingSlash: false) sees "/contact"; comparing raw paths would make the
 * static HTML disagree with hydration.
 */
export function usePathname(): string {
  return normalizePath(useLocation().pathname);
}
