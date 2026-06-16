"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/constants";
import {
  ROLES,
  EXPERIENCE_LEVELS,
  SPECIALTIES,
  TOOLS,
  CERTIFICATIONS,
  AVAILABILITY,
  REFERRAL_SOURCES,
} from "@/lib/careers-schema";
import { submitApplication } from "@/app/actions/careers";
import { FileDrop, type UploadedFile } from "./FileDrop";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  workAuthorized: boolean | null;
  role: string;
  experienceYears: number;
  experienceLevel: string | null;
  currentEmployer: string;
  specialties: string[];
  tools: string[];
  certifications: string[];
  availability: string[];
  startDate: string;
  portfolioUrl: string;
  resume: UploadedFile[];
  coverLetter: UploadedFile[];
  workPhotos: UploadedFile[];
  whyCruz: string;
  proudOf: string;
  salaryExpectation: string;
  referralSource: string;
  referralName: string;
}

const DEFAULT: FormState = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  workAuthorized: null,
  role: "",
  experienceYears: 3,
  experienceLevel: null,
  currentEmployer: "",
  specialties: [],
  tools: [],
  certifications: [],
  availability: [],
  startDate: "",
  portfolioUrl: "",
  resume: [],
  coverLetter: [],
  workPhotos: [],
  whyCruz: "",
  proudOf: "",
  salaryExpectation: "",
  referralSource: "",
  referralName: "",
};

const STEPS = [
  { key: "about", title: "About you", subtitle: "How we reach you." },
  { key: "role", title: "Role & experience", subtitle: "Where you fit and how long you've been at it." },
  { key: "skills", title: "Skills & specialties", subtitle: "What you're great at." },
  { key: "work", title: "Availability & work", subtitle: "When you can start — and show us your craft." },
  { key: "words", title: "A few words", subtitle: "The part we actually read first." },
] as const;

const DRAFT_KEY = "cruz-careers-draft-v1";
const TOKEN_KEY = "cruz-careers-token-v1";

// Which step each schema field lives on — so a server-side error jumps the user
// to the right step.
const FIELD_STEP: Record<string, number> = {
  fullName: 0, email: 0, phone: 0, location: 0, workAuthorized: 0,
  role: 1, experienceYears: 1, experienceLevel: 1, currentEmployer: 1,
  specialties: 2, tools: 2, certifications: 2,
  availability: 3, startDate: 3, portfolioUrl: 3, resume: 3, coverLetter: 3, workPhotos: 3,
  whyCruz: 4, proudOf: 4, salaryExpectation: 4, referralSource: 4, referralName: 4,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9 ()+\-.]+$/;

function validateStep(step: number, f: FormState): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 0) {
    if (f.fullName.trim().length < 2) e.fullName = "Please enter your name.";
    if (!EMAIL_RE.test(f.email.trim())) e.email = "Please enter a valid email address.";
    if (f.phone.trim().length < 7 || !PHONE_RE.test(f.phone.trim())) e.phone = "Please enter a valid phone number.";
    if (f.location.trim().length < 2) e.location = "Where are you based?";
    if (f.workAuthorized === null) e.workAuthorized = "Please answer.";
  } else if (step === 1) {
    if (!f.role) e.role = "Please choose a role.";
  } else if (step === 2) {
    if (f.specialties.length < 1) e.specialties = "Pick at least one specialty.";
  } else if (step === 3) {
    if (f.availability.length < 1) e.availability = "Pick at least one.";
    if (f.resume.length < 1) e.resume = "Please attach your resume.";
  } else if (step === 4) {
    if (f.whyCruz.trim().length < 10) e.whyCruz = "A sentence or two is plenty.";
    if (!f.referralSource) e.referralSource = "How did you hear about us?";
  }
  return e;
}

