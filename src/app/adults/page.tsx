import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { TrackVisual } from "@/components/visuals/TrackVisual";
import { FinalCta } from "@/components/home/FinalCta";

import { getExperienceSync } from "@/lib/services/experiences";
import { listLocationsSync } from "@/lib/services/locations";
import { startingPrice } from "@/lib/pricing/engine";
import { formatPrice } from "@/lib/format";
import { buildMetadata, JsonLd } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Adult karting",
  description:
    "270cc Senior GT karts, transponder timing on every lap and race formats with qualifying and a podium. Adult karting in Agadir, Casablanca and Marrakech from age 14.",
  path: "/adults",
  keywords: [
    "adult karting Morocco",
    "karting Agadir adults",
    "race package karting",
    "endurance karting Morocco",
  ],
});

const RACECRAFT = [
  {
    label: "Braking",
    title: "Brake later than feels sensible.",
    body: "The single biggest gain for a new driver. Karts have no downforce and enormous grip — they stop far shorter than your instincts expect.",
  },
  {
    label: "Line",
    title: "Sacrifice the corner, win the straight.",
    body: "A slow entry that lets you get on the throttle early beats a fast entry that costs you the exit. The stopwatch is unsentimental about this.",
  },
  {
    label: "Smoothness",
    title: "Stop sawing at the wheel.",
    body: "Every extra input scrubs speed. The quickest drivers on our circuits look, from the terrace, like the least busy.",
  },
];

export default function AdultsPage() {
  const sprint = getExperienceSync("adult-karting");
  const racePack = getExperienceSync("race-package");
  const endurance = getExperienceSync("endurance");
  const group = getExperienceSync("group-racing");

  const locations = listLocationsSync();
  const fastest = locations.reduce((best, l) => {
    const top = Math.max(...l.kartTypes.map((k) => k.topSpeedKph));
    return top > best.top ? { city: l.city, top } : best;
  }, { city: "", top: 0 });

  const price = sprint ? startingPrice(sprint.id) : null;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Adult karting", path: "/adults" },
        ])}
      />

      <PageHero
        eyebrow="Adult karting"
        seed="night-track"
        size="lg"
        title={
          <>
            No handicap.
            <br />
            No excuses.
          </>
        }
        lede="270cc Senior GT karts, a transponder on every chassis and a printed timing sheet at the end. Whatever you tell your friends afterwards, the sheet knows."
        actions={
          <>
            <ButtonLink href="/booking?experience=adult-karting">
              Book a session
            </ButtonLink>
            <ButtonLink href="/experiences/race-package" variant="outline">
              Race package
            </ButtonLink>
          </>
        }
        stats={[
          { label: "Top speed", value: `${fastest.top} km/h` },
          { label: "Minimum age", value: "14 years" },
          { label: "Minimum height", value: "150 cm" },
          { label: "From", value: price !== null ? formatPrice(price) : "—" },
        ]}
      />

      {/* ---- Kart spec --------------------------------------------------- */}
      <Section>
        <Editorial>
          <SectionHeading
            label="The machine"
            title="Senior GT."
            lede="A proper race chassis on slicks, running the same rubber and setup philosophy as a club-level competition kart. It will find your limits before you find its."
          />

          <div className="mt-lg grid gap-md lg:grid-cols-[1fr_1fr]">
            <dl className="grid grid-cols-2 gap-x-sm self-center">
              {[
                { v: "270", l: "Engine (cc)" },
                { v: "9", l: "Power (hp)" },
                { v: `${fastest.top}`, l: "Top speed (km/h)" },
                { v: "0.001", l: "Timing resolution (s)" },
              ].map((s) => (
                <div key={s.l} className="border-t border-hairline py-sm">
                  <dd className="t-number-display text-ink">{s.v}</dd>
                  <dt className="t-caption-upper mt-xxs text-muted-soft">{s.l}</dt>
                </div>
              ))}
            </dl>

            <div className="relative aspect-[4/3] overflow-hidden border border-hairline lg:order-first">
              <TrackVisual seed="pit-lane" overlay="soft" className="h-full w-full" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-xxs bg-gradient-to-t from-canvas to-transparent p-sm">
                <Badge>Race chassis</Badge>
                <Badge>Slick tyres</Badge>
                <Badge>Transponder timed</Badge>
                <Badge>Hydraulic brakes</Badge>
              </div>
            </div>
          </div>

          <p className="t-caption mt-sm text-muted">
            Kart specifications are placeholder figures pending confirmation from
            the operator.
          </p>
        </Editorial>
      </Section>

      {/* ---- Racecraft --------------------------------------------------- */}
      <Section tone="elevated">
        <Editorial>
          <SectionHeading
            label="Racecraft"
            title="Three seconds a lap, free."
            lede="Our marshals give this advice away all day. It costs nothing and it works on every circuit we run."
          />

          <div className="stagger mt-lg grid gap-md md:grid-cols-3">
            {RACECRAFT.map((item) => (
              <article key={item.label} className="border-t border-hairline pt-sm">
                <p className="t-caption-upper text-primary">{item.label}</p>
                <h3 className="t-display-md mt-xs text-ink">{item.title}</h3>
                <p className="t-body-md mt-xs text-body">{item.body}</p>
              </article>
            ))}
          </div>
        </Editorial>
      </Section>

      {/* ---- Formats ------------------------------------------------------ */}
      <Section>
        <Editorial>
          <SectionHeading
            label="Formats"
            title="From a quick sprint to ninety minutes of strategy."
            lede="All four run on the main circuit, all four are timed, and all four end with a results sheet."
          />
          <div className="mt-lg grid gap-xs sm:grid-cols-2 lg:grid-cols-4">
            {[sprint, racePack, endurance, group]
              .filter((e): e is NonNullable<typeof e> => Boolean(e))
              .map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))}
          </div>
        </Editorial>
      </Section>

      {/* ---- Circuits ----------------------------------------------------- */}
      <Section tone="elevated">
        <Editorial>
          <SectionHeading
            label="Where"
            title="Three circuits, three very different challenges."
          />
          <ul className="mt-lg divide-y divide-hairline border-y border-hairline">
            {locations.map((location) => {
              const track = location.tracks[0];
              const top = Math.max(...location.kartTypes.map((k) => k.topSpeedKph));
              return (
                <li
                  key={location.id}
                  className="grid gap-xs py-sm md:grid-cols-[200px_1fr_auto] md:items-center"
                >
                  <p className="t-title-md text-ink">{location.city}</p>
                  <p className="t-body-md text-body">{track.layoutNotes}</p>
                  <p className="t-body-sm tabular shrink-0 text-body-strong md:text-right">
                    {track.lengthM} m · {track.turns} turns · {top} km/h
                  </p>
                </li>
              );
            })}
          </ul>
        </Editorial>
      </Section>

      <FinalCta />
    </>
  );
}
