"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { EstimateResult } from "@/lib/pricing/types";
import { submitInquiry } from "@/app/actions/inquiry";
import { SERVICES } from "@/lib/services";
import {
  ACCESS_LEVELS,
  BUDGET_BANDS,
  COMPLEXITIES,
  CONTACT_ROLES,
  DESIGN_STYLES,
  EXISTING_CONDITIONS,
  FINISHES,
  PHOTO_LABELS,
  PREFERRED_CONTACT,
  PRIORITIES,
  PROJECT_GOALS,
  PROJECT_TYPES,
  TIERS,
  TIMELINES,
} from "@/lib/wizard-schema";

type Tier = (typeof TIERS)[number];
type Priority = (typeof PRIORITIES)[number];

interface PhotoItem {
  id: string;
  previewUrl: string;
  label: string;
  path?: string;
  status: "uploading" | "done" | "error";
}

const MAX_PHOTOS = 10;

// Each project-type key → the homepage "What We Build" card image, so the
// "What are we building?" tiles show the same thumbnail as the home page.
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
const SLUG_IMAGE: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s.cardImage]),
);
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
  // project types — mirror the "What We Build" service categories
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
  other: "Other",
  not_sure: "I'm not sure",
  // finishes
  raw_unfinished: "Raw / unfinished",
  primed: "Primed only",
  painted: "Painted",
  stained: "Stained",
  clear_coated: "Clear-coated",
  color_matched: "Color-matched",
  stain_matched: "Stain-matched",
  distressed_rustic: "Distressed / rustic",
  high_gloss: "High-gloss",
  matte: "Matte",
  satin: "Satin",
  luxury_furniture_grade: "Furniture-grade",
  // styles
  modern: "Modern",
  minimal: "Minimal",
  traditional: "Traditional",
  transitional: "Transitional",
  rustic: "Rustic",
  farmhouse: "Farmhouse",
  craftsman: "Craftsman",
  scandinavian: "Scandinavian",
  industrial: "Industrial",
  luxury_architectural: "Luxury / architectural",
  match_existing: "Match existing",
  // timelines
  flexible: "Flexible — best value",
  standard: "Standard",
  asap: "As soon as possible",
  rush_priority: "Rush / priority",
  fixed_deadline: "Fixed deadline",
  event_move_in: "Event / move-in date",
  emergency_repair: "Emergency repair",
  // budgets
  under_1k: "Under $1,000",
  "1k_2_5k": "$1,000–$2,500",
  "2_5k_5k": "$2,500–$5,000",
  "5k_10k": "$5,000–$10,000",
  "10k_25k": "$10,000–$25,000",
  "25k_plus": "$25,000+",
  unsure: "I don't know yet",
  // complexity / access
  simple: "Simple",
  moderate: "Moderate",
  complex: "Complex",
  very_complex: "Very complex",
  easy: "Easy access",
  hard: "Tight access",
  // roles
  homeowner: "Homeowner",
  renter: "Renter",
  property_manager: "Property manager",
  designer: "Designer",
  contractor: "Contractor",
  realtor: "Realtor",
  investor: "Investor",
  // contact method
  phone: "Phone call",
  text: "Text",
  email: "Email",
  // photo labels
  wide_room: "Wide room",
  straight_on: "Straight-on",
  close_up_existing: "Close-up",
  tape_measure: "With tape measure",
  obstruction: "Obstruction",
  inspiration: "Inspiration",
  sketch: "Sketch",
  // goals
  add_storage: "Add storage",
  improve_appearance: "Improve appearance",
  increase_home_value: "Increase home value",
  replace_damaged_old: "Replace old / damaged",
  luxury_focal_point: "Luxury focal point",
  prepare_for_sale: "Prepare for sale",
  improve_organization: "Get organized",
  match_existing_style: "Match existing style",
  solve_functional_problem: "Solve a problem",
  // existing conditions
  demolition_removal_needed: "Demolition / removal needed",
  existing_built_ins_to_remove: "Existing built-ins to remove",
  wall_flat_level_unknown: "Walls may be uneven",
  outlets_switches_in_area: "Outlets / switches in area",
  vents_pipes_in_area: "Vents / pipes in area",
  baseboards_trim_in_area: "Baseboards / trim in area",
  windows_doors_in_area: "Windows / doors in area",
  radiators_hvac_in_area: "Radiators / HVAC in area",
  electrical_work_needed: "Electrical work needed",
  drywall_repair_needed: "Drywall repair needed",
  painting_staining_needed: "Painting / staining needed",
  match_existing_wood_trim: "Match existing wood / trim",
  home_occupied: "Home occupied during work",
  pets_or_children: "Pets or children present",
  parking_loading_restrictions: "Parking / loading limits",
  stairs_elevator_access: "Stairs / elevator access",
  condo_hoa_commercial_rules: "Condo / HOA / commercial rules",
  dust_control_required: "Dust control required",
  floor_furniture_protection: "Protect floors / furniture",
};

