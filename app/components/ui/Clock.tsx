import { useEffect, useState } from "react";

type Props = { place: string; timeZone: string; zone: string; className?: string };

function format(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
}

/** "CENTURION, ZA — 14:32 SAST". Prerendered as --:-- and filled in on the client. */
export function Clock({ place, timeZone, zone, className }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let interval: number | undefined;
    const tick = () => setNow(new Date());
    tick();
    // Align updates to the turn of the minute.
    const timeout = window.setTimeout(
      () => {
        tick();
        interval = window.setInterval(tick, 60_000);
      },
      60_000 - (Date.now() % 60_000),
    );
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <p className={className}>
      <span>{place}</span>
      <span aria-hidden="true"> — </span>
      <time dateTime={now?.toISOString()} className="tabular-nums">
        {now ? format(now, timeZone) : "--:--"}
      </time>{" "}
      <abbr title="South African Standard Time" className="no-underline">
        {zone}
      </abbr>
    </p>
  );
}
