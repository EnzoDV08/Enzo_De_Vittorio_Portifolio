import { Mail } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { TransitionLink } from "~/components/motion/TransitionLink";
import { ResponsiveImage } from "~/components/ui/ResponsiveImage";
import { home } from "~/content/pages";
import { site } from "~/content/site";
import { cn } from "~/lib/cn";
import type { Picture } from "~/lib/images";
import { useMotionAllowed } from "~/lib/motion";
import type { ProjectVideo } from "~/lib/videos";

const copy = home.intro;

export type IntroData = {
  projects: number;
  tools: number;
  portrait: { src: string; alt: string; picture: Picture | undefined };
  /** The transparent cut-out (the hero's), for the About me card. */
  cutout: Picture | undefined;
  pictures: Record<string, Picture | undefined>;
  video: ProjectVideo | undefined;
};

/** The black-and-white cut-out of Enzo, sized so the head rises above the circle's top. */
function PortraitCutout({ picture }: { picture: Picture | undefined }) {
  if (!picture) return null;
  return (
    <ResponsiveImage
      picture={picture}
      alt=""
      // Shown at 171% of the circle (see the class), so ask for that size.
      sizes="(min-width: 1024px) 34rem, 130vw"
      className="absolute top-[-64%] left-[43%] w-[171%]! max-w-none -translate-x-1/2 grayscale contrast-110 transition-transform duration-700 ease-out-3 group-hover:scale-[1.03]"
    />
  );
}

/** The small corner bracket each card carries (top right), like a crop mark. */
function Corner() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-4 right-4 size-3 border-t-2 border-r-2 border-current opacity-50 md:top-5 md:right-5"
    />
  );
}

/** A bento card: the whole card is a link to /about, with a small lift on hover. */
function Card({
  className,
  children,
  label,
}: {
  className?: string;
  children: React.ReactNode;
  /** Appended for screen readers, so every link says where it goes. */
  label?: string;
}) {
  return (
    <TransitionLink
      to="/about"
      className={cn(
        "group relative block overflow-clip rounded-xl transition-transform duration-500 ease-out-3 hover:-translate-y-1",
        className,
      )}
    >
      {children}
      <span className="sr-only">
        {label ? `${label}. ` : ""}
        {copy.cta}
      </span>
    </TransitionLink>
  );
}

/**
 * The promo, muted and looping. Nothing downloads until it nears the screen; it plays only while
 * on screen. AV1 where it decodes efficiently, H.264 otherwise (same rule as the work carousel).
 * With reduced motion it is its first frame.
 */
function PromoVideo({ video }: { video: ProjectVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  const motion = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !motion) return;
    let chosen = false;
    const choose = async () => {
      if (chosen) return;
      chosen = true;
      let av1 = false;
      if (video.av1 && navigator.mediaCapabilities?.decodingInfo) {
        try {
          const info = await navigator.mediaCapabilities.decodingInfo({
            type: "file",
            video: {
              contentType: 'video/webm; codecs="av01.0.08M.08"',
              width: 1600,
              height: 900,
              bitrate: 1_500_000,
              framerate: 30,
            },
          });
          av1 = info.supported && info.powerEfficient;
        } catch {
          av1 = false;
        }
      }
      const src = av1 ? video.av1 : (video.h264 ?? video.av1);
      if (src) el.src = src;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void choose().then(() => el.play().catch(() => {}));
        } else if (!el.paused) {
          el.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.pause();
    };
  }, [motion, video]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={video.poster}
      aria-hidden="true"
      className="absolute inset-0 size-full object-cover"
    />
  );
}

/**
 * A quick about-me under How I work, as a bento: Enzo's card on the left (portrait, name,
 * email, a spinning badge), then the heading, the Stack Studio promo, live counts and two
 * recognitions. Every card leads to /about.
 */
