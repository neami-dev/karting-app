import type { Metadata } from "next";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Booking confirmed",
  description: "Your Atlas Karting booking is confirmed.",
  path: "/booking/confirmed",
  noIndex: true,
});

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  return <BookingConfirmation reference={decodeURIComponent(reference)} />;
}
