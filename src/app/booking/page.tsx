import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { SummarySkeleton } from "@/components/ui/Skeleton";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Book a karting session",
  description:
    "Book your karting session at Atlas Karting Agadir, Casablanca or Marrakech. Choose your circuit, date and time, add your racers, and confirm — no account required.",
  path: "/booking",
  // A transactional flow with query-driven state has nothing to rank for.
  noIndex: true,
});

export default function BookingPage() {
  return (
    <>
      <header className="border-b border-hairline bg-canvas pt-lg">
        <div className="editorial pb-md">
          <p className="t-caption-upper flex items-center gap-xxs text-muted-soft">
            <span className="h-px w-6 bg-primary" aria-hidden="true" />
            Guest booking
          </p>
          <h1 className="t-display-lg mt-xs text-ink">Book your session</h1>
          <p className="t-body-md mt-xxs max-w-[36rem] text-body">
            Six short steps, about two minutes. No account, no password — you pay
            at the circuit.
          </p>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="editorial py-xl">
            <SummarySkeleton />
          </div>
        }
      >
        <BookingWizard />
      </Suspense>
    </>
  );
}
