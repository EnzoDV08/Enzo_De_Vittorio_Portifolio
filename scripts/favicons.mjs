// "EDV" monogram favicons: Geist 600 outlines (not live text, so every browser draws the same
// thing), ink on accent. Writes public/favicon.svg, favicon-32.png, apple-touch-icon.png.
import { readFileSync, writeFileSync } from "node:fs";
import opentype from "opentype.js";
import sharp from "sharp";

const INK = "#0b0b0d";
const ACCENT = "#ff4f1a";
const SIZE = 64;

const buffer = readFileSync("node_modules/@fontsource/geist/files/geist-latin-600-normal.woff");
const font = opentype.parse(
  buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.length),
);

// Lay out "EDV" with the site's tight display tracking, then fit it into the tile.
const fontSize = 100;
const tracking = -0.04 * fontSize;
let x = 0;
const paths = [];
for (const glyph of font.stringToGlyphs("EDV")) {
  paths.push(glyph.getPath(x, 0, fontSize));
  x += (glyph.advanceWidth / font.unitsPerEm) * fontSize + tracking;
}
const box = paths.reduce(
  (b, p) => {
    const bb = p.getBoundingBox();
    return {
      x1: Math.min(b.x1, bb.x1),
      y1: Math.min(b.y1, bb.y1),
      x2: Math.max(b.x2, bb.x2),
      y2: Math.max(b.y2, bb.y2),
    };
  },
  { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity },
);
const width = box.x2 - box.x1;
const height = box.y2 - box.y1;
const scale = (SIZE * 0.74) / width;
const tx = (SIZE - width * scale) / 2 - box.x1 * scale;
const ty = (SIZE - height * scale) / 2 - box.y1 * scale;
const d = paths.map((p) => p.toPathData(2)).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}"><rect width="${SIZE}" height="${SIZE}" rx="6" fill="${ACCENT}"/><path transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})" fill="${INK}" d="${d}"/></svg>\n`;

writeFileSync("public/favicon.svg", svg);
await sharp(Buffer.from(svg)).resize(32, 32).png().toFile("public/favicon-32.png");
// Apple touch icons get their corners rounded by iOS — supply a full-bleed square.
await sharp(Buffer.from(svg.replace(' rx="6"', "")))
  .resize(180, 180)
  .png()
  .toFile("public/apple-touch-icon.png");
console.log(`favicons: favicon.svg (${svg.length} B), favicon-32.png, apple-touch-icon.png`);
