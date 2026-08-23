"use client";

import { useId, useState } from "react";
import { cx } from "@/lib/format";

/**
 * Native <button> + aria-expanded rather than <details>, so the open/close state
 * is fully controllable and announces correctly across screen readers.
 */
export function Accordion({
  items,
  className,
  defaultOpen,
}: {
  items: { id: string; question: string; answer: string }[];
  className?: string;
  defaultOpen?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const base = useId();

  return (
    <div className={cx("divide-y divide-hairline border-y border-hairline", className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        const panelId = `${base}-${item.id}-panel`;
        const buttonId = `${base}-${item.id}-button`;

        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-sm py-sm text-left transition-colors duration-150 hover:text-ink"
              >
                <span className={cx("t-title-sm", isOpen ? "text-ink" : "text-body-strong")}>
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cx(
                    "shrink-0 text-lg leading-none transition-transform duration-300",
                    isOpen ? "rotate-45 text-primary" : "text-muted-soft"
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-sm"
            >
              <p className="t-body-md max-w-2xl text-body">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
