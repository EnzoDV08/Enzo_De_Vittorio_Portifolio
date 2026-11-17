/**
 * Captures the top of each case study's real site as one tall image, for the case-study screen
 * (components/project/ScreenScroll): a browser window that slides up, then scrolls the site
 * inside it for a short stretch.
 *
 *   _originals/<slug>/scroll.png   1512px wide at 2x, SCREENS viewport heights tall (16:10
 *                                  viewports), then `npm run images` → app/assets/projects/<slug>/scroll.jpg
 *
 *   node scripts/devices/capture-scroll.mjs                  # every target in targets.mjs
 *   node scripts/devices/capture-scroll.mjs honeybee-heroes  # one
 *
 * The page is scrolled one screen at a time (so scroll-triggered reveals play) and each screen
 * is photographed and stitched. A full-page screenshot would be simpler, but it stretches the
 * viewport, so 100vh heroes balloon. From the second screen on, small fixed bars (the site's
 * nav) are hidden so they don't repeat; full-screen fixed backgrounds stay.
 */
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { targets } from "./targets.mjs";

const OUT = "_originals";
const WIDTH = 1512;
const HEIGHT = 945; // 16:10, the screen's shape
const SCALE = 2;
/** How much of the site the screen scrolls through: the top, not the whole page. */
const SCREENS = 2.6;

const only = process.argv[2];
const selected = targets.filter((t) => !only || t.slug === only);
if (!selected.length) throw new Error(`No capture target "${only}"`);

const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".mp4": "video/mp4",
  ".glb": "model/gltf-binary",
};

/** A static server for a local build, with an SPA fallback to index.html. */
function serve(dir) {
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = join(dir, path);
    if (!existsSync(file) || statSync(file).isDirectory()) {
      file = existsSync(join(file, "index.html")) ? join(file, "index.html") : join(dir, "index.html");
    }
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, () => resolve({ server, url: `http://localhost:${server.address().port}/` }));
  });
}

const browser = await chromium.launch();
try {
  for (const target of selected) {
    if (target.dir && !existsSync(target.dir)) {
      console.warn(`${target.slug}: skipped, no build at ${target.dir}`);
      continue;
    }
    const local = target.dir ? await serve(target.dir) : null;
    const url = local?.url ?? target.url;
    const context = await browser.newContext({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: SCALE,
      reducedMotion: target.motion ? "no-preference" : "reduce",
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "load", timeout: 90_000 }).catch(() => undefined);
    await page.waitForTimeout(target.settle ?? 3500);
    if (target.hide) await page.addStyleTag({ content: `${target.hide} { display: none !important; }` });
    // A sticky element pins while its section scrolls, so screen by screen it can appear twice
    // at a seam. Targets with `unstick` let theirs sit in the page instead. Opt-in: sites built
    // on sticky scenes (One River) go blank without it.
    if (target.unstick) {
      await page.evaluate(() => {
        for (const el of document.querySelectorAll("body *")) {
          if (getComputedStyle(el).position === "sticky") el.style.setProperty("position", "relative", "important");
        }
      });
    }
    if (target.redact) {
      await page.evaluate((words) => {
        const hits = [...document.querySelectorAll("body *")].filter((el) =>
          words.some((w) => el.textContent?.toLowerCase().includes(w.toLowerCase())),
        );
        for (const el of hits) {
          if (!hits.some((other) => other !== el && el.contains(other))) el.style.visibility = "hidden";
        }
      }, target.redact);
    }

    const total = Math.round(HEIGHT * SCREENS);
    const tiles = [];
    for (let k = 0; k * HEIGHT < total; k++) {
      const y = await page.evaluate((top) => {
        window.scrollTo(0, top);
        return window.scrollY;
      }, k * HEIGHT);
      await page.waitForTimeout(1600);
      if (k === 1) {
        // Hide the nav (small fixed / sticky bars near the top) from here on, so it shows once.
        await page.evaluate(() => {
          for (const el of document.querySelectorAll("body *")) {
            const style = getComputedStyle(el);
            if (style.position !== "fixed" && style.position !== "sticky") continue;
            const rect = el.getBoundingClientRect();
            if (rect.height < 220 && rect.top < 160) el.style.setProperty("visibility", "hidden", "important");
          }
        });
      }
      const actual = await page.evaluate(() => window.scrollY);
      tiles.push({ y: actual, png: await page.screenshot() });
      // The page ran out before the target height: stop (the last tile already covers it).
      if (actual < y || actual < k * HEIGHT) break;
    }

    const height = Math.min(total, Math.max(...tiles.map((t) => t.y)) + HEIGHT);
    const canvas = sharp({
      create: { width: WIDTH * SCALE, height: height * SCALE, channels: 3, background: "#000" },
    });
    const out = join(OUT, target.slug, "scroll.png");
    mkdirSync(join(OUT, target.slug), { recursive: true });
    // Each screen cropped to what fits below its offset, so none overhangs the bottom.
    const layers = await Promise.all(
      tiles
        .filter((t) => t.y < height)
        .map(async (t) => ({
          input: await sharp(t.png)
            .extract({
              left: 0,
              top: 0,
              width: WIDTH * SCALE,
              height: Math.min(HEIGHT, height - t.y) * SCALE,
            })
            .toBuffer(),
          top: Math.round(t.y * SCALE),
          left: 0,
        })),
    );
    await canvas.composite(layers).png().toFile(out);
    console.log(`${target.slug}: ${WIDTH * SCALE}×${height * SCALE} from ${tiles.length} screens → ${out}`);
    await context.close();
    local?.server.close();
  }
} finally {
  await browser.close();
}
