import type {
  BookingParticipant,
  EligibilityIssue,
  EligibilityRule,
  Experience,
  PricedParticipant,
  PricingRule,
  Quote,
  QuoteLine,
} from "@/lib/types";
import { addOns } from "@/lib/data/experiences";
import { discountTiers, pricingRules } from "@/lib/data/pricing-rules";

/**
 * PRICING ENGINE
 * --------------
 * Pure functions, no I/O. Imported by both the booking UI (for live preview)
 * and the API route (for the authoritative recalculation). The client's own
 * total is never trusted — see `app/api/bookings/route.ts`.
 */

export interface QuoteInput {
  experience: Experience;
  locationId: string;
  participants: BookingParticipant[];
  addOnIds?: string[];
}

/** Location-specific rules take precedence over the global (`null`) ones. */
export function rulesFor(experienceId: string, locationId: string): PricingRule[] {
  const all = pricingRules.filter((r) => r.experienceId === experienceId);
  const local = all.filter((r) => r.locationId === locationId);
  const global = all.filter((r) => r.locationId === null);

  // A local rule shadows the global rule for the same category.
  const shadowed = new Set(local.map((r) => r.category));
  return [...local, ...global.filter((r) => !shadowed.has(r.category))];
}

function matchesEligibility(
  rule: EligibilityRule,
  age: number,
  heightCm: number
): boolean {
  if (rule.minAge !== undefined && age < rule.minAge) return false;
  if (rule.maxAge !== undefined && age > rule.maxAge) return false;
  if (rule.minHeightCm !== undefined && heightCm < rule.minHeightCm) return false;
  if (rule.maxHeightCm !== undefined && heightCm > rule.maxHeightCm) return false;
  return true;
}

/**
 * Explains *why* a participant doesn't fit — the UI needs the specific reason,
 * never a generic "invalid".
 */
export function explainIneligibility(
  experience: Experience,
  age: number,
  heightCm: number
): { code: EligibilityIssue["code"]; message: string } | null {
  const e = experience.eligibility;

  if (e.minAge !== undefined && age < e.minAge) {
    return {
      code: "below_min_age",
      message: `${experience.name} has a minimum age of ${e.minAge}. This racer is ${age}.`,
    };
  }
  if (e.maxAge !== undefined && age > e.maxAge) {
    return {
      code: "above_max_age",
      message: `${experience.name} is for ages ${e.minAge ?? 0}–${e.maxAge}. This racer is ${age} — try our adult sessions instead.`,
    };
  }
  if (e.minHeightCm !== undefined && heightCm < e.minHeightCm) {
    return {
      code: "below_min_height",
      message: `${experience.name} requires a minimum height of ${e.minHeightCm} cm so the pedals and harness fit correctly. This racer is ${heightCm} cm.`,
    };
  }
  if (e.maxHeightCm !== undefined && heightCm > e.maxHeightCm) {
    return {
      code: "above_max_height",
      message: `${experience.name} has a maximum height of ${e.maxHeightCm} cm. This racer is ${heightCm} cm.`,
    };
  }
  return null;
}

/** Resolve which pricing rule (and therefore price) applies to a racer. */
export function resolveRule(
  experienceId: string,
  locationId: string,
  age: number,
  heightCm: number
): PricingRule | null {
  const candidates = rulesFor(experienceId, locationId);
  return (
    candidates.find((r) => matchesEligibility(r.eligibility, age, heightCm)) ?? null
  );
}

/**
 * Which price band a racer belongs to, tolerating a partially-filled form.
 *
 * The booking UI needs this while the customer is still typing: a racer with an
 * age but no height yet has no *exact* band, but they clearly belong to the one
 * their age falls in. Without the age-only fallback the quantity steppers can't
 * tell those racers apart, and removing one takes the wrong racer.
 *
 * Pricing never uses this — `calculateQuote` requires an exact match.
 */
export function resolveBandId(
  experienceId: string,
  locationId: string,
  age: number,
  heightCm: number
): string | null {
  if (age > 0 && heightCm > 0) {
    const exact = resolveRule(experienceId, locationId, age, heightCm);
    if (exact) return exact.id;
  }
  if (age > 0) {
    const byAge = rulesFor(experienceId, locationId).find((r) => {
      const { minAge = 0, maxAge = 200 } = r.eligibility;
      return age >= minAge && age <= maxAge;
    });
    if (byAge) return byAge.id;
  }
  return null;
}

