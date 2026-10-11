/**
 * Renders each case study's devices from the captures in _originals/devices (capture.mjs):
 *
 *   public/devices/<slug>/laptop/frame-<nn>-<width>.webp   MacBook Pro opening on the site
 *   public/devices/<slug>/laptop/still-<width>.webp        …and open at rest, framed tightly
 *   public/devices/<slug>/phone/frame-<nn>-<width>.webp    iPhone turning to show the mobile site
 *
 * Transparent WebP frames, played back by scroll (components/media/DeviceSequence). The site
 * never loads a 3D library: three.js runs only here, in headless Chromium, from a pinned CDN
 * build. The scenes (laptop-scene.js, phone-scene.js) are adapted from Stack Studio's renderer;
 * the models live in _originals/models (local only — see REDESIGN_NOTES.md for the licence note).
 *
 *   node scripts/devices/render.mjs                        # every project, both devices
 *   node scripts/devices/render.mjs honeybee-heroes        # one project
 *   node scripts/devices/render.mjs "" laptop              # every project, one device
 *   node scripts/devices/render.mjs honeybee-heroes laptop 0,59   # a few frames, for a look
 *
 * The frame count, aspect and widths must match `devices` in app/lib/devices.ts.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { targets } from "./targets.mjs";

const root = join(import.meta.dirname, "../..");
const here = import.meta.dirname;
const THREE = "https://cdn.jsdelivr.net/npm/three@0.170.0";
const font = join(root, "app/styles/fonts/Satoshi-Variable.woff2");
const models = join(root, "_originals/models");
const captures = join(root, "_originals/devices");

/**
 * Angles in degrees: `turn` spins around the upright axis (0 = facing the viewer), `tilt` leans
 * the top toward the viewer, `roll` rotates in the picture plane, `lid` is how far the laptop
 * is open (0 = shut). Every key moves evenly from `from` to `to`; easing happens on playback.
 */
const devices = {
  laptop: {
    model: "macbook-pro-14.glb",
    scene: "laptop-scene.js",
    look: {
      exposure: 1,
      fov: 20,
      fill: 0.94,
      environment: 0.9,
      key: 1.6,
      rim: 1.2,
      satin: 0.42,
      supersample: 2,
      quality: 0.76,
    },
    /** Shut and seen from above, then the lid opens as it squares up to the viewer. */
    motion: {
      frames: 48,
      from: { turn: -12, tilt: 48, lid: 0 },
      to: { turn: 0, tilt: 8, lid: 102 },
      aspect: 10 / 9,
      widths: [960, 1600],
    },
    /**
     * The open laptop on its own, framed tightly (the sequence's framing has to fit the whole
     * motion, so its last frame has room to spare): still-<width>.webp, for cards and the hero.
     */
    still: { aspect: 7 / 5, widths: [800, 1280, 1920] },
  },
  phone: {
    model: "iphone-17-pro.glb",
    scene: "phone-scene.js",
    look: { exposure: 1, glass: 0.05, fov: 14, margin: 1.14, quality: 0.76 },
    /** Back to front with a small roll that settles, like it's being picked up. */
    motion: {
      frames: 48,
      from: { turn: -170, tilt: 6, roll: -9 },
      to: { turn: -12, tilt: 0, roll: 0 },
      aspect: 3 / 4,
      widths: [440, 760],
    },
  },
};

const [filter, deviceFilter, only] = process.argv.slice(2);
const selected = targets.filter((t) => !filter || t.slug === filter);
if (!selected.length) throw new Error(`No target "${filter}"`);

const lerp = (a, b, t) => a + (b - a) * t;
const pose = (motion, frame) => {
  const t = motion.frames === 1 ? 1 : frame / (motion.frames - 1);
  return Object.fromEntries(
    Object.keys(motion.to).map((key) => [key, lerp(motion.from[key] ?? 0, motion.to[key], t)]),
  );
};
const pad = (n) => String(n).padStart(2, "0");

const scenePage = (scene, config) => `<!doctype html>
<html><head><style>html,body{margin:0;background:transparent}</style>
<script type="importmap">{"imports":{"three":"${THREE}/build/three.module.js","three/addons/":"${THREE}/examples/jsm/"}}</script>
<script>window.__config = ${JSON.stringify(config)}</script>
<script type="module" src="/${scene}"></script>
</head><body></body></html>`;

/**
 * The laptop's display: a macOS menu bar and a browser toolbar above the site capture, at the
 * MacBook Pro 14" resolution (1512 × 982 pt, 2x). The notch sits in the menu bar, as it does.
 */
