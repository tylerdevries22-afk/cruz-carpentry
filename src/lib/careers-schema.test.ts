import { describe, it, expect } from "vitest";
import { applicationSchema } from "./careers-schema";

const TOKEN = "11111111-1111-1111-1111-111111111111";
const resume = {
  path: `${TOKEN}/resume-22222222-2222-2222-2222-222222222222.pdf`,
  name: "resume.pdf",
  bytes: 12345,
};

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    company: "",
    uploadToken: TOKEN,
    fullName: "Jordan Carpenter",
    email: "jordan@example.com",
    phone: "(720) 555-0100",
    location: "Denver, CO",
    workAuthorized: true,
    role: "Finish Carpenter",
    experienceYears: 8,
    specialties: ["Finish carpentry", "Custom cabinetry"],
    availability: ["Full-time"],
    resume,
    whyCruz: "I care about clean joinery and finished work I can sign my name to.",
    referralSource: "Word of mouth",
    ...overrides,
  };
}

describe("applicationSchema", () => {
  it("accepts a complete valid application", () => {
    const r = applicationSchema.safeParse(validPayload());
    expect(r.success).toBe(true);
  });

  it("defaults optional arrays and trims optional text", () => {
    const r = applicationSchema.parse(validPayload());
    expect(r.tools).toEqual([]);
    expect(r.certifications).toEqual([]);
    expect(r.workPhotos).toEqual([]);
    expect(r.coverLetter).toBeUndefined();
  });

  it("requires at least one specialty", () => {
    const r = applicationSchema.safeParse(validPayload({ specialties: [] }));
    expect(r.success).toBe(false);
  });

  it("requires a resume with a token-scoped path shape", () => {
    expect(applicationSchema.safeParse(validPayload({ resume: undefined })).success).toBe(false);
    expect(
      applicationSchema.safeParse(validPayload({ resume: { path: "../etc/passwd", name: "x", bytes: 1 } })).success,
    ).toBe(false);
  });

  it("rejects an invalid email and a too-short why", () => {
    expect(applicationSchema.safeParse(validPayload({ email: "nope" })).success).toBe(false);
    expect(applicationSchema.safeParse(validPayload({ whyCruz: "hi" })).success).toBe(false);
  });

  it("rejects unknown enum values for role and referral", () => {
    expect(applicationSchema.safeParse(validPayload({ role: "CEO" })).success).toBe(false);
    expect(applicationSchema.safeParse(validPayload({ referralSource: "Carrier pigeon" })).success).toBe(false);
  });

  it("accepts an optional valid portfolio URL but rejects junk", () => {
    expect(applicationSchema.safeParse(validPayload({ portfolioUrl: "https://insta.gram/me" })).success).toBe(true);
    expect(applicationSchema.safeParse(validPayload({ portfolioUrl: "not a url" })).success).toBe(false);
  });
});
