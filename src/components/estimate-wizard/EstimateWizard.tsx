"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { EstimateResult } from "@/lib/pricing/types";
import { submitInquiry } from "@/app/actions/inquiry";
import { SERVICES } from "@/lib/services";
import { PROJECT_TYPES, TIERS, BUDGET_BANDS, PHOTO_LABELS } from "@/lib/wizard-schema";
import { presetsFor, type PresetArea, type PresetSize } from "@/lib/wizard-presets";

type Tier = (typeof TIERS)[number];

interface PhotoItem {
  id: string;
  previewUrl: string;
  label: string;
  path?: string;
  status: "uploading" | "done" | "error";
}

const MAX_PHOTOS = 10;

// Each project-type key → the homepage "What We Build" card image.
const PROJECT_TYPE_SLUG: Record<string, string> = {
  custom_cabinetry: "custom-cabinetry",
  built_in_shelving: "built-in-shelving",
  custom_closets: "custom-closets",
  mudrooms_lockers: "mudrooms-lockers",
  trim_wainscoting: "trim-molding-wainscoting",
  fireplace_mantels: "fireplace-mantels",
  exposed_beams: "exposed-beams-ceilings",
  staircases_railings: "staircases-railings",
  interior_exterior_doors: "interior-exterior-doors",
  wine_cellars: "wine-cellars",
  home_bars: "home-bars",
  home_offices: "desks-libraries",
  garage_storage: "garage-storage",
  beds_frames: "beds-frames-nightstands",
  custom_woodwork: "custom-woodwork",
  cedar_hot_tubs: "cedar-hot-tubs",
};
const SLUG_IMAGE: Record<string, string> = Object.fromEntries(SERVICES.map((s) => [s.slug, s.cardImage]));
const PROJECT_TYPE_IMAGE: Record<string, string> = Object.fromEntries(
  Object.entries(PROJECT_TYPE_SLUG)
    .map(([key, slug]) => [key, SLUG_IMAGE[slug]])
    .filter(([, img]) => Boolean(img)),
);

/** Downscale + re-encode (JPEG) client-side — strips EXIF/GPS, honors orientation. */
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const maxDim = 2560;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.82));
  if (!blob) throw new Error("Compression failed");
  return blob;
}

async function uploadPhoto(blob: Blob, uploadToken: string): Promise<string> {
  const fd = new FormData();
  fd.append("uploadToken", uploadToken);
  fd.append("file", blob, "photo.jpg");
  const res = await fetch("/api/inquiry/photos", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok || !json.ok) throw new Error(json.error || "upload_failed");
  return json.path as string;
}

const LABELS: Record<string, string> = {
  custom_cabinetry: "Custom cabinetry & kitchens",
  built_in_shelving: "Built-in shelving & media",
  custom_closets: "Custom closets & wardrobes",
  mudrooms_lockers: "Mudrooms, lockers & benches",
  trim_wainscoting: "Trim, molding & wainscoting",
  fireplace_mantels: "Fireplace mantels & surrounds",
  exposed_beams: "Exposed beams & ceilings",
  staircases_railings: "Staircases & railings",
  interior_exterior_doors: "Interior & exterior doors",
  wine_cellars: "Wine cellars & rooms",
  home_bars: "Home bars & butler's pantries",
  home_offices: "Home offices & libraries",
  garage_storage: "Garage & storage systems",
  beds_frames: "Beds, frames & nightstands",
  custom_woodwork: "Custom woodwork & specialty",
  cedar_hot_tubs: "Cedar hot tubs & surrounds",
  not_sure: "I'm not sure yet",
  // budgets
  under_1k: "Under $1,000",
  "1k_2_5k": "$1,000–$2,500",
  "2_5k_5k": "$2,500–$5,000",
  "5k_10k": "$5,000–$10,000",
  "10k_25k": "$10,000–$25,000",
  "25k_plus": "$25,000+",
  unsure: "Not sure yet",
  // photo labels
  wide_room: "Wide room",
  straight_on: "Straight-on",
  close_up_existing: "Close-up",
  tape_measure: "With tape measure",
  obstruction: "Obstruction",
  inspiration: "Inspiration",
  sketch: "Sketch",
  other: "Other",
};

