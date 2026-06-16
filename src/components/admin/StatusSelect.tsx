"use client";

import { useState, useTransition } from "react";
import { updateInquiryStatus } from "@/app/actions/admin";

const STATUSES = [
  "submitted",
  "reviewing",
  "contacted",
  "quoted",
  "scheduled",
  "won",
  "lost",
];

export function StatusSelect({ id, current }: { id: string; current: string }) {
  const [value, setValue] = useState(current);
  const [pending, start] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  return (
    <span className="inline-flex items-center gap-2">
      <select
        value={value}
        disabled={pending}
        aria-label="Inquiry status"
        onChange={(e) => {
          const next = e.target.value;
          const prev = value;
          setValue(next);
          start(async () => {
            const r = await updateInquiryStatus(id, next);
            if (r.ok) setSavedAt(Date.now());
            else setValue(prev);
          });
        }}
        className="rounded-md border border-[#D6CCBC] bg-white px-2 py-1 text-xs text-[#1C1917] outline-none focus:ring-2 focus:ring-[#B45309] disabled:opacity-60"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {pending && <span className="text-[10px] text-[#78716C]">saving…</span>}
      {!pending && savedAt && <span className="text-[10px] text-[#0F766E]">saved</span>}
    </span>
  );
}
