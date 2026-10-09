import { getPicture } from "~/lib/images";
import { cn } from "~/lib/cn";
import { ProjectPlaceholder } from "./ProjectPlaceholder";

type Props = {
  /** Path relative to app/assets, e.g. "projects/sportify/cover.jpg". */
  src: string | undefined;
  /** Meaningful description, or "" when decorative. */
  alt: string;
  sizes?: string;
  /** Above-the-fold hero/cover: eager + fetchpriority=high. Use once per page. */
  priority?: boolean;
  /** Fill the parent (parent must be positioned and sized) instead of flowing at intrinsic ratio. */
  fill?: boolean;
  className?: string;
  /** Rendered when the image file doesn't exist yet. Never a broken image. */
  placeholder?: { title: string; accent?: string; ratio?: string };
};

/** <picture> with AVIF + WebP srcsets, intrinsic width/height (no CLS) and lazy loading. */
export function ResponsiveImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  fill = false,
  className,
  placeholder,
}: Props) {
  const picture = getPicture(src);

  if (!picture) {
    if (!placeholder) return null;
    return (
      <ProjectPlaceholder
        title={placeholder.title}
        accent={placeholder.accent}
        ratio={placeholder.ratio}
        fill={fill}
        className={className}
      />
    );
  }

  return (
    <picture className={cn(fill ? "absolute inset-0 block" : "contents")}>
      {Object.entries(picture.sources).map(([format, srcSet]) => (
        <source key={format} type={`image/${format}`} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        src={picture.img.src}
        width={picture.img.w}
        height={picture.img.h}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn(fill ? "size-full object-cover" : "h-auto w-full", className)}
      />
    </picture>
  );
}
