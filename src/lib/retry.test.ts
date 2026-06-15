import { describe, expect, it, vi } from "vitest";
import { withRetry, isPermanentDbError } from "./retry";

describe("withRetry", () => {
  it("returns on first success without retrying", async () => {
    const fn = vi.fn(async () => "ok");
    const result = await withRetry(fn, { retries: 2, delayMs: 0 });
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries after a failure and returns the eventual success", async () => {
    const fn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("transient"))
      .mockResolvedValueOnce("ok");
    const result = await withRetry(fn, { retries: 1, delayMs: 0 });
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("runs retries + 1 attempts then rethrows the last error", async () => {
    const fn = vi.fn(async () => {
      throw new Error("always fails");
    });
    await expect(withRetry(fn, { retries: 2, delayMs: 0 })).rejects.toThrow(
      "always fails",
    );
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("does not retry when shouldRetry returns false", async () => {
    const fn = vi.fn(async () => {
      throw new Error("permanent");
    });
    await expect(
      withRetry(fn, { retries: 3, delayMs: 0, shouldRetry: () => false }),
    ).rejects.toThrow("permanent");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("skips retries for permanent DB errors via isPermanentDbError", async () => {
    const fn = vi.fn(async () => {
      throw { code: "23505", message: "duplicate key" };
    });
    await expect(
      withRetry(fn, {
        retries: 2,
        delayMs: 0,
        shouldRetry: (e) => !isPermanentDbError(e),
      }),
    ).rejects.toMatchObject({ code: "23505" });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("isPermanentDbError", () => {
  it("treats data/constraint/syntax codes as permanent", () => {
    expect(isPermanentDbError({ code: "22001" })).toBe(true); // string too long
    expect(isPermanentDbError({ code: "23502" })).toBe(true); // not-null violation
    expect(isPermanentDbError({ code: "23505" })).toBe(true); // unique violation
    expect(isPermanentDbError({ code: "42501" })).toBe(true); // insufficient privilege
  });

  it("treats connection/transient codes and unknowns as retryable", () => {
    expect(isPermanentDbError({ code: "08006" })).toBe(false); // connection failure
    expect(isPermanentDbError({ code: "PGRST301" })).toBe(false);
    expect(isPermanentDbError({ message: "fetch failed" })).toBe(false);
    expect(isPermanentDbError(null)).toBe(false);
    expect(isPermanentDbError(new Error("network"))).toBe(false);
  });
});
