import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/** Editorial band. Dark by default; light bands are the documented exception. */
export function Section({
  children,
  tone = "dark",
  className,
  id,
  size = "md",
}: {
  children: ReactNode;
  tone?: "dark" | "light" | "soft-light" | "elevated";
  className?: string;
  id?: string;
  size?: "sm" | "md" | "lg";
}) {
  const tones = {
    dark: "bg-canvas text-body",
    elevated: "bg-canvas-elevated text-body",
    light: "bg-canvas-light text-body-on-light",
    "soft-light": "bg-surface-soft-light text-body-on-light",
  } as const;

  const sizes = {
    sm: "py-lg md:py-xl",
    md: "py-xl md:py-xxl",
    lg: "py-xxl md:py-super",
  } as const;

  return (
    <section id={id} className={cx(tones[tone], sizes[size], className)}>
      {children}
    </section>
  );
}

export function Editorial({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx("editorial", className)}>{children}</div>;
}

/** Standard section header: label · display heading · optional lede. */
export function SectionHeading({
  label,
  title,
  lede,
  tone = "dark",
  align = "left",
  action,
  className,
  as: Tag = "h2",
}: {
  label?: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-sm md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center text-center",
        className
      )}
    >
      <div className={cx("max-w-2xl", align === "center" && "mx-auto")}>
        {label && (
          <p
            className={cx(
              "t-caption-upper mb-xs flex items-center gap-xxs",
              align === "center" && "justify-center",
              tone === "dark" ? "text-muted-soft" : "text-muted"
            )}
          >
            <span className="h-px w-6 bg-primary" aria-hidden="true" />
            {label}
          </p>
        )}
        <Tag
          className={cx(
            "t-display-lg text-balance",
            tone === "dark" ? "text-ink" : "text-body-on-light"
          )}
        >
          {title}
        </Tag>
        {lede && (
          <p
            className={cx(
              "t-body-md mt-xs max-w-[36rem] text-pretty",
              tone === "dark" ? "text-body" : "text-muted"
            )}
          >
            {lede}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
