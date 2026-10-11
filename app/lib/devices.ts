/**
 * Pre-rendered 3D device sequences (scripts/devices/render.mjs → public/devices/<slug>/<kind>).
 * Each is a run of transparent WebP frames: the laptop opens on the project's site, the phone
 * turns round to show its mobile view. The last frame doubles as the still.
 *
 * Keep `deviceSpecs` in sync with `devices` in scripts/devices/render.mjs.
 */
export const deviceSpecs = {
  laptop: {
    frames: 48,
    widths: [960, 1600],
    aspect: 10 / 9,
    /** A separate, tightly framed render of the open laptop (still-<width>.webp). */
    still: { widths: [800, 1280, 1920], aspect: 7 / 5 },
  },
  phone: { frames: 48, widths: [440, 760], aspect: 3 / 4, still: undefined },
} as const;

export type DeviceKind = keyof typeof deviceSpecs;

export type DeviceSequence = {
  kind: DeviceKind;
  frames: number;
  widths: readonly number[];
  /** Intrinsic size of the largest rendition (for width/height attributes). */
  width: number;
  height: number;
  /** e.g. "/devices/honeybee-heroes/laptop/" */
  base: string;
  alt: string;
  /** Tightly framed still, when the device has one; otherwise the last frame is the still. */
  still?: { widths: readonly number[]; width: number; height: number };
};

export type Devices = { laptop?: DeviceSequence; phone?: DeviceSequence };

const pad = (n: number) => String(n).padStart(2, "0");

export const frameSrc = (seq: DeviceSequence, frame: number, width: number) =>
  `${seq.base}frame-${pad(frame)}-${width}.webp`;

/** srcset of the last frame, framed like the sequence, so it can sit under the canvas. */
export const lastFrameSrcSet = (seq: DeviceSequence) =>
  seq.widths.map((w) => `${frameSrc(seq, seq.frames - 1, w)} ${w}w`).join(", ");

export const lastFrameSrc = (seq: DeviceSequence) =>
  frameSrc(seq, seq.frames - 1, seq.widths[seq.widths.length - 1] ?? 0);

/** srcset of the device at rest: the tight still if there is one, else the last frame. */
export const stillSrcSet = (seq: DeviceSequence) =>
  seq.still
    ? seq.still.widths.map((w) => `${seq.base}still-${w}.webp ${w}w`).join(", ")
    : lastFrameSrcSet(seq);

export const stillSrc = (seq: DeviceSequence) =>
  seq.still
    ? `${seq.base}still-${seq.still.widths[seq.still.widths.length - 1] ?? 0}.webp`
    : lastFrameSrc(seq);

export const stillSize = (seq: DeviceSequence) =>
  seq.still ? { width: seq.still.width, height: seq.still.height } : { width: seq.width, height: seq.height };

/** The smallest rendition at least as wide as the slot needs (never stretched), else the largest. */
export function pickWidth(seq: DeviceSequence, slotWidth: number, dpr: number) {
  const needed = slotWidth * Math.min(dpr || 1, 2);
  return seq.widths.find((w) => w >= needed) ?? seq.widths[seq.widths.length - 1] ?? 0;
}
