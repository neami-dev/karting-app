import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Accordion } from "@/components/ui/Accordion";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { TrackVisual } from "@/components/visuals/TrackVisual";
import { FinalCta } from "@/components/home/FinalCta";

import { getExperienceSync } from "@/lib/services/experiences";
import { listLocationsSync } from "@/lib/services/locations";
import { startingPrice } from "@/lib/pricing/engine";
import { faqs } from "@/lib/data/faq";
import { formatDuration, formatPrice } from "@/lib/format";
import { buildMetadata, JsonLd } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Kids karting",
  description:
    "Karting for children from age 5 at Atlas Karting. Speed-limited cadet karts, a fully separated junior circuit, child-sized safety kit and a marshal trackside throughout. Agadir, Casablanca and Marrakech.",
  path: "/kids",
  keywords: [
    "kids karting Morocco",
    "children karting Agadir",
    "karting for kids Casablanca",
    "kids karting Marrakech",
    "karting birthday kids",
  ],
});

const SAFETY = [
  {
    title: "A circuit of their own",
    body: "Cadet sessions run on a separate junior layout with its own paddock and marshal post. Children never share track with adult karts.",
  },
  {
    title: "Karts that can't run away",
    body: "Cadet karts are speed-limited from the marshal post. If a child gets flustered, a marshal can slow or stop their kart remotely.",
  },
  {
    title: "Kit that actually fits",
    body: "Child-sized helmets, suits and neck braces in every size we run, plus a fresh balaclava. An adult helmet on a child's head is worse than none.",
  },
  {
    title: "A briefing they'll understand",
    body: "Hands-on, in front of a kart, covering flags, the pedals and what to do if they spin. Nobody goes out until they've done it.",
  },
  {
    title: "Eyes on the track throughout",
    body: "A marshal watches the circuit for the entire session — not from an office, from trackside.",
  },
  {
    title: "You can watch the whole thing",
    body: "Covered terrace over the main straight with a live timing screen. Spectating is free and you'll see every lap.",
  },
];

const READINESS = [
  { q: "Are they 5 or older?", a: "Age 5 is our minimum for driving a cadet kart. Younger children can ride as a passenger in a two-seater from age 4." },
  { q: "Are they at least 110 cm?", a: "They need to reach the pedals with their back against the seat. 110 cm is where that reliably works." },
  { q: "Can they follow a briefing?", a: "They need to understand 'slow down' and the flags. Most five-year-olds manage this easily; some need a second run-through, which is fine." },
  { q: "Are they comfortable on their own?", a: "If not, book a two-seater instead. An instructor drives and they ride alongside — same speed, none of the pressure." },
];

