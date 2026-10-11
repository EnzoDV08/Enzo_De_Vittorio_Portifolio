// Keyboard and reduced-motion checks against the preview server (npm run preview).
//   npm run a11y
// Exits non-zero on any failure.
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:4173";
const ROUTES = ["/", "/work", "/work/mpg-foundation", "/about", "/contact"];
const failures = [];
const check = (ok, message) => {
  console.log(`${ok ? "  ✓" : "  ✗"} ${message}`);
  if (!ok) failures.push(message);
};

const browser = await chromium.launch();

// 1. Keyboard: skip link first, every focus stop visibly outlined, all reachable stops counted.
for (const route of ROUTES) {
  console.log(`keyboard ${route}`);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check(first === "Skip to content", `first Tab stop is the skip link (got "${first}")`);
  let stops = 0;
  const unringed = [];
  for (let i = 0; i < 120; i++) {
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const ringed = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2;
      return { ringed, label: `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 30)}"` };
    });
    if (!info) break;
    stops++;
    if (!info.ringed) unringed.push(info.label);
    await page.keyboard.press("Tab");
  }
  check(stops > 5, `${stops} keyboard stops reachable`);
  check(unringed.length === 0, `every stop shows the focus ring${unringed.length ? `: ${unringed.slice(0, 4).join(", ")}` : ""}`);
  await page.close();
}

// 2. Mobile menu: keyboard open, focus moves in, page inert, Esc closes, focus returns.
{
  console.log("mobile menu");
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const toggle = page.locator('button[aria-controls="menu"]');
  await toggle.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  check((await toggle.getAttribute("aria-expanded")) === "true", "Enter opens the menu");
  const inMenu = await page.evaluate(() => !!document.activeElement?.closest("#menu"));
  check(inMenu, "focus moves into the menu");
  check(await page.evaluate(() => document.getElementById("main")?.hasAttribute("inert")), "main is inert while open");
  check(await page.evaluate(() => document.documentElement.style.overflow === "hidden"), "page scroll is locked");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  check((await toggle.getAttribute("aria-expanded")) === "false", "Esc closes the menu");
  check(await page.evaluate(() => document.activeElement?.getAttribute("aria-controls") === "menu"), "focus returns to the toggle");
  check(!(await page.evaluate(() => document.getElementById("main")?.hasAttribute("inert"))), "main is interactive again");
  await page.close();
}

// 3. Filters: aria-pressed and the URL follow the chosen chip.
{
  console.log("work filters");
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/work", { waitUntil: "networkidle" });
  const ux = page.getByRole("button", { name: "UX", exact: true });
  await ux.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  check((await ux.getAttribute("aria-pressed")) === "true", "UX chip is pressed");
  check(page.url().includes("d=ux"), `URL carries the filter (${new URL(page.url()).search})`);
  const titles = await page.locator("article h2, article h3").allTextContents();
  check(!titles.some((t) => t.includes("ChronoVoyage")), "non-UX projects are filtered out");
  await page.goto(BASE + "/work?d=ux", { waitUntil: "networkidle" });
  await page.waitForTimeout(200);
  check((await page.getByRole("button", { name: "UX", exact: true }).getAttribute("aria-pressed")) === "true", "direct link ?d=ux restores the filter");
  await page.close();
}

// 4. Reduced motion: no GSAP/Lenis downloaded, nothing left hidden or transformed.
for (const route of ROUTES) {
  console.log(`reduced motion ${route}`);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const scripts = [];
  page.on("request", (r) => r.resourceType() === "script" && scripts.push(r.url()));
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(500);
  check(!scripts.some((s) => /gsap|Lenis|Fx-/i.test(s)), "no animation code is downloaded");
  check(!(await page.evaluate(() => document.documentElement.classList.contains("lenis"))), "Lenis is off");
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll("main h1, main h2, main h3, main p, main img, main a")]
      .filter((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return r.width > 0 && (cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.99);
      })
      .map((el) => el.textContent?.trim().slice(0, 30) || el.tagName),
  );
  check(hidden.length === 0, `no content is hidden${hidden.length ? `: ${hidden.slice(0, 4).join(", ")}` : ""}`);
  await page.close();
}

await browser.close();
if (failures.length) {
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log("\na11y: all checks passed");
