/**
 * Domain model for the karting platform.
 *
 * These types describe the frontend/backend boundary. Everything the UI renders
 * flows through them, so replacing the mock data source with a real API means
 * changing `lib/services/*` only — no component touches raw data.
 */

/* ---------------------------------------------------------------- Locations */

export type LocationSlug = string;

export interface OpeningHours {
  /** 0 = Sunday … 6 = Saturday */
  day: number;
  /** "10:00" — null/null means closed that day */
  opens: string | null;
  closes: string | null;
}

export interface Track {
  id: string;
  name: string;
  /** metres */
  lengthM: number;
  turns: number;
  /** metres */
  widthM: number;
  surface: string;
  /** Free-form notes shown in the track spec table */
  layoutNotes: string;
  isIndoor: boolean;
}

export interface KartType {
  id: string;
  name: string;
  /** Marketing-friendly power label, e.g. "270cc / 9hp" */
  powerLabel: string;
  topSpeedKph: number;
  /** Which participant categories may drive it */
  categories: ParticipantCategoryId[];
  seats: number;
  features: string[];
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Location {
  id: string;
  slug: LocationSlug;
  /** City name, used in nav and SEO */
  city: string;
  /** Full circuit name, e.g. "Atlas Karting Agadir" */
  name: string;
  tagline: string;
  description: string;
  address: string;
  geo: GeoPoint;
  phone: string;
  /** E.164 without "+" — wa.me format */
  whatsapp: string;
  email: string;
  openingHours: OpeningHours[];
  tracks: Track[];
  kartTypes: KartType[];
  /** Experience ids offered at this location */
  experienceIds: string[];
  /** IANA timezone, used for slot generation */
  timezone: string;
  highlights: string[];
  /** Marks data that is placeholder pending real business input */
  dataStatus: "placeholder" | "confirmed";
}

/* -------------------------------------------------------------- Experiences */

export type ExperienceCategory = "karting" | "events" | "activities";

export type ParticipantCategoryId = "child" | "junior" | "adult" | "passenger";

export interface ParticipantCategory {
  id: ParticipantCategoryId;
  label: string;
  /** Short helper shown under the stepper */
  hint: string;
}

export interface EligibilityRule {
  minAge?: number;
  maxAge?: number;
  /** centimetres */
  minHeightCm?: number;
  maxHeightCm?: number;
}

/**
 * A pricing rule binds an eligibility window to a price for one experience.
 * The first matching rule (by declaration order) wins, so put narrower rules
 * first. Ranges are configurable per location — never hardcode them in the UI.
 */
export interface PricingRule {
  id: string;
  experienceId: string;
  /** null = applies at every location */
  locationId: string | null;
  category: ParticipantCategoryId;
  label: string;
  eligibility: EligibilityRule;
  /** Minor-unit-free integer price in MAD */
  price: number;
  currency: "MAD";
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  /** "per_person" multiplies by participant count, "per_booking" is flat */
  unit: "per_person" | "per_booking";
}

export interface Experience {
  id: string;
  slug: string;
  name: string;
  category: ExperienceCategory;
  /** One-line card description */
  summary: string;
  description: string;
  /** minutes */
  durationMin: number;
  /** Number of timed laps or heats, when applicable */
  formatLabel: string;
  eligibility: EligibilityRule;
  minParticipants: number;
  maxParticipants: number;
  /** Categories this experience accepts */
  categories: ParticipantCategoryId[];
  features: string[];
  requirements: string[];
  addOnIds: string[];
  /** Visual seed drives the generated cinema plate */
  visual: VisualSeed;
  /** Show on the home page featured grid */
  featured: boolean;
  /** Bookable online, vs. enquiry-only (large corporate events) */
  bookingMode: "instant" | "enquiry";
}

export type VisualSeed =
  | "grid-start"
  | "apex"
  | "night-track"
  | "podium"
  | "pit-lane"
  | "helmet"
  | "chicane"
  | "confetti"
  | "aerial";

/* ------------------------------------------------------------- Availability */

export interface AvailabilitySlot {
  /** "HH:mm" in the location's local timezone */
  time: string;
  /** ISO datetime for calendar exports */
  startsAt: string;
  capacity: number;
  spotsAvailable: number;
  status: "available" | "limited" | "sold_out";
}

export interface DayAvailability {
  /** "YYYY-MM-DD" */
  date: string;
  isOpen: boolean;
  /** Reason shown when the day is unavailable */
  closedReason?: string;
  slots: AvailabilitySlot[];
}

/* ----------------------------------------------------------------- Booking */

export interface BookingParticipant {
  id: string;
  /** Optional — not required to price, but nice on the confirmation */
  name?: string;
  age: number;
  /** centimetres */
  heightCm: number;
  /** Resolved by the pricing engine, never sent by the client */
  category?: ParticipantCategoryId;
  categoryLabel?: string;
  price?: number;
}

export interface Customer {
  fullName: string;
  phone: string;
  email: string;
  specialRequest?: string;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface Booking {
  id: string;
  reference: string;
  locationId: string;
  experienceId: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:mm" */
  timeSlot: string;
  customer: Customer;
  participants: BookingParticipant[];
  addOns: { id: string; name: string; quantity: number; total: number }[];
  subtotal: number;
  discount: number;
  total: number;
  currency: "MAD";
  status: BookingStatus;
  createdAt: string;
}

/* ------------------------------------------------------- Pricing / quoting */

export interface QuoteLine {
  categoryLabel: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface EligibilityIssue {
  participantId: string;
  participantIndex: number;
  code:
    | "below_min_age"
    | "above_max_age"
    | "below_min_height"
    | "above_max_height"
    | "no_matching_rule"
    | "missing_details";
  message: string;
}

export interface PricedParticipant {
  id: string;
  age: number;
  heightCm: number;
  name?: string;
  category: ParticipantCategoryId;
  categoryLabel: string;
  price: number;
}

export interface Quote {
  currency: "MAD";
  lines: QuoteLine[];
  addOnLines: QuoteLine[];
  subtotal: number;
  discount: number;
  discountLabel?: string;
  total: number;
  participants: PricedParticipant[];
  issues: EligibilityIssue[];
  isValid: boolean;
}

/* ------------------------------------------------------------------- Misc */

export interface Review {
  id: string;
  author: string;
  locationId: string | null;
  rating: number;
  body: string;
  date: string;
  source: "google" | "instagram" | "onsite";
}

export interface FaqItem {
  id: string;
  category: "booking" | "age_height" | "safety" | "pricing" | "track";
  question: string;
  answer: string;
}

/** Discriminated result so services can surface real errors, not "went wrong" */
export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ServiceError };

export interface ServiceError {
  code:
    | "not_found"
    | "validation"
    | "conflict"
    | "unavailable"
    | "network"
    | "server";
  message: string;
  /** Field-level messages for form errors */
  fields?: Record<string, string>;
}
