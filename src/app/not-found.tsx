import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Editorial } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { listLocationsSync } from "@/lib/services/locations";

export default function NotFound() {
  const locations = listLocationsSync();

  return (
    <>
      <PageHero
        eyebrow="404"
        seed="chicane"
        title="You've run wide."
        lede="That page isn't on our map. It may have moved, or the link may have a typo in it. Here's the way back onto the circuit."
        actions={
          <>
            <ButtonLink href="/">Back to the home page</ButtonLink>
            <ButtonLink href="/booking" variant="outline">
              Book a session
            </ButtonLink>
          </>
        }
      />

      <Section size="sm">
        <Editorial>
          <h2 className="t-caption-upper text-muted-soft">Popular destinations</h2>
          <ul className="mt-sm grid gap-xxs sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/experiences", label: "All experiences" },
              { href: "/pricing", label: "Prices" },
              { href: "/kids", label: "Kids karting" },
              { href: "/adults", label: "Adult karting" },
              { href: "/events", label: "Groups & events" },
              { href: "/faq", label: "FAQ" },
              ...locations.map((l) => ({
                href: `/${l.slug}`,
                label: `Karting ${l.city}`,
              })),
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="t-body-md flex items-center justify-between border border-hairline p-xs text-ink transition-colors hover:border-ink/30"
                >
                  {link.label}
                  <span aria-hidden="true" className="text-muted">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Editorial>
      </Section>
    </>
  );
}
