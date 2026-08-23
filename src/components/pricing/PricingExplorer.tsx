"use client";

import { useState } from "react";
import { Section, Editorial, SectionHeading } from "@/components/ui/Section";
import { PricingTable } from "@/components/pricing/PricingTable";
import { ButtonLink } from "@/components/ui/Button";
import { useLocations } from "@/components/locations/LocationContext";
import { discountTiers } from "@/lib/data/pricing-rules";
import { addOns } from "@/lib/data/experiences";
import { formatPrice, cx } from "@/lib/format";
import type { Experience } from "@/lib/types";

const TABS: { id: Experience["category"] | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "karting", label: "Karting" },
  { id: "events", label: "Groups & events" },
];

/**
 * The price list is rendered from the same rule table the booking engine uses,
 * scoped by circuit. Nothing here is a hand-maintained duplicate.
 */
export function PricingExplorer() {
  const { locations, selectedSlug, select, selected } = useLocations();
  const [tab, setTab] = useState<Experience["category"] | "all">("all");

  return (
    <>
      <Section tone="light" size="sm">
        <Editorial>
          <div className="flex flex-col gap-sm lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="t-caption-upper text-muted">Circuit</p>
              <div className="mt-xs flex flex-wrap gap-xxs">
                <button
                  type="button"
                  onClick={() => select("")}
                  aria-pressed={!selectedSlug}
                  className={cx(
                    "t-nav-link h-12 border px-sm transition-colors duration-200",
                    !selectedSlug
                      ? "border-body-on-light bg-body-on-light text-canvas-light"
                      : "border-hairline-on-light text-body-on-light hover:border-body-on-light"
                  )}
                >
                  All circuits
                </button>
                {locations.map((l) => (
                  <button
                    key={l.slug}
                    type="button"
                    onClick={() => select(l.slug)}
                    aria-pressed={selectedSlug === l.slug}
                    className={cx(
                      "t-nav-link h-12 border px-sm transition-colors duration-200",
                      selectedSlug === l.slug
                        ? "border-primary bg-primary text-on-primary"
                        : "border-hairline-on-light text-body-on-light hover:border-body-on-light"
                    )}
                  >
                    {l.city}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="t-caption-upper text-muted">Category</p>
              <div className="mt-xs flex flex-wrap gap-xxs" role="tablist">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={cx(
                      "t-nav-link h-12 border px-sm transition-colors duration-200",
                      tab === t.id
                        ? "border-body-on-light bg-body-on-light text-canvas-light"
                        : "border-hairline-on-light text-body-on-light hover:border-body-on-light"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="t-body-md mt-md text-muted" aria-live="polite">
            {selected
              ? `Showing prices for ${selected.name}. Prices are per racer unless stated.`
              : "Showing prices across all circuits. Choose a city for the exact figures — Casablanca runs a small city-centre premium on some sessions."}
          </p>

          <div className="mt-md">
            <PricingTable
              location={selected}
              category={tab === "all" ? undefined : tab}
            />
          </div>
        </Editorial>
      </Section>

      {/* ---- Discounts + add-ons ---------------------------------------- */}
      <Section tone="soft-light">
        <Editorial>
          <div className="grid gap-lg lg:grid-cols-2">
            <div>
              <SectionHeading
                tone="light"
                label="Group discounts"
                title="Applied automatically."
                lede="You don't need a code. Add racers during booking and the discount appears in your summary as soon as you cross a threshold."
              />

              <ul className="mt-md divide-y divide-hairline-on-light border-y border-hairline-on-light">
                {discountTiers.map((tier) => (
                  <li
                    key={tier.id}
                    className="flex items-baseline justify-between gap-xs py-sm"
                  >
                    <span className="t-body-md text-body-on-light">
                      {tier.minParticipants}+ racers
                    </span>
                    <span className="t-title-md tabular text-body-on-light">
                      −{Math.round(tier.rate * 100)}%
                    </span>
                  </li>
                ))}
              </ul>

              <p className="t-caption mt-xs text-muted">
                Discounts apply to racing fees, not to add-ons. The highest
                qualifying tier is used.
              </p>
            </div>

            <div>
              <SectionHeading
                tone="light"
                label="Add-ons"
                title="Optional extras."
                lede="Add during booking or ask at the desk."
              />

              <ul className="mt-md divide-y divide-hairline-on-light border-y border-hairline-on-light">
                {addOns.map((addOn) => (
                  <li key={addOn.id} className="py-sm">
                    <div className="flex items-baseline justify-between gap-xs">
                      <span className="t-title-sm text-body-on-light">
                        {addOn.name}
                      </span>
                      <span className="t-body-md tabular shrink-0 text-body-on-light">
                        {formatPrice(addOn.price)}
                        <span className="text-muted">
                          {addOn.unit === "per_person" ? " / person" : " / booking"}
                        </span>
                      </span>
                    </div>
                    <p className="t-caption mt-xxxs text-muted">{addOn.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-lg flex flex-wrap gap-xxs border-t border-hairline-on-light pt-md">
            <ButtonLink href="/booking">Book and see your exact total</ButtonLink>
            <ButtonLink href="/contact" variant="outline-light">
              Ask about a custom quote
            </ButtonLink>
          </div>
        </Editorial>
      </Section>
    </>
  );
}
