import type { Booking, BookingParticipant, Customer, ServiceResult } from "@/lib/types";
import { request } from "@/lib/services/http";

export interface CreateBookingInput {
  locationId: string;
  experienceId: string;
  date: string;
  timeSlot: string;
  participants: BookingParticipant[];
  addOnIds: string[];
  customer: Customer;
}

/**
 * Note what is NOT in `CreateBookingInput`: any price. The client cannot submit
 * a total. The server recalculates eligibility, availability and price from the
 * same engine and stores its own numbers.
 */
export async function createGuestBooking(
  input: CreateBookingInput
): Promise<ServiceResult<Booking>> {
  return request<Booking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** Groundwork for a future "Manage my booking" screen — reference + contact. */
export async function lookupBooking(
  reference: string,
  contact: string
): Promise<ServiceResult<Booking>> {
  const params = new URLSearchParams({ reference, contact });
  return request<Booking>(`/api/bookings/lookup?${params}`);
}
