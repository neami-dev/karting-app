"use client";

import Link from "next/link";
import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { TrackVisual } from "@/components/visuals/TrackVisual";
import { Badge } from "@/components/ui/Badge";
import { PlaceholderNote } from "@/components/ui/States";
import { useLocations } from "@/components/locations/LocationContext";
import { listLocationsSync } from "@/lib/services/locations";

/**
 * Circuit spec panel. Falls back to the flagship circuit until the visitor picks
 * one, so the section is never empty on a first visit.
 */
export function TrackExperience() {
  const { selected } = useLocations();
  const location = selected ?? listLocationsSync()[0];
  const track = location.tracks[0];
  const senior = location.kartTypes.find((k) => k.categories.includes("adult"));

  const specs = [
    { value: `${track.lengthM}`, unit: "m", label: "Circuit length" },
    { value: `${track.turns}`, unit: "", label: "Corners" },
    { value: `${track.widthM}`, unit: "m", label: "Track width" },
    { value: `${senior?.topSpeedKph ?? 70}`, unit: "km/h", label: "Top speed" },
  ];

  return (
    <Section>
      <Editorial>
        <SectionHeading
          label="The circuit"
          title={
            <>
              {track.name}, {location.city}.
            </>
          }
          lede={track.layoutNotes}
          action={
            <Link
              href={`/${location.slug}`}
              className="t-button flex items-center gap-xxs text-ink transition-colors hover:text-primary"
            >
              Circuit page
              <span aria-hidden="true">→</span>
            </Link>
          }
        />

        <div className="mt-lg grid gap-md lg:grid-cols-[1.15fr_1fr]">
          <div className="relative aspect-[16/10] w-full overflow-hidden border border-hairline">
            <TrackVisual seed="aerial" overlay="soft" className="h-full w-full" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-xxs bg-gradient-to-t from-canvas to-transparent p-sm">
              {location.highlights.map((h) => (
                <Badge key={h}>{h}</Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <dl className="grid grid-cols-2 gap-x-sm">
              {specs.map((s) => (
                <div key={s.label} className="border-t border-hairline py-sm">
                  <dd className="t-number-display text-ink">
                    {s.value}
                    {s.unit && (
                      <span className="ml-1 text-base font-normal text-muted-soft">
                        {s.unit}
                      </span>
                    )}
                  </dd>
                  <dt className="t-caption-upper mt-xxs text-muted-soft">{s.label}</dt>
                </div>
              ))}
            </dl>

            <div className="mt-sm border-t border-hairline pt-sm">
              <h3 className="t-caption-upper text-muted-soft">Kart fleet</h3>
              <ul className="mt-xs divide-y divide-hairline">
                {location.kartTypes.map((kart) => (
                  <li
                    key={kart.id}
                    className="flex items-baseline justify-between gap-xs py-xs"
                  >
                    <span className="t-title-sm text-ink">{kart.name}</span>
                    <span className="t-body-sm tabular text-body">
                      {kart.powerLabel} · {kart.topSpeedKph} km/h
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-sm">
              <PlaceholderNote>
                Circuit dimensions and kart specifications are placeholder figures
                pending confirmation from the operator.
              </PlaceholderNote>
            </div>
          </div>
        </div>
      </Editorial>
    </Section>
  );
}
