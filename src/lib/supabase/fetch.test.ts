import { afterEach, describe, expect, it, vi } from "vitest";
import { createTimeoutFetch } from "./fetch";

describe("createTimeoutFetch", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("aborts the request once the timeout elapses", async () => {
    vi.useFakeTimers();
    // A fetch that only settles when its abort signal fires.
    const fakeFetch = vi.fn(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(Object.assign(new Error("Aborted"), { name: "AbortError" }));
          });
        }),
    );
    vi.stubGlobal("fetch", fakeFetch);

    const promise = createTimeoutFetch(1000)("https://example.com");
    const assertion = expect(promise).rejects.toMatchObject({
      name: "AbortError",
    });
    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
    expect(fakeFetch).toHaveBeenCalledOnce();
  });

  it("clears the timeout when fetch resolves before the deadline", async () => {
    const clearSpy = vi.spyOn(globalThis, "clearTimeout");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("ok")),
    );

    const result = await createTimeoutFetch(5000)("https://example.com");
    expect(result).toBeInstanceOf(Response);
    expect(clearSpy).toHaveBeenCalled();
  });
});
