import type { FaqItem } from "@/lib/types";

export const faqCategories = [
  { id: "booking", label: "Booking" },
  { id: "age_height", label: "Age & Height" },
  { id: "safety", label: "Safety" },
  { id: "pricing", label: "Pricing" },
  { id: "track", label: "Track" },
] as const;

export const faqs: FaqItem[] = [
  /* Booking */
  {
    id: "faq_no_account",
    category: "booking",
    question: "Can I book without creating an account?",
    answer:
      "Yes. There is no signup, no password and no dashboard. You choose a circuit, a session and your racers, leave a name, phone number and email, and we send you a booking reference. That reference plus your phone number is everything you need.",
  },
  {
    id: "faq_change",
    category: "booking",
    question: "Can I change my booking?",
    answer:
      "Yes, up to 24 hours before your session. Reply to your confirmation email or message the circuit on WhatsApp with your booking reference and we will move you to another slot at no cost.",
  },
  {
    id: "faq_cancel",
    category: "booking",
    question: "Can I cancel and get a refund?",
    answer:
      "Cancellations made more than 24 hours before your session are refunded in full. Inside 24 hours we can move you to another date, but we cannot refund the slot — it is usually too late to resell it.",
  },
  {
    id: "faq_arrive",
    category: "booking",
    question: "How early should I arrive?",
    answer:
      "Fifteen minutes before your slot for a single session, thirty minutes for a race package or group event. That covers sign-in, kit fitting and the safety briefing. Arrive late and we may have to shorten your time on track.",
  },
  {
    id: "faq_walk_in",
    category: "booking",
    question: "Can I just turn up?",
    answer:
      "You can, and we will fit you in if there is space. But evenings and weekends regularly sell out, so booking ahead is the only way to guarantee a kart.",
  },
  {
    id: "faq_group_booking",
    category: "booking",
    question: "Can I book for a group?",
    answer:
      "Yes. Group Racing runs from eight racers upward with a private grid. Above twelve people, corporate and team-building formats become available — those are enquiry-based so we can build the day around your headcount.",
  },

  /* Age & height */
  {
    id: "faq_min_age",
    category: "age_height",
    question: "What is the minimum age?",
    answer:
      "Five years old for cadet karts on the junior circuit. Twelve for junior karts on the main circuit, and fourteen for the senior GT karts. Children from four can ride as a passenger in a two-seater.",
  },
  {
    id: "faq_min_height",
    category: "age_height",
    question: "What is the minimum height?",
    answer:
      "110 cm for cadet karts, 140 cm for junior karts and 150 cm for senior karts. The limit exists because the pedals and harness have to fit — a racer who cannot reach the pedals safely cannot be sent out, whatever their age.",
  },
  {
    id: "faq_children",
    category: "age_height",
    question: "Can young children take part?",
    answer:
      "From age five they can drive a cadet kart themselves on the separated junior circuit. From four they can ride as a passenger in a two-seater with an instructor driving. Below that, they are very welcome to watch from the terrace.",
  },
  {
    id: "faq_max_age",
    category: "age_height",
    question: "Is there an upper age limit?",
    answer:
      "No. If you can get in and out of the kart unassisted and hold the wheel, you can race. Our oldest regular is well past seventy and quicker than most of his grandchildren.",
  },

  /* Safety */
  {
    id: "faq_helmet",
    category: "safety",
    question: "Is a helmet provided?",
    answer:
      "Yes. A correctly sized helmet, a race suit and a neck brace are included with every session, in adult and child sizes. A fresh balaclava is provided under every helmet.",
  },
  {
    id: "faq_equipment",
    category: "safety",
    question: "What equipment do I need to bring?",
    answer:
      "Nothing. All safety equipment is included. You may bring your own helmet if it carries a current motorsport homologation and passes our check at sign-in.",
  },
  {
    id: "faq_shoes",
    category: "safety",
    question: "What should I wear?",
    answer:
      "Closed shoes are mandatory — no sandals, no open heels. Otherwise wear something comfortable you can move in. The race suit goes over your clothes, so avoid anything bulky.",
  },
  {
    id: "faq_briefing",
    category: "safety",
    question: "Is there a safety briefing?",
    answer:
      "Always, and it is not optional. Every racer sits through a short briefing covering flags, overtaking and what to do if you spin. Marshals watch the circuit for the whole session.",
  },
  {
    id: "faq_pregnancy",
    category: "safety",
    question: "Are there any health restrictions?",
    answer:
      "We cannot take racers who are pregnant, or who have a back, neck or heart condition, and we ask that you do not race under the influence of alcohol. If you are unsure, speak to us before you book.",
  },

  /* Pricing */
  {
    id: "faq_child_price",
    category: "pricing",
    question: "How are children charged?",
    answer:
      "By age band, automatically. When you enter each racer's age and height during booking, the system applies the right band — child, junior or adult — and shows you the price per racer before you confirm. Nothing is estimated.",
  },
  {
    id: "faq_group_discount",
    category: "pricing",
    question: "Are group discounts available?",
    answer:
      "Yes, and they apply automatically. Five percent off from eight racers, ten percent from fifteen, and fifteen percent from twenty-five. You will see the discount appear in your booking summary as you add racers.",
  },
  {
    id: "faq_packages",
    category: "pricing",
    question: "Are there packages?",
    answer:
      "The Race Package bundles practice, qualifying, a race and a podium ceremony. Endurance runs a ninety-minute team format with pit stops. Both work out cheaper per minute on track than booking single sessions.",
  },
  {
    id: "faq_payment",
    category: "pricing",
    question: "When do I pay?",
    answer:
      "At the circuit, when you arrive. Booking online reserves your karts — it does not charge your card. Card and cash are both accepted at every circuit.",
  },
  {
    id: "faq_price_differ",
    category: "pricing",
    question: "Why do prices differ between circuits?",
    answer:
      "Track length, operating hours and local costs vary. The price you see during booking is always the price for the circuit you selected — pick a different city and the summary updates.",
  },

  /* Track */
  {
    id: "faq_session_length",
    category: "track",
    question: "How long is a session?",
    answer:
      "A standard adult sprint is fifteen minutes of running. Kids sessions are twelve. Race packages run about an hour end to end, and endurance races ninety minutes. Add fifteen to thirty minutes for briefing and kit.",
  },
  {
    id: "faq_how_many",
    category: "track",
    question: "How many people can race at once?",
    answer:
      "Up to twelve karts on the main circuit at Agadir and Casablanca, and up to sixteen at Marrakech. The junior circuit runs a maximum of eight cadets.",
  },
  {
    id: "faq_timed",
    category: "track",
    question: "Are sessions timed?",
    answer:
      "Every kart carries a transponder. Lap times, sector splits and your fastest lap are recorded and printed at the end of the session. Race packages also use qualifying times to set the grid.",
  },
  {
    id: "faq_weather",
    category: "track",
    question: "What happens if it rains?",
    answer:
      "We race. The karts run wet tyres and the circuits drain well — most regulars will tell you a wet session is the most fun they have had. If conditions become genuinely unsafe we will move your booking free of charge.",
  },
  {
    id: "faq_spectators",
    category: "track",
    question: "Can people watch without racing?",
    answer:
      "Yes, and it is free. Every circuit has a covered terrace overlooking the main straight, with a live timing screen so spectators can follow the session properly.",
  },
];
