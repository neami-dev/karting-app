import type { Booking } from "@/lib/types";

/**
 * In-memory booking store — a deliberate stand-in for the real database.
 *
 * It lives on `globalThis` so it survives the dev server's module reloads. It is
 * NOT durable and NOT shared across instances; replacing it means implementing
 * this same four-method interface against a real datastore, with no changes
 * anywhere else in the codebase.
 */
export interface BookingStore {
  save(booking: Booking): Promise<Booking>;
  findByReference(reference: string): Promise<Booking | null>;
  /** Lookup for the future "Manage my booking" flow: reference + contact. */
  findByReferenceAndContact(
    reference: string,
    contact: string
  ): Promise<Booking | null>;
  /** Seats already committed for a given slot — used for the capacity check. */
  countSeats(
    locationId: string,
    experienceId: string,
    date: string,
    timeSlot: string
  ): Promise<number>;
}

const g = globalThis as typeof globalThis & {
  __atlasBookings?: Map<string, Booking>;
};

if (!g.__atlasBookings) g.__atlasBookings = new Map<string, Booking>();
const bookings = g.__atlasBookings;

export const bookingStore: BookingStore = {
  async save(booking) {
    bookings.set(booking.reference, booking);
    return booking;
  },

  async findByReference(reference) {
    return bookings.get(reference.trim().toUpperCase()) ?? null;
  },

  async findByReferenceAndContact(reference, contact) {
    const booking = await bookingStore.findByReference(reference);
    if (!booking) return null;

    const needle = contact.trim().toLowerCase();
    if (!needle) return null;

    if (booking.customer.email.toLowerCase() === needle) return booking;

    // Match on the last 9 digits so 0612345678 and +212612345678 both work.
    // Guard the length: an empty digit string would match every phone number,
    // and a short one would match far too many.
    const needleDigits = needle.replace(/\D/g, "");
    if (needleDigits.length < 9) return null;

    const storedDigits = booking.customer.phone.replace(/\D/g, "");
    return storedDigits.endsWith(needleDigits.slice(-9)) ? booking : null;
  },

  async countSeats(locationId, experienceId, date, timeSlot) {
    let seats = 0;
    for (const b of bookings.values()) {
      if (
        b.locationId === locationId &&
        b.experienceId === experienceId &&
        b.date === date &&
        b.timeSlot === timeSlot &&
        b.status !== "cancelled"
      ) {
        seats += b.participants.length;
      }
    }
    return seats;
  },
};
