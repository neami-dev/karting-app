import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { faqs } from "@/lib/data/faq";

const PREVIEW = [
  "faq_min_age",
  "faq_min_height",
  "faq_shoes",
  "faq_equipment",
  "faq_session_length",
  "faq_children",
  "faq_group_booking",
  "faq_change",
];

export function FaqPreview() {
  const items = PREVIEW.map((id) => faqs.find((f) => f.id === id)).filter(
    (f): f is NonNullable<typeof f> => Boolean(f)
  );

  return (
    <Section tone="elevated">
      <Editorial>
        <div className="grid gap-lg lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading
              label="Questions"
              title="Everything you'd ask at the desk."
              lede="The eight we're asked most. There are plenty more on the full FAQ page."
            />
            <ButtonLink href="/faq" variant="outline" size="sm" className="mt-sm">
              View All FAQs
            </ButtonLink>
          </div>

          <Accordion items={items} defaultOpen={items[0]?.id} />
        </div>
      </Editorial>
    </Section>
  );
}