export function IntroBento({ data }: { data: IntroData }) {
  const headingId = useId();
  const award = data.pictures[copy.awardLogo];
  const mark = data.pictures[copy.studioLogo];

  return (
    <section aria-labelledby={headingId} className="pt-section">
      <div className="grid grid-cols-2 gap-3 container-site md:gap-4 lg:grid-cols-12">
        {/* Enzo: a folder card. The "About me" label sits on the page in a notch cut from
          the top-left; the card's top edge steps up on a diagonal to its right. */}
        <TransitionLink
          to="/about"
          className="group relative col-span-2 block min-h-[36rem] text-white transition-transform duration-500 ease-out-3 hover:-translate-y-1 lg:col-span-4 lg:row-span-3 lg:mt-[calc(2.5rem+0.15*clamp(3.5rem,1.5rem+8vw,10rem))]"
        >
          {/* The shape: a body under the notch, plus a raised top-right "ear" with a slanted
            left edge. Two plain rounded boxes, so the corners stay round at any size. */}
          <span aria-hidden="true" className="absolute inset-x-0 top-12 bottom-0 rounded-xl bg-cobalt" />
          <span
            aria-hidden="true"
            className="absolute top-0 right-0 left-[9.5rem] h-24 rounded-tr-xl bg-cobalt [clip-path:polygon(2.75rem_0,100%_0,100%_100%,0_100%)]"
          />
          <span className="absolute top-0 left-1 flex h-12 items-center gap-2.5 text-base font-semibold text-fg">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 text-cobalt">
              <path
                fill="currentColor"
                d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"
              />
            </svg>
            {copy.tab}
          </span>

          <span className="relative flex h-full flex-col px-7 pt-24 pb-8 md:px-9">
            {/* Portrait: the cut-out breaks out of the top of its circle. The lower copy is
              clipped to the circle; the upper copy shows only the head, above the middle. */}
            <span aria-hidden="true" className="relative mx-auto block aspect-square w-[min(78%,19rem)]">
              <span className="absolute inset-0 rounded-full border-[3px] border-white" />
              <span className="absolute inset-[7%] overflow-clip rounded-full bg-[#c5c9ff]">
                <PortraitCutout picture={data.cutout} />
              </span>
              <span className="absolute inset-[7%] [clip-path:inset(-60%_22%_50%_22%)]">
                <PortraitCutout picture={data.cutout} />
              </span>
            </span>

            <span className="mt-auto block pt-8 display text-[clamp(2.75rem,2rem+2.6vw,4.75rem)] leading-[0.95]">
              <span className="font-light">{copy.greeting},</span>
              <br />
              {site.name}
            </span>
            <span className="mt-6 flex items-center gap-2 border-b border-dashed border-white/60 pr-28 pb-3 text-sm text-white/90">
              {site.email}
              <Mail aria-hidden="true" className="size-4 shrink-0" />
            </span>
            <span className="sr-only">{copy.cta}</span>
          </span>

          {/* Spinning badge, with a thin outer ring, over the line's right end. */}
          <span aria-hidden="true" className="absolute right-5 bottom-5 rounded-full border border-white/50 p-1.5">
            <svg viewBox="0 0 120 120" className="block size-24 rounded-full bg-night text-white md:size-28">
              <defs>
                <path id={`${headingId}-ring`} d="M60 60 m-42 0 a42 42 0 1 1 84 0 a42 42 0 1 1 -84 0" />
              </defs>
              <g className="origin-center motion-safe:animate-spin-slow">
                <text className="fill-current text-[9.4px] font-semibold tracking-[0.14em] uppercase">
                  <textPath href={`#${headingId}-ring`}>{copy.badge}</textPath>
                </text>
              </g>
              <circle cx="60" cy="60" r="10" className="fill-white" />
            </svg>
          </span>
        </TransitionLink>

        {/* The heading, with a crop-mark corner like the reference's wordmark. */}
        <div className="relative col-span-2 flex items-end pt-6 lg:col-span-8 lg:pt-10">
          <h2
            id={headingId}
            className="relative pr-[0.3em] display text-[clamp(3.5rem,1.5rem+8vw,10rem)] leading-[0.85] tracking-[-0.05em]"
          >
            {copy.heading}
            <span
              aria-hidden="true"
              className="absolute top-[0.06em] right-0 size-[0.18em] border-t-[0.05em] border-r-[0.05em] border-current"
            />
          </h2>
        </div>

        {/* The Stack Studio promo. */}
        <Card
          label={copy.videoLabel}
          className="col-span-2 aspect-video bg-night lg:col-span-5 lg:aspect-auto lg:min-h-[17rem]"
        >
          {data.video ? (
            <PromoVideo video={data.video} />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-sm text-white/60">
              {copy.videoLabel}
            </span>
          )}
          <span className="absolute bottom-4 left-4 rounded-full glass px-3 py-1.5 meta text-white on-night">
            {copy.videoLabel}
          </span>
        </Card>

        {/* Live counts. */}
        <div className="col-span-2 grid grid-cols-2 gap-3 md:gap-4 lg:col-span-3 lg:grid-cols-1">
          <Card label={`${data.projects} ${copy.projects}`} className="bg-bg-2 p-6 text-fg md:p-7">
            <Corner />
            <p className="display text-[clamp(2.5rem,2rem+1.6vw,3.5rem)] leading-none tabular-nums">
              {data.projects}
            </p>
            <p className="mt-2 text-base font-semibold">{copy.projects}</p>
          </Card>
          <Card label={`${data.tools} ${copy.tools}`} className="bg-cobalt-deep p-6 text-white md:p-7">
            <Corner />
            <p className="display text-[clamp(2.5rem,2rem+1.6vw,3.5rem)] leading-none tabular-nums">
              {data.tools}
            </p>
            <p className="mt-2 text-base font-semibold">{copy.tools}</p>
          </Card>
        </div>

        {/* Recognition. */}
        <Card
          label={`${copy.award}, ${copy.awardDetail}`}
          className="col-span-2 flex min-h-[11rem] flex-col items-center justify-center gap-4 bg-night p-6 text-center text-white sm:col-span-1 lg:col-span-3"
        >
          <Corner />
          {award && (
            <span className="relative size-14 overflow-clip rounded-lg bg-white">
              <ResponsiveImage picture={award} alt="" fill sizes="56px" className="object-contain p-1.5" />
            </span>
          )}
          <span>
            <span className="block font-semibold">{copy.award}</span>
            <span className="mt-1 block text-sm text-white/65">{copy.awardDetail}</span>
          </span>
        </Card>

        {/* The studio: the mark on black, the words on lime. */}
        <Card
          label={`${copy.studio} ${copy.studioDetail}`}
          className="col-span-2 grid min-h-[11rem] grid-cols-2 sm:col-span-1 lg:col-span-5"
        >
          <span className="grid place-items-center bg-[#111216] p-6">
            {mark && (
              <span className="relative size-20 md:size-24">
                <ResponsiveImage
                  picture={mark}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-contain transition-transform duration-700 ease-out-3 group-hover:rotate-[-8deg]"
                />
              </span>
            )}
          </span>
          <span className="relative flex flex-col justify-end bg-lime p-6 text-night">
            <Corner />
            <span className="display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-none">
              {copy.studio}
            </span>
            <span className="mt-1 font-semibold">{copy.studioDetail}</span>
          </span>
        </Card>
      </div>
    </section>
  );
}
