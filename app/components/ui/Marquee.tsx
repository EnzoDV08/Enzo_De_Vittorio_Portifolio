import { cn } from "~/lib/cn";

type Props = {
  items: readonly string[];
  /** Seconds for one full loop. Slow by default. */
  duration?: number;
  className?: string;
  label: string;
};

/**
 * Slow, looping strip. Pauses on hover and keyboard focus. With reduced motion it becomes a
 * static wrapped list — the same list screen readers always get.
 */
export function Marquee({ items, duration = 60, className, label }: Props) {
  // Enough repeats that one copy is wider than a 1920px viewport.
  const run = Array.from({ length: 4 }, () => items).flat();
  return (
    <div
      className={cn("group relative overflow-clip border-y border-line py-5 md:py-6", className)}
    >
      <ul
        aria-label={label}
        className="sr-only motion-reduce:not-sr-only motion-reduce:container-site motion-reduce:flex motion-reduce:flex-wrap motion-reduce:gap-x-8 motion-reduce:gap-y-2"
      >
        {items.map((item) => (
          <li key={item} className="meta text-paper">
            {item}
          </li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:hidden"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {run.map((item, i) => (
              <span key={i} className="flex items-center meta whitespace-nowrap text-paper">
                <span className="px-6 md:px-10">{item}</span>
                <span className="size-1.5 shrink-0 bg-accent" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
