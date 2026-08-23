import { locations } from "@/lib/data/locations";
import type { Location, ServiceResult } from "@/lib/types";
import { fail, ok } from "@/lib/services/http";

/**
 * Location reads are static enough to resolve from the data module in both
 * environments. When these move behind a CMS or API, only this file changes.
 */

export async function getLocations(): Promise<ServiceResult<Location[]>> {
  return ok(locations);
}

export async function getLocation(
  slugOrId: string
): Promise<ServiceResult<Location>> {
  const found = locations.find(
    (l) => l.slug === slugOrId || l.id === slugOrId
  );
  if (!found) {
    return fail({
      code: "not_found",
      message: `We don't have a circuit called "${slugOrId}". Choose Agadir, Casablanca or Marrakech.`,
    });
  }
  return ok(found);
}

export function getLocationSync(slugOrId: string): Location | null {
  return locations.find((l) => l.slug === slugOrId || l.id === slugOrId) ?? null;
}

export function listLocationsSync(): Location[] {
  return locations;
}
