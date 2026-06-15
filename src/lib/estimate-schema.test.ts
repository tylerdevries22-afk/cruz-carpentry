import { describe, expect, it } from "vitest";
import { parseEstimate } from "./estimate-schema";

describe("parseEstimate", () => {
  const valid = {
    name: "Jane Doe",
    phone: "(720) 280-0812",
    email: "jane@example.com",
    projectType: "Built-In Shelving",
    message: "I'd love a quote for built-ins.",
  };

  it("accepts a fully valid submission", () => {
    const result = parseEstimate(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Jane Doe");
      expect(result.data.email).toBe("jane@example.com");
    }
  });

  it("accepts a minimal submission with only name + phone", () => {
    const result = parseEstimate({ name: "Bob", phone: "720-280-0812" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBeUndefined();
      expect(result.data.message).toBeUndefined();
    }
  });

  it("trims surrounding whitespace", () => {
    const result = parseEstimate({ name: "  Ana  ", phone: " 7202800812 " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Ana");
      expect(result.data.phone).toBe("7202800812");
    }
  });

  it("rejects a missing/short name", () => {
    const result = parseEstimate({ name: "A", phone: "7202800812" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.name).toBeDefined();
    }
  });

  it("rejects a phone with letters", () => {
    const result = parseEstimate({ name: "Jane Doe", phone: "call-me" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.phone).toBeDefined();
    }
  });

  it("rejects an invalid email when one is provided", () => {
    const result = parseEstimate({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.email).toBeDefined();
    }
  });

  it("treats an empty email string as not provided", () => {
    const result = parseEstimate({ name: "Jane Doe", phone: "7202800812", email: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBeUndefined();
    }
  });

  it("treats null optional fields (absent on a direct POST) as not provided", () => {
    const result = parseEstimate({
      name: "Jane Doe",
      phone: "7202800812",
      email: null,
      projectType: null,
      message: null,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBeUndefined();
      expect(result.data.projectType).toBeUndefined();
      expect(result.data.message).toBeUndefined();
    }
  });

  it("treats a whitespace-only email as not provided", () => {
    const result = parseEstimate({ name: "Jane Doe", phone: "7202800812", email: "   " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBeUndefined();
    }
  });

  it("rejects an over-length message", () => {
    const result = parseEstimate({
      name: "Jane Doe",
      phone: "7202800812",
      message: "x".repeat(2001),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.message).toBeDefined();
    }
  });
});
