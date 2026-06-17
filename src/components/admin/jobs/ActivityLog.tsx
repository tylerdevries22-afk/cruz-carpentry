"use client";

import { useState, useTransition } from "react";
import { addNote } from "@/app/actions/jobs";
import type { JobNote } from "@/lib/jobs";

const fmt = (d: string) => {
  const dt = new Date(d.length === 10 ? d + "T00:00:00" : d);
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export function ActivityLog({ jobId, initial }: { jobId: string; initial: JobNote[] }) {
  const [notes, setNotes] = useState<JobNote[]>(initial);
  const [text, setText] = useState("");
  const [, start] = useTransition();

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    start(async () => {
      const r = await addNote(jobId, t);
      if (r.ok && r.note) {
        setNotes((p) => [r.note!, ...p]);
        setText("");
      }
    });
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }}
          placeholder="Add an update…"
          className="flex-1 rounded-lg border border-[#D6CCBC] bg-white px-3 py-2 text-sm outline-none focus:border-[#B45309] focus:ring-2 focus:ring-[#CA8A04]/20"
        />
        <button type="button" onClick={submit} className="rounded-full bg-[#B45309] px-4 py-2 text-sm font-semibold text-white hover:bg-[#92400E]">Add</button>
      </div>
      {notes.length === 0 ? (
        <p className="text-sm text-[#A8A29E]">No updates yet.</p>
      ) : (
        <ol className="space-y-4">
          {notes.map((n, i) => (
            <li key={`${n.at}-${i}`} className="relative pl-5">
              <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-[#B45309]" />
              {i < notes.length - 1 && <span className="absolute left-[3px] top-3.5 h-full w-px bg-[#E7DFD3]" />}
              <p className="text-sm text-[#1C1917]">{n.text}</p>
              <p className="text-xs text-[#A8A29E]">{fmt(n.at)} · {n.author}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
