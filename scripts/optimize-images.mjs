// Resize full-size originals into web-ready masters that vite-imagetools then turns into
// AVIF/WebP srcsets at build time.
//
//   _originals/archive/<slug>.<ext>   → app/assets/projects/<slug>/cover.jpg
//   _originals/about/<name>.<ext>     → app/assets/about/<name>.jpg
//   _originals/<slug>/<name>.<ext>    → app/assets/projects/<slug>/<name>.jpg
//
// Transparent images are flattened onto ink-2, the surface they sit on. Up-to-date outputs are skipped; pass --force to redo all.
import { mkdirSync, readdirSync, statSync, existsSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import sharp from "sharp";

const SRC = "_originals";
const OUT = "app/assets";
const MAX_WIDTH = 2400;
const force = process.argv.includes("--force");
const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".heic", ".avif"]);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (exts.has(extname(entry.name).toLowerCase())) yield path;
  }
}

function target(file) {
  const [group, ...rest] = relative(SRC, file).split("/");
  const name = basename(file, extname(file)).toLowerCase();
  if (group === "archive" && rest.length === 1) return join(OUT, "projects", name, "cover");
  if (group === "about") return join(OUT, "about", name);
  return join(OUT, "projects", group, ...rest.slice(0, -1), name);
}

if (!existsSync(SRC)) {
  console.error(`No ${SRC}/ folder. Put full-size images in ${SRC}/<project-slug>/ first.`);
  process.exit(1);
}

let done = 0;
let skipped = 0;
for (const file of walk(SRC)) {
  const out = `${target(file)}.jpg`;
  if (!force && existsSync(out) && statSync(out).mtimeMs > statSync(file).mtimeMs) {
    skipped++;
    continue;
  }
  mkdirSync(dirname(out), { recursive: true });
  await sharp(file)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .flatten({ background: "#131316" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out);
  const { width, height } = await sharp(out).metadata();
  const size = statSync(out).size;
  console.log(`${relative(".", out)}  ${width}×${height}  ${(size / 1024).toFixed(0)} KB`);
  done++;
}
console.log(`images: ${done} written, ${skipped} up to date`);
