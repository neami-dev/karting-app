"use client";

import { useEffect, useState } from "react";
import { SlotGridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { getAvailability } from "@/lib/services/availability";
import { formatDateLong, cx } from "@/lib/format";
import type {
  DayAvailability,
  Experience,
  Location,
  ServiceError,
} from "@/lib/types";

export function StepTime({
  location,
  experience,
  date,
  value,
  onChange,
  onChangeDate,
  participantCount,
}: {
  location: Location;
  experience: Experience;
  date: string;
  value: string | null;
  onChange: (time: string) => void;
  onChangeDate: () => void;
  participantCount: number;
}) {
  const [day, setDay] = useState<DayAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ServiceError | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getAvailability(location.id, experience.id, date).then((result) => {
      if (cancelled) return;
      if (result.ok) setDay(result.data);
      else setError(result.error);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [location.id, experience.id, date, retry]);

  return (
    <fieldset>
      <legend className="t-display-md text-ink">Choose a time.</legend>
      <p className="t-body-md mt-xxs text-body">
        {formatDateLong(date)} at {location.name}.
      </p>

      <div className="mt-md" aria-busy={loading || undefined}>
        {loading && <SlotGridSkeleton />}

        {!loading && error && (
          <ErrorState
            title="We couldn't load the schedule"
            message={error.message}
            action={
              <Button size="sm" variant="outline" onClick={() => setRetry((r) => r + 1)}>
                Try again
              </Button>
            }
          />
        )}

        {!loading && !error && day && !day.isOpen && (
          <EmptyState
            title="No sessions on this date"
            message={
              day.closedReason ??
              "There are no sessions scheduled here. Pick another date and we'll show you what's running."
            }
            action={
              <Button size="sm" variant="outline" onClick={onChangeDate}>
                Choose another date
              </Button>
            }
          />
        )}

        {!loading && !error && day?.isOpen && (
          <>
            <div className="grid grid-cols-2 gap-xxs sm:grid-cols-3 lg:grid-cols-4">
              {day.slots.map((slot) => {
                const isSelected = value === slot.time;
                const soldOut = slot.status === "sold_out";
                const tooSmall =
                  !soldOut && participantCount > slot.spotsAvailable;
                const disabled = soldOut || tooSmall;

                return (
                  <label
                    key={slot.time}
                    className={cx(
                      "flex flex-col items-start border p-xs transition-colors duration-150",
                      disabled
                        ? "cursor-not-allowed border-hairline/50 opacity-50"
                        : "cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary text-on-primary"
                        : !disabled && "border-hairline hover:border-ink/40"
                    )}
                  >
                    <input
                      type="radio"
                      name="booking-time"
                      value={slot.time}
                      checked={isSelected}
                      disabled={disabled}
                      onChange={() => onChange(slot.time)}
                      className="sr-only"
                    />

                    <span
                      className={cx(
                        "tabular text-lg font-medium",
                        isSelected ? "text-on-primary" : "text-ink"
                      )}
                    >
                      {slot.time}
                    </span>

                    <span
                      className={cx(
                        "t-caption mt-xxxs",
                        isSelected
                          ? "text-on-primary/80"
                          : soldOut
                            ? "text-muted-soft"
                            : slot.status === "limited"
                              ? "text-warning"
                              : "text-body"
                      )}
                    >
                      {soldOut
                        ? "Sold out"
                        : tooSmall
                          ? `Only ${slot.spotsAvailable} left`
                          : `${slot.spotsAvailable} spot${slot.spotsAvailable === 1 ? "" : "s"} available`}
                    </span>
                  </label>
                );
              })}
            </div>

            {day.slots.every((s) => s.status === "sold_out") && (
              <div className="mt-sm">
                <EmptyState
                  title="Every session is booked out"
                  message="This date is completely full. Sessions usually free up on the day, but another date is your safest bet."
                  action={
                    <Button size="sm" variant="outline" onClick={onChangeDate}>
                      Choose another date
                    </Button>
                  }
                />
              </div>
            )}

            {participantCount > 0 &&
              day.slots.some(
                (s) =>
                  s.status !== "sold_out" && participantCount > s.spotsAvailable
              ) && (
                <p className="t-caption mt-xs text-muted-soft">
                  Greyed-out slots don&apos;t have room for {participantCount}{" "}
                  racers. Reduce your group or pick a quieter time.
                </p>
              )}
          </>
        )}
      </div>
    </fieldset>
  );
}
