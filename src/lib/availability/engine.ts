import type { AvailabilitySlot, DayAvailability, Experience, Location } from "@/lib/types";

/**
 * AVAILABILITY
 * ------------
 * Slot generation is deterministic: the same (location, experience, date) always
 * yields the same result. That matters for two reasons — the server render and
 * the client hydration must agree, and a "mock" that reshuffles on every render
 * would be presenting fake availability as if it were live.
 *
 * When the real booking backend arrives, `getAvailability` in
 * `lib/services/availability.ts` calls it instead and this file goes away.
 */

/** Deterministic 32-bit hash → stable pseudo-randomness per slot. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** How far ahead bookings open, and the cut-off before a session starts. */
export const BOOKING_WINDOW_DAYS = 60;
export const MIN_LEAD_MINUTES = 90;

export interface AvailabilityQuery {
  location: Location;
  experience: Experience;
  date: string;
  /** Injected so tests and the server agree on "now" */
  now?: Date;
}

export function generateDayAvailability({
  location,
  experience,
  date,
  now = new Date(),
}: AvailabilityQuery): DayAvailability {
  const day = parseDateKey(date);
  const weekday = day.getDay();
  const hours = location.openingHours.find((h) => h.day === weekday);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isPast = day.getTime() < today.getTime();

  if (isPast) {
    return {
      date,
      isOpen: false,
      closedReason: "This date has already passed.",
      slots: [],
    };
  }

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + BOOKING_WINDOW_DAYS);
  if (day.getTime() > maxDate.getTime()) {
    return {
      date,
      isOpen: false,
      closedReason: `We open bookings ${BOOKING_WINDOW_DAYS} days ahead. Try an earlier date.`,
      slots: [],
    };
  }

  if (!hours || !hours.opens || !hours.closes) {
    return {
      date,
      isOpen: false,
      closedReason: `${location.name} is closed on this day.`,
      slots: [],
    };
  }

  // Sessions run on a fixed cadence sized to the experience.
  const cadence = experience.durationMin <= 20 ? 30 : Math.ceil(experience.durationMin / 30) * 30;
  const open = timeToMinutes(hours.opens);
  let close = timeToMinutes(hours.closes);
  if (close <= open) close += 24 * 60; // past-midnight closing

  const isToday = day.getTime() === today.getTime();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: AvailabilitySlot[] = [];

  for (let t = open; t + experience.durationMin <= close; t += cadence) {
    if (isToday && t < nowMinutes + MIN_LEAD_MINUTES) continue;

    const time = minutesToTime(t);
    const seed = hash(`${location.id}|${experience.id}|${date}|${time}`);

    // Capacity is the experience ceiling; how much is already taken varies.
    const capacity = experience.maxParticipants;

    // Weekends and evenings fill up first — a realistic shape, still deterministic.
    const isWeekend = weekday === 0 || weekday === 5 || weekday === 6;
    const isEvening = t % (24 * 60) >= 18 * 60;
    const pressure = (isWeekend ? 0.25 : 0) + (isEvening ? 0.2 : 0);

    const takenRatio = Math.min(seed + pressure, 1.15);
    const spotsAvailable = Math.max(0, Math.round(capacity * (1 - takenRatio)));

    const status: AvailabilitySlot["status"] =
      spotsAvailable === 0
        ? "sold_out"
        : spotsAvailable <= Math.max(2, Math.ceil(capacity * 0.25))
          ? "limited"
          : "available";

    const startsAt = new Date(day);
    startsAt.setHours(Math.floor(t / 60), t % 60, 0, 0);

    slots.push({
      time,
      startsAt: startsAt.toISOString(),
      capacity,
      spotsAvailable,
      status,
    });
  }

  return {
    date,
    isOpen: slots.length > 0,
    closedReason:
      slots.length === 0
        ? isToday
          ? "No sessions left today — the last grid has already gone out."
          : `No ${experience.name} sessions are scheduled on this date.`
        : undefined,
    slots,
  };
}

/** Month view: which dates can be selected at all. */
export function generateMonthAvailability(
  location: Location,
  experience: Experience,
  year: number,
  month: number,
  now = new Date()
): Record<string, { isOpen: boolean; hasCapacity: boolean }> {
  const result: Record<string, { isOpen: boolean; hasCapacity: boolean }> = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const key = toDateKey(new Date(year, month, d));
    const day = generateDayAvailability({ location, experience, date: key, now });
    result[key] = {
      isOpen: day.isOpen,
      hasCapacity: day.slots.some((s) => s.status !== "sold_out"),
    };
  }
  return result;
}
