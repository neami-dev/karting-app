import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { ContactForm } from "@/components/contact/ContactForm";
import { FinalCta } from "@/components/home/FinalCta";

import { listExperiencesSync, getExperienceSync } from "@/lib/services/experiences";
import { addOns } from "@/lib/data/experiences";
import { startingPrice } from "@/lib/pricing/engine";
import { formatPrice } from "@/lib/format";
import { buildMetadata, JsonLd } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Groups & events",
  description:
    "Birthday parties, corporate events, team building, school groups and private race hire at Atlas Karting. Private grids from 8 racers, full circuit hire up to 80. Agadir, Casablanca and Marrakech.",
  path: "/events",
  keywords: [
    "karting birthday Morocco",
    "corporate karting Casablanca",
    "team building karting",
    "private karting hire Marrakech",
    "school group karting",
  ],
});

const AUDIENCES = [
  {
    slug: "birthday-parties",
    who: "Birthdays",
    line: "Two sessions on track, a private party room and a trophy the birthday racer keeps whatever happens on track.",
  },
  {
    slug: "corporate-events",
    who: "Companies",
    line: "Exclusive circuit hire with your branding on the podium, meeting space and catering built around the day.",
  },
  {
    slug: "team-building",
    who: "Teams",
    line: "Endurance format with randomised teams, where pit strategy decides more than lap time does.",
  },
  {
    slug: "school-groups",
    who: "Schools",
    line: "Rotating supervised sessions with a racecraft and safety workshop between runs.",
  },
  {
    slug: "group-racing",
    who: "Friends",
    line: "A private grid from eight racers, run as a full grand prix with qualifying, a race and a podium.",
  },
  {
    slug: "endurance",
    who: "Clubs",
    line: "Ninety minutes, teams of two to four, mandatory pit stops and a live timing wall.",
  },
];

export default function EventsPage() {
  const events = listExperiencesSync().filter(
    (e) => e.category === "events" || e.id === "exp_endurance"
  );

  const sizes = events.reduce(
    (acc, e) => ({
      min: Math.min(acc.min, e.minParticipants),
      max: Math.max(acc.max, e.maxParticipants),
    }),
    { min: Infinity, max: 0 }
  );

  const birthday = getExperienceSync("birthday-parties");
  const birthdayPrice = birthday ? startingPrice(birthday.id) : null;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Groups & events", path: "/events" },
        ])}
      />

      <PageHero
        eyebrow="Groups & events"
        seed="confetti"
        title="Bring everyone. We'll sort the grid."
        lede="From six kids and a party room to eighty colleagues and the whole circuit closed to the public. Every format below runs a real race — nobody sits in a corner watching."
        actions={
          <>
            <ButtonLink href="/booking?experience=group-racing">
              Book a group session
            </ButtonLink>
            <ButtonLink href="#enquiry" variant="outline">
              Request a quote
            </ButtonLink>
          </>
        }
        stats={[
          { label: "Group size", value: `${sizes.min}–${sizes.max}` },
          { label: "Formats", value: String(events.length) },
          { label: "Circuits", value: "3" },
          {
            label: "Birthdays from",
            value: birthdayPrice !== null ? formatPrice(birthdayPrice) : "—",
          },
        ]}
      />

      {/* ---- Who it's for ------------------------------------------------ */}
      <Section>
        <Editorial>
          <SectionHeading
            label="Who we run these for"
            title="Six kinds of group, six different days."
          />

          <ul className="stagger mt-lg grid gap-x-lg gap-y-md sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((item) => (
              <li key={item.slug} className="border-t border-hairline pt-sm">
                <p className="t-caption-upper text-primary">{item.who}</p>
                <p className="t-body-md mt-xs text-body">{item.line}</p>
                <ButtonLink
                  href={`/experiences/${item.slug}`}
                  variant="tertiary"
                  className="mt-xs"
                >
                  Details →
                </ButtonLink>
              </li>
            ))}
          </ul>
        </Editorial>
      </Section>

      {/* ---- Packages ----------------------------------------------------- */}
      <Section tone="elevated">
        <Editorial>
          <SectionHeading
            label="Packages"
            title="Everything bookable, side by side."
            lede="Formats marked Enquiry need a short conversation first — usually because circuit hire and catering have to be scheduled around your headcount."
          />
          <div className="mt-lg grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
            {events.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        </Editorial>
      </Section>

      {/* ---- Add-ons ------------------------------------------------------ */}
      <Section>
        <Editorial>
          <SectionHeading
            label="Add-ons"
            title="Catering, trophies, and the whole circuit."
            lede="Add any of these during booking, or tell us in your enquiry and we'll include them in the quote."
          />

          <ul className="mt-lg divide-y divide-hairline border-y border-hairline">
            {addOns.map((addOn) => (
              <li
                key={addOn.id}
                className="grid gap-xxs py-sm md:grid-cols-[240px_1fr_auto] md:items-baseline md:gap-sm"
              >
                <p className="t-title-sm text-ink">{addOn.name}</p>
                <p className="t-body-md text-body">{addOn.description}</p>
                <p className="t-body-md tabular shrink-0 text-ink md:text-right">
                  {formatPrice(addOn.price)}
                  <span className="text-muted">
                    {addOn.unit === "per_person" ? " / person" : " / booking"}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </Editorial>
      </Section>

      {/* ---- Enquiry ------------------------------------------------------ */}
      <Section tone="elevated" id="enquiry">
        <Editorial>
          <div className="grid gap-lg lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeading
                label="Enquiry"
                title="Tell us the headcount. We'll build the day."
                lede="Corporate, team building and school groups are quoted individually — circuit time, catering and format all move with your numbers. We reply within one working day."
              />
              <p className="t-body-md mt-sm text-body">
                Smaller groups don&apos;t need to wait for a quote: Group Racing and
                Birthday Parties are bookable online right now.
              </p>
              <ButtonLink href="/booking" variant="outline" size="sm" className="mt-sm">
                Book online instead
              </ButtonLink>
            </div>

            <ContactForm variant="event" />
          </div>
        </Editorial>
      </Section>

      <FinalCta />
    </>
  );
}
