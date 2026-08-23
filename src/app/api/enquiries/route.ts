import { NextResponse } from "next/server";
import { enquiryStore, enquiryError, type Enquiry } from "@/lib/data/enquiries";
import { normalisePhone } from "@/lib/booking/validation";
import { getLocationSync } from "@/lib/services/locations";

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export async function POST(req: Request) {
  let body: Record<string, string | number | undefined>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "validation", message: "We couldn't read that message." } },
      { status: 400 }
    );
  }

  const fields: Record<string, string> = {};

  const fullName = String(body.fullName ?? "").trim();
  if (fullName.length < 2) fields.fullName = "Please give us a name to reply to.";

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email) fields.email = "We need an email address to reply.";
  else if (!EMAIL.test(email)) fields.email = "That email is missing an @ or a domain.";

  const rawPhone = String(body.phone ?? "").trim();
  const phone = rawPhone ? normalisePhone(rawPhone) : null;
  if (rawPhone && !phone) {
    fields.phone = "That doesn't look like a valid phone number. Try 06 12 34 56 78.";
  }

  const message = String(body.message ?? "").trim();
  if (message.length < 10) {
    fields.message = "Tell us a little more — even one sentence helps us quote accurately.";
  }

  const kind = body.kind === "event" ? "event" : "general";

  const groupSize = body.groupSize !== undefined ? Number(body.groupSize) : undefined;
  if (kind === "event") {
    if (!groupSize || groupSize < 1) {
      fields.groupSize = "How many people are coming? An estimate is fine.";
    } else if (groupSize > 500) {
      fields.groupSize = "That's larger than any circuit we run — call us and we'll work something out.";
    }
  }

  if (Object.keys(fields).length > 0) {
    return NextResponse.json({ error: enquiryError(fields) }, { status: 400 });
  }

  const locationId = body.locationId ? String(body.locationId) : null;
  if (locationId && !getLocationSync(locationId)) {
    return NextResponse.json(
      {
        error: {
          code: "validation",
          message: "That circuit isn't one of ours. Choose Agadir, Casablanca or Marrakech.",
        },
      },
      { status: 400 }
    );
  }

  const enquiry: Enquiry = {
    id: `enq_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    kind,
    fullName,
    email,
    phone: phone ?? "",
    locationId,
    groupSize,
    eventType: body.eventType ? String(body.eventType) : undefined,
    preferredDate: body.preferredDate ? String(body.preferredDate) : undefined,
    message,
  };

  await enquiryStore.save(enquiry);

  return NextResponse.json(
    { data: { id: enquiry.id, receivedAt: enquiry.createdAt } },
    { status: 201 }
  );
}
