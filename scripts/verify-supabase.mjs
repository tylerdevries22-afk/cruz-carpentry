// Quick connectivity + schema check for the Cruz Carpentry Supabase wiring.
// Run with:  node --env-file=.env scripts/verify-supabase.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertPresent(name, value) {
  if (!value || value.startsWith("YOUR-")) {
    console.error(`✗ ${name} is missing or still a placeholder.`);
    process.exitCode = 1;
    return false;
  }
  return true;
}

const haveAll =
  assertPresent("NEXT_PUBLIC_SUPABASE_URL", url) &
  assertPresent("NEXT_PUBLIC_SUPABASE_ANON_KEY", anon) &
  assertPresent("SUPABASE_SERVICE_ROLE_KEY", service);

if (!haveAll) process.exit(1);

const admin = createClient(url, service, { auth: { persistSession: false } });
const publicClient = createClient(url, anon, { auth: { persistSession: false } });

async function check(label, fn) {
  try {
    const result = await fn();
    console.log(`✓ ${label}: ${result}`);
  } catch (err) {
    console.log(`✗ ${label}: ${err.message ?? err}`);
  }
}

console.log(`Project: ${url}\n`);

await check("service role → leads table", async () => {
  const { data, error } = await admin.from("leads").select("id").limit(1);
  if (error) throw error;
  return `exists (${data.length} row(s) visible)`;
});

await check("RLS guard → anon cannot read leads", async () => {
  const { data, error } = await publicClient.from("leads").select("id").limit(1);
  // We WANT this to be blocked: either an RLS error or zero rows returned.
  if (error) return `blocked (${error.message})`;
  if (data.length === 0) return "blocked (no rows visible to anon)";
  throw new Error(`anon could read ${data.length} lead row(s) — RLS misconfigured!`);
});

// Optional: exercise the form's write path against the real DB, then clean up.
// Run with:  node --env-file=.env scripts/verify-supabase.mjs --write-test
if (process.argv.includes("--write-test")) {
  await check("form write path → insert, read back, anon-blocked, cleanup", async () => {
    const testLead = {
      name: "TEST — automated verification",
      phone: "720-000-0000",
      email: "verify@example.com",
      project_type: "Built-In Shelving",
      message: "End-to-end test row. Safe to delete.",
      source: "verification_script",
    };
    const { data: inserted, error: insErr } = await admin
      .from("leads")
      .insert(testLead)
      .select("id")
      .single();
    if (insErr) throw insErr;

    const { data: readBack, error: rbErr } = await admin
      .from("leads")
      .select("name")
      .eq("id", inserted.id)
      .single();
    if (rbErr) throw rbErr;

    const { data: anonRows } = await publicClient
      .from("leads")
      .select("id")
      .eq("id", inserted.id);
    const anonBlocked = !anonRows || anonRows.length === 0;

    const { error: delErr } = await admin.from("leads").delete().eq("id", inserted.id);
    if (delErr) throw delErr;

    if (!anonBlocked) throw new Error("anon could read the inserted lead — RLS misconfigured!");
    return `inserted "${readBack.name}", anon blocked ✓, row deleted ✓`;
  });
}
