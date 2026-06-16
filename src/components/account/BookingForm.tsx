"use client";

import { useState, useTransition } from "react";
import { createBooking } from "@/app/actions/account";

export function BookingForm({ inquiryId }: { inquiryId: string }) {
  const [date, setDate] = useState("");
  const [window, setWindow] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  if (msg?.ok) {
    return <p className="text-sm text-[#0F766E]">✓ Consultation request sent — we&apos;ll confirm a time.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[#57534E]">Preferred date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-[#D6CCBC] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#B45309]"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[#57534E]">Preferred time</span>
          <select
            value={window}
            onChange={(e) => setWindow(e.target.value)}
            className="w-full rounded-lg border border-[#D6CCBC] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#B45309]"
          >
            <option value="">Any time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </label>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        placeholder="Anything we should know? (optional)"
        className="w-full rounded-lg border border-[#D6CCBC] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#B45309]"
      />
      {msg && !msg.ok && <p className="text-sm text-[#B91C1C]">{msg.text}</p>}
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await createBooking(inquiryId, date, window, notes);
            setMsg(r.ok ? { ok: true, text: "" } : { ok: false, text: r.error ?? "Failed." });
          })
        }
        className="rounded-full bg-[#B45309] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#92400E] disabled:opacity-60"
      >
        {pending ? "Sending…" : "Request a consultation"}
      </button>
    </div>
  );
}
