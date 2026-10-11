import { cn } from "~/lib/cn";

type Props = { index?: number; children: React.ReactNode; className?: string; id?: string };

/** Section marker: a small numbered pill, e.g. "02 · Selected work". */
export function SectionLabel({ index, children, className, id }: Props) {
  return (
    <p
      id={id}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-line-strong py-1.5 pr-3.5 pl-1.5 meta text-fg",
        className,
      )}
    >
      {index !== undefined ? (
        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-accent px-1.5 text-accent-fg">
          {String(index).padStart(2, "0")}
        </span>
      ) : (
        <span aria-hidden="true" className="ml-1.5 size-1.5 rounded-full bg-accent" />
      )}
      {children}
    </p>
  );
}