const TIER_INFO: Record<Tier, { name: string; blurb: string; recommended?: boolean }> = {
  essential: { name: "Essential", blurb: "Functional & budget-conscious — paint-grade materials, standard hardware." },
  premium: { name: "Premium", blurb: "Best balance of design, quality & value — cabinet-grade wood, soft-close.", recommended: true },
  signature: { name: "Signature", blurb: "Luxury hardwoods, premium hardware, furniture-grade finish, white-glove." },
};

const PRIORITY_INFO: Record<Priority, { name: string; blurb: string }> = {
  balanced: { name: "Balanced", blurb: "Recommended — a smart balance of price, quality & timeline." },
  price_quality: { name: "Best price + quality", blurb: "I'm flexible on timeline." },
  fast_quality: { name: "Fast + quality", blurb: "I understand this may carry rush pricing." },
  price_fast: { name: "Best price + fast", blurb: "I understand scope/materials may be simplified." },
};

const BUDGET_MAX: Record<string, number | null> = {
  under_1k: 1000,
  "1k_2_5k": 2500,
  "2_5k_5k": 5000,
  "5k_10k": 10000,
  "10k_25k": 25000,
  "25k_plus": null,
  unsure: null,
};

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
  label: "",
  widthIn: "",
  heightIn: "",
  depthIn: "",
  linearFeet: "",
  numShelves: "",
  numDoors: "",
  numDrawers: "",
});

interface WizardData {
  projectType: string;
  tier: Tier;
  areas: AreaInput[];
  finish: string;
  designStyle: string;
  complexity: (typeof COMPLEXITIES)[number];
  access: (typeof ACCESS_LEVELS)[number];
  timeline: string;
  priority: Priority;
  budgetBand: string;
  goals: string[];
  conditions: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zip: string;
  contactRole: string;
  preferredContact: string;
  permissionToText: boolean;
  password: string;
  photos: PhotoItem[];
  company: string;
}

const STEPS = [
  { key: "project", title: "What are we building?" },
  { key: "goal", title: "What's the goal?" },
  { key: "tier", title: "Choose a quality level" },
  { key: "measure", title: "Rough measurements" },
  { key: "photos", title: "Add photos" },
  { key: "conditions", title: "Site conditions" },
  { key: "finish", title: "Finish & style" },
  { key: "priority", title: "What matters most?" },
  { key: "contact", title: "Your details" },
  { key: "review", title: "Your preliminary estimate" },
] as const;

// Maps a server-returned field error back to the step that owns it, so a
// submit-time validation failure can return the user to the right place.
const FIELD_STEP: Record<string, (typeof STEPS)[number]["key"]> = {
  projectType: "project",
  tier: "tier",
  finish: "finish",
  designStyle: "finish",
  firstName: "contact",
  lastName: "contact",
  phone: "contact",
  email: "contact",
  zip: "contact",
  contactRole: "contact",
  preferredContact: "contact",
  permissionToText: "contact",
  password: "contact",
};

