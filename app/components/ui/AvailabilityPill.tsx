import { cn } from "~/lib/cn";

export function AvailabilityPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 rounded-sm border border-line px-3 py-2 meta text-paper",
        className,
      )}
    >
      <span className="relative flex size-2 shrink-0" aria-hidden="true">
        <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-60 [animation-duration:2.4s] motion-reduce:hidden" />
        <span className="relative size-2 rounded-full bg-signal" />
      </span>
      <span>{children}</span>
    </p>
  );
}
