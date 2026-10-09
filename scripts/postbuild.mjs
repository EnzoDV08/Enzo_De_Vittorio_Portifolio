// Runs after `react-router build`:
//  1. moves the prerendered 404 into place and drops the unused SPA fallback
//  2. writes sitemap.xml and robots.txt from the same path list the prerender uses
//  3. checks every case study has an OG image (from `npm run og`)
//  4. enforces the initial-JS budget (≤ 130 KB gzip per page)
import { existsSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";
import { runnerImport } from "vite";

const OUT = "build/client";
const BUDGET_KB = 130;

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "assets") yield* htmlFiles(path);
    else if (entry.name === "index.html") yield path;
  }
}

if (!existsSync(`${OUT}/index.html`)) {
  console.error(`postbuild: expected ${OUT}/index.html — did the prerender run?`);
  process.exit(1);
}

// 404: the splat route was prerendered at /404. Firebase serves /404.html (with a 404 status)
// for any path that has no file. Remove the /404 directory so it isn't a 200 page too, and the
// SPA fallback, which is unused because every real route is prerendered.
if (existsSync(`${OUT}/404/index.html`)) {
  renameSync(`${OUT}/404/index.html`, `${OUT}/404.html`);
  rmSync(`${OUT}/404`, { recursive: true, force: true });
  rmSync(`${OUT}/404.data`, { force: true });
}
rmSync(`${OUT}/__spa-fallback.html`, { force: true });

// Sitemap + robots. Paths come from react-router.config.ts (which reads app/content), so a new
// case study is listed automatically. The dev-only styleguide is never in that list.
const { module: config } = await runnerImport("/react-router.config.ts");
const { module: siteModule } = await runnerImport("/app/content/site.ts");
const origin = siteModule.site.url;
const urls = config.staticPaths
  .map((path) => `  <url><loc>${origin}${path === "/" ? "/" : path}</loc></url>`)
  .join("\n");
writeFileSync(
  `${OUT}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);

// OG images are generated on demand (npm run og) and committed; flag any that are missing.
const missingOg = config.staticPaths
  .filter((p) => p.startsWith("/work/"))
  .map((p) => `og/${p.slice(6)}.jpg`)
  .concat("og/default.jpg")
  .filter((f) => !existsSync(`${OUT}/${f}`));
if (missingOg.length)
  console.warn(`postbuild: missing OG images — run \`npm run og\`: ${missingOg.join(", ")}`);

// Initial JS = every module the HTML preloads or imports before any interaction.
const gz = new Map();
const gzipKb = (file) => {
  if (!gz.has(file)) gz.set(file, gzipSync(readFileSync(join(OUT, file))).length / 1024);
  return gz.get(file);
};
let over = false;
const rows = [];
for (const file of htmlFiles(OUT)) {
  const html = readFileSync(file, "utf8");
  const scripts = new Set(
    [
      ...html.matchAll(/(?:href|src)="(\/assets\/[^"]+\.js)"|import\("(\/assets\/[^"]+\.js)"\)/g),
    ].map((m) => (m[1] ?? m[2]).slice(1)),
  );
  const kb = [...scripts].reduce((sum, s) => sum + gzipKb(s), 0);
  const route =
    "/" +
    relative(OUT, file)
      .replace(/index\.html$/, "")
      .replace(/\/$/, "");
  rows.push(`  ${kb.toFixed(1).padStart(6)} KB  ${route}`);
  if (kb > BUDGET_KB) over = true;
}
console.log(
  `postbuild: initial JS (gzip) per page, budget ${BUDGET_KB} KB\n${rows.sort().join("\n")}`,
);
if (over) {
  console.error("postbuild: initial JS budget exceeded");
  process.exit(1);
}
console.log(`postbuild: ok — ${config.staticPaths.length} pages, sitemap, robots, 404`);
