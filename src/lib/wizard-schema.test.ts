import { describe, expect, it } from "vitest";
import { estimateInputSchema, inquirySubmitSchema } from "./wizard-schema";

const validInput = {
  projectType: "built_in_shelving",
  tier: "premium",
  finish: "stained",
  areas: [{ widthIn: "144", heightIn: 108, numDoors: 4 }],
  priority: "balanced",
};

describe("estimateInputSchema", () => {
  it("accepts a valid input and coerces numeric strings", () => {
    const r = estimateInputSchema.safeParse(validInput);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.areas[0].widthIn).toBe(144);
      expect(r.data.areas[0].heightIn).toBe(108);
    }
  });
  it("rejects an unknown project type", () => {
    expect(estimateInputSchema.safeParse({ ...validInput, projectType: "spaceship" }).success).toBe(false);
  });
  it("rejects an unknown tier", () => {
    expect(estimateInputSchema.safeParse({ ...validInput, tier: "deluxe" }).success).toBe(false);
  });
  it("defaults areas to an empty array", () => {
    const r = estimateInputSchema.safeParse({ projectType: "custom_woodwork", tier: "essential", finish: "painted" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.areas).toEqual([]);
  });
});

describe("inquirySubmitSchema", () => {
  it("requires name + valid phone", () => {
    const r = inquirySubmitSchema.safeParse({ ...validInput, firstName: "Sam", lastName: "Lee", phone: "720-555-1212" });
    expect(r.success).toBe(true);
  });
  it("rejects a bad phone", () => {
    const r = inquirySubmitSchema.safeParse({ ...validInput, firstName: "Sam", lastName: "Lee", phone: "abc" });
    expect(r.success).toBe(false);
  });
  it("rejects a non-empty honeypot", () => {
    const r = inquirySubmitSchema.safeParse({ ...validInput, firstName: "Sam", lastName: "Lee", phone: "7205551212", company: "bot" });
    expect(r.success).toBe(false);
  });
});
