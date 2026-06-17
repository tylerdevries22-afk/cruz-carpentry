/**
 * Seed the admin Jobs demo. Idempotent: inserts the sample jobs only if the
 * `jobs` table is empty. Run once against the live DB:
 *   node --env-file=.env scripts/seed-jobs.mjs
 * Images reference the public `what-we-build` bucket (all confirmed to exist).
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const IMG = "https://nkarcozbgtgtcqfhytrx.supabase.co/storage/v1/object/public/what-we-build";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const mat = (name, category, qty, unit, unitCost, supplier, purchased) => ({
  id: randomUUID(), name, category, qty, unit, unitCost, supplier, purchased,
});
const photo = (url, kind, caption) => ({ id: randomUUID(), url, kind, caption });

const JOBS = [
  {
    title: "Walnut Kitchen & Island — Whitmore Residence",
    client_name: "Sarah & Mark Whitmore",
    client_email: "sarah.whitmore@example.com",
    client_phone: "(303) 555-0148",
    address: "Wonderland Hill, Boulder, CO",
    project_type: "Custom Cabinetry",
    stage: "build",
    status: "active",
    start_date: "2026-04-12",
    target_date: "2026-07-10",
    budget_quoted: 32500,
    budget_actual: 21000,
    deposit: 11000,
    cover_image: `${IMG}/custom-cabinetry/ai-generated/custom-cabinetry-a.webp`,
    materials: [
      mat('3/4" birch plywood', "Sheet goods", 6, "sheet", 118, "Austin Hardwoods", true),
      mat("White oak (plain-sawn)", "Lumber", 85, "board ft", 8.5, "Sears Trostel", true),
      mat("Soft-close undermount slides", "Hardware", 14, "pair", 28, "Richelieu", true),
      mat("Maple drawer-box stock", "Lumber", 9, "set", 35, "Austin Hardwoods", true),
      mat("Concealed soft-close hinges", "Hardware", 38, "each", 7.5, "Blum", false),
      mat("Brushed-brass cabinet pulls", "Hardware", 22, "each", 14, "Top Knobs", false),
      mat("Rubio Monocoat hardwax oil", "Finish", 2, "liter", 95, "Rubio Monocoat", false),
    ],
    photos: [
      photo(`${IMG}/general/real-photos/wood_raw_g2.jpg`, "before", "Existing kitchen stripped to studs"),
      photo(`${IMG}/general/real-photos/wood_assemble_g2.jpg`, "progress", "Carcasses assembled, drawer boxes dovetailed"),
      photo(`${IMG}/custom-cabinetry/ai-generated/01.webp`, "after", "Finished walnut island & perimeter"),
    ],
    payments: [
      { label: "Deposit (35%)", amount: 11000, dueDate: "2026-04-12", paid: true },
      { label: "Cabinet-box draw", amount: 10000, dueDate: "2026-05-15", paid: true },
      { label: "Final — due on install", amount: 11500, dueDate: "2026-07-10", paid: false },
    ],
    documents: [
      { label: "Estimate #1042", kind: "estimate" },
      { label: "Signed contract", kind: "contract" },
      { label: "Shop drawings v2", kind: "drawing" },
    ],
    notes: [
      { at: "2026-06-05", text: "Doors & fronts in the finishing room — first oil coat down.", author: "Cruz" },
      { at: "2026-05-18", text: "Carcasses assembled; dovetailed drawer boxes fit-checked.", author: "Cruz" },
      { at: "2026-05-02", text: "Plywood + white oak delivered to the shop.", author: "Cruz" },
      { at: "2026-04-20", text: "Design approved — painted perimeter, white-oak island.", author: "Cruz" },
      { at: "2026-04-12", text: "On-site measure complete; confirmed 96\" island.", author: "Cruz" },
    ],
  },
  {
    title: "Walk-In Closet System — Delgado Residence",
    client_name: "The Delgado Family",
    client_email: "j.delgado@example.com",
    client_phone: "(720) 555-0193",
    address: "Aspen Court, Castle Rock, CO",
    project_type: "Custom Closets",
    stage: "install",
    status: "active",
    start_date: "2026-03-20",
    target_date: "2026-06-22",
    budget_quoted: 18900,
    budget_actual: 17400,
    deposit: 6600,
    cover_image: `${IMG}/custom-closets/ai-generated/custom-closets-a.webp`,
    materials: [
      mat('3/4" maple melamine', "Sheet goods", 9, "sheet", 96, "Austin Hardwoods", true),
      mat("Walnut veneer ply (island top)", "Sheet goods", 1, "sheet", 215, "B&B Rare Woods", true),
      mat("LED strip + drivers", "Hardware", 48, "ft", 3.2, "Diode LED", true),
      mat("Valet rods & rails", "Hardware", 6, "each", 22, "Richelieu", true),
      mat("Glass-front drawer fronts", "Hardware", 8, "each", 41, "Local glazier", false),
    ],
    photos: [
      photo(`${IMG}/general/real-photos/wood_measure_g2.jpg`, "before", "Empty reach-in, before conversion"),
      photo(`${IMG}/general/real-photos/wood_cut_g2.jpg`, "progress", "Panels cut & edge-banded"),
      photo(`${IMG}/custom-closets/ai-generated/custom-closets-b.webp`, "after", "Walk-in with island & lighting"),
    ],
    payments: [
      { label: "Deposit (35%)", amount: 6600, dueDate: "2026-03-20", paid: true },
      { label: "Progress draw", amount: 6300, dueDate: "2026-05-10", paid: true },
      { label: "Final — due on install", amount: 6000, dueDate: "2026-06-22", paid: false },
    ],
    documents: [
      { label: "Estimate #1017", kind: "estimate" },
      { label: "Signed contract", kind: "contract" },
      { label: "Elevation drawings", kind: "drawing" },
    ],
    notes: [
      { at: "2026-06-14", text: "Cabinets set; scribing to walls and hanging doors this week.", author: "Cruz" },
      { at: "2026-05-28", text: "Island built; walnut top finished.", author: "Cruz" },
      { at: "2026-04-30", text: "Melamine cut list run; edge-banding done.", author: "Cruz" },
      { at: "2026-03-20", text: "Measure + design kickoff.", author: "Cruz" },
    ],
  },
  {
    title: "Fireplace Mantel & Flanking Built-Ins — Highland Park",
    client_name: "Priya Anand",
    client_email: "priya.anand@example.com",
    client_phone: "(303) 555-0271",
    address: "Highland, Denver, CO",
    project_type: "Fireplace Mantel",
    stage: "design",
    status: "active",
    start_date: "2026-06-02",
    target_date: "2026-08-15",
    budget_quoted: 14200,
    budget_actual: 0,
    deposit: 5000,
    cover_image: `${IMG}/fireplace-mantels/ai-generated/fireplace-mantels-a.webp`,
    materials: [
      mat("Reclaimed Douglas fir beam", "Lumber", 1, "beam", 480, "Reclaimed Denver", false),
      mat('3/4" paint-grade ply', "Sheet goods", 4, "sheet", 62, "Home Depot", false),
      mat("Poplar trim (milled)", "Lumber", 60, "linear ft", 3.1, "Austin Hardwoods", false),
    ],
    photos: [
      photo(`${IMG}/general/real-photos/wood_sand_g2.jpg`, "before", "Existing drywall surround"),
      photo(`${IMG}/general/real-photos/wood_finish_g2.jpg`, "progress", "Beam selection & layout"),
      photo(`${IMG}/fireplace-mantels/ai-generated/fireplace-mantels-b.webp`, "after", "Concept: floating mantel + built-ins"),
    ],
    payments: [
      { label: "Design retainer", amount: 5000, dueDate: "2026-06-02", paid: true },
      { label: "Materials & build", amount: 5600, dueDate: "2026-07-01", paid: false },
      { label: "Final — due on install", amount: 3600, dueDate: "2026-08-15", paid: false },
    ],
    documents: [
      { label: "Estimate #1061", kind: "estimate" },
      { label: "Concept renderings", kind: "drawing" },
    ],
    notes: [
      { at: "2026-06-10", text: "Reviewing 2 mantel profiles with client; awaiting stone-veneer pick.", author: "Cruz" },
      { at: "2026-06-02", text: "On-site consult; measured opening + hearth.", author: "Cruz" },
    ],
  },
  {
    title: "Home Office Built-Ins — Niwot Farmhouse",
    client_name: "Tom & Beth Carrick",
    client_email: "carrick.home@example.com",
    client_phone: "(720) 555-0066",
    address: "Niwot, CO",
    project_type: "Desks & Libraries",
    stage: "done",
    status: "complete",
    start_date: "2026-01-15",
    target_date: "2026-03-28",
    budget_quoted: 16750,
    budget_actual: 16750,
    deposit: 5800,
    cover_image: `${IMG}/built-in-shelving/ai-generated/02.webp`,
    materials: [
      mat('3/4" birch plywood', "Sheet goods", 7, "sheet", 118, "Austin Hardwoods", true),
      mat("Red oak (face frames)", "Lumber", 40, "board ft", 6, "Austin Hardwoods", true),
      mat("Adjustable shelf standards", "Hardware", 12, "pair", 9, "Richelieu", true),
      mat("Library ladder + rail", "Hardware", 1, "set", 620, "Custom Service Hardware", true),
    ],
    photos: [
      photo(`${IMG}/general/real-photos/wood_raw_g2.jpg`, "before", "Empty spare bedroom"),
      photo(`${IMG}/general/real-photos/wood_assemble_g2.jpg`, "progress", "Cases built & primed"),
      photo(`${IMG}/built-in-shelving/ai-generated/built-in-shelving-a.webp`, "after", "Floor-to-ceiling office built-ins"),
    ],
    payments: [
      { label: "Deposit (35%)", amount: 5800, dueDate: "2026-01-15", paid: true },
      { label: "Progress draw", amount: 5500, dueDate: "2026-02-20", paid: true },
      { label: "Final balance", amount: 5450, dueDate: "2026-03-28", paid: true },
    ],
    documents: [
      { label: "Estimate #0988", kind: "estimate" },
      { label: "Signed contract", kind: "contract" },
      { label: "Final invoice", kind: "invoice" },
    ],
    notes: [
      { at: "2026-03-28", text: "Final walkthrough — signed off. Punch list clear.", author: "Cruz" },
      { at: "2026-03-12", text: "Installed; ladder rail mounted and tuned.", author: "Cruz" },
      { at: "2026-02-20", text: "Cases finished in the shop.", author: "Cruz" },
      { at: "2026-01-15", text: "Kickoff measure + design.", author: "Cruz" },
    ],
  },
];

const { count } = await sb.from("jobs").select("*", { count: "exact", head: true });
if ((count ?? 0) > 0) {
  console.log(`jobs table already has ${count} row(s) — skipping seed.`);
  process.exit(0);
}
const { data, error } = await sb.from("jobs").insert(JOBS).select("id, title, stage, status");
if (error) {
  console.error("seed failed:", error.message);
  process.exit(1);
}
console.log(`seeded ${data.length} jobs:`);
for (const j of data) console.log(`  • ${j.title} [${j.stage}/${j.status}]`);
