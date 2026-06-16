import { vi, describe, it, expect, beforeEach } from "vitest";

// Hoisted mocks so the vi.mock factories below can reference them.
const { insertMock, rpcMock, ipRef } = vi.hoisted(() => ({
  insertMock: vi.fn(),
  rpcMock: vi.fn(),
  ipRef: { current: "test-ip" },
}));

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (k: string) => (k === "x-real-ip" ? ipRef.current : null),
  }),
}));

vi.mock("@/lib/supabase/server", () => ({
  isServiceConfigured: () => true,
  getServiceSupabase: () => ({
    from: () => ({ insert: insertMock }),
    rpc: rpcMock,
  }),
}));

import { submitEstimate, initialEstimateState } from "./estimate";

const valid = {
  name: "Jane Doe",
  phone: "(720) 280-0812",
  email: "jane@example.com",
  projectType: "Custom Cabinetry",
  message: "I'd like a quote for kitchen cabinets.",
};

function formData(fields: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
}

beforeEach(() => {
  insertMock.mockReset().mockResolvedValue({ error: null });
  rpcMock.mockReset().mockResolvedValue({ data: false, error: null });
});

describe("submitEstimate", () => {
  it("treats a filled honeypot as success without writing to the DB", async () => {
    ipRef.current = "ip-honeypot";
    const res = await submitEstimate(initialEstimateState, formData({ ...valid, company: "bot" }));
    expect(res.status).toBe("success");
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("inserts a valid lead and returns success", async () => {
    ipRef.current = "ip-valid";
    const res = await submitEstimate(initialEstimateState, formData(valid));
    expect(res.status).toBe("success");
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid input without writing", async () => {
    ipRef.current = "ip-invalid";
    const res = await submitEstimate(initialEstimateState, formData({ ...valid, name: "", phone: "" }));
    expect(res.status).toBe("error");
    expect(res.fieldErrors).toBeTruthy();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("blocks when the shared rate limit is exceeded", async () => {
    ipRef.current = "ip-blocked";
    rpcMock.mockResolvedValue({ data: true, error: null });
    const res = await submitEstimate(initialEstimateState, formData(valid));
    expect(res.status).toBe("error");
    expect(res.message).toMatch(/too many/i);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("does not retry a permanent DB error (constraint violation)", async () => {
    ipRef.current = "ip-permanent";
    insertMock.mockResolvedValue({ error: { code: "23505", message: "duplicate" } });
    const res = await submitEstimate(initialEstimateState, formData(valid));
    expect(res.status).toBe("error");
    expect(insertMock).toHaveBeenCalledTimes(1);
  });
});
