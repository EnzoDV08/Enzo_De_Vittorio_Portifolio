// Runs after `react-router build`. Phase 6 extends this with 404, sitemap and robots output.
import { existsSync } from "node:fs";

const out = "build/client";
if (!existsSync(`${out}/index.html`)) {
  console.error(`postbuild: expected ${out}/index.html — did the prerender run?`);
  process.exit(1);
}
console.log("postbuild: ok");
