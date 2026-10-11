/** Already on screen when the page hydrates, reveal-on-scroll would only cause a flash. */
export function inViewAtMount(el: Element | null): boolean {
  if (!el) return true;
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
}
