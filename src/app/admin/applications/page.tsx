import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { adminLogout } from "@/app/actions/admin";
import { updateApplicationStatus } from "@/app/actions/careers";
import { getServiceSupabase } from "@/lib/supabase/server";
import { StatusSelect } from "@/components/admin/StatusSelect";

export const metadata: Metadata = {
  title: "Admin — Applications",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

interface FileMeta {
  path: string;
  name: string;
  bytes: number;
}
interface Application {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  work_authorized: boolean;
  role: string;
  experience_years: number;
  experience_level: string | null;
  current_employer: string | null;
  specialties: string[] | null;
  tools: string[] | null;
  certifications: string[] | null;
  availability: string[] | null;
  start_date: string | null;
  portfolio_url: string | null;
  resume: FileMeta | null;
  cover_letter: FileMeta | null;
  work_photos: FileMeta[] | null;
  why_cruz: string;
  proud_of: string | null;
  salary_expectation: string | null;
  referral_source: string | null;
  referral_name: string | null;
  status: string;
}

const STATUS_COLOR: Record<string, string> = {
  new: "bg-[#B45309] text-white",
  reviewing: "bg-[#CA8A04] text-white",
  interviewing: "bg-[#6D28D9] text-white",
  hired: "bg-[#0F766E] text-white",
  rejected: "bg-[#78716C] text-white",
  archived: "bg-[#A8A29E] text-white",
};

export default async function AdminApplicationsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const supabase = getServiceSupabase();
  if (!supabase) {
    return <main className="p-10 text-[#57534E]">Admin is not configured on this environment.</main>;
  }

  const { data } = await supabase
    .from("job_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const apps = (data ?? []) as Application[];

  // Short-TTL signed URLs for every uploaded file (private bucket).
  const paths = apps.flatMap((a) =>
    [a.resume?.path, a.cover_letter?.path, ...(a.work_photos ?? []).map((p) => p.path)].filter(Boolean) as string[],
  );
  const signed = new Map<string, string>();
  if (paths.length > 0) {
    const { data: urls } = await supabase.storage.from("careers-uploads").createSignedUrls(paths, 300);
    for (const u of urls ?? []) if (u.signedUrl && u.path) signed.set(u.path, u.signedUrl);
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-[#1C1917]">Applications</h1>
            <p className="text-sm text-[#78716C]">{apps.length} most recent</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="rounded-full border border-[#D6CCBC] px-4 py-2 text-sm text-[#57534E] hover:bg-white">
              Leads
            </Link>
            <form action={adminLogout}>
              <button className="rounded-full border border-[#D6CCBC] px-4 py-2 text-sm text-[#57534E] hover:bg-white">Sign out</button>
            </form>
          </div>
        </div>

        {apps.length === 0 ? (
          <p className="rounded-xl border border-[#E7DFD3] bg-white p-8 text-center text-[#78716C]">No applications yet.</p>
        ) : (
          <ul className="space-y-4">
            {apps.map((a) => {
              const photos = (a.work_photos ?? []).filter((p) => signed.has(p.path));
              return (
                <li key={a.id} className="rounded-xl border border-[#E7DFD3] bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_COLOR[a.status] ?? "bg-[#78716C] text-white"}`}>
                          {a.status}
                        </span>
                        <span className="text-xs text-[#A8A29E]">
                          {new Date(a.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                      </div>
                      <p className="mt-1 font-serif text-lg text-[#1C1917]">
                        {a.full_name} · <span className="text-[#57534E]">{a.role}</span>
                      </p>
                      <p className="text-sm text-[#57534E]">
                        {a.experience_years}+ yrs{a.experience_level ? ` · ${a.experience_level}` : ""} · {a.location}
                        {a.work_authorized ? "" : " · ⚠ not work-authorized"}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-[#57534E]">{a.phone}</p>
                      <p className="text-[#57534E]">{a.email}</p>
                      {a.current_employer && <p className="text-xs text-[#A8A29E]">{a.current_employer}</p>}
                    </div>
                  </div>

                  {(a.specialties?.length || a.availability?.length) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(a.specialties ?? []).map((s) => (
                        <span key={s} className="rounded-full bg-[#F0E3D2] px-2.5 py-0.5 text-[11px] text-[#7A5A33]">{s}</span>
                      ))}
                      {(a.availability ?? []).map((s) => (
                        <span key={s} className="rounded-full border border-[#D6CCBA] px-2.5 py-0.5 text-[11px] text-[#57534E]">{s}</span>
                      ))}
                    </div>
                  )}

                  {a.why_cruz && (
                    <p className="mt-3 max-w-prose whitespace-pre-line border-l-2 border-[#E7DFD3] pl-3 text-sm font-light italic text-[#57534E]">
                      “{a.why_cruz}”
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    {a.resume && signed.has(a.resume.path) && (
                      <a href={signed.get(a.resume.path)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#B45309] px-3 py-1 text-xs font-medium text-white hover:bg-[#92400E]">
                        ↓ Resume
                      </a>
                    )}
                    {a.cover_letter && signed.has(a.cover_letter.path) && (
                      <a href={signed.get(a.cover_letter.path)} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#D6CCBC] px-3 py-1 text-xs font-medium text-[#57534E] hover:bg-[#F5EEE2]">
                        ↓ Cover letter
                      </a>
                    )}
                    {a.portfolio_url && (
                      <a href={a.portfolio_url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#D6CCBC] px-3 py-1 text-xs font-medium text-[#57534E] hover:bg-[#F5EEE2]">
                        ↗ Portfolio
                      </a>
                    )}
                    {a.salary_expectation && <span className="text-xs text-[#78716C]">pay: {a.salary_expectation}</span>}
                    {a.referral_source && (
                      <span className="text-xs text-[#78716C]">via {a.referral_source}{a.referral_name ? ` (${a.referral_name})` : ""}</span>
                    )}
                  </div>

                  {photos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {photos.map((p) => (
                        <a key={p.path} href={signed.get(p.path)} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={signed.get(p.path)} alt={p.name} className="h-20 w-28 rounded-md object-cover" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 border-t border-[#F0E8DC] pt-3">
                    <span className="text-xs text-[#78716C]">Status:</span>
                    <StatusSelect id={a.id} current={a.status} action={updateApplicationStatus} label="Application status" statuses={["new", "reviewing", "interviewing", "hired", "rejected", "archived"]} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
