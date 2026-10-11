import { lazy } from "react";
import { Island } from "~/components/motion/Island";
import { useMotionAllowed } from "~/lib/motion";
import { FINE_POINTER, useMediaQuery } from "~/lib/useMediaQuery";

const CursorFx = lazy(() => import("./fx/CursorFx"));

/**
 * Desktop-only follower dot. Over elements with `data-cursor="<label>"` (project media) it
 * grows into a "<label> →" tag and hides the native cursor there. Everywhere else the native
 * cursor is untouched; over text inputs the dot gets out of the way.
 */
export function Cursor() {
  const fine = useMediaQuery(FINE_POINTER);
  const motion = useMotionAllowed();
  if (!fine || !motion) return null;
  return (
    <Island>
      <CursorFx />
    </Island>
  );
}
