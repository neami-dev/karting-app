import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { ContactTabs } from "@/components/contact/ContactTabs";
import { ContactForm } from "@/components/contact/ContactForm";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/data/site";
import { listLocationsSync } from "@/lib/services/locations";
import { buildMetadata, JsonLd } from "@/lib/seo/metadata";
import { breadcrumbSchema, locationSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Contact us",
  description:
    "Phone, WhatsApp, email, opening hours and directions for Atlas Karting Agadir, Casablanca and Marrakech. Or send us a message and we'll reply within one working day.",
  path: "/contact",
  keywords: [
    "karting contact Morocco",
    "Atlas Karting phone",
    "karting Agadir address",
    "karting Casablanca directions",
  ],
});

export default function ContactPage() {
  const locations = listLocationsSync();

  return (
    <>
      {locations.map((l) => (
        <JsonLd key={l.id} data={locationSchema(l)} />
      ))}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <PageHero
        eyebrow="Contact"
        seed="pit-lane"
        title="Talk to the circuit directly."
        lede="Each circuit has its own number, WhatsApp and inbox — the people who answer are the people who run your session. WhatsApp is usually the fastest route."
        actions={
          <>
            <ButtonLink href="/booking">Book online instead</ButtonLink>
            <ButtonLink href="/faq" variant="outline">
              Check the FAQ
            </ButtonLink>
          </>
        }
      />

      <Section>
        <Editorial>
          <SectionHeading
            label="Circuits"
            title="Choose where you're racing."
            lede="Contact details, opening hours and directions update with your choice."
          />
          <div className="mt-lg">
            <ContactTabs />
          </div>
        </Editorial>
      </Section>

      <Section tone="elevated">
        <Editorial>
          <div className="grid gap-lg lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <SectionHeading
                label="Send a message"
                title="Anything the FAQ doesn't cover."
                lede="We reply within one working day. For bookings, the online flow is quicker than waiting on us."
              />

              <dl className="mt-md divide-y divide-hairline border-y border-hairline">
                <div className="flex items-baseline justify-between gap-xs py-xs">
                  <dt className="t-caption-upper text-muted-soft">Central line</dt>
                  <dd>
                    <a
                      href={`tel:${site.phone.replace(/\s/g, "")}`}
                      className="t-body-md text-ink underline-offset-4 hover:underline"
                    >
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-xs py-xs">
                  <dt className="t-caption-upper text-muted-soft">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${site.email}`}
                      className="t-body-md break-all text-ink underline-offset-4 hover:underline"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-xs py-xs">
                  <dt className="t-caption-upper text-muted-soft">Events</dt>
                  <dd className="t-body-md text-right text-ink">
                    <Link href="/events#enquiry" className="underline-offset-4 hover:underline">
                      Request an event quote
                    </Link>
                  </dd>
                </div>
              </dl>

              <h2 className="t-caption-upper mt-md text-muted-soft">Follow</h2>
              <ul className="mt-xxs flex flex-wrap gap-xs">
                {Object.entries(site.social).map(([name, href]) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-body-md capitalize text-body underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      {name}
                      <span className="sr-only"> — opens in a new tab</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <ContactForm />
          </div>
        </Editorial>
      </Section>
    </>
  );
}
