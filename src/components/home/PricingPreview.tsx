"use client";

import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { useLocations } from "@/components/locations/LocationContext";
import { listExperiencesSync } from "@/lib/services/experiences";
import { startingPrice } from "@/lib/pricing/engine";
import { formatDuration, formatPrice } from "@/lib/format";
import { eligibilityLabel } from "@/components/experiences/ExperienceCard";

const PREVIEW_SLUGS = ["kids-karting", "adult-karting", "two-seater", "race-package"];

export function PricingPreview() {
  const { selected } = useLocations();
  const experiences = listExperiencesSync(selected?.slug).filter((e) =>
    PREVIEW_SLUGS.includes(e.slug)
  );

  return (
    <Section tone="soft-light">
      <Editorial>
        <SectionHeading
          tone="light"
          label="Pricing"
          title="Clear prices, per racer."
          lede={
            selected
              ? `Prices shown for ${selected.name}. Group discounts apply automatically from eight racers.`
              : "Prices vary slightly by circuit. Choose yours to see exact figures — group discounts apply automatically from eight racers."
          }
          action={
            <ButtonLink href="/pricing" variant="outline-light" size="sm">
              Full price list
            </ButtonLink>
          }
        />

        <div className="mt-lg grid gap-xs sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((experience) => {
            const price = startingPrice(experience.id, selected?.id);
            return (
              <article
                key={experience.id}
                className="flex flex-col justify-between border border-hairline-on-light bg-canvas-light p-md"
              >
                <div>
                  <h3 className="t-title-md text-body-on-light">{experience.name}</h3>
                  <p className="t-caption mt-xxxs text-muted">
                    {formatDuration(experience.durationMin)} ·{" "}
                    {eligibilityLabel(experience)}
                  </p>
                </div>

                <p className="mt-md">
                  <span className="t-caption-upper block text-muted">From</span>
                  <span className="tabular text-[36px] font-medium leading-none tracking-tight text-body-on-light">
                    {price !== null ? formatPrice(price) : "—"}
                  </span>
                </p>

                <ButtonLink
                  href={`/booking?experience=${experience.slug}${selected ? `&location=${selected.slug}` : ""}`}
                  variant="outline-light"
                  size="sm"
                  className="mt-md"
                  fullWidth
                >
                  Book
                </ButtonLink>
              </article>
            );
          })}
        </div>

        <p className="t-caption mt-sm text-muted">
          Prices are per racer and include kart hire, all safety equipment and the
          safety briefing. Payment is taken at the circuit.
        </p>
      </Editorial>
    </Section>
  );
}
