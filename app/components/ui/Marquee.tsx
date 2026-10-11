import type { Tool } from "~/content/toolkit";
import { cn } from "~/lib/cn";
import { ToolLogo } from "./ToolLogo";

type Props = {
  items: readonly string[];
  /** Seconds for one full loop. Slow by default. */
  duration?: number;
  className?: string;
  label: string;
};

/**
 * Slow, looping strip of big words. Pauses on hover. With reduced motion it becomes a static
 * wrapped list — the same list screen readers always get.
 */
export function Marquee({ items, duration = 50, className, label }: Props) {
  // Enough repeats that one copy is wider than a 1920px viewport.
  const run = Array.from({ length: 4 }, () => items).flat();
  return (
    <div className={cn("group relative overflow-clip py-6 md:py-8", className)}>
      <ul
        aria-label={label}
        className="sr-only motion-reduce:not-sr-only motion-reduce:container-site motion-reduce:flex motion-reduce:flex-wrap motion-reduce:gap-x-8 motion-reduce:gap-y-2"
      >
        {items.map((item) => (
          <li key={item} className="text-xl font-bold tracking-tight">
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
              <span
                key={i}
                className="flex items-center text-[clamp(1.5rem,1rem+2.4vw,3rem)] font-bold tracking-[-0.04em] whitespace-nowrap"
              >
                <span className="px-6 md:px-10">{item}</span>
                <svg viewBox="0 0 24 24" className="size-[0.6em] shrink-0 text-spark" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"
                  />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Two rows of tool logos drifting in opposite directions. Decorative; the list is in the sr text. */
export function LogoMarquee({ tools, label }: { tools: readonly Tool[]; label: string }) {
  const half = Math.ceil(tools.length / 2);
  const rows = [tools.slice(0, half), tools.slice(half)];
  return (
    <div className="relative space-y-3 overflow-clip [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <p className="sr-only">
        {label}: {tools.map((t) => t.name).join(", ")}
      </p>
      {rows.map((row, r) => {
        const run = Array.from({ length: 3 }, () => row).flat();
        return (
          <div
            key={r}
            aria-hidden="true"
            className={cn(
              "flex w-max motion-reduce:flex-wrap",
              r === 0 ? "animate-marquee" : "animate-marquee-reverse",
            )}
            style={{ "--marquee-duration": "70s" } as React.CSSProperties}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-3 pr-3">
                {run.map((tool, i) => (
                  <span
                    key={`${tool.name}-${i}`}
                    className="inline-flex items-center gap-3 rounded-full border border-line bg-surface py-3 pr-6 pl-4 text-base font-semibold whitespace-nowrap"
                  >
                    <ToolLogo tool={tool} className="size-6" />
                    {tool.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
