import { cn } from "~/lib/cn";

type Props = {
  title: string;
  accent?: string;
  ratio?: string;
  fill?: boolean;
  className?: string;
};

/**
 * Stand-in for project imagery that doesn't exist yet: the title in display type on a tint of
 * the project's accent, over the dot grid. Decorative, the title is always present as real
 * text nearby.
 */
export function ProjectPlaceholder({ title, accent, ratio = "16 / 10", fill, className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "isolate flex items-end overflow-clip bg-bg-2 p-[6%] dot-grid",
        fill ? "absolute inset-0" : "relative w-full",
        className,
      )}
      style={{
        aspectRatio: fill ? undefined : ratio,
        backgroundColor: accent
          ? `color-mix(in oklab, ${accent} 26%, var(--color-bg-2))`
          : undefined,
        containerType: "inline-size",
      }}
    >
      <span className="block display text-[clamp(1.5rem,11cqi,9rem)] text-fg/90">{title}</span>
    </div>
  );
}
