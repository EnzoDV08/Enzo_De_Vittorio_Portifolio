import { cn } from "~/lib/cn";

/** TODO markers are a dev-time checklist. In production builds, missing content is simply hidden. */
export const showTodos = import.meta.env.DEV;

/**
 * Visible stand-in for content Enzo still has to supply, in dev only. Deliberately obvious
 * (dashed outline, mono) so a missing fact can never pass for a real one; renders nothing in
 * production, where CONTENT_TODO.md is the list to work through.
 */
export function TodoMark({ children, className }: { children: string; className?: string }) {
  if (!showTodos) return null;
  return (
    <span
      className={cn(
        "inline-block rounded-sm border border-dashed border-[#d43f00] px-2 py-1 meta tracking-normal text-[#b33600] normal-case",
        className,
      )}
    >
      {children}
    </span>
  );
}
