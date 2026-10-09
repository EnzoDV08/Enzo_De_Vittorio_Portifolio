import { cn } from "~/lib/cn";

type Props = {
  title: string;
  accent?: string;
  ratio?: string;
  fill?: boolean;
  className?: string;
};

/**
 * Stand-in for project imagery that doesn't exist yet: the title in display type on the
 * project's accent, with grain. Decorative — the title is always present as real text nearby.
 */
export function ProjectPlaceholder({ title, accent, ratio = "16 / 10", fill, className }: Props) {
  const themed = Boolean(accent);
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative isolate flex items-end overflow-clip p-[6%]",
        fill ? "absolute inset-0" : "w-full",
        themed ? "text-ink" : "bg-ink-3 text-paper",
        className,
      )}
      style={{
        aspectRatio: fill ? undefined : ratio,
        backgroundColor: accent,
        containerType: "inline-size",
      }}
    >
      <span className="block display text-[clamp(1.5rem,11cqi,9rem)]">{title}</span>
      <span className="grain-local" />
    </div>
  );
}
