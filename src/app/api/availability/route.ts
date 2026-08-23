import { NextResponse } from "next/server";
import { generateDayAvailability } from "@/lib/availability/engine";
import { getLocationSync } from "@/lib/services/locations";
import { getExperienceSync } from "@/lib/services/experiences";
import { bookingStore } from "@/lib/booking/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const locationId = params.get("locationId");
  const experienceId = params.get("experienceId");
  const date = params.get("date");

  if (!locationId || !experienceId || !date) {
    return NextResponse.json(
      {
        error: {
          code: "validation",
          message: "Choose a circuit, an experience and a date to see availability.",
        },
      },
      { status: 400 }
    );
  }

  const location = getLocationSync(locationId);
  const experience = getExperienceSync(experienceId);

  if (!location || !experience) {
    return NextResponse.json(
      {
        error: {
          code: "not_found",
          message: "That circuit doesn't run this experience. Pick another option.",
        },
      },
      { status: 404 }
    );
  }

  const day = generateDayAvailability({ location, experience, date });

  // Subtract seats already committed in this instance so the numbers stay honest
  // within a session. A real backend would do this in the same query.
  const adjusted = await Promise.all(
    day.slots.map(async (slot) => {
      const taken = await bookingStore.countSeats(
        location.id,
        experience.id,
        date,
        slot.time
      );
      const spotsAvailable = Math.max(0, slot.spotsAvailable - taken);
      return {
        ...slot,
        spotsAvailable,
        status:
          spotsAvailable === 0
            ? ("sold_out" as const)
            : spotsAvailable <= Math.max(2, Math.ceil(slot.capacity * 0.25))
              ? ("limited" as const)
              : ("available" as const),
      };
    })
  );

  return NextResponse.json({ data: { ...day, slots: adjusted } });
}