const money = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const num = (s: string): number | undefined => {
  const v = s.trim();
  if (v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

/** A per-session upload token. Falls back to a random hex/dash string (still
 *  matching the server's `^[0-9a-f-]{36}$` format) when crypto.randomUUID is
 *  unavailable, so the token can't collide or be rejected by validation. */
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
    areas: [emptyArea()],
    finish: "",
    designStyle: "",
    complexity: "moderate",
    access: "easy",
    timeline: "",
    priority: "balanced",
    budgetBand: "",
    goals: [],
    conditions: [],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    zip: "",
    contactRole: "",
    preferredContact: "",
    permissionToText: false,
    password: "",
    photos: [],
    company: "",
  });
  const [uploadToken] = useState(genUploadToken);
  const [range, setRange] = useState<EstimateResult | null>(null);
  const [loadingRange, setLoadingRange] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; estimate?: EstimateResult } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Track every object URL we mint for photo previews so we can revoke them on
  // removal and unmount (otherwise the blobs leak — up to MAX_PHOTOS at a time).
  const objectUrls = useRef<Set<string>>(new Set());

  const set = <K extends keyof WizardData>(k: K, v: WizardData[K]) =>
    setData((d) => ({ ...d, [k]: v }));
  const setArea = (i: number, k: keyof AreaInput, v: string) =>
    setData((d) => ({ ...d, areas: d.areas.map((a, j) => (j === i ? { ...a, [k]: v } : a)) }));
  const toggle = (field: "goals" | "conditions", v: string) =>
    setData((d) => ({
      ...d,
      [field]: d[field].includes(v) ? d[field].filter((x) => x !== v) : [...d[field], v],
    }));

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    // Only count successfully-added photos toward the cap, so failed uploads
    // don't lock the user out of adding a good one.
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

  // Revoke any outstanding preview object URLs when the wizard unmounts.
  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, []);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

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
        [a.widthIn, a.heightIn, a.depthIn, a.linearFeet, a.numShelves, a.numDoors, a.numDrawers].some(
          (v) => v !== undefined,
        ),
      );
    return {
      projectType: data.projectType,
      tier: data.tier,
      areas,
      finish: data.finish,
      designStyle: data.designStyle || undefined,
      complexity: data.complexity,
      access: data.access,
      timeline: data.timeline || undefined,
      priority: data.priority,
      budgetBand: data.budgetBand || undefined,
      goals: data.goals,
      conditions: data.conditions,
      demolition: data.conditions.includes("demolition_removal_needed"),
      risk: {
        matchExisting: data.conditions.includes("match_existing_wood_trim"),
        unknownWallCondition: data.conditions.includes("wall_flat_level_unknown"),
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
      /* leave range null; the page still allows submit */
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
    // Surface server-side validation errors: highlight the offending fields and
    // jump back to the earliest step that owns one — otherwise a submit failure
    // with no top-level message would look like nothing happened.
    if (!res.ok && res.fieldErrors) {
      setErrors(res.fieldErrors);
      const target = Object.keys(res.fieldErrors)
        .map((f) => STEPS.findIndex((s) => s.key === FIELD_STEP[f]))
        .filter((i) => i >= 0)
        .sort((a, b) => a - b)[0];
      if (target !== undefined) setStep(target);
    }
  }
  function contactPayload() {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || undefined,
      phone: data.phone,
      zip: data.zip || undefined,
      contactRole: data.contactRole || undefined,
      preferredContact: data.preferredContact || undefined,
      permissionToText: data.permissionToText,
      password: data.password || undefined,
      photos: data.photos.flatMap((p) =>
        p.status === "done" && p.path ? [{ path: p.path, label: p.label || undefined }] : [],
      ),
      uploadToken,
      company: data.company,
    };
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
            <p className="mt-1 font-serif text-3xl text-[#1C1917]">
              {money(range.low)} – {money(range.high)}
            </p>
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

  return (
    <div className="rounded-2xl border border-[#E7DFD3] bg-white p-6 shadow-sm sm:p-8">
      {/* progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-[#78716C]">
          <span aria-live="polite">
            Step {step + 1} of {STEPS.length}
          </span>
          <span>{STEPS[step].title}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#EFE7DA]">
          <div
            className="h-full rounded-full bg-[#B45309] transition-[width] duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="font-serif text-2xl text-[#1C1917] outline-none sm:text-3xl">
        {STEPS[step].title}
      </h2>

      <div className="mt-6">
        {current === "project" && (
          <Cards
            options={PROJECT_TYPES.filter((p) => p !== "other")}
            value={data.projectType}
            onChange={(v) => set("projectType", v)}
            error={errors.projectType}
            images={PROJECT_TYPE_IMAGE}
          />
        )}

        {current === "goal" && (
          <div>
            <p className="mb-4 text-sm font-light text-[#57534E]">What are you hoping to accomplish? Pick any that apply.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PROJECT_GOALS.filter((g) => g !== "other").map((g) => {
                const active = data.goals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle("goals", g)}
                    className={`rounded-xl border px-4 py-3.5 text-left text-sm transition ${active ? "border-[#B45309] bg-[#FBF4EC] font-medium ring-1 ring-[#B45309]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}
                  >
                    {LABELS[g] ?? g}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {current === "conditions" && (
          <div>
            <p className="mb-4 text-sm font-light text-[#57534E]">
              Check anything that applies at the site — it helps us scope accurately. All optional.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {EXISTING_CONDITIONS.map((c) => {
                const active = data.conditions.includes(c);
                return (
                  <label
                    key={c}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${active ? "border-[#B45309] bg-[#FBF4EC]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggle("conditions", c)}
                      className="h-4 w-4 rounded border-[#C9BCA8] text-[#B45309]"
                    />
                    <span className="text-[#57534E]">{LABELS[c] ?? c}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {current === "tier" && (
          <div className="grid gap-4 sm:grid-cols-3">
            {TIERS.map((t) => {
              const info = TIER_INFO[t];
              const active = data.tier === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={active}
                  onClick={() => set("tier", t)}
                  className={`rounded-xl border p-5 text-left transition ${active ? "border-[#B45309] bg-[#FBF4EC] ring-1 ring-[#B45309]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg text-[#1C1917]">{info.name}</span>
                    {info.recommended && (
                      <span className="rounded-full bg-[#B45309] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-light leading-relaxed text-[#57534E]">{info.blurb}</p>
                </button>
              );
            })}
          </div>
        )}

        {current === "measure" && (
          <div className="space-y-6">
            <p className="text-sm font-light text-[#57534E]">
              Rough numbers are fine — estimates are optional and you can skip any field. We confirm everything on
              site. Add a section for each wall or built-in.
            </p>
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
                  <button
                    type="button"
                    onClick={() => set("areas", data.areas.filter((_, j) => j !== i))}
                    className="mt-3 text-xs font-medium text-[#B45309] hover:underline"
                  >
                    Remove area
                  </button>
                )}
              </fieldset>
            ))}
            <button
              type="button"
              onClick={() => set("areas", [...data.areas, emptyArea()])}
              className="text-sm font-medium text-[#B45309] hover:underline"
            >
              + Add another area
            </button>
          </div>
        )}

        {current === "photos" && (
          <div className="space-y-5">
            <p className="text-sm font-light text-[#57534E]">
              Optional, but photos sharpen your estimate and let us scope without a wasted trip. Helpful shots: a
              wide view of the room, the wall straight-on, a close-up of existing trim/cabinets, and anything in
              the way (outlets, vents, pipes). Up to {MAX_PHOTOS}.
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D6CCBC] bg-[#FAF7F2] px-6 py-8 text-center transition hover:border-[#B45309]">
              <span className="text-sm font-medium text-[#1C1917]">Tap to add photos</span>
              <span className="mt-1 text-xs text-[#78716C]">or take one with your camera</span>
              <input
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                className="sr-only"
                disabled={data.photos.filter((p) => p.status !== "error").length >= MAX_PHOTOS}
                onChange={(e) => {
                  void handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            {data.photos.length > 0 && (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {data.photos.map((p) => (
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
                      <select
                        value={p.label}
                        onChange={(e) => setPhotoLabel(p.id, e.target.value)}
                        aria-label="Photo type"
                        className="w-full rounded border border-[#E7DFD3] bg-white px-1.5 py-1 text-[11px] text-[#57534E] outline-none focus:ring-1 focus:ring-[#B45309]"
                      >
                        <option value="">Label…</option>
                        {PHOTO_LABELS.map((l) => (
                          <option key={l} value={l}>
                            {LABELS[l] ?? l}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removePhoto(p.id)}
                        aria-label="Remove photo"
                        className="shrink-0 rounded px-1.5 py-1 text-xs text-[#B45309] hover:underline"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {current === "finish" && (
          <div className="space-y-6">
            <SelectField label="Finish" value={data.finish} onChange={(v) => set("finish", v)} options={[...FINISHES]} error={errors.finish} />
            <SelectField label="Style (optional)" value={data.designStyle} onChange={(v) => set("designStyle", v)} options={[...DESIGN_STYLES]} />
            <SelectField label="Complexity" value={data.complexity} onChange={(v) => set("complexity", v as WizardData["complexity"])} options={[...COMPLEXITIES]} />
            <SelectField label="Access at the site" value={data.access} onChange={(v) => set("access", v as WizardData["access"])} options={[...ACCESS_LEVELS]} />
          </div>
        )}

        {current === "priority" && (
          <div className="space-y-6">
            <p className="text-sm font-light text-[#57534E]">
              Every custom project balances price, quality, and time. You can optimize for two; the third usually
              adjusts.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {PRIORITIES.map((p) => {
                const info = PRIORITY_INFO[p];
                const active = data.priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={active}
                    onClick={() => set("priority", p)}
                    className={`rounded-xl border p-4 text-left transition ${active ? "border-[#B45309] bg-[#FBF4EC] ring-1 ring-[#B45309]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}
                  >
                    <span className="font-medium text-[#1C1917]">{info.name}</span>
                    <p className="mt-1 text-sm font-light text-[#57534E]">{info.blurb}</p>
                  </button>
                );
              })}
            </div>
            <SelectField label="Timeline (optional)" value={data.timeline} onChange={(v) => set("timeline", v)} options={[...TIMELINES]} />
          </div>
        )}

        {current === "contact" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name" value={data.firstName} onChange={(v) => set("firstName", v)} error={errors.firstName} autoComplete="given-name" />
              <Field label="Last name" value={data.lastName} onChange={(v) => set("lastName", v)} error={errors.lastName} autoComplete="family-name" />
              <Field label="Phone" value={data.phone} onChange={(v) => set("phone", v)} error={errors.phone} type="tel" autoComplete="tel" />
              <Field label="Email (optional)" value={data.email} onChange={(v) => set("email", v)} type="email" autoComplete="email" />
              <Field label="ZIP (optional)" value={data.zip} onChange={(v) => set("zip", v)} autoComplete="postal-code" />
              <SelectField label="You are… (optional)" value={data.contactRole} onChange={(v) => set("contactRole", v)} options={[...CONTACT_ROLES]} />
              <SelectField label="Preferred contact (optional)" value={data.preferredContact} onChange={(v) => set("preferredContact", v)} options={[...PREFERRED_CONTACT]} />
              <SelectField label="Budget range (optional)" value={data.budgetBand} onChange={(v) => set("budgetBand", v)} options={[...BUDGET_BANDS]} />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#57534E]">
              <input type="checkbox" checked={data.permissionToText} onChange={(e) => set("permissionToText", e.target.checked)} className="h-4 w-4 rounded border-[#C9BCA8] text-[#B45309]" />
              You can text me about my project.
            </label>
            <div className="rounded-lg bg-[#FAF7F2] p-4">
              <Field
                label="Create a password to track your project (optional)"
                value={data.password}
                onChange={(v) => set("password", v)}
                type="password"
                error={errors.password}
              />
              <p className="mt-1 text-xs text-[#78716C]">
                Optional — set one to log in later and follow your estimate &amp; status. Min 8 characters.
              </p>
            </div>
            {/* honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={data.company}
              onChange={(e) => set("company", e.target.value)}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
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
                  <p className="mt-1 font-serif text-4xl text-[#1C1917]">
                    {money(range.low)} – {money(range.high)}
                  </p>
                  <p className="mt-1 text-sm text-[#78716C]">
                    {range.confidence} confidence
                    {range.market.stale ? " · baseline material costs" : " · live material costs"}
                  </p>
                  {data.budgetBand && BUDGET_MAX[data.budgetBand] !== null && range.point > (BUDGET_MAX[data.budgetBand] as number) && (
                    <p className="mt-3 text-xs leading-relaxed text-[#B45309]">
                      This is above your selected budget. We can simplify the design, choose budget-friendly
                      materials, or adjust the range — we&apos;ll still review your project and recommend options.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-[#78716C]">
                  Add a few measurements for an instant range, or submit and we&apos;ll price it for you.
                </p>
              )}
            </div>
            <ul className="space-y-1 text-sm text-[#57534E]">
              <li><strong className="text-[#1C1917]">Project:</strong> {LABELS[data.projectType] ?? "—"} · {TIER_INFO[data.tier].name}</li>
              <li><strong className="text-[#1C1917]">Finish:</strong> {LABELS[data.finish] ?? "—"}{data.designStyle ? ` · ${LABELS[data.designStyle]}` : ""}</li>
              <li><strong className="text-[#1C1917]">Priority:</strong> {PRIORITY_INFO[data.priority].name}{data.timeline ? ` · ${LABELS[data.timeline]}` : ""}</li>
              <li><strong className="text-[#1C1917]">Contact:</strong> {data.firstName} {data.lastName} · {data.phone}</li>
            </ul>
            <p className="text-xs leading-relaxed text-[#78716C]">
              Based on your submitted measurements, materials, finish, and timeline, similar projects typically fall
              within this preliminary range. Final pricing requires professional review, confirmed measurements,
              site conditions, material availability, and final design approval. This is not a guaranteed quote.
            </p>
            {result && !result.ok && (
              <p className="text-sm text-[#B91C1C]">{result.message}</p>
            )}
          </div>
        )}
      </div>

      {/* nav */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="text-sm font-medium text-[#78716C] disabled:opacity-0"
        >
          ← Back
        </button>
        {current !== "review" ? (
          <button
            type="button"
            onClick={next}
            className="rounded-full bg-[#B45309] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#9A4708] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-full bg-[#B45309] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#9A4708] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
            style={{ outlineColor: GOLD }}
          >
            {submitting ? "Submitting…" : "Request My Free Estimate"}
          </button>
        )}
      </div>
    </div>
  );
}

// ---- small presentational helpers -----------------------------------------

function Cards({
  options,
  value,
  onChange,
  error,
  images,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  /** Optional per-option thumbnail (e.g. the homepage card image). */
  images?: Record<string, string>;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((o) => {
          const active = value === o;
          const img = images?.[o];
          // Photo-backed tile — same footprint as the plain button (the image is
          // absolutely positioned, so it doesn't change the button's height).
          if (img) {
            return (
              <button
                key={o}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(o)}
                className={`group relative flex items-end overflow-hidden rounded-xl border px-4 py-4 text-left text-sm transition ${active ? "border-[#B45309] ring-2 ring-[#B45309]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="(max-width:640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
                <span className="relative z-10 font-medium leading-snug text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                  {LABELS[o] ?? o}
                </span>
                {active && (
                  <span className="absolute right-2 top-2 z-10 grid h-5 w-5 place-items-center rounded-full bg-[#B45309] text-white shadow">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </button>
            );
          }
          return (
            <button
              key={o}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o)}
              className={`rounded-xl border px-4 py-4 text-left text-sm transition ${active ? "border-[#B45309] bg-[#FBF4EC] font-medium ring-1 ring-[#B45309]" : "border-[#E7DFD3] hover:border-[#C9BCA8]"}`}
            >
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
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
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
        inputMode={type === "tel" ? "tel" : ["Width (in)", "Height (in)"].includes(label) ? "numeric" : undefined}
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
  label,
  value,
  onChange,
  options,
  error,
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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-[#1C1917] outline-none focus:ring-2 focus:ring-[#B45309] ${error ? "border-[#B91C1C]" : "border-[#D6CCBC]"}`}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {LABELS[o] ?? o}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs text-[#B91C1C]">{error}</span>}
    </label>
  );
}
