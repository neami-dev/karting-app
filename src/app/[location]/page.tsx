import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Accordion } from "@/components/ui/Accordion";
import { TrackVisual } from "@/components/visuals/TrackVisual";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { PricingTable } from "@/components/pricing/PricingTable";
import { LocationContactPanel } from "@/components/locations/LocationContactPanel";
import { FinalCta } from "@/components/home/FinalCta";

import { getLocationSync, listLocationsSync } from "@/lib/services/locations";
import { listExperiencesSync } from "@/lib/services/experiences";
import { startingPrice } from "@/lib/pricing/engine";
import { faqs } from "@/lib/data/faq";
import { formatPrice } from "@/lib/format";
import { buildMetadata, JsonLd } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema, locationSchema } from "@/lib/seo/schema";

/**
 * Circuit landing pages at /agadir, /casablanca, /marrakech.
 *
 * These carry the local search intent ("karting Agadir"), so each one gets its
 * own title, description, LocalBusiness markup and a full picture of that
 * circuit: track spec, fleet, prices, hours and a map.
 */

export function generateStaticParams() {
  return listLocationsSync().map((l) => ({ location: l.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}): Promise<Metadata> {
  const { location: slug } = await params;
  const location = getLocationSync(slug);
  if (!location) {
    return buildMetadata({ title: "Circuit not found", description: "", path: "/" });
  }

  const track = location.tracks[0];

  return buildMetadata({
    title: `Karting ${location.city} — ${location.name}`,
    description: `${track.lengthM}m outdoor karting circuit in ${location.city}. Race-spec karts for kids and adults, timed sessions and group events. Book online in two minutes — no account needed.`,
    path: `/${location.slug}`,
    keywords: [
      `karting ${location.city}`,
      `kart ${location.city}`,
      `karting near me ${location.city}`,
      `kids karting ${location.city}`,
      `karting birthday ${location.city}`,
    ],
  });
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location: slug } = await params;
  const location = getLocationSync(slug);
  if (!location) notFound();

  const experiences = listExperiencesSync(location.slug);
  const featured = experiences.filter((e) => e.featured);
  const track = location.tracks[0];

  const cheapest = experiences
    .map((e) => startingPrice(e.id, location.id))
    .filter((p): p is number => p !== null);
  const from = cheapest.length > 0 ? Math.min(...cheapest) : null;

  const localFaqs = faqs.filter((f) =>
    ["faq_min_age", "faq_min_height", "faq_session_length", "faq_arrive", "faq_walk_in", "faq_weather", "faq_spectators"].includes(
      f.id
    )
  );

  const otherLocations = listLocationsSync().filter((l) => l.id !== location.id);

  return (
    <>
      <JsonLd data={locationSchema(location)} />
      <JsonLd data={faqSchema(localFaqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: `Karting ${location.city}`, path: `/${location.slug}` },
        ])}
      />

      <PageHero
        eyebrow={`Karting ${location.city}`}
        seed="night-track"
        size="lg"
        title={location.tagline}
        lede={location.description}
        actions={
          <>
            <ButtonLink href={`/booking?location=${location.slug}`}>
              Book at {location.city}
            </ButtonLink>
            <ButtonLink href="#circuit" variant="outline">
              Circuit details
            </ButtonLink>
          </>
        }
        stats={[
          { label: "Circuit length", value: `${track.lengthM} m` },
          { label: "Corners", value: String(track.turns) },
          { label: "Formats", value: String(experiences.length) },
          { label: "From", value: from !== null ? formatPrice(from) : "—" },
        ]}
      />

      {/* ---- Circuit ------------------------------------------------------ */}
      <Section id="circuit">
        <Editorial>
          <SectionHeading
            label="The circuit"
            title={`${track.name}.`}
            lede={track.layoutNotes}
          />

          <div className="mt-lg grid gap-md lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative aspect-[16/10] overflow-hidden border border-hairline">
              <TrackVisual seed="aerial" overlay="soft" className="h-full w-full" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-xxs bg-gradient-to-t from-canvas to-transparent p-sm">
                {location.highlights.map((h) => (
                  <Badge key={h}>{h}</Badge>
                ))}
              </div>
            </div>

            <div>
              <dl className="grid grid-cols-2 gap-x-sm">
                {[
                  { v: String(track.lengthM), u: "m", l: "Length" },
                  { v: String(track.turns), u: "", l: "Corners" },
                  { v: String(track.widthM), u: "m", l: "Width" },
                  {
                    v: String(
                      Math.max(...location.kartTypes.map((k) => k.topSpeedKph))
                    ),
                    u: "km/h",
                    l: "Top speed",
                  },
                ].map((s) => (
                  <div key={s.l} className="border-t border-hairline py-sm">
                    <dd className="t-number-display text-ink">
                      {s.v}
                      {s.u && (
                        <span className="ml-1 text-base font-normal text-muted-soft">
                          {s.u}
                        </span>
                      )}
                    </dd>
                    <dt className="t-caption-upper mt-xxs text-muted-soft">{s.l}</dt>
                  </div>
                ))}
              </dl>

              <p className="t-body-md mt-sm text-body">
                Surface: {track.surface}.
              </p>

              {location.tracks.length > 1 && (
                <div className="mt-sm border-t border-hairline pt-sm">
                  <h3 className="t-caption-upper text-muted-soft">
                    Second circuit
                  </h3>
                  {location.tracks.slice(1).map((t) => (
                    <div key={t.id} className="mt-xs">
                      <p className="t-title-sm text-ink">
                        {t.name} · {t.lengthM} m · {t.turns} corners
                      </p>
                      <p className="t-body-md mt-xxs text-body">{t.layoutNotes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fleet */}
          <h3 className="t-title-md mt-lg text-ink">The fleet at {location.city}</h3>
          <ul className="mt-xs divide-y divide-hairline border-y border-hairline">
            {location.kartTypes.map((kart) => (
              <li
                key={kart.id}
                className="grid gap-xxs py-sm md:grid-cols-[160px_1fr_auto] md:items-center md:gap-sm"
              >
                <p className="t-title-sm text-ink">{kart.name}</p>
                <p className="t-body-md text-body">{kart.features.join(" · ")}</p>
                <p className="t-body-sm tabular shrink-0 text-body-strong md:text-right">
                  {kart.powerLabel} · {kart.topSpeedKph} km/h
                  {kart.seats > 1 ? ` · ${kart.seats} seats` : ""}
                </p>
              </li>
            ))}
          </ul>

          <p className="t-caption mt-sm border-l-2 border-info/50 pl-xs text-muted-soft">
            Circuit dimensions and kart specifications for {location.city} are
            placeholder figures pending confirmation.
          </p>
        </Editorial>
      </Section>

      {/* ---- Experiences -------------------------------------------------- */}
      <Section tone="elevated">
        <Editorial>
          <SectionHeading
            label="What we run here"
            title={`${experiences.length} formats at ${location.city}.`}
            lede="Every format below is available at this circuit. Prices shown are this circuit's."
            action={
              <ButtonLink href="/experiences" variant="outline" size="sm">
                All experiences
              </ButtonLink>
            }
          />
          <div className="stagger mt-lg grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                locationId={location.id}
              />
            ))}
          </div>
        </Editorial>
      </Section>

      {/* ---- Prices ------------------------------------------------------- */}
      <Section tone="light">
        <Editorial>
          <SectionHeading
            tone="light"
            label="Prices"
            title={`${location.city} price list.`}
            lede="Per racer, by age band. Group discounts apply automatically from eight racers."
            action={
              <ButtonLink
                href={`/booking?location=${location.slug}`}
                size="sm"
              >
                Book now
              </ButtonLink>
            }
          />
          <div className="mt-lg">
            <PricingTable location={location} />
          </div>
        </Editorial>
      </Section>

      {/* ---- Find us ------------------------------------------------------ */}
      <Section>
        <Editorial>
          <SectionHeading
            label="Find us"
            title={`Getting to ${location.name}.`}
          />
          <div className="mt-lg">
            <LocationContactPanel location={location} />
          </div>
        </Editorial>
      </Section>

      {/* ---- FAQ ---------------------------------------------------------- */}
      <Section tone="elevated">
        <Editorial>
          <div className="grid gap-lg lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionHeading
                label="Questions"
                title={`Racing at ${location.city}.`}
              />
              <ButtonLink href="/faq" variant="outline" size="sm" className="mt-sm">
                Full FAQ
              </ButtonLink>
            </div>
            <Accordion items={localFaqs} defaultOpen={localFaqs[0]?.id} />
          </div>
        </Editorial>
      </Section>

      {/* ---- Other circuits ------------------------------------------------ */}
      <Section>
        <Editorial>
          <SectionHeading label="Elsewhere" title="Our other circuits." />
          <ul className="mt-lg grid gap-xs sm:grid-cols-2">
            {otherLocations.map((other) => (
              <li key={other.id}>
                <Link
                  href={`/${other.slug}`}
                  className="group flex items-center justify-between gap-sm border border-hairline p-sm transition-colors hover:border-ink/30"
                >
                  <span>
                    <span className="t-title-md block text-ink">
                      Karting {other.city}
                    </span>
                    <span className="t-body-md text-body">{other.tagline}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="t-button shrink-0 text-muted-soft transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Editorial>
      </Section>

      <FinalCta />
    </>
  );
}
