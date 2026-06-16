import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin sign-in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-6">
      <div className="w-full max-w-sm rounded-2xl border border-[#E7DFD3] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">Cruz Carpentry</p>
        <h1 className="mt-2 font-serif text-2xl text-[#1C1917]">Admin sign-in</h1>
        <p className="mb-6 mt-2 text-sm font-light text-[#57534E]">Internal lead dashboard.</p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
