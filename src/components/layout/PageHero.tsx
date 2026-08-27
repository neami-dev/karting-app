import type { ReactNode } from "react";
import { TrackVisual } from "@/components/visuals/TrackVisual";
import { heroImage } from "@/lib/data/imagery";
import { cx } from "@/lib/format";
import type { VisualSeed } from "@/lib/types";

/**
 * Subsidiary hero — the design system's hero-band-cinema at reduced height, so
 * inner pages read as part of the same cinematic system without stealing the
 * home page's full-viewport moment.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  seed = "apex",
  image,
  actions,
  stats,
  size = "md",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  seed?: VisualSeed;
  /** Key into the hero photography registry; falls back to the plate. */
  image?: string;
  actions?: ReactNode;
  stats?: { label: string; value: string }[];
  size?: "sm" | "md" | "lg";
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-hairline">
      <TrackVisual
        seed={seed}
        src={heroImage(image)}
        alt=""
        sizes="100vw"
        priority
        overlay="none"
        fill
        className="-z-10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-canvas via-canvas/65 to-canvas/20"
      />

      <div
        className={cx(
          "editorial",
          size === "lg" ? "py-xxl" : size === "sm" ? "py-lg" : "py-xl"
        )}
      >
        <div className="max-w-3xl animate-rise">
          <p className="t-caption-upper flex items-center gap-xxs text-ink">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            {eyebrow}
          </p>

          <h1
            className={cx(
              "mt-sm text-balance text-ink",
              size === "lg" ? "t-display-mega" : "t-display-xl"
            )}
          >
            {title}
          </h1>

          {lede && (
            <p className="t-body-md mt-sm max-w-[36rem] text-pretty text-base leading-relaxed text-body">
              {lede}
            </p>
          )}

          {actions && <div className="mt-lg flex flex-wrap gap-xxs">{actions}</div>}
        </div>

        {stats && stats.length > 0 && (
          <dl className="mt-lg grid grid-cols-2 gap-y-sm border-t border-hairline pt-sm md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="t-display-md tabular text-ink">{s.value}</dd>
                <dt className="t-caption-upper mt-xxxs text-muted-soft">{s.label}</dt>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
