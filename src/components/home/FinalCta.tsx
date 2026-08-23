"use client";

import { ButtonLink, ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";
import { TrackVisual } from "@/components/visuals/TrackVisual";
import { useLocations } from "@/components/locations/LocationContext";
import { site, whatsappLink } from "@/lib/data/site";

/** cta-band-dark, with the plate carrying the depth rather than a shadow. */
export function FinalCta() {
  const { selected } = useLocations();
  const number = selected?.whatsapp ?? site.whatsapp;

  return (
    <section className="relative isolate overflow-hidden border-t border-hairline">
      <TrackVisual seed="grid-start" overlay="strong" className="absolute inset-0 -z-10" />

      <div className="editorial flex flex-col items-center py-xxl text-center">
        <p className="t-caption-upper flex items-center gap-xxs text-ink">
          <span className="h-px w-8 bg-primary" aria-hidden="true" />
          Lights out
        </p>

        <h2 className="t-display-xl mt-sm max-w-2xl text-balance text-ink">
          Ready to race?
        </h2>

        <p className="t-body-md mt-xs max-w-lg text-pretty text-body">
          Pick a slot, add your racers, and we&apos;ll have the karts warmed up.
          Takes about two minutes and you don&apos;t need an account.
        </p>

        <div className="mt-lg flex w-full max-w-md flex-col gap-xxs sm:flex-row">
          <ButtonLink
            href={selected ? `/booking?location=${selected.slug}` : "/booking"}
            className="flex-1"
            size="lg"
          >
            Book Your Session
          </ButtonLink>
          <ButtonAnchor
            href={whatsappLink(
              number,
              `Hi ${site.name}${selected ? ` ${selected.city}` : ""} — I'd like to book a session.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Book via WhatsApp
          </ButtonAnchor>
        </div>
      </div>
    </section>
  );
}
