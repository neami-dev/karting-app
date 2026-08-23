"use client";

import { cx } from "@/lib/format";

/**
 * Quantity stepper. Large touch targets (48px) because this is the control that
 * gets used most on a phone, and a live region so screen readers hear the count
 * change rather than having to hunt for it.
 */
export function QuantityStepper({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 99,
  disabled,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  const btn =
    "flex h-12 w-12 shrink-0 items-center justify-center border border-hairline text-ink " +
    "text-xl leading-none transition-colors duration-150 hover:border-ink/50 hover:bg-canvas-elevated " +
    "disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div
      className={cx(
        "flex items-center justify-between gap-xs border-b border-hairline py-xs last:border-0",
        disabled && "opacity-50"
      )}
    >
      <div className="min-w-0">
        <p className="t-title-sm text-ink">{label}</p>
        {hint && <p className="t-caption mt-0.5 text-muted">{hint}</p>}
      </div>

      <div className="flex items-center gap-xxs">
        <button
          type="button"
          onClick={dec}
          disabled={disabled || value <= min}
          className={btn}
          aria-label={`Remove one ${label}`}
        >
          <span aria-hidden="true">−</span>
        </button>

        <span
          className="tabular w-10 text-center text-lg font-medium text-ink"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">{label}: </span>
          {value}
        </span>

        <button
          type="button"
          onClick={inc}
          disabled={disabled || value >= max}
          className={btn}
          aria-label={`Add one ${label}`}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}
