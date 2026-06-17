"use client";

import { useState, useTransition } from "react";
import { STAGES, STAGE_KEYS, type StageKey } from "@/lib/jobs";
import { setJobStage } from "@/app/actions/jobs";

/**
 * Interactive 6-step project pipeline. Completed stages show a check; the
 * current one is highlighted. Clicking a stage advances/persists it
 * (optimistic — reverts on failure). The connector fills up to the current step.
 */
export function StageTimeline({ jobId, initialStage }: { jobId: string; initialStage: StageKey }) {
  const [stage, setStage] = useState<StageKey>(initialStage);
  const [pending, start] = useTransition();
  const idx = STAGE_KEYS.indexOf(stage);
  const fillPct = (idx / (STAGE_KEYS.length - 1)) * 100;

  const set = (s: StageKey) => {
    if (s === stage) return;
    const prev = stage;
    setStage(s);
    start(async () => {
      const r = await setJobStage(jobId, s);
      if (!r.ok) setStage(prev);
    });
  };

  return (
    <div>
      <div className="relative">
        {/* connector track */}
        <div className="absolute left-[8%] right-[8%] top-5 h-0.5 bg-[#E2D6C4]" aria-hidden="true" />
        <div className="absolute left-[8%] top-5 h-0.5 bg-[#B45309] transition-[width] duration-500" style={{ width: `calc((100% - 16%) * ${fillPct / 100})` }} aria-hidden="true" />

        <ol className="relative grid grid-cols-6 gap-1">
          {STAGES.map((s, i) => {
            const done = i < idx;
            const active = i === idx;
            return (
              <li key={s.key} className="flex flex-col items-center text-center">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => set(s.key)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`${s.label} — ${done ? "completed" : active ? "current" : "set as current"}`}
                  className={`grid h-10 w-10 place-items-center rounded-full border-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2 disabled:cursor-wait ${
                    done
                      ? "border-[#B45309] bg-[#B45309] text-white"
                      : active
                        ? "border-[#B45309] bg-white text-[#B45309] ring-2 ring-[#B45309]/30"
                        : "border-[#D6CCBC] bg-white text-[#A8A29E] hover:border-[#CA8A04]"
                  }`}
                >
                  {done ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </button>
                <span className={`mt-2 text-[11px] font-medium leading-tight sm:text-xs ${active ? "text-[#1C1917]" : "text-[#78716C]"}`}>
                  {s.label}
                </span>
                <span className="mt-0.5 hidden text-[10px] leading-tight text-[#A8A29E] sm:block">{s.blurb}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mt-4 text-xs text-[#A8A29E]">
        {pending ? "Saving…" : "Click a stage to update where this project stands."}
      </p>
    </div>
  );
}
