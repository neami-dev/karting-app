import type { BookingParticipant, Customer } from "@/lib/types";

/**
 * Booking wizard state. A plain reducer rather than a form library — the flow
 * has real cross-step invariants (changing the circuit invalidates the date,
 * changing the experience invalidates the slot) that are clearer as explicit
 * transitions than as scattered effects.
 */

export const STEPS = [
  { id: "location", label: "Circuit" },
  { id: "experience", label: "Experience" },
  { id: "date", label: "Date" },
  { id: "time", label: "Time" },
  { id: "participants", label: "Racers" },
  { id: "details", label: "Your details" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

export interface BookingState {
  step: number;
  locationSlug: string | null;
  experienceSlug: string | null;
  date: string | null;
  timeSlot: string | null;
  participants: BookingParticipant[];
  addOnIds: string[];
  customer: Partial<Customer>;
  /** Field-level errors returned by the server on submit */
  fieldErrors: Record<string, string>;
}

export type BookingAction =
  | { type: "set_location"; slug: string }
  | { type: "set_experience"; slug: string }
  | { type: "set_date"; date: string }
  | { type: "set_time"; time: string }
  | { type: "set_participant_count"; count: number }
  | { type: "update_participant"; id: string; patch: Partial<BookingParticipant> }
  | { type: "remove_participant"; id: string }
  | { type: "add_participant"; seedAge?: number }
  | { type: "toggle_addon"; id: string }
  | { type: "set_customer"; patch: Partial<Customer> }
  | { type: "set_field_errors"; errors: Record<string, string> }
  | { type: "goto"; step: number }
  | { type: "next" }
  | { type: "back" };

let seq = 0;
export function newParticipant(): BookingParticipant {
  seq += 1;
  return { id: `p_${Date.now().toString(36)}_${seq}`, age: 0, heightCm: 0 };
}

export function initialState(overrides?: Partial<BookingState>): BookingState {
  return {
    step: 0,
    locationSlug: null,
    experienceSlug: null,
    date: null,
    timeSlot: null,
    participants: [newParticipant()],
    addOnIds: [],
    customer: {},
    fieldErrors: {},
    ...overrides,
  };
}

export function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case "set_location":
      // A different circuit means a different schedule and possibly a different
      // experience catalogue — everything downstream has to be re-chosen.
      if (state.locationSlug === action.slug) return { ...state, step: 1 };
      return {
        ...state,
        locationSlug: action.slug,
        experienceSlug: null,
        date: null,
        timeSlot: null,
        step: 1,
      };

    case "set_experience":
      if (state.experienceSlug === action.slug) return { ...state, step: 2 };
      return {
        ...state,
        experienceSlug: action.slug,
        date: null,
        timeSlot: null,
        addOnIds: [],
        step: 2,
      };

    case "set_date":
      return { ...state, date: action.date, timeSlot: null, step: 3 };

    case "set_time":
      return { ...state, timeSlot: action.time, step: 4 };

    case "set_participant_count": {
      const next = [...state.participants];
      while (next.length < action.count) next.push(newParticipant());
      while (next.length > action.count && next.length > 0) next.pop();
      return { ...state, participants: next };
    }

    case "add_participant": {
      const participant = newParticipant();
      // Seeding the age drops the racer into the band the customer just picked.
      // They still confirm it, and height is always entered by hand.
      if (action.seedAge) participant.age = action.seedAge;
      return { ...state, participants: [...state.participants, participant] };
    }

    case "remove_participant":
      return {
        ...state,
        participants: state.participants.filter((p) => p.id !== action.id),
      };

    case "update_participant":
      return {
        ...state,
        participants: state.participants.map((p) =>
          p.id === action.id ? { ...p, ...action.patch } : p
        ),
      };

    case "toggle_addon":
      return {
        ...state,
        addOnIds: state.addOnIds.includes(action.id)
          ? state.addOnIds.filter((a) => a !== action.id)
          : [...state.addOnIds, action.id],
      };

    case "set_customer":
      return {
        ...state,
        customer: { ...state.customer, ...action.patch },
        // Clear the error for any field the customer is actively fixing.
        fieldErrors: Object.fromEntries(
          Object.entries(state.fieldErrors).filter(
            ([k]) => !(k in action.patch)
          )
        ),
      };

    case "set_field_errors":
      return { ...state, fieldErrors: action.errors };

    case "goto":
      return { ...state, step: Math.max(0, Math.min(STEPS.length - 1, action.step)) };

    case "next":
      return { ...state, step: Math.min(STEPS.length - 1, state.step + 1) };

    case "back":
      return { ...state, step: Math.max(0, state.step - 1) };

    default:
      return state;
  }
}

/** Which steps the visitor is allowed to jump back to. */
export function furthestReachableStep(state: BookingState): number {
  if (!state.locationSlug) return 0;
  if (!state.experienceSlug) return 1;
  if (!state.date) return 2;
  if (!state.timeSlot) return 3;
  return 5;
}
