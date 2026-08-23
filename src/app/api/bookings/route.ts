import { NextResponse } from "next/server";
import { calculateQuote } from "@/lib/pricing/engine";
import { generateDayAvailability } from "@/lib/availability/engine";
import { getExperienceSync, getAddOnsSync } from "@/lib/services/experiences";
import { getLocationSync } from "@/lib/services/locations";
import { bookingStore } from "@/lib/booking/store";
import { generateReference } from "@/lib/booking/reference";
import { validateCustomer, validationError } from "@/lib/booking/validation";
import type { Booking, BookingParticipant, ServiceError } from "@/lib/types";

export const dynamic = "force-dynamic";

function errorResponse(error: ServiceError, status: number) {
  return NextResponse.json({ error }, { status });
}

/**
 * Guest booking creation.
 *
 * SECURITY: the request body carries no prices and no totals — and even if it
 * did, nothing here would read them. Eligibility, per-racer pricing, discounts
 * and remaining capacity are all recalculated server-side from the same engine
 * the UI previews with. The stored booking uses these numbers, not the client's.
 */
export async function POST(req: Request) {
  let body: {
    locationId?: string;
    experienceId?: string;
    date?: string;
    timeSlot?: string;
    participants?: BookingParticipant[];
    addOnIds?: string[];
    customer?: Record<string, string>;
  };

  try {
    body = await req.json();
  } catch {
    return errorResponse(
      { code: "validation", message: "We couldn't read your booking request. Please try again." },
      400
    );
  }

  /* 1 — Resolve the circuit and experience ------------------------------- */
  const location = getLocationSync(body.locationId ?? "");
  const experience = getExperienceSync(body.experienceId ?? "");

  if (!location || !experience) {
    return errorResponse(
      {
        code: "not_found",
        message: "That circuit or experience is no longer available. Please start again.",
      },
      404
    );
  }

  if (!location.experienceIds.includes(experience.id)) {
    return errorResponse(
      {
        code: "validation",
        message: `${experience.name} isn't offered at ${location.name}. Choose another circuit or experience.`,
      },
      400
    );
  }

  /* 2 — Validate customer details ---------------------------------------- */
  const customerCheck = validateCustomer(body.customer ?? {});
  if (!customerCheck.valid || !customerCheck.normalised) {
    return errorResponse(validationError(customerCheck.fields), 400);
  }

  /* 3 — Recalculate eligibility and price -------------------------------- */
  const participants = (body.participants ?? []).map((p, i) => ({
    id: p.id ?? `p_${i}`,
    name: p.name,
    age: Number(p.age),
    heightCm: Number(p.heightCm),
  }));

  if (participants.length === 0) {
    return errorResponse(
      { code: "validation", message: "Add at least one racer to your booking." },
      400
    );
  }

  const quote = calculateQuote({
    experience,
    locationId: location.id,
    participants,
    addOnIds: body.addOnIds ?? [],
  });

  if (quote.issues.length > 0) {
    return errorResponse(
      {
        code: "validation",
        message: quote.issues[0].message,
        fields: Object.fromEntries(
          quote.issues.map((i) => [`participant.${i.participantIndex}`, i.message])
        ),
      },
      400
    );
  }

  if (participants.length < experience.minParticipants) {
    return errorResponse(
      {
        code: "validation",
        message: `${experience.name} needs at least ${experience.minParticipants} racers. You have ${participants.length}.`,
      },
      400
    );
  }

  if (participants.length > experience.maxParticipants) {
    return errorResponse(
      {
        code: "validation",
        message: `${experience.name} takes a maximum of ${experience.maxParticipants} racers per booking. Split into two bookings, or message us and we'll arrange it.`,
      },
      400
    );
  }

  /* 4 — Re-check availability against live capacity ---------------------- */
  const date = body.date ?? "";
  const timeSlot = body.timeSlot ?? "";

  const day = generateDayAvailability({ location, experience, date });
  const slot = day.slots.find((s) => s.time === timeSlot);

  if (!day.isOpen || !slot) {
    return errorResponse(
      {
        code: "unavailable",
        message:
          day.closedReason ??
          "That session is no longer on the schedule. Please choose another time.",
      },
      409
    );
  }

  const alreadyTaken = await bookingStore.countSeats(
    location.id,
    experience.id,
    date,
    timeSlot
  );
  const remaining = Math.max(0, slot.spotsAvailable - alreadyTaken);

  if (remaining === 0) {
    return errorResponse(
      {
        code: "unavailable",
        message: `The ${timeSlot} session just sold out. Pick another time — there's usually space 30 minutes either side.`,
      },
      409
    );
  }

  if (participants.length > remaining) {
    return errorResponse(
      {
        code: "unavailable",
        message: `Only ${remaining} ${remaining === 1 ? "spot is" : "spots are"} left in the ${timeSlot} session and you've added ${participants.length} racers. Choose another time or reduce your group.`,
      },
      409
    );
  }

  /* 5 — Persist ---------------------------------------------------------- */
  const selectedAddOns = getAddOnsSync(body.addOnIds ?? []).filter((a) =>
    experience.addOnIds.includes(a.id)
  );

  const booking: Booking = {
    id: `bk_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    reference: generateReference(),
    locationId: location.id,
    experienceId: experience.id,
    date,
    timeSlot,
    customer: customerCheck.normalised,
    participants: quote.participants.map((p) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      heightCm: p.heightCm,
      category: p.category,
      categoryLabel: p.categoryLabel,
      price: p.price,
    })),
    addOns: selectedAddOns.map((a) => {
      const line = quote.addOnLines.find((l) => l.categoryLabel === a.name);
      return {
        id: a.id,
        name: a.name,
        quantity: line?.quantity ?? 1,
        total: line?.total ?? a.price,
      };
    }),
    subtotal: quote.subtotal,
    discount: quote.discount,
    total: quote.total,
    currency: "MAD",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  await bookingStore.save(booking);

  return NextResponse.json({ data: booking }, { status: 201 });
}
