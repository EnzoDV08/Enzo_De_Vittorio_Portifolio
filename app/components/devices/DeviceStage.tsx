import { ArrowDown } from "lucide-react";
import { lazy, useRef } from "react";
import { Island } from "~/components/motion/Island";
import { cn } from "~/lib/cn";
import type { Devices } from "~/lib/devices";
import { useMotionAllowed } from "~/lib/motion";
import { DeviceImage } from "./DeviceStill";

const DeviceStageFx = lazy(() => import("~/components/motion/fx/DeviceStageFx"));

type Props = {
  devices: Devices;
  label: string;
  /** Short captions under the devices, e.g. "Desktop" / "Mobile". */
  captions: { laptop: string; phone: string };
  /** "Scroll to open", shown only when the motion will actually play. */
  hint?: string;
  className?: string;
};

/**
 * The case-study device moment. With motion, the section is tall and its stage sticks to the
 * screen while you scroll: the laptop opens on the project's site, then the phone slides in
 * and turns round to show the mobile view (DeviceStageFx). Without motion, reduced motion,
 * no JS, before hydration, both devices simply sit there at rest.
 */
export function DeviceStage({ devices, label, captions, hint, className }: Props) {
  const section = useRef<HTMLElement>(null);
  const laptopBox = useRef<HTMLDivElement>(null);
  const phoneBox = useRef<HTMLDivElement>(null);
  const laptopCanvas = useRef<HTMLCanvasElement>(null);
  const phoneCanvas = useRef<HTMLCanvasElement>(null);
  const motion = useMotionAllowed();
  const { laptop, phone } = devices;
  if (!laptop) return null;

  return (
    <>
      <section
        ref={section}
        aria-label={label}
        className={cn("relative", motion ? "h-[280svh]" : "py-12 md:py-20", className)}
      >
        <div className={cn(motion && "sticky top-0 flex h-svh items-center overflow-clip")}>
          {motion && hint && (
            <p className="absolute inset-x-0 top-24 flex items-center justify-center gap-2 text-sm font-semibold text-fg/70 md:top-28">
              <ArrowDown className="size-4 motion-safe:animate-bounce" aria-hidden />
              {hint}
            </p>
          )}
          <div className="container-site w-full">
            {/* Sized so laptop + phone always fit one screen height. */}
            <div className="relative mx-auto w-full max-w-[min(100%,calc((100svh-6rem)*1.25))]">
              <div ref={laptopBox} className="relative aspect-[10/9] w-[84%] will-change-transform">
                <DeviceImage
                  lastFrame
                  sequence={laptop}
                  sizes="(min-width: 1600px) 1200px, 80vw"
                  className="absolute inset-0 transition-opacity duration-300"
                />
                {motion && (
                  <canvas
                    ref={laptopCanvas}
                    aria-hidden="true"
                    className="absolute inset-0 size-full"
                  />
                )}
                <p className="absolute bottom-[14%] left-[8%] meta text-muted">{captions.laptop}</p>
              </div>
              {phone && (
                <div
                  ref={phoneBox}
                  className="absolute right-0 bottom-[2%] aspect-[3/4] w-[30%] will-change-transform"
                >
                  <DeviceImage
                    lastFrame
                    sequence={phone}
                    sizes="(min-width: 1024px) 26vw, 30vw"
                    className="absolute inset-0 transition-opacity duration-300"
                  />
                  {motion && (
                    <canvas
                      ref={phoneCanvas}
                      aria-hidden="true"
                      className="absolute inset-0 size-full"
                    />
                  )}
                  <p className="absolute right-[14%] bottom-0 meta text-muted">{captions.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* After the element, not inside it: React attaches a parent's ref only after its
        children's effects run, so an island inside would find the ref still empty. */}
      {motion && (
        <Island>
          <DeviceStageFx
            devices={devices}
            section={section}
            laptopBox={laptopBox}
            phoneBox={phoneBox}
            laptopCanvas={laptopCanvas}
            phoneCanvas={phoneCanvas}
          />
        </Island>
      )}
    </>
  );
}
