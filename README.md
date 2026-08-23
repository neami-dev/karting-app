# Atlas Karting

A multi-location karting website with a guest booking system — no account, no
password, no customer dashboard. Built with Next.js 15 (App Router),
TypeScript and Tailwind CSS v4.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```

---

## What this is

Three circuits (Agadir, Casablanca, Marrakech), each with its own tracks, kart
fleet, opening hours, experience catalogue and prices. A visitor picks a
circuit, an experience, a date and a time slot, enters each racer's age and
height, sees the price resolve per racer, leaves a name/phone/email, and gets a
booking reference. Adding a fourth circuit is a data change, not a code change.

## Architecture

```
src/
  app/
    page.tsx                       home
    [location]/                    /agadir, /casablanca, /marrakech (local SEO)
    experiences/[slug]/            experience directory + detail
    kids · adults · events · pricing · about · faq · contact
    booking/                       the wizard
    booking/confirmed/[reference]/ confirmation
    api/                           the backend boundary (route handlers)
  components/
    booking/  experiences/  locations/  pricing/  home/  layout/  ui/  visuals/
  lib/
    types.ts                       the domain model
    data/                          mock data — the ONLY place it lives
    services/                      the seam between UI and backend
    pricing/engine.ts              eligibility + price, pure functions
    availability/engine.ts         slot generation
    booking/                       reference, validation, store, .ics export
    seo/                           metadata + structured data
```

### The service seam

No component reads mock data directly. Everything goes through
`lib/services/*`, which exposes the interfaces a real backend would implement:

```ts
getLocations()                                  getExperiences(locationId)
getAvailability(locationId, experienceId, date) getQuote({ … })
createGuestBooking({ … })                       lookupBooking(reference, contact)
```

Reads resolve directly on the server and over HTTP in the browser. Replacing
the mocks means changing these files and nothing else.

### Pricing is data, not code

`lib/data/pricing-rules.ts` holds every price the site quotes. A rule binds an
age/height window to a price for one experience, optionally scoped to one
circuit:

```ts
{ experienceId, locationId, category, label,
  eligibility: { minAge, maxAge, minHeightCm, maxHeightCm },
  price, currency }
```

Rules match in declaration order (narrower first) and a `locationId` rule
shadows the global one for the same category. Moving the junior band from
12–17 to 13–16 is two numbers. Volume discounts live in the same file.

### Booking security

The client never submits a price. `POST /api/bookings` accepts no total and
reads none — it recalculates eligibility, per-racer pricing, discounts and
remaining slot capacity from the same engine the UI previews with, and stores
its own numbers. Verified: a request carrying `total: 1` is stored at its real
580 MAD.

The UI's live summary is a *preview*. The server's figure is the one that counts.

## Design system

`design-system.md` is the source of truth, translated 1:1 into Tailwind v4
`@theme` tokens in `src/app/globals.css`: near-black `#181818` canvas, a single
Rosso Corsa `#da291c` accent used scarcely, sharp 0px corners everywhere except
badge pills, Inter at weight 500 for display (never bold), uppercase tracked
CTAs, and the named 8px spacing ladder (`xxxs` … `super`).

**Two deliberate deviations, both documented in the CSS:**

1. `--color-body` and `--color-muted-soft` are a few steps lighter than the
   documented hex. The originals landed at 4.46:1 and 4.08:1 on the elevated
   card surface — just under WCAG AA. `--color-muted` (#666666) keeps its
   documented value and is used on the white editorial bands, where it passes.
2. Rosso Corsa is not used for 11px text. It cannot reach 4.5:1 on either dark
   surface. It stays on CTAs, hairline accents and badges, where it passes.

**One collision to know about:** the named spacing tokens `xs/sm/md/lg/xl`
shadow Tailwind's container scale, so `max-w-xl` resolves to the 64px *spacing*
token rather than 36rem. Use explicit widths (`max-w-[36rem]`) instead.

## Imagery

There is no trackside photography for this build, so rather than ship stock
images pretending to be these circuits, every hero and card renders a composed
SVG "cinema plate" — asphalt, perspective geometry, motion streaks, one red
accent — from `components/visuals/TrackVisual.tsx`.

**To use real photography:** swap the `<svg>` for `next/image` inside that one
component. Every surface on the site routes through it.

## Placeholder data

Circuit dimensions, kart specs, opening hours, phone numbers, prices, review
content and company history are placeholder values pending the operator's real
figures. They are marked in the UI where a visitor could mistake them for fact,
and each `Location` carries `dataStatus: "placeholder"`.

## Verification

Driven in Chromium: the full journey (circuit → experience → date → slot →
racers → details → confirmation) completes with no console errors; eligibility
failures block submission with specific messages; the API rejects tampered
prices, invalid ages and heights, sold-out slots, undersized groups and
malformed contact details.

All twelve page types plus the live wizard report **zero axe WCAG 2.1 AA
violations**. Keyboard-verified: calendar roving tabindex with arrow/Page
navigation, mobile drawer escape-and-restore-focus, accordion toggling.

## Not built

- **i18n.** Single-locale (English). French and Arabic matter for this market;
  the booking core is locale-agnostic, so an `[locale]` segment can be layered
  on without touching it.
- **Payment.** Bookings reserve karts; payment is taken at the circuit.
- **Persistence.** `lib/booking/store.ts` and `lib/data/enquiries.ts` are
  in-memory `globalThis` stores. They define the interface a real datastore
  implements; nothing else changes.
- **Manage my booking.** `GET /api/bookings/lookup?reference=&contact=` is
  built and tested; the screen on top of it is not.
- **Transactional email.** Enquiries and bookings are stored, not sent.
