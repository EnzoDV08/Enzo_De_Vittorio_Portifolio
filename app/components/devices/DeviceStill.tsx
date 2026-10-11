import { cn } from "~/lib/cn";
import {
  lastFrameSrc,
  lastFrameSrcSet,
  stillSize,
  stillSrc,
  stillSrcSet,
  type DeviceSequence,
  type Devices,
} from "~/lib/devices";

type ImgProps = {
  sequence: DeviceSequence;
  sizes: string;
  priority?: boolean;
  decorative?: boolean;
  /** The sequence's last frame (framed like the canvas over it) instead of the tight still. */
  lastFrame?: boolean;
  className?: string;
};

/** One device at rest. */
export function DeviceImage({
  sequence,
  sizes,
  priority,
  decorative,
  lastFrame,
  className,
}: ImgProps) {
  const size = lastFrame ? { width: sequence.width, height: sequence.height } : stillSize(sequence);
  return (
    <img
      src={lastFrame ? lastFrameSrc(sequence) : stillSrc(sequence)}
      srcSet={lastFrame ? lastFrameSrcSet(sequence) : stillSrcSet(sequence)}
      sizes={sizes}
      width={size.width}
      height={size.height}
      alt={decorative ? "" : sequence.alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
      className={cn("size-full object-contain select-none", className)}
    />
  );
}

type Props = {
  devices: Devices;
  /** sizes for the laptop; the phone is a quarter of it. */
  sizes: string;
  phoneSizes?: string;
  priority?: boolean;
  decorative?: boolean;
  /** Leave the phone out (e.g. very small cards). */
  laptopOnly?: boolean;
  className?: string;
};

/**
 * The laptop with the phone leaning in front of its right corner — the project at rest, as
 * a product shot. Fills its parent's width at the laptop's aspect ratio.
 */
export function DeviceStill({
  devices,
  sizes,
  phoneSizes = "(min-width: 1024px) 14vw, 28vw",
  priority,
  decorative,
  laptopOnly,
  className,
}: Props) {
  const { laptop, phone } = devices;
  if (!laptop) return null;
  return (
    <div className={cn("relative aspect-[7/5] w-full", className)}>
      <DeviceImage
        sequence={laptop}
        sizes={sizes}
        priority={priority}
        decorative={decorative}
        className="absolute inset-0 device-shadow"
      />
      {phone && !laptopOnly && (
        <div className="absolute right-[-4%] bottom-[-12%] aspect-[3/4] w-[30%]">
          <DeviceImage
            sequence={phone}
            sizes={phoneSizes}
            priority={priority}
            decorative={decorative}
            className="device-shadow"
          />
        </div>
      )}
    </div>
  );
}