const laptopScreen = (label) => `<!doctype html>
<html><head><style>
@font-face { font-family: Satoshi; src: url(/font.woff2); font-weight: 300 900; }
* { box-sizing: border-box; margin: 0 }
html, body { width: 1512px; height: 982px; overflow: hidden; background: #000; font-family: Satoshi, sans-serif }
.menu { height: 34px; display: flex; align-items: center; gap: 22px; padding: 0 18px; color: #fff; font-size: 13.5px; font-weight: 500; background: #15161a }
.menu b { font-weight: 800 }
.menu .end { margin-left: auto; display: flex; gap: 18px; opacity: .9 }
.bar { height: 46px; display: flex; align-items: center; gap: 18px; padding: 0 16px; background: #26272c; border-bottom: 1px solid #000 }
.lights { display: flex; gap: 8px }
.lights i { width: 12px; height: 12px; border-radius: 50%; display: block }
.url { margin: 0 auto; width: 520px; height: 30px; border-radius: 8px; background: #3a3b41; color: #e9eaee; font-size: 13.5px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px }
.url svg { width: 11px; height: 11px; opacity: .7 }
img { display: block; width: 1512px; height: auto }
</style></head><body>
<div class="menu"><b>Safari</b><span>File</span><span>Edit</span><span>View</span><span>History</span><span>Window</span><div class="end"><span>Mon 9:41</span></div></div>
<div class="bar"><div class="lights"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></div>
<div class="url"><svg viewBox="0 0 12 14"><path fill="#fff" d="M2 6V4a4 4 0 1 1 8 0v2h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1Zm2 0h4V4a2 2 0 1 0-4 0v2Z"/></svg>${label}</div></div>
<img src="/capture.png" alt="">
</body></html>`;

const browser = await chromium.launch({
  args: ["--enable-webgl", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"],
});

/** Serves a fixed set of files on a fake origin, so the page needs no local server. */
async function serveOn(page, host, files) {
  await page.route(`http://${host}/**`, (route) => {
    const { pathname } = new URL(route.request().url());
    const file = files[pathname] ?? files["/"];
    return route.fulfill({ contentType: file[0], body: file[1] });
  });
}

async function laptopPng(target) {
  const page = await browser.newPage({
    viewport: { width: 1512, height: 982 },
    deviceScaleFactor: 2,
  });
  const label = target.url ? new URL(target.url).hostname.replace(/^www\./, "") : target.label;
  await serveOn(page, "screen.local", {
    "/": ["text/html", laptopScreen(label)],
    "/font.woff2": ["font/woff2", readFileSync(font)],
    "/capture.png": ["image/png", readFileSync(join(captures, target.slug, "desktop-0.png"))],
  });
  await page.goto("http://screen.local/", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: "png" });
  await page.close();
  return png;
}

try {
  for (const target of selected) {
    for (const [name, device] of Object.entries(devices)) {
      if (deviceFilter && deviceFilter !== name) continue;
      const { motion } = device;
      const frames = only
        ? only.split(",").map(Number)
        : Array.from({ length: motion.frames }, (_, i) => i);
      const outDir = join(root, "public/devices", target.slug, name);
      if (!only) rmSync(outDir, { recursive: true, force: true });
      mkdirSync(outDir, { recursive: true });

      const screen =
        name === "laptop"
          ? await laptopPng(target)
          : readFileSync(join(captures, target.slug, "mobile.png"));
      const look = name === "phone" ? { ...device.look, finish: target.finish } : device.look;

      const page = await browser.newPage();
      page.on("console", (m) => m.type() === "error" && console.error(`  ${m.text()}`));
      page.on("pageerror", (error) => console.error(`  ${target.slug}: ${error.message}`));
      await serveOn(page, "render.local", {
        "/": ["text/html", scenePage(device.scene, look)],
        "/model.glb": ["model/gltf-binary", readFileSync(join(models, device.model))],
        [`/${device.scene}`]: ["text/javascript", readFileSync(join(here, device.scene))],
        "/font.woff2": ["font/woff2", readFileSync(font)],
        "/screen.png": ["image/png", screen],
      });
      await page.goto("http://render.local/", { waitUntil: "load" });
      await page.waitForFunction("window.__ready", null, { timeout: 180_000, polling: 250 });
      const poses = Array.from({ length: motion.frames }, (_, i) => pose(motion, i));
      await page.evaluate(
        ([all, aspect]) =>
          window.fit?.(
            all.filter((_, i) => i % 4 === 0 || i === all.length - 1),
            aspect,
          ),
        [poses, motion.aspect],
      );

      let bytes = 0;
      for (const frame of frames) {
        for (const width of motion.widths) {
          const height = Math.round(width / motion.aspect);
          const result = await page.evaluate((args) => window.renderFrame(args), {
            ...pose(motion, frame),
            width,
            height,
          });
          if (result.type !== "image/webp") throw new Error(`Chromium returned ${result.type}`);
          const data = Buffer.from(result.base64, "base64");
          if (width === motion.widths.at(-1)) bytes += data.length;
          writeFileSync(join(outDir, `frame-${pad(frame)}-${width}.webp`), data);
        }
      }
      if (device.still && !only) {
        await page.evaluate(([last, aspect]) => window.fit?.([last], aspect), [
          pose(motion, motion.frames - 1),
          device.still.aspect,
        ]);
        for (const width of device.still.widths) {
          const height = Math.round(width / device.still.aspect);
          const result = await page.evaluate((args) => window.renderFrame(args), {
            ...pose(motion, motion.frames - 1),
            width,
            height,
          });
          writeFileSync(join(outDir, `still-${width}.webp`), Buffer.from(result.base64, "base64"));
        }
      }
      console.log(
        `${target.slug} ${name}: ${frames.length} frames (${Math.round(bytes / 1024)} KB at ${motion.widths.at(-1)})`,
      );
      await page.close();
    }
  }
} finally {
  await browser.close();
}
