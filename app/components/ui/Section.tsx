import { useId } from "react";
import { cn } from "~/lib/cn";
import { Container } from "./Container";
import { SectionLabel } from "./SectionLabel";

type Props = {
  index?: number;
  label?: string;
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  /** "tight" for runs of related sections (e.g. the About timelines). */
  spacing?: "default" | "tight" | "none";
  id?: string;
};

/** A page section: numbered label pill, generous vertical rhythm. */
export function Section({
  index,
  label,
  children,
  className,
  containerClassName,
  spacing = "default",
  id,
}: Props) {
  const labelId = useId();
  return (
    <section
      id={id}
      aria-labelledby={label ? labelId : undefined}
      // Top padding only: consecutive sections share one gap, and the footer CTA closes the page.
      className={cn(
        spacing === "tight" && "pt-20 md:pt-28",
        spacing === "default" && "pt-section",
        className,
      )}
    >
      <Container className={containerClassName}>
        {label && (
          <div className="mb-10 md:mb-14">
            <SectionLabel id={labelId} index={index}>
              {label}
            </SectionLabel>
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
