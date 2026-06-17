import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { SEED_SNAPSHOT } from "@/lib/pricing/rates";
import { loadRateSnapshot } from "@/lib/pricing/rate-source";
import { AdminShell } from "@/components/admin/AdminShell";
import { RateEditor } from "@/components/admin/RateEditor";

export const metadata: Metadata = {
  title: "Admin — Rates",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminRatesPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  // Effective rates = seed deep-merged with the active override.
  const { snapshot, source } = await loadRateSnapshot({ force: true });

  return (
    <AdminShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-3xl text-[#1C1917]">Rate editor</h1>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${source === "db" ? "bg-[#0F766E]/10 text-[#0F766E]" : "bg-[#78716C]/10 text-[#78716C]"}`}>
            {source === "db" ? "Custom rates active" : "Using seed defaults"}
          </span>
        </div>
        <p className="mb-6 max-w-2xl text-sm font-light leading-relaxed text-[#57534E]">
          These rates power the <strong>instant estimate</strong>. Change any value and hit
          <strong> Save</strong> — no deploy needed, and it goes live within about 10 minutes. The
          live lumber-market factor is still applied on top automatically. Each field shows its
          original <em>seed</em> default underneath, and edited fields are outlined in gold.
        </p>
        <RateEditor snapshot={snapshot} seed={SEED_SNAPSHOT} />
      </div>
    </AdminShell>
  );
}
