import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { adminLogout, updateLeadStatus } from "@/app/actions/admin";
import { getServiceSupabase } from "@/lib/supabase/server";
import { StatusSelect } from "@/components/admin/StatusSelect";

export const metadata: Metadata = {
  title: "Admin — Inquiries",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

interface Photo {
  path: string;
  label?: string;
}
interface Inquiry {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  zip: string | null;
  contact_role: string | null;
  project_type: string;
  tier: string;
  finish: string | null;
  timeline: string | null;
  budget_band: string | null;
  priority: string | null;
  est_low: number | null;
  est_point: number | null;
  est_high: number | null;
  est_confidence: string | null;
  lead_score: number | null;
  lead_category: string | null;
  status: string;
  photos: Photo[] | null;
}
interface Lead {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  project_type: string | null;
  message: string | null;
  status: string;
}

const money = (n: number | null) =>
  n == null ? "—" : `$${Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const CAT_COLOR: Record<string, string> = {
  hot: "bg-[#B45309] text-white",
  luxury: "bg-[#6D28D9] text-white",
  warm: "bg-[#CA8A04] text-white",
  budget: "bg-[#0F766E] text-white",
  low_fit: "bg-[#78716C] text-white",
};

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const supabase = getServiceSupabase();
  if (!supabase) {
    return <main className="p-10 text-[#57534E]">Admin is not configured on this environment.</main>;
  }

  const [{ data }, { data: leadData }] = await Promise.all([
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(100),
  ]);
  const inquiries = (data ?? []) as Inquiry[];
  const leads = (leadData ?? []) as Lead[];

  // Mint short-TTL signed URLs for every photo (private bucket).
  const paths = inquiries.flatMap((i) => (i.photos ?? []).map((p) => p.path));
  const signed = new Map<string, string>();
  if (paths.length > 0) {
    const { data: urls } = await supabase.storage.from("inquiry-photos").createSignedUrls(paths, 300);
    for (const u of urls ?? []) {
      if (u.signedUrl && u.path) signed.set(u.path, u.signedUrl);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-[#1C1917]">Leads</h1>
            <p className="text-sm text-[#78716C]">
              <a href="#inquiries" className="hover:text-[#B45309] hover:underline">
                {inquiries.length} estimate{inquiries.length === 1 ? "" : "s"}
              </a>{" "}
              ·{" "}
              <a href="#quick-requests" className="hover:text-[#B45309] hover:underline">
                {leads.length} quick request{leads.length === 1 ? "" : "s"}
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/applications"
              className="rounded-full border border-[#D6CCBC] px-4 py-2 text-sm text-[#57534E] hover:bg-white"
            >
              Applications
            </Link>
            <Link
              href="/admin/rates"
              className="rounded-full border border-[#D6CCBC] px-4 py-2 text-sm text-[#57534E] hover:bg-white"
            >
              Rate editor
            </Link>
            <form action={adminLogout}>
              <button className="rounded-full border border-[#D6CCBC] px-4 py-2 text-sm text-[#57534E] hover:bg-white">
                Sign out
              </button>
            </form>
          </div>
        </div>

        <h2 id="inquiries" className="mb-3 scroll-mt-6 font-serif text-xl text-[#1C1917]">
          Estimates <span className="text-sm font-sans font-normal text-[#A8A29E]">(guided wizard)</span>
        </h2>

        {inquiries.length === 0 ? (
          <p className="rounded-xl border border-[#E7DFD3] bg-white p-8 text-center text-[#78716C]">
            No inquiries yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {inquiries.map((i) => {
              const photos = (i.photos ?? []).filter((p) => signed.has(p.path));
              return (
                <li key={i.id} className="rounded-xl border border-[#E7DFD3] bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {i.lead_category && (
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CAT_COLOR[i.lead_category] ?? "bg-[#78716C] text-white"}`}>
                            {i.lead_category}
                          </span>
                        )}
                        <span className="text-xs font-medium text-[#78716C]">score {i.lead_score ?? "—"}</span>
                        <span className="text-xs text-[#A8A29E]">
                          {new Date(i.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                      </div>
                      <p className="mt-1 font-serif text-lg text-[#1C1917]">
                        {i.project_type.replace(/_/g, " ")} · <span className="capitalize">{i.tier}</span>
                      </p>
                      <p className="text-sm text-[#57534E]">
                        {money(i.est_low)} – {money(i.est_high)}{" "}
                        <span className="text-[#A8A29E]">({i.est_confidence ?? "?"} confidence)</span>
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium text-[#1C1917]">
                        {i.first_name} {i.last_name}
                      </p>
                      <p className="text-[#57534E]">{i.phone}</p>
                      {i.email && <p className="text-[#57534E]">{i.email}</p>}
                      <p className="text-xs text-[#A8A29E]">
                        {[i.zip, i.contact_role].filter(Boolean).join(" · ") || " "}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#78716C]">
                    {i.budget_band && <span>budget: {i.budget_band.replace(/_/g, " ")}</span>}
                    {i.timeline && <span>timeline: {i.timeline.replace(/_/g, " ")}</span>}
                    {i.priority && <span>priority: {i.priority.replace(/_/g, " ")}</span>}
                    {i.finish && <span>finish: {i.finish.replace(/_/g, " ")}</span>}
                  </div>

                  {photos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {photos.map((p) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={p.path}
                          src={signed.get(p.path)}
                          alt={p.label ?? "Project photo"}
                          className="h-20 w-28 rounded-md object-cover"
                        />
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 border-t border-[#F0E8DC] pt-3">
                    <span className="text-xs text-[#78716C]">Status:</span>
                    <StatusSelect id={i.id} current={i.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <h2 id="quick-requests" className="mb-3 mt-12 scroll-mt-6 font-serif text-xl text-[#1C1917]">
          Quick requests <span className="text-sm font-sans font-normal text-[#A8A29E]">(short contact form)</span>
        </h2>
        {leads.length === 0 ? (
          <p className="rounded-xl border border-[#E7DFD3] bg-white p-8 text-center text-[#78716C]">
            No quick requests yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {leads.map((l) => (
              <li key={l.id} className="rounded-xl border border-[#E7DFD3] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs text-[#A8A29E]">
                      {new Date(l.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                    <p className="mt-1 font-serif text-lg text-[#1C1917]">
                      {l.project_type || "General inquiry"}
                    </p>
                    {l.message && (
                      <p className="mt-1 max-w-prose whitespace-pre-line text-sm font-light text-[#57534E]">
                        {l.message}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium text-[#1C1917]">{l.name}</p>
                    <p className="text-[#57534E]">{l.phone}</p>
                    {l.email && <p className="text-[#57534E]">{l.email}</p>}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-[#F0E8DC] pt-3">
                  <span className="text-xs text-[#78716C]">Status:</span>
                  <StatusSelect id={l.id} current={l.status} action={updateLeadStatus} label="Lead status" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
