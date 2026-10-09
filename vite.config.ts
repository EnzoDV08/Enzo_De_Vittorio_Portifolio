import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

const appDir = fileURLToPath(new URL("./app", import.meta.url));

export default defineConfig({
  plugins: [tailwindcss(), imagetools(), reactRouter()],
  resolve: {
    alias: [{ find: /^~\//, replacement: `${appDir}/` }],
  },
});
