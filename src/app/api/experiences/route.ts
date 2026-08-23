import { NextResponse } from "next/server";
import { listExperiencesSync } from "@/lib/services/experiences";

export async function GET(req: Request) {
  const locationId = new URL(req.url).searchParams.get("locationId") ?? undefined;
  return NextResponse.json({ data: listExperiencesSync(locationId) });
}
