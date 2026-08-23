import Link from "next/link";
import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { TrackVisual } from "@/components/visuals/TrackVisual";
import { listLocationsSync } from "@/lib/services/locations";
import { listExperiencesSync } from "@/lib/services/experiences";
import type { VisualSeed } from "@/lib/types";

const SEEDS: VisualSeed[] = ["night-track", "chicane", "aerial"];

/** Circuit directory — also the internal-linking hub for local SEO. */
export function LocationsBand() {
  const locations = listLocationsSync();

  return (
    <Section id="circuits" tone="dark">
      <Editorial>
        <SectionHeading
          label="Circuits"
          title="Three cities. Three very different laps."
          lede="Each circuit runs its own layout, fleet and opening hours. Pick the one nearest you — or make a weekend of visiting all three."
        />

        <div className="stagger mt-lg grid gap-xs md:grid-cols-3">
          {locations.map((location, i) => {
            const track = location.tracks[0];
            const count = listExperiencesSync(location.slug).length;

            return (
              <article
                key={location.id}
                className="group relative flex flex-col border border-hairline transition-colors duration-300 hover:border-ink/25"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <TrackVisual
                    seed={SEEDS[i % SEEDS.length]}
                    overlay="bottom"
                    className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <h3 className="t-display-md absolute inset-x-0 bottom-0 p-sm text-ink">
                    <Link
                      href={`/${location.slug}`}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {location.city}
                    </Link>
                  </h3>
                </div>

                <div className="flex flex-1 flex-col p-sm">
                  <p className="t-body-md flex-1 text-body">{location.tagline}</p>

                  <dl className="mt-sm grid grid-cols-3 gap-xs border-t border-hairline pt-xs">
                    <div>
                      <dt className="t-caption-upper text-muted-soft">Length</dt>
                      <dd className="t-title-sm tabular text-ink">{track.lengthM} m</dd>
                    </div>
                    <div>
                      <dt className="t-caption-upper text-muted-soft">Turns</dt>
                      <dd className="t-title-sm tabular text-ink">{track.turns}</dd>
                    </div>
                    <div>
                      <dt className="t-caption-upper text-muted-soft">Formats</dt>
                      <dd className="t-title-sm tabular text-ink">{count}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </Editorial>
    </Section>
  );
}
