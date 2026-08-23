"use client";

import Link from "next/link";
import { TrackVisual } from "@/components/visuals/TrackVisual";
import { ButtonLink } from "@/components/ui/Button";
import { useLocations } from "@/components/locations/LocationContext";
import { cx } from "@/lib/format";

const TRUST = [
  { value: "900 m", label: "Flagship circuit" },
  { value: "70 km/h", label: "Senior GT karts" },
  { value: "Age 5+", label: "Kids & adults" },
  { value: "2 min", label: "To book, no account" },
];

/**
 * hero-band-cinema: the plate fills the viewport, the headline sits over its
 * lower third, and one primary plus one outline CTA — exactly as specified.
 */
export function Hero() {
  const { locations, selectedSlug, select, selected } = useLocations();

  return (
    <section className="relative isolate flex min-h-[86svh] flex-col justify-end overflow-hidden md:min-h-[92svh]">
      <TrackVisual seed="night-track" overlay="none" fill className="-z-10" priority />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-canvas via-canvas/75 to-canvas/15"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-canvas via-transparent to-canvas/70"
      />

      <div className="editorial pb-lg pt-super md:pb-xl">
        <div className="max-w-4xl animate-rise">
          <p className="t-caption-upper flex items-center gap-xxs text-ink">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            Agadir · Casablanca · Marrakech
          </p>

          <h1 className="t-display-mega mt-sm text-balance text-ink">
            Find the apex.
            <br />
            <span className="text-body">Then find it faster.</span>
          </h1>

          <p className="t-body-md mt-sm max-w-[36rem] text-pretty text-lg leading-relaxed text-body">
            Race-spec karts on professional outdoor circuits, timed to the
            thousandth. Bring your friends, your kids, or your whole company —
            and settle it on track.
          </p>

          {/* Location selector sits inside the hero: the first real decision */}
          <div className="mt-lg max-w-2xl border border-hairline bg-canvas/70 p-sm backdrop-blur-sm">
            <p className="t-caption-upper text-muted-soft">Choose your circuit</p>
            <div className="mt-xs flex flex-wrap gap-xxs">
              {locations.map((l) => (
                <button
                  key={l.slug}
                  type="button"
                  onClick={() => select(l.slug)}
                  aria-pressed={selectedSlug === l.slug}
                  className={cx(
                    "t-nav-link h-12 flex-1 border px-sm transition-colors duration-200",
                    selectedSlug === l.slug
                      ? "border-primary bg-primary text-on-primary"
                      : "border-hairline text-ink hover:border-ink/50"
                  )}
                >
                  {l.city}
                </button>
              ))}
            </div>

            <div className="mt-sm flex flex-col gap-xxs sm:flex-row">
              <ButtonLink
                href={selectedSlug ? `/booking?location=${selectedSlug}` : "/booking"}
                className="w-full sm:flex-1"
              >
                Book Your Race
              </ButtonLink>
              <ButtonLink href="/experiences" variant="outline" className="w-full sm:flex-1">
                Explore Experiences
              </ButtonLink>
            </div>

            {selected && (
              <p className="t-caption mt-xs text-muted-soft">
                {selected.name} · {selected.tracks[0]?.lengthM} m ·{" "}
                <Link href={`/${selected.slug}`} className="underline hover:text-ink">
                  Circuit details
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="border-t border-hairline bg-canvas/80 backdrop-blur-sm">
        <dl className="editorial grid grid-cols-2 divide-hairline md:grid-cols-4 md:divide-x">
          {TRUST.map((item) => (
            <div key={item.label} className="px-0 py-sm md:px-sm md:first:pl-0">
              <dt className="t-caption-upper text-muted-soft">{item.label}</dt>
              <dd className="t-display-md tabular mt-xxxs text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
