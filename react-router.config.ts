import type { Config } from "@react-router/dev/config";
import { caseStudies } from "./app/content/projects";

/** Every public page, as static HTML. Case studies come straight from the content. */
export const staticPaths = [
  "/",
  "/work",
  "/about",
  "/contact",
  ...caseStudies.map((p) => `/work/${p.slug}`),
];

export default {
  appDirectory: "app",
  buildDirectory: "build",
  // Static site: no server runtime. Every route below is prerendered to real HTML.
  ssr: false,
  future: {
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
  },
  async prerender() {
    // "/404" renders the splat route; postbuild turns it into the 404.html Firebase serves.
    return [...staticPaths, "/404"];
  },
} satisfies Config;
