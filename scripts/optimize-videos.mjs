// Encode full-size project recordings into small, web-ready loops for the home page's work
// carousel. Masters stay out of git; only the encodes are committed.
//
//   _originals/videos/<project-slug>.<ext>  →  app/assets/videos/<slug>/
//       preview.av1.webm   AV1 1600×1000: what most browsers play, smallest at the same quality
//       preview.h264.mp4   H.264 1280×800: the fallback without AV1 (mostly iPhones, whose
//                          carousel screens are smaller anyway)
//       poster.webp        the loop's first frame, shown until it plays (and with Save-Data)
//
// Cover-cropped and top-anchored like the carousel's screens; the AV1 size matches them exactly,
// so its frames go straight to the GPU. Silent, 30 fps, metadata stripped, fast-start.
// Each loop is LOOP_SECONDS long (a carousel screen, not a film), starting at START[slug].
// A master whose name isn't a project slug is skipped.
//
// Settings were picked by A/B against the master at 1:1: AV1 CRF 36 and H.264 CRF 25 are
// indistinguishable from it at the size the carousel shows them.
//
//   npm run videos                  encode what's new or changed
//   npm run videos -- --force       redo everything
//   MAX_SECONDS=30 npm run videos   another loop length (0 = the whole recording)
//
// ffmpeg: FFMPEG_PATH, else `ffmpeg` on PATH, else the `ffmpeg-static` package if installed.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";

const SRC = "_originals/videos";
const OUT = "app/assets/videos";
const WIDTH = 1600;
const HEIGHT = 1000;
/** The fallback is smaller: it only plays where AV1 can't, mostly on phones. */
const H264_WIDTH = 1280;
const H264_HEIGHT = 800;
const FPS = 30;
const LOOP_SECONDS = 20;
/** Where each loop starts, in seconds, to skip a recording's intro (e.g. a loading screen). */
const START = {
  "forge-your-future": 1.5,
  "honeybee-heroes": 0.4,
  "leke-lente-lingo": 3.2,
  "mpg-foundation": 1.2,
  "one-river-two-memories": 0.8,
  "stack-studio": 0.4,
};
/**
 * Videos that aren't a project's carousel loop, with their own shape: the full length
 * (seconds 0) at 16:9, centred, e.g. the home page's Stack Studio promo.
 */
const EXTRAS = {
  "stack-studio-promo": { seconds: 0, width: 1600, height: 900, h264Width: 1280, h264Height: 720 },
};
/** Warn when one encode passes this, so the repo and the page stay light. */
const BUDGET_MB = 8;
const force = process.argv.includes("--force");
const maxSeconds = process.env.MAX_SECONDS === undefined ? LOOP_SECONDS : Number(process.env.MAX_SECONDS) || 0;
const exts = new Set([".mp4", ".mov", ".m4v", ".mkv", ".webm"]);

async function findFfmpeg() {
  const candidates = [process.env.FFMPEG_PATH, "ffmpeg"];
  try {
    candidates.push((await import("ffmpeg-static")).default);
  } catch {
    // not installed, fine
  }
  for (const bin of candidates.filter(Boolean)) {
    if (spawnSync(bin, ["-hide_banner", "-version"], { stdio: "ignore" }).status === 0) return bin;
  }
  return null;
}

const ffmpeg = await findFfmpeg();
if (!ffmpeg) {
  console.error(
    "videos: ffmpeg not found. Install it (e.g. `winget install Gyan.FFmpeg`, or\n" +
      "`npm i -D ffmpeg-static`), or point FFMPEG_PATH at the binary, then run again.",
  );
  process.exit(1);
}
if (!existsSync(SRC)) {
  console.error(`videos: no ${SRC}/ folder. Put the recordings there as <project-slug>.mp4.`);
  process.exit(1);
}

const encoders = spawnSync(ffmpeg, ["-hide_banner", "-encoders"], { encoding: "utf8" }).stdout ?? "";
const av1 = encoders.includes("libsvtav1") ? "svt" : encoders.includes("libaom-av1") ? "aom" : null;
const webp = encoders.includes("libwebp");
if (!av1) console.warn("videos: this ffmpeg has no AV1 encoder, writing H.264 only.");

// Only projects that exist (the slugs in app/content/projects.ts), plus the EXTRAS.
const slugs = new Set([
  ...[...readFileSync("app/content/projects.ts", "utf8").matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]),
  ...Object.keys(EXTRAS),
]);

