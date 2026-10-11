// Open Graph images (1200×630) for the site and every case study, drawn with the real design
// tokens and fonts in headless Chromium. Writes public/og/default.jpg and public/og/<slug>.jpg.
// Case studies show the project on its rendered devices (npm run devices:render) when they
// exist, else its cover.
//
//   npm run og        (re-run when a project's title, tagline, cover or devices change; commit)
//
// Kept out of `npm run build` so CI doesn't need a browser. postbuild warns if one is missing.
import { existsSync, readFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright";
import { runnerImport } from "vite";

const { module: content } = await runnerImport("/app/content/projects.ts");
const { module: siteModule } = await runnerImport("/app/content/site.ts");
const { site } = siteModule;
const { caseStudies, featuredProjects } = content;

// Inline everything as data: URIs — a page made with setContent can't read file:// URLs.
const dataUri = (p, type) => `data:${type};base64,${readFileSync(p).toString("base64")}`;
const fonts = {
  sans: dataUri("app/styles/fonts/Satoshi-Variable.woff2", "font/woff2"),
  italic: dataUri("app/styles/fonts/Satoshi-VariableItalic.woff2", "font/woff2"),
};
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const isTodo = (v) => typeof v === "string" && v.startsWith("TODO(enzo):");

/** The laptop and phone stills for a project, if rendered. */
function devices(slug) {
  const laptop = `public/devices/${slug}/laptop/still-1280.webp`;
  const phone = `public/devices/${slug}/phone/frame-47-760.webp`;
  if (!existsSync(laptop)) return null;
  return {
    laptop: dataUri(laptop, "image/webp"),
    phone: existsSync(phone) ? dataUri(phone, "image/webp") : null,
  };
}

function tint(accent, amount) {
  return accent ? `color-mix(in oklab, ${accent} ${amount}%, #e1e5eb)` : "#e1e5eb";
}

function template({ eyebrow, titleHtml, sub, meta, accent, stage, image, cobalt = false }) {
  const bg = cobalt ? "#2b36f5" : "#eceef2";
  const fg = cobalt ? "#ffffff" : "#0c0e16";
  const spark = cobalt ? "#d4ff3c" : "#2b36f5";
  const muted = cobalt ? "#c9ccff" : "#555b6b";
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Satoshi; src: url(${fonts.sans}) format("woff2"); font-weight: 300 900; }
  @font-face { font-family: Satoshi; src: url(${fonts.italic}) format("woff2"); font-weight: 300 900; font-style: italic; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: ${bg}; color: ${fg}; font-family: Satoshi; overflow: hidden; position: relative; }
  .eyebrow { font-size: 22px; font-weight: 600; color: ${muted}; }
  .wrap { position: absolute; inset: 56px 60px; display: flex; flex-direction: column; justify-content: space-between; width: 560px; }
  h1 { font-weight: 760; letter-spacing: -0.045em; line-height: .92; font-size: 88px; margin-top: 22px; }
  em { font-style: italic; font-weight: 420; letter-spacing: -0.035em; color: ${spark}; }
  p.sub { margin-top: 24px; font-size: 26px; line-height: 1.3; font-weight: 500; opacity: .82; }
  .row { display: flex; align-items: center; gap: 14px; font-size: 20px; font-weight: 700; }
  .mark { width: 44px; height: 44px; border-radius: 50%; background: ${cobalt ? "#d4ff3c" : "#2b36f5"}; color: ${cobalt ? "#0c0e16" : "#fff"}; display: grid; place-items: center; font-size: 15px; font-weight: 900; letter-spacing: -0.06em; }
  .stage { position: absolute; top: 40px; right: 40px; bottom: 40px; width: 560px; border-radius: 32px; background: ${stage ?? "transparent"}; overflow: hidden; }
  .stage .laptop { position: absolute; left: 28px; right: 64px; top: 120px; }
  .stage .laptop img { width: 100%; filter: drop-shadow(0 30px 30px rgb(12 14 22 / .2)); }
  .stage .phone { position: absolute; right: 18px; bottom: 26px; width: 170px; }
  .stage .phone img { width: 100%; filter: drop-shadow(0 20px 20px rgb(12 14 22 / .2)); }
  .stage .cover { width: 100%; height: 100%; object-fit: cover; }
  </style></head><body>
  <div class="wrap">
    <div><p class="eyebrow">${esc(eyebrow)}</p><h1>${titleHtml}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}</div>
    <div class="row"><span class="mark">EDV</span><span>${esc(meta)}</span></div>
  </div>
  ${
    image?.laptop
      ? `<div class="stage"><div class="laptop"><img src="${image.laptop}"></div>${image.phone ? `<div class="phone"><img src="${image.phone}"></div>` : ""}</div>`
      : image?.cover
        ? `<div class="stage"><img class="cover" src="${image.cover}"></div>`
        : ""
  }
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

const lead = featuredProjects.find((p) => devices(p.slug));
await render(
  template({
    eyebrow: `${site.name} — ${site.descriptor}`,
    titleHtml: `I design &amp; build websites you can <em>feel.</em>`,
    meta: `${site.name} · ${site.studio.name}`,
    cobalt: true,
    stage: "rgb(255 255 255 / .08)",
    image: lead ? devices(lead.slug) : undefined,
  }),
  "public/og/default.jpg",
);

for (const p of caseStudies) {
  const cover = `app/assets/${p.cover}`;
  const year = p.yearLabel ?? (isTodo(p.year) ? "" : p.year);
  await render(
    template({
      eyebrow: `Case study — ${p.disciplines.join(" · ")}`,
      titleHtml: esc(p.title),
      sub: p.tagline,
      meta: [site.name, year].filter(Boolean).join(" · "),
      stage: tint(p.theme?.accent, 34),
      image:
        devices(p.slug) ??
        (existsSync(cover) ? { cover: dataUri(cover, "image/jpeg") } : undefined),
    }),
    `public/og/${p.slug}.jpg`,
  );
}

await browser.close();