const TIER_INFO: Record<
  Tier,
  { name: string; price: string; tagline: string; points: string[]; recommended?: boolean }
> = {
  essential: {
    name: "Essential",
    price: "$",
    tagline: "Budget-conscious",
    points: ["Paint-grade materials", "Standard hardware", "Clean, functional build"],
  },
  premium: {
    name: "Premium",
    price: "$$",
    tagline: "Best balance of quality & value",
    points: ["Cabinet-grade wood", "Soft-close hardware", "Designer-level finish"],
    recommended: true,
  },
  signature: {
    name: "Signature",
    price: "$$$",
    tagline: "Top-tier, white-glove",
    points: ["Luxury hardwoods", "Premium hardware", "Furniture-grade finish"],
  },
};

const FINISH_CHOICES = [
  { value: "painted", name: "Painted", sub: "Smooth paint-grade — clean, classic" },
  { value: "stained", name: "Stained", sub: "Natural wood grain, stained tone" },
  { value: "clear_coated", name: "Clear / natural", sub: "Clear-coated, true wood look" },
  { value: "color_matched", name: "Matched", sub: "Color/stain matched to existing" },
  { value: "luxury_furniture_grade", name: "Furniture-grade", sub: "Hand-finished, the richest finish" },
  { value: "raw_unfinished", name: "Raw / unfinished", sub: "We build; you finish" },
] as const;

const TIMING_CHOICES = [
  { value: "flex", name: "I'm flexible", sub: "Best value — we batch it efficiently", priority: "price_quality", timeline: "flexible" },
  { value: "standard", name: "Standard", sub: "A normal lead time works", priority: "balanced", timeline: "standard" },
  { value: "soon", name: "I need it soon", sub: "May carry rush pricing", priority: "fast_quality", timeline: "asap" },
] as const;
type Timing = (typeof TIMING_CHOICES)[number]["value"];

// Base complexity per project type; the "intricate detailing" toggle bumps it up.
const BASE_COMPLEXITY: Record<string, "simple" | "moderate" | "complex"> = {
  trim_wainscoting: "simple",
  garage_storage: "simple",
  interior_exterior_doors: "simple",
  staircases_railings: "complex",
  wine_cellars: "complex",
  cedar_hot_tubs: "complex",
  custom_woodwork: "complex",
};
const COMPLEXITY_LADDER = ["simple", "moderate", "complex", "very_complex"] as const;
function bumpComplexity(base: "simple" | "moderate" | "complex", bump: boolean): string {
  const i = COMPLEXITY_LADDER.indexOf(base);
  return COMPLEXITY_LADDER[Math.min(i + (bump ? 1 : 0), COMPLEXITY_LADDER.length - 1)];
}

interface AreaInput {
  label: string;
  widthIn: string;
  heightIn: string;
  depthIn: string;
  linearFeet: string;
  numShelves: string;
  numDoors: string;
  numDrawers: string;
}
const emptyArea = (): AreaInput => ({
  label: "", widthIn: "", heightIn: "", depthIn: "", linearFeet: "", numShelves: "", numDoors: "", numDrawers: "",
});
const presetToArea = (p: PresetArea): AreaInput => ({ ...emptyArea(), ...p });

interface WizardData {
  projectType: string;
  tier: Tier;
  sizePreset: PresetSize | "";
  areas: AreaInput[];
  finish: string;
  timing: Timing;
  removal: boolean;
  matchExisting: boolean;
  intricate: boolean;
  tightAccess: boolean;
  budgetBand: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  permissionToText: boolean;
  photos: PhotoItem[];
  company: string;
}

