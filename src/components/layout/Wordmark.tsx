import { cx } from "@/lib/format";

/**
 * Brand mark: a chevron cut from a square, referencing an apex and a chequered
 * flag corner. Original — deliberately not derived from any existing marque.
 */
export function Wordmark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cx("flex items-center gap-xxs", className)}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M0 0h26v26H0z" fill="#da291c" />
        <path d="M6 19.5 13.5 6.5 21 19.5h-4.4L13.5 14l-3.1 5.5H6Z" fill="#fff" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={cx(
            "text-[15px] font-bold uppercase tracking-[0.18em]",
            tone === "dark" ? "text-ink" : "text-body-on-light"
          )}
        >
          Atlas
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.32em] text-muted-soft">
          Karting
        </span>
      </span>
    </span>
  );
}
