import { Link, type LinkProps } from "react-router";
import { useTransitionNavigate } from "./PageTransition";

/**
 * Internal link that plays the page wipe. Modified clicks (new tab, etc.) and anything with a
 * target behave exactly like a normal link.
 */
export function TransitionLink({
  to,
  label,
  onClick,
  target,
  ...rest
}: LinkProps & {
  to: string;
  /** Title shown in the page wipe. Defaults to the nav label for the path. */
  label?: string;
}) {
  const go = useTransitionNavigate();
  return (
    <Link
      to={to}
      target={target}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          target ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        go(to, label);
      }}
      {...rest}
    />
  );
}
