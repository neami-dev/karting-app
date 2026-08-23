import { addOns, experiences } from "@/lib/data/experiences";
import { getLocationSync } from "@/lib/services/locations";
import type { AddOn, Experience, ServiceResult } from "@/lib/types";
import { fail, ok } from "@/lib/services/http";

/** All experiences, optionally narrowed to those a circuit actually offers. */
export function listExperiencesSync(locationSlugOrId?: string): Experience[] {
  if (!locationSlugOrId) return experiences;
  const location = getLocationSync(locationSlugOrId);
  if (!location) return [];
  return experiences.filter((e) => location.experienceIds.includes(e.id));
}

export async function getExperiences(
  locationSlugOrId?: string
): Promise<ServiceResult<Experience[]>> {
  return ok(listExperiencesSync(locationSlugOrId));
}

export function getExperienceSync(slugOrId: string): Experience | null {
  return experiences.find((e) => e.slug === slugOrId || e.id === slugOrId) ?? null;
}

export async function getExperience(
  slugOrId: string
): Promise<ServiceResult<Experience>> {
  const found = getExperienceSync(slugOrId);
  if (!found) {
    return fail({
      code: "not_found",
      message: `We couldn't find the experience "${slugOrId}".`,
    });
  }
  return ok(found);
}

export function getAddOnsSync(ids: string[]): AddOn[] {
  return ids
    .map((id) => addOns.find((a) => a.id === id))
    .filter((a): a is AddOn => Boolean(a));
}
