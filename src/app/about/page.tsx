import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { TrackVisual } from "@/components/visuals/TrackVisual";
import { Badge } from "@/components/ui/Badge";
import { LocationsBand } from "@/components/locations/LocationsBand";
import { FinalCta } from "@/components/home/FinalCta";
import { site } from "@/lib/data/site";
import { listLocationsSync } from "@/lib/services/locations";
import { buildMetadata, JsonLd } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "About us",
  description:
    "Atlas Karting runs three professional outdoor circuits in Agadir, Casablanca and Marrakech. Who we are, how we think about safety, and why the track always comes first.",
  path: "/about",
  keywords: ["Atlas Karting", "karting company Morocco", "karting circuits Morocco"],
});

const VALUES = [
  {
    label: "The track first",
    title: "Resurfacing beats redecorating.",
    body: "Money goes into asphalt, tyre walls and kart maintenance before it goes into anything you can photograph. A beautiful lounge attached to a bad circuit is a bad karting business.",
  },
  {
    label: "Safety isn't a disclaimer",
    title: "Every session is marshalled from trackside.",
    body: "Not from an office with a monitor. Cadet karts can be slowed remotely, every racer sits through a briefing, and we will cancel a session before we run one we're unsure about.",
  },
  {
    label: "Everyone races",
    title: "Nobody should have to watch.",
    body: "Cadet karts from five, junior karts from twelve, two-seaters for anyone not ready to drive, and no upper age limit at all. If someone in your group can't race, we've failed at something.",
  },
];

const TEAM = [
  {
    role: "Circuit operations",
    body: "Marshals and instructors who compete themselves. Most of our senior staff came up through Moroccan karting championships.",
  },
  {
    role: "Kart workshop",
    body: "A full-time mechanical team at each circuit. Every kart is inspected daily and the fleet is rotated out of service on a fixed schedule.",
  },
  {
    role: "Events",
    body: "A dedicated team for corporate days, school groups and anything that needs the circuit shaped around it.",
  },
];

export default function AboutPage() {
  const locations = listLocationsSync();
  const totalMetres = locations.reduce(
    (sum, l) => sum + l.tracks.reduce((s, t) => s + t.lengthM, 0),
    0
  );

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHero
        eyebrow="About"
        seed="aerial"
        size="lg"
        title="We build circuits, not attractions."
        lede="Atlas Karting started with one stretch of asphalt outside Agadir and an argument about whether Morocco needed a proper karting circuit. Three cities later, the argument seems settled."
        actions={
          <>
            <ButtonLink href="/experiences">See what we run</ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Get in touch
            </ButtonLink>
          </>
        }
        stats={[
          { label: "Circuits", value: String(locations.length) },
          { label: "Total track", value: `${(totalMetres / 1000).toFixed(1)} km` },
          {
            label: "Racers a year",
            value: `${(site.socialProof.racersPerYear / 1000).toFixed(0)}k`,
          },
          { label: "Average rating", value: String(site.socialProof.rating) },
        ]}
      />

      {/* ---- Story -------------------------------------------------------- */}
      <Section>
        <Editorial>
          <div className="grid gap-lg lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <SectionHeading
                label="Who we are"
                title="A karting company run by people who race."
                lede="Everyone who signs off a circuit layout here has driven it at ten tenths first. It's the only quality check we fully trust."
              />
              <div className="mt-md flex flex-col gap-sm">
                <p className="t-body-md text-body">
                  We opened in Agadir because there was nowhere in the region to
                  drive a properly maintained kart on properly maintained asphalt.
                  The plan was one circuit. What actually happened is that people
                  drove down from Casablanca and Marrakech to use it, which made the
                  next two decisions fairly obvious.
                </p>
                <p className="t-body-md text-body">
                  Each circuit is built for its city rather than stamped from a
                  template. Agadir flows, Casablanca punishes, Marrakech rewards
                  patience over three long sectors. The fleets and the safety
                  standards are identical; nothing else has to be.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden border border-hairline">
              <TrackVisual seed="apex" overlay="soft" className="h-full w-full" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-xxs bg-gradient-to-t from-canvas to-transparent p-sm">
                {locations.map((l) => (
                  <Badge key={l.id}>{l.city}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Editorial>
      </Section>

      {/* ---- Values ------------------------------------------------------- */}
      <Section tone="elevated">
        <Editorial>
          <SectionHeading
            label="How we operate"
            title="Three positions we don't negotiate on."
          />
          <div className="stagger mt-lg grid gap-md md:grid-cols-3">
            {VALUES.map((value) => (
              <article key={value.label} className="border-t border-hairline pt-sm">
                <p className="t-caption-upper text-primary">{value.label}</p>
                <h3 className="t-display-md mt-xs text-ink">{value.title}</h3>
                <p className="t-body-md mt-xs text-body">{value.body}</p>
              </article>
            ))}
          </div>
        </Editorial>
      </Section>

      {/* ---- Tracks ------------------------------------------------------- */}
      <LocationsBand />

      {/* ---- Team --------------------------------------------------------- */}
      <Section tone="elevated">
        <Editorial>
          <div className="grid gap-lg lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              label="Our team"
              title="Who you'll actually meet."
              lede="Three groups keep a circuit running. You'll deal with all of them on an event day."
            />
            <ul className="divide-y divide-hairline border-y border-hairline">
              {TEAM.map((member) => (
                <li key={member.role} className="py-sm">
                  <p className="t-title-md text-ink">{member.role}</p>
                  <p className="t-body-md mt-xxs text-body">{member.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <p className="t-caption mt-lg border-l-2 border-info/50 pl-xs text-muted">
            Company history, staff details and operating statistics on this page are
            placeholder content pending confirmation from the operator.
          </p>
        </Editorial>
      </Section>

      <FinalCta />
    </>
  );
}
