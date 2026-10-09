import { work } from "~/content/pages";
import { isTodo } from "~/content/todo";
import type { Project } from "~/content/types";

type Dated = Pick<Project, "year" | "yearLabel">;
import { cn } from "~/lib/cn";
import { yearText } from "~/lib/project";

/** The project's year in mono. An unconfirmed year reads "Year TBC" with the TODO on hover. */
export function ProjectYear({ project, className }: { project: Dated; className?: string }) {
  const text = yearText(project);
  if (text) return <span className={cn("tabular-nums", className)}>{text}</span>;
  return (
    <span
      title={isTodo(project.year) ? project.year : undefined}
      className={cn("border-b border-dashed border-accent/70 text-accent", className)}
    >
      {work.yearTbc}
    </span>
  );
}