const isFinitePositive = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n) && n > 0;

/**
 * The single entry point. Returns priced lines, a total, and — critically — a
 * list of eligibility issues so the UI can block an invalid booking with a
 * message that actually explains the problem.
 */
export function calculateQuote(input: QuoteInput): Quote {
  const { experience, locationId, participants, addOnIds = [] } = input;

  const issues: EligibilityIssue[] = [];
  const priced: PricedParticipant[] = [];

  participants.forEach((p, index) => {
    if (!isFinitePositive(p.age) || !isFinitePositive(p.heightCm)) {
      issues.push({
        participantId: p.id,
        participantIndex: index,
        code: "missing_details",
        message: `Enter an age and height for racer ${index + 1} so we can confirm eligibility and price.`,
      });
      return;
    }

    const problem = explainIneligibility(experience, p.age, p.heightCm);
    if (problem) {
      issues.push({
        participantId: p.id,
        participantIndex: index,
        code: problem.code,
        message: problem.message,
      });
      return;
    }

    const rule = resolveRule(experience.id, locationId, p.age, p.heightCm);
    if (!rule) {
      issues.push({
        participantId: p.id,
        participantIndex: index,
        code: "no_matching_rule",
        message: `We don't have a price band for a ${p.age}-year-old at ${p.heightCm} cm on ${experience.name}. Message us on WhatsApp and we'll sort it out.`,
      });
      return;
    }

    priced.push({
      id: p.id,
      name: p.name,
      age: p.age,
      heightCm: p.heightCm,
      category: rule.category,
      categoryLabel: rule.label,
      price: rule.price,
    });
  });

  // Group identical category+price into display lines.
  const lineMap = new Map<string, QuoteLine>();
  for (const p of priced) {
    const key = `${p.categoryLabel}::${p.price}`;
    const existing = lineMap.get(key);
    if (existing) {
      existing.quantity += 1;
      existing.total += p.price;
    } else {
      lineMap.set(key, {
        categoryLabel: p.categoryLabel,
        unitPrice: p.price,
        quantity: 1,
        total: p.price,
      });
    }
  }
  const lines = [...lineMap.values()].sort((a, b) => b.unitPrice - a.unitPrice);

  const participantsSubtotal = lines.reduce((sum, l) => sum + l.total, 0);

  // Add-ons — only those the experience actually offers.
  const allowed = new Set(experience.addOnIds);
  const addOnLines: QuoteLine[] = addOnIds
    .filter((id) => allowed.has(id))
    .map((id) => addOns.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map((a) => {
      const quantity = a.unit === "per_person" ? Math.max(priced.length, 0) : 1;
      return {
        categoryLabel: a.name,
        unitPrice: a.price,
        quantity,
        total: a.price * quantity,
      };
    })
    .filter((l) => l.quantity > 0);

  const addOnsSubtotal = addOnLines.reduce((sum, l) => sum + l.total, 0);
  const subtotal = participantsSubtotal + addOnsSubtotal;

  // Volume discount applies to the racing lines only, not add-ons.
  const tier = [...discountTiers]
    .sort((a, b) => b.minParticipants - a.minParticipants)
    .find((t) => priced.length >= t.minParticipants);

  const discount = tier ? Math.round(participantsSubtotal * tier.rate) : 0;

  const hasEnoughRacers = participants.length >= experience.minParticipants;
  const withinCapacity = participants.length <= experience.maxParticipants;

  return {
    currency: "MAD",
    lines,
    addOnLines,
    subtotal,
    discount,
    discountLabel: tier?.label,
    total: Math.max(subtotal - discount, 0),
    participants: priced,
    issues,
    isValid:
      issues.length === 0 &&
      priced.length > 0 &&
      hasEnoughRacers &&
      withinCapacity,
  };
}

/**
 * "From" price for cards and pricing tables — the cheapest rule available for
 * an experience, optionally scoped to one location.
 */
export function startingPrice(
  experienceId: string,
  locationId?: string
): number | null {
  const rules = locationId
    ? rulesFor(experienceId, locationId)
    : pricingRules.filter((r) => r.experienceId === experienceId);
  if (rules.length === 0) return null;
  return Math.min(...rules.map((r) => r.price));
}
