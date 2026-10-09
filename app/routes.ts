import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Design-system playground. Exists in dev only — never built, prerendered or listed in the sitemap.
const devOnly =
  process.env.NODE_ENV === "production" ? [] : [route("_styleguide", "routes/styleguide.tsx")];

export default [index("routes/home.tsx"), ...devOnly] satisfies RouteConfig;
