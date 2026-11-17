import { Component, Suspense } from "react";

type BoundaryProps = { children: React.ReactNode; fallback: React.ReactNode };

class Boundary extends Component<BoundaryProps, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.warn("Motion island failed; content stays static.", error);
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Wrapper for lazy motion components. Renders `fallback` (nothing by default) while the chunk
 * loads, and if an animation ever throws, it falls back quietly (GSAP reverts its inline styles)
 * instead of taking the page down. Motion is decoration, content must survive it.
 */
export function Island({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  /** Shown while loading and after a failure, e.g. the static version of the section. */
  fallback?: React.ReactNode;
}) {
  return (
    <Boundary fallback={fallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </Boundary>
  );
}
