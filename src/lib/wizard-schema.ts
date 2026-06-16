import { z } from "zod";

/**
 * Validation + canonical option lists for the estimate wizard. Shared by the
 * client wizard, the /api/estimate preview route, and the submit Server Action.
 * Enums mirror the pricing-engine types (src/lib/pricing/types.ts) and the
 * spec's Part A canonical reference.
 */

export const TIERS = ["essential", "premium", "signature"] as const;

export const PROJECT_TYPES = [
  "built_in_shelving",
  "entertainment_center",
  "custom_cabinets",
  "vanity",
  "closet_system",
  "mudroom_bench_lockers",
  "fireplace_surround",
  "wainscoting",
  "accent_wall",
  "trim_baseboards_crown",
  "floating_shelves",
  "custom_furniture",
  "casing",
  "repairs",
  "full_room",
  "install_only",
  "other",
  "not_sure",
] as const;

export const FINISHES = [
  "raw_unfinished",
  "primed",
  "painted",
  "stained",
  "clear_coated",
  "color_matched",
  "stain_matched",
  "distressed_rustic",
  "high_gloss",
  "matte",
  "satin",
  "luxury_furniture_grade",
] as const;

export const DESIGN_STYLES = [
  "modern",
  "minimal",
  "traditional",
  "transitional",
  "rustic",
  "farmhouse",
  "craftsman",
  "scandinavian",
  "industrial",
  "luxury_architectural",
  "match_existing",
  "not_sure",
] as const;

export const TIMELINES = [
  "flexible",
  "standard",
  "asap",
  "rush_priority",
  "fixed_deadline",
  "event_move_in",
  "emergency_repair",
] as const;

export const BUDGET_BANDS = [
  "under_1k",
  "1k_2_5k",
  "2_5k_5k",
  "5k_10k",
  "10k_25k",
  "25k_plus",
  "unsure",
] as const;

export const PHOTO_LABELS = [
  "wide_room",
  "straight_on",
  "close_up_existing",
  "tape_measure",
  "obstruction",
  "inspiration",
  "sketch",
  "other",
] as const;

/** A stored photo: `{uploadToken}/{photoId}.{ext}` path + optional label. */
export const photoSchema = z.object({
  path: z
    .string()
    .regex(
      /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/,
      "Invalid photo path.",
    ),
  label: z.enum(PHOTO_LABELS).optional(),
  bytes: z.number().int().nonnegative().max(8_000_000).optional(),
  width: z.number().int().nonnegative().max(20000).optional(),
  height: z.number().int().nonnegative().max(20000).optional(),
});

export const PROJECT_GOALS = [
  "add_storage",
  "improve_appearance",
  "increase_home_value",
  "replace_damaged_old",
  "luxury_focal_point",
  "prepare_for_sale",
  "improve_organization",
  "match_existing_style",
  "solve_functional_problem",
  "other",
] as const;

export const EXISTING_CONDITIONS = [
  "demolition_removal_needed",
  "existing_built_ins_to_remove",
  "wall_flat_level_unknown",
  "outlets_switches_in_area",
  "vents_pipes_in_area",
  "baseboards_trim_in_area",
  "windows_doors_in_area",
  "radiators_hvac_in_area",
  "electrical_work_needed",
  "drywall_repair_needed",
  "painting_staining_needed",
  "match_existing_wood_trim",
  "home_occupied",
  "pets_or_children",
  "parking_loading_restrictions",
  "stairs_elevator_access",
  "condo_hoa_commercial_rules",
  "dust_control_required",
  "floor_furniture_protection",
] as const;

export const PRIORITIES = ["balanced", "price_quality", "fast_quality", "price_fast"] as const;
export const COMPLEXITIES = ["simple", "moderate", "complex", "very_complex"] as const;
export const ACCESS_LEVELS = ["easy", "moderate", "hard"] as const;
export const CONTACT_ROLES = [
  "homeowner",
  "renter",
  "property_manager",
  "designer",
  "contractor",
  "realtor",
  "investor",
  "other",
] as const;
export const PREFERRED_CONTACT = ["phone", "text", "email"] as const;

const optionalNonNegNumber = z.coerce
  .number()
  .nonnegative()
  .max(100_000)
  .optional();

export const areaSchema = z.object({
  label: z.string().trim().max(60).optional(),
  widthIn: optionalNonNegNumber,
  heightIn: optionalNonNegNumber,
  depthIn: optionalNonNegNumber,
  linearFeet: optionalNonNegNumber,
  numShelves: optionalNonNegNumber,
  numDrawers: optionalNonNegNumber,
  numDoors: optionalNonNegNumber,
  numCabinets: optionalNonNegNumber,
  numTrimRuns: optionalNonNegNumber,
});

/** Input the pricing engine needs (no contact PII) — used by /api/estimate. */
export const estimateInputSchema = z.object({
  projectType: z.enum(PROJECT_TYPES),
  tier: z.enum(TIERS),
  areas: z.array(areaSchema).max(12).default([]),
  finish: z.enum(FINISHES),
  designStyle: z.enum(DESIGN_STYLES).optional(),
  complexity: z.enum(COMPLEXITIES).optional(),
  access: z.enum(ACCESS_LEVELS).optional(),
  demolition: z.boolean().optional(),
  timeline: z.enum(TIMELINES).optional(),
  priority: z.enum(PRIORITIES).optional(),
  budgetBand: z.enum(BUDGET_BANDS).optional(),
  goals: z.array(z.enum(PROJECT_GOALS)).max(12).optional(),
  conditions: z.array(z.enum(EXISTING_CONDITIONS)).max(30).optional(),
  risk: z
    .object({
      oldHome: z.boolean().optional(),
      unknownWallCondition: z.boolean().optional(),
      lowPhotoQuality: z.boolean().optional(),
      unverifiedMeasurements: z.boolean().optional(),
      complexInstall: z.boolean().optional(),
      matchExisting: z.boolean().optional(),
      tightTimeline: z.boolean().optional(),
    })
    .optional(),
});

export type EstimateInputDTO = z.infer<typeof estimateInputSchema>;

/** Full submission: estimate input + contact. */
export const inquirySubmitSchema = estimateInputSchema.extend({
  firstName: z.string().trim().min(1, "Enter your first name.").max(100),
  lastName: z.string().trim().min(1, "Enter your last name.").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(25)
    .regex(/^[0-9 ()+\-.]+$/, "Enter a valid phone number."),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .refine((v) => v === undefined || z.email().safeParse(v).success, {
      message: "Enter a valid email address.",
    }),
  zip: z
    .string()
    .trim()
    .max(10)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  contactRole: z.enum(CONTACT_ROLES).optional(),
  preferredContact: z.enum(PREFERRED_CONTACT).optional(),
  permissionToText: z.boolean().optional(),
  photos: z.array(photoSchema).max(12).optional(),
  /** Optional account password (set in the wizard to enable portal login). */
  password: z
    .string()
    .max(100)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .refine((v) => v === undefined || v.length >= 8, {
      message: "Password must be at least 8 characters.",
    }),
  /** Honeypot — must be empty. */
  company: z.string().max(0).optional(),
});

export type InquirySubmitDTO = z.infer<typeof inquirySubmitSchema>;
