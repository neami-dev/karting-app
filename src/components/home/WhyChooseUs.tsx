import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { site } from "@/lib/data/site";

const STATS = [
  { value: "3", label: "Circuits in Morocco" },
  { value: `${(site.socialProof.racersPerYear / 1000).toFixed(0)}k`, label: "Racers a year" },
  { value: String(site.socialProof.rating), label: "Average rating" },
  { value: "100%", label: "Sessions transponder-timed" },
];

const BENEFITS = [
  {
    title: "Professional circuits",
    body: "Purpose-built asphalt with FIA-spec run-off, tyre walls and marshal posts — not a car park with cones.",
  },
  {
    title: "Safety equipment included",
    body: "Helmet, race suit, neck brace and a fresh balaclava for every racer, in adult and child sizes. Nothing to bring.",
  },
  {
    title: "Staff who race",
    body: "Our marshals and instructors compete themselves. Ask for a line through turn four and you will get a real answer.",
  },
  {
    title: "Every lap timed",
    body: "Transponders on every kart, sector splits on the wall, and a printed results sheet at the end of your session.",
  },
  {
    title: "Built for families",
    body: "Cadet karts from age five on a fully separated junior circuit, plus two-seaters so nobody has to sit it out.",
  },
  {
    title: "Booking without friction",
    body: "No account, no password, no dashboard. Choose a session, add your racers, get a reference. Done.",
  },
];

export function WhyChooseUs() {
  return (
    <Section tone="elevated">
      <Editorial>
        <SectionHeading
          label="Why Atlas"
          title="Everything a proper circuit should be."
          lede="Karting is only as good as the track, the karts and the people running them. We take all three seriously."
        />

        <dl className="mt-lg grid grid-cols-2 gap-y-md border-y border-hairline py-md md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <dd className="t-number-display text-ink">{s.value}</dd>
              <dt className="t-caption-upper mt-xxs text-muted-soft">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="stagger mt-lg grid gap-x-lg gap-y-md sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <div key={b.title} className="border-t border-hairline pt-sm">
              <p className="t-caption-upper text-muted-soft">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="t-title-md mt-xxs text-ink">{b.title}</h3>
              <p className="t-body-md mt-xxs text-body">{b.body}</p>
            </div>
          ))}
        </div>
      </Editorial>
    </Section>
  );
}
