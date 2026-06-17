import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { JobForm } from "@/components/admin/jobs/JobForm";
import { DeleteJobButton } from "@/components/admin/jobs/DeleteJobButton";
import { updateJob } from "@/app/actions/jobs";
import type { Job } from "@/lib/jobs";

export const metadata: Metadata = { title: "Admin — Edit job", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const supabase = getServiceSupabase();
  if (!supabase) return <main className="p-10 text-[#57534E]">Admin is not configured.</main>;
  const { data } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const job = data as Job;

  return (
    <AdminShell>
      <div className="mx-auto max-w-2xl">
        <Link href={`/admin/jobs/${id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#B45309] hover:underline">← Back to job</Link>
        <h1 className="mb-6 font-serif text-3xl text-[#1C1917]">Edit job</h1>
        <JobForm action={updateJob.bind(null, id)} job={job} submitLabel="Save changes" />
        <div className="mt-10 border-t border-[#E7DFD3] pt-6">
          <p className="mb-3 text-sm font-medium text-[#1C1917]">Danger zone</p>
          <DeleteJobButton id={id} title={job.title} />
        </div>
      </div>
    </AdminShell>
  );
}
