"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  submitEstimate,
  initialEstimateState,
} from "@/app/actions/estimate";
import { PROJECT_TYPES } from "@/lib/estimate-schema";
import { PHONE, PHONE_HREF, EASE, REVEAL_DURATION } from "@/lib/constants";

// The full estimate wizard is heavy (multi-step + live pricing fetch). Only
// load its bundle when the visitor actually switches to the "Instant estimate"
// tab — the quick form stays the zero-cost default.
const EstimateWizard = dynamic(
  () => import("@/components/estimate-wizard/EstimateWizard").then((m) => m.EstimateWizard),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-[#E7DFD3] bg-white p-10 text-center text-sm text-[#78716C] shadow-sm">
        Loading the estimator…
      </div>
    ),
  },
);

const fieldBase =
  "w-full rounded-lg border bg-white px-4 py-3 text-[#1C1917] text-base " +
  "placeholder:text-[#A8A29E] outline-none transition-colors " +
  "focus:border-[#B45309] focus:ring-2 focus:ring-[#CA8A04]/20";

function fieldClass(hasError: boolean): string {
  return `${fieldBase} ${hasError ? "border-[#B91C1C]" : "border-[#D6CCBA]"}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-[#B91C1C]">
      {message}
    </p>
  );
}

type Mode = "quick" | "estimate";

/**
 * Unified "Request a Quote" block. A segmented toggle switches between:
 *  - Quick request — the short contact form (→ public.leads)
 *  - Instant estimate — the full guided wizard (→ public.inquiries + estimate)
 * Both persist to Supabase and surface in /admin. Drop-in replacement for the
 * old EstimateForm (same `defaultProjectType` prop, same `#estimate` anchor).
 */
export function EstimateForm({
  defaultProjectType = "",
}: {
  /** Pre-selects the quick form's "Project type" dropdown (service pages). */
  defaultProjectType?: string;
} = {}) {
  const [mode, setMode] = useState<Mode>("quick");
  const reduced = useReducedMotion();

  return (
    <section id="estimate" className="relative bg-[#F5EEE2] py-24 sm:py-32 px-6">
      <motion.div
        className={mode === "estimate" ? "mx-auto max-w-3xl" : "mx-auto max-w-2xl"}
        initial={reduced ? false : { opacity: 0, y: 48 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12, margin: "0px 0px -10% 0px" }}
        transition={{ duration: REVEAL_DURATION, ease: EASE }}
      >
        <div className="text-center mb-9">
          <p className="text-[#B45309] text-xs font-semibold tracking-[0.28em] uppercase mb-5">
            Request a Quote
          </p>
          <div className="w-12 h-px bg-[#CA8A04] mx-auto mb-8" />
          <h2 className="font-serif text-4xl sm:text-5xl text-[#1C1917] leading-tight mb-5">
            Let&apos;s talk about
            <br />
            <em className="italic">your project</em>
          </h2>
          <p className="text-[#57534E] text-lg font-light leading-relaxed max-w-md mx-auto">
            Send a quick message, or get an instant ballpark price range in a few
            minutes — your choice.
          </p>
        </div>

        <ModeToggle mode={mode} onChange={setMode} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: EASE }}
            id={`quote-panel-${mode}`}
            role="tabpanel"
            aria-labelledby={`quote-tab-${mode}`}
          >
            {mode === "quick" ? (
              <QuickRequestForm defaultProjectType={defaultProjectType} />
            ) : (
              <EstimateWizard />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/** Accessible segmented control (tablist) switching the two request modes. */
function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const options: { id: Mode; label: string; hint: string }[] = [
    { id: "quick", label: "Quick request", hint: "Send a quick message" },
    { id: "estimate", label: "Instant estimate", hint: "Price range in minutes" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Choose how to request a quote"
      className="mx-auto mb-9 grid max-w-md grid-cols-2 gap-1.5 rounded-2xl border border-[#E2D7C6] bg-[#EDE3D3] p-1.5"
    >
      {options.map((opt) => {
        const active = mode === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            id={`quote-tab-${opt.id}`}
            aria-selected={active}
            aria-controls={`quote-panel-${opt.id}`}
            onClick={() => onChange(opt.id)}
            className={`flex flex-col items-center rounded-xl px-3 py-2.5 text-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-1 focus-visible:ring-offset-[#EDE3D3] ${
              active
                ? "bg-white shadow-sm"
                : "text-[#6B6056] hover:bg-white/50"
            }`}
          >
            <span className={`text-sm font-semibold ${active ? "text-[#B45309]" : "text-[#57534E]"}`}>
              {opt.label}
            </span>
            <span className="mt-0.5 text-[11px] font-light text-[#8A7F73]">{opt.hint}</span>
          </button>
        );
      })}
    </div>
  );
}

/** The short contact form — posts to the submitEstimate Server Action. */
function QuickRequestForm({ defaultProjectType }: { defaultProjectType: string }) {
  const [state, formAction, pending] = useActionState(
    submitEstimate,
    initialEstimateState,
  );
  const errors = state.fieldErrors ?? {};
  const successRef = useRef<HTMLDivElement>(null);

  // After a server round-trip, move focus to the confirmation on success, or to
  // the first invalid field on error — so keyboard/SR users aren't stranded.
  useEffect(() => {
    if (state.status === "success") {
      successRef.current?.focus();
    } else if (state.status === "error" && state.fieldErrors) {
      const firstField = Object.keys(state.fieldErrors)[0];
      if (firstField) document.getElementById(firstField)?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-[#CA8A04]/30 bg-white p-10 text-center shadow-sm focus:outline-none"
      >
        <h3 className="font-serif text-2xl text-[#1C1917] mb-3">Request received</h3>
        <p className="text-[#57534E] font-light leading-relaxed">{state.message}</p>
        <p className="text-[#57534E] text-sm mt-6 font-light">
          Prefer to talk now?{" "}
          <a href={PHONE_HREF} className="text-[#B45309] font-medium hover:underline">
            {PHONE}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {/* Honeypot — hidden from real users. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message ? (
        <p
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-[#B91C1C]/30 bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]"
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#44403C] mb-1.5">
            Name <span className="text-[#B45309]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClass(Boolean(errors.name))}
            placeholder="Your name"
          />
          <FieldError id="name-error" message={errors.name} />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#44403C] mb-1.5">
            Phone <span className="text-[#B45309]">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={fieldClass(Boolean(errors.phone))}
            placeholder="(720) 280-0812"
          />
          <FieldError id="phone-error" message={errors.phone} />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#44403C] mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass(Boolean(errors.email))}
            placeholder="you@example.com"
          />
          <FieldError id="email-error" message={errors.email} />
        </div>

        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-[#44403C] mb-1.5">
            Project type
          </label>
          <select
            id="projectType"
            name="projectType"
            defaultValue={defaultProjectType}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? "projectType-error" : undefined}
            className={fieldClass(Boolean(errors.projectType))}
          >
            <option value="" disabled>
              Select one…
            </option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError id="projectType-error" message={errors.projectType} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#44403C] mb-1.5">
          Project details
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass(Boolean(errors.message))} resize-y`}
          placeholder="Tell us about your space, timeline, and what you'd like built."
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                   bg-[#B45309] hover:bg-[#92400E] active:bg-[#92400E] disabled:opacity-60
                   disabled:cursor-not-allowed text-white px-10 py-4 rounded-full
                   text-lg font-medium transition-colors duration-200 cursor-pointer
                   shadow-lg shadow-black/10 focus:outline-none focus-visible:ring-2
                   focus-visible:ring-[#B45309] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EEE2]"
      >
        {pending ? "Sending…" : "Request Free Estimate"}
      </button>

      <p className="text-[#6B6560] text-xs font-light pt-1">
        Serving the Colorado Front Range · We&apos;ll never share your information.
      </p>
    </form>
  );
}
