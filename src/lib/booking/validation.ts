import type { Customer, ServiceError } from "@/lib/types";

/**
 * Field-level validation with messages a customer can act on. Deliberately
 * permissive about phone formatting — Moroccan numbers get written half a dozen
 * ways and rejecting a valid number is worse than accepting a messy one.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Accepts 0612345678, +212612345678, 06 12 34 56 78, 00212612345678. */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[\s().-]/g, "");
  const plus = digits.startsWith("+");
  let n = digits.replace(/\D/g, "");

  if (n.startsWith("00")) n = n.slice(2);
  if (plus || n.startsWith("212")) {
    if (n.startsWith("212")) n = n.slice(3);
    n = n.replace(/^0+/, "");
    return n.length === 9 ? `+212${n}` : null;
  }
  // Local format: 0XXXXXXXXX
  if (n.length === 10 && n.startsWith("0")) return `+212${n.slice(1)}`;
  if (n.length === 9) return `+212${n}`;
  // Fall back to accepting a plausible international number.
  if (n.length >= 8 && n.length <= 15) return `+${n}`;
  return null;
}

export interface CustomerValidation {
  valid: boolean;
  fields: Record<string, string>;
  normalised?: Customer;
}

export function validateCustomer(input: Partial<Customer>): CustomerValidation {
  const fields: Record<string, string> = {};

  const fullName = (input.fullName ?? "").trim();
  if (fullName.length === 0) {
    fields.fullName = "We need a name for the booking.";
  } else if (fullName.length < 2) {
    fields.fullName = "That name looks too short — please enter your full name.";
  }

  const rawPhone = (input.phone ?? "").trim();
  const phone = rawPhone ? normalisePhone(rawPhone) : null;
  if (!rawPhone) {
    fields.phone = "A phone number is required — it's how the circuit reaches you on the day.";
  } else if (!phone) {
    fields.phone =
      "That doesn't look like a valid phone number. Try 06 12 34 56 78 or +212 6 12 34 56 78.";
  }

  const email = (input.email ?? "").trim().toLowerCase();
  if (!email) {
    fields.email = "An email address is required — your booking reference is sent there.";
  } else if (!EMAIL.test(email)) {
    fields.email = "That email address is missing an @ or a domain. Please check it.";
  }

  const valid = Object.keys(fields).length === 0;

  return {
    valid,
    fields,
    normalised: valid
      ? {
          fullName,
          phone: phone as string,
          email,
          specialRequest: input.specialRequest?.trim() || undefined,
        }
      : undefined,
  };
}

export function validationError(fields: Record<string, string>): ServiceError {
  return {
    code: "validation",
    message: "Some details need fixing before we can confirm your booking.",
    fields,
  };
}
