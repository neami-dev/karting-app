import type { Booking, Experience, Location } from "@/lib/types";

/**
 * Builds an .ics file as a data URL. Doing it client-side means "Add to
 * Calendar" works offline and needs no endpoint.
 */
export function buildIcs(
  booking: Booking,
  location: Location,
  experience: Experience
): string {
  const [y, m, d] = booking.date.split("-").map(Number);
  const [hh, mm] = booking.timeSlot.split(":").map(Number);

  const start = new Date(y, m - 1, d, hh, mm);
  const end = new Date(start.getTime() + experience.durationMin * 60_000);

  const stamp = (date: Date) =>
    `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(
      date.getUTCDate()
    ).padStart(2, "0")}T${String(date.getUTCHours()).padStart(2, "0")}${String(
      date.getUTCMinutes()
    ).padStart(2, "0")}00Z`;

  // Escape per RFC 5545 — commas, semicolons and newlines are delimiters.
  const esc = (text: string) =>
    text.replace(/\\/g, "\\\\").replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Atlas Karting//Booking//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${booking.reference}@atlaskarting.ma`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(`${experience.name} — ${location.name}`)}`,
    `DESCRIPTION:${esc(
      `Booking reference ${booking.reference}. ${booking.participants.length} racer(s). Please arrive 15 minutes early for sign-in and the safety briefing.`
    )}`,
    `LOCATION:${esc(location.address)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(`${experience.name} at ${location.name} in 2 hours`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}

export function directionsUrl(location: Location): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${location.geo.lat},${location.geo.lng}`;
}

export function mapEmbedUrl(location: Location): string {
  const { lat, lng } = location.geo;
  const delta = 0.012;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`;
}
