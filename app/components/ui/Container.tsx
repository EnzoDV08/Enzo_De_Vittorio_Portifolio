import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "~/lib/cn";

type Props<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

/** 1600px max width with fluid gutters. */
export function Container<T extends ElementType = "div">({ as, className, ...rest }: Props<T>) {
  const Tag = as ?? "div";
  return <Tag className={cn("container-site", className)} {...rest} />;
}