// Scale to cover the size, crop centred horizontally and from the top (page headers stay in),
// or from the middle for EXTRAS (a promo has no page header to keep).
const frameAt = (w, h, centre = false) =>
  [
    `scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos`,
    `crop=${w}:${h}:(iw-${w})/2:${centre ? `(ih-${h})/2` : 0}`,
    `fps=${FPS}`,
    "format=yuv420p",
  ].join(",");
const frame = frameAt(WIDTH, HEIGHT);

const startOf = (slug) => ["-ss", String(START[slug] ?? 0)];
/** Seconds to keep (0 = all of it). */
const lengthOf = (slug) => (EXTRAS[slug] ? EXTRAS[slug].seconds : maxSeconds);
const common = (input, slug, vf = frame) => [
  "-hide_banner",
  "-loglevel",
  "error",
  "-y",
  ...startOf(slug),
  "-i",
  input,
  ...(lengthOf(slug) ? ["-t", String(lengthOf(slug))] : []),
  "-vf",
  vf,
  "-an",
  "-map_metadata",
  "-1",
];

// Quality first: these settings keep UI text crisp at the size the carousel shows it.
const av1Args =
  av1 === "svt"
    ? ["-c:v", "libsvtav1", "-preset", "5", "-crf", "36", "-g", "240", "-svtav1-params", "tune=0"]
    : ["-c:v", "libaom-av1", "-crf", "36", "-b:v", "0", "-cpu-used", "6", "-row-mt", "1", "-tiles", "2x2", "-g", "240"];
const h264Args = [
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-tune",
  "animation",
  "-crf",
  "25",
  "-profile:v",
  "high",
  "-level",
  "4.0",
  "-g",
  "120",
  "-movflags",
  "+faststart",
];

const mb = (file) => statSync(file).size / 1024 / 1024;
const fresh = (out, src) => !force && existsSync(out) && statSync(out).mtimeMs > statSync(src).mtimeMs;

function run(args, out) {
  const result = spawnSync(ffmpeg, args, { stdio: ["ignore", "inherit", "inherit"] });
  if (result.status !== 0) throw new Error(`ffmpeg failed writing ${out}`);
  const size = mb(out);
  const flag = size > BUDGET_MB ? `  (over ${BUDGET_MB} MB, consider MAX_SECONDS)` : "";
  console.log(`  ${out}  ${size.toFixed(2)} MB${flag}`);
}

let written = 0;
let skipped = 0;
let total = 0;
for (const file of readdirSync(SRC)) {
  if (!exts.has(extname(file).toLowerCase())) continue;
  const slug = basename(file, extname(file)).toLowerCase();
  const src = join(SRC, file);
  if (!slugs.has(slug)) {
    console.warn(`videos: skipping ${file}, no project with slug "${slug}"`);
    continue;
  }
  const dir = join(OUT, slug);
  mkdirSync(dir, { recursive: true });
  console.log(`${slug}  (master ${mb(src).toFixed(0)} MB)`);
  const extra = EXTRAS[slug];
  const main = extra ? frameAt(extra.width, extra.height, true) : frame;
  const small = extra
    ? frameAt(extra.h264Width, extra.h264Height, true)
    : frameAt(H264_WIDTH, H264_HEIGHT);
  const jobs = [
    av1 && {
      out: join(dir, "preview.av1.webm"),
      args: (out) => [...common(src, slug, main), ...av1Args, out],
    },
    {
      out: join(dir, "preview.h264.mp4"),
      args: (out) => [...common(src, slug, small), ...h264Args, out],
    },
    {
      out: join(dir, webp ? "poster.webp" : "poster.jpg"),
      args: (out) => [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        ...startOf(slug),
        "-i",
        src,
        "-frames:v",
        "1",
        "-vf",
        main,
        ...(webp ? ["-c:v", "libwebp", "-quality", "82"] : ["-q:v", "3"]),
        out,
      ],
    },
  ].filter(Boolean);
  for (const job of jobs) {
    if (fresh(job.out, src)) {
      skipped++;
    } else {
      run(job.args(job.out), job.out);
      written++;
    }
    total += mb(job.out);
  }
}
console.log(`videos: ${written} written, ${skipped} up to date, ${total.toFixed(1)} MB in ${OUT}/`);
