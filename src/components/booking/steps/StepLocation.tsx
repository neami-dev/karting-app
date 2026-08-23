"use client";

import { TrackVisual } from "@/components/visuals/TrackVisual";
import { cx } from "@/lib/format";
import type { Location, VisualSeed } from "@/lib/types";

const SEEDS: VisualSeed[] = ["night-track", "chicane", "aerial"];

export function StepLocation({
  locations,
  selected,
  onSelect,
}: {
  locations: Location[];
  selected: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <fieldset>
      <legend className="t-display-md text-ink">Where do you want to race?</legend>
      <p className="t-body-md mt-xxs text-body">
        Each circuit runs its own layout, fleet and schedule.
      </p>

      <div className="mt-md grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((location, i) => {
          const isSelected = selected === location.slug;
          const track = location.tracks[0];

          return (
            <label
              key={location.id}
              className={cx(
                "group relative flex cursor-pointer flex-col border transition-colors duration-200",
                isSelected ? "border-primary" : "border-hairline hover:border-ink/30"
              )}
            >
              <input
                type="radio"
                name="booking-location"
                value={location.slug}
                checked={isSelected}
                onChange={() => onSelect(location.slug)}
                className="sr-only"
              />

              <div className="relative aspect-[16/9] overflow-hidden">
                <TrackVisual
                  seed={SEEDS[i % SEEDS.length]}
                  overlay="bottom"
                  className="h-full w-full"
                />
                {isSelected && (
                  <span className="t-caption-upper absolute right-xs top-xs bg-primary px-xs py-xxxs text-on-primary">
                    Selected
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-sm">
                <p className="t-title-md text-ink">{location.city}</p>
                <p className="t-body-sm mt-xxxs flex-1 text-body">{location.tagline}</p>
                <p className="t-caption tabular mt-xs border-t border-hairline pt-xs text-muted">
                  {track.lengthM} m · {track.turns} corners ·{" "}
                  {location.tracks.length > 1 ? "2 circuits" : "1 circuit"}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
