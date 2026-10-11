import { Component, Suspense } from "react";

class Boundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.warn("Motion island failed; content stays static.", error);
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Wrapper for lazy motion components. Renders nothing while the chunk loads, and if an
 * animation ever throws, it unmounts quietly (GSAP reverts its inline styles) instead of
 * taking the page down. Motion is decoration, content must survive it.
 */
export function Island({ children }: { children: React.ReactNode }) {
  return (
    <Boundary>
      <Suspense fallback={null}>{children}</Suspense>
    </Boundary>
  );
}
