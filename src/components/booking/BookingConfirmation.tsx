"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TrackVisual } from "@/components/visuals/TrackVisual";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/States";
import { Skeleton } from "@/components/ui/Skeleton";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";
import { getLocationSync } from "@/lib/services/locations";
import { getExperienceSync } from "@/lib/services/experiences";
import { buildIcs, directionsUrl } from "@/lib/booking/calendar-export";
import { site, whatsappLink } from "@/lib/data/site";
import { formatDateLong, formatDuration, formatPrice, formatWeekday } from "@/lib/format";
import type { Booking } from "@/lib/types";

const ARRIVAL_NOTES = [
  "Arrive 15 minutes before your slot for sign-in, kit fitting and the safety briefing.",
  "Closed shoes are required on track — no sandals or open heels.",
  "Helmet, race suit, neck brace and balaclava are provided for every racer.",
  "Payment is taken at the circuit. Card and cash are both accepted.",
];

export function BookingConfirmation({ reference }: { reference: string }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  // The wizard stashes the booking on submit; sessionStorage keeps the
  // confirmation working on refresh without needing an account to look it up.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(`atlas.booking.${reference}`);
      if (raw) {
        setBooking(JSON.parse(raw) as Booking);
        setStatus("ready");
        return;
      }
    } catch {
      /* storage unavailable */
    }
    setStatus("missing");
  }, [reference]);

  if (status === "loading") {
    return (
      <div className="editorial py-xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-sm h-16 w-full max-w-[32rem]" />
        <Skeleton className="mt-sm h-64 w-full" />
      </div>
    );
  }

  if (status === "missing" || !booking) {
    return (
      <div className="editorial py-xl">
        <ErrorState
          tone="info"
          title="We can't show this booking here"
          message={`Booking ${reference} isn't available in this browser session — that happens if you've refreshed on a different device or cleared your data. Your booking still stands: check your confirmation email, or send us the reference on WhatsApp and we'll pull it up.`}
          action={
            <>
              <ButtonAnchor
                href={whatsappLink(
                  site.whatsapp,
                  `Hi ${site.name} — could you confirm my booking ${reference}?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Check on WhatsApp
              </ButtonAnchor>
              <ButtonLink href="/booking" variant="outline" size="sm">
                Make a new booking
              </ButtonLink>
            </>
          }
        />
      </div>
    );
  }

  const location = getLocationSync(booking.locationId);
  const experience = getExperienceSync(booking.experienceId);

  if (!location || !experience) {
    return (
      <div className="editorial py-xl">
        <ErrorState
          title="This booking references a circuit we can't find"
          message={`Booking ${reference} is saved, but we can't load its circuit details. Please contact us with this reference and we'll confirm everything.`}
        />
      </div>
    );
  }

  const whatsappConfirm = whatsappLink(
    location.whatsapp,
    `Hi ${location.name} — confirming my booking ${booking.reference}: ${experience.name} on ${formatDateLong(booking.date)} at ${booking.timeSlot} for ${booking.participants.length} racer(s).`
  );

  return (
    <>
      {/* ---- Confirmation hero ------------------------------------------ */}
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <TrackVisual seed="podium" overlay="strong" fill className="-z-10" />

        <div className="editorial py-xl">
          <div className="animate-rise">
            <p className="t-caption-upper flex items-center gap-xxs text-success">
              <span className="h-px w-8 bg-success" aria-hidden="true" />
              Booking confirmed
            </p>

            <h1 className="t-display-xl mt-sm text-ink">
              You&apos;re on the grid, {booking.customer.fullName.split(" ")[0]}.
            </h1>

            <p className="t-body-md mt-xs max-w-[36rem] text-body">
              We&apos;ve sent a confirmation to {booking.customer.email}. Keep your
              reference handy — it&apos;s all you need at the desk.
            </p>

            <p className="mt-lg inline-flex flex-col border border-hairline bg-canvas/80 px-sm py-xs backdrop-blur-sm">
              <span className="t-caption-upper text-muted-soft">
                Booking reference
              </span>
              <span className="tabular text-[26px] font-medium leading-tight text-ink">
                {booking.reference}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ---- Details ----------------------------------------------------- */}
      <div className="editorial grid gap-lg py-xl lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="grid grid-cols-2 gap-x-sm border-y border-hairline sm:grid-cols-4">
            {[
              { label: "Day", value: formatWeekday(booking.date) },
              {
                label: "Date",
                value: new Date(booking.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                }),
              },
              { label: "Time", value: booking.timeSlot },
              { label: "Racers", value: String(booking.participants.length) },
            ].map((item) => (
              <div key={item.label} className="py-sm">
                <p className="t-caption-upper text-muted-soft">{item.label}</p>
                <p className="tabular mt-xxxs text-[26px] font-medium leading-none text-ink">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <dl className="mt-md divide-y divide-hairline border-y border-hairline">
            {[
              { label: "Circuit", value: location.name },
              { label: "Address", value: location.address },
              {
                label: "Experience",
                value: `${experience.name} · ${formatDuration(experience.durationMin)}`,
              },
              { label: "Booked by", value: booking.customer.fullName },
              { label: "Phone", value: booking.customer.phone },
              { label: "Email", value: booking.customer.email },
              ...(booking.customer.specialRequest
                ? [{ label: "Your note", value: booking.customer.specialRequest }]
                : []),
            ].map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-xxxs py-xs sm:flex-row sm:justify-between sm:gap-sm"
              >
                <dt className="t-caption-upper shrink-0 text-muted-soft">{row.label}</dt>
                <dd className="t-body-md text-ink sm:text-right">{row.value}</dd>
              </div>
            ))}
          </dl>

          {/* Racers */}
          <h2 className="t-title-md mt-lg text-ink">Your grid</h2>
          <ul className="mt-xs divide-y divide-hairline border-y border-hairline">
            {booking.participants.map((p, i) => (
              <li key={p.id} className="flex items-center justify-between gap-xs py-xs">
                <span className="t-body-md text-ink">
                  {p.name || `Racer ${i + 1}`}
                  <span className="t-caption ml-xxs text-muted-soft">
                    {p.age} yrs · {p.heightCm} cm
                  </span>
                </span>
                <span className="flex items-center gap-xs">
                  <Badge tone="outline">{p.categoryLabel}</Badge>
                  <span className="t-body-md tabular text-ink">
                    {formatPrice(p.price ?? 0)}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div className="mt-sm flex flex-col gap-xxs">
            {booking.addOns.map((a) => (
              <p key={a.id} className="flex justify-between gap-xs">
                <span className="t-body-md text-body">
                  {a.quantity > 1 ? `${a.quantity} × ` : ""}
                  {a.name}
                </span>
                <span className="t-body-md tabular text-ink">
                  {formatPrice(a.total)}
                </span>
              </p>
            ))}

            {booking.discount > 0 && (
              <p className="flex justify-between gap-xs text-success">
                <span className="t-body-md">Group discount</span>
                <span className="t-body-md tabular">
                  −{formatPrice(booking.discount)}
                </span>
              </p>
            )}

            <p className="mt-xxs flex items-baseline justify-between gap-xs border-t border-hairline pt-sm">
              <span className="t-caption-upper text-muted-soft">Total to pay at the circuit</span>
              <span className="tabular text-[36px] font-medium leading-none text-ink">
                {formatPrice(booking.total)}
              </span>
            </p>
          </div>
        </div>

        {/* ---- Actions --------------------------------------------------- */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="border border-hairline bg-canvas-elevated p-sm">
            <h2 className="t-caption-upper flex items-center gap-xxs text-ink">
              <span className="h-px w-6 bg-primary" aria-hidden="true" />
              Before you arrive
            </h2>

            <div className="mt-sm flex flex-col gap-xxs">
              <ButtonAnchor
                href={buildIcs(booking, location, experience)}
                download={`atlas-karting-${booking.reference}.ics`}
                fullWidth
              >
                Add to Calendar
              </ButtonAnchor>

              <ButtonAnchor
                href={directionsUrl(location)}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                fullWidth
              >
                Get Directions
              </ButtonAnchor>

              <ButtonAnchor
                href={whatsappConfirm}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                fullWidth
              >
                <WhatsAppIcon className="h-4 w-4" />
                Send confirmation to WhatsApp
              </ButtonAnchor>

              <a
                href={`tel:${location.phone.replace(/\s/g, "")}`}
                className="t-body-md mt-xxs text-body underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Call the circuit — {location.phone}
              </a>
            </div>

            <ul className="mt-sm flex flex-col gap-xs border-t border-hairline pt-sm">
              {ARRIVAL_NOTES.map((note) => (
                <li key={note} className="t-body-sm flex gap-xxs text-body">
                  <span aria-hidden="true" className="text-primary">
                    —
                  </span>
                  {note}
                </li>
              ))}
            </ul>

            <p className="t-caption mt-sm border-t border-hairline pt-sm text-muted-soft">
              Need to change or cancel? Message the circuit with your reference at
              least 24 hours before your session and we&apos;ll move you free of
              charge. See the{" "}
              <Link href="/faq" className="underline hover:text-ink">
                FAQ
              </Link>{" "}
              for the full policy.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
