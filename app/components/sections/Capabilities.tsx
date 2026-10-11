import {
  ArrowRight,
  Check,
  Clapperboard,
  Database,
  MonitorSmartphone,
  PenTool,
  Plus,
  Webhook,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { TagList } from "~/components/ui/Tag";
import type { capabilities } from "~/content/capabilities";
import { home } from "~/content/pages";
import { cn } from "~/lib/cn";
import { indexLabel } from "~/lib/project";
import { FINE_POINTER, useMediaQuery } from "~/lib/useMediaQuery";

/** A panel as the home loader sends it (see capabilityPanels in lib/content.server). */
export type Panel = Omit<(typeof capabilities)[number], "steps"> & { steps: readonly string[] | null };

const icons: Record<string, LucideIcon> = {
  interfaces: MonitorSmartphone,
  apis: Webhook,
  data: Database,
  pipelines: Workflow,
  design: PenTool,
  direct: Clapperboard,
};

/** How long the pointer rests on a strip before it opens, so sweeping across doesn't flicker. */
const HOVER_DELAY = 140;

/**
 * What I do as an accordion, after Stack Studio's "What do you need?": from xl, one open panel
 * beside narrow strips with vertical labels, opened by click or (with a mouse) by hovering;
 * below that, a stacked accordion. Every panel's content is in the prerendered HTML (closed
 * ones are `hidden`), so nothing depends on JS.
 */
export function Capabilities({ panels }: { panels: Panel[] }) {
  const [open, setOpen] = useState(0);
  const id = useId();
  // From xl one panel always stays open (the row needs one); below it, panels can all close.
  const wide = useMediaQuery("(min-width: 80rem)");
  const fine = useMediaQuery(FINE_POINTER);
  const active = wide && open < 0 ? 0 : open;
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const hoverOpen = (i: number) => {
    if (!wide || !fine) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(i), HOVER_DELAY);
  };

  return (
    <ul
      className="flex flex-col overflow-clip rounded-lg border border-line-strong xl:h-[31rem] xl:flex-row"
      onPointerLeave={() => window.clearTimeout(timer.current)}
    >
      {panels.map((panel, i) => {
        const isOpen = i === active;
        const Icon = icons[panel.icon] ?? MonitorSmartphone;
        const region = `${id}-panel-${i}`;
        return (
          <li
            key={panel.title}
            onPointerEnter={() => hoverOpen(i)}
            className={cn(
              "group/panel relative flex min-w-0 flex-col overflow-clip border-line-strong transition-colors duration-300 xl:basis-[4.75rem] xl:flex-row xl:transition-[flex-grow,background-color] xl:duration-700 xl:ease-out-expo",
              i > 0 && "border-t xl:border-t-0 xl:border-l",
              isOpen ? "bg-surface xl:grow" : "fine:hover:bg-bg-2 xl:grow-0",
            )}
          >
            {/* Accent edge: full on the open panel, grows in on hover. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-0 left-0 h-[3px] w-full origin-left bg-accent transition-transform duration-500 ease-out-expo xl:h-full xl:w-[3px] xl:origin-top",
                isOpen
                  ? "scale-100"
                  : "scale-x-0 fine:group-hover/panel:scale-x-100 xl:scale-x-100 xl:scale-y-0 xl:fine:group-hover/panel:scale-y-100",
              )}
            />
            <h3 className="xl:h-full">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={region}
                onClick={() => setOpen(isOpen && !wide ? -1 : i)}
                className="flex w-full items-center gap-4 p-5 text-left sm:px-7 xl:h-full xl:w-[4.75rem] xl:flex-col xl:gap-5 xl:px-0 xl:py-7"
              >
                <span className="meta w-6 text-accent xl:w-auto">{indexLabel(i + 1)}</span>
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-300",
                    isOpen
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-fg/45 text-fg fine:group-hover/panel:-rotate-12 fine:group-hover/panel:border-accent fine:group-hover/panel:text-accent",
                  )}
                >
                  <Icon className="size-[1.1rem]" strokeWidth={2.25} aria-hidden />
                </span>
                <span
                  className={cn(
                    "display text-xl transition-colors duration-300 xl:mt-auto xl:rotate-180 xl:text-[1.75rem] xl:whitespace-nowrap xl:[writing-mode:vertical-rl]",
                    isOpen ? "text-fg" : "text-fg/50 fine:group-hover/panel:text-fg",
                  )}
                >
                  {panel.title}
                </span>
                <Plus
                  aria-hidden
                  className={cn(
                    "ml-auto size-5 shrink-0 transition-transform duration-300 xl:hidden",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
            </h3>
            <div
              id={region}
              role="region"
              aria-label={panel.title}
              hidden={!isOpen}
              className="min-w-0 flex-1 px-5 pb-7 sm:px-7 xl:py-7 xl:pr-8 xl:pl-2"
            >
              <PanelBody panel={panel} Icon={Icon} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function PanelBody({ panel, Icon }: { panel: Panel; Icon: LucideIcon }) {
  const { whatIDo } = home;
  return (
    <div className="relative flex h-full flex-col motion-safe:animate-fade-up xl:min-w-[36rem] [animation-delay:120ms]">
      <Icon
        aria-hidden
        strokeWidth={1.25}
        className="pointer-events-none absolute -top-1 right-0 hidden size-28 text-accent/50 xl:block"
      />
      <p className="display max-w-[16ch] text-[clamp(1.75rem,1.3rem+1.4vw,2.6rem)] leading-[1.02] xl:pr-32">
        {panel.headline}
      </p>
      <p className="mt-3 max-w-[52ch] text-muted xl:pr-32">{panel.body}</p>

      <p className="mt-8 meta text-muted xl:mt-auto xl:pt-4">{whatIDo.practice}</p>
      <dl className="mt-3 grid border-t border-line-strong xl:grid-cols-2 xl:gap-x-10">
        {panel.rows.map((row) => (
          <div
            key={row.label}
            className="group/row flex items-baseline justify-between gap-6 border-b border-line py-2.5 text-sm"
          >
            <dt className="font-semibold transition-transform duration-300 fine:group-hover/row:translate-x-1">
              {row.label}
            </dt>
            <dd className="text-right text-muted transition-colors duration-300 fine:group-hover/row:text-fg">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {panel.steps ? (
        <Pipeline steps={panel.steps} label={whatIDo.pipelineLabel} />
      ) : (
        <TagList items={panel.tags} className="mt-5" />
      )}
    </div>
  );
}

/** The real CI run, step by step, as a flow. */
function Pipeline({ steps, label }: { steps: readonly string[]; label: string }) {
  return (
    <div className="mt-5">
      <p className="sr-only">{label}</p>
      <ol className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong py-1 pr-3 pl-1 font-mono text-xs">
              <span className="grid size-4 place-items-center rounded-full bg-accent text-accent-fg">
                <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
              </span>
              {step}
            </span>
            {i < steps.length - 1 && <ArrowRight className="size-3.5 text-muted" aria-hidden />}
          </li>
        ))}
      </ol>
    </div>
  );
}
