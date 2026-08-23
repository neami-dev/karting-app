"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/booking/Calendar";
import { ErrorState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { getMonthAvailability } from "@/lib/services/availability";
import { BOOKING_WINDOW_DAYS } from "@/lib/availability/engine";
import type { Experience, Location, ServiceError } from "@/lib/types";

export function StepDate({
  location,
  experience,
  value,
  onChange,
}: {
  location: Location;
  experience: Experience;
  value: string | null;
  onChange: (date: string) => void;
}) {
  const [month, setMonth] = useState(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [availability, setAvailability] = useState<
    Record<string, { isOpen: boolean; hasCapacity: boolean }>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ServiceError | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getMonthAvailability(
      location.id,
      experience.id,
      month.getFullYear(),
      month.getMonth()
    ).then((result) => {
      if (cancelled) return;
      if (result.ok) setAvailability(result.data);
      else setError(result.error);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [location.id, experience.id, month, retry]);

  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const maxDate = new Date(minDate);
  maxDate.setDate(maxDate.getDate() + BOOKING_WINDOW_DAYS);

  return (
    <fieldset>
      <legend className="t-display-md text-ink">Pick a date.</legend>
      <p className="t-body-md mt-xxs text-body">
        {experience.name} at {location.city}. Bookings open{" "}
        {BOOKING_WINDOW_DAYS} days ahead.
      </p>

      <div className="mt-md max-w-md">
        {error ? (
          <ErrorState
            title="We couldn't load the calendar"
            message={error.message}
            action={
              <Button size="sm" variant="outline" onClick={() => setRetry((r) => r + 1)}>
                Try again
              </Button>
            }
          />
        ) : (
          <Calendar
            value={value}
            onChange={onChange}
            month={month}
            onMonthChange={setMonth}
            availability={availability}
            loading={loading}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
      </div>
    </fieldset>
  );
}
