import { NextResponse } from "next/server";
import { calculateQuote } from "@/lib/pricing/engine";
import { getExperienceSync } from "@/lib/services/experiences";
import { getLocationSync } from "@/lib/services/locations";
import type { BookingParticipant } from "@/lib/types";

export async function POST(req: Request) {
  let body: {
    locationId?: string;
    experienceId?: string;
    participants?: BookingParticipant[];
    addOnIds?: string[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "validation", message: "We couldn't read that request." } },
      { status: 400 }
    );
  }

  const location = getLocationSync(body.locationId ?? "");
  const experience = getExperienceSync(body.experienceId ?? "");

  if (!location || !experience) {
    return NextResponse.json(
      {
        error: {
          code: "not_found",
          message: "That circuit and experience combination isn't available.",
        },
      },
      { status: 404 }
    );
  }

  const quote = calculateQuote({
    experience,
    locationId: location.id,
    participants: body.participants ?? [],
    addOnIds: body.addOnIds ?? [],
  });

  return NextResponse.json({ data: quote });
}
