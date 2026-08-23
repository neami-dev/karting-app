import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/**
 * Error and empty states. Every one takes a specific message — the system has no
 * "Something went wrong" fallback by design.
 */

export function ErrorState({
  title,
  message,
  action,
  tone = "warning",
  className,
}: {
  title: string;
  message: string;
  action?: ReactNode;
  tone?: "warning" | "info";
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cx(
        "border p-sm md:p-md",
        tone === "warning"
          ? "border-warning/40 bg-warning/8"
          : "border-info/40 bg-info/8",
        className
      )}
    >
      <p
        className={cx(
          "t-title-md",
          tone === "warning" ? "text-warning" : "text-info"
        )}
      >
        {title}
      </p>
      <p className="t-body-md mt-xxs text-body">{message}</p>
      {action && <div className="mt-xs flex flex-wrap gap-xxs">{action}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
  className,
}: {
  title: string;
  message: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex flex-col items-center border border-dashed border-hairline px-sm py-xl text-center",
        className
      )}
    >
      <span className="mb-xs text-2xl text-muted" aria-hidden="true">
        ⚑
      </span>
      <p className="t-title-md text-ink">{title}</p>
      <p className="t-body-md mt-xxs max-w-sm text-body">{message}</p>
      {action && <div className="mt-sm flex flex-wrap justify-center gap-xxs">{action}</div>}
    </div>
  );
}

/** Marks data the operator still has to confirm — honesty over invention. */
export function PlaceholderNote({ children }: { children: ReactNode }) {
  return (
    <p className="t-caption border-l-2 border-info/50 pl-xs text-muted">
      {children}
    </p>
  );
}
