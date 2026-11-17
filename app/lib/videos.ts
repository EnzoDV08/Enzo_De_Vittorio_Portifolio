// Project preview loops, encoded by `npm run videos` (scripts/optimize-videos.mjs) into
// app/assets/videos/<slug>/. Imported as URLs, so Vite fingerprints them and they're served
// with the immutable /assets/* cache. Server-only: read through lib/content.server.ts.

/** A project's preview loop. Every encode is 1600×1000, silent, looping-ready. */
export type ProjectVideo = {
  /** AV1 in WebM: the default. */
  av1?: string;
  /** H.264 in MP4: for browsers that can't play AV1. */
  h264?: string;
  /** First frame, shown until the video plays (and instead of it with Save-Data). */
  poster?: string;
};

const files = import.meta.glob<string>("../assets/videos/*/*.{webm,mp4,webp,jpg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const bySlug = new Map<string, ProjectVideo>();
for (const [path, url] of Object.entries(files)) {
  const match = /videos\/([^/]+)\/(preview\.av1\.webm|preview\.h264\.mp4|poster\.(?:webp|jpg))$/.exec(path);
  if (!match) continue;
  const [, slug = "", name = ""] = match;
  const video = bySlug.get(slug) ?? {};
  if (name.endsWith(".webm")) video.av1 = url;
  else if (name.endsWith(".mp4")) video.h264 = url;
  else video.poster = url;
  bySlug.set(slug, video);
}

/** The project's preview loop, or undefined when it has none (or none encoded yet). */
export function getVideo(slug: string): ProjectVideo | undefined {
  const video = bySlug.get(slug);
  return video && (video.av1 || video.h264) ? video : undefined;
}
