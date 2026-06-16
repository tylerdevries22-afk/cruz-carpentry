import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./customer-auth";

describe("customer password hashing", () => {
  it("verifies a correct password and rejects a wrong one", () => {
    const stored = hashPassword("correct horse battery staple");
    expect(stored).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
    expect(verifyPassword("correct horse battery staple", stored)).toBe(true);
    expect(verifyPassword("wrong password", stored)).toBe(false);
  });

  it("uses a random salt (same password → different stored value)", () => {
    expect(hashPassword("samePass123")).not.toBe(hashPassword("samePass123"));
  });

  it("rejects empty/malformed stored hashes", () => {
    expect(verifyPassword("x", null)).toBe(false);
    expect(verifyPassword("x", "")).toBe(false);
    expect(verifyPassword("x", "notvalid")).toBe(false);
  });
});
