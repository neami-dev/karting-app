"use client";

import { usePathname } from "next/navigation";
import { useLocations } from "@/components/locations/LocationContext";
import { site, whatsappLink } from "@/lib/data/site";

/** WhatsApp icon — drawn inline so there's no icon dependency. */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24z" />
    </svg>
  );
}

/**
 * Floating WhatsApp channel. Hidden inside the booking flow so it can't compete
 * with the primary conversion path, and it sits above the mobile CTA bar.
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  const { selected } = useLocations();

  if (pathname.startsWith("/booking")) return null;

  const number = selected?.whatsapp ?? site.whatsapp;
  const message = selected
    ? `Hi ${site.name} ${selected.city} — I'd like to ask about booking a session.`
    : `Hi ${site.name} — I'd like to ask about booking a session.`;

  return (
    <a
      href={whatsappLink(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-20 right-xs z-40 flex h-14 w-14 items-center justify-center bg-success text-white shadow-soft transition-transform duration-200 hover:scale-105 md:bottom-xs md:right-md"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="sr-only">
        Need help? Message us on WhatsApp — opens in a new tab
      </span>
      <span className="t-caption-upper pointer-events-none absolute right-full mr-xxs hidden whitespace-nowrap bg-canvas-elevated px-xs py-xxs text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block">
        WhatsApp us
      </span>
    </a>
  );
}
