import { NextResponse } from "next/server";
import { generateMonthAvailability } from "@/lib/availability/engine";
import { getLocationSync } from "@/lib/services/locations";
import { getExperienceSync } from "@/lib/services/experiences";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const locationId = params.get("locationId");
  const experienceId = params.get("experienceId");
  const year = Number(params.get("year"));
  const month = Number(params.get("month"));

  if (!locationId || !experienceId || !Number.isInteger(year) || !Number.isInteger(month)) {
    return NextResponse.json(
      {
        error: {
          code: "validation",
          message: "A circuit, experience, year and month are all required.",
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
          message: "That circuit doesn't run this experience.",
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: generateMonthAvailability(location, experience, year, month),
  });
}
