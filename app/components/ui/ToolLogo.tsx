import type { Tool } from "~/content/toolkit";
import { cn } from "~/lib/cn";

/**
 * A tool's mark in the current text colour (the SVG is a CSS mask, so it follows the theme),
 * a two-letter monogram tile when there's no mark, or a small dot for practices.
 */
export function ToolLogo({ tool, className }: { tool: Tool; className?: string }) {
  if (tool.logo) {
    const url = `url(/logos/${tool.logo}.svg)`;
    return (
      <span
        aria-hidden="true"
        className={cn("inline-block size-5 shrink-0 bg-current", className)}
        style={{
          maskImage: url,
          WebkitMaskImage: url,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    );
  }
  if (tool.monogram) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-grid size-5 shrink-0 place-items-center rounded-[5px] border border-current text-[0.6rem] leading-none font-bold tracking-tight",
          className,
        )}
      >
        {tool.monogram}
      </span>
    );
  }
  return (
    <span aria-hidden="true" className={cn("inline-grid size-5 shrink-0 place-items-center", className)}>
      <span className="size-1.5 rounded-full bg-current" />
    </span>
  );
}

export function ToolChip({ tool, className }: { tool: Tool; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-10 items-center gap-2.5 rounded-full border border-line bg-surface/60 py-1.5 pr-4 pl-3 text-sm font-medium",
        className,
      )}
    >
      <ToolLogo tool={tool} className="size-4" />
      {tool.name}
    </span>
  );
}
