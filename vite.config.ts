import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

const appDir = fileURLToPath(new URL("./app", import.meta.url));
const buildId =
  process.env.COMMIT_REF?.trim() || execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();

// Group only the shell and shared motion helpers. Page-specific UI and copy stay with their
// routes, so case studies do not preload the About and Home components.
const isSharedAppCode = (id: string) =>
  /\/app\/(components\/(layout|motion)\/|lib\/|content\/(pages|site|todo)\.ts)/.test(id) &&
  !/\/motion\/fx\/|\/lib\/(gsap|images|gallery-images|placeholders|content\.server)\.ts/.test(id);

export default defineConfig({
  plugins: [tailwindcss(), imagetools(), reactRouter()],
  define: { __SITE_BUILD_ID__: JSON.stringify(buildId) },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: { groups: [{ name: "app", test: isSharedAppCode }] },
      },
    },
  },
  resolve: {
    alias: [{ find: /^~\//, replacement: `${appDir}/` }],
  },
});
