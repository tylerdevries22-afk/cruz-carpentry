import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { JobForm } from "@/components/admin/jobs/JobForm";
import { createJob } from "@/app/actions/jobs";

export const metadata: Metadata = { title: "Admin — New job", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <AdminShell>
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/jobs" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#B45309] hover:underline">← All jobs</Link>
        <h1 className="mb-1 font-serif text-3xl text-[#1C1917]">New job</h1>
        <p className="mb-6 text-sm text-[#57534E]">Create the project, then add materials, photos & notes on its page.</p>
        <JobForm action={createJob} submitLabel="Create job" />
      </div>
    </AdminShell>
  );
}
