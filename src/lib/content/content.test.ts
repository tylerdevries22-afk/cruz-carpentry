import { describe, expect, it } from "vitest";
import { validateContentOverride } from "./validate";
import { buildServicesOverride, type ServiceRow, type ServiceSeed } from "./service-edit";
import { isValidImageUrl, WHAT_WE_BUILD_PREFIX } from "./storage";

const IMG = `${WHAT_WE_BUILD_PREFIX}custom-cabinetry/ai-generated/01.webp`;

describe("isValidImageUrl", () => {
  it("accepts what-we-build image URLs", () => {
    expect(isValidImageUrl(IMG)).toBe(true);
  });
  it("rejects foreign hosts and non-images", () => {
    expect(isValidImageUrl("https://evil.com/x.webp")).toBe(false);
    expect(isValidImageUrl(`${WHAT_WE_BUILD_PREFIX}x/y/z.exe`)).toBe(false);
    expect(isValidImageUrl(123)).toBe(false);
  });
});

describe("validateContentOverride", () => {
  it("accepts a valid copy + services override", () => {
    expect(
      validateContentOverride({
        copy: { home: { hero: { badge: "Top rated" } }, faq: { faqs: [{ q: "Q?", a: "A." }] } },
        services: { "custom-cabinetry": { tagline: "New tagline", cardImage: IMG } },
      }),
    ).toBeNull();
  });

  it("rejects unknown top-level keys", () => {
    expect(validateContentOverride({ nope: {} })).toMatch(/Unknown top-level key/);
  });

  it("rejects prototype-polluting keys (from parsed JSON)", () => {
    const payload = JSON.parse('{"copy":{"__proto__":{"x":"y"}}}');
    expect(validateContentOverride(payload)).toMatch(/Disallowed key/);
  });

  it("rejects an unknown service slug", () => {
    expect(validateContentOverride({ services: { nope: { tagline: "x" } } })).toMatch(/Unknown service/);
  });

  it("rejects a non-editable service field", () => {
    expect(validateContentOverride({ services: { "custom-cabinetry": { slug: "x" } } })).toMatch(/not editable/);
  });

  it("rejects a bad num format", () => {
    expect(validateContentOverride({ services: { "custom-cabinetry": { num: "99" } } })).toMatch(/01.*16/);
  });

  it("rejects a duplicate card position (broken permutation)", () => {
    // custom-cabinetry is seed "01"; forcing it to "02" collides with built-in-shelving's "02".
    expect(validateContentOverride({ services: { "custom-cabinetry": { num: "02" } } })).toMatch(/duplicate|Invalid card/);
  });

  it("rejects a non-what-we-build image URL", () => {
    expect(validateContentOverride({ services: { "custom-cabinetry": { cardImage: "https://evil.com/a.webp" } } })).toMatch(/image URL/);
  });
});

function row(slug: string, num: string, over: Partial<ServiceRow> = {}): ServiceRow {
  return {
    slug, num,
    title: `T-${slug}`, shortTitle: `S-${slug}`, cardDescription: "desc",
    cardImage: IMG, heroImage: IMG, tagline: "tag", intro: "intro",
    materials: ["a", "b"], details: [{ title: "d", body: "b" }], faq: [{ q: "q", a: "a" }],
    seo: { title: "t", description: "d" },
    ...over,
  };
}

describe("buildServicesOverride", () => {
  const seed: ServiceSeed = {
    a: row("a", "01"),
    b: row("b", "02"),
  };

  it("returns an empty override when nothing changed", () => {
    const rows = [seed.a as ServiceRow, seed.b as ServiceRow];
    expect(buildServicesOverride(rows, seed)).toEqual({});
  });

  it("derives num from position when reordered", () => {
    const rows = [seed.b as ServiceRow, seed.a as ServiceRow]; // b first now
    const out = buildServicesOverride(rows, seed);
    expect(out).toEqual({ b: { num: "01" }, a: { num: "02" } });
  });

  it("includes only the changed fields", () => {
    const rows = [row("a", "01", { tagline: "Brand new" }), seed.b as ServiceRow];
    const out = buildServicesOverride(rows, seed);
    expect(out).toEqual({ a: { tagline: "Brand new" } });
  });

  it("emits the full array when a list element changes", () => {
    const rows = [row("a", "01", { materials: ["a", "CHANGED"] }), seed.b as ServiceRow];
    const out = buildServicesOverride(rows, seed);
    expect(out.a?.materials).toEqual(["a", "CHANGED"]);
  });
});
