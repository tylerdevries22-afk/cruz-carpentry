import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getCurrentCustomerId } from "@/lib/customer-auth";
import { CustomerLoginForm } from "@/components/account/CustomerLoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to track your Cruz Carpentry project, estimate, and status.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getCurrentCustomerId()) redirect("/account");
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="flex min-h-[70vh] items-center justify-center bg-[#FAF7F2] px-6 py-32">
        <div className="w-full max-w-sm rounded-2xl border border-[#E7DFD3] bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B45309]">Cruz Carpentry</p>
          <h1 className="mt-2 font-serif text-2xl text-[#1C1917]">Track your project</h1>
          <p className="mb-6 mt-2 text-sm font-light text-[#57534E]">
            Sign in to see your estimate, status, and photos.
          </p>
          <CustomerLoginForm />
          <p className="mt-6 text-center text-sm text-[#78716C]">
            No account yet?{" "}
            <Link href="/estimate" className="font-medium text-[#B45309] hover:underline">
              Request an estimate
            </Link>{" "}
            and create one.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
