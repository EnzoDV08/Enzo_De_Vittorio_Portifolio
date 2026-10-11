import { useCallback, useSyncExternalStore } from "react";

/** Subscribe to a media query. Returns `serverValue` during prerender and hydration. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Desktop with a precise pointer, the only place hover-driven UI (cursor, previews) runs. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
