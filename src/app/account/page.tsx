import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getCurrentCustomerId } from "@/lib/customer-auth";
import { getServiceSupabase } from "@/lib/supabase/server";
import { customerLogout } from "@/app/actions/account";
import { BookingForm } from "@/components/account/BookingForm";

export const metadata: Metadata = {
  title: "My projects",
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
  project_type: string;
  tier: string;
  status: string;
  est_low: number | null;
  est_high: number | null;
  est_confidence: string | null;
  photos: Photo[] | null;
}

const money = (n: number | null) =>
  n == null ? "—" : `$${Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  submitted: "Received",
  reviewing: "In review",
  contacted: "We've reached out",
  quoted: "Quoted",
  scheduled: "Consultation scheduled",
  won: "Booked",
  lost: "Closed",
};

export default async function AccountPage() {
  const cid = await getCurrentCustomerId();
  if (!cid) redirect("/login");
  const supabase = getServiceSupabase();
  if (!supabase) {
    return (
      <>
        <Nav />
        <main className="bg-[#FAF7F2] px-6 py-32 text-center text-[#57534E]">Account is unavailable right now.</main>
        <Footer />
      </>
    );
  }

  const { data: customer } = await supabase.from("customers").select("full_name, email").eq("id", cid).maybeSingle();
  const { data: rows } = await supabase
    .from("inquiries")
    .select("id, created_at, project_type, tier, status, est_low, est_high, est_confidence, photos")
    .eq("customer_id", cid)
    .order("created_at", { ascending: false });
  const inquiries = (rows ?? []) as Inquiry[];

  const paths = inquiries.flatMap((i) => (i.photos ?? []).map((p) => p.path));
  const signed = new Map<string, string>();
  if (paths.length > 0) {
    const { data: urls } = await supabase.storage.from("inquiry-photos").createSignedUrls(paths, 300);
    for (const u of urls ?? []) if (u.signedUrl && u.path) signed.set(u.path, u.signedUrl);
  }

  const name = (customer as { full_name?: string } | null)?.full_name || "there";

  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="min-h-screen bg-[#FAF7F2] px-4 py-28 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl text-[#1C1917]">Hi {name.split(" ")[0]}</h1>
              <p className="text-sm text-[#78716C]">Your custom carpentry projects</p>
            </div>
            <form action={customerLogout}>
              <button className="rounded-full border border-[#D6CCBC] px-4 py-2 text-sm text-[#57534E] hover:bg-white">
                Sign out
              </button>
            </form>
          </div>

          {inquiries.length === 0 ? (
            <div className="rounded-xl border border-[#E7DFD3] bg-white p-8 text-center">
              <p className="text-[#57534E]">No projects yet.</p>
              <Link href="/estimate" className="mt-3 inline-block font-medium text-[#B45309] hover:underline">
                Request an estimate →
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {inquiries.map((i) => {
                const photos = (i.photos ?? []).filter((p) => signed.has(p.path));
                return (
                  <li key={i.id} className="rounded-xl border border-[#E7DFD3] bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-serif text-lg text-[#1C1917]">
                          {i.project_type.replace(/_/g, " ")} · <span className="capitalize">{i.tier}</span>
                        </p>
                        <p className="text-xs text-[#A8A29E]">
                          Requested {new Date(i.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#FBF4EC] px-3 py-1 text-xs font-medium text-[#B45309]">
                        {STATUS_LABEL[i.status] ?? i.status}
                      </span>
                    </div>
                    <p className="mt-3 text-[#57534E]">
                      Preliminary range:{" "}
                      <strong className="text-[#1C1917]">
                        {money(i.est_low)} – {money(i.est_high)}
                      </strong>{" "}
                      <span className="text-xs text-[#A8A29E]">({i.est_confidence ?? "?"} confidence · not a quote)</span>
                    </p>
                    {photos.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {photos.map((p) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={p.path} src={signed.get(p.path)} alt="Project photo" className="h-16 w-24 rounded-md object-cover" />
                        ))}
                      </div>
                    )}
                    <div className="mt-5 border-t border-[#F0E8DC] pt-4">
                      <p className="mb-2 text-sm font-medium text-[#1C1917]">Book a free consultation</p>
                      <BookingForm inquiryId={i.id} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
