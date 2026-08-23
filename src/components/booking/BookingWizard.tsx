"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { StepNav } from "@/components/booking/StepNav";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { StepLocation } from "@/components/booking/steps/StepLocation";
import { StepExperience } from "@/components/booking/steps/StepExperience";
import { StepDate } from "@/components/booking/steps/StepDate";
import { StepTime } from "@/components/booking/steps/StepTime";
import { StepParticipants } from "@/components/booking/steps/StepParticipants";
import { StepDetails } from "@/components/booking/steps/StepDetails";

import { Button, ButtonAnchor } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/States";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";

import {
  STEPS,
  bookingReducer,
  furthestReachableStep,
  initialState,
} from "@/components/booking/state";
import { useLocations } from "@/components/locations/LocationContext";
import { listExperiencesSync, getExperienceSync } from "@/lib/services/experiences";
import { createGuestBooking } from "@/lib/services/bookings";
import { quoteSync } from "@/lib/services/pricing";
import { resolveRule } from "@/lib/pricing/engine";
import { validateCustomer } from "@/lib/booking/validation";
import { site, whatsappLink } from "@/lib/data/site";
import { formatPrice, cx } from "@/lib/format";
import type { BookingParticipant, ServiceError } from "@/lib/types";

export function BookingWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const { locations, select: selectGlobalLocation } = useLocations();

  // Deep links: /booking?location=agadir&experience=adult-karting
  const [state, dispatch] = useReducer(
    bookingReducer,
    undefined,
    () => {
      const locationSlug = params.get("location");
      const experienceSlug = params.get("experience");
      const validLocation = locations.some((l) => l.slug === locationSlug)
        ? locationSlug
        : null;
      const validExperience =
        validLocation && getExperienceSync(experienceSlug ?? "")
          ? experienceSlug
          : null;

      return initialState({
        locationSlug: validLocation,
        experienceSlug: validExperience,
        step: validExperience ? 2 : validLocation ? 1 : 0,
      });
    }
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<ServiceError | null>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const location = locations.find((l) => l.slug === state.locationSlug) ?? null;
  const experience = state.experienceSlug
    ? getExperienceSync(state.experienceSlug)
    : null;

  const experiences = useMemo(
    () => (location ? listExperiencesSync(location.slug) : []),
    [location]
  );

  // Live quote — preview only. The server recalculates on submit.
  const quote = useMemo(() => {
    if (!location || !experience) return null;
    return quoteSync({
      locationId: location.id,
      experienceId: experience.id,
      participants: state.participants,
      addOnIds: state.addOnIds,
    });
  }, [location, experience, state.participants, state.addOnIds]);

  // Keep the global circuit choice and the URL in step with the wizard.
  useEffect(() => {
    if (state.locationSlug) selectGlobalLocation(state.locationSlug);
  }, [state.locationSlug, selectGlobalLocation]);

  // Move focus to the step heading on change — a screen reader user otherwise
  // has no idea the page content just swapped.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [state.step]);

  const furthest = furthestReachableStep(state);

  /* ---- Step gating ----------------------------------------------------- */
  const customerCheck = validateCustomer(state.customer);

  const canAdvance = (() => {
    switch (state.step) {
      case 0:
        return Boolean(state.locationSlug);
      case 1:
        return Boolean(state.experienceSlug);
      case 2:
        return Boolean(state.date);
      case 3:
        return Boolean(state.timeSlot);
      case 4:
        return Boolean(quote?.isValid);
      case 5:
        return customerCheck.valid && Boolean(quote?.isValid);
      default:
        return false;
    }
  })();

  /** Blocking reason shown next to a disabled Continue button. */
  const blockReason = (() => {
    if (canAdvance) return null;
    switch (state.step) {
      case 0:
        return "Choose a circuit to continue.";
      case 1:
        return "Choose an experience to continue.";
      case 2:
        return "Pick a date to continue.";
      case 3:
        return "Pick a time slot to continue.";
      case 4: {
        if (!quote) return "Add your racers to continue.";
        if (quote.issues.length > 0) return quote.issues[0].message;
        if (
          experience &&
          state.participants.length < experience.minParticipants
        ) {
          return `${experience.name} needs at least ${experience.minParticipants} racers.`;
        }
        return "Add at least one racer to continue.";
      }
      case 5:
        return Object.values(customerCheck.fields)[0] ?? null;
      default:
        return null;
    }
  })();

  /* ---- Participant count handling -------------------------------------- */
  const changeCountForRule = (ruleId: string, delta: number, seedAge: number) => {
    if (!location || !experience) return;

    if (delta > 0) {
      for (let i = 0; i < delta; i++) {
        dispatch({ type: "add_participant", seedAge });
      }
      return;
    }

    // Removing: drop racers that resolve to this band, blank ones first.
    let toRemove = -delta;
    const ordered = [...state.participants].sort((a, b) => {
      const aFilled = a.age > 0 && a.heightCm > 0 ? 1 : 0;
      const bFilled = b.age > 0 && b.heightCm > 0 ? 1 : 0;
      return aFilled - bFilled;
    });

    for (const p of ordered) {
      if (toRemove === 0) break;
      const resolved =
        p.age > 0 && p.heightCm > 0
          ? resolveRule(experience.id, location.id, p.age, p.heightCm)
          : null;
      if (!resolved || resolved.id === ruleId) {
        dispatch({ type: "remove_participant", id: p.id });
        toRemove -= 1;
      }
    }
  };

  /* ---- Submit ----------------------------------------------------------- */
  const submit = async () => {
    if (!location || !experience || !state.date || !state.timeSlot) return;
    if (!customerCheck.valid || !customerCheck.normalised) {
      dispatch({ type: "set_field_errors", errors: customerCheck.fields });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const result = await createGuestBooking({
      locationId: location.id,
      experienceId: experience.id,
      date: state.date,
      timeSlot: state.timeSlot,
      participants: state.participants.map(
        ({ id, name, age, heightCm }): BookingParticipant => ({
          id,
          name,
          age,
          heightCm,
        })
      ),
      addOnIds: state.addOnIds,
      customer: customerCheck.normalised,
    });

    setSubmitting(false);

    if (result.ok) {
      // Hand the reference to the confirmation page; it re-fetches the booking.
      try {
        window.sessionStorage.setItem(
          `atlas.booking.${result.data.reference}`,
          JSON.stringify(result.data)
        );
      } catch {
        /* storage unavailable — the confirmation page falls back to lookup */
      }
      router.push(`/booking/confirmed/${result.data.reference}`);
      return;
    }

    setSubmitError(result.error);
    if (result.error.fields) {
      dispatch({ type: "set_field_errors", errors: result.error.fields });
    }

    // Availability conflicts mean the chosen slot is gone — send them back.
    if (result.error.code === "unavailable") {
      dispatch({ type: "goto", step: 3 });
    }
  };

  const stepTitle = STEPS[state.step].label;

  return (
    <div className="editorial py-lg lg:py-xl">
      <div className="border-b border-hairline pb-sm">
        <StepNav
          current={state.step}
          furthest={furthest}
          onGoto={(step) => dispatch({ type: "goto", step })}
        />
      </div>

      <div className="mt-lg grid gap-lg lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ---- Steps ---------------------------------------------------- */}
        <div>
          <div
            ref={headingRef}
            tabIndex={-1}
            className="outline-none"
            aria-live="polite"
          >
            <p className="t-caption-upper text-muted">
              Step {state.step + 1} of {STEPS.length} — {stepTitle}
            </p>
          </div>

          <div key={state.step} className="mt-sm animate-slide-in">
            {state.step === 0 && (
              <StepLocation
                locations={locations}
                selected={state.locationSlug}
                onSelect={(slug) => dispatch({ type: "set_location", slug })}
              />
            )}

            {state.step === 1 && (
              <StepExperience
                experiences={experiences}
                location={location}
                selected={state.experienceSlug}
                onSelect={(slug) => dispatch({ type: "set_experience", slug })}
                onBack={() => dispatch({ type: "goto", step: 0 })}
              />
            )}

            {state.step === 2 && location && experience && (
              <StepDate
                location={location}
                experience={experience}
                value={state.date}
                onChange={(date) => dispatch({ type: "set_date", date })}
              />
            )}

            {state.step === 3 && location && experience && state.date && (
              <StepTime
                location={location}
                experience={experience}
                date={state.date}
                value={state.timeSlot}
                participantCount={state.participants.length}
                onChange={(time) => dispatch({ type: "set_time", time })}
                onChangeDate={() => dispatch({ type: "goto", step: 2 })}
              />
            )}

            {state.step === 4 && location && experience && (
              <StepParticipants
                experience={experience}
                location={location}
                participants={state.participants}
                addOnIds={state.addOnIds}
                onCountChange={changeCountForRule}
                onUpdate={(id, patch) =>
                  dispatch({ type: "update_participant", id, patch })
                }
                onRemove={(id) => dispatch({ type: "remove_participant", id })}
                onAdd={() => dispatch({ type: "add_participant" })}
                onToggleAddOn={(id) => dispatch({ type: "toggle_addon", id })}
              />
            )}

            {state.step === 5 && (
              <StepDetails
                customer={state.customer}
                errors={state.fieldErrors}
                onChange={(patch) => dispatch({ type: "set_customer", patch })}
              />
            )}
          </div>

          {submitError && (
            <ErrorState
              className="mt-md"
              title={
                submitError.code === "unavailable"
                  ? "That session just filled up"
                  : submitError.code === "network"
                    ? "We couldn't reach the booking system"
                    : "We couldn't confirm this booking"
              }
              message={submitError.message}
              action={
                <ButtonAnchor
                  href={whatsappLink(
                    location?.whatsapp ?? site.whatsapp,
                    `Hi ${site.name}${location ? ` ${location.city}` : ""} — I had trouble booking online and would like to book directly.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="sm"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Book via WhatsApp
                </ButtonAnchor>
              }
            />
          )}

          {/* ---- Desktop controls ---------------------------------------- */}
          <div className="mt-lg hidden items-center gap-xs border-t border-hairline pt-sm lg:flex">
            {state.step > 0 && (
              <Button variant="outline" onClick={() => dispatch({ type: "back" })}>
                ← Back
              </Button>
            )}

            <div className="flex-1" />

            {blockReason && (
              <p className="t-caption max-w-xs text-right text-muted">
                {blockReason}
              </p>
            )}

            {state.step < STEPS.length - 1 ? (
              <Button
                disabled={!canAdvance}
                onClick={() => dispatch({ type: "next" })}
              >
                Continue
              </Button>
            ) : (
              <Button disabled={!canAdvance || submitting} onClick={submit}>
                {submitting ? "Confirming…" : "Confirm booking"}
              </Button>
            )}
          </div>
        </div>

        {/* ---- Summary --------------------------------------------------- */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <BookingSummary
            location={location}
            experience={experience}
            date={state.date}
            timeSlot={state.timeSlot}
            quote={quote}
            participantCount={state.participants.length}
          />

          {quote && quote.issues.length > 0 && state.step >= 4 && (
            <ErrorState
              className="mt-xs"
              title={`${quote.issues.length} racer${quote.issues.length === 1 ? "" : "s"} need attention`}
              message={quote.issues[0].message}
            />
          )}
        </aside>
      </div>

      {/* ---- Mobile sticky controls -------------------------------------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas/95 backdrop-blur-md lg:hidden">
        {blockReason && (
          <p className="t-caption border-b border-hairline px-xs py-xxs text-muted">
            {blockReason}
          </p>
        )}
        <div className="flex items-center gap-xxs p-xs">
          {state.step > 0 && (
            <Button
              variant="outline"
              onClick={() => dispatch({ type: "back" })}
              className="shrink-0 px-xs"
              aria-label="Back to previous step"
            >
              ←
            </Button>
          )}

          <div className="min-w-0 flex-1">
            <p className="t-caption-upper text-muted">Total</p>
            <p
              className={cx(
                "tabular text-lg font-medium leading-none",
                quote?.total ? "text-ink" : "text-muted"
              )}
            >
              {quote && quote.total > 0 ? formatPrice(quote.total) : "—"}
            </p>
          </div>

          {state.step < STEPS.length - 1 ? (
            <Button
              disabled={!canAdvance}
              onClick={() => dispatch({ type: "next" })}
              className="shrink-0"
            >
              Continue
            </Button>
          ) : (
            <Button
              disabled={!canAdvance || submitting}
              onClick={submit}
              className="shrink-0"
            >
              {submitting ? "Confirming…" : "Confirm"}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile spacer so the sticky bar never covers the last control */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
    </div>
  );
}
