import type { PricingRule } from "@/lib/types";

/**
 * PRICING CONFIGURATION
 * ---------------------
 * Every price the site quotes comes from this table. Nothing is hardcoded in a
 * component. Rules are matched in declaration order, so narrower rules must come
 * first, and a `locationId` of `null` means "applies at every circuit".
 *
 * Age bands are deliberately data, not code — an operator can move the junior
 * band from 12–17 to 13–16 by editing two numbers here.
 *
 * All values below are PLACEHOLDER prices in MAD pending the operator's real
 * price list.
 */

const MAD = "MAD" as const;

/** Shared band definitions so the same numbers aren't retyped per experience. */
export const ageBands = {
  child: { minAge: 5, maxAge: 11 },
  junior: { minAge: 12, maxAge: 17 },
  adult: { minAge: 18 },
} as const;

export const pricingRules: PricingRule[] = [
  /* --------------------------------------------------- Adult Karting */
  {
    id: "pr_adult_sprint_junior",
    experienceId: "exp_adult_sprint",
    locationId: null,
    category: "junior",
    label: "Junior (14–17)",
    eligibility: { minAge: 14, maxAge: 17, minHeightCm: 150 },
    price: 130,
    currency: MAD,
  },
  {
    id: "pr_adult_sprint_adult",
    experienceId: "exp_adult_sprint",
    locationId: null,
    category: "adult",
    label: "Adult (18+)",
    eligibility: { minAge: 18, minHeightCm: 150 },
    price: 150,
    currency: MAD,
  },
  /* Casablanca runs a city-centre premium on the sprint session. */
  {
    id: "pr_adult_sprint_adult_casa",
    experienceId: "exp_adult_sprint",
    locationId: "loc_casablanca",
    category: "adult",
    label: "Adult (18+)",
    eligibility: { minAge: 18, minHeightCm: 150 },
    price: 170,
    currency: MAD,
  },

  /* ---------------------------------------------------- Race Package */
  {
    id: "pr_race_pack_junior",
    experienceId: "exp_adult_race_pack",
    locationId: null,
    category: "junior",
    label: "Junior (14–17)",
    eligibility: { minAge: 14, maxAge: 17, minHeightCm: 150 },
    price: 340,
    currency: MAD,
  },
  {
    id: "pr_race_pack_adult",
    experienceId: "exp_adult_race_pack",
    locationId: null,
    category: "adult",
    label: "Adult (18+)",
    eligibility: { minAge: 18, minHeightCm: 150 },
    price: 390,
    currency: MAD,
  },

  /* ----------------------------------------------------- Kids Karting */
  {
    id: "pr_kids_child",
    experienceId: "exp_kids_cadet",
    locationId: null,
    category: "child",
    label: "Child (5–11)",
    eligibility: { minAge: 5, maxAge: 11, minHeightCm: 110, maxHeightCm: 165 },
    price: 100,
    currency: MAD,
  },

  /* --------------------------------------------------- Junior Karting */
  {
    id: "pr_junior_junior",
    experienceId: "exp_junior_race",
    locationId: null,
    category: "junior",
    label: "Junior (12–17)",
    eligibility: { minAge: 12, maxAge: 17, minHeightCm: 140 },
    price: 120,
    currency: MAD,
  },

  /* ------------------------------------------------------- Two-Seater */
  {
    id: "pr_two_seater_driver",
    experienceId: "exp_two_seater",
    locationId: null,
    category: "adult",
    label: "Driver (18+)",
    eligibility: { minAge: 18, minHeightCm: 150 },
    price: 180,
    currency: MAD,
  },
  {
    id: "pr_two_seater_passenger",
    experienceId: "exp_two_seater",
    locationId: null,
    category: "passenger",
    label: "Passenger (4+)",
    eligibility: { minAge: 4, minHeightCm: 100 },
    price: 90,
    currency: MAD,
  },

  /* -------------------------------------------------------- Endurance */
  {
    id: "pr_endurance_adult",
    experienceId: "exp_endurance",
    locationId: null,
    category: "adult",
    label: "Team driver (16+)",
    eligibility: { minAge: 16, minHeightCm: 155 },
    price: 450,
    currency: MAD,
  },

  /* ---------------------------------------------------- Group Racing */
  {
    id: "pr_group_junior",
    experienceId: "exp_group_grand_prix",
    locationId: null,
    category: "junior",
    label: "Junior (14–17)",
    eligibility: { minAge: 14, maxAge: 17, minHeightCm: 150 },
    price: 280,
    currency: MAD,
  },
  {
    id: "pr_group_adult",
    experienceId: "exp_group_grand_prix",
    locationId: null,
    category: "adult",
    label: "Adult (18+)",
    eligibility: { minAge: 18, minHeightCm: 150 },
    price: 320,
    currency: MAD,
  },

  /* ------------------------------------------------------- Birthdays */
  {
    id: "pr_birthday_child",
    experienceId: "exp_birthday",
    locationId: null,
    category: "child",
    label: "Child racer (5–11)",
    eligibility: { minAge: 5, maxAge: 11, minHeightCm: 110 },
    price: 220,
    currency: MAD,
  },
  {
    id: "pr_birthday_junior",
    experienceId: "exp_birthday",
    locationId: null,
    category: "junior",
    label: "Junior racer (12–17)",
    eligibility: { minAge: 12, maxAge: 17, minHeightCm: 140 },
    price: 260,
    currency: MAD,
  },
  {
    id: "pr_birthday_adult",
    experienceId: "exp_birthday",
    locationId: null,
    category: "adult",
    label: "Adult racer (18+)",
    eligibility: { minAge: 18, minHeightCm: 150 },
    price: 300,
    currency: MAD,
  },

  /* ------------------------------------------------------- Corporate */
  {
    id: "pr_corporate_adult",
    experienceId: "exp_corporate",
    locationId: null,
    category: "adult",
    label: "Participant (18+)",
    eligibility: { minAge: 18, minHeightCm: 150 },
    price: 650,
    currency: MAD,
  },
  {
    id: "pr_team_building_adult",
    experienceId: "exp_team_building",
    locationId: null,
    category: "adult",
    label: "Participant (18+)",
    eligibility: { minAge: 18, minHeightCm: 150 },
    price: 580,
    currency: MAD,
  },
  {
    id: "pr_school_child",
    experienceId: "exp_school_group",
    locationId: null,
    category: "child",
    label: "Student (8–11)",
    eligibility: { minAge: 8, maxAge: 11, minHeightCm: 120 },
    price: 140,
    currency: MAD,
  },
  {
    id: "pr_school_junior",
    experienceId: "exp_school_group",
    locationId: null,
    category: "junior",
    label: "Student (12–17)",
    eligibility: { minAge: 12, maxAge: 17, minHeightCm: 140 },
    price: 160,
    currency: MAD,
  },
];

/**
 * Volume discounts. Applied by the pricing engine after the participant lines
 * are summed. Highest qualifying threshold wins.
 */
export interface DiscountTier {
  id: string;
  minParticipants: number;
  /** 0.1 === 10% off */
  rate: number;
  label: string;
}

export const discountTiers: DiscountTier[] = [
  { id: "disc_8", minParticipants: 8, rate: 0.05, label: "Group discount · 8+ racers" },
  { id: "disc_15", minParticipants: 15, rate: 0.1, label: "Group discount · 15+ racers" },
  { id: "disc_25", minParticipants: 25, rate: 0.15, label: "Group discount · 25+ racers" },
];
