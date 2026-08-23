"use client";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { startingPrice } from "@/lib/pricing/engine";
import { formatDuration, formatPrice, cx } from "@/lib/format";
import { eligibilityLabel } from "@/components/experiences/ExperienceCard";
import type { Experience, Location } from "@/lib/types";

export function StepExperience({
  experiences,
  location,
  selected,
  onSelect,
  onBack,
}: {
  experiences: Experience[];
  location: Location | null;
  selected: string | null;
  onSelect: (slug: string) => void;
  onBack: () => void;
}) {
  // Enquiry-only formats are routed to the events page rather than booked here.
  const bookable = experiences.filter((e) => e.bookingMode === "instant");

  if (bookable.length === 0) {
    return (
      <EmptyState
        title="No bookable sessions at this circuit"
        message={`${location?.name ?? "This circuit"} isn't running online bookings right now. Choose another circuit, or message us and we'll arrange it directly.`}
        action={
          <button type="button" onClick={onBack} className="t-button text-primary">
            ← Choose another circuit
          </button>
        }
      />
    );
  }

  return (
    <fieldset>
      <legend className="t-display-md text-ink">What are you racing?</legend>
      <p className="t-body-md mt-xxs text-body">
        {location
          ? `Formats available at ${location.name}.`
          : "Choose the format that fits your group."}
      </p>

      <div className="mt-md grid gap-xs md:grid-cols-2">
        {bookable.map((experience) => {
          const isSelected = selected === experience.slug;
          const price = startingPrice(experience.id, location?.id);

          return (
            <label
              key={experience.id}
              className={cx(
                "flex cursor-pointer flex-col border p-sm transition-colors duration-200",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-hairline hover:border-ink/30"
              )}
            >
              <input
                type="radio"
                name="booking-experience"
                value={experience.slug}
                checked={isSelected}
                onChange={() => onSelect(experience.slug)}
                className="sr-only"
              />

              <div className="flex items-start justify-between gap-xs">
                <p className="t-title-md text-ink">{experience.name}</p>
                <span className="t-title-sm tabular shrink-0 text-ink">
                  {price !== null ? `from ${formatPrice(price)}` : "—"}
                </span>
              </div>

              <p className="t-body-md mt-xxs flex-1 text-body">{experience.summary}</p>

              <div className="mt-sm flex flex-wrap gap-xxxs">
                <Badge tone={isSelected ? "primary" : "default"}>
                  {formatDuration(experience.durationMin)}
                </Badge>
                <Badge tone="outline">{eligibilityLabel(experience)}</Badge>
                {experience.minParticipants > 1 && (
                  <Badge tone="outline">Min {experience.minParticipants} racers</Badge>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
