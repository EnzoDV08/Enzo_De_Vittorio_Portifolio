import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Design-system playground. Exists in dev only — never built, prerendered or listed in the sitemap.
const devOnly =
  process.env.NODE_ENV === "production" ? [] : [route("_styleguide", "routes/styleguide.tsx")];

export default [
  index("routes/home.tsx"),
  route("work", "routes/work.tsx"),
  route("work/:slug", "routes/case-study.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
  ...devOnly,
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
