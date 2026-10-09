import { TransitionLink } from "~/components/motion/TransitionLink";
import { cn } from "~/lib/cn";

type Variant = "accent" | "ghost" | "quiet";

const base =
  "group/btn meta relative inline-flex min-h-11 items-center justify-center gap-2.5 rounded-sm px-5 py-3 " +
  "transition-[background-color,color,border-color] duration-300 ease-out-3 select-none";

const variants: Record<Variant, string> = {
  accent: "bg-accent text-accent-ink hover:bg-paper",
  ghost: "border border-line-strong text-paper hover:border-paper hover:bg-paper hover:text-ink",
  quiet: "px-0 text-paper hover:text-accent",
};

type Common = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

type AsLink = Common & { to: string; href?: never } & Omit<
    React.ComponentProps<typeof TransitionLink>,
    "to" | "className" | "children"
  >;
type AsAnchor = Common & { href: string; to?: never; external?: boolean } & Omit<
    React.ComponentProps<"a">,
    "href" | "className" | "children"
  >;
type AsButton = Common & { to?: never; href?: never } & Omit<
    React.ComponentProps<"button">,
    "className" | "children"
  >;

export type ButtonProps = AsLink | AsAnchor | AsButton;

function Inner({ children, icon }: Pick<Common, "children" | "icon">) {
  return (
    <>
      <span>{children}</span>
      {icon && (
        <span
          aria-hidden="true"
          className="inline-flex transition-transform duration-300 ease-out-3 group-hover/btn:translate-x-0.5 [&>svg]:size-3.5"
        >
          {icon}
        </span>
      )}
    </>
  );
}

/** Button, internal link or external link with one look. Always ≥ 44px tall. */
export function Button(props: ButtonProps) {
  const { variant = "accent", className, children, icon } = props;
  const classes = cn(base, variants[variant], className);

  if (props.to !== undefined) {
    const { variant: _v, className: _c, children: _ch, icon: _i, ...rest } = props;
    return (
      <TransitionLink {...rest} to={props.to} className={classes}>
        <Inner icon={icon}>{children}</Inner>
      </TransitionLink>
    );
  }
  if (props.href !== undefined) {
    const { variant: _v, className: _c, children: _ch, icon: _i, external, ...rest } = props;
    const ext = external ?? /^https?:\/\//.test(props.href);
    return (
      <a
        {...rest}
        className={classes}
        {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <Inner icon={icon}>{children}</Inner>
        {ext && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  const { variant: _v, className: _c, children: _ch, icon: _i, ...rest } = props;
  return (
    <button type="button" {...rest} className={classes}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}
