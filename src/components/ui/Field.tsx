"use client";

import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";
import { cx } from "@/lib/format";

/**
 * Form primitives with accessible validation baked in: every input is labelled,
 * errors are wired through aria-describedby and announced, and invalid fields
 * carry aria-invalid rather than relying on colour alone.
 */

interface FieldShellProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  children: (ids: { inputId: string; describedBy: string | undefined }) => ReactNode;
  className?: string;
}

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: FieldShellProps) {
  const base = useId();
  const inputId = `${base}-input`;
  const hintId = `${base}-hint`;
  const errorId = `${base}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cx("flex flex-col gap-xxs", className)}>
      <label htmlFor={inputId} className="t-caption-upper text-muted-soft">
        {label}
        {required && (
          <span className="ml-xxxs text-primary" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children({ inputId, describedBy })}

      {hint && !error && (
        <p id={hintId} className="t-caption text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="t-caption flex items-start gap-xxxs text-warning"
        >
          <span aria-hidden="true">▲</span>
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "h-12 w-full rounded-sm border bg-canvas px-xs t-body-md text-ink placeholder:text-muted " +
  "transition-colors duration-150 focus:border-ink/50 focus:outline-none " +
  "focus-visible:outline-2 focus-visible:outline-accent-yellow focus-visible:outline-offset-2";

export function TextInput({
  invalid,
  className,
  ...rest
}: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={cx(
        inputBase,
        invalid ? "border-warning" : "border-hairline",
        className
      )}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

export function TextArea({
  invalid,
  className,
  ...rest
}: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      className={cx(
        inputBase,
        "h-auto min-h-24 py-xs resize-y",
        invalid ? "border-warning" : "border-hairline",
        className
      )}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

export function SelectInput({
  invalid,
  className,
  children,
  ...rest
}: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        className={cx(
          inputBase,
          "appearance-none pr-10",
          invalid ? "border-warning" : "border-hairline",
          className
        )}
        aria-invalid={invalid || undefined}
        {...rest}
      >
        {children}
      </select>
      <span
        className="pointer-events-none absolute right-xs top-1/2 -translate-y-1/2 text-muted-soft"
        aria-hidden="true"
      >
        ▾
      </span>
    </div>
  );
}
