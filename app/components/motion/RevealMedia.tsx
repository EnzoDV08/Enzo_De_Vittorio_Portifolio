import { lazy, useRef } from "react";
import { Island } from "~/components/motion/Island";
import { cn } from "~/lib/cn";
import { useMotionAllowed } from "~/lib/motion";

const RevealMediaFx = lazy(() => import("./fx/RevealMediaFx"));

type Props = { children: React.ReactNode; className?: string; innerClassName?: string };

/** Media that wipes open from the bottom while settling from 1.1× scale. */
export function RevealMedia({ children, className, innerClassName }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const motion = useMotionAllowed();
  return (
    <div ref={frame} className={cn("relative overflow-clip", className)}>
      <div ref={inner} className={cn("relative size-full", innerClassName)}>
        {children}
      </div>
      {motion && (
        <Island>
          <RevealMediaFx frame={frame} inner={inner} />
        </Island>
      )}
    </div>
  );
}
