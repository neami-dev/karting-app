"use client";

import { formatDateLong, formatDuration, formatPrice, cx } from "@/lib/format";
import type { Experience, Location, Quote } from "@/lib/types";

/**
 * Live booking summary. Everything the customer has chosen so far, with the
 * total recalculating on every change. Empty rows show a prompt rather than
 * disappearing, so the panel never jumps in height as it fills in.
 */

function Row({
  label,
  value,
  pending,
}: {
  label: string;
  value?: string | null;
  pending: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-xs border-b border-hairline py-xs last:border-0">
      <dt className="t-caption-upper shrink-0 text-muted">{label}</dt>
      <dd
        className={cx(
          "t-body-md text-right",
          value ? "text-ink" : "text-muted italic"
        )}
      >
        {value ?? pending}
      </dd>
    </div>
  );
}

export function BookingSummary({
  location,
  experience,
  date,
  timeSlot,
  quote,
  participantCount,
  className,
  compact,
}: {
  location: Location | null;
  experience: Experience | null;
  date: string | null;
  timeSlot: string | null;
  quote: Quote | null;
  participantCount: number;
  className?: string;
  compact?: boolean;
}) {
  const hasPricing = quote && quote.lines.length > 0;

  return (
    <section
      aria-labelledby="summary-heading"
      className={cx("border border-hairline bg-canvas-elevated", className)}
    >
      <div className="border-b border-hairline p-sm">
        <h2 id="summary-heading" className="t-caption-upper flex items-center gap-xxs text-ink">
          <span className="h-px w-6 bg-primary" aria-hidden="true" />
          Your booking
        </h2>
      </div>

      <dl className="px-sm">
        <Row label="Circuit" value={location?.name} pending="Not chosen yet" />
        <Row
          label="Experience"
          value={
            experience
              ? `${experience.name} · ${formatDuration(experience.durationMin)}`
              : null
          }
          pending="Not chosen yet"
        />
        <Row
          label="Date"
          value={date ? formatDateLong(date) : null}
          pending="Not chosen yet"
        />
        <Row label="Time" value={timeSlot} pending="Not chosen yet" />
        <Row
          label="Racers"
          value={
            participantCount > 0
              ? `${participantCount} ${participantCount === 1 ? "racer" : "racers"}`
              : null
          }
          pending="None added"
        />
      </dl>

      {/* Price breakdown — announced politely so the total isn't silently changed */}
      <div
        className="border-t border-hairline p-sm"
        aria-live="polite"
        aria-atomic="true"
      >
        {hasPricing ? (
          <>
            <ul className="flex flex-col gap-xxs">
              {quote.lines.map((line) => (
                <li
                  key={`${line.categoryLabel}-${line.unitPrice}`}
                  className="flex items-baseline justify-between gap-xs"
                >
                  <span className="t-body-md text-body">
                    {line.quantity} × {line.categoryLabel}
                  </span>
                  <span className="t-body-md tabular text-ink">
                    {formatPrice(line.total)}
                  </span>
                </li>
              ))}

              {quote.addOnLines.map((line) => (
                <li
                  key={line.categoryLabel}
                  className="flex items-baseline justify-between gap-xs"
                >
                  <span className="t-body-md text-body">
                    {line.quantity > 1 ? `${line.quantity} × ` : ""}
                    {line.categoryLabel}
                  </span>
                  <span className="t-body-md tabular text-ink">
                    {formatPrice(line.total)}
                  </span>
                </li>
              ))}

              {quote.discount > 0 && (
                <li className="flex items-baseline justify-between gap-xs text-success">
                  <span className="t-body-md">{quote.discountLabel}</span>
                  <span className="t-body-md tabular">
                    −{formatPrice(quote.discount)}
                  </span>
                </li>
              )}
            </ul>

            <div className="mt-sm flex items-baseline justify-between gap-xs border-t border-hairline pt-sm">
              <span className="t-caption-upper text-muted">Total</span>
              <span className="tabular text-[26px] font-medium leading-none text-ink">
                {formatPrice(quote.total)}
              </span>
            </div>

            {!compact && (
              <p className="t-caption mt-xs text-muted">
                Payment is taken at the circuit. Booking online reserves your karts
                — your card is not charged now.
              </p>
            )}
          </>
        ) : (
          <p className="t-body-md text-muted">
            Add your racers&apos; ages and heights and the price appears here,
            broken down per racer.
          </p>
        )}
      </div>
    </section>
  );
}
