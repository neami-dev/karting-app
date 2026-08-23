import type { ServiceError } from "@/lib/types";

export interface Enquiry {
  id: string;
  createdAt: string;
  kind: "general" | "event";
  fullName: string;
  email: string;
  phone: string;
  locationId: string | null;
  /** Event enquiries only */
  groupSize?: number;
  eventType?: string;
  preferredDate?: string;
  message: string;
}

/**
 * In-memory enquiry store — the same stand-in pattern as the booking store.
 * A real deployment routes these to a CRM or a transactional mail service;
 * that swap happens here and nowhere else.
 */
const g = globalThis as typeof globalThis & { __atlasEnquiries?: Enquiry[] };
if (!g.__atlasEnquiries) g.__atlasEnquiries = [];

export const enquiryStore = {
  async save(enquiry: Enquiry): Promise<Enquiry> {
    g.__atlasEnquiries!.push(enquiry);
    return enquiry;
  },
  async list(): Promise<Enquiry[]> {
    return g.__atlasEnquiries!;
  },
};

export function enquiryError(fields: Record<string, string>): ServiceError {
  return {
    code: "validation",
    message: "A few details need fixing before we can send this.",
    fields,
  };
}
