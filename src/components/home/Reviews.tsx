import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { reviews } from "@/lib/data/reviews";
import { listLocationsSync } from "@/lib/services/locations";
import { site } from "@/lib/data/site";

function Stars({ rating }: { rating: number }) {
  return (
    <p className="flex items-center gap-xxxs" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={i < Math.round(rating) ? "text-primary" : "text-hairline"}
        >
          ★
        </span>
      ))}
    </p>
  );
}

export function Reviews() {
  const locations = listLocationsSync();
  const cityFor = (id: string | null) =>
    locations.find((l) => l.id === id)?.city ?? "Atlas Karting";

  return (
    <Section>
      <Editorial>
        <SectionHeading
          label="Social proof"
          title="What racers say when they get out of the kart."
          lede={`Rated ${site.socialProof.rating} out of 5 across ${site.socialProof.reviewCount.toLocaleString("en-US")} reviews.`}
          action={
            <div className="flex items-center gap-xs">
              <Stars rating={site.socialProof.rating} />
              <span className="t-title-md tabular text-ink">
                {site.socialProof.rating}
              </span>
            </div>
          }
        />

        <ul className="stagger mt-lg grid gap-xs md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex flex-col border border-hairline bg-canvas-elevated p-sm"
            >
              <div className="flex items-center justify-between gap-xs">
                <Stars rating={review.rating} />
                <Badge tone="outline">{cityFor(review.locationId)}</Badge>
              </div>
              <blockquote className="t-body-md mt-xs flex-1 text-body">
                {review.body}
              </blockquote>
              <footer className="t-caption mt-sm border-t border-hairline pt-xs text-muted">
                <cite className="not-italic text-body-strong">{review.author}</cite>
                {" · "}
                {new Date(review.date).toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </footer>
            </li>
          ))}
        </ul>

        <p className="t-caption mt-sm text-muted">
          Review content shown here is placeholder material. Connect a live review
          provider to replace it.
        </p>
      </Editorial>
    </Section>
  );
}
