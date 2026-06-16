import { z } from "zod";

/**
 * Project categories offered in the estimate form's dropdown. Mirrors the 12
 * services in `@/lib/services` (each service's `projectType` must appear here,
 * verified by services.test.ts) plus a catch-all.
 */
export const PROJECT_TYPES = [
  "Custom Cabinetry",
  "Built-In Shelving",
  "Desks & Libraries",
  "Staircases & Railings",
  "Trim & Millwork",
  "Custom Closets",
  "Mudroom & Entryway",
  "Garage & Storage",
  "Beams & Ceilings",
  "Fireplace Mantel",
  "Interior & Barn Doors",
  "Custom Woodwork",
  "Cedar Sauna",
  "Cedar Hot Tub",
  "Outdoor Living",
  "Home Bar",
  "Wine Cellar",
  "Beds & Nightstands",
  "Other / Not sure",
] as const;

/**
 * Trimmed optional text that treats an empty string — or a missing/`null`
 * value (as `FormData.get()` returns for absent keys on a direct POST) — as
 * "not provided".
 */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, "This field is too long.")
    .nullish()
    .transform((value) => (value && value.length > 0 ? value : undefined));

export const estimateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Name is too long."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(25, "Phone number is too long.")
    .regex(/^[0-9 ()+\-.]+$/, "Please enter a valid phone number."),
  email: z
    .string()
    .trim()
    .max(200, "Email is too long.")
    .nullish()
    .transform((value) => (value && value.length > 0 ? value : undefined))
    .refine((value) => value === undefined || z.email().safeParse(value).success, {
      message: "Please enter a valid email address.",
    }),
  projectType: optionalText(60),
  message: optionalText(2000),
});

export type EstimateInput = z.infer<typeof estimateSchema>;
export type EstimateField = keyof EstimateInput;

export type EstimateParseResult =
  | { success: true; data: EstimateInput }
  | { success: false; fieldErrors: Partial<Record<EstimateField, string>> };

/**
 * Validate raw form values. Pure (no I/O) so it can be unit-tested and reused
 * on both client and server. Returns the first error per field.
 */
export function parseEstimate(raw: unknown): EstimateParseResult {
  const result = estimateSchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const fieldErrors: Partial<Record<EstimateField, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as EstimateField | undefined;
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return { success: false, fieldErrors };
}
