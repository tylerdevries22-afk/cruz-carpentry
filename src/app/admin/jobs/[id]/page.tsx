import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { StageTimeline } from "@/components/admin/jobs/StageTimeline";
import { ShoppingList } from "@/components/admin/jobs/ShoppingList";
import { JobPhotos } from "@/components/admin/jobs/JobPhotos";
import { money, type Job, type JobPayment } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Admin — Job",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const fmtDate = (d: string | null) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E7DFD3] bg-white p-5 sm:p-6">
      <h2 className="mb-4 font-serif text-xl text-[#1C1917]">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 text-sm">
      <span className="text-[#78716C]">{label}</span>
      <span className="text-right font-medium text-[#1C1917]">{children}</span>
    </div>
  );
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const supabase = getServiceSupabase();
  if (!supabase) return <main className="p-10 text-[#57534E]">Admin is not configured.</main>;

  const { data } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const job = data as Job;

  const payments = (job.payments ?? []) as JobPayment[];
  const collected = payments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0);
  const balance = (job.budget_quoted ?? 0) - collected;
  const complete = job.status === "complete";

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl">
        <Link href="/admin/jobs" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#B45309] hover:underline">
          ← All jobs
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white ${complete ? "bg-[#0F766E]" : "bg-[#B45309]"}`}>
                {complete ? "Complete" : "Active"}
              </span>
              <span className="text-xs text-[#A8A29E]">{job.project_type}</span>
            </div>
            <h1 className="font-serif text-3xl leading-tight text-[#1C1917]">{job.title}</h1>
            <p className="mt-1 text-sm text-[#57534E]">{job.client_name}{job.address ? ` · ${job.address}` : ""}</p>
          </div>
        </div>

        {/* Pipeline */}
        <div className="mb-6 rounded-2xl border border-[#E7DFD3] bg-white p-5 sm:p-6">
          <h2 className="mb-5 font-serif text-xl text-[#1C1917]">Project stage</h2>
          <StageTimeline jobId={job.id} initialStage={job.stage} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            <Card title="Photos — before, progress & after">
              <JobPhotos photos={job.photos ?? []} title={job.title} />
            </Card>
            <Card title="Materials & shopping list">
              <ShoppingList jobId={job.id} initial={job.materials ?? []} />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="Client & site">
              <div className="divide-y divide-[#F0E8DC]">
                <Row label="Client">{job.client_name}</Row>
                {job.client_phone && <Row label="Phone"><a href={`tel:${job.client_phone}`} className="text-[#B45309] hover:underline">{job.client_phone}</a></Row>}
                {job.client_email && <Row label="Email"><a href={`mailto:${job.client_email}`} className="text-[#B45309] hover:underline">{job.client_email}</a></Row>}
                {job.address && <Row label="Site">{job.address}</Row>}
                <Row label="Started">{fmtDate(job.start_date)}</Row>
                <Row label="Target">{fmtDate(job.target_date)}</Row>
              </div>
            </Card>

            <Card title="Budget & payments">
              <div className="divide-y divide-[#F0E8DC]">
                <Row label="Quoted">{money(job.budget_quoted)}</Row>
                <Row label="Collected"><span className="text-[#0F766E]">{money(collected)}</span></Row>
                <Row label="Balance">{money(balance)}</Row>
              </div>
              <ul className="mt-4 space-y-2">
                {payments.map((p, i) => (
                  <li key={i} className="flex items-center justify-between rounded-lg bg-[#FAF7F2] px-3 py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${p.paid ? "bg-[#0F766E]" : "bg-[#CA8A04]"}`} />
                      <span className="text-[#1C1917]">{p.label}</span>
                    </span>
                    <span className="text-right">
                      <span className="block font-medium tabular-nums text-[#1C1917]">{money(p.amount)}</span>
                      <span className={`text-[11px] ${p.paid ? "text-[#0F766E]" : "text-[#A8A29E]"}`}>{p.paid ? "Paid" : `Due ${fmtDate(p.dueDate)}`}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Documents">
              {(job.documents ?? []).length === 0 ? (
                <p className="text-sm text-[#A8A29E]">None attached.</p>
              ) : (
                <ul className="space-y-2">
                  {(job.documents ?? []).map((d, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-lg border border-[#EFE7DA] px-3 py-2 text-sm">
                      <svg className="h-4 w-4 shrink-0 text-[#B45309]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                        <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" strokeLinejoin="round" /><path d="M14 3v5h5" strokeLinejoin="round" />
                      </svg>
                      <span className="flex-1 text-[#1C1917]">{d.label}</span>
                      <span className="text-[11px] uppercase tracking-wide text-[#A8A29E]">{d.kind}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Activity">
              <ol className="space-y-4">
                {(job.notes ?? []).map((n, i) => (
                  <li key={i} className="relative pl-5">
                    <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-[#B45309]" />
                    {i < (job.notes ?? []).length - 1 && <span className="absolute left-[3px] top-3.5 h-full w-px bg-[#E7DFD3]" />}
                    <p className="text-sm text-[#1C1917]">{n.text}</p>
                    <p className="text-xs text-[#A8A29E]">{fmtDate(n.at)} · {n.author}</p>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
