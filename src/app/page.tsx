import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { FeaturedExperiences } from "@/components/home/FeaturedExperiences";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TrackExperience } from "@/components/home/TrackExperience";
import { PricingPreview } from "@/components/home/PricingPreview";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Reviews } from "@/components/home/Reviews";
import { FaqPreview } from "@/components/home/FaqPreview";
import { FinalCta } from "@/components/home/FinalCta";
import { LocationsBand } from "@/components/locations/LocationsBand";
import { buildMetadata, JsonLd } from "@/lib/seo/metadata";
import { locationSchema } from "@/lib/seo/schema";
import { listLocationsSync } from "@/lib/services/locations";

export const metadata: Metadata = buildMetadata({
  title: "Atlas Karting — Karting in Agadir, Casablanca & Marrakech",
  description:
    "Professional outdoor karting circuits in Agadir, Casablanca and Marrakech. Race-spec karts, timed sessions, kids from age 5. Book online in two minutes — no account needed.",
  path: "/",
  keywords: [
    "karting Morocco",
    "karting Agadir",
    "karting Casablanca",
    "karting Marrakech",
    "kids karting",
    "book karting online",
  ],
});

export default function HomePage() {
  const locations = listLocationsSync();

  return (
    <>
      {locations.map((l) => (
        <JsonLd key={l.id} data={locationSchema(l)} />
      ))}

      <Hero />
      <FeaturedExperiences />
      <WhyChooseUs />
      <TrackExperience />
      <LocationsBand />
      <PricingPreview />
      <HowItWorks />
      <Reviews />
      <FaqPreview />
      <FinalCta />
    </>
  );
}
