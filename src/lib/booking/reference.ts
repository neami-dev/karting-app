/**
 * Booking references are the customer's only identifier — there are no accounts.
 * Format: KT-<year>-<6 digits>. Ambiguous characters are avoided entirely by
 * staying numeric, because these get read out over the phone.
 */
export function generateReference(now = new Date()): string {
  const year = now.getFullYear();
  const n = Math.floor(Math.random() * 1_000_000);
  return `KT-${year}-${String(n).padStart(6, "0")}`;
}

export const REFERENCE_PATTERN = /^KT-\d{4}-\d{6}$/;

export function isValidReference(ref: string): boolean {
  return REFERENCE_PATTERN.test(ref.trim().toUpperCase());
}
