"use client";

import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { useLocations } from "@/components/locations/LocationContext";
import { listExperiencesSync } from "@/lib/services/experiences";

export function FeaturedExperiences() {
  const { selected } = useLocations();

  // Narrow to what the chosen circuit actually runs — the grid changes with it.
  const all = listExperiencesSync(selected?.slug);
  const featured = all.filter((e) => e.featured);

  return (
    <Section id="experiences">
      <Editorial>
        <SectionHeading
          label={selected ? `Available at ${selected.city}` : "What we run"}
          title="Pick your format."
          lede="Every session is timed, every kart is race-prepared, and every format is bookable in the same two minutes."
          action={
            <ButtonLink href="/experiences" variant="outline" size="sm">
              All experiences
            </ButtonLink>
          }
        />

        <div className="stagger mt-lg grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((experience, i) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              locationId={selected?.id}
              priority={i < 3}
            />
          ))}
        </div>
      </Editorial>
    </Section>
  );
}
