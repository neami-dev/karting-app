import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { PricingExplorer } from "@/components/pricing/PricingExplorer";
import { ButtonLink } from "@/components/ui/Button";
import { FinalCta } from "@/components/home/FinalCta";
import { Accordion } from "@/components/ui/Accordion";
import { faqs } from "@/lib/data/faq";
import { pricingRules } from "@/lib/data/pricing-rules";
import { formatPrice } from "@/lib/format";
import { buildMetadata, JsonLd } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Karting prices",
  description:
    "Full price list for Atlas Karting: kids, junior and adult sessions, two-seaters, race packages, endurance and group events. Per-racer prices by age band, with automatic group discounts.",
  path: "/pricing",
  keywords: [
    "karting prices Morocco",
    "karting price Agadir",
    "karting cost Casablanca",
    "kids karting price",
  ],
});

const HOW_PRICING_WORKS = [
  {
    title: "Priced per racer, by age band",
    body: "Every racer's age and height decide which kart they drive — and that decides the band they pay. You enter both during booking and the right price is applied automatically.",
  },
  {
    title: "Height matters as much as age",
    body: "A racer must fit the pedals and harness. Where a band has a height requirement it's shown alongside the price, and the booking flow checks it before you can confirm.",
  },
  {
    title: "Circuits price independently",
    body: "Track length, hours and local costs differ. Choosing a city updates every figure on this page and in your booking summary.",
  },
  {
    title: "You pay at the circuit",
    body: "Booking online reserves your karts; it doesn't charge your card. Card and cash are both accepted at every circuit.",
  },
];

export default function PricingPage() {
  const pricingFaqs = faqs.filter((f) => f.category === "pricing");
  const cheapest = Math.min(...pricingRules.map((r) => r.price));

  return (
    <>
      <JsonLd data={faqSchema(pricingFaqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />

      <PageHero
        eyebrow="Pricing"
        seed="helmet"
        title="What it costs, in full."
        lede="Every band we run, at every circuit, with nothing rounded up at the desk. Group discounts apply automatically and add-ons are optional."
        actions={
          <>
            <ButtonLink href="/booking">Book a session</ButtonLink>
            <ButtonLink href="/experiences" variant="outline">
              Compare formats
            </ButtonLink>
          </>
        }
        stats={[
          { label: "From", value: formatPrice(cheapest) },
          { label: "Circuits", value: "3" },
          { label: "Group discount", value: "Up to 15%" },
          { label: "Payment", value: "At the circuit" },
        ]}
      />

      <PricingExplorer />

      {/* ---- How pricing works ------------------------------------------- */}
      <Section>
        <Editorial>
          <SectionHeading
            label="How it works"
            title="Four things worth knowing."
          />

          <div className="mt-lg grid gap-x-lg gap-y-md sm:grid-cols-2">
            {HOW_PRICING_WORKS.map((item, i) => (
              <div key={item.title} className="border-t border-hairline pt-sm">
                <p className="t-caption-upper text-primary">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="t-title-md mt-xxs text-ink">{item.title}</h3>
                <p className="t-body-md mt-xxs text-body">{item.body}</p>
              </div>
            ))}
          </div>

          <p className="t-caption mt-lg border-l-2 border-info/50 pl-xs text-muted">
            Prices shown across this site are placeholder figures pending
            confirmation from the operator. They are held in one configuration file
            and can be updated — or served from a pricing API — without changing any
            page.
          </p>
        </Editorial>
      </Section>

      <Section tone="elevated">
        <Editorial>
          <div className="grid gap-lg lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading label="Pricing FAQ" title="Money questions." />
            <Accordion items={pricingFaqs} defaultOpen={pricingFaqs[0]?.id} />
          </div>
        </Editorial>
      </Section>

      <FinalCta />
    </>
  );
}
