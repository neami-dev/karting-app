import Link from "next/link";
import { TrackVisual } from "@/components/visuals/TrackVisual";
import { Badge } from "@/components/ui/Badge";
import { startingPrice } from "@/lib/pricing/engine";
import { formatDuration, formatPrice, cx } from "@/lib/format";
import type { Experience } from "@/lib/types";

/** Turns the eligibility window into the one line a customer actually needs. */
export function eligibilityLabel(e: Experience): string {
  const { minAge, maxAge, minHeightCm } = e.eligibility;
  const age =
    minAge !== undefined && maxAge !== undefined
      ? `Age ${minAge}–${maxAge}`
      : minAge !== undefined
        ? `Age ${minAge}+`
        : null;
  const height = minHeightCm !== undefined ? `${minHeightCm} cm+` : null;
  return [age, height].filter(Boolean).join(" · ");
}

export function ExperienceCard({
  experience,
  locationId,
  className,
  priority,
}: {
  experience: Experience;
  locationId?: string;
  className?: string;
  priority?: boolean;
}) {
  const price = startingPrice(experience.id, locationId);

  return (
    <article
      className={cx(
        "group relative flex flex-col border border-hairline bg-canvas",
        "transition-colors duration-300 hover:border-ink/25 focus-within:border-ink/40",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <TrackVisual
          seed={experience.visual}
          overlay="soft"
          priority={priority}
          className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute left-xs top-xs flex flex-wrap gap-xxxs">
          <Badge tone="default">{formatDuration(experience.durationMin)}</Badge>
          {experience.bookingMode === "enquiry" && (
            <Badge tone="outline">Enquiry</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-sm">
        <h3 className="t-title-md text-ink">
          <Link
            href={`/experiences/${experience.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {experience.name}
          </Link>
        </h3>

        <p className="t-body-md mt-xxs flex-1 text-body">{experience.summary}</p>

        <dl className="mt-sm flex items-end justify-between gap-xs border-t border-hairline pt-xs">
          <div>
            <dt className="t-caption-upper text-muted-soft">Requirement</dt>
            <dd className="t-body-sm mt-0.5 text-body-strong">
              {eligibilityLabel(experience)}
            </dd>
          </div>
          <div className="text-right">
            <dt className="t-caption-upper text-muted-soft">From</dt>
            <dd className="t-title-md tabular mt-0.5 text-ink">
              {price !== null ? formatPrice(price) : "On request"}
            </dd>
          </div>
        </dl>

        <p className="t-button mt-sm flex items-center gap-xxs text-ink transition-colors duration-200 group-hover:text-primary">
          Explore
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </p>
      </div>
    </article>
  );
}
