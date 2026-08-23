"use client";

import { useState } from "react";
import { Field, SelectInput, TextArea, TextInput } from "@/components/ui/Field";
import { Button, ButtonAnchor } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/States";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";
import { useLocations } from "@/components/locations/LocationContext";
import { request } from "@/lib/services/http";
import { site, whatsappLink } from "@/lib/data/site";
import type { ServiceError } from "@/lib/types";

const EVENT_TYPES = [
  "Birthday party",
  "Corporate event",
  "Team building",
  "School group",
  "Private race",
  "Something else",
];

/**
 * Contact / enquiry form. Two variants share one component because the fields
 * and the submit path are the same — only the event-specific block differs.
 */
export function ContactForm({
  variant = "general",
}: {
  variant?: "general" | "event";
}) {
  const { locations, selectedSlug } = useLocations();

  const [values, setValues] = useState<Record<string, string>>({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    groupSize: "",
    eventType: EVENT_TYPES[0],
    preferredDate: "",
    locationSlug: selectedSlug ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<ServiceError | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const set = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const location = locations.find((l) => l.slug === values.locationSlug) ?? null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setFormError(null);
    setErrors({});

    const result = await request<{ id: string }>("/api/enquiries", {
      method: "POST",
      body: JSON.stringify({
        kind: variant,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        message: values.message,
        locationId: location?.id ?? null,
        ...(variant === "event"
          ? {
              groupSize: values.groupSize ? Number(values.groupSize) : undefined,
              eventType: values.eventType,
              preferredDate: values.preferredDate || undefined,
            }
          : {}),
      }),
    });

    if (result.ok) {
      setState("sent");
      return;
    }

    setState("idle");
    setFormError(result.error);
    if (result.error.fields) setErrors(result.error.fields);
  };

  if (state === "sent") {
    return (
      <div className="border border-success/40 bg-success/8 p-md" role="status">
        <p className="t-title-md text-success">Message received.</p>
        <p className="t-body-md mt-xxs text-body">
          Thanks {values.fullName.split(" ")[0]} — we&apos;ve got it and we&apos;ll
          reply to {values.email} within one working day.
          {variant === "event" &&
            " For events we usually come back with two or three format options and a price."}
        </p>
        <p className="t-body-md mt-sm text-body">
          In a hurry? WhatsApp is faster.
        </p>
        <div className="mt-sm flex flex-wrap gap-xxs">
          <ButtonAnchor
            href={whatsappLink(
              location?.whatsapp ?? site.whatsapp,
              `Hi ${site.name}${location ? ` ${location.city}` : ""} — I've just sent an enquiry through the website.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Continue on WhatsApp
          </ButtonAnchor>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setState("idle");
              setValues((v) => ({ ...v, message: "" }));
            }}
          >
            Send another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-sm">
      {formError && !formError.fields && (
        <ErrorState
          title={
            formError.code === "network"
              ? "We couldn't send your message"
              : "Something needs fixing"
          }
          message={formError.message}
        />
      )}

      <div className="grid gap-sm sm:grid-cols-2">
        <Field label="Full name" required error={errors.fullName}>
          {({ inputId, describedBy }) => (
            <TextInput
              id={inputId}
              aria-describedby={describedBy}
              autoComplete="name"
              placeholder="Your name"
              invalid={Boolean(errors.fullName)}
              value={values.fullName}
              onChange={(e) => set("fullName", e.target.value)}
            />
          )}
        </Field>

        <Field label="Email" required error={errors.email}>
          {({ inputId, describedBy }) => (
            <TextInput
              id={inputId}
              aria-describedby={describedBy}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              invalid={Boolean(errors.email)}
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
            />
          )}
        </Field>

        <Field
          label="Phone (optional)"
          error={errors.phone}
          hint="Faster for anything time-sensitive."
        >
          {({ inputId, describedBy }) => (
            <TextInput
              id={inputId}
              aria-describedby={describedBy}
              type="tel"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              invalid={Boolean(errors.phone)}
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          )}
        </Field>

        <Field label="Circuit">
          {({ inputId, describedBy }) => (
            <SelectInput
              id={inputId}
              aria-describedby={describedBy}
              value={values.locationSlug}
              onChange={(e) => set("locationSlug", e.target.value)}
            >
              <option value="">No preference</option>
              {locations.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.city}
                </option>
              ))}
            </SelectInput>
          )}
        </Field>

        {variant === "event" && (
          <>
            <Field label="Event type">
              {({ inputId, describedBy }) => (
                <SelectInput
                  id={inputId}
                  aria-describedby={describedBy}
                  value={values.eventType}
                  onChange={(e) => set("eventType", e.target.value)}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </SelectInput>
              )}
            </Field>

            <Field
              label="How many people?"
              required
              error={errors.groupSize}
              hint="An estimate is fine."
            >
              {({ inputId, describedBy }) => (
                <TextInput
                  id={inputId}
                  aria-describedby={describedBy}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  placeholder="e.g. 24"
                  invalid={Boolean(errors.groupSize)}
                  value={values.groupSize}
                  onChange={(e) => set("groupSize", e.target.value)}
                />
              )}
            </Field>

            <Field label="Preferred date (optional)" className="sm:col-span-2">
              {({ inputId, describedBy }) => (
                <TextInput
                  id={inputId}
                  aria-describedby={describedBy}
                  type="date"
                  value={values.preferredDate}
                  onChange={(e) => set("preferredDate", e.target.value)}
                />
              )}
            </Field>
          </>
        )}
      </div>

      <Field
        label="Message"
        required
        error={errors.message}
        hint={
          variant === "event"
            ? "Ages, timing, catering, anything that shapes the day."
            : "What can we help with?"
        }
      >
        {({ inputId, describedBy }) => (
          <TextArea
            id={inputId}
            aria-describedby={describedBy}
            rows={5}
            placeholder={
              variant === "event"
                ? "We're a team of 24, mostly beginners, looking at a Friday afternoon in October…"
                : "Your message"
            }
            invalid={Boolean(errors.message)}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
          />
        )}
      </Field>

      <div className="flex flex-wrap items-center gap-xs">
        <Button type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}
        </Button>
        <p className="t-caption text-muted">
          We reply within one working day.
        </p>
      </div>
    </form>
  );
}