export function CareerApplication({ defaultRole = "" }: { defaultRole?: string }) {
  const reduced = useReducedMotion();
  const [form, setForm] = useState<FormState>(DEFAULT);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState("");
  const [restored, setRestored] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const mountedDraft = useRef(false);

  // Hydrate token + saved draft from localStorage after mount. Deferred to a
  // microtask so the state sync runs in a callback (not synchronously in the
  // effect body) — keeps SSR markup deterministic and avoids cascading renders.
  useEffect(() => {
    const hydrate = () => {
      let t = "";
      let nextForm: FormState | null = null;
      let didRestore = false;
      try {
        t = localStorage.getItem(TOKEN_KEY) || "";
        if (!t) {
          t = crypto.randomUUID();
          localStorage.setItem(TOKEN_KEY, t);
        }
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          nextForm = { ...DEFAULT, ...(JSON.parse(raw) as Partial<FormState>) };
          didRestore = true;
        }
      } catch {
        /* storage unavailable — proceed without autosave */
      }
      if (!t) t = `${Math.random()}`.slice(2);
      if (defaultRole && (ROLES as readonly string[]).includes(defaultRole)) {
        nextForm = { ...(nextForm ?? DEFAULT), role: defaultRole };
      }
      setToken(t);
      if (nextForm) setForm(nextForm);
      if (didRestore) setRestored(true);
      mountedDraft.current = true;
    };
    queueMicrotask(hydrate);
  }, [defaultRole]);

  // Autosave on change (after the initial hydrate).
  useEffect(() => {
    if (!mountedDraft.current) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* ignore quota errors */
    }
  }, [form]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const focusFirstError = (errs: Record<string, string>) => {
    const first = Object.keys(errs).find((k) => errs[k]);
    if (first) requestAnimationFrame(() => document.getElementById(`f-${first}`)?.focus());
  };

  const goTo = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }));
  };

  const next = () => {
    const e = validateStep(step, form);
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError(e);
    if (step < STEPS.length - 1) goTo(step + 1);
  };

  const submit = async () => {
    // validate every step before sending
    let firstBad = -1;
    let allErr: Record<string, string> = {};
    for (let s = 0; s < STEPS.length; s++) {
      const e = validateStep(s, form);
      if (Object.keys(e).length && firstBad === -1) {
        firstBad = s;
        allErr = e;
      }
    }
    if (firstBad !== -1) {
      setErrors(allErr);
      goTo(firstBad);
      focusFirstError(allErr);
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    const payload = {
      company: "",
      uploadToken: token,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      location: form.location,
      workAuthorized: form.workAuthorized,
      role: form.role,
      experienceYears: form.experienceYears,
      experienceLevel: form.experienceLevel || undefined,
      currentEmployer: form.currentEmployer || undefined,
      specialties: form.specialties,
      tools: form.tools,
      certifications: form.certifications,
      availability: form.availability,
      startDate: form.startDate || undefined,
      portfolioUrl: form.portfolioUrl || undefined,
      resume: form.resume[0],
      coverLetter: form.coverLetter[0],
      workPhotos: form.workPhotos,
      whyCruz: form.whyCruz,
      proudOf: form.proudOf || undefined,
      salaryExpectation: form.salaryExpectation || undefined,
      referralSource: form.referralSource,
      referralName: form.referralName || undefined,
    };
    const res = await submitApplication(payload);
    setSubmitting(false);
    if (res.ok) {
      try {
        localStorage.removeItem(DRAFT_KEY);
        localStorage.removeItem(TOKEN_KEY);
      } catch {
        /* ignore */
      }
      setDone(form.fullName.trim().split(" ")[0] || "there");
      requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }));
      return;
    }
    if (res.fieldErrors) {
      setErrors(res.fieldErrors);
      const bad = Object.keys(res.fieldErrors)[0];
      if (bad && FIELD_STEP[bad] !== undefined) goTo(FIELD_STEP[bad]);
      focusFirstError(res.fieldErrors);
    } else {
      setSubmitError(res.message);
    }
  };

  if (done) return <SuccessCard name={done} reduced={!!reduced} />;

  const pct = ((step + 1) / STEPS.length) * 100;

  return (
    <div ref={cardRef} className="scroll-mt-24 rounded-3xl border border-[#E7DFD3] bg-white p-6 shadow-sm sm:p-9">
      {/* Progress */}
      <div className="mb-7">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-[0.18em] text-[#B45309]">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-[#8A7F73]">{STEPS[step].title}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDE3D3]">
          <motion.div
            className="h-full rounded-full bg-[#B45309]"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE }}
          />
        </div>
        {/* Step dots (jump back to completed steps) */}
        <div className="mt-3 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              disabled={i > step}
              aria-current={i === step ? "step" : undefined}
              onClick={() => i < step && goTo(i)}
              className={`rounded-full px-2.5 py-1 text-[11px] transition-colors ${
                i === step
                  ? "bg-[#B45309] text-white"
                  : i < step
                    ? "bg-[#F0E3D2] text-[#7A5A33] hover:bg-[#E7D6C0]"
                    : "bg-[#F5F1EA] text-[#C2B6A6]"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {restored && step === 0 && (
        <p className="mb-5 rounded-lg border border-[#CA8A04]/25 bg-[#FBF4E7] px-4 py-2.5 text-sm text-[#7A5A33]">
          Welcome back — we saved your progress.{" "}
          <button
            type="button"
            className="font-medium text-[#B45309] underline"
            onClick={() => {
              setForm(DEFAULT);
              setRestored(false);
              try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
            }}
          >
            Start over
          </button>
        </p>
      )}

      <div className="mb-6">
        <h3 className="font-serif text-2xl text-[#1C1917]">{STEPS[step].title}</h3>
        <p className="mt-1 text-sm font-light text-[#8A7F73]">{STEPS[step].subtitle}</p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduced ? false : { opacity: 0, x: 24 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {step === 0 && <StepAbout form={form} set={set} errors={errors} />}
          {step === 1 && <StepRole form={form} set={set} errors={errors} />}
          {step === 2 && <StepSkills form={form} set={set} errors={errors} />}
          {step === 3 && <StepWork form={form} set={set} errors={errors} token={token} />}
          {step === 4 && <StepWords form={form} set={set} errors={errors} />}
        </motion.div>
      </AnimatePresence>

      {submitError && (
        <p role="alert" className="mt-5 rounded-lg border border-[#B91C1C]/30 bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {submitError}
        </p>
      )}

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#F0E8DC] pt-6">
        <button
          type="button"
          onClick={() => step > 0 && goTo(step - 1)}
          disabled={step === 0}
          className="rounded-full px-5 py-2.5 text-sm font-medium text-[#57534E] transition-colors hover:bg-[#F5EEE2] disabled:opacity-0"
        >
          ← Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-full bg-[#B45309] px-8 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-[#B45309] px-8 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#92400E] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
          >
            {submitting ? "Submitting…" : "Submit application"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- shared field primitives ---------- */

type SetFn = <K extends keyof FormState>(key: K, value: FormState[K]) => void;
interface StepProps {
  form: FormState;
  set: SetFn;
  errors: Record<string, string>;
}

const inputCls = (err?: string) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-[#1C1917] text-base placeholder:text-[#A8A29E] outline-none transition-colors focus:border-[#B45309] focus:ring-2 focus:ring-[#CA8A04]/20 ${
    err ? "border-[#B91C1C]" : "border-[#D6CCBA]"
  }`;

function Field({
  id,
  label,
  required,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#44403C]">
        {label} {required && <span className="text-[#B45309]">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs font-light text-[#8A7F73]">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-[#B91C1C]">
          {error}
        </p>
      )}
    </div>
  );
}

function Chips({
  options,
  selected,
  onToggle,
  describedBy,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (v: string) => void;
  describedBy?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-describedby={describedBy}>
      {options.map((opt) => {
        const on = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(opt)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-1 ${
              on
                ? "border-[#B45309] bg-[#B45309] text-white"
                : "border-[#D6CCBA] bg-white text-[#57534E] hover:border-[#CA8A04]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

/* ---------- steps ---------- */

function StepAbout({ form, set, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="f-fullName" label="Full name" required error={errors.fullName}>
          <input id="f-fullName" autoComplete="name" className={inputCls(errors.fullName)} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Your name" />
        </Field>
        <Field id="f-phone" label="Phone" required error={errors.phone}>
          <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" className={inputCls(errors.phone)} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(720) 280-0812" />
        </Field>
        <Field id="f-email" label="Email" required error={errors.email}>
          <input id="f-email" type="email" inputMode="email" autoComplete="email" className={inputCls(errors.email)} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
        </Field>
        <Field id="f-location" label="City / area" required error={errors.location} hint="So we know your commute.">
          <input id="f-location" autoComplete="address-level2" className={inputCls(errors.location)} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Denver, CO" />
        </Field>
      </div>
      <Field id="f-workAuthorized" label="Authorized to work in the U.S.?" required error={errors.workAuthorized}>
        <div className="flex gap-2" role="group">
          {[{ v: true, l: "Yes" }, { v: false, l: "No" }].map((o) => {
            const on = form.workAuthorized === o.v;
            return (
              <button
                key={o.l}
                type="button"
                aria-pressed={on}
                onClick={() => set("workAuthorized", o.v)}
                className={`rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
                  on ? "border-[#B45309] bg-[#B45309] text-white" : "border-[#D6CCBA] bg-white text-[#57534E] hover:border-[#CA8A04]"
                }`}
              >
                {o.l}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

function StepRole({ form, set, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <Field id="f-role" label="What role are you applying for?" required error={errors.role}>
        <div className="grid gap-2 sm:grid-cols-2">
          {ROLES.map((r) => {
            const on = form.role === r;
            return (
              <button
                key={r}
                type="button"
                aria-pressed={on}
                onClick={() => set("role", r)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
                  on ? "border-[#B45309] bg-[#FBF1E4] text-[#1C1917]" : "border-[#E7DFD3] bg-white text-[#57534E] hover:border-[#CA8A04]"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
        <input type="hidden" id="f-role-anchor" />
      </Field>

      <YearsSlider value={form.experienceYears} onChange={(v) => set("experienceYears", v)} />

      <Field id="f-experienceLevel" label="How would you describe your level?" hint="Optional.">
        <Chips options={EXPERIENCE_LEVELS} selected={form.experienceLevel ? [form.experienceLevel] : []} onToggle={(v) => set("experienceLevel", form.experienceLevel === v ? null : v)} />
      </Field>

      <Field id="f-currentEmployer" label="Current or most recent employer" hint="Optional.">
        <input id="f-currentEmployer" className={inputCls()} value={form.currentEmployer} onChange={(e) => set("currentEmployer", e.target.value)} placeholder="Company / self-employed" />
      </Field>
    </div>
  );
}

function YearsSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const id = useId();
  const label = value >= 30 ? "30+ years" : `${value} ${value === 1 ? "year" : "years"}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center justify-between text-sm font-medium text-[#44403C]">
        <span>Years of carpentry experience</span>
        <span className="rounded-full bg-[#F0E3D2] px-2.5 py-0.5 text-[#7A5A33]">{label}</span>
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={30}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#B45309]"
        aria-valuetext={label}
      />
      <div className="mt-1 flex justify-between text-[10px] text-[#A8A29E]">
        <span>New</span><span>10</span><span>20</span><span>30+</span>
      </div>
    </div>
  );
}

function StepSkills({ form, set, errors }: StepProps) {
  const sid = useId();
  return (
    <div className="space-y-6">
      <Field id="f-specialties" label="Your specialties" required error={errors.specialties} hint={`${form.specialties.length} selected — pick all that apply.`}>
        <div id={sid} />
        <Chips options={SPECIALTIES} selected={form.specialties} onToggle={(v) => set("specialties", toggle(form.specialties, v))} describedBy={sid} />
      </Field>
      <Field id="f-tools" label="Tools & machines you're comfortable with" hint="Optional.">
        <Chips options={TOOLS} selected={form.tools} onToggle={(v) => set("tools", toggle(form.tools, v))} />
      </Field>
      <Field id="f-certifications" label="Certifications & licenses" hint="Optional.">
        <Chips options={CERTIFICATIONS} selected={form.certifications} onToggle={(v) => set("certifications", toggle(form.certifications, v))} />
      </Field>
    </div>
  );
}

function StepWork({ form, set, errors, token }: StepProps & { token: string }) {
  return (
    <div className="space-y-6">
      <Field id="f-availability" label="Availability" required error={errors.availability}>
        <Chips options={AVAILABILITY} selected={form.availability} onToggle={(v) => set("availability", toggle(form.availability, v))} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="f-startDate" label="Earliest start date" hint="Optional.">
          <input id="f-startDate" type="date" className={inputCls()} value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
        </Field>
        <Field id="f-portfolioUrl" label="Portfolio / Instagram" required={false} error={errors.portfolioUrl} hint="Optional — a link to your work.">
          <input id="f-portfolioUrl" type="url" inputMode="url" className={inputCls(errors.portfolioUrl)} value={form.portfolioUrl} onChange={(e) => set("portfolioUrl", e.target.value)} placeholder="https://…" />
        </Field>
      </div>
      <div id="f-resume" />
      <FileDrop kind="resume" token={token} required label="Resume / CV" hint="PDF or Word, up to 10 MB." accept=".pdf,.doc,.docx" value={form.resume} onChange={(v) => set("resume", v)} />
      {errors.resume && <p role="alert" className="-mt-3 text-sm text-[#B91C1C]">{errors.resume}</p>}
      <FileDrop kind="cover" token={token} label="Cover letter" hint="Optional — PDF or Word, up to 10 MB." accept=".pdf,.doc,.docx" value={form.coverLetter} onChange={(v) => set("coverLetter", v)} />
      <FileDrop kind="photo" token={token} multiple max={8} label="Photos of your work" hint="Optional but encouraged — up to 8 images, 10 MB each." accept="image/jpeg,image/png,image/webp" value={form.workPhotos} onChange={(v) => set("workPhotos", v)} />
    </div>
  );
}

function StepWords({ form, set, errors }: StepProps) {
  const why = form.whyCruz.trim().length;
  return (
    <div className="space-y-6">
      <Field id="f-whyCruz" label="Why Cruz Carpentry?" required error={errors.whyCruz} hint={`A sentence or two is plenty. ${why}/1500`}>
        <textarea id="f-whyCruz" rows={4} maxLength={1500} className={`${inputCls(errors.whyCruz)} resize-y`} value={form.whyCruz} onChange={(e) => set("whyCruz", e.target.value)} placeholder="What draws you to this kind of work?" />
      </Field>
      <Field id="f-proudOf" label="Tell us about a piece you're proud of" hint="Optional.">
        <textarea id="f-proudOf" rows={3} maxLength={1500} className={`${inputCls()} resize-y`} value={form.proudOf} onChange={(e) => set("proudOf", e.target.value)} placeholder="What was it, and what made it special?" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="f-salaryExpectation" label="Pay expectation" hint="Optional — hourly or salary.">
          <input id="f-salaryExpectation" className={inputCls()} value={form.salaryExpectation} onChange={(e) => set("salaryExpectation", e.target.value)} placeholder="e.g. $30/hr" />
        </Field>
        <Field id="f-referralSource" label="How did you hear about us?" required error={errors.referralSource}>
          <select id="f-referralSource" className={inputCls(errors.referralSource)} value={form.referralSource} onChange={(e) => set("referralSource", e.target.value)}>
            <option value="" disabled>Select one…</option>
            {REFERRAL_SOURCES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>
      </div>
      {form.referralSource === "Referral" && (
        <Field id="f-referralName" label="Who referred you?" hint="Optional.">
          <input id="f-referralName" className={inputCls()} value={form.referralName} onChange={(e) => set("referralName", e.target.value)} placeholder="Their name" />
        </Field>
      )}
      <p className="text-xs font-light text-[#8A7F73]">
        By submitting, you agree we may contact you about this application. We never share your information.
      </p>
    </div>
  );
}

function SuccessCard({ name, reduced }: { name: string; reduced: boolean }) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative overflow-hidden rounded-3xl border border-[#CA8A04]/30 bg-white p-10 text-center shadow-sm sm:p-14"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#CA8A04] via-[#B45309] to-[#CA8A04]" />
      <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-[#FBF1E4] text-[#B45309]">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="font-serif text-3xl text-[#1C1917]">Thanks, {name} — we&apos;ve got it.</h3>
      <p className="mx-auto mt-3 max-w-md font-light leading-relaxed text-[#57534E]">
        A real person reviews every application. If your craft looks like a fit, we&apos;ll reach out — usually within about a week.
      </p>
      <p className="mt-6 text-sm font-light text-[#8A7F73]">
        In the meantime, take a look at{" "}
        <a href="/gallery" className="font-medium text-[#B45309] hover:underline">the work we build</a>.
      </p>
    </motion.div>
  );
}
