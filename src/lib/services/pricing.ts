import type { BookingParticipant, Quote, ServiceResult } from "@/lib/types";
import { isServer, ok, fail, request } from "@/lib/services/http";
import { calculateQuote, startingPrice } from "@/lib/pricing/engine";
import { getExperienceSync } from "@/lib/services/experiences";
import { pricingRules } from "@/lib/data/pricing-rules";

export interface QuoteRequest {
  locationId: string;
  experienceId: string;
  participants: BookingParticipant[];
  addOnIds?: string[];
}

/**
 * Used for the live summary. The number shown here is a *preview* — the booking
 * API recalculates from scratch and its result is the one that counts.
 */
export async function getQuote(input: QuoteRequest): Promise<ServiceResult<Quote>> {
  const experience = getExperienceSync(input.experienceId);
  if (!experience) {
    return fail({
      code: "not_found",
      message: "That experience is no longer offered. Please pick another.",
    });
  }
  const quote = calculateQuote({
    experience,
    locationId: input.locationId,
    participants: input.participants,
    addOnIds: input.addOnIds,
  });
  return ok(quote);
}

/** Synchronous variant for instant UI feedback with no loading flash. */
export function quoteSync(input: QuoteRequest): Quote | null {
  const experience = getExperienceSync(input.experienceId);
  if (!experience) return null;
  return calculateQuote({
    experience,
    locationId: input.locationId,
    participants: input.participants,
    addOnIds: input.addOnIds,
  });
}

export async function getPricingRules(experienceId?: string) {
  const rules = experienceId
    ? pricingRules.filter((r) => r.experienceId === experienceId)
    : pricingRules;
  return ok(rules);
}

export { startingPrice };
export const __isServer = isServer;
