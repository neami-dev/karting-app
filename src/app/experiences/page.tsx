import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { FinalCta } from "@/components/home/FinalCta";
import { listExperiencesSync } from "@/lib/services/experiences";
import { buildMetadata, JsonLd } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Karting experiences",
  description:
    "Every format we run: adult and kids karting, two-seaters, race packages, endurance, birthdays, corporate events and team building — across Agadir, Casablanca and Marrakech.",
  path: "/experiences",
  keywords: [
    "karting experiences Morocco",
    "kids karting",
    "adult karting",
    "two-seater karting",
    "karting race package",
  ],
});

const GROUPS = [
  {
    id: "karting" as const,
    label: "Karting",
    title: "On track",
    lede: "Timed sessions and race formats for every age and level of nerve.",
  },
  {
    id: "events" as const,
    label: "Events",
    title: "Groups & occasions",
    lede: "Private grids, party rooms and full circuit hire — from six people to eighty.",
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiences", path: "/experiences" },
        ])}
      />

      <PageHero
        eyebrow="Experiences"
        seed="apex"
        image="experiences"
        title="Every way to get on our circuits."
        lede="From a twelve-minute cadet session to a ninety-minute endurance race with pit stops. Each format lists its own age, height and group requirements, so you know before you book."
        actions={
          <>
            <ButtonLink href="/booking">Book a session</ButtonLink>
            <ButtonLink href="/pricing" variant="outline">
              See prices
            </ButtonLink>
          </>
        }
      />

      {GROUPS.map((group, i) => {
        const items = listExperiencesSync().filter((e) => e.category === group.id);
        return (
          <Section key={group.id} tone={i % 2 === 0 ? "dark" : "elevated"} id={group.id}>
            <Editorial>
              <SectionHeading label={group.label} title={group.title} lede={group.lede} />
              <div className="stagger mt-lg grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
                {items.map((experience) => (
                  <ExperienceCard key={experience.id} experience={experience} />
                ))}
              </div>
            </Editorial>
          </Section>
        );
      })}

      <FinalCta />
    </>
  );
}
