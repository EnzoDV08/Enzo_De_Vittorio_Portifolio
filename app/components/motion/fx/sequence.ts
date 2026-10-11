import { frameSrc, pickWidth, type DeviceSequence } from "~/lib/devices";

export type SequencePlayer = {
  /** Draw a (fractional) frame position; cross-fades between neighbouring frames. */
  draw: (position: number) => void;
  /** Stop downloads still in flight. */
  dispose: () => void;
  count: number;
};

/**
 * Plays a pre-rendered device sequence on a canvas (adapted from Stack Studio's ImageSequence).
 * Frames load coarse to fine — every 8th first, so a rough motion is ready almost at once —
 * and each draw cross-fades the two frames either side of the position, so it glides rather
 * than steps. `onFirstDraw` fires once, when there's something on the canvas to show.
 */
export function createSequencePlayer(
  canvas: HTMLCanvasElement,
  sequence: DeviceSequence,
  onFirstDraw: () => void,
): SequencePlayer | null {
  const context = canvas.getContext("2d");
  if (!context) return null;
  const width = pickWidth(sequence, canvas.clientWidth, window.devicePixelRatio);
  const count = sequence.frames;
  canvas.width = width;
  canvas.height = Math.round((width * sequence.height) / sequence.width);

  const loaded = new Array<boolean>(count).fill(false);
  const images: HTMLImageElement[] = [];
  let wanted = 0;
  let shown = -1;
  let revealed = false;
  let alive = true;

  const nearest = (index: number) => {
    for (let i = index; i >= 0; i--) if (loaded[i]) return i;
    for (let i = index + 1; i < count; i++) if (loaded[i]) return i;
    return -1;
  };

  const draw = (position: number) => {
    wanted = Math.min(Math.max(position, 0), count - 1);
    if (Math.abs(wanted - shown) < 0.02) return;
    const before = Math.floor(wanted);
    const after = Math.min(before + 1, count - 1);
    const mix = wanted - before;
    const a = images[before];
    const b = images[after];
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (a && b && loaded[before] && loaded[after] && mix > 0.01) {
      // Additive drawing of the two weighted frames is an exact blend, transparent edges included.
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 1 - mix;
      context.drawImage(a, 0, 0, canvas.width, canvas.height);
      context.globalAlpha = mix;
      context.drawImage(b, 0, 0, canvas.width, canvas.height);
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
    } else {
      const image = images[nearest(Math.round(wanted))];
      if (!image) return;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    shown = wanted;
    if (!revealed) {
      revealed = true;
      onFirstDraw();
    }
  };

  const order: number[] = [];
  for (const step of [8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) if (!order.includes(i)) order.push(i);
  }
  if (!order.includes(count - 1)) order.splice(1, 0, count - 1);
  for (const index of order) {
    const image = new window.Image();
    image.decoding = "async";
    image.src = frameSrc(sequence, index, width);
    images[index] = image;
    image
      .decode()
      .then(() => {
        if (!alive) return;
        loaded[index] = true;
        shown = -1;
        draw(wanted);
      })
      .catch(() => undefined);
  }

  return {
    draw,
    count,
    dispose: () => {
      alive = false;
      // Stops frames still downloading (an empty src would request the page itself).
      for (const image of images) image.removeAttribute("src");
    },
  };
}
