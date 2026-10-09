import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "app",
  buildDirectory: "build",
  // Static site: no server runtime. Every route below is prerendered to real HTML.
  ssr: false,
  future: {
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },
  async prerender() {
    return ["/"];
  },
} satisfies Config;
