import { useId } from "react";
import { cn } from "~/lib/cn";
import { Container } from "./Container";
import { SectionLabel } from "./SectionLabel";

type Props = {
  index?: number;
  label?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  /** Hairline rule above the section. */
  rule?: boolean;
  /** "tight" for runs of related sections (e.g. the About timelines). */
  spacing?: "default" | "tight";
  id?: string;
};

/** A page section: hairline rule, mono label, generous vertical rhythm. */
export function Section({
  index,
  label,
  children,
  className,
  containerClassName,
  rule = true,
  spacing = "default",
  id,
}: Props) {
  const labelId = useId();
  return (
    <section
      id={id}
      aria-labelledby={label ? labelId : undefined}
      // Top padding only: consecutive sections share one gap, and the footer CTA closes the page.
      className={cn(spacing === "tight" ? "pt-20 md:pt-28" : "pt-section", className)}
    >
      <Container className={containerClassName}>
        {(rule || label) && (
          <div className={cn("mb-12 md:mb-20", rule && "border-t border-line pt-5")}>
            {label && (
              <SectionLabel id={labelId} index={index}>
                {label}
              </SectionLabel>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
