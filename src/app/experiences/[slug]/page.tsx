import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { FinalCta } from "@/components/home/FinalCta";

import { getExperienceSync, listExperiencesSync, getAddOnsSync } from "@/lib/services/experiences";
import { listLocationsSync } from "@/lib/services/locations";
import { rulesFor, startingPrice } from "@/lib/pricing/engine";
import { experiences } from "@/lib/data/experiences";
import { formatDuration, formatPrice } from "@/lib/format";
import { buildMetadata, JsonLd } from "@/lib/seo/metadata";
import { breadcrumbSchema, experienceSchema } from "@/lib/seo/schema";
import { eligibilityLabel } from "@/components/experiences/ExperienceCard";

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperienceSync(slug);
  if (!experience) return buildMetadata({ title: "Not found", description: "", path: "/experiences" });

  const price = startingPrice(experience.id);

  return buildMetadata({
    title: experience.name,
    description: `${experience.summary} ${formatDuration(experience.durationMin)} · ${eligibilityLabel(experience)}${price !== null ? ` · from ${formatPrice(price)}` : ""}. Book online at Atlas Karting Agadir, Casablanca or Marrakech.`,
    path: `/experiences/${experience.slug}`,
    keywords: [experience.name, "karting Morocco", `${experience.name} Agadir`],
  });
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = getExperienceSync(slug);
  if (!experience) notFound();

  const locations = listLocationsSync().filter((l) =>
    l.experienceIds.includes(experience.id)
  );
  const addOns = getAddOnsSync(experience.addOnIds);
  const related = listExperiencesSync()
    .filter((e) => e.category === experience.category && e.id !== experience.id)
    .slice(0, 3);

  const price = startingPrice(experience.id);

  return (
    <>
      <JsonLd data={experienceSchema(experience)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiences", path: "/experiences" },
          { name: experience.name, path: `/experiences/${experience.slug}` },
        ])}
      />

      <PageHero
        eyebrow={experience.category === "karting" ? "Karting" : "Groups & Events"}
        seed={experience.visual}
        title={experience.name}
        lede={experience.description}
        actions={
          experience.bookingMode === "instant" ? (
            <>
              <ButtonLink href={`/booking?experience=${experience.slug}`}>
                Book this session
              </ButtonLink>
              <ButtonLink href="/pricing" variant="outline">
                See all prices
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href="/contact">Request a quote</ButtonLink>
              <ButtonLink href="/events" variant="outline">
                Group formats
              </ButtonLink>
            </>
          )
        }
        stats={[
          { label: "Duration", value: formatDuration(experience.durationMin) },
          {
            label: "From",
            value: price !== null ? formatPrice(price) : "On request",
          },
          {
            label: "Group size",
            value: `${experience.minParticipants}–${experience.maxParticipants}`,
          },
          { label: "Requirement", value: eligibilityLabel(experience) },
        ]}
      />

      {/* ---- Format, features, requirements ---------------------------- */}
      <Section>
        <Editorial>
          <div className="grid gap-lg lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionHeading
                label="The format"
                title={experience.formatLabel}
                as="h2"
              />

              <ul className="mt-md grid gap-x-md gap-y-sm sm:grid-cols-2">
                {experience.features.map((feature) => (
                  <li key={feature} className="border-t border-hairline pt-xs">
                    <p className="t-body-md text-ink">{feature}</p>
                  </li>
                ))}
              </ul>

              {addOns.length > 0 && (
                <>
                  <h3 className="t-title-md mt-lg text-ink">Optional extras</h3>
                  <ul className="mt-xs divide-y divide-hairline border-y border-hairline">
                    {addOns.map((addOn) => (
                      <li
                        key={addOn.id}
                        className="flex flex-col gap-xxxs py-xs sm:flex-row sm:items-baseline sm:justify-between sm:gap-sm"
                      >
                        <span className="min-w-0">
                          <span className="t-title-sm block text-ink">{addOn.name}</span>
                          <span className="t-caption text-muted">{addOn.description}</span>
                        </span>
                        <span className="t-body-md tabular shrink-0 text-ink">
                          {formatPrice(addOn.price)}
                          <span className="text-muted">
                            {addOn.unit === "per_person" ? " / person" : " / booking"}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Requirements + price bands */}
            <aside className="flex flex-col gap-md">
              <div className="border border-hairline bg-canvas-elevated p-sm">
                <h2 className="t-caption-upper flex items-center gap-xxs text-ink">
                  <span className="h-px w-6 bg-primary" aria-hidden="true" />
                  Before you book
                </h2>
                <ul className="mt-sm flex flex-col gap-xs">
                  {experience.requirements.map((requirement) => (
                    <li key={requirement} className="t-body-md flex gap-xxs text-body">
                      <span aria-hidden="true" className="text-primary">—</span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-hairline p-sm">
                <h2 className="t-caption-upper text-ink">Price bands</h2>
                <p className="t-caption mt-xxxs text-muted">
                  The band is applied automatically from each racer&apos;s age and
                  height during booking.
                </p>
                <ul className="mt-sm divide-y divide-hairline border-t border-hairline">
                  {rulesFor(experience.id, locations[0]?.id ?? "").map((rule) => (
                    <li
                      key={rule.id}
                      className="flex items-baseline justify-between gap-xs py-xs"
                    >
                      <span className="t-body-md text-body">{rule.label}</span>
                      <span className="t-title-sm tabular text-ink">
                        {formatPrice(rule.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-hairline p-sm">
                <h2 className="t-caption-upper text-ink">Where you can race it</h2>
                <ul className="mt-xs flex flex-wrap gap-xxs">
                  {locations.map((location) => (
                    <li key={location.id}>
                      <Link href={`/${location.slug}`}>
                        <Badge tone="outline">{location.city}</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Editorial>
      </Section>

      {related.length > 0 && (
        <Section tone="elevated">
          <Editorial>
            <SectionHeading
              label="Also worth a look"
              title="Other formats in this category"
            />
            <div className="mt-lg grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ExperienceCard key={item.id} experience={item} />
              ))}
            </div>
          </Editorial>
        </Section>
      )}

      <FinalCta />
    </>
  );
}
