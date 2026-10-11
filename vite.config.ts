import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

const appDir = fileURLToPath(new URL("./app", import.meta.url));

// Shared app code (components, hooks, page copy, icons) goes in one chunk instead of ~20 tiny
// ones: fewer requests competing with the LCP image on slow connections. Motion islands, GSAP
// and server-only modules stay out so they remain lazy / never shipped.
const isSharedAppCode = (id: string) =>
  (/\/app\/(components|lib|content)\//.test(id) || /node_modules\/lucide-react\//.test(id)) &&
  !/\/motion\/fx\/|\/lib\/(gsap|images|gallery-images|content\.server)\.ts|\/content\/projects\.ts/.test(id);

export default defineConfig({
  plugins: [tailwindcss(), imagetools(), reactRouter()],
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
