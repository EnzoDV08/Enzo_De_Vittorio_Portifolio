/**
 * Missing content is never invented. It is a `todo()` value instead, which:
 *  - reads as `TODO(enzo): …` so it's impossible to miss in the UI or in a grep, and
 *  - is detectable with `isTodo()`, so components can hide links or show a marker.
 * Every todo() here must also be listed in CONTENT_TODO.md.
 */
export type Todo = `TODO(enzo): ${string}`;

export function todo(note: string): Todo {
  return `TODO(enzo): ${note}`;
}

export function isTodo(value: unknown): value is Todo {
  return typeof value === "string" && value.startsWith("TODO(enzo):");
}

/** Returns the value only if it is real content. */
export function real<T>(value: T | Todo | undefined): T | undefined {
  return value === undefined || isTodo(value) ? undefined : (value as T);
}
