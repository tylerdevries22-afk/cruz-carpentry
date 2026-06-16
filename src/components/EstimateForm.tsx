"use client";

import { useActionState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  submitEstimate,
  initialEstimateState,
} from "@/app/actions/estimate";
import { PROJECT_TYPES } from "@/lib/estimate-schema";
import { PHONE, PHONE_HREF, EASE, REVEAL_DURATION } from "@/lib/constants";

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

export function EstimateForm({
  defaultProjectType = "",
}: {
  /** Pre-selects the "Project type" dropdown (used on service detail pages). */
  defaultProjectType?: string;
} = {}) {
  const [state, formAction, pending] = useActionState(
    submitEstimate,
    initialEstimateState,
  );
  const errors = state.fieldErrors ?? {};
  const reduced = useReducedMotion();
  const successRef = useRef<HTMLDivElement>(null);

  // Move focus after a server round-trip: to the confirmation on success, or to
  // the first invalid field on error — so keyboard/SR users aren't stranded on
  // the (now off-screen or stale) submit button.
  useEffect(() => {
    if (state.status === "success") {
      successRef.current?.focus();
    } else if (state.status === "error" && state.fieldErrors) {
      const firstField = Object.keys(state.fieldErrors)[0];
      if (firstField) document.getElementById(firstField)?.focus();
    }
  }, [state]);

  return (
    <section id="estimate" className="relative bg-[#F5EEE2] py-24 sm:py-32 px-6">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={reduced ? false : { opacity: 0, y: 48 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
        transition={{ duration: REVEAL_DURATION, ease: EASE }}
      >
        <div className="text-center mb-12">
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
            Tell us a little about what you have in mind and we&apos;ll reach out
            to schedule a free, no-obligation estimate.
          </p>
        </div>

        {state.status === "success" ? (
          <div
            ref={successRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-[#CA8A04]/30 bg-white p-10 text-center shadow-sm focus:outline-none"
          >
            <h3 className="font-serif text-2xl text-[#1C1917] mb-3">
              Request received
            </h3>
            <p className="text-[#57534E] font-light leading-relaxed">
              {state.message}
            </p>
            <p className="text-[#57534E] text-sm mt-6 font-light">
              Prefer to talk now?{" "}
              <a
                href={PHONE_HREF}
                className="text-[#B45309] font-medium hover:underline"
              >
                {PHONE}
              </a>
            </p>
          </div>
        ) : (
          <form action={formAction} noValidate className="space-y-5">
            {/* Honeypot — hidden from real users. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
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
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#44403C] mb-1.5"
                >
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
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-[#44403C] mb-1.5"
                >
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
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#44403C] mb-1.5"
                >
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
                <label
                  htmlFor="projectType"
                  className="block text-sm font-medium text-[#44403C] mb-1.5"
                >
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
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[#44403C] mb-1.5"
              >
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
              Serving the Colorado Front Range · We&apos;ll never share your
              information.
            </p>
          </form>
        )}
      </motion.div>
    </section>
  );
}
