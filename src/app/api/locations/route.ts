import { NextResponse } from "next/server";
import { listLocationsSync } from "@/lib/services/locations";

export async function GET() {
  return NextResponse.json({ data: listLocationsSync() });
}
