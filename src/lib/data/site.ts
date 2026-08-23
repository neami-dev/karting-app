/**
 * Single source of truth for brand-level configuration.
 *
 * NOTE: All business facts below are PLACEHOLDER values pending confirmation
 * from the operator (see `dataStatus` on each location). They are centralised
 * here precisely so they can be swapped for real data — or fetched from a CMS —
 * without touching a single component.
 */
export const site = {
  name: "Atlas Karting",
  legalName: "Atlas Karting SARL",
  shortName: "Atlas",
  domain: "https://www.atlaskarting.ma",
  description:
    "Professional outdoor karting circuits in Agadir, Casablanca and Marrakech. Timed sessions, race-spec karts, kids and adults. Book your track time in under two minutes — no account needed.",
  tagline: "Own the apex.",
  /** Central sales line — individual circuits have their own numbers */
  phone: "+212 5 28 00 00 00",
  whatsapp: "212600000000",
  email: "hello@atlaskarting.ma",
  currency: "MAD" as const,
  locale: "en_MA",
  social: {
    instagram: "https://instagram.com/atlaskarting",
    facebook: "https://facebook.com/atlaskarting",
    tiktok: "https://tiktok.com/@atlaskarting",
    youtube: "https://youtube.com/@atlaskarting",
  },
  /** Rating figures are placeholders until the review provider is connected */
  socialProof: {
    rating: 4.8,
    reviewCount: 1240,
    racersPerYear: 45000,
  },
} as const;

export const WHATSAPP_BASE = "https://wa.me";

export function whatsappLink(number: string, message: string) {
  return `${WHATSAPP_BASE}/${number}?text=${encodeURIComponent(message)}`;
}
