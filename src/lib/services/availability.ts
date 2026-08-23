import type { DayAvailability, ServiceResult } from "@/lib/types";
import { fail, isServer, ok, request } from "@/lib/services/http";
import { generateDayAvailability } from "@/lib/availability/engine";
import { getLocationSync } from "@/lib/services/locations";
import { getExperienceSync } from "@/lib/services/experiences";

/**
 * Availability is the one read that must hit the server in the browser — it is
 * inventory, and inventory goes stale. On the server we call the engine
 * directly to avoid a pointless round trip during SSR.
 */
export async function getAvailability(
  locationId: string,
  experienceId: string,
  date: string
): Promise<ServiceResult<DayAvailability>> {
  if (isServer) {
    const location = getLocationSync(locationId);
    const experience = getExperienceSync(experienceId);
    if (!location || !experience) {
      return fail({
        code: "not_found",
        message: "That circuit and experience combination isn't available.",
      });
    }
    return ok(generateDayAvailability({ location, experience, date }));
  }

  const params = new URLSearchParams({ locationId, experienceId, date });
  return request<DayAvailability>(`/api/availability?${params}`);
}

/** Month grid — which days are selectable at all. */
export async function getMonthAvailability(
  locationId: string,
  experienceId: string,
  year: number,
  month: number
): Promise<ServiceResult<Record<string, { isOpen: boolean; hasCapacity: boolean }>>> {
  const params = new URLSearchParams({
    locationId,
    experienceId,
    year: String(year),
    month: String(month),
  });

  if (isServer) {
    const location = getLocationSync(locationId);
    const experience = getExperienceSync(experienceId);
    if (!location || !experience) {
      return fail({
        code: "not_found",
        message: "That circuit and experience combination isn't available.",
      });
    }
    const { generateMonthAvailability } = await import("@/lib/availability/engine");
    return ok(generateMonthAvailability(location, experience, year, month));
  }

  return request<Record<string, { isOpen: boolean; hasCapacity: boolean }>>(
    `/api/availability/month?${params}`
  );
}
