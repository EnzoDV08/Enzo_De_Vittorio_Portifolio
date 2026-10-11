// Screenshot every route at several widths into .shots/, and report problems.
//
//   npm run build && npm run preview   (in another terminal)
//   npm run shots                      → .shots/<width>/<route>.png
//
// Options: BASE=http://localhost:4173  WIDTHS=390,768  HEIGHT=390  ROUTES=/,/work  REDUCED=1
// Each page is scrolled top to bottom first so scroll-triggered reveals have fired.
// Exits non-zero if any page overflows horizontally or logs an error.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:4173";
const WIDTHS = (process.env.WIDTHS ?? "390,768,1440,1920").split(",").map(Number);
const REDUCED = process.env.REDUCED === "1";
const ROUTES = (
  process.env.ROUTES ??
  [
    "/",
    "/work",
    "/work/one-river-two-memories",
    "/work/leke-lente-lingo",
    "/work/honeybee-heroes",
    "/work/stack-studio",
    "/work/mpg-foundation",
    "/work/chronovoyage",
    "/about",
    "/contact",
    "/this-page-does-not-exist",
  ].join(",")
).split(",");

const heights = {
  360: 740,
  390: 844,
  430: 932,
  768: 1024,
  1024: 768,
  1280: 800,
  1440: 900,
  1920: 1080,
};
const name = (route) => (route === "/" ? "home" : route.slice(1).replaceAll("/", "__"));

const browser = await chromium.launch();
const problems = [];

for (const width of WIDTHS) {
  const dir = `.shots/${REDUCED ? "reduced-" : ""}${width}${process.env.HEIGHT ? `x${process.env.HEIGHT}` : ""}`;
  mkdirSync(dir, { recursive: true });
  const mobile = width < 1024;
  const context = await browser.newContext({
    viewport: { width, height: Number(process.env.HEIGHT) || heights[width] || 900 },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: REDUCED ? "reduce" : "no-preference",
  });
  for (const route of ROUTES) {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    const expect404 = route.includes("does-not-exist");
    page.on("console", (m) => {
      // The 404 test page is *meant* to return a 404 status.
      if (expect404 && m.text().includes("status of 404")) return;
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    // Walk down the page so every ScrollTrigger fires, then return to the top.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.6);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 140));
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 1400));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    const issues = [];
    // Very tall pages occasionally exceed the capture timeout; retry once before reporting.
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        await page.screenshot({
          path: `${dir}/${name(route)}.png`,
          fullPage: true,
          timeout: 60_000,
        });
        break;
      } catch (e) {
        if (attempt === 2) issues.push(`screenshot failed: ${String(e).split("\n")[0]}`);
      }
    }
    if (overflow > 0) issues.push(`overflows by ${overflow}px`);
    if (errors.length) issues.push(...errors.map((e) => `error: ${e}`));
    if (issues.length) problems.push(`${width} ${route}: ${issues.join("; ")}`);
    console.log(
      `${String(width).padStart(4)} ${route}${issues.length ? "  ✗ " + issues.join("; ") : ""}`,
    );
    await page.close();
  }
  await context.close();
}

await browser.close();
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n${problems.join("\n")}`);
  process.exit(1);
}
console.log("\nshots: no overflow, no errors");
