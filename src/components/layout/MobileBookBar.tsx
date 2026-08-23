"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocations } from "@/components/locations/LocationContext";

/**
 * Sticky mobile conversion bar. Suppressed inside the booking flow, which has
 * its own sticky footer showing the live total.
 */
export function MobileBookBar() {
  const pathname = usePathname();
  const { selected } = useLocations();

  if (pathname.startsWith("/booking")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas/95 backdrop-blur-md md:hidden">
      <div className="flex items-stretch gap-xxs px-xs py-xxs">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="t-caption-upper text-muted-soft">
            {selected ? selected.city : "Choose your circuit"}
          </p>
          <p className="t-body-sm truncate text-ink">
            {selected ? "Sessions from 90 MAD" : "Agadir · Casablanca · Marrakech"}
          </p>
        </div>
        <Link
          href="/booking"
          className="t-button flex h-12 shrink-0 items-center justify-center bg-primary px-md text-on-primary active:bg-primary-active"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
