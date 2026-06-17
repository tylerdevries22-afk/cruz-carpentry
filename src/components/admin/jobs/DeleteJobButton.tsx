"use client";

import { useTransition } from "react";
import { deleteJob } from "@/app/actions/jobs";

export function DeleteJobButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Delete "${title}"? This permanently removes the job and its notes.`)) {
          start(() => deleteJob(id));
        }
      }}
      className="rounded-full border border-[#B91C1C]/40 px-5 py-2.5 text-sm font-medium text-[#B91C1C] transition-colors hover:bg-[#FEF2F2] disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete job"}
    </button>
  );
}
