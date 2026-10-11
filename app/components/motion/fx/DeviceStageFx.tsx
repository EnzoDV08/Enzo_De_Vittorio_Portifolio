import type { Devices } from "~/lib/devices";
import { gsap, useGSAP } from "~/lib/gsap";
import { createSequencePlayer } from "./sequence";

type Ref<T> = React.RefObject<T | null>;
type Props = {
  devices: Devices;
  section: Ref<HTMLElement>;
  laptopBox: Ref<HTMLDivElement>;
  phoneBox: Ref<HTMLDivElement>;
  laptopCanvas: Ref<HTMLCanvasElement>;
  phoneCanvas: Ref<HTMLCanvasElement>;
};

/** Hides the still under a canvas once the canvas has a frame on it. */
const hideStill = (canvas: HTMLCanvasElement | null) => () => {
  const still = canvas?.previousElementSibling;
  if (still instanceof HTMLElement) still.style.opacity = "0";
};

/**
 * Animation island for <DeviceStage>. One scrubbed timeline across the tall section:
 *  0.00–0.62  the laptop opens on the site and grows into place
 *  0.30–0.92  the phone slides in from the right and turns to face you
 *  0.92–1.00  both hold, so the end state can be read before the page moves on
 */
export default function DeviceStageFx({
  devices,
  section,
  laptopBox,
  phoneBox,
  laptopCanvas,
  phoneCanvas,
}: Props) {
  useGSAP(() => {
    const root = section.current;
    if (!root || !devices.laptop || !laptopCanvas.current) return;
    const laptop = createSequencePlayer(
      laptopCanvas.current,
      devices.laptop,
      hideStill(laptopCanvas.current),
    );
    const phone =
      devices.phone && phoneCanvas.current
        ? createSequencePlayer(phoneCanvas.current, devices.phone, hideStill(phoneCanvas.current))
        : null;
    if (!laptop) return;

    const state = { laptop: 0, phone: 0 };
    laptop.draw(0);
    phone?.draw(0);

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6 },
    });
    tl.to(
      state,
      {
        laptop: laptop.count - 1,
        duration: 0.62,
        ease: "power2.inOut",
        onUpdate: () => laptop.draw(state.laptop),
      },
      0,
    ).fromTo(
      laptopBox.current,
      { scale: 0.86, yPercent: 6 },
      { scale: 1, yPercent: 0, duration: 0.62, ease: "power2.out" },
      0,
    );
    if (phone && phoneBox.current) {
      tl.fromTo(
        phoneBox.current,
        { xPercent: 80, yPercent: 10, autoAlpha: 0 },
        { xPercent: 0, yPercent: 0, autoAlpha: 1, duration: 0.3, ease: "power3.out" },
        0.3,
      ).to(
        state,
        {
          phone: phone.count - 1,
          duration: 0.62,
          ease: "power2.inOut",
          onUpdate: () => phone.draw(state.phone),
        },
        0.3,
      );
    }
    tl.to({}, { duration: 0.08 });

    return () => {
      laptop.dispose();
      phone?.dispose();
    };
  });
  return null;
}
