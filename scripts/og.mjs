// Open Graph images (1200×630) for the site and every case study, drawn with the real design
// tokens and fonts in headless Chromium. Writes public/og/default.jpg and public/og/<slug>.jpg.
//
//   npm run og        (re-run when a project's title, tagline or cover changes; commit the output)
//
// Kept out of `npm run build` so CI doesn't need a browser. postbuild warns if one is missing.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { chromium } from "playwright";
import { runnerImport } from "vite";

const { module: content } = await runnerImport("/app/content/projects.ts");
const { module: siteModule } = await runnerImport("/app/content/site.ts");
const { site } = siteModule;
const { caseStudies } = content;

// Inline everything as data: URIs — a page made with setContent can't read file:// URLs.
const dataUri = (p, type) => `data:${type};base64,${readFileSync(p).toString("base64")}`;
const file = (p) => dataUri(p, "font/woff2");
const fonts = {
  geist: file("node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2"),
  mono: file(
    "node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
  ),
  serif: file(
    "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2",
  ),
};
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const isTodo = (v) => typeof v === "string" && v.startsWith("TODO(enzo):");

function template({ eyebrow, title, titleHtml, sub, meta, accent = "#ff4f1a", image }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Geist; src: url(${fonts.geist}) format("woff2"); font-weight: 100 900; }
  @font-face { font-family: "Geist Mono"; src: url(${fonts.mono}) format("woff2"); font-weight: 100 900; }
  @font-face { font-family: "Instrument Serif"; src: url(${fonts.serif}) format("woff2"); font-style: italic; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #0b0b0d; color: #eeebe4; font-family: Geist; overflow: hidden; position: relative; }
  .meta { font-family: "Geist Mono"; font-size: 17px; letter-spacing: .08em; text-transform: uppercase; color: #8c8a86; }
  .wrap { position: absolute; inset: 56px 64px; display: flex; flex-direction: column; justify-content: space-between; }
  .text { width: ${image ? 600 : 1000}px; }
  h1 { font-weight: 560; letter-spacing: -0.04em; line-height: .92; font-size: ${image ? 84 : 132}px; margin-top: 28px; }
  em { font-family: "Instrument Serif"; font-style: italic; font-weight: 400; letter-spacing: -0.01em; color: ${accent}; }
  p.sub { margin-top: 26px; font-size: 26px; line-height: 1.35; color: rgb(238 235 228 / .82); max-width: 560px; }
  .row { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgb(255 255 255 / .12); padding-top: 18px; }
  .dot { display: inline-block; width: 10px; height: 10px; background: ${accent}; margin-right: 14px; vertical-align: 1px; }
  .img { position: absolute; top: 0; right: 0; width: 470px; height: 630px; overflow: hidden; background: #131316; }
  .img img { width: 100%; height: 100%; object-fit: cover; object-position: left center; }
  .img::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, #0b0b0d 0%, rgb(11 11 13 / 0) 28%); }
  .grain { position: absolute; inset: 0; opacity: .05; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
  </style></head><body>
  ${image ? `<div class="img"><img src="${image}"></div>` : ""}
  <div class="wrap">
    <div class="text"><p class="meta">${esc(eyebrow)}</p><h1>${titleHtml ?? esc(title)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}</div>
    <div class="row meta" style="width:${image ? 600 : 1072}px"><span><span class="dot"></span>${esc(meta)}</span><span>EDV</span></div>
  </div>
  <div class="grain"></div>
  </body></html>`;
}

mkdirSync("public/og", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

async function render(html, out) {
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, type: "jpeg", quality: 86 });
  console.log(`og: ${out}`);
}

await render(
  template({
    eyebrow: `${site.name} — ${site.descriptor}`,
    titleHtml: `Built to be <em>felt.</em>`,
    meta: `${site.clock.place} · ${site.studio.name}`,
  }),
  "public/og/default.jpg",
);

for (const p of caseStudies) {
  const cover = `app/assets/${p.cover}`;
  const year = p.yearLabel ?? (isTodo(p.year) ? "" : p.year);
  await render(
    template({
      eyebrow: `Case study — ${p.disciplines.join(" · ")}`,
      title: p.title,
      sub: p.tagline,
      meta: [site.name, year].filter(Boolean).join(" · "),
      accent: p.theme?.accent ?? "#ff4f1a",
      image: existsSync(cover) ? dataUri(cover, "image/jpeg") : undefined,
    }),
    `public/og/${p.slug}.jpg`,
  );
}

await browser.close();
