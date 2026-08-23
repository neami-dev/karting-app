"use client";

import { useMemo } from "react";
import { QuantityStepper } from "@/components/ui/Stepper";
import { Field, TextInput } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getAddOnsSync } from "@/lib/services/experiences";
import { explainIneligibility, resolveRule, rulesFor } from "@/lib/pricing/engine";
import { formatPrice, cx } from "@/lib/format";
import type {
  BookingParticipant,
  Experience,
  Location,
  PricingRule,
} from "@/lib/types";

/**
 * The heart of the flow. Quantity steppers set how many racers there are, then
 * every racer gives an age and a height — because both decide which kart they
 * can drive and what they pay. Eligibility is checked as they type, per racer,
 * with a message that names the actual problem.
 */

/** A sensible starting age for a band, so most racers only edit the height. */
function defaultAgeFor(rule: PricingRule): number {
  const { minAge = 18, maxAge } = rule.eligibility;
  return maxAge !== undefined ? Math.floor((minAge + maxAge) / 2) : minAge + 4;
}

export function StepParticipants({
  experience,
  location,
  participants,
  addOnIds,
  onCountChange,
  onUpdate,
  onRemove,
  onAdd,
  onToggleAddOn,
}: {
  experience: Experience;
  location: Location;
  participants: BookingParticipant[];
  addOnIds: string[];
  onCountChange: (ruleCategory: string, delta: number, seedAge: number) => void;
  onUpdate: (id: string, patch: Partial<BookingParticipant>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  onToggleAddOn: (id: string) => void;
}) {
  const rules = useMemo(
    () => rulesFor(experience.id, location.id),
    [experience.id, location.id]
  );

  const availableAddOns = getAddOnsSync(experience.addOnIds);

  /** How many current racers currently resolve to each band. */
  const countFor = (rule: PricingRule) =>
    participants.filter((p) => {
      const resolved =
        p.age > 0 && p.heightCm > 0
          ? resolveRule(experience.id, location.id, p.age, p.heightCm)
          : null;
      // Un-filled racers count toward the band their seeded age suggests.
      if (!resolved) {
        const { minAge = 0, maxAge = 200 } = rule.eligibility;
        return p.age >= minAge && p.age <= maxAge;
      }
      return resolved.id === rule.id;
    }).length;

  const belowMinimum = participants.length < experience.minParticipants;
  const atCapacity = participants.length >= experience.maxParticipants;

  return (
    <div className="flex flex-col gap-lg">
      {/* ---- Quantity ---------------------------------------------------- */}
      <fieldset>
        <legend className="t-display-md text-ink">
          How many people are racing?
        </legend>
        <p className="t-body-md mt-xxs text-body">
          Set the numbers, then give us each racer&apos;s age and height so we
          put them in the right kart at the right price.
        </p>

        <div className="mt-md border-y border-hairline">
          {rules.map((rule) => (
            <QuantityStepper
              key={rule.id}
              label={rule.label}
              hint={`${formatPrice(rule.price)} per racer${
                rule.eligibility.minHeightCm
                  ? ` · ${rule.eligibility.minHeightCm} cm minimum`
                  : ""
              }`}
              value={countFor(rule)}
              min={0}
              max={experience.maxParticipants}
              onChange={(next) =>
                onCountChange(rule.id, next - countFor(rule), defaultAgeFor(rule))
              }
            />
          ))}
        </div>

        <p
          className={cx(
            "t-caption mt-xs",
            belowMinimum ? "text-warning" : "text-muted"
          )}
          role={belowMinimum ? "status" : undefined}
        >
          {belowMinimum
            ? `${experience.name} needs at least ${experience.minParticipants} racers — add ${experience.minParticipants - participants.length} more.`
            : `Up to ${experience.maxParticipants} racers per booking. You have ${participants.length}.`}
        </p>
      </fieldset>

      {/* ---- Per-racer details ------------------------------------------- */}
      <fieldset>
        <legend className="t-title-md text-ink">Racer details</legend>
        <p className="t-body-md mt-xxs text-body">
          Age and height decide which kart each racer can drive — the pedals and
          harness have to fit.
        </p>

        <ul className="mt-sm flex flex-col gap-xs">
          {participants.map((participant, index) => {
            const hasDetails = participant.age > 0 && participant.heightCm > 0;
            const problem = hasDetails
              ? explainIneligibility(
                  experience,
                  participant.age,
                  participant.heightCm
                )
              : null;
            const rule = hasDetails && !problem
              ? resolveRule(
                  experience.id,
                  location.id,
                  participant.age,
                  participant.heightCm
                )
              : null;

            const invalid = Boolean(problem) || (hasDetails && !rule);

            return (
              <li
                key={participant.id}
                className={cx(
                  "border p-sm transition-colors duration-200",
                  invalid ? "border-warning/60 bg-warning/5" : "border-hairline"
                )}
              >
                <div className="flex items-center justify-between gap-xs">
                  <p className="t-caption-upper text-muted-soft">
                    Racer {index + 1}
                  </p>

                  <div className="flex items-center gap-xs">
                    {rule && (
                      <Badge tone="success">
                        {rule.label} · {formatPrice(rule.price)}
                      </Badge>
                    )}
                    {participants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemove(participant.id)}
                        className="t-caption-upper text-muted transition-colors hover:text-warning"
                      >
                        Remove
                        <span className="sr-only"> racer {index + 1}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-xs grid gap-xs sm:grid-cols-3">
                  <Field label="Name (optional)">
                    {({ inputId, describedBy }) => (
                      <TextInput
                        id={inputId}
                        aria-describedby={describedBy}
                        type="text"
                        autoComplete="off"
                        placeholder="e.g. Yasmine"
                        value={participant.name ?? ""}
                        onChange={(e) =>
                          onUpdate(participant.id, { name: e.target.value })
                        }
                      />
                    )}
                  </Field>

                  <Field label="Age" required>
                    {({ inputId, describedBy }) => (
                      <TextInput
                        id={inputId}
                        aria-describedby={describedBy}
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={99}
                        placeholder="—"
                        invalid={
                          invalid && problem?.code.includes("age")
                        }
                        value={participant.age || ""}
                        onChange={(e) =>
                          onUpdate(participant.id, {
                            age: Number(e.target.value),
                          })
                        }
                      />
                    )}
                  </Field>

                  <Field label="Height (cm)" required>
                    {({ inputId, describedBy }) => (
                      <TextInput
                        id={inputId}
                        aria-describedby={describedBy}
                        type="number"
                        inputMode="numeric"
                        min={60}
                        max={230}
                        placeholder="—"
                        invalid={
                          invalid && problem?.code.includes("height")
                        }
                        value={participant.heightCm || ""}
                        onChange={(e) =>
                          onUpdate(participant.id, {
                            heightCm: Number(e.target.value),
                          })
                        }
                      />
                    )}
                  </Field>
                </div>

                {problem && (
                  <p
                    role="alert"
                    className="t-body-sm mt-xs flex items-start gap-xxs text-warning"
                  >
                    <span aria-hidden="true">▲</span>
                    {problem.message}
                  </p>
                )}

                {!problem && hasDetails && !rule && (
                  <p
                    role="alert"
                    className="t-body-sm mt-xs flex items-start gap-xxs text-warning"
                  >
                    <span aria-hidden="true">▲</span>
                    We don&apos;t have a price band for this racer on{" "}
                    {experience.name}. Message us and we&apos;ll arrange it.
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        {!atCapacity && (
          <Button variant="outline" size="sm" className="mt-xs" onClick={onAdd}>
            + Add another racer
          </Button>
        )}
      </fieldset>

      {/* ---- Add-ons ------------------------------------------------------ */}
      {availableAddOns.length > 0 && (
        <fieldset>
          <legend className="t-title-md text-ink">Add to your session</legend>
          <p className="t-body-md mt-xxs text-body">Optional. Priced as shown.</p>

          <ul className="mt-sm grid gap-xxs sm:grid-cols-2">
            {availableAddOns.map((addOn) => {
              const checked = addOnIds.includes(addOn.id);
              return (
                <li key={addOn.id}>
                  <label
                    className={cx(
                      "flex h-full cursor-pointer items-start gap-xs border p-sm transition-colors duration-200",
                      checked
                        ? "border-primary bg-primary/5"
                        : "border-hairline hover:border-ink/30"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleAddOn(addOn.id)}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-[#da291c]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-xs">
                        <span className="t-title-sm text-ink">{addOn.name}</span>
                        <span className="t-body-sm tabular shrink-0 text-ink">
                          {formatPrice(addOn.price)}
                          <span className="text-muted">
                            {addOn.unit === "per_person" ? " ea" : ""}
                          </span>
                        </span>
                      </span>
                      <span className="t-caption mt-xxxs block text-muted">
                        {addOn.description}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      )}
    </div>
  );
}
