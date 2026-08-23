import type { Review } from "@/lib/types";

/**
 * PLACEHOLDER review content. Replace with a live feed (Google Places API or
 * similar) via `lib/services/reviews.ts` — no component reads this file directly.
 */
export const reviews: Review[] = [
  {
    id: "rev_1",
    author: "Youssef B.",
    locationId: "loc_agadir",
    rating: 5,
    body: "Booked four of us on a Friday night for the race package. The qualifying format makes it — you spend the whole race trying to undo whatever you did in qualifying. The floodlit circuit is something else after dark.",
    date: "2026-07-14",
    source: "google",
  },
  {
    id: "rev_2",
    author: "Salma E.",
    locationId: "loc_casablanca",
    rating: 5,
    body: "Took my son for his ninth birthday. What I actually cared about was the supervision, and it was faultless — separate circuit, a marshal watching the whole time, kit that fit him properly. He has asked to go back every weekend since.",
    date: "2026-06-28",
    source: "google",
  },
  {
    id: "rev_3",
    author: "Karim A.",
    locationId: "loc_marrakech",
    rating: 5,
    body: "The Ourika circuit is the real thing. Long enough that you can actually build a lap rather than just survive corners. The uphill section in sector two took me four sessions to get right.",
    date: "2026-08-02",
    source: "google",
  },
  {
    id: "rev_4",
    author: "Nadia L.",
    locationId: "loc_casablanca",
    rating: 4,
    body: "Team offsite for eighteen people. Booking was handled over WhatsApp in about ten minutes. Only note is that the lounge gets busy at peak times — go for an earlier slot if you want the space to yourselves.",
    date: "2026-05-19",
    source: "google",
  },
  {
    id: "rev_5",
    author: "Hamza T.",
    locationId: "loc_agadir",
    rating: 5,
    body: "Booked in about ninety seconds on my phone, no account, no nonsense. Turned up, they had the karts ready. The printed timing sheet at the end is a dangerous thing to give a group of friends.",
    date: "2026-07-30",
    source: "google",
  },
  {
    id: "rev_6",
    author: "Imane R.",
    locationId: "loc_marrakech",
    rating: 5,
    body: "Did the two-seater with my daughter, who is six and had no interest in driving herself. She has not stopped talking about it. Instructor was brilliant with her.",
    date: "2026-08-11",
    source: "instagram",
  },
];
