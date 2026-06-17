import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { ContentWorkspace } from "@/components/admin/content/ContentWorkspace";
import { loadContent } from "@/lib/content/source";
import { SEED_COPY, type CopyTree } from "@/lib/content/copy";
import { SERVICES } from "@/lib/services";
import { toServiceRow, type ServiceSeed } from "@/lib/content/service-edit";

export const metadata: Metadata = {
  title: "Admin — Site content",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  // Effective content = seed deep-merged with the active override (force-fresh
  // so the editor always reflects the live state, even while public pages cache).
  const { copy, services, source } = await loadContent({ force: true });

  // Editable rows in display order (by num); the Cards tab reorders these.
  const rows = [...services]
    .sort((a, b) => a.num.localeCompare(b.num))
    .map((s) => toServiceRow(s));

  // Seed (in-code) values to diff against, so only real changes are stored.
  const seedServices: ServiceSeed = Object.fromEntries(
    SERVICES.map((s) => [s.slug, toServiceRow(s)]),
  );

  return (
    <AdminShell>
      <ContentWorkspace
        services={rows}
        seedServices={seedServices}
        copy={copy}
        seedCopy={SEED_COPY as unknown as CopyTree}
        source={source}
      />
    </AdminShell>
  );
}
