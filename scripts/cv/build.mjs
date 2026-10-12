// Prints scripts/cv/cv.html to public/Enzo-De-Vittorio-CV.pdf (A4, one page) with the real
// fonts. Pass --png to also write .shots/cv.png for a quick look.
import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const source = fileURLToPath(new URL("./cv.html", import.meta.url));
const out = fileURLToPath(new URL("../../public/Enzo-De-Vittorio-CV.pdf", import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
await page.goto(pathToFileURL(source).href);
await page.evaluate(() => document.fonts.ready);

const overflow = await page.evaluate(
  () => document.body.scrollHeight > document.body.clientHeight + 1,
);
if (overflow) {
  console.error("cv: content runs past one A4 page");
  process.exitCode = 1;
}

await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
if (process.argv.includes("--png")) {
  mkdirSync(".shots", { recursive: true });
  await page.screenshot({ path: ".shots/cv.png", fullPage: true });
}
await browser.close();
console.log(`cv: wrote ${out}`);
