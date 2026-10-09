import { cn } from "~/lib/cn";

type Props = { index?: number; children: React.ReactNode; className?: string; id?: string };

/** Mono section marker, e.g. "(02) — SELECTED WORK". */
export function SectionLabel({ index, children, className, id }: Props) {
  return (
    <p id={id} className={cn("meta text-muted", className)}>
      {index !== undefined && (
        <>
          <span className="text-paper">({String(index).padStart(2, "0")})</span>
          <span aria-hidden="true"> — </span>
        </>
      )}
      {children}
    </p>
  );
}