const STEPS = [
  { key: "project", title: "What are we building?" },
  { key: "size", title: "How big is it?" },
  { key: "tier", title: "Choose a quality level" },
  { key: "finish", title: "Pick a finish" },
  { key: "details", title: "A few details" },
  { key: "contact", title: "Your details" },
  { key: "review", title: "Your instant estimate" },
] as const;

const FIELD_STEP: Record<string, (typeof STEPS)[number]["key"]> = {
  projectType: "project",
  tier: "tier",
  finish: "finish",
  firstName: "contact",
  lastName: "contact",
  phone: "contact",
  email: "contact",
};

const money = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const num = (s: string): number | undefined => {
  const v = s.trim();
  if (v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

const BUDGET_MAX: Record<string, number | null> = {
  under_1k: 1000, "1k_2_5k": 2500, "2_5k_5k": 5000, "5k_10k": 10000, "10k_25k": 25000, "25k_plus": null, unsure: null,
};

function genUploadToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  const hex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const GOLD = "#B45309";

export function EstimateWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    projectType: "",
    tier: "premium",
    sizePreset: "",
    areas: [emptyArea()],
    finish: "",
    timing: "standard",
    removal: false,
    matchExisting: false,
    intricate: false,
    tightAccess: false,
    budgetBand: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    permissionToText: false,
    photos: [],
    company: "",
  });
  const [uploadToken] = useState(genUploadToken);
  const [range, setRange] = useState<EstimateResult | null>(null);
  const [loadingRange, setLoadingRange] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; estimate?: EstimateResult; fieldErrors?: Record<string, string> } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const objectUrls = useRef<Set<string>>(new Set());

  const set = <K extends keyof WizardData>(k: K, v: WizardData[K]) => setData((d) => ({ ...d, [k]: v }));
  const setArea = (i: number, k: keyof AreaInput, v: string) =>
    setData((d) => ({ ...d, sizePreset: "", areas: d.areas.map((a, j) => (j === i ? { ...a, [k]: v } : a)) }));

  function applyPreset(size: PresetSize) {
    const opt = presetsFor(data.projectType)[size];
    setData((d) => ({ ...d, sizePreset: size, areas: [presetToArea(opt.area)] }));
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const room = MAX_PHOTOS - data.photos.filter((p) => p.status !== "error").length;
    const files = Array.from(fileList).slice(0, Math.max(0, room));
    for (const file of files) {
      const id = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);
      objectUrls.current.add(previewUrl);
      setData((d) => ({ ...d, photos: [...d.photos, { id, previewUrl, label: "", status: "uploading" }] }));
      try {
        const blob = await compressImage(file);
        const path = await uploadPhoto(blob, uploadToken);
        setData((d) => ({ ...d, photos: d.photos.map((p) => (p.id === id ? { ...p, path, status: "done" } : p)) }));
      } catch {
        setData((d) => ({ ...d, photos: d.photos.map((p) => (p.id === id ? { ...p, status: "error" } : p)) }));
      }
    }
  }
  const setPhotoLabel = (id: string, label: string) =>
    setData((d) => ({ ...d, photos: d.photos.map((p) => (p.id === id ? { ...p, label } : p)) }));
  const removePhoto = (id: string) =>
    setData((d) => {
      const target = d.photos.find((p) => p.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
        objectUrls.current.delete(target.previewUrl);
      }
      return { ...d, photos: d.photos.filter((p) => p.id !== id) };
    });

  useEffect(() => {
    const urls = objectUrls.current;
    return () => { for (const url of urls) URL.revokeObjectURL(url); };
  }, []);
  useEffect(() => { headingRef.current?.focus(); }, [step]);

  function buildInput() {
    const areas = data.areas
      .map((a) => ({
        label: a.label || undefined,
        widthIn: num(a.widthIn),
        heightIn: num(a.heightIn),
        depthIn: num(a.depthIn),
        linearFeet: num(a.linearFeet),
        numShelves: num(a.numShelves),
        numDoors: num(a.numDoors),
        numDrawers: num(a.numDrawers),
      }))
      .filter((a) =>
        [a.widthIn, a.heightIn, a.depthIn, a.linearFeet, a.numShelves, a.numDoors, a.numDrawers].some((v) => v !== undefined),
      );
    const timing = TIMING_CHOICES.find((t) => t.value === data.timing) ?? TIMING_CHOICES[1];
    const base = BASE_COMPLEXITY[data.projectType] ?? "moderate";
    return {
      projectType: data.projectType,
      tier: data.tier,
      areas,
      finish: data.finish,
      complexity: bumpComplexity(base, data.intricate),
      access: data.tightAccess ? "hard" : "easy",
      demolition: data.removal,
      timeline: timing.timeline,
      priority: timing.priority,
      budgetBand: data.budgetBand || undefined,
      risk: {
        matchExisting: data.matchExisting,
        tightTimeline: data.timing === "soon",
        lowPhotoQuality: data.photos.filter((p) => p.status === "done").length === 0,
      },
    };
  }

  async function fetchRange() {
    setLoadingRange(true);
    setRange(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildInput()),
      });
      const json = await res.json();
      if (json.ok) setRange(json.estimate as EstimateResult);
    } catch {
      /* leave range null */
    } finally {
      setLoadingRange(false);
    }
  }

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (STEPS[step].key === "project" && !data.projectType) e.projectType = "Pick a project type.";
    if (STEPS[step].key === "finish" && !data.finish) e.finish = "Pick a finish.";
    if (STEPS[step].key === "contact") {
      if (!data.firstName.trim()) e.firstName = "Required";
      if (!data.lastName.trim()) e.lastName = "Required";
      if (!/^[0-9 ()+\-.]{7,25}$/.test(data.phone.trim())) e.phone = "Enter a valid phone number.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    const goingToReview = STEPS[step + 1]?.key === "review";
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    if (goingToReview) void fetchRange();
  }
  const back = () => setStep((s) => Math.max(s - 1, 0));

  function contactPayload() {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || undefined,
      phone: data.phone,
      permissionToText: data.permissionToText,
      photos: data.photos.flatMap((p) =>
        p.status === "done" && p.path ? [{ path: p.path, label: p.label || undefined }] : [],
      ),
      uploadToken,
      company: data.company,
    };
  }

  async function handleSubmit() {
    setSubmitting(true);
    let res: Awaited<ReturnType<typeof submitInquiry>>;
    try {
      res = await submitInquiry({ ...buildInput(), ...contactPayload() });
    } catch {
      res = { ok: false, message: "Something went wrong submitting your request. Please try again." };
    }
    setSubmitting(false);
    setResult(res);
    if (res.estimate) setRange(res.estimate);
    if (!res.ok && res.fieldErrors) {
      setErrors(res.fieldErrors);
      const target = Object.keys(res.fieldErrors)
        .map((f) => STEPS.findIndex((s) => s.key === FIELD_STEP[f]))
        .filter((i) => i >= 0)
        .sort((a, b) => a - b)[0];
      if (target !== undefined) setStep(target);
    }
  }

  // ---- Success screen ----
  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-[#E7DFD3] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">Request received</p>
        <h2 className="mt-3 font-serif text-3xl text-[#1C1917]">Thank you — we&apos;ve got it.</h2>
        <p className="mt-3 text-[0.9375rem] font-light leading-relaxed text-[#57534E]">{result.message}</p>
        {range && (
          <div className="mt-6 rounded-xl bg-[#FAF7F2] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#57534E]">Preliminary range</p>
            <p className="mt-1 font-serif text-3xl text-[#1C1917]">{money(range.low)} – {money(range.high)}</p>
            <p className="mt-1 text-sm text-[#78716C]">{range.confidence} confidence · not a quote</p>
          </div>
        )}
        <p className="mt-6 text-xs leading-relaxed text-[#78716C]">
          A preliminary range based on your inputs and current material costs. Final pricing follows a free
          on-site review, confirmed measurements, and final design.
        </p>
      </div>
    );
  }

  const current = STEPS[step].key;
  const presets = presetsFor(data.projectType);

  return (
    <div className="rounded-2xl border border-[#E7DFD3] bg-white p-6 shadow-sm sm:p-8">
      {/* progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-[#78716C]">
          <span aria-live="polite">Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step].title}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#EFE7DA]">
          <div className="h-full rounded-full bg-[#B45309] transition-[width] duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="font-serif text-2xl text-[#1C1917] outline-none sm:text-3xl">
        {STEPS[step].title}
      </h2>

      <div className="mt-6">
        {current === "project" && (
          <Cards options={PROJECT_TYPES.filter((p) => p !== "other" && p !== "not_sure")} value={data.projectType} onChange={(v) => set("projectType", v)} error={errors.projectType} images={PROJECT_TYPE_IMAGE} />
        )}

        {current === "size" && (
          <div className="space-y-6">
            <p className="text-sm font-light text-[#57534E]">Pick the closest size — no measuring needed. It gives you an instant range; we confirm everything on site.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["sm", "md", "lg"] as PresetSize[]).map((s) => {
                const opt = presets[s];
                const active = data.sizePreset === s;
                return (
                  <button key={s} type="button" aria-pressed={active} onClick={() => applyPreset(s)}
                    className={`rounded-xl border p-4 text-left transition ${active ? "border-[#B45309] bg-[#FBF4EC] ring-1 ring-[#B45309]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}>
                    <span className="font-medium text-[#1C1917]">{s === "sm" ? "Small" : s === "md" ? "Medium" : "Large"}</span>
                    <p className="mt-1 text-sm font-light leading-snug text-[#57534E]">{opt.sub}</p>
                  </button>
                );
              })}
            </div>

            <details className="rounded-xl border border-[#E7DFD3] p-4">
              <summary className="cursor-pointer text-sm font-medium text-[#B45309]">Enter exact measurements instead</summary>
              <p className="mt-3 text-xs font-light text-[#78716C]">Rough numbers in inches are fine. Add a section for each wall or built-in.</p>
              <div className="mt-3 space-y-4">
                {data.areas.map((a, i) => (
                  <fieldset key={i} className="rounded-xl border border-[#E7DFD3] p-4">
                    <legend className="px-1 text-sm font-medium text-[#1C1917]">Area {i + 1}</legend>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <Field label="Width (in)" value={a.widthIn} onChange={(v) => setArea(i, "widthIn", v)} />
                      <Field label="Height (in)" value={a.heightIn} onChange={(v) => setArea(i, "heightIn", v)} />
                      <Field label="Depth (in)" value={a.depthIn} onChange={(v) => setArea(i, "depthIn", v)} />
                      <Field label="Linear feet" value={a.linearFeet} onChange={(v) => setArea(i, "linearFeet", v)} />
                      <Field label="# Shelves" value={a.numShelves} onChange={(v) => setArea(i, "numShelves", v)} />
                      <Field label="# Doors" value={a.numDoors} onChange={(v) => setArea(i, "numDoors", v)} />
                      <Field label="# Drawers" value={a.numDrawers} onChange={(v) => setArea(i, "numDrawers", v)} />
                    </div>
                    {data.areas.length > 1 && (
                      <button type="button" onClick={() => set("areas", data.areas.filter((_, j) => j !== i))} className="mt-3 text-xs font-medium text-[#B45309] hover:underline">Remove area</button>
                    )}
                  </fieldset>
                ))}
                <button type="button" onClick={() => set("areas", [...data.areas, emptyArea()])} className="text-sm font-medium text-[#B45309] hover:underline">+ Add another area</button>
              </div>
            </details>

            <PhotoUploader photos={data.photos} onFiles={handleFiles} onLabel={setPhotoLabel} onRemove={removePhoto} />
          </div>
        )}

        {current === "tier" && (
          <div className="grid gap-4 sm:grid-cols-3">
            {TIERS.map((t) => {
              const info = TIER_INFO[t];
              const active = data.tier === t;
              return (
                <button key={t} type="button" aria-pressed={active} onClick={() => set("tier", t)}
                  className={`flex flex-col rounded-xl border p-5 text-left transition ${active ? "border-[#B45309] bg-[#FBF4EC] ring-1 ring-[#B45309]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif text-xl text-[#1C1917]">{info.name}</span>
                    <span className="font-serif text-lg tracking-tight text-[#B45309]" aria-hidden="true">{info.price}</span>
                  </div>
                  {info.recommended ? (
                    <span className="mt-1.5 self-start rounded-full bg-[#B45309] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Recommended</span>
                  ) : (
                    <span className="mt-1.5 text-xs font-medium uppercase tracking-wide text-[#A8A29E]">{info.tagline}</span>
                  )}
                  {info.recommended && <span className="mt-1.5 text-xs font-medium uppercase tracking-wide text-[#A8A29E]">{info.tagline}</span>}
                  <ul className="mt-3 space-y-1.5 border-t border-[#EFE7DA] pt-3">
                    {info.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-[#57534E]">
                        <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B45309]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        )}

        {current === "finish" && (
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {FINISH_CHOICES.map((f) => {
                const active = data.finish === f.value;
                return (
                  <button key={f.value} type="button" aria-pressed={active} onClick={() => set("finish", f.value)}
                    className={`rounded-xl border p-4 text-left transition ${active ? "border-[#B45309] bg-[#FBF4EC] ring-1 ring-[#B45309]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}>
                    <span className="font-medium text-[#1C1917]">{f.name}</span>
                    <p className="mt-1 text-sm font-light text-[#57534E]">{f.sub}</p>
                  </button>
                );
              })}
            </div>
            {errors.finish && <p className="mt-2 text-sm text-[#B91C1C]">{errors.finish}</p>}
          </div>
        )}

        {current === "details" && (
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-sm font-medium text-[#1C1917]">Timeline</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {TIMING_CHOICES.map((t) => {
                  const active = data.timing === t.value;
                  return (
                    <button key={t.value} type="button" aria-pressed={active} onClick={() => set("timing", t.value)}
                      className={`rounded-xl border p-4 text-left transition ${active ? "border-[#B45309] bg-[#FBF4EC] ring-1 ring-[#B45309]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}>
                      <span className="font-medium text-[#1C1917]">{t.name}</span>
                      <p className="mt-1 text-sm font-light text-[#57534E]">{t.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-[#1C1917]">Anything else that applies?</p>
              <p className="mb-3 text-xs font-light text-[#78716C]">Optional — these sharpen your estimate.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Toggle label="Remove / demo existing first" checked={data.removal} onChange={(v) => set("removal", v)} />
                <Toggle label="Match existing wood / trim" checked={data.matchExisting} onChange={(v) => set("matchExisting", v)} />
                <Toggle label="Intricate / curved detailing" checked={data.intricate} onChange={(v) => set("intricate", v)} />
                <Toggle label="Stairs or tight access" checked={data.tightAccess} onChange={(v) => set("tightAccess", v)} />
              </div>
            </div>
          </div>
        )}

        {current === "contact" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name" value={data.firstName} onChange={(v) => set("firstName", v)} error={errors.firstName} autoComplete="given-name" />
              <Field label="Last name" value={data.lastName} onChange={(v) => set("lastName", v)} error={errors.lastName} autoComplete="family-name" />
              <Field label="Phone" value={data.phone} onChange={(v) => set("phone", v)} error={errors.phone} type="tel" autoComplete="tel" />
              <Field label="Email (optional)" value={data.email} onChange={(v) => set("email", v)} type="email" autoComplete="email" />
              <SelectField label="Budget range (optional)" value={data.budgetBand} onChange={(v) => set("budgetBand", v)} options={[...BUDGET_BANDS]} />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#57534E]">
              <input type="checkbox" checked={data.permissionToText} onChange={(e) => set("permissionToText", e.target.checked)} className="h-4 w-4 rounded border-[#C9BCA8] text-[#B45309]" />
              You can text me about my project.
            </label>
            {/* honeypot */}
            <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={data.company} onChange={(e) => set("company", e.target.value)} className="absolute left-[-9999px] h-0 w-0 opacity-0" />
          </div>
        )}

        {current === "review" && (
          <div className="space-y-6">
            <div aria-live="polite" className="rounded-xl bg-[#FAF7F2] p-6 text-center">
              {loadingRange ? (
                <p className="text-sm text-[#78716C]">Pricing your project with live material costs…</p>
              ) : range ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#57534E]">Preliminary range</p>
                  <p className="mt-1 font-serif text-4xl text-[#1C1917]">{money(range.low)} – {money(range.high)}</p>
                  <p className="mt-1 text-sm text-[#78716C]">{range.confidence} confidence{range.market.stale ? " · baseline material costs" : " · live material costs"}</p>
                  {data.budgetBand && BUDGET_MAX[data.budgetBand] !== null && range.point > (BUDGET_MAX[data.budgetBand] as number) && (
                    <p className="mt-3 text-xs leading-relaxed text-[#B45309]">This is above your selected budget. We can simplify the design, choose budget-friendly materials, or adjust the range — we&apos;ll still review your project and recommend options.</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-[#78716C]">Pick a size for an instant range, or submit and we&apos;ll price it for you.</p>
              )}
            </div>
            <ul className="space-y-1 text-sm text-[#57534E]">
              <li><strong className="text-[#1C1917]">Project:</strong> {LABELS[data.projectType] ?? "—"} · {TIER_INFO[data.tier].name}</li>
              <li><strong className="text-[#1C1917]">Finish:</strong> {FINISH_CHOICES.find((f) => f.value === data.finish)?.name ?? "—"}</li>
              <li><strong className="text-[#1C1917]">Timeline:</strong> {TIMING_CHOICES.find((t) => t.value === data.timing)?.name}</li>
              <li><strong className="text-[#1C1917]">Contact:</strong> {data.firstName} {data.lastName} · {data.phone}</li>
            </ul>
            <p className="text-xs leading-relaxed text-[#78716C]">Based on your size, materials, finish, and timeline, similar projects typically fall within this preliminary range. Final pricing requires professional review, confirmed measurements, site conditions, material availability, and final design approval. This is not a guaranteed quote.</p>
            {result && !result.ok && <p className="text-sm text-[#B91C1C]">{result.message}</p>}
          </div>
        )}
      </div>

      {/* nav */}
      <div className="mt-8 flex items-center justify-between">
        <button type="button" onClick={back} disabled={step === 0} className="text-sm font-medium text-[#78716C] disabled:opacity-0">← Back</button>
        {current !== "review" ? (
          <button type="button" onClick={next} className="rounded-full bg-[#B45309] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#9A4708] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2">Continue</button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={submitting} className="rounded-full bg-[#B45309] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#9A4708] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2" style={{ outlineColor: GOLD }}>
            {submitting ? "Submitting…" : "Request My Free Estimate"}
          </button>
        )}
      </div>
    </div>
  );
}

