import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/format";

/**
 * Buttons follow the design system exactly: sharp 0px corners (never pills),
 * uppercase labels at 1.4px tracking, 48px height for WCAG AAA touch targets.
 */

type Variant = "primary" | "outline" | "outline-light" | "tertiary" | "ghost";
type Size = "md" | "lg" | "sm";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active border border-primary hover:border-primary-hover",
  outline:
    "bg-transparent text-ink border border-ink/60 hover:border-ink hover:bg-ink/5 active:bg-ink/10",
  "outline-light":
    "bg-transparent text-body-on-light border border-body-on-light/40 hover:border-body-on-light hover:bg-body-on-light/5",
  tertiary:
    "bg-transparent text-ink border border-transparent hover:text-primary px-0",
  ghost:
    "bg-canvas-elevated text-ink border border-hairline hover:border-ink/40 hover:bg-canvas-elevated/70",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-xs",
  md: "h-12 px-md",
  lg: "h-14 px-lg",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

function classes({ variant = "primary", size = "md", fullWidth, className }: BaseProps) {
  return cx(
    "t-button inline-flex items-center justify-center gap-xxs rounded-none whitespace-nowrap",
    "transition-colors duration-200 select-none",
    "disabled:opacity-40 disabled:pointer-events-none",
    VARIANTS[variant],
    variant === "tertiary" ? "h-auto" : SIZES[size],
    fullWidth && "w-full",
    className
  );
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  children,
  ...rest
}: BaseProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={classes({ variant, size, fullWidth, className, children })} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  children,
  href,
  ...rest
}: BaseProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    "className" | "children" | "href"
  >) {
  return (
    <Link
      href={href}
      className={classes({ variant, size, fullWidth, className, children })}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** External links (WhatsApp, maps) need the same visual treatment. */
export function ButtonAnchor({
  variant,
  size,
  fullWidth,
  className,
  children,
  ...rest
}: BaseProps & Omit<ComponentProps<"a">, "className" | "children">) {
  return (
    <a className={classes({ variant, size, fullWidth, className, children })} {...rest}>
      {children}
    </a>
  );
}
