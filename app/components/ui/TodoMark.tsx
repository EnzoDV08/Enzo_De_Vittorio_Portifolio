import { cn } from "~/lib/cn";

/**
 * Visible stand-in for content Enzo still has to supply. Deliberately obvious — dashed accent
 * outline, mono — so a missing fact can never pass for a real one.
 */
export function TodoMark({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm border border-dashed border-accent/70 px-2 py-1 meta tracking-normal text-accent normal-case",
        className,
      )}
    >
      {children}
    </span>
  );
}
