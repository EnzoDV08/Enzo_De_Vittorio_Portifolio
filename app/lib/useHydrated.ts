import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * False during prerender and the hydration render, true afterwards. Use it before reading
 * anything the static HTML couldn't know (query params, viewport) so hydration matches.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
