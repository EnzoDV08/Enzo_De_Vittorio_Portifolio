import { showTodos } from "~/components/ui/TodoMark";
import { work } from "~/content/pages";
import { isTodo } from "~/content/todo";
import type { Project } from "~/content/types";
import { cn } from "~/lib/cn";
import { yearText } from "~/lib/project";

type Dated = Pick<Project, "year" | "yearLabel">;

/** The project's year. An unconfirmed year reads "Year TBC" in dev and is left out in production. */
export function ProjectYear({ project, className }: { project: Dated; className?: string }) {
  const text = yearText(project);
  if (text) return <span className={cn("tabular-nums", className)}>{text}</span>;
  if (!showTodos) return null;
  return (
    <span
      title={isTodo(project.year) ? project.year : undefined}
      className={cn("border-b border-dashed border-current", className)}
    >
      {work.yearTbc}
    </span>
  );
}
