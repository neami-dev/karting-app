"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toDateKey } from "@/lib/availability/engine";
import { cx } from "@/lib/format";

/**
 * Accessible date picker built on the WAI-ARIA grid pattern.
 *
 * Arrow keys move by day, PageUp/PageDown by month, Home/End to the ends of the
 * week. Only one cell is in the tab order at a time (roving tabindex), so a
 * keyboard user tabs past the whole grid in one step rather than 35.
 */

interface CalendarProps {
  value: string | null;
  onChange: (dateKey: string) => void;
  month: Date;
  onMonthChange: (next: Date) => void;
  /** dateKey → selectable. Missing entries are treated as unavailable. */
  availability: Record<string, { isOpen: boolean; hasCapacity: boolean }>;
  loading?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Monday-first grid offset. */
function leadingBlanks(d: Date) {
  return (startOfMonth(d).getDay() + 6) % 7;
}

export function Calendar({
  value,
  onChange,
  month,
  onMonthChange,
  availability,
  loading,
  minDate,
  maxDate,
}: CalendarProps) {
  const [focusedKey, setFocusedKey] = useState<string | null>(value);
  const gridRef = useRef<HTMLDivElement>(null);
  const shouldFocus = useRef(false);

  const days = useMemo(() => {
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(month.getFullYear(), month.getMonth(), i + 1);
      return { date, key: toDateKey(date) };
    });
  }, [month]);

  const isSelectable = (key: string, date: Date) => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    const entry = availability[key];
    return Boolean(entry?.isOpen && entry.hasCapacity);
  };

  // First selectable day is the roving-tabindex anchor when nothing is chosen.
  const anchorKey =
    (value && days.some((d) => d.key === value) ? value : null) ??
    focusedKey ??
    days.find((d) => isSelectable(d.key, d.date))?.key ??
    days[0]?.key ??
    null;

  useEffect(() => {
    if (!shouldFocus.current || !focusedKey) return;
    shouldFocus.current = false;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-day="${focusedKey}"]`)
      ?.focus();
  }, [focusedKey, month]);

  const moveFocus = (from: string, deltaDays: number) => {
    const [y, m, d] = from.split("-").map(Number);
    const next = new Date(y, m - 1, d + deltaDays);
    if (minDate && next < minDate) return;
    if (maxDate && next > maxDate) return;

    shouldFocus.current = true;
    setFocusedKey(toDateKey(next));
    if (
      next.getMonth() !== month.getMonth() ||
      next.getFullYear() !== month.getFullYear()
    ) {
      onMonthChange(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent, key: string) => {
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };

    if (moves[e.key] !== undefined) {
      e.preventDefault();
      moveFocus(key, moves[e.key]);
      return;
    }

    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const [y, m, d] = key.split("-").map(Number);
      const weekday = (new Date(y, m - 1, d).getDay() + 6) % 7;
      moveFocus(key, e.key === "Home" ? -weekday : 6 - weekday);
      return;
    }

    if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const delta = e.key === "PageUp" ? -1 : 1;
      const next = new Date(month.getFullYear(), month.getMonth() + delta, 1);
      onMonthChange(next);
      shouldFocus.current = true;
      setFocusedKey(toDateKey(next));
    }
  };

  const monthLabel = month.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const canGoBack =
    !minDate ||
    new Date(month.getFullYear(), month.getMonth(), 0) >= startOfMonth(minDate);
  const canGoForward =
    !maxDate || startOfMonth(month) < startOfMonth(maxDate);

  const navBtn =
    "flex h-12 w-12 items-center justify-center border border-hairline text-ink " +
    "transition-colors hover:border-ink/50 disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div className="border border-hairline">
      <div className="flex items-center justify-between gap-xs border-b border-hairline p-xs">
        <button
          type="button"
          className={navBtn}
          onClick={() =>
            onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
          disabled={!canGoBack}
          aria-label="Previous month"
        >
          <span aria-hidden="true">←</span>
        </button>

        <p className="t-title-sm text-ink" aria-live="polite">
          {monthLabel}
        </p>

        <button
          type="button"
          className={navBtn}
          onClick={() =>
            onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
          disabled={!canGoForward}
          aria-label="Next month"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={`Available dates in ${monthLabel}`}
        aria-busy={loading || undefined}
        className={cx("p-xs transition-opacity", loading && "opacity-50")}
      >
        <div role="row" className="grid grid-cols-7">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              role="columnheader"
              aria-label={d}
              className="t-caption-upper flex h-8 items-center justify-center text-muted-soft"
            >
              <span aria-hidden="true">{d.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        <div role="rowgroup" className="grid grid-cols-7 gap-px">
          {Array.from({ length: leadingBlanks(month) }).map((_, i) => (
            <div key={`blank-${i}`} role="gridcell" aria-hidden="true" />
          ))}

          {days.map(({ date, key }) => {
            const selectable = isSelectable(key, date);
            const selected = value === key;
            const isToday = key === toDateKey(new Date());

            return (
              <div key={key} role="gridcell" aria-selected={selected}>
                <button
                  type="button"
                  data-day={key}
                  tabIndex={key === anchorKey ? 0 : -1}
                  disabled={!selectable}
                  onClick={() => {
                    setFocusedKey(key);
                    onChange(key);
                  }}
                  onKeyDown={(e) => onKeyDown(e, key)}
                  aria-label={`${date.toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}${selectable ? "" : " — unavailable"}`}
                  aria-current={isToday ? "date" : undefined}
                  className={cx(
                    "tabular relative flex aspect-square w-full items-center justify-center text-sm transition-colors duration-150",
                    selected
                      ? "bg-primary font-semibold text-on-primary"
                      : selectable
                        ? "text-ink hover:bg-canvas-elevated"
                        : "cursor-not-allowed text-muted-soft line-through decoration-hairline"
                  )}
                >
                  {date.getDate()}
                  {isToday && !selected && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <p className="t-caption flex flex-wrap items-center gap-xs border-t border-hairline px-xs py-xxs text-muted-soft">
        <span className="flex items-center gap-xxxs">
          <span className="h-2 w-2 bg-primary" aria-hidden="true" /> Selected
        </span>
        <span className="flex items-center gap-xxxs">
          <span className="h-2 w-2 bg-canvas-elevated" aria-hidden="true" /> Available
        </span>
        <span className="flex items-center gap-xxxs text-muted-soft line-through">
          00
        </span>
        <span>Closed or fully booked</span>
      </p>
    </div>
  );
}
