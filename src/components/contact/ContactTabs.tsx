"use client";

import { useState } from "react";
import { LocationContactPanel } from "@/components/locations/LocationContactPanel";
import { useLocations } from "@/components/locations/LocationContext";
import { cx } from "@/lib/format";

/** Circuit picker for the contact page — one panel at a time. */
export function ContactTabs() {
  const { locations, selectedSlug, select } = useLocations();
  const active =
    locations.find((l) => l.slug === selectedSlug) ?? locations[0];
  const [announced, setAnnounced] = useState(active.city);

  return (
    <div>
      <div role="tablist" aria-label="Choose a circuit" className="flex flex-wrap gap-xxs">
        {locations.map((location) => {
          const isActive = location.slug === active.slug;
          return (
            <button
              key={location.slug}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls="contact-panel"
              onClick={() => {
                select(location.slug);
                setAnnounced(location.city);
              }}
              className={cx(
                "t-nav-link h-12 flex-1 border px-sm transition-colors duration-200 sm:flex-none",
                isActive
                  ? "border-primary bg-primary text-on-primary"
                  : "border-hairline text-ink hover:border-ink/50"
              )}
            >
              {location.city}
            </button>
          );
        })}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Showing contact details for {announced}
      </p>

      <div id="contact-panel" role="tabpanel" className="mt-md animate-fade">
        <LocationContactPanel location={active} />
      </div>
    </div>
  );
}