export default function KidsPage() {
  const kids = getExperienceSync("kids-karting");
  const junior = getExperienceSync("junior-karting");
  const twoSeater = getExperienceSync("two-seater");
  const birthday = getExperienceSync("birthday-parties");

  const kidsFaqs = faqs.filter(
    (f) =>
      f.category === "age_height" ||
      ["faq_helmet", "faq_briefing", "faq_shoes", "faq_child_price"].includes(f.id)
  );

  const locations = listLocationsSync();
  const kidsPrice = kids ? startingPrice(kids.id) : null;

  return (
    <>
      <JsonLd data={faqSchema(kidsFaqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Kids karting", path: "/kids" },
        ])}
      />

      <PageHero
        eyebrow="Kids karting"
        seed="grid-start"
        title="Is your child ready to race?"
        lede="Real karts, a real circuit and real lap times — with the supervision that makes it a good idea. Cadet sessions from age five, on a track adults never touch."
        actions={
          <>
            <ButtonLink href="/booking?experience=kids-karting">
              Book a kids session
            </ButtonLink>
            <ButtonLink href="#readiness" variant="outline">
              Is my child ready?
            </ButtonLink>
          </>
        }
        stats={[
          { label: "Minimum age", value: "5 years" },
          { label: "Minimum height", value: "110 cm" },
          {
            label: "Session",
            value: kids ? formatDuration(kids.durationMin) : "12 min",
          },
          { label: "From", value: kidsPrice !== null ? formatPrice(kidsPrice) : "—" },
        ]}
      />

      {/* ---- Safety ------------------------------------------------------ */}
      <Section>
        <Editorial>
          <SectionHeading
            label="Safety"
            title="What we do so you don't have to worry."
            lede="Parents ask us the same six questions. Here are the answers, before you ask."
          />

          <div className="stagger mt-lg grid gap-x-lg gap-y-md sm:grid-cols-2 lg:grid-cols-3">
            {SAFETY.map((item, i) => (
              <div key={item.title} className="border-t border-hairline pt-sm">
                <p className="t-caption-upper text-primary">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="t-title-md mt-xxs text-ink">{item.title}</h3>
                <p className="t-body-md mt-xxs text-body">{item.body}</p>
              </div>
            ))}
          </div>
        </Editorial>
      </Section>

      {/* ---- Readiness --------------------------------------------------- */}
      <Section tone="elevated" id="readiness">
        <Editorial>
          <div className="grid gap-lg lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeading
                label="Readiness"
                title="Four questions worth asking first."
                lede="If the answer to all four is yes, they're ready for a cadet kart. If any is no, a two-seater is the better first step."
              />
              <div className="mt-sm flex flex-wrap gap-xxs">
                <ButtonLink href="/booking?experience=kids-karting" size="sm">
                  Book cadet session
                </ButtonLink>
                <ButtonLink
                  href="/experiences/two-seater"
                  variant="outline"
                  size="sm"
                >
                  Two-seater instead
                </ButtonLink>
              </div>
            </div>

            <ul className="divide-y divide-hairline border-y border-hairline">
              {READINESS.map((item) => (
                <li key={item.q} className="py-sm">
                  <p className="t-title-sm text-ink">{item.q}</p>
                  <p className="t-body-md mt-xxs text-body">{item.a}</p>
                </li>
              ))}
            </ul>
          </div>
        </Editorial>
      </Section>

      {/* ---- The kart ----------------------------------------------------- */}
      <Section>
        <Editorial>
          <SectionHeading
            label="The cadet kart"
            title="Built small on purpose."
            lede="Not a scaled-down adult kart with a cushion in it — a chassis designed around a child's reach and weight."
          />

          <div className="mt-lg grid gap-md lg:grid-cols-[1fr_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden border border-hairline">
              <TrackVisual seed="chicane" overlay="soft" className="h-full w-full" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-xxs bg-gradient-to-t from-canvas to-transparent p-sm">
                <Badge>120cc · 4hp</Badge>
                <Badge>40 km/h limited</Badge>
                <Badge>Adjustable pedals</Badge>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-sm self-center">
              {[
                { v: "5+", l: "Minimum age" },
                { v: "110", l: "Minimum height (cm)" },
                { v: "40", l: "Top speed (km/h)" },
                { v: "8", l: "Karts per session" },
              ].map((s) => (
                <div key={s.l} className="border-t border-hairline py-sm">
                  <dd className="t-number-display text-ink">{s.v}</dd>
                  <dt className="t-caption-upper mt-xxs text-muted-soft">{s.l}</dt>
                </div>
              ))}
            </dl>
          </div>

          <p className="t-caption mt-sm text-muted">
            Kart specifications are placeholder figures pending confirmation. Cadet
            circuits are available at{" "}
            {locations
              .filter((l) => l.tracks.length > 1)
              .map((l) => l.city)
              .join(" and ")}
            ; at other circuits cadet sessions run on the main layout with reduced
            grid sizes.
          </p>
        </Editorial>
      </Section>

      {/* ---- Formats ------------------------------------------------------ */}
      <Section tone="elevated">
        <Editorial>
          <SectionHeading
            label="Formats"
            title="Options for every age and confidence level."
          />
          <div className="mt-lg grid gap-xs sm:grid-cols-2 lg:grid-cols-4">
            {[kids, junior, twoSeater, birthday]
              .filter((e): e is NonNullable<typeof e> => Boolean(e))
              .map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))}
          </div>
        </Editorial>
      </Section>

      {/* ---- FAQ ---------------------------------------------------------- */}
      <Section>
        <Editorial>
          <div className="grid gap-lg lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              label="Parents ask"
              title="Questions we get at the desk."
            />
            <Accordion items={kidsFaqs} defaultOpen={kidsFaqs[0]?.id} />
          </div>
        </Editorial>
      </Section>

      <FinalCta />
    </>
  );
}
