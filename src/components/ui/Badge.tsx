import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/**
 * The only place pill geometry is used in the whole system — per the design
 * system's "pill is reserved for badge labels only" rule.
 */
export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "primary" | "success" | "warning" | "outline" | "light";
  className?: string;
}) {
  const tones = {
    default: "bg-canvas-elevated text-ink",
    primary: "bg-primary text-on-primary",
    success: "bg-success/15 text-success border border-success/30",
    warning: "bg-warning/15 text-warning border border-warning/30",
    outline: "bg-transparent text-body border border-hairline",
    light: "bg-surface-strong-light text-body-on-light",
  } as const;

  return (
    <span
      className={cx(
        "t-caption-upper inline-flex items-center rounded-full px-xs py-xxxs whitespace-nowrap",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Small uppercase section label — used above nearly every section heading. */
export function SectionLabel({
  children,
  className,
  tone = "dark",
}: {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={cx(
        "t-caption-upper flex items-center gap-xxs",
        tone === "dark" ? "text-muted-soft" : "text-muted",
        className
      )}
    >
      <span className="h-px w-6 bg-primary" aria-hidden="true" />
      {children}
    </p>
  );
}
