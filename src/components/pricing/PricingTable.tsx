"use client";

import Link from "next/link";
import { pricingRules } from "@/lib/data/pricing-rules";
import { rulesFor } from "@/lib/pricing/engine";
import { listExperiencesSync } from "@/lib/services/experiences";
import { formatDuration, formatPrice } from "@/lib/format";
import type { Experience, Location } from "@/lib/types";

/**
 * Renders live from the pricing-rule table rather than a hand-written list, so
 * a price change in `data/pricing-rules.ts` shows up here with no edit. When the
 * rules come from an API, this component keeps working unchanged.
 */
export function PricingTable({
  location,
  category,
}: {
  location?: Location | null;
  category?: Experience["category"];
}) {
  const experiences = listExperiencesSync(location?.slug).filter(
    (e) => !category || e.category === category
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption className="sr-only">
          Prices per racer{location ? ` at ${location.name}` : ""}, by experience
          and age band
        </caption>
        <thead>
          <tr className="border-b border-hairline-on-light">
            <th scope="col" className="t-caption-upper py-xs pr-sm text-muted">
              Experience
            </th>
            <th scope="col" className="t-caption-upper py-xs pr-sm text-muted">
              Duration
            </th>
            <th scope="col" className="t-caption-upper py-xs pr-sm text-muted">
              Band
            </th>
            <th scope="col" className="t-caption-upper py-xs text-right text-muted">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {experiences.map((experience) => {
            const rules = location
              ? rulesFor(experience.id, location.id)
              : pricingRules.filter((r) => r.experienceId === experience.id);

            if (rules.length === 0) return null;

            return rules.map((rule, i) => (
              <tr key={rule.id} className="border-b border-hairline-soft align-top">
                {i === 0 && (
                  <>
                    <th
                      scope="rowgroup"
                      rowSpan={rules.length}
                      className="py-sm pr-sm align-top"
                    >
                      <Link
                        href={`/experiences/${experience.slug}`}
                        className="t-title-sm text-body-on-light underline-offset-4 hover:underline"
                      >
                        {experience.name}
                      </Link>
                      <span className="t-caption mt-0.5 block font-normal text-muted">
                        {experience.formatLabel}
                      </span>
                    </th>
                    <td
                      rowSpan={rules.length}
                      className="t-body-md py-sm pr-sm align-top text-muted"
                    >
                      {formatDuration(experience.durationMin)}
                    </td>
                  </>
                )}
                <td className="t-body-md py-sm pr-sm text-body-on-light">
                  {rule.label}
                </td>
                <td className="t-title-sm tabular py-sm text-right text-body-on-light">
                  {formatPrice(rule.price)}
                  <span className="t-caption block font-normal text-muted">
                    {experience.categories.includes("passenger") &&
                    rule.category === "passenger"
                      ? "per passenger"
                      : "per racer"}
                  </span>
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}
