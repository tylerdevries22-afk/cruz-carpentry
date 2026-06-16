"use client";

import { useState, useTransition } from "react";
import { revertRatesToSeed, saveRateOverrides } from "@/app/actions/admin";

export function RateEditor({ initial, seedJson }: { initial: string; seedJson: string }) {
  const [value, setValue] = useState(initial);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-4">
      <p className="text-sm font-light text-[#57534E]">
        Enter a <strong>partial</strong> override as JSON — only the fields you want to change.
        It&apos;s deep-merged over the seed defaults below. Changes take effect within ~10 minutes.
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={12}
        spellCheck={false}
        className="w-full rounded-lg border border-[#D6CCBC] bg-white p-3 font-mono text-xs text-[#1C1917] outline-none focus:ring-2 focus:ring-[#B45309]"
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await saveRateOverrides(value);
              setMsg(r.ok ? { kind: "ok", text: "Saved & activated." } : { kind: "err", text: r.error ?? "Failed." });
            })
          }
          className="rounded-full bg-[#B45309] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#92400E] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save & activate"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await revertRatesToSeed();
              if (r.ok) {
                setValue("{}");
                setMsg({ kind: "ok", text: "Reverted to seed defaults." });
              } else setMsg({ kind: "err", text: "Revert failed." });
            })
          }
          className="rounded-full border border-[#D6CCBC] px-5 py-2.5 text-sm text-[#57534E] hover:bg-white disabled:opacity-60"
        >
          Revert to seed
        </button>
        {msg && (
          <span className={`text-sm ${msg.kind === "ok" ? "text-[#0F766E]" : "text-[#B91C1C]"}`}>{msg.text}</span>
        )}
      </div>

      <details className="rounded-lg border border-[#E7DFD3] bg-white p-3">
        <summary className="cursor-pointer text-sm font-medium text-[#1C1917]">Seed defaults (reference)</summary>
        <pre className="mt-3 max-h-80 overflow-auto rounded bg-[#FAF7F2] p-3 font-mono text-[11px] text-[#57534E]">
{seedJson}
        </pre>
      </details>
    </div>
  );
}
