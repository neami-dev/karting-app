"use client";

import { useLocations } from "@/components/locations/LocationContext";
import { cx } from "@/lib/format";

/** Compact circuit picker used in the nav and the hero. */
export function LocationSelect({
  className,
  id = "location-select",
  label = "Circuit",
  tone = "dark",
}: {
  className?: string;
  id?: string;
  label?: string;
  tone?: "dark" | "light";
}) {
  const { locations, selectedSlug, select, ready } = useLocations();

  return (
    <div className={cx("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={selectedSlug ?? ""}
        onChange={(e) => select(e.target.value)}
        className={cx(
          "t-nav-link h-12 w-full appearance-none rounded-none border bg-transparent pl-xs pr-9",
          "cursor-pointer transition-colors duration-150",
          tone === "dark"
            ? "border-hairline text-ink hover:border-ink/50"
            : "border-hairline-on-light text-body-on-light hover:border-body-on-light"
        )}
      >
        <option value="" disabled={ready && Boolean(selectedSlug)}>
          Choose your circuit
        </option>
        {locations.map((l) => (
          <option key={l.slug} value={l.slug} className="bg-canvas text-ink">
            {l.city}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute right-xs top-1/2 -translate-y-1/2",
          tone === "dark" ? "text-muted-soft" : "text-muted"
        )}
      >
        ▾
      </span>
    </div>
  );
}
