import { describe, expect, it } from "vitest";
import { SERVICES, getServiceBySlug } from "./services";
import { PROJECT_TYPES } from "./estimate-schema";
import { GALLERY_PHOTOS } from "@/components/gallery/photos";

describe("SERVICES data", () => {
  it("defines exactly 16 services", () => {
    expect(SERVICES).toHaveLength(16);
  });

  it("has unique, URL-safe slugs", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("has sequential, unique badge numbers", () => {
    const nums = SERVICES.map((s) => s.num);
    expect(new Set(nums).size).toBe(nums.length);
    const expected = SERVICES.map((_, i) => String(i + 1).padStart(2, "0"));
    expect([...nums].sort()).toEqual(expected);
  });

  it("uses a projectType that exists in the estimate form", () => {
    for (const service of SERVICES) {
      expect(PROJECT_TYPES).toContain(service.projectType);
    }
  });

  it("references only valid gallery photos", () => {
    for (const service of SERVICES) {
      for (const index of service.galleryIndices) {
        expect(index).toBeGreaterThanOrEqual(1);
        expect(index).toBeLessThanOrEqual(GALLERY_PHOTOS.length);
      }
    }
  });

  it("populates every required content field", () => {
    for (const service of SERVICES) {
      expect(service.title.length).toBeGreaterThan(0);
      expect(service.shortTitle.length).toBeGreaterThan(0);
      expect(service.cardDescription.length).toBeGreaterThan(0);
      expect(service.cardImage).toMatch(/\.webp$/);
      expect(service.heroImage).toMatch(/\.webp$/);
      expect(service.tagline.length).toBeGreaterThan(0);
      expect(service.intro.length).toBeGreaterThan(0);
      expect(service.materials.length).toBeGreaterThanOrEqual(3);
      expect(service.details.length).toBe(3);
      service.details.forEach((d) => {
        expect(d.title.length).toBeGreaterThan(0);
        expect(d.body.length).toBeGreaterThan(0);
      });
      expect(service.faq.length).toBeGreaterThanOrEqual(2);
      service.faq.forEach((f) => {
        expect(f.q.length).toBeGreaterThan(0);
        expect(f.a.length).toBeGreaterThan(0);
      });
      expect(service.seo.title.length).toBeGreaterThan(0);
      expect(service.seo.description.length).toBeGreaterThan(0);
      expect(typeof service.Icon).toBe("function");
    }
  });
});

describe("getServiceBySlug", () => {
  it("returns the matching service", () => {
    const service = getServiceBySlug("custom-cabinetry");
    expect(service?.title).toBe("Custom Cabinetry & Kitchens");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getServiceBySlug("not-a-real-service")).toBeUndefined();
  });
});
