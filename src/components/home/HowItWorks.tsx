import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

const STEPS = [
  {
    title: "Choose your circuit and format",
    body: "Agadir, Casablanca or Marrakech — then the session that fits your group.",
  },
  {
    title: "Pick a date and a time slot",
    body: "Live availability, with remaining spots shown for every slot on the schedule.",
  },
  {
    title: "Add your racers",
    body: "Enter each racer's age and height. We match them to the right kart and price automatically.",
  },
  {
    title: "Confirm — no account needed",
    body: "Name, phone and email. You get a booking reference straight away; you pay at the circuit.",
  },
];

export function HowItWorks() {
  return (
    <Section tone="light">
      <Editorial>
        <SectionHeading
          tone="light"
          label="Booking"
          title="Four steps. About two minutes."
          lede="No signup, no password, no customer portal to remember. Just the details we need to have your karts ready."
          action={
            <ButtonLink href="/booking" size="sm">
              Start booking
            </ButtonLink>
          }
        />

        <ol className="mt-lg grid gap-x-lg gap-y-md md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border-t border-hairline-on-light pt-sm">
              <span
                aria-hidden="true"
                className="t-number-display block text-[56px] leading-none text-watermark-light"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="t-title-md mt-xs text-body-on-light">{step.title}</h3>
              <p className="t-body-md mt-xxs text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Editorial>
    </Section>
  );
}
