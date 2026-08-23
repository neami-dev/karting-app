"use client";

import { STEPS } from "@/components/booking/state";
import { cx } from "@/lib/format";

/** Progress rail. Completed steps are clickable so going back is one tap. */
export function StepNav({
  current,
  furthest,
  onGoto,
}: {
  current: number;
  furthest: number;
  onGoto: (step: number) => void;
}) {
  return (
    <nav aria-label="Booking progress">
      <ol className="flex flex-wrap items-center gap-x-xs gap-y-xxs">
        {STEPS.map((step, i) => {
          const isCurrent = i === current;
          const reachable = i <= furthest;
          const isDone = i < current && reachable;

          return (
            <li key={step.id} className="flex items-center gap-x-xs">
              <button
                type="button"
                disabled={!reachable || isCurrent}
                onClick={() => onGoto(i)}
                aria-current={isCurrent ? "step" : undefined}
                className={cx(
                  "t-caption-upper flex items-center gap-xxs py-xxs transition-colors duration-150",
                  isCurrent
                    ? "text-ink"
                    : isDone
                      ? "text-body hover:text-ink"
                      : "cursor-default text-muted-soft"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "flex h-6 w-6 items-center justify-center border text-[10px]",
                    isCurrent
                      ? "border-primary bg-primary text-on-primary"
                      : isDone
                        ? "border-ink/40 text-ink"
                        : "border-hairline text-muted-soft"
                  )}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sr-only sm:hidden">{step.label}</span>
              </button>

              {i < STEPS.length - 1 && (
                <span aria-hidden="true" className="h-px w-4 bg-hairline sm:w-6" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
