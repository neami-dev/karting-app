import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Editorial } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { FaqExplorer } from "@/components/faq/FaqExplorer";
import { FinalCta } from "@/components/home/FinalCta";
import { faqs, faqCategories } from "@/lib/data/faq";
import { buildMetadata, JsonLd } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Frequently asked questions",
  description:
    "Minimum age and height, what to wear, whether equipment is provided, how long a session lasts, cancellation policy and group discounts — everything we get asked about karting at Atlas Karting.",
  path: "/faq",
  keywords: [
    "karting minimum age Morocco",
    "karting height requirement",
    "karting what to wear",
    "karting cancellation",
  ],
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />

      <PageHero
        eyebrow="FAQ"
        seed="helmet"
        title="Answers, before you have to ask."
        lede={`${faqs.length} questions across ${faqCategories.length} categories — booking, age and height, safety, pricing and the track itself. Search or browse.`}
        actions={
          <>
            <ButtonLink href="/booking">Book a session</ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Ask us directly
            </ButtonLink>
          </>
        }
      />

      <Section>
        <Editorial>
          <FaqExplorer />
        </Editorial>
      </Section>

      <FinalCta />
    </>
  );
}
