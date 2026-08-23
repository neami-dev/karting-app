import { NextResponse } from "next/server";
import { bookingStore } from "@/lib/booking/store";
import { isValidReference } from "@/lib/booking/reference";

export const dynamic = "force-dynamic";

/**
 * Booking lookup by reference + contact. This is the seam the future
 * "Manage my booking" screen hangs off — still no account required.
 */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const reference = params.get("reference") ?? "";
  const contact = params.get("contact") ?? "";

  if (!isValidReference(reference)) {
    return NextResponse.json(
      {
        error: {
          code: "validation",
          message: "Booking references look like KT-2026-004821. Check your confirmation email.",
        },
      },
      { status: 400 }
    );
  }

  if (!contact.trim()) {
    return NextResponse.json(
      {
        error: {
          code: "validation",
          message: "Enter the phone number or email you booked with.",
        },
      },
      { status: 400 }
    );
  }

  const booking = await bookingStore.findByReferenceAndContact(
    reference.toUpperCase(),
    contact
  );

  if (!booking) {
    return NextResponse.json(
      {
        error: {
          code: "not_found",
          message:
            "We couldn't match that reference and contact detail. Check both, or message the circuit on WhatsApp and we'll find it for you.",
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: booking });
}
