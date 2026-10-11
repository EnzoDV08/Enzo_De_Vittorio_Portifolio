import { cn } from "~/lib/cn";

/**
 * A browser window around a screenshot: traffic lights and an address pill. Decorative chrome
 * only — the image inside carries the alt text.
 */
export function BrowserFrame({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-clip rounded-md border border-line bg-surface shadow-[0_30px_60px_-30px_rgb(12_14_22/0.35)]",
        className,
      )}
    >
      <div aria-hidden="true" className="flex h-8 items-center gap-3 border-b border-line px-3.5 md:h-10">
        <span className="flex gap-1.5">
          <i className="size-2.5 rounded-full bg-[#ff5f57]" />
          <i className="size-2.5 rounded-full bg-[#febc2e]" />
          <i className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        {label && (
          <span className="mx-auto hidden max-w-[50%] truncate rounded-full bg-bg-2 px-4 py-0.5 text-xs text-muted sm:block">
            {label}
          </span>
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
