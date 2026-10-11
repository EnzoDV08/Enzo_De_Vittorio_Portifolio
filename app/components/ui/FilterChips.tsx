import { cn } from "~/lib/cn";

type Option = { value: string | null; label: string };

/** Toggle buttons for a single-choice filter. `aria-pressed` marks the active one. */
export function FilterChips({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const pressed = option.value === value;
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors duration-300",
              pressed
                ? "border-fg bg-fg text-bg"
                : "border-line-strong text-fg hover:border-fg",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
