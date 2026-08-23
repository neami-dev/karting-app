"use client";

import Link from "next/link";
import { ButtonAnchor } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";
import { directionsUrl, mapEmbedUrl } from "@/lib/booking/calendar-export";
import { whatsappLink, site } from "@/lib/data/site";
import { dayName, cx } from "@/lib/format";
import type { Location } from "@/lib/types";

/** Contact block + opening hours + map for one circuit. */
export function LocationContactPanel({
  location,
  showMap = true,
}: {
  location: Location;
  showMap?: boolean;
}) {
  const today = new Date().getDay();

  return (
    <div className="grid gap-md lg:grid-cols-2">
      <div>
        <h3 className="t-title-md text-ink">{location.name}</h3>
        <address className="t-body-md mt-xxs not-italic text-body">
          {location.address}
        </address>

        <dl className="mt-sm divide-y divide-hairline border-y border-hairline">
          <div className="flex items-baseline justify-between gap-xs py-xs">
            <dt className="t-caption-upper text-muted-soft">Phone</dt>
            <dd>
              <a
                href={`tel:${location.phone.replace(/\s/g, "")}`}
                className="t-body-md text-ink underline-offset-4 hover:underline"
              >
                {location.phone}
              </a>
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-xs py-xs">
            <dt className="t-caption-upper text-muted-soft">Email</dt>
            <dd>
              <a
                href={`mailto:${location.email}`}
                className="t-body-md break-all text-ink underline-offset-4 hover:underline"
              >
                {location.email}
              </a>
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-xs py-xs">
            <dt className="t-caption-upper text-muted-soft">WhatsApp</dt>
            <dd>
              <a
                href={whatsappLink(
                  location.whatsapp,
                  `Hi ${location.name} — I have a question about booking.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="t-body-md text-ink underline-offset-4 hover:underline"
              >
                Message this circuit
                <span className="sr-only"> — opens WhatsApp in a new tab</span>
              </a>
            </dd>
          </div>
        </dl>

        <h4 className="t-caption-upper mt-md text-muted-soft">Opening hours</h4>
        <table className="mt-xxs w-full">
          <caption className="sr-only">Opening hours for {location.name}</caption>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 0].map((day) => {
              const hours = location.openingHours.find((h) => h.day === day);
              const isToday = day === today;
              return (
                <tr
                  key={day}
                  className={cx(
                    "border-b border-hairline last:border-0",
                    isToday && "text-ink"
                  )}
                >
                  <th
                    scope="row"
                    className={cx(
                      "t-body-md py-xxs text-left font-normal",
                      isToday ? "text-ink" : "text-body"
                    )}
                  >
                    {dayName(day)}
                    {isToday && (
                      <span className="t-caption-upper ml-xxs text-ink">
                        Today
                      </span>
                    )}
                  </th>
                  <td
                    className={cx(
                      "t-body-md tabular py-xxs text-right",
                      isToday ? "text-ink" : "text-body"
                    )}
                  >
                    {hours?.opens && hours.closes
                      ? `${hours.opens} – ${hours.closes}`
                      : "Closed"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-sm flex flex-wrap gap-xxs">
          <ButtonAnchor
            href={whatsappLink(
              location.whatsapp,
              `Hi ${location.name} — I'd like to book a session.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp us
          </ButtonAnchor>
          <ButtonAnchor
            href={directionsUrl(location)}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="sm"
          >
            Get directions
          </ButtonAnchor>
        </div>

        <p className="t-caption mt-sm text-muted-soft">
          Opening hours and contact details are placeholder data pending
          confirmation. Central line:{" "}
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="underline">
            {site.phone}
          </a>
          .
        </p>
      </div>

      {showMap && (
        <div className="flex flex-col">
          <div className="relative aspect-[4/3] w-full border border-hairline lg:aspect-auto lg:flex-1">
            <iframe
              src={mapEmbedUrl(location)}
              title={`Map showing ${location.name}, ${location.address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <p className="t-caption mt-xxs text-muted-soft">
            Map data © OpenStreetMap contributors.{" "}
            <Link
              href={directionsUrl(location)}
              className="underline hover:text-ink"
            >
              Open directions
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
