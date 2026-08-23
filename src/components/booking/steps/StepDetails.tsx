"use client";

import { Field, TextArea, TextInput } from "@/components/ui/Field";
import type { Customer } from "@/lib/types";

/**
 * Only the three details the circuit genuinely needs on the day, plus an
 * optional note. No account, no password — and we say why each field is here,
 * because "why do you need my number" is a real objection at this step.
 */
export function StepDetails({
  customer,
  errors,
  onChange,
}: {
  customer: Partial<Customer>;
  errors: Record<string, string>;
  onChange: (patch: Partial<Customer>) => void;
}) {
  return (
    <fieldset>
      <legend className="t-display-md text-ink">Who&apos;s the booking for?</legend>
      <p className="t-body-md mt-xxs max-w-xl text-body">
        We use these details to confirm your booking and to reach you if anything
        changes on the day. There&apos;s no account to create and no password to
        remember.
      </p>

      <div className="mt-md flex max-w-xl flex-col gap-sm">
        <Field label="Full name" required error={errors.fullName}>
          {({ inputId, describedBy }) => (
            <TextInput
              id={inputId}
              aria-describedby={describedBy}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              invalid={Boolean(errors.fullName)}
              value={customer.fullName ?? ""}
              onChange={(e) => onChange({ fullName: e.target.value })}
            />
          )}
        </Field>

        <Field
          label="Phone number"
          required
          error={errors.phone}
          hint="The circuit calls this number if your session is affected by weather or a delay."
        >
          {({ inputId, describedBy }) => (
            <TextInput
              id={inputId}
              aria-describedby={describedBy}
              name="tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              invalid={Boolean(errors.phone)}
              value={customer.phone ?? ""}
              onChange={(e) => onChange({ phone: e.target.value })}
            />
          )}
        </Field>

        <Field
          label="Email"
          required
          error={errors.email}
          hint="Your booking reference and confirmation are sent here."
        >
          {({ inputId, describedBy }) => (
            <TextInput
              id={inputId}
              aria-describedby={describedBy}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              invalid={Boolean(errors.email)}
              value={customer.email ?? ""}
              onChange={(e) => onChange({ email: e.target.value })}
            />
          )}
        </Field>

        <Field
          label="Special request (optional)"
          hint="Birthday, accessibility needs, a driver who's never karted before — anything worth knowing."
        >
          {({ inputId, describedBy }) => (
            <TextArea
              id={inputId}
              aria-describedby={describedBy}
              rows={3}
              placeholder="Anything we should know?"
              value={customer.specialRequest ?? ""}
              onChange={(e) => onChange({ specialRequest: e.target.value })}
            />
          )}
        </Field>
      </div>
    </fieldset>
  );
}
