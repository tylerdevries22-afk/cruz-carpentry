import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { STAGES, STAGE_KEYS, jobProgress, money, type Job } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Admin — Jobs",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const stageLabel = (k: string) => STAGES.find((s) => s.key === k)?.label ?? k;

export default async function AdminJobsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const supabase = getServiceSupabase();
  if (!supabase) return <main className="p-10 text-[#57534E]">Admin is not configured on this environment.</main>;

  const { data } = await supabase
    .from("jobs")
    .select("*")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });
  const jobs = (data ?? []) as Job[];
  const active = jobs.filter((j) => j.status === "active").length;

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl text-[#1C1917]">Jobs</h1>
            <p className="text-sm text-[#78716C]">
              {active} active · {jobs.length} total
            </p>
          </div>
          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#B45309] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#92400E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
            New job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <p className="rounded-xl border border-[#E7DFD3] bg-white p-8 text-center text-[#78716C]">No jobs yet.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {jobs.map((j) => {
              const pct = jobProgress(j);
              const complete = j.status === "complete";
              return (
                <li key={j.id}>
                  <Link
                    href={`/admin/jobs/${j.id}`}
                    className="group block overflow-hidden rounded-2xl border border-[#E7DFD3] bg-white shadow-sm transition-all hover:border-[#CA8A04]/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
                  >
                    <div className="relative aspect-[16/10] bg-[#E5D9C9]">
                      {j.cover_image && (
                        <Image src={j.cover_image} alt={j.title} fill sizes="(max-width:640px) 100vw, 360px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      )}
                      <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white ${complete ? "bg-[#0F766E]" : "bg-[#B45309]"}`}>
                        {complete ? "Complete" : stageLabel(j.stage)}
                      </span>
                    </div>
                    <div className="p-4">
                      <h2 className="font-serif text-lg leading-snug text-[#1C1917]">{j.title}</h2>
                      <p className="mt-0.5 text-sm text-[#57534E]">{j.client_name}{j.address ? ` · ${j.address}` : ""}</p>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EDE3D3]">
                        <div className={`h-full rounded-full ${complete ? "bg-[#0F766E]" : "bg-[#B45309]"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-[#78716C]">
                        <span>Step {STAGE_KEYS.indexOf(j.stage) + 1} of {STAGE_KEYS.length} · {pct}%</span>
                        <span className="font-medium text-[#1C1917]">{money(j.budget_quoted)}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
