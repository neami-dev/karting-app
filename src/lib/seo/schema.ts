import { site } from "@/lib/data/site";
import type { Experience, FaqItem, Location } from "@/lib/types";
import { dayName } from "@/lib/format";
import { startingPrice } from "@/lib/pricing/engine";

const DAY_SCHEMA = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.domain,
    email: site.email,
    telephone: site.phone,
    description: site.description,
    sameAs: Object.values(site.social),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.domain,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.domain}/faq?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/** Local business markup — the payload that matters for "karting <city>" intent. */
export function locationSchema(location: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "@id": `${site.domain}/${location.slug}#business`,
    name: location.name,
    description: location.description,
    url: `${site.domain}/${location.slug}`,
    telephone: location.phone,
    email: location.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.geo.lat,
      longitude: location.geo.lng,
    },
    openingHoursSpecification: location.openingHours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAY_SCHEMA[h.day],
        opens: h.opens,
        closes: h.closes,
      })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.socialProof.rating,
      reviewCount: site.socialProof.reviewCount,
    },
  };
}

export function experienceSchema(experience: Experience, location?: Location) {
  const price = startingPrice(experience.id, location?.id);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: experience.name,
    description: experience.description,
    category: "Karting",
    url: `${site.domain}/experiences/${experience.slug}`,
    ...(price !== null && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "MAD",
        availability: "https://schema.org/InStock",
        url: `${site.domain}/booking?experience=${experience.slug}`,
      },
    }),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.domain}${item.path}`,
    })),
  };
}

export { dayName };
