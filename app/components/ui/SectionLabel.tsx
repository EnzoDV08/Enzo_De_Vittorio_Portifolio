type Props = {
  /** Kept for callers; no longer shown (the numbered pill was retired). */
  index?: number;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

/**
 * A section's name. No longer drawn (the numbered pill was taken out of the design), but still
 * in the page for screen readers: sections point at it with aria-labelledby.
 */
export function SectionLabel({ children, id }: Props) {
  return (
    <span id={id} className="sr-only">
      {children}
    </span>
  );
}
