/**
 * Captures each case study's real site for the device renders (scripts/devices/render.mjs):
 *
 *   _originals/devices/<slug>/desktop-<n>.png   MacBook Pro 14" screen, 1512×982 at 2x,
 *                                               scrolled n viewports down (0 = the top)
 *   _originals/devices/<slug>/mobile.png        iPhone 17 Pro screen below the status bar,
 *                                               402×812 at 3x
 *
 *   node scripts/devices/capture.mjs                 # every project
 *   node scripts/devices/capture.mjs honeybee-heroes # one project
 *
 * Sites are captured with reduced motion and after a pause, so preloaders and entrance
 * animations have settled. Projects without a public URL are served from their local build.
 */
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { chromium } from "playwright";
import { targets } from "./targets.mjs";

const OUT = "_originals/devices";
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
    const local = target.dir ? await serve(target.dir) : null;
    const url = local?.url ?? target.url;
    const dir = join(OUT, target.slug);
    mkdirSync(dir, { recursive: true });

    for (const device of ["desktop", "mobile"]) {
      const mobile = device === "mobile";
      const context = await browser.newContext({
        viewport: mobile ? { width: 402, height: 812 } : { width: 1512, height: 982 },
        deviceScaleFactor: mobile ? 3 : 2,
        isMobile: mobile,
        hasTouch: mobile,
        reducedMotion: target.motion ? "no-preference" : "reduce",
      });
      const page = await context.newPage();
      await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 }).catch(() => undefined);
      await page.waitForTimeout(target.settle ?? 3500);
      const hide = mobile ? (target.hideMobile ?? target.hide) : target.hide;
      if (hide) {
        await page.addStyleTag({ content: `${hide} { display: none !important; }` });
      }
      if (target.redact) {
        // Hide the smallest elements whose text mentions any of these words.
        await page.evaluate((words) => {
          const hits = [...document.querySelectorAll("body *")].filter((el) =>
            words.some((w) => el.textContent?.toLowerCase().includes(w.toLowerCase())),
          );
          for (const el of hits) {
            if (!hits.some((other) => other !== el && el.contains(other))) {
              el.style.visibility = "hidden";
            }
          }
        }, target.redact);
      }
      if (mobile) {
        await page.screenshot({ path: join(dir, "mobile.png") });
      } else {
        const stops = target.stops ?? [0];
        for (const [i, stop] of stops.entries()) {
          await page.evaluate((y) => window.scrollTo(0, y * window.innerHeight), stop);
          await page.waitForTimeout(1600);
          await page.screenshot({ path: join(dir, `desktop-${i}.png`) });
        }
      }
      await context.close();
    }
    local?.server.close();
    console.log(`${target.slug}: captured`);
  }
} finally {
  await browser.close();
}
