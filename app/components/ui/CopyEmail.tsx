import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { contactCta } from "~/content/pages";
import { site } from "~/content/site";
import { cn } from "~/lib/cn";

/**
 * Copies the email address (or opens the mail app if the clipboard is blocked). `size` replaces
 * the default size classes, e.g. to match <Button> beside it.
 */
export function CopyEmailButton({
  size = "min-h-11 px-4 text-sm [&>svg]:size-3.5",
}: {
  size?: string;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-line-strong font-semibold transition-colors duration-300 hover:border-fg",
          size,
        )}
      >
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
        <span>{copied ? contactCta.copied : contactCta.copy}</span>
      </button>
      <span role="status" className="sr-only">
        {copied ? contactCta.copied : ""}
      </span>
    </>
  );
}

/** The email address as a mailto link, plus a copy-to-clipboard button. */
export function CopyEmail({ className, large = false }: { className?: string; large?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-3", className)}>
      <a
        href={`mailto:${site.email}`}
        className={cn(
          "break-all underline decoration-line-strong decoration-2 underline-offset-[0.2em] transition-colors duration-300 hover:text-accent hover:decoration-accent",
          large
            ? "text-[clamp(1.375rem,1rem+2vw,2.5rem)] font-bold tracking-[-0.03em]"
            : "text-lg font-semibold",
        )}
      >
        {site.email}
      </a>
      <CopyEmailButton />
    </div>
  );
}