// ---- small presentational helpers -----------------------------------------

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-3 text-sm transition ${checked ? "border-[#B45309] bg-[#FBF4EC]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-[#C9BCA8] text-[#B45309]" />
      <span className="text-[#1C1917]">{label}</span>
    </label>
  );
}

function PhotoUploader({
  photos, onFiles, onLabel, onRemove,
}: {
  photos: PhotoItem[];
  onFiles: (f: FileList | null) => void;
  onLabel: (id: string, label: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-light text-[#57534E]">Optional — a couple of photos make your estimate sharper and save a wasted trip.</p>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D6CCBC] bg-[#FAF7F2] px-6 py-7 text-center transition hover:border-[#B45309]">
        <span className="text-sm font-medium text-[#1C1917]">Tap to add photos</span>
        <span className="mt-1 text-xs text-[#78716C]">or take one with your camera</span>
        <input type="file" accept="image/*" multiple capture="environment" className="sr-only"
          disabled={photos.filter((p) => p.status !== "error").length >= MAX_PHOTOS}
          onChange={(e) => { void onFiles(e.target.files); e.target.value = ""; }} />
      </label>
      {photos.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-xl border border-[#E7DFD3]">
              <div className="relative aspect-[4/3] bg-[#EFE7DA]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.previewUrl} alt="Project photo preview" className="h-full w-full object-cover" />
                {p.status !== "done" && (
                  <span className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${p.status === "error" ? "bg-[#B91C1C]/70 text-white" : "bg-black/40 text-white"}`}>
                    {p.status === "error" ? "Upload failed" : "Uploading…"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 p-2">
                <select value={p.label} onChange={(e) => onLabel(p.id, e.target.value)} aria-label="Photo type"
                  className="w-full rounded border border-[#E7DFD3] bg-white px-1.5 py-1 text-[11px] text-[#57534E] outline-none focus:ring-1 focus:ring-[#B45309]">
                  <option value="">Label…</option>
                  {PHOTO_LABELS.map((l) => (<option key={l} value={l}>{LABELS[l] ?? l}</option>))}
                </select>
                <button type="button" onClick={() => onRemove(p.id)} aria-label="Remove photo" className="shrink-0 rounded px-1.5 py-1 text-xs text-[#B45309] hover:underline">✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Cards({
  options, value, onChange, error, images,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  images?: Record<string, string>;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((o) => {
          const active = value === o;
          const img = images?.[o];
          if (img) {
            return (
              <button key={o} type="button" aria-pressed={active} onClick={() => onChange(o)}
                className={`group relative flex items-end overflow-hidden rounded-xl border px-4 py-4 text-left text-sm transition ${active ? "border-[#B45309] ring-2 ring-[#B45309]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}>
                <Image src={img} alt="" fill sizes="(max-width:640px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
                <span className="relative z-10 font-medium leading-snug text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{LABELS[o] ?? o}</span>
                {active && (
                  <span className="absolute right-2 top-2 z-10 grid h-5 w-5 place-items-center rounded-full bg-[#B45309] text-white shadow">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                )}
              </button>
            );
          }
          return (
            <button key={o} type="button" aria-pressed={active} onClick={() => onChange(o)}
              className={`rounded-xl border px-4 py-4 text-left text-sm transition ${active ? "border-[#B45309] bg-[#FBF4EC] font-medium ring-1 ring-[#B45309]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}>
              {LABELS[o] ?? o}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-[#B91C1C]">{error}</p>}
    </div>
  );
}

function Field({
  label, value, onChange, error, type = "text", autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[#57534E]">{label}</span>
      <input
        type={type}
        inputMode={type === "tel" ? "tel" : ["Width (in)", "Height (in)", "Depth (in)", "Linear feet", "# Shelves", "# Doors", "# Drawers"].includes(label) ? "numeric" : undefined}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-[#1C1917] outline-none focus:ring-2 focus:ring-[#B45309] ${error ? "border-[#B91C1C]" : "border-[#D6CCBC]"}`}
      />
      {error && <span className="mt-1 block text-xs text-[#B91C1C]">{error}</span>}
    </label>
  );
}

function SelectField({
  label, value, onChange, options, error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[#57534E]">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={error ? true : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-[#1C1917] outline-none focus:ring-2 focus:ring-[#B45309] ${error ? "border-[#B91C1C]" : "border-[#D6CCBC]"}`}>
        <option value="">Select…</option>
        {options.map((o) => (<option key={o} value={o}>{LABELS[o] ?? o}</option>))}
      </select>
      {error && <span className="mt-1 block text-xs text-[#B91C1C]">{error}</span>}
    </label>
  );
}
