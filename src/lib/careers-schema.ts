import { z } from "zod";

/**
 * Shared option sets + validation for the "Join the Craft" carpenter
 * application. Pure (no I/O) so the client form, the submit Server Action, and
 * tests all agree on the same shape. Enums are exported for the UI chips.
 */

export const ROLES = [
  "Finish Carpenter",
  "Cabinet Maker / Bench Joiner",
  "Installer",
  "Lead / Foreman",
  "Shop Hand",
  "Apprentice",
  "Designer / Drafter",
  "General / Not sure",
] as const;

export const EXPERIENCE_LEVELS = ["Apprentice", "Journeyman", "Lead", "Foreman"] as const;

export const SPECIALTIES = [
  "Finish carpentry",
  "Custom cabinetry",
  "Built-ins",
  "Trim & molding",
  "Doors & hardware",
  "Stairs & railings",
  "Framing",
  "Installation",
  "Shop / bench work",
  "Finishing & staining",
  "Design / drafting",
] as const;

export const TOOLS = [
  "Table saw",
  "Track saw",
  "CNC router",
  "Domino / joinery",
  "Edgebander",
  "Hand tools",
  "Spray finishing",
  "CAD / SketchUp",
] as const;

export const CERTIFICATIONS = [
  "OSHA 10",
  "OSHA 30",
  "First Aid / CPR",
  "Driver's license",
  "Forklift",
  "None yet",
] as const;

export const AVAILABILITY = ["Full-time", "Part-time", "Seasonal", "Contract"] as const;

export const REFERRAL_SOURCES = [
  "Word of mouth",
  "Instagram",
  "Indeed",
  "Referral",
  "Drove past the shop",
  "Google",
  "Other",
] as const;

export const APPLICATION_STATUSES = [
  "new",
  "reviewing",
  "interviewing",
  "hired",
  "rejected",
  "archived",
] as const;

/** Storage path produced by /api/careers/uploads: `${token}/${kind}-${uuid}.${ext}`. */
const PATH_RE = /^[0-9a-f-]{36}\/(resume|cover|photo)-[0-9a-f-]{36}\.(pdf|docx?|jpe?g|png|webp)$/i;

const fileMeta = z.object({
  path: z.string().regex(PATH_RE, "Invalid file reference."),
  name: z.string().trim().max(200),
  bytes: z.number().int().nonnegative().max(15 * 1024 * 1024),
});
export type FileMeta = z.infer<typeof fileMeta>;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, "This field is too long.")
    .nullish()
    .transform((v) => (v && v.length > 0 ? v : undefined));

export const applicationSchema = z.object({
  // honeypot — must be empty
  company: z.string().max(0).optional().or(z.literal("")),
  uploadToken: z.string().regex(/^[0-9a-f-]{36}$/i, "Invalid session."),

  // Step 1 — about you
  fullName: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  email: z.string().trim().min(1, "Please enter your email.").max(200).pipe(z.email("Please enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(25, "Phone number is too long.")
    .regex(/^[0-9 ()+\-.]+$/, "Please enter a valid phone number."),
  location: z.string().trim().min(2, "Where are you based?").max(120, "This field is too long."),
  workAuthorized: z.boolean({ message: "Please answer." }),

  // Step 2 — role & experience
  role: z.enum(ROLES, { message: "Please choose a role." }),
  experienceYears: z.number().int().min(0).max(60),
  experienceLevel: z.enum(EXPERIENCE_LEVELS).nullish().transform((v) => v ?? undefined),
  currentEmployer: optionalText(120),

  // Step 3 — skills
  specialties: z.array(z.enum(SPECIALTIES)).min(1, "Pick at least one specialty.").max(SPECIALTIES.length),
  tools: z.array(z.enum(TOOLS)).max(TOOLS.length).default([]),
  certifications: z.array(z.enum(CERTIFICATIONS)).max(CERTIFICATIONS.length).default([]),

  // Step 4 — availability + uploads
  availability: z.array(z.enum(AVAILABILITY)).min(1, "Pick at least one.").max(AVAILABILITY.length),
  startDate: optionalText(20),
  portfolioUrl: z
    .string()
    .trim()
    .max(300)
    .nullish()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .refine((v) => v === undefined || z.url().safeParse(v).success, { message: "Enter a valid URL (https://…)." }),
  resume: fileMeta,
  coverLetter: fileMeta.nullish().transform((v) => v ?? undefined),
  workPhotos: z.array(fileMeta).max(8).default([]),

  // Step 5 — a few words
  whyCruz: z.string().trim().min(10, "A sentence or two is plenty.").max(1500, "Please keep this under 1500 characters."),
  proudOf: optionalText(1500),
  salaryExpectation: optionalText(60),
  referralSource: z.enum(REFERRAL_SOURCES, { message: "How did you hear about us?" }),
  referralName: optionalText(100),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
