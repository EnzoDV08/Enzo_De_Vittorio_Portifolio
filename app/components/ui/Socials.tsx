import { isTodo } from "~/content/todo";
import { site, socialLabels, type SocialKey } from "~/content/site";
import { cn } from "~/lib/cn";
import { GitHubIcon, InstagramIcon, LinkedInIcon } from "./icons";

const icons: Record<SocialKey, typeof GitHubIcon> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
};

/** Social links that exist. A TODO profile is left out rather than linked to nowhere. */
export function Socials({
  className,
  withLabels = false,
}: {
  className?: string;
  withLabels?: boolean;
}) {
  const entries = (Object.entries(site.socials) as [SocialKey, string][]).filter(
    ([, url]) => !isTodo(url),
  );
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {entries.map(([key, url]) => {
        const Icon = icons[key];
        return (
          <li key={key}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer me"
              className={cn(
                "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-line-strong text-sm font-semibold transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-bg",
                withLabels && "px-4",
              )}
            >
              <Icon size={18} />
              <span className={withLabels ? undefined : "sr-only"}>{socialLabels[key]}</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
