/**
 * Validates a content override before it's persisted and deep-merged into the
 * live site. A bad payload would otherwise corrupt every page, so this is strict:
 * top-level allowlist, recursive string/shape checks, prototype-pollution guard,
 * and a card-order (`num`) permutation check that keeps the services invariants
 * (exactly 01..16, unique) green.
 */

import { SERVICES } from "@/lib/services";
import { EDITABLE_SERVICE_FIELDS, type EditableService } from "./types";
import { isValidImageUrl } from "./storage";

const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const MAX_STR = 5000;
const SERVICE_SLUGS = new Set(SERVICES.map((s) => s.slug));

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function checkString(v: unknown, path: string): string | null {
  if (typeof v !== "string") return `"${path}" must be text.`;
  if (v.length > MAX_STR) return `"${path}" is too long (max ${MAX_STR} characters).`;
  return null;
}

/** Copy tree: strings, nested objects, or arrays of {strings | objects-of-strings}. */
function validateCopyNode(node: unknown, path: string): string | null {
  if (typeof node === "string") return checkString(node, path);
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const err = validateCopyNode(node[i], `${path}[${i}]`);
      if (err) return err;
    }
    return null;
  }
  if (isObj(node)) {
    for (const [k, v] of Object.entries(node)) {
      if (UNSAFE_KEYS.has(k)) return `Disallowed key "${k}".`;
      const err = validateCopyNode(v, path ? `${path}.${k}` : k);
      if (err) return err;
    }
    return null;
  }
  return `"${path}" must be text.`;
}

function validateServiceOverride(slug: string, value: unknown): string | null {
  if (!SERVICE_SLUGS.has(slug)) return `Unknown service "${slug}".`;
  if (!isObj(value)) return `"${slug}" must be an object.`;
  const allowed = new Set<string>(EDITABLE_SERVICE_FIELDS as string[]);
  for (const [k, v] of Object.entries(value)) {
    if (UNSAFE_KEYS.has(k)) return `Disallowed key "${k}".`;
    if (!allowed.has(k)) return `"${slug}.${k}" is not editable.`;
    const field = k as keyof EditableService;
    switch (field) {
      case "num": {
        if (typeof v !== "string" || !/^(0[1-9]|1[0-6])$/.test(v)) {
          return `"${slug}.num" must be "01"–"16".`;
        }
        break;
      }
      case "cardImage":
      case "heroImage":
        if (!isValidImageUrl(v)) return `"${slug}.${k}" must be a what-we-build image URL.`;
        break;
      case "materials": {
        if (!Array.isArray(v)) return `"${slug}.materials" must be a list.`;
        for (let i = 0; i < v.length; i++) {
          const err = checkString(v[i], `${slug}.materials[${i}]`);
          if (err) return err;
        }
        break;
      }
      case "details": {
        if (!Array.isArray(v)) return `"${slug}.details" must be a list.`;
        for (let i = 0; i < v.length; i++) {
          const d = v[i];
          if (!isObj(d)) return `"${slug}.details[${i}]" must be an object.`;
          const e1 = checkString(d.title, `${slug}.details[${i}].title`);
          if (e1) return e1;
          const e2 = checkString(d.body, `${slug}.details[${i}].body`);
          if (e2) return e2;
        }
        break;
      }
      case "faq": {
        if (!Array.isArray(v)) return `"${slug}.faq" must be a list.`;
        for (let i = 0; i < v.length; i++) {
          const f = v[i];
          if (!isObj(f)) return `"${slug}.faq[${i}]" must be an object.`;
          const e1 = checkString(f.q, `${slug}.faq[${i}].q`);
          if (e1) return e1;
          const e2 = checkString(f.a, `${slug}.faq[${i}].a`);
          if (e2) return e2;
        }
        break;
      }
      case "showcase": {
        if (!Array.isArray(v)) return `"${slug}.showcase" must be a list.`;
        for (let i = 0; i < v.length; i++) {
          const sh = v[i];
          if (!isObj(sh)) return `"${slug}.showcase[${i}]" must be an object.`;
          if (!isValidImageUrl(sh.image)) return `"${slug}.showcase[${i}].image" must be a what-we-build image URL.`;
          const e = checkString(sh.caption, `${slug}.showcase[${i}].caption`);
          if (e) return e;
        }
        break;
      }
      case "seo": {
        if (!isObj(v)) return `"${slug}.seo" must be an object.`;
        const e1 = checkString(v.title, `${slug}.seo.title`);
        if (e1) return e1;
        const e2 = checkString(v.description, `${slug}.seo.description`);
        if (e2) return e2;
        break;
      }
      default: {
        // remaining editable fields are plain strings
        const err = checkString(v, `${slug}.${k}`);
        if (err) return err;
      }
    }
  }
  return null;
}

/** Ensure the resulting card order is still a valid permutation of 01..16. */
function validateNumPermutation(svcOv: Record<string, unknown>): string | null {
  const nums = SERVICES.map((s) => {
    const o = svcOv[s.slug];
    const overrideNum = isObj(o) ? o.num : undefined;
    return typeof overrideNum === "string" ? overrideNum : s.num;
  });
  const unique = new Set(nums);
  if (unique.size !== SERVICES.length) {
    return "Card order has duplicate positions — each card needs a unique spot.";
  }
  const expected = new Set(SERVICES.map((_, i) => String(i + 1).padStart(2, "0")));
  for (const n of nums) {
    if (!expected.has(n)) return `Invalid card position "${n}".`;
  }
  return null;
}

/** Returns an error message, or null when the override is safe to persist. */
export function validateContentOverride(parsed: unknown): string | null {
  if (!isObj(parsed)) return "Overrides must be a JSON object.";
  const allowedTop = new Set(["copy", "services"]);
  for (const k of Object.keys(parsed)) {
    if (UNSAFE_KEYS.has(k)) return `Disallowed key "${k}".`;
    if (!allowedTop.has(k)) return `Unknown top-level key "${k}". Use copy or services.`;
  }
  if (parsed.copy !== undefined) {
    if (!isObj(parsed.copy)) return "copy must be an object.";
    const err = validateCopyNode(parsed.copy, "");
    if (err) return err;
  }
  if (parsed.services !== undefined) {
    if (!isObj(parsed.services)) return "services must be an object.";
    for (const [slug, value] of Object.entries(parsed.services)) {
      const err = validateServiceOverride(slug, value);
      if (err) return err;
    }
    const permErr = validateNumPermutation(parsed.services);
    if (permErr) return permErr;
  }
  return null;
}
