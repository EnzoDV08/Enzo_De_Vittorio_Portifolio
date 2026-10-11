import { cn } from "~/lib/cn";
import type { Picture } from "~/lib/images";
import { ResponsiveImage } from "./ResponsiveImage";

type Props = {
  picture: Picture | undefined;
  /** Usually "": the organisation is named in the text beside the tile. */
  alt?: string;
  className?: string;
};

/** An organisation logo on a white tile, so logos with white backgrounds sit cleanly anywhere. */
export function LogoTile({ picture, alt = "", className }: Props) {
  if (!picture) return null;
  return (
    <span
      className={cn(
        "relative block size-12 shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-night/10",
        className,
      )}
    >
      <ResponsiveImage picture={picture} alt={alt} fill sizes="64px" className="object-contain! p-1.5" />
    </span>
  );
}
