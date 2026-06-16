import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase/server";
import { SEED_SNAPSHOT } from "@/lib/pricing/rates";
import { RateEditor } from "@/components/admin/RateEditor";

export const metadata: Metadata = {
  title: "Admin — Rates",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminRatesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const supabase = getServiceSupabase();
  let initial = "{}";
  if (supabase) {
    const { data } = await supabase
      .from("pricing_config")
      .select("overrides")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    const overrides = (data as { overrides?: unknown } | null)?.overrides;
    if (overrides && typeof overrides === "object") initial = JSON.stringify(overrides, null, 2);
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-3xl text-[#1C1917]">Rate editor</h1>
          <Link href="/admin" className="text-sm text-[#B45309] hover:underline">
            ← Inquiries
          </Link>
        </div>
        <p className="mb-6 text-sm font-light text-[#57534E]">
          Override material &amp; labor rates without a deploy. Live estimates still apply the live
          lumber-market factor on top of these. Example:{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs">
            {'{"labor":{"shop":{"premium":108}},"materials":{"signature":{"solid":{"unitCost":17}}}}'}
          </code>
        </p>
        <RateEditor initial={initial} seedJson={JSON.stringify(SEED_SNAPSHOT, null, 2)} />
      </div>
    </main>
  );
}
