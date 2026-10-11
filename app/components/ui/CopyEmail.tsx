import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { contactCta } from "~/content/pages";
import { site } from "~/content/site";
import { cn } from "~/lib/cn";

/** The email address as a mailto link, plus a copy-to-clipboard button. */
export function CopyEmail({ className, large = false }: { className?: string; large?: boolean }) {
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
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-3", className)}>
      <a
        href={`mailto:${site.email}`}
        className={cn(
          "break-all underline decoration-line-strong decoration-2 underline-offset-[0.2em] transition-colors duration-300 hover:text-accent hover:decoration-accent",
          large ? "text-[clamp(1.375rem,1rem+2vw,2.5rem)] font-bold tracking-[-0.03em]" : "text-lg font-semibold",
        )}
      >
        {site.email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-semibold transition-colors duration-300 hover:border-fg"
      >
        {copied ? (
          <Check className="size-3.5" aria-hidden />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
        <span>{copied ? contactCta.copied : contactCta.copy}</span>
      </button>
      <span role="status" className="sr-only">
        {copied ? contactCta.copied : ""}
      </span>
    </div>
  );
}
