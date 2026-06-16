# Cruz Carpentry — Custom Project Inquiry & Dynamic Estimate System
### Production-ready specification for designer, developer, estimator, and owner

**Version:** 1.0 · **Prepared:** 2026-06-16 · **Region:** Colorado Front Range / Denver metro
**Stack target:** Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase (Postgres + Storage) · Vercel

---

## How to read this document
This spec is organized so each role can jump to what they need:
- **Owner/estimator** → *Research Findings* (materials, labor), *Estimation Models*, *Pricing Calculator*, *Lead Scoring & Admin*.
- **Designer** → *UX Best Practices & CTA*, *Form Architecture*, *Customer Journey*.
- **Developer** → *Form Architecture* (fields + conditional logic), *Pricing Calculator* (formulas), *Technical Implementation & Schema*, *Analytics*.

All pricing in this document is an **editable starting template**, not hardcoded truth. Material and labor rates are 2025 Front Range estimates to be verified against live supplier/wage data and stored in admin-editable, version-stamped rate tables (see *Pricing Calculator* and *Schema*).

---

## 1. Executive Summary

**Goal.** Replace a basic contact form with an *intelligent project-intake experience* that (a) helps the customer clarify their vision, (b) qualifies and scores the lead, (c) produces a defensible preliminary price **range**, and (d) routes the lead to the right follow-up — across three tiers: **Essential**, **Premium** (recommended default), and **Signature**.

**Shape.** A **10-step, mobile-first wizard** (not one long form) with large tappable image cards, conditional branching by project type/tier, autosave + resume, guided photo upload, a measurement module that computes square feet / linear feet / sheet counts, and an interactive **Price · Quality · Time** priority chooser. It ends with a clean summary, a **preliminary estimate range with confidence band**, and a consultation CTA.

**Pricing engine.** A versioned, server-side TypeScript module driven by **admin-editable rate tables** (materials, labor) and **multiplier rule sets** (tier, project-type, complexity, finish, access, demolition, install difficulty, design, rush, risk buffers, margins). Every estimate is stamped with the exact rules + inputs used, so any quote reproduces forever.

**Operations.** A 0–100 **lead score** sorts inquiries into Hot / Warm / Luxury / Budget / Low-fit with response-time SLAs; an **admin dashboard** shows score, estimated value, measurements, photos, and a recommended next action; **email/SMS automation** handles confirmation, missing-photo nudges, consultation invites, tier-specific nurture, and owner alerts.

**Why it converts.** Lowest-commitment question first, one decision per screen, "I'm not sure" escape hatches everywhere, the **Premium tier anchored as recommended**, trust microcopy beside each decision, and a value-led primary CTA. Target: qualify better leads, raise average project value, and reduce the ~70% abandonment typical of long quote forms.

---

## 2. Recommended CTA & Naming Structure

**Primary CTA (button): "Request Your Free Estimate"** — with the section heading **"Request a Custom Carpentry Estimate."**

Rationale (from competitive research): **"Request"** signals a consultative, white-glove path (a person responds) and matches premium intent, whereas **"Submit"** reads transactional/bureaucratic. **"Free"** carries the value hook. Your two stated favorites both work — *Request Custom Carpentry Estimate* is the stronger of the pair; *Submit Custom Project Inquiry* is the runner-up but loses to "Request" on warmth and to "Free" on value.

- **Secondary path (quiet text link, never a competing button):** *"Just have a quick question? Contact us →"* — protects the primary conversion while capturing top-of-funnel curiosity.
- **Hero variant to A/B test separately:** *"Start My Custom Build"* (high energy, but over-promises commitment at top-of-funnel, so keep it for the homepage hero, not the form's primary action).
- **Welcome-step intent options** (per your structure): *Request a Custom Carpentry Estimate · Submit a Project Inquiry · Ask a General Question · Existing Client / Project Update*.
- **A/B test queue** (single-variable, identical destination): "Request Your Free Estimate" (baseline) · "Get My Free Estimate" · "Request a Free Consultation" · "Start My Estimate" · "Price My Project" · "Submit Custom Project Inquiry".

---

## 3. Package / Tier Strategy (customer-facing)

| | **Essential** | **Premium** *(recommended default — pre-selected & badged)* | **Signature** |
|---|---|---|---|
| Best for | Functional, budget-conscious | Best balance of design, quality, value | Luxury focal points, white-glove |
| Materials | MDF, paint-grade ply, pine, poplar | Birch/maple cabinet ply, soft/hard maple, oak | White oak, walnut, cherry, rift/QSWO, veneer |
| Hardware | Standard side-mount, econ hinges | Blum undermount soft-close | Blum Tandem + lifts/pull-outs, premium pulls |
| Finish | Primed/brushed enamel or single-coat stain | Sprayed enamel or stain + 2-coat poly | Multi-step stain/glaze + conversion varnish (booth) |
| Customization | Lower, standard sizing | Custom sizing, cleaner detailing | Advanced detailing, hand-fit, precision install |
| Timeline | Longer/flexible | Standard | Priority scheduling |
| Material multiplier (early budgeting) | **×1.0** | **×1.5** | **×2.4** |
| Blended billable labor | $85–95/hr | $105–120/hr | $130–165/hr |
| Margin target | ~13% | ~20% | ~25% |

**Anchoring rule:** Premium is visually pre-selected and badged "Most popular / Recommended." Essential reassures the price-conscious without feeling cheap; Signature is framed around outcome ("a true focal point"), not just cost.

---

## 4. Price · Quality · Time Triangle (implementation)

**Customer-facing copy:** *"Every custom project balances three things — price, quality, and time. You can optimize for two; the third usually adjusts. Pick what matters most and we'll tailor the plan."*

Interactive element: four large selectable cards. Each maps to concrete estimator behavior (full mapping in *Estimation Models §2*):

| Choice | Customer phrasing | What the estimator does |
|---|---|---|
| **Balanced** *(recommended, pre-highlighted)* | "Balanced price, quality & timeline" | Premium tier defaults; standard schedule; no rush fee |
| **Best Price + High Quality** | "I'm flexible on timeline" | Keep quality; extend/flex schedule; schedule into shop gaps; possible small flexibility discount |
| **Fast + High Quality** | "I understand this may need premium/rush pricing" | Keep quality + speed; apply rush multiplier (1.15–1.35); prioritize scheduling |
| **Best Price + Fast** | "I understand scope/materials may be simplified" | Hold price + speed; nudge toward Essential materials/finish, reduced customization |

---

---

## Contents
1–4. Executive Summary · Recommended CTA · Tier Strategy · Price·Quality·Time *(above)*
- **Part A — Canonical Reference (Single Source of Truth)** ← read first
- Part 5 — UX Best Practices, CTA Strategy & Conversion
- Part 6 — Form Architecture, Full Field List & Conditional Logic
- Part 7 — Estimation Models, Triple Constraint & Confidence
- Part 8 — Materials Rate Table (Front Range, 2025 est.)
- Part 9 — Labor & Shop-Economics Model
- Part 10 — Pricing Calculator (formulas, multipliers, worked examples)
- Part 11 — Lead Scoring, Admin Dashboard & CRM/Email Automation
- Part 12 — Technical Implementation, Database Schema & Analytics
- Part 13 — Risks, Owner Questions & Build Checklist
- Audit Reconciliation Log — 64 findings → resolution

---

All existing tasks are complete and unrelated to this research deliverable, so no task tracking is needed here. I have enough grounded data to synthesize the spec section now.

---

# Part A — Canonical Reference (Single Source of Truth)

> **Authority rule:** this section is canonical. Where any later section's option list, enum, or numeric value disagrees with Part A, **Part A wins** and the later value is to be normalized to it. The *Audit Reconciliation Log* at the end of the document records every conflict that was resolved here. Machine slugs are given in `code`; customer-facing labels in quotes. The live marketing site's existing `estimate-schema.ts` `PROJECT_TYPES` (19 service buckets) is a **separate** existing list and is not the intake form's `project_type` enum below.

## A1. Master Enumerations (complete option lists)

**Wizard intent — `intent` (4, single-select, Step 1):** `request_estimate` "Request a Custom Carpentry Estimate" · `submit_inquiry` "Submit a Project Inquiry" · `general_question` "Ask a General Question" · `existing_client` "Existing Client / Project Update". *Routing:* `general_question` → short contact form; `existing_client` → name + existing-project lookup → owner-direct; the other two → full wizard.

**Room / location — `room` (15, single- or multi-select, Step 2/3):** `kitchen` · `living_room` · `bedroom` · `closet` · `mudroom_entry` · `bathroom` · `basement` · `office` · `garage` · `stairs_railing` · `fireplace_area` · `laundry_room` · `outdoor_deck_patio` · `commercial_space` · `other`. *(Selecting `commercial_space` pre-checks the `condo_hoa_commercial_rules` existing-condition.)*

**Project type — `project_type` (18: the 16 required + 2 extras, single-select, Step 2):** `built_in_shelving` "Built-in shelving" · `entertainment_center` "Entertainment center" · `custom_cabinets` "Custom cabinets" · `vanity` "Vanity" · `closet_system` "Closet system" · `mudroom_bench_lockers` "Mudroom bench / lockers" · `fireplace_surround` "Fireplace surround" · `wainscoting` "Wainscoting" · `accent_wall` "Accent wall" · `trim_baseboards_crown` "Trim / baseboards / crown moulding" · `floating_shelves` "Floating shelves" · `custom_furniture` "Custom furniture" · `casing` "Door or window casing" · `repairs` "Repairs / modifications" · `full_room` "Full-room custom carpentry" · `other` "Other" · `install_only` "Installation only (client-supplied)" · `not_sure` "I'm not sure yet". Every `project_type` MUST map to a Part 10 calculator and a Part 10 §1.2 `project_type_multiplier`.

**Project goal / motivation — `project_goal[]` (10, multi-select, Step 3):** `add_storage` · `improve_appearance` · `increase_home_value` · `replace_damaged_old` · `luxury_focal_point` · `prepare_for_sale` · `improve_organization` · `match_existing_style` · `solve_functional_problem` · `other`. *(`increase_home_value`, `prepare_for_sale`, `luxury_focal_point` feed lead scoring.)* This is distinct from the *project nature* descriptor; capture motivations here.

**Material by tier — `material` (Step 8; show set filtered by chosen tier) + recommend escape hatch:**
- Essential: `mdf` · `paint_grade_plywood` · `pine` · `poplar` (+ standard trim, standard hardware).
- Premium: `birch_plywood` · `maple_plywood` · `poplar_face_frames` · `red_oak` (+ soft-close hardware, better finishes).
- Signature: `white_oak` · `walnut` · `cherry` · `rift_quarter_sawn` · `veneer_panels` (+ premium hardware, custom stain matching, luxury finishes).
- Always available: `recommend_for_me` "I'm not sure — recommend a material for me" (first-class selectable value; on select, recommend by `project_type` + `tier` + `budget_band`).

**Hardware grade — `hardware` (Step 8):** `standard` (side-mount slides, econ hinges) · `soft_close` (Blum undermount soft-close) · `premium` (Blum Tandem + lifts/pull-outs + premium pulls).

**Finish — `finish` (12, single-select, Step 8):** `raw_unfinished` · `primed` · `painted` · `stained` · `clear_coated` · `color_matched` · `stain_matched` · `distressed_rustic` · `high_gloss` · `matte` · `satin` · `luxury_furniture_grade`. *(Sheen — matte/satin/high-gloss — may also be a sub-field of painted/clear-coated; keep all 12 as selectable.)*

**Design style — `design_style` (12, single-select, Step 8):** `modern` · `minimal` · `traditional` · `transitional` · `rustic` · `farmhouse` · `craftsman` · `scandinavian` · `industrial` · `luxury_architectural` · `match_existing` · `not_sure`. *(Separate from door/panel construction style `door_style` which lives in type-specific blocks.)*

**Budget band — `budget_band` (7, single-select, Step 9) — CANONICAL:**
| slug | customer label | lead-score pts |
|---|---|---|
| `under_1k` | "Under $1,000" | 2 |
| `1k_2_5k` | "$1,000–$2,500" | 3 |
| `2_5k_5k` | "$2,500–$5,000" | 6 |
| `5k_10k` | "$5,000–$10,000" | 11 |
| `10k_25k` | "$10,000–$25,000" | 15 |
| `25k_plus` | "$25,000+" | 18 |
| `unsure` | "I don't know yet" | 9 |
*(No-answer = 7 pts. These 7 slugs replace every other budget enumeration in the doc.)*

**Timeline — `timeline` (7, single-select, Step 9) — CANONICAL:** `flexible` "Flexible — best value" · `standard` "Standard timeline" · `asap` "As soon as possible" · `rush_priority` "Rush / priority" · `fixed_deadline` "Fixed deadline" (reveals `fixed_deadline_date`) · `event_move_in` "Event or move-in deadline" (reveals date) · `emergency_repair` "Emergency repair". *Rush triggers* (apply `rush_multiplier`): `asap`, `rush_priority`, `emergency_repair`, and any `fixed_deadline`/`event_move_in` whose date is inside the standard lead time.

**Decision readiness — `decision_readiness` (5, single-select, Step 9):** `just_researching` · `planning_3_6mo` · `ready_1_2mo` · `ready_to_schedule` · `need_by_date`. *(Wired into lead-score factor #5: `ready_to_schedule` +full, `ready_1_2mo`/`need_by_date` +most, `planning_3_6mo` +partial, `just_researching` +0.)*

**Contact role — `contact_role` (7+other, Step 10):** `homeowner` · `renter` · `property_manager` · `designer` · `contractor` · `realtor` · `investor` · `other`. *(B2B roles designer/contractor/realtor/investor feed lead scoring.)* Contact fields: `first_name` (req), `last_name` (req), `email` (req), `phone` (req), `zip` (req, service-area check), `address` (opt — street deferred to consult), `preferred_contact_method` (`phone`/`text`/`email`), `best_time_to_contact`, `permission_to_text` (boolean).

**Photo type — `photo_label` (8, per-file, Step 7):** `wide_room` · `straight_on` · `close_up_existing` · `tape_measure` · `obstruction` (outlets/switches/vents/pipes/uneven/damage) · `inspiration` · `sketch` · `other`. Per-file also: `photo_note` (free-text caption, opt), `photo_room` (links to `room` when set). Capabilities: drag-drop, mobile camera (`capture="environment"`), example thumbnails, internal `quality_score` (0–100), and an inquiry-level `measurements_accuracy` toggle (`approximate` / `verified`).

**Existing-conditions checklist — `existing_conditions[]` (complete, Step 8):** `demolition_removal_needed` · `existing_built_ins_to_remove` (cabinets/shelves/trim/built-ins) · `wall_flat_level_unknown` · `outlets_in_area` · `switches_in_area` · `vents_in_area` · `pipes_in_area` · `baseboards_in_area` · `windows_in_area` · `doors_in_area` · `radiators_in_area` · `hvac_returns_in_area` · `electrical_work_needed` · `drywall_repair_needed` · `painting_staining_needed` · `match_existing_wood_trim` · `home_occupied` · `pets_or_children` · `parking_loading_restrictions` · `stairs_elevator_access` · `condo_hoa_commercial_rules` · `dust_control_required` · `floor_furniture_protection`.

**Measurement fields (Step 6, multiple blocks via "+ Add area"):** per block — `block_label` (e.g. "Wall A", "Left built-in", "Upper section"), `width_in`, `height_in`, `depth_in`, `num_sections`, `num_walls`, `linear_feet`, `ceiling_height_in`, and quantities `num_shelves` / `num_drawers` / `num_doors` / `num_panels` / `num_cabinets` / `num_trim_runs`. Surfaced computed readout per block + total: square inches (`w×h`), square feet (`÷144`), cubic inches (`w×h×d`), linear feet (`÷12`), and `sheet_count` (CEILING formula). All measurement fields optional (missing → low-confidence range; see A2).

## A2. Master Constants (locked values)

| Constant | Canonical value | Notes |
|---|---|---|
| **Tier slugs** | `essential` / `premium` / `signature` | Customer labels Essential / Premium / Signature. No `standard`/`luxury`/`help_me_choose` tier values exist; "Help me choose" sets `tier='premium'` + `tier_recommended_by_us=true`. |
| **Wizard length** | **10 steps** | Intent · Project type · Goal · Tier · Priority · Measurements · Photos · Conditions/Material/Finish/Style · Budget/Timeline/Readiness · Contact+Summary. "5 chunks" = a UX grouping, never a 5-screen build. |
| **Tier material multiplier (early-budget shorthand, Essential-anchored)** | Essential **1.0** · Premium **1.5** · Signature **2.4** | Material-only first-pass; used in Part 3/Part 8. |
| **Tier engine multiplier (Premium-anchored, in calculator §1.1)** | Essential **0.667** · Premium **1.00** · Signature **1.60** | Derived as Essential-anchored ÷ 1.5. (Supersedes the earlier 0.72/1.00/1.55.) These are independent of the early-budget shorthand; do not cross-mix. |
| **Tier net profit margin** | Essential **0.13** · Premium **0.20** · Signature **0.25** · rush **+0.05** | One canonical set; supersedes the 15/22/30 in the Part 3 tier table. |
| **Rush multiplier** | engine default **1.30**; customer-facing band **1.20–1.40** | Applied on rush triggers (above). |
| **Batched / flexible-timeline factor** | engine **0.92**; band **0.90–0.95** | "Best Price + Quality" priority. |
| **Price+Fast (simplify) factor** | engine **0.85**; band **0.80–0.90** | Nudges to Essential materials/finish. |
| **Confidence range multipliers** | High **0.92 / 1.12** · Medium **0.85 / 1.25** · Low **0.70 / 1.50** | The ONLY range source. Any fixed ±band elsewhere (e.g. 0.90/1.15) is superseded. |
| **Minimum project fee** | Essential **$550** · Premium **$850** · Signature **$1,500**; repair/trip min **$275** | `$275` supersedes the $150–$350 and $350–$500 mentions. Floor applied as `MAX(min_fee, subtotal+rush+risk)` unconditionally, including the LF fast path. |
| **Material markup defaults (by tier)** | Essential **25%** · Premium **32%** · Signature **35%** | Matches the Part 8 observed ranges; supersedes the 35/45/60 defaults. Markup ≠ net margin (a 35% markup ≈ 26% margin). |
| **Photo limits** | max **10** photos/inquiry · **8 MB**/original · MIME `jpeg`/`png`/`webp`/`heic` | Supersedes "1–6 images" / "≤10MB" / "jpg/png/heic". |
| **CTA** | button **"Request a Free Estimate"** · section heading **"Request a Custom Carpentry Estimate"** · A/B baseline = the button string · secondary quiet link "Just have a quick question? Contact us →" | One verbatim button + one verbatim heading everywhere. |
| **Lead categories** | `hot` / `warm` / `luxury` / `budget` / `low_fit` | Deterministic precedence in A3. |
| **Inquiry/lead status** | `draft` → `submitted` → `reviewing` → `contacted` → `quoted` → `scheduled` → `won` / `lost` | One unified state machine; the DB CHECK uses exactly these 8. `quote_status` (`draft`/`sent`/`viewed`/`accepted`/`declined`/`expired`) is a **separate** field from lead status. |
| **Tables: leads vs inquiries** | Canonical model = Part 12 normalized **`inquiries` + `customers` + `lead_scores`**. | Part 11's `public.leads` single-table phrasing is shorthand for this normalized model; do not build two schemas. |
| **`material_rates` schema** | Canonical = Part 12: normalized `materials` + append-only `material_rates` (`unit_cost numeric(12,4)`, `markup_pct`/`waste_factor` as fractions `numeric(5,4)`, `valid_from`/`valid_to`/`is_current`, admin-INSERT-only). | Supersedes Part 11 §4's mutable-row + diff-table model. `last_verified date` column added per row. |
| **`engine_version` authority** | `estimates.engine_version` is authoritative for reproducing a past quote; `pricing_rules.engine_version` records the engine a ruleset was validated against. | |

## A3. Lead-Category Decision Table (deterministic, ordered)

Evaluate top-down; first match wins:
1. **`low_fit`** — disqualifiers present (unrealistic budget for scope + urgent + poor photos, OR out of service area with no flexibility), OR score < 45.
2. **`budget`** — `tier=essential` AND `budget_band ≤ 2_5k_5k` (simple scope, flexible timeline). Flagged, not score-gated.
3. **`hot`** — score ≥ 72 AND timeline ≤ ~3 months AND `homeowner` AND (a budget band selected OR project size ≥ 11).
4. **`luxury`** — `tier=signature` OR (score ≥ 60 AND premium/luxury materials AND budget ≥ `10k_25k`). *Luxury label wins display in the 60–71 overlap with Warm.*
5. **`warm`** — score 45–71 not caught above.
6. else **`low_fit`**.
*Score pill colors (green ≥72 / amber 45–71 / grey <45) encode RAW SCORE only; category is a separate badge (a Luxury lead at 60–71 shows amber pill + gold badge).*

## A4. Content Added in This Revision (was missing)

**Calculator — Installation-only (Part 10 §3.9).** Basis = labor-only. `material_cost = 0` (client-supplied), `finish_multiplier = 0.00`. `labor_hours = Σ(unit × productivity_hours) × install_difficulty × access`; `project_type_multiplier = 0.80`. Floor = repair/trip min ($275) or Essential min ($550) whichever applies. Hardware billed only if client-supplied parts need provided fasteners.

**Calculator — Design-build (Part 10 §3.10).** Basis = composite. `project_total = Σ(component point-estimates from §3.1–3.9, pre-confidence) × (1 + pm_uplift 0.08) + design_admin_fee`, then a single project-level confidence + risk pass (not per-component). Inputs: `elements[]` multi-select, `contingency_pct`. Margin already inside each component's point estimate — do **not** re-apply the margin divisor at the composite level.

**Finishing — sanding/prep labor (Part 10 §2).** Add `sand_labor_hours = finish_sf / 120 + (finish_sf / 150 × (coats − 1))` (raw-wood prep + scuff between coats); include `sand_labor_hours × finish_rate[tier]` in the finishing bucket. Add a "Sanding / prep labor" row to the Part 8 Finishes table.

**Finishing — color/stain-matching multiplier (Part 10 §1.4).** Add `× 1.20` applied to the **finishing line** when `finish ∈ {color_matched, stain_matched}` (sample-match required). This is distinct from — and additive to — the +10% "matching existing" risk buffer (which covers fitting to existing millwork, not finish color).

**Labor — tier-bound billable rates (Part 10 §1.12 & §2).** Replace the single MID rates in the `labor_cost` formula with tier-scoped rates the engine reads:
| Activity | Essential | Premium | Signature |
|---|---|---|---|
| Shop fabrication `$/hr` | 85 | 100 | 120 |
| On-site install `$/hr` | 95 | 115 | 140 |
| Finishing / spray `$/hr` | 90 | 110 | 135 |
| Design / PM `$/hr` | 95 | 125 | 160 |
`labor_cost = Σ(activity_hours × rate[activity, tier])`. This makes worked example (c) resolve to one pass (Essential crown @ $95/hr → $3,279), not the $3,925→$3,279 re-run.

**Hardware — drawer-box stock (Part 10 §1.13).** Add `drawer_box_stock` unit price: Essential $22 · Premium $35 · Signature $55 (per box), counted in addition to the slide pair so drawer boxes aren't under-counted.

**Margin double-count rule (Part 10 §3).** When the all-in $/LF or $/SF fast path is used (rates already embed labor+material+overhead+profit at Premium), **skip** the `subtotal / (1 − margin)` step in §2; apply only confidence, rush, risk, and the min-fee floor. Only the bottom-up path applies the margin divisor.

**CRM lead-creation automation (Part 11 §5.1).** Add trigger row: *Lead submitted (not spam/disqualified) → create lead in external CRM via API → immediate (≤1 min) after insert → System*. Reuses the timeout+retry wrapper, stores returned CRM id on the inquiry, logs to `email_events`/activity, idempotent (dedupe on email+phone so re-submits don't duplicate). The manual §3.4 "Export to CRM" button is the re-push/override path.

**Admin dashboard — fields to surface (Part 11 §3.3 detail).** Add to the detail view: **material preference** (`material`), **budget range** (`budget_band` label), **estimate confidence** (High/Medium/Low + the multiplier driving the band), **computed measurements** (sq in / sq ft / linear ft / sheet count, not just raw W×H×D, with a "not measured yet" state), **room/location** (the `room` value), a computed **recommended next action** (derived from category + status + SLA, e.g. "Call now — Hot, SLA due in 38m"), **follow-up status** (active no-response sequence step + next-send timestamp, backed by `sequence_state jsonb`), and **quote status** (separate from lead status). Add Budget + Material-preference + Follow-up filters to §3.2.

**Analytics — named derived metrics (Part 12 §3).** Track as explicit owned metrics (not just funnel side-effects): `conversion_by_project_type`, `conversion_by_tier` (standalone, Essential/Premium/Signature), `conversion_by_project_type_x_tier`, `avg_estimated_value`, `photo_upload_rate` (share with ≥1 photo), `budget_mismatch_rate` (by type & tier), `lead_quality_score` distribution + category mix, and **conversion split by `device_type`** (mobile/tablet/desktop) for `form_started→form_submitted` and `→estimate_accepted`. Fire `estimate_accepted` server-side in the same transaction that sets `estimates.accepted=true / accepted_at`.

---

# Intake & Quote Flow — UX Best Practices, CTA Strategy & Conversion Spec

This section defines the conversion-optimized intake experience for Cruz Carpentry's estimate flow. It is grounded in patterns from California Closets, Block Renovation, Remodel AI, and CRO research (Baymard, Zuko, Growform). The form is a **multi-step wizard**, not a long single form, with the **Premium tier anchored as the recommended default**.

---

## 1. Core UX Patterns (16 transferable, with carpentry application)

### Pattern 1 — Multi-step wizard, not a long single form
**Why it works:** Breaking the form into 4-6 chunks reduces perceived effort and cognitive overload. Critically, Baymard research shows abandonment is driven by **total field count, not step count** — so splitting fields across steps lowers per-screen friction without adding real cost. B2C lead forms average 72.3% abandonment; chunking is the single biggest lever against it.
**Apply it:** Deliver the wizard as the **10 steps in Part 6**, grouped into ~5 perceptual chunks (Intent+Type+Goal · Tier+Priority · Measurements+Photos · Conditions+Material+Finish+Style · Budget+Timeline+Contact). Cap each *screen* at **3-5 input decisions**. Never show more than ~8 total *required* fields across the whole flow — every field past the 8th drops completion 4-6%. (Per Part A §A2 the canonical length is 10 steps; "5" refers to chunks, never a 5-screen build.)

### Pattern 2 — Start with the easiest, lowest-commitment question
**Why it works:** A one-tap first question (sunk-cost / foot-in-the-door effect) gets users moving before they hit anything that feels like work. Personal info requested last — after time is invested — converts measurably better.
**Apply it:** Step 1 is a single tap: "What are you building?" as a grid of image cards (built-ins, kitchen, vanity, closet, etc.). No typing, no required fields. Defer name/email/phone to the **final** step.

### Pattern 3 — Persistent progress indication
**Why it works:** A progress bar gives users a visual cue they're advancing and sets an endpoint expectation, reducing mid-flow abandonment. Uncertainty about length is a top abandonment driver.
**Apply it:** Top-of-screen stepper: `● Project ─ ● Scope ─ ○ Details ─ ○ Photos ─ ○ Contact`. Show "Step 2 of 5" in text for screen readers. Use a thin gold (`#C9A24B`-family) fill bar, ~3px, animating left-to-right on advance.

### Pattern 4 — Large tappable image cards over dropdowns
**Why it works:** For a small, finite set of visual choices, image cards beat dropdowns decisively — the whole card is the hit target, all options are scannable at once, and dropdowns are "a nightmare" on touch. For a visual trade like carpentry, photos also do persuasion work.
**Apply it:** Project-type and tier selections are **image cards**, minimum 48×48px target (aim for full-card tap zones ~160×120px on mobile). Selected state = 2px gold border + checkmark. Use real Cruz portfolio photos as the card imagery, not icons, wherever a photo exists.

### Pattern 5 — Smart defaults + the anchored recommended tier
**Why it works:** Defaults set the reference point. Pre-selecting and visually elevating the middle tier exploits the compromise effect (people avoid the cheapest and most expensive, gravitating to the "balanced" middle).
**Apply it:** On the tier step, **pre-select Premium** with a `RECOMMENDED` ribbon, a subtle gold glow, and a one-line "Best balance of cost and craftsmanship — what most clients choose." List order: Essential → **Premium (elevated card, ~10% larger)** → Signature. Anchor the eye on Premium; Signature on the right makes Premium feel sensible.

### Pattern 6 — "I'm not sure" escape hatches on every choice
**Why it works:** Forcing a decision a user can't confidently make causes abandonment. An explicit "not sure" path keeps them moving and signals the brand will guide them — appropriate for custom work where the client legitimately doesn't know.
**Apply it:** Every selection step includes a low-emphasis card/option: "Not sure yet — help me decide." Selecting it doesn't block progress; it flags the lead for a consultative follow-up and pre-fills a friendly note. Tier step: "Help me choose a tier." Dimensions: "I haven't measured yet."

### Pattern 7 — Inline tooltips for trade jargon
**Why it works:** Terms like "paint-grade," "inset vs. overlay," "crown," "casing," "wainscoting" are unfamiliar to most homeowners. An unexplained term creates a stall. Inline `?` tooltips resolve confusion without leaving the field.
**Apply it:** Add `(i)` tap-tooltips on: Essential/Premium/Signature (one-line plain-English each), "paint-grade," "hardwood," "built-in," "casing," "wainscoting." Example: *Paint-grade — smooth MDF/poplar built to be painted a solid color; the most cost-effective finish.*

### Pattern 8 — Photo-upload guidance, in-context
**Why it works:** Block Renovation and Remodel AI both lead intake with "upload a photo." A photo dramatically improves estimate accuracy and makes the lead feel real. But unguided uploads yield useless images; explicit guidance fixes this.
**Apply it:** Photo step shows 3 example thumbnails ("wide shot of the wall," "close-up of trim/finish," "the room from the doorway") and microcopy: "Photos help us scope accurately — even a few quick phone shots are perfect." Allow 1-6 images, drag-drop on desktop, camera on mobile. Make photos **optional** (never block on them) but visually encouraged.

### Pattern 9 — Measurement help, not a measurement requirement
**Why it works:** Demanding exact dimensions upfront is a wall — most homeowners haven't measured and many can't. California Closets solves this by *sending a designer to measure*. Mirror that: make measurements helpful-but-optional with guidance.
**Apply it:** Dimension fields (W × H × D in inches) are **optional**, each with placeholder hints (`e.g. 96`) and a collapsible "How to measure" helper (measure the opening, round to nearest inch, photo the tape on the wall). Pair with the "I haven't measured yet — that's fine, we'll confirm on site" escape hatch.

### Pattern 10 — Inline, real-time validation
**Why it works:** Validating on blur (not on submit) catches errors when context is fresh and prevents the demoralizing "fix 4 errors at once" submit failure. Reduces the rage-quit at the finish line.
**Apply it:** Validate email/phone format on field blur with a green check on success and a specific message on failure ("That email looks incomplete — missing the @?"). Never validate as the user is still typing the first characters. Phone formatting auto-applies `(720) 280-0812`.

### Pattern 11 — Autosave / resume
**Why it works:** A 5-step flow invites interruption (kids, doorbell, "let me go measure"). Losing entered data on refresh guarantees abandonment. Persisting state lets users return.
**Apply it:** Persist wizard state to `localStorage` on every step change; on return, show "Welcome back — pick up where you left off?" Keep it client-side only until final submit (no PII written server-side mid-flow). Clear on successful submission.

### Pattern 12 — Trust & social proof beside the decision point
**Why it works:** Testimonials and trust cues placed *adjacent to the form/submit button* remove last-second hesitation. Reassurance about "what happens next" and data safety directly reduces submission anxiety.
**Apply it:** On the final (contact) step, place beside the submit button: a short client quote, a license/insured badge, and a "what happens next" line. In the footer of every step: "Free, no-obligation estimate · We never share your info." (Note: per audit memory, do **not** state a specific review count/rating like "5.0" until verified — use unquantified social proof.)

### Pattern 13 — Premium visual tone throughout
**Why it works:** Luxury home-service brands signal quality through restraint — generous whitespace, real craft photography, warm neutral palette, refined type. The form *is* a brand touchpoint; a cheap-looking form contradicts a luxury pitch and depresses high-tier selection.
**Apply it:** Match the site: warm dark/walnut ground, gold accent reserved for the single primary action and active states, serif display + clean sans body, large photography. One primary button per screen; everything else is quiet. No clip-art icons on tier cards — use real finished work.

### Pattern 14 — Mobile-first, single-column
**Why it works:** 81% of mobile users abandon forms perceived as too long; single-column layouts and step-chunking are the proven mobile fixes. Most home-service intake traffic is mobile.
**Apply it:** One column always. One primary decision visible per scroll. Sticky bottom "Continue" button (thumb-zone). Tap targets ≥48×48px with generous padding. (Detailed mobile spec in §4.)

### Pattern 15 — Reduce cognitive load via conditional logic
**Why it works:** Showing only relevant fields keeps each step short and prevents the "wall of fields" that drives drop-off. Irrelevant questions feel like friction.
**Apply it:** Branch on project type: a "Closet" path asks reach-in vs. walk-in; a "Fireplace surround" path asks mantel yes/no; "Trim/baseboards" asks linear footage instead of W×H×D. Never show kitchen-cabinet questions to a floating-shelf lead. (Respect the existing `prefers-reduced-motion` gating already wired into EstimateForm — step transitions must degrade to instant.)

### Pattern 16 — Confirmation that sets expectations + a next action
**Why it works:** The moment after submit is high-intent and high-anxiety ("did it go through? now what?"). A concrete next-step + timeline converts the lead's momentum into a scheduled touch and reduces "ghosting."
**Apply it:** Success screen: "Thanks, [First name] — your project is in. the owner will review your photos and reach out within **1 business day** to schedule a free on-site consult." Offer an immediate secondary action: "Prefer to talk now? Call/text (720) 280-0812" and a calendar-booking link if available.

---

## 2. CTA Decision

### Recommended primary CTA: **Request a Free Estimate**
(Adapt "Request Custom Carpentry Estimate" → **"Request a Free Estimate"** as the button; use the longer form as the section heading above it.)

**Rationale:**
- **"Estimate" fits custom work honestly.** A true *quote* is a fixed, binding price; an *estimate* is an informed range pending site verification — which is exactly what custom carpentry delivers before a measure. Promising a "quote" sets a fixed-price expectation Cruz can't honor sight-unseen, risking trust at the consult.
- **"Free" is the single highest-impact modifier** — it removes the cost-of-asking objection and is "a magnet" for no-obligation interest. CTR lifts of 150%+ have been observed from price-transparency reframes.
- **"Request" signals a consultative, white-glove path** (a person will respond), matching premium intent — versus "Submit," which feels transactional and form-heavy.
- **Rejected options:**
  - *Contact Us* — vague, low intent, no value promise.
  - *Submit Inquiry / Submit Custom Project Inquiry* — "Submit" is weak and bureaucratic; "Inquiry" is corporate-cold and the long version is wordy on a button.
  - *Get Estimate* — fine but missing "Free" (the value hook) and the warmer "Request."
  - *Start My Custom Build* — strong energy and good for a hero CTA, but over-promises commitment ("build") at the top of funnel where the user only wants a number/conversation. **Keep it as a secondary hero variant to test (see below), not the form's primary action.**

### Secondary "general question" path
A low-commitment, de-risked escape for browsers not ready to scope a project:
> **"Just have a question? Send us a message"** — opens a lightweight 3-field contact form (name, email, message), no project wizard.

Place it as a quiet text link **below** the primary button, never as a competing button. This protects the primary conversion while capturing top-of-funnel curiosity.

### 6 button microcopy variants for A/B testing
| # | Variant | Hypothesis it tests |
|---|---|---|
| 1 | **Request a Free Estimate** | Baseline — value + consultative tone |
| 2 | **Get My Free Estimate** | "My" ownership framing + "Get" immediacy |
| 3 | **Start My Custom Build** | High-intent/aspirational; measures whether commitment energy beats safety |
| 4 | **Request a Free Consultation** | "Consultation" (à la California Closets) vs. "Estimate" — tests luxury/advisory framing |
| 5 | **See What It'll Cost — Free** | Maximum price-transparency hook; tests cost-curiosity pull |
| 6 | **Get a Free Project Estimate** | Adds "Project" specificity; tests scope-clarity vs. brevity |

**Testing note:** Run as a single-variable test on the form's primary button (and separately on the hero CTA). Keep the **destination and flow identical** across variants so the label is the only changing factor. Need ~per-variant sample sizing against the ~72% baseline abandonment; declare a winner only at statistical significance, not on raw lift.

---

## 3. Per-Step Drop-off Mitigations + Trust Microcopy

### Drop-off mitigations by step
| Step | Top drop-off risk | Mitigation |
|---|---|---|
| **1. Project type** | "This looks like work" bounce | One-tap image cards, zero required text, no progress penalty; auto-advance on selection |
| **2. Tier/scope** | Decision paralysis / price fear | Premium pre-selected + "Help me choose" escape hatch; show value not price; tooltips on each tier |
| **3. Details** | Field overload, jargon stalls | Conditional fields (only relevant ones), all-optional dimensions, inline `(i)` tooltips, single column |
| **4. Photos/measure** | "I don't have photos ready" | Photos optional + example shots + "even quick phone pics help"; "I haven't measured yet" option |
| **5. Contact** | Privacy anxiety at the PII ask | Trust quote + insured badge + "what happens next" beside submit; "we never share your info"; inline validation |
| **Post-submit** | Ghosting / lost momentum | Confirmation with named owner + 1-business-day promise + call/text + optional booking link |

**Global mitigations:** autosave + resume across all steps; sticky "Continue" so the next action is never hunted for; back button preserves entered data; honor `prefers-reduced-motion` so transitions never disorient.

### Trust-building microcopy (warm, professional — drop-in lines)
1. "Free, no-obligation estimate — we'll never pressure you or share your information."
2. "A real person reviews every project. the owner personally reaches out within one business day."
3. "Not sure how to describe it? That's what we're here for — send a photo and we'll take it from there."
4. "Licensed and insured, serving Denver and the Front Range since [year]."
5. "Every Cruz project starts with a free on-site consult — we measure, you decide, no commitment."
6. "Your details go straight to our team — no call centers, no spam, no reselling your info."
7. "Most clients hear back the same day. We'll confirm details and schedule a visit that works for you."

*(Fill `[year]` from owner data — flagged as unverified in audit memory. Avoid stating a numeric review rating until confirmed.)*

---

## 4. Mobile-Specific Guidance

**Layout & step length**
- Strict single column; **one primary decision per screen**, max ~3-5 inputs per step. Keep total required fields ≤8 across the flow.
- Sticky bottom action bar holding the single primary button ("Continue" / final "Request a Free Estimate") in the thumb zone; secondary/back as a quiet text link, not a competing button.
- Progress stepper pinned to top so length is always legible.

**Tap targets & spacing**
- All interactive elements ≥48×48px (Material) / ≥44×44px (Apple) minimum; make the **entire card row tappable**, not just the label.
- ≥8px gap between adjacent targets to prevent mis-taps; generous vertical padding.

**Keyboard types (set `inputmode`/`type` per field)**
- Email → `type="email"` (`inputmode="email"`, `autocomplete="email"`) — surfaces `@` and `.com`.
- Phone → `type="tel"` (`inputmode="tel"`, `autocomplete="tel"`) — numeric pad.
- Dimensions / linear footage / ZIP → `inputmode="numeric"` (ZIP `autocomplete="postal-code"`).
- Name → `autocomplete="name"`; disable autocapitalize on email.
- Avoid native dropdowns — use radio/segmented controls or image cards so options are visible without opening a picker.

**Camera & photo upload**
- Photo input uses `accept="image/*"` and `capture="environment"` so the rear camera opens directly on mobile; offer both "Take a photo" and "Choose from library."
- Show example shots inline (wide / close-up / doorway) before the picker opens.
- Client-side compress/resize before upload (target ~1600px long edge, ~70-80% JPEG) so large phone images don't stall on cellular; show per-file upload progress and allow remove/retry. Keep photos optional — never block submission on an upload.
- Respect the existing Supabase-backed rate limiter on submit; show a graceful, non-technical message if throttled ("Looks like that went through more than once — give it a moment").

---

### Sources
- [Baymard — Checkout form field count / abandonment](https://baymard.com/blog/checkout-flow-average-form-fields)
- [Multi-step form abandonment stats 2026](https://www.amraandelma.com/multi-step-form-abandonment-stats/)
- [FormAssembly — Multi-step form best practices](https://www.formassembly.com/blog/multi-step-form-best-practices/)
- [Growform — Multi-step form examples & why they work](https://www.growform.co/16-best-multi-step-form-examples-and-why-they-work-2024/)
- [California Closets — Design consultation process](https://www.californiaclosets.com/what-to-expect-at-your-design-consultation/)
- [California Closets — Request a consultation](https://www.californiaclosets.com/request-consultation/)
- [Block Renovation — Kitchen remodel visualizer (photo-upload pattern)](https://www.blockrenovation.com/tools/kitchen-remodel-visualizer)
- [Remodel AI — photo-upload remodel flow](https://www.remodelai.io/blog/best-free-ai-house-renovation-apps)
- [Wisevu — CTA button text A/B testing case study](https://www.wisevu.com/blog/cta-button-text-a-b-testing-case-study/)
- [FreshBooks — Quote vs. Estimate](https://www.freshbooks.com/hub/estimates/quote-vs-estimate)
- [Zuko — Mobile form UX tips](https://www.zuko.io/blog/8-tips-to-optimize-your-mobile-form-ux)
- [Zoltan Kollin — Dropdown alternatives for better mobile forms](https://medium.com/@kollinz/dropdown-alternatives-for-better-mobile-forms-53e40d641b53)
- [UXPin — Combining microcopy and social proof for trust](https://www.uxpin.com/studio/blog/designing-for-trust/)
- [Reform — 7 trust signals to boost form conversions](https://www.reform.app/blog/7-trust-signals-to-boost-form-conversions)

---

I'll write the complete form architecture and UX spec directly, drawing on the upstream research provided.

# Intake Wizard — Form Architecture & UX Spec

This is the build-ready specification for Cruz Carpentry's 10-step estimate wizard. It converts the competitive/UX research and estimation models into concrete fields, controls, conditional logic, copy, and journey design. All dollar logic references the estimation model; all UX patterns reference the research. Premium is the anchored default throughout.

---

## 1. The 10-Step Wizard

Design system constants (apply to every step):
- **Ground:** warm walnut/dark (`#1A1410`-family) with elevated cards (`#241C16`); body text warm off-white (`#EDE6DA`).
- **Accent:** gold `#C9A24B` — reserved for the single primary action, active/selected states, and the progress fill ONLY.
- **Type:** serif display headings (e.g., Fraunces/Cormorant), clean sans body (e.g., Inter).
- **Layout:** strict single column, max content width 560px, centered. One primary decision per scroll.
- **Progress stepper:** pinned top, 3px gold fill bar + dot labels `Project · Scope · Goal · Details · Sizes · Photos · Conditions · Finish · Budget · Contact`. Screen-reader text "Step N of 10."
- **Primary button:** one per screen, gold, sticky bottom (thumb zone) on mobile. Label = "Continue" on steps 1–9, final CTA on step 10.
- **Back:** quiet text link, left of Continue, preserves all entered data.
- **Autosave:** persist wizard state to `localStorage` on every step change; "Welcome back — pick up where you left off?" on return; clear on submit. No PII server-side until final submit.
- **Motion:** honor `prefers-reduced-motion` — step transitions degrade to instant; gold fill bar snaps instead of animating.
- **Footer (every step):** "Free, no-obligation estimate · We never share your info."

> Step count note: research recommends 5 perceptual chunks; this 10-step build keeps **≤5 input decisions per screen** and **≤8 total required fields** across the flow (only Step 10's name + one contact method + project type from Step 3 are hard-required). Steps 5, 6, 7 are heavily optional/auto-advancing so perceived length stays low. Steps collapse via conditional logic (§3) so most users see 6–7 active screens.

---

### Step 1 — Intent
**Purpose:** Lowest-commitment entry. One tap, no typing, establishes funnel stage and routes "just browsing" away from the full wizard before they feel friction.
**Fields:** `intent` (single-select, auto-advance).
**UI:** Heading "What brings you in today?" Three large stacked cards (full-width, ~88px tall, entire card tappable):
- "I have a project in mind — let's scope it" (→ continues wizard)
- "I'm exploring ideas and rough costs" (→ continues wizard, flags lead as early-stage)
- "I just have a question" (→ exits wizard to 3-field contact form: name, email, message)
Selecting a card auto-advances (no Continue needed). No progress penalty shown on this screen.

---

### Step 2 — Project Type
**Purpose:** The real foot-in-the-door. A scannable grid of the actual trade categories, using real portfolio photography to do persuasion work. Drives every downstream conditional branch.
**Fields:** `project_type` (single-select image cards, required, auto-advance).
**UI:** Heading "What are you building?" 2-column grid on mobile / 3-column desktop of image cards (~160×120px, full-card tap zone, real Cruz photos where available). Selected = 2px gold border + checkmark. Options: Built-Ins · Custom Cabinets / Kitchen · Floating Shelves / Shelving · Closet System · Mudroom / Entry · Vanity · Fireplace Surround · Wainscoting / Accent Wall · Trim · Baseboards / Crown · Custom Furniture · Repair / Restoration · Install Only (you supply) · Full Room / Multi-Element · **Not sure yet — help me decide** (low-emphasis, no photo, text card). Auto-advance on tap.

---

### Step 3 — Scope / Goal
**Purpose:** Capture the "why" and rough magnitude in plain language before any numbers. Frames the brand as consultative.
**Fields:**
- `project_goal` (multi-select chips): "New build from scratch" · "Replace something existing" · "Add to / extend existing" · "Restore / repair" · "Reconfigure a space" · "Not sure — open to ideas."
- `project_description` (textarea, optional): "Tell us what you're picturing — in your own words."
- `num_elements` (only if Full Room / Multi-Element chosen in Step 2; multi-select of project types).
**UI:** Heading "What's the goal?" Goal chips (toggle pills, gold when active). Below, an optional expandable textarea with placeholder. Continue button. `(i)` tooltip not needed here. "Not sure" chip pre-fills a friendly internal note and never blocks.

---

### Step 4 — Tier / Package
**Purpose:** Anchor Premium. Sell value (what's included), not price. Exploit the compromise effect.
**Fields:** `tier` (single-select cards, **pre-selected = Premium**, required).
**UI:** Heading "Choose your level of finish." Three stacked cards, order Essential → **Premium** → Signature. Premium is ~10% larger, carries a `RECOMMENDED` gold ribbon, subtle gold glow, and the line "Best balance of cost and craftsmanship — what most clients choose." Each card has an `(i)` tooltip with plain-English contents (see §4). Below the three: low-emphasis text option "Help me choose a tier — recommend for me" (selects Premium internally, flags for consult). Continue.

Card contents (shown as 3–4 bullet "includes" per card):
- **Essential** — Paint-grade MDF/poplar · simple Shaker or slab doors · brushed/rolled or basic sprayed finish · standard hardware. *"Clean, durable, budget-conscious."*
- **Premium (recommended)** — Furniture-grade plywood boxes · hardwood doors & face frames (maple/oak/alder) · sprayed conversion-varnish finish · soft-close hardware. *"Best balance of cost and craftsmanship."*
- **Signature** — Solid & figured hardwoods (rift white oak, walnut) · inset doors · veneer-matched panels · hand-rubbed finish · integrated lighting · white-glove install. *"Heirloom-grade, no compromise."*

---

### Step 5 — Priority (Price·Quality·Time Triangle)
**Purpose:** Set the customer's optimization priority, which drives a transparent price multiplier and schedule expectation. Frames trade-offs honestly.
**Fields:** `priority` (single-select, **pre-selected = Balanced**, required).
**UI:** Heading "What matters most for this project?" A triangle diagram (SVG) with vertices labeled Price / Quality / Time, plus four selectable cards below it (full detail + copy in §6). Selecting a non-Balanced option highlights the two prioritized vertices and dims the third. Plain-language explainer sits above the cards. Continue.

---

### Step 6 — Measurements
**Purpose:** Helpful-but-optional sizing. Never a wall. Surfaces live computed sq in / sq ft / LF so the customer sees their input becoming real. Drives confidence range.
**Fields:** Conditional on project type (see §3 + §2 full list). Common blocks: width/height/depth (in), sections/bays, walls, linear feet, ceiling height, quantities, plus "Add another area." Every dimension field optional.
**UI:** Heading "Got measurements? Great — if not, no problem." Numeric inputs with `inputmode="numeric"`, placeholder hints (`e.g. 96`). Live-computed readout chip below relevant inputs ("≈ 32 sq ft of wall" / "≈ 14 linear feet" / "≈ 1,152 sq in face"). Collapsible "How to measure" helper per block. Prominent escape card: "I haven't measured yet — that's fine, we'll confirm on site" (sets measurements to unverified → Low/Medium confidence). Continue.

---

### Step 7 — Photos
**Purpose:** Photos massively improve estimate accuracy and make the lead feel real. Guided, optional, encouraged.
**Fields:** `photos[]` (file upload, optional, 1–6 images), per-photo `label` + `accuracy_toggle`.
**UI:** Heading "Show us the space." Three example thumbnails ("wide shot of the wall," "close-up of trim/finish," "the room from the doorway"). Drag-drop zone on desktop; mobile shows "Take a photo" (`capture="environment"`) + "Choose from library." Each uploaded photo gets a label dropdown (Wide / Close-up / Doorway / Detail / Other) and a per-photo "Approximate / Verified" toggle. Client-side compress to ~1600px long edge, ~75% JPEG; per-file progress + remove/retry. Internal-only quality score computed (count + resolution + label coverage) and stored, not shown to customer. Microcopy: "Even a few quick phone shots are perfect." Continue (never blocked).

---

### Step 8 — Conditions, Material, Finish, Style
**Purpose:** Capture site reality + material/finish/style selections. Conditional and tier-aware. Folds existing-conditions checklist into the same screen as material/finish/style to keep total screens low.
**Fields:**
- `existing_conditions[]` (multi-select checklist — full list in §2).
- `material` (single-select, tier-filtered, includes "Recommend for me").
- `finish` (single-select).
- `style` (single-select image cards).
**UI:** Heading "A few details about the space and look." Conditions as a checkbox list (each with `(i)` where jargon appears). Material/finish as radio cards filtered to the chosen tier, each with a "Recommend for me" default chip. Style as small image cards. `home_year_built` numeric (drives confidence). Continue.

---

### Step 9 — Budget, Timeline, Readiness
**Purpose:** Capture budget range + timeline + decision-readiness. Runs budget-fit logic and rush logic. Still no PII.
**Fields:** `budget_range` (select), `timeline` (select), `fixed_deadline_date` (conditional date), `decision_readiness` (select).
**UI:** Heading "Budget and timing." Budget as a segmented range selector; on selection, show the budget-fit helper message (§3/§6). Timeline as radio; choosing "ASAP / rush" reveals a rush explainer and optional `fixed_deadline_date` picker. Readiness as a 4-option radio. Continue.

---

### Step 10 — Contact + Summary
**Purpose:** Collect PII last, after investment. Reassure with trust cues at the decision point. Show a summary so the customer feels in control before submitting.
**Fields:** `first_name`*, `last_name`, `email`*, `phone`*, `zip`, `homeowner_status`, `permission_to_text`, `best_time_to_reach`, plus an inline **summary card** of all prior selections (editable — tap any line to jump back to that step).
**UI:** Heading "Where should the owner send your estimate?" Single-column fields with correct keyboard types + inline blur validation. Summary card above the fields. Beside the submit button: a short client quote, "Licensed & insured · Serving the Front Range," and "What happens next: the owner personally reviews your project and reaches out within 1 business day." Primary CTA = **Request a Free Estimate**. Quiet secondary text link below: "Prefer to talk now? Call or text (720) 280-0812." Honor Supabase rate limiter with a graceful message on throttle.

---

## 2. Full Field List by Section

`*` = required. All others optional. Validation runs on blur unless noted.

### Section A — Intent (Step 1)
| Field | Type | Options | Req | Helper | Validation |
|---|---|---|---|---|---|
| `intent`* | Single-select cards (auto-advance) | `have_project` / `exploring` / `just_question` | Req | — | Must select one to proceed; `just_question` exits to mini-form |

### Section B — Project Type (Step 2)
| Field | Type | Options | Req | Helper | Validation |
|---|---|---|---|---|---|
| `project_type`* | Image cards, single-select, auto-advance | `built_ins` / `cabinets_kitchen` / `shelving` / `closet` / `mudroom` / `vanity` / `fireplace_surround` / `wainscoting_accent` / `trim` / `baseboards_crown` / `custom_furniture` / `repair` / `install_only` / `full_room` / `not_sure` | Req | Tooltips on `built_ins`, `wainscoting_accent`, `casing` terms | Exactly one required |

### Section C — Goal (Step 3)
| Field | Type | Options | Req | Helper | Validation |
|---|---|---|---|---|---|
| `project_goal` | Multi-select chips | `new_build` / `replace_existing` / `add_extend` / `restore_repair` / `reconfigure` / `not_sure` | Opt | "Pick all that apply." | — |
| `project_description` | Textarea | free text | Opt | "Tell us what you're picturing — in your own words." | Max 1000 chars |
| `num_elements` | Multi-select (only if `full_room`) | all project_type values | Cond | "Which pieces does this room include?" | ≥1 if shown |

### Section D — Tier (Step 4)
| Field | Type | Options | Req | Helper | Validation |
|---|---|---|---|---|---|
| `tier`* | Single-select cards, default `premium` | `essential` / `premium` / `signature` | Req (defaulted) | `(i)` tooltip per tier (contents in §1) | Always valid (pre-selected) |
| `tier_recommend_for_me` | Text option | boolean | Opt | "Help me choose — recommend for me" | Sets `premium`, flags consult |

### Section E — Priority Triangle (Step 5)
| Field | Type | Options | Req | Helper | Validation |
|---|---|---|---|---|---|
| `priority`* | Single-select cards, default `balanced` | `balanced` / `price_quality` / `fast_quality` / `price_fast` | Req (defaulted) | Explainer copy §6 | Always valid |

### Section F — Measurements (Step 6) — all optional
Common:
| Field | Type | Options/Units | Req | Helper | Validation |
|---|---|---|---|---|---|
| `width_in` | Number `inputmode=numeric` | inches | Opt | `e.g. 96` | 1–600; integer or .5 |
| `height_in` | Number | inches | Opt | `e.g. 84` | 1–240 |
| `depth_in` | Number | inches | Opt | `e.g. 14` | 1–60 |
| `ceiling_height_ft` | Number | feet | Opt | "Floor to ceiling" | 6–20 |
| `num_sections` / `num_bays` | Stepper | int | Opt | "How many openings/bays?" | 0–30 |
| `num_walls` | Stepper | int | Opt | — | 0–12 |
| `linear_feet` | Number | feet | Opt | "Total run length" | 0–500 |
| `quantity` | Stepper | int | Opt | "How many?" | 1–50 |
| `add_area` | Repeater button | — | Opt | "Add another area" | Clones a measurement block |
| `measurements_unverified` | Toggle/escape card | boolean | Opt | "I haven't measured yet" | Sets confidence ≤ Medium |
| `computed_readout` | Read-only display | sq in / sq ft / LF | — | Auto-calc live | Not editable |

Type-specific (shown by §3 branching):
- Built-ins: `num_doors`, `door_style` (slab/Shaker/raised), `overlay_or_inset` (overlay/inset), `num_drawers`, `shelves_per_bay`, `back_panel` (open/shiplap/beadboard/flat), `crown_lightrail` (y/n), `integrated_lighting` (y/n), `scribe_sides` (0–4).
- Cabinets/Kitchen: `linear_feet_base`, `linear_feet_wall`, `linear_feet_tall`, `num_islands`, `island_size_ft`, `total_door_openings`, `total_drawer_openings`, `box_construction` (frameless/face-frame), `overlay_or_inset`, `layout_type` (galley/L/U/island), `specialty_storage[]` (trash/lazy-susan/spice/cutlery/appliance-garage), `under_cab_lighting` (y/n), `panel_ready_appliances` (count), `demo_existing` (y/n), `countertop_by` (us/others).
- Trim / Baseboards / Crown: `profile_types[]` (base/casing/crown/chair-rail), per profile `linear_feet` + `profile_size_in` + `pieces_buildup` (1/2/3) + `material_grade` (paint/stain), `num_door_openings`, `num_window_openings`, `num_inside_corners`, `num_outside_corners`, `remove_existing_trim` (y/n).
- Wainscoting / Accent: `wall_width_ft`, `wall_height_ft` (→ sq ft auto), `style` (picture-frame/B&B/shiplap/slat/raised-panel), `num_outlets_switches`, `num_window_door_returns`, `top_cap` (y/n), `wall_prep_needed` (y/n).
- Shelving: `num_shelves`, `length_ft`, `depth_in`, `thickness_in`, `mount_type` (floating-hidden/bracket/cleat), `wall_substrate` (drywall/masonry/tile/existing-blocking), `edge_profile` (square/eased/live-edge), `needs_blocking_install` (y/n).
- Closet: `closet_type` (reach-in/walk-in), `total_wall_ft`, `num_corners`, `num_drawer_banks`, `drawers_per_bank`, `hanging_sections` (single/double), `num_shelves`, `island` (y/n), `accessories[]` (valet/hamper/shoe-fence/tie-rack), `lighting` (y/n).
- Custom Furniture: `furniture_type`, `length_in`/`width_in`/`height_in`, `joinery_level` (basic/intermediate/heirloom), `num_drawers`, `design_provided` (y/n), `leaves_extensions` (y/n), `quantity`.
- Fireplace Surround: `width_in`, `height_in`, `mantel` (y/n), `hearth` (y/n), `material_clearance_ok` (y/n + warning).
- Mudroom: `total_wall_ft`, `num_lockers`/`bays`, `bench` (y/n), `upper_cubbies` (y/n), `hooks_only` (y/n), `drawers` (count).
- Vanity: `width_in`, `num_sinks` (1/2), `num_drawers`, `num_doors`, `floating` (y/n), `top_by` (us/others).
- Repair: `repair_items[]` (description/location/severity), `damage_type` (rot/water/impact/wear/settling), `match_existing_required` (y/n), `custom_milling_needed` (y/n), `extent_known` (y/n), `accessibility` (easy/moderate/difficult). *Photos required for this type.*
- Install Only: `install_scope` (cabinets/trim/doors/shelving), `num_units`, `linear_feet`, `assembly_required` (y/n), `leveling_difficulty` (easy/moderate/hard), `inset_precision` (y/n), `hardware_install` (y/n), `remove_existing` (y/n).
- Full Room: per-element sub-forms via `num_elements`; plus `rooms_count`, `design_status` (none/concept/full-plans), `other_trades_needed[]` (electrical/plumbing/drywall/paint/flooring), `phasing_ok` (y/n), `hoa_permit` (y/n).

### Section G — Photos (Step 7)
| Field | Type | Options | Req | Helper | Validation |
|---|---|---|---|---|---|
| `photos[]` | File upload (drag-drop + camera) | image/* | Opt* | "Even a few quick phone shots are perfect." | 1–6 files, ≤10MB each pre-compress, jpg/png/heic |
| `photo_label` (per file) | Select | wide / close_up / doorway / detail / other | Opt | "What does this show?" | — |
| `photo_accuracy` (per file) | Toggle | approximate / verified | Opt | default `approximate` | — |
| `photo_quality_score` | Internal computed | 0–100 | — | Not shown to user | count×res×label coverage |

*Required only when `project_type = repair`.

### Section H — Conditions / Material / Finish / Style (Step 8)
| Field | Type | Options | Req | Helper | Validation |
|---|---|---|---|---|---|
| `existing_conditions[]` | Checklist multi-select | `out_of_square_walls` / `out_of_square_ceiling` / `uneven_floor` / `visible_settling` / `water_damage_suspected` / `electrical_in_area` / `plumbing_in_area` / `hvac_vent_in_area` / `windows_in_run` / `removal_disposal_needed` / `tile_or_masonry_wall` / `vaulted_high_ceiling` / `limited_access` / `none_known` | Opt | `(i)` on "out of square," "scribe" | `none_known` clears others |
| `home_year_built` | Number | year | Opt | "Roughly when was the home built?" | 1850–2026; <1980 caps confidence |
| `material` | Radio cards, tier-filtered | Essential: mdf/poplar/birch_ply · Premium: maple/oak/alder/furniture_ply · Signature: rift_white_oak/walnut/cherry/figured | Opt | "Recommend for me" default | Must be in tier set |
| `finish` | Radio cards | paint_solid / stain_clear / natural_oil / catalyzed_lacquer / prefinished | Opt | `(i)` "paint-grade" | — |
| `style` | Image cards | shaker / slab_flat / raised_panel / beadboard / modern_slat / traditional | Opt | — | — |

### Section I — Budget / Timeline / Readiness (Step 9)
| Field | Type | Options | Req | Helper | Validation |
|---|---|---|---|---|---|
| `budget_range` | Segmented select | `under_2k` / `2k_5k` / `5k_10k` / `10k_20k` / `20k_40k` / `40k_plus` / `not_sure` | Opt | "Ballpark is fine — helps us tailor options." | Triggers budget-fit message |
| `timeline` | Radio | `asap_rush` / `1_3_months` / `3_6_months` / `6_plus_months` / `flexible` / `fixed_deadline` | Opt | — | `asap_rush`/`fixed_deadline` → rush logic |
| `fixed_deadline_date` | Date picker (conditional) | calendar | Cond | "What's the must-finish date?" | Must be future date; <6wk out → rush |
| `decision_readiness` | Radio | `ready_to_book` / `comparing_quotes` / `planning_ahead` / `just_curious` | Opt | "No wrong answer." | — |

### Section J — Contact (Step 10)
| Field | Type | Options | Req | Helper | Validation |
|---|---|---|---|---|---|
| `first_name`* | Text `autocomplete=name` | — | Req | — | Non-empty, ≤50 |
| `last_name` | Text | — | Opt | — | ≤50 |
| `email`* | Email `inputmode=email autocomplete=email autocapitalize=off` | — | Req† | — | RFC email; "missing the @?" on fail |
| `phone`* | Tel `inputmode=tel autocomplete=tel` | — | Req† | auto-format `(720) 280-0812` | 10-digit US; format on blur |
| `zip` | Text `inputmode=numeric autocomplete=postal-code` | — | Opt | "Helps confirm we serve your area." | 5 digits; non-Front-Range → soft note |
| `homeowner_status` | Radio | `owner` / `renter_with_permission` / `agent_pm` / `other` | Opt | — | — |
| `permission_to_text` | Checkbox | boolean | Opt | "OK to text you about your project?" | default unchecked |
| `best_time_to_reach` | Radio | `morning` / `afternoon` / `evening` / `anytime` | Opt | — | — |
| `summary_card` | Editable review | all prior fields | — | "Tap any line to edit." | — |

† **One of `email` or `phone` is required** (not both). Validate: if both empty on submit, block with "We need one way to reach you — email or phone."

---

## 3. Conditional Logic Map

**Intent routing**
- IF `intent = just_question` THEN exit wizard → 3-field mini contact form (name, email, message); skip all steps.
- IF `intent = exploring` THEN flag lead `early_stage = true`; soften copy ("rough costs" language); proceed.

**Project-type → field branching (Step 6 & 8)**
- IF `project_type = trim | baseboards_crown` THEN show `profile_types[]` + per-profile LF/size/buildup + corner counts + openings; HIDE W×H×D, sections, doors/drawers.
- IF `project_type = wainscoting_accent` THEN show `wall_width_ft` + `wall_height_ft` → auto-calc sq ft; show style sub-options; HIDE doors/drawers/LF-run.
- IF `project_type = shelving` THEN show per-shelf block (`num_shelves`, length, thickness, mount, substrate); HIDE cabinetry fields.
- IF `project_type = closet` THEN show `closet_type`; IF `closet_type = walk_in` THEN also show `island`, `num_corners`; IF `reach_in` THEN hide island/corners.
- IF `project_type = fireplace_surround` THEN show `mantel`, `hearth`, `material_clearance_ok`; IF `material_clearance_ok = no` THEN show non-blocking warning "Mantel clearances to the firebox are code-regulated — we'll verify on site."
- IF `project_type = cabinets_kitchen` THEN show base/wall/tall LF + opening counts + layout + specialty storage + island fields.
- IF `project_type = vanity` THEN show width, sink count, drawer/door counts, floating, top_by.
- IF `project_type = mudroom` THEN show bays/lockers, bench, cubbies, hooks, drawers.
- IF `project_type = custom_furniture` THEN show furniture_type + L×W×H + joinery_level + design_provided + quantity; HIDE wall/LF fields.
- IF `project_type = repair` THEN show `repair_items[]` + damage_type + match/milling/extent; **make photos REQUIRED**; force confidence start = Low.
- IF `project_type = install_only` THEN show install_scope + num_units + leveling + assembly; material/finish/style become read-only "client-supplied."
- IF `project_type = full_room` THEN show `num_elements` multi-select in Step 3; render each chosen element's sub-form sequentially in Step 6; add `other_trades_needed[]`, `design_status`, `phasing_ok`, `hoa_permit`; apply Design-Build PM uplift +8–18% and design fee.
- IF `project_type = built_ins` THEN show doors/drawers/shelves/bays/scribe/lighting block.

**"Not sure / recommend" handling**
- IF `project_type = not_sure` THEN skip type-specific measurement fields; show generic W×H + description; flag `needs_consult = true`; route to Premium defaults.
- IF `project_goal` includes `not_sure` THEN flag `needs_consult = true`.
- IF `tier_recommend_for_me` selected OR tier untouched THEN set `tier = premium`; flag `tier_recommended_by_us = true`.
- IF `material = recommend_for_me` THEN set tier-appropriate default species (Essential→poplar, Premium→maple, Signature→rift white oak).

**Tier → material/finish filtering (Step 8)**
- IF `tier = essential` THEN `material` options = {mdf, poplar, birch_ply}; `finish` default = paint_solid; HIDE inset, integrated lighting, veneer-match.
- IF `tier = premium` THEN `material` = {maple, oak, alder, furniture_ply}; `finish` default = catalyzed_lacquer; soft-close ON.
- IF `tier = signature` THEN `material` = {rift_white_oak, walnut, cherry, figured}; SHOW Signature luxury options: inset doors, veneer-matched panels, integrated LED + driver, hand-rubbed finish, white-glove install toggle.

**Priority → price multiplier & schedule (Step 5)** *(multipliers stack on tier base, not on each other)*
- IF `priority = balanced` THEN ×1.00, normal lead time (baseline).
- IF `priority = price_quality` THEN ×0.90–0.95, schedule +3–6 weeks (batched into shop downtime); copy "We slot this into shop downtime to save you money."
- IF `priority = fast_quality` THEN ×1.20–1.40, timeline −30–50% (dedicated crew, expedited materials, faster-curing catalyzed coatings).
- IF `priority = price_fast` THEN ×0.80–0.90, timeline −20–40% (stock profiles, melamine/MDF, basic finish); show quality-tradeoff note.

**Rush logic (Step 9)**
- IF `timeline = asap_rush` OR (`timeline = fixed_deadline` AND `fixed_deadline_date` < 6 weeks out) THEN apply rush uplift consistent with `fast_quality` (×1.20–1.40); reveal rush explainer "Tight timelines mean a dedicated crew and expedited materials — we'll confirm feasibility on the call."
- IF `priority = price_quality` AND `timeline = asap_rush` THEN show conflict note "Lowest price and fastest turnaround pull against each other — on the call we'll help you pick which to prioritize." (Do not silently override; flag for consult.)

**Budget-fit logic (Step 9)** — compare `budget_range` midpoint against the estimation-model point estimate for the selected type+tier+size:
- IF est. point < budget midpoint THEN "Great — your budget gives us room to refine details and finishes."
- IF budget midpoint within ±15% of est. THEN "That budget lines up well with what you're describing."
- IF budget midpoint < est. point by >15% (budget too low) THEN show non-judgmental warning: "Projects like this typically start around $X at the [tier] level. We can hit your budget by adjusting scope, materials, or finish — let's talk through options." Offer one-tap "Show me a more budget-friendly tier" → switches `tier` down one level and re-runs the message.
- IF `budget_range = not_sure` THEN suppress fit message; show "We'll walk you through realistic ranges on the call."

**Photos → confidence**
- IF `photos.length = 0` THEN `photo_factor = Low`; on the summary + confidence model, drop overall confidence one band; show gentle nudge on Step 7 "Adding even one photo tightens your estimate."
- IF `photos.length 1–2` AND labels incomplete THEN `photo_factor = Medium`.
- IF `photos.length ≥ 3` with varied labels (wide+close+context) THEN `photo_factor = High`.

**Measurements → confidence range**
- IF `measurements_unverified = true` OR all dimension fields empty THEN `measurement_factor = Low` → quote range uses Low multipliers (×0.70 / ×1.50, −30%/+50%).
- IF client measurements present but `photo_accuracy = approximate` THEN `measurement_factor = Medium` (×0.85 / ×1.25).
- IF measurements present AND verified-toggle set AND photos confirm THEN `measurement_factor` may reach High (×0.92 / ×1.12).

**Home age → confidence cap**
- IF `home_year_built < 1980` THEN cap `home_condition_factor` at Medium (max).
- IF `existing_conditions` includes `water_damage_suspected` OR `visible_settling` THEN cap that factor at Low.

**Overall confidence (lowest factor caps)**
- Compute six factors (measurement, photo, scope clarity, home age/condition, install complexity, material certainty). Overall = **lowest** band; IF any factor Low OR ≥3 factors Medium THEN overall = Low; ELSE if all High → High; ELSE Medium.
- IF `project_type = repair` OR `match_existing_required = yes` OR `custom_milling_needed = yes` THEN overall confidence floor = Low regardless of photos.
- IF overall = Low THEN estimate copy labeled "Ballpark range — site inspection required before we commit"; flag `requires_site_visit = true`.

**Install complexity factor**
- IF `existing_conditions` includes `vaulted_high_ceiling | tile_or_masonry_wall | limited_access` OR `scribe_sides ≥ 2` THEN `install_factor = Low`.

**Service-area**
- IF `zip` outside Front Range list THEN soft note "We focus on the Denver metro & Front Range — drop your details and we'll confirm if we can reach you."

---

## 4. Tier Strategy + Price·Quality·Time Triangle

### Tier strategy
- **Anchoring:** Premium pre-selected, visually elevated (~10% larger card, `RECOMMENDED` ribbon, gold glow). Order Essential → Premium → Signature so Signature (right) makes Premium feel sensible (compromise effect).
- **Sell value, not price:** cards list *what's included* (materials, joinery, hardware, finish, install), never a dollar figure. Price lives only in the final range after the model runs.
- **Tooltips (one-line plain English):**
  - Essential — "Smooth painted MDF/poplar built to look clean and last — the most cost-effective way to get custom work."
  - Premium — "Real hardwood doors on furniture-grade boxes with a sprayed durable finish and soft-close everything. Our most popular choice."
  - Signature — "Solid and figured hardwoods, inset doors, hidden lighting, and a hand-finished, white-glove install — heirloom quality."
- **Escape hatch:** "Help me choose — recommend for me" selects Premium and flags the lead for consultative follow-up (never blocks).
- **Tier filters everything downstream:** material set, finish default, and luxury option visibility all key off `tier` (see §3).

### Price·Quality·Time triangle — UI + interaction
**UI element:** an equilateral SVG triangle, vertices labeled **Price** (lower-left), **Quality** (top), **Time** (lower-right), rendered in warm walnut with gold active edges. Below it, four full-width selectable cards. Selecting a card lights the two prioritized vertices gold and dims the sacrificed one to ~40% opacity, with a one-line consequence under the triangle. Honors `prefers-reduced-motion` (no edge-glow animation; instant state change).

**Explainer copy (above the cards):**
> Every custom project balances three things — **Price** (what you pay), **Quality** (materials, joinery, and finish), and **Time** (how fast it's done). You can optimize for two; the third has to flex. Tell us what matters most and we'll build the plan around it.

**The 4 options (cards):**

| Card | Lit vertices | Plain-language copy | Effect |
|---|---|---|---|
| **Balanced** *(recommended)* | all three, even | "Right-sized scope, Premium materials, normal timeline. What most clients choose." | ×1.00 baseline |
| **Best Price + Quality** | Price + Quality (Time dim) | "We protect quality and your budget by slotting the work into our shop schedule. Trade-off: a longer lead time (about 3–6 extra weeks)." | ×0.90–0.95, +3–6 wks |
| **Fast + Quality** | Quality + Time (Price dim) | "Full quality, on an accelerated schedule — dedicated crew and expedited materials. Trade-off: higher cost." | ×1.20–1.40, −30–50% time |
| **Best Price + Fast** | Price + Time (Quality dim) | "Lowest cost and quickest turnaround using stock profiles and simpler finishes. Trade-off: fewer custom details." | ×0.80–0.90, −20–40% time |

Default selection = **Balanced**. Always present Balanced as recommended; quote the others as explicit trade-offs, never silently.

---

## 5. Customer Journey Map

| Stage | What happens | Emotional goal | Friction risk | Mitigation |
|---|---|---|---|---|
| **Entry (landing/hero CTA)** | Clicks "Request a Free Estimate" | Curiosity, low commitment | "Is this going to be a hassle / a sales trap?" | "Free, no-obligation" framing; secondary "just have a question" path |
| **Step 1 Intent** | One tap to declare stage | Momentum, "this is easy" | Bounce if it looks like work | Auto-advance cards, zero typing, no progress bar penalty |
| **Step 2 Project type** | Picks a category from photos | Recognition, inspiration | Decision among many options | Real photos, scannable grid, "not sure" card |
| **Step 3 Goal** | Says why, in own words | Being understood | Open text feels like effort | All optional; chips do the work; textarea collapsible |
| **Step 4 Tier** | Sees what each level includes | Confidence in choice | Price fear / paralysis | Premium pre-selected; value not price; tooltips; "recommend for me" |
| **Step 5 Priority** | Picks Price/Quality/Time priority | Feeling in control of trade-offs | Confusion about the concept | Triangle visual + plain explainer + Balanced default |
| **Step 6 Measurements** | Adds sizes or skips | Helpfulness without pressure | "I haven't measured" wall | All optional; "we'll confirm on site"; live computed readout rewards input |
| **Step 7 Photos** | Uploads phone shots | Making it real | "I don't have photos ready" | Optional; example shots; camera capture; never blocks |
| **Step 8 Conditions/material/finish/style** | Describes space + look | Excitement about the result | Jargon stalls | `(i)` tooltips; tier-filtered options; "recommend for me" |
| **Step 9 Budget/timeline/readiness** | Sets budget + timing | Reassurance about fit | Budget anxiety / rush conflict | Non-judgmental budget-fit message; rush explainer; "ballpark fine" |
| **Step 10 Contact + summary** | Reviews + gives contact info | Trust, anticipation | Privacy anxiety at PII ask | Trust quote + insured badge + "what happens next"; one contact method only; inline validation; editable summary |
| **Submit** | Sends, sees confirmation | Relief + momentum | "Did it go through? Now what?" | Instant success screen, named owner, 1-business-day promise |
| **Post-submit** | Confirmation + next action | Confidence it's handled | Ghosting / cooling off | Call/text option, optional calendar booking, email/text confirmation |
| **Consultation (off-platform)** | the owner reviews, reaches out ≤1 business day, schedules on-site measure | Cared-for, premium service | Lead goes cold before contact | Same-day-where-possible reply; on-site measure converts Low→High confidence and firms the range |

---

## 6. Customer-Facing Estimate Language

### Preliminary-range disclaimer (shown wherever an estimate range appears)
> **This is a preliminary estimate, not a final quote.** Custom carpentry depends on exact measurements, site conditions, and material selections we confirm in person. The range below reflects what we know so far — sharing measurements, clear photos, and your finish choices tightens it.

By confidence band (auto-selected by the model):
- **High:** "Firm estimate — expect only minor variation after a final on-site measure."
- **Medium:** "Working estimate — we'll refine this after a quick on-site visit."
- **Low:** "Ballpark range — a site inspection is required before we commit to a price."

Worked example display (Premium built-in, $8,000 point, Medium): **"Estimated range: $6,800 – $10,000"** with the Medium line above.

### Budget-too-low message (non-judgmental)
> "Projects like this usually start around **$[low]** at the **[tier]** level. We can absolutely work toward your budget by adjusting scope, materials, or finish — that's exactly what the free consult is for. Want to see a more budget-friendly option?"

### Thank-you / next-steps (success screen)
> **Thanks, [First name] — your project is in.**
> the owner will personally review your details and photos and reach out within **1 business day** to confirm a few things and schedule your free on-site consult. There's no obligation, and we'll never share your information.
>
> **Prefer to talk now?** Call or text **(720) 280-0812**.
> [Book your consult now →] *(calendar link if available)*

### Confirmation email/text (sent on submit)
> "Hi [First name], thanks for reaching out to Cruz Carpentry. We've got your [project_type] project and the owner will be in touch within one business day to schedule your free on-site estimate. Questions in the meantime? Just reply here or call/text (720) 280-0812."

---

## 7. Primary CTA + Secondary Path

**Primary CTA (form submit + hero):** **"Request a Free Estimate"**
- "Estimate" is honest for custom work (informed range pending site verification, not a binding fixed price). "Free" removes the cost-of-asking objection (highest-impact modifier). "Request" signals a consultative, white-glove, a-real-person-responds path that matches premium intent.
- Section heading above the button uses the longer form: "Request Your Custom Carpentry Estimate."

**Secondary path:** a quiet text link **below** the primary button (never a competing button):
> **"Just have a question? Send us a message"** → opens a lightweight 3-field form (name, email, message), bypassing the wizard.

**A/B test queue (single-variable, identical destination/flow):** (1) Request a Free Estimate [baseline] · (2) Get My Free Estimate · (3) Start My Custom Build [hero only] · (4) Request a Free Consultation · (5) See What It'll Cost — Free · (6) Get a Free Project Estimate. Declare winners only at statistical significance against the ~72% baseline abandonment, not on raw lift.

---

**Open data dependencies (flagged per audit memory, do not hardcode):** owner first name (confirm), phone `(720) 280-0812` (placeholder — confirm), "serving since [year]", and any review count/rating (use unquantified social proof until verified). Front Range ZIP allowlist needs sourcing for the service-area check.

---

This is a documentation/spec-writing task drawing on domain expertise — no codebase exploration or tool calls are needed. I'll write the estimation model spec directly.

# Cruz Carpentry — Standard Estimation Model

*Front Range (Denver metro) pricing baseline, 2026. All figures are labor + shop materials for the carpentry scope unless noted; they exclude countertops, appliances, plumbing/electrical, and permits. Treat every dollar value as editable defaults, not quotes.*

---

## 1. Per-Project-Type Estimating Models

Pricing convention used below:
- **Essential** = paint-grade MDF/poplar/birch ply, simple Shaker or slab, brushed/rolled or basic sprayed finish.
- **Premium** *(recommended default)* = furniture-grade plywood boxes, hardwood (maple/oak/alder) face frames & doors, sprayed conversion varnish or 2K, soft-close hardware.
- **Signature** = solid hardwoods / rift-white-oak / walnut, veneer-matched panels, inset doors, hand-rubbed or catalyzed finish, integrated lighting, white-glove install.

A standard job total is built as:
`(Σ unit costs) × tier multiplier × confidence range × complexity adders + finish + install + (overhead & profit, typ. 1.45–1.65 markup baked into rates below)`

---

### 1.1 Built-Ins (bookcases, window seats, office walls, surround cabinetry)

| Field | Value |
|---|---|
| **Primary basis** | Hybrid: **per linear foot of run** for the carcass, then **per-component adders** (shelf, door, drawer) |
| **Essential** | $250–$400 / LF |
| **Premium** | $400–$700 / LF |
| **Signature** | $700–$1,200+ / LF |

**Component adders** (added on top of LF base):
- Adjustable shelf: $25–$60 ea
- Fixed/dadoed shelf: $45–$90 ea
- Cabinet door (paint-grade): $90–$160 ea; (hardwood/inset): $180–$350 ea
- Drawer box + slides (soft-close): $120–$260 ea
- Scribe/fit to out-of-square wall or ceiling: $75–$200 per scribed edge
- Crown/light rail integration: $18–$32 / LF
- Toe-kick + base build: $30–$55 / LF
- Integrated LED strip + driver: $22–$40 / LF + $90 driver

**Key cost drivers:** ceiling height (8' vs 10'+ adds a tier of material and staging), number of openings/doors/drawers, inset vs overlay doors (inset = +25–40% door labor), site-scribe complexity on old/settled homes, finish method (brush vs spray booth), integrated lighting/electrical, depth (>14" deep needs sheet-good seaming).

**Form input fields:**
`wall_run_length_ft`, `height_ft`, `depth_in`, `num_bays`, `shelves_per_bay` (adjustable vs fixed), `num_doors` + `door_style` (slab/Shaker/raised) + `overlay_or_inset`, `num_drawers` + `drawer_style`, `back_panel` (open/shiplap/beadboard/flat), `crown_lightrail` (y/n), `integrated_lighting` (y/n), `scribe_sides` (ceiling/wall/floor count), `wood_species`, `finish_type` (paint/stain/clear), `ceiling_out_of_square` (y/n), `obstructions` (outlets/vents/window count).

---

### 1.2 Custom Cabinets / Kitchens

| Field | Value |
|---|---|
| **Primary basis** | **Per linear foot of cabinetry** (industry standard), split base / wall / tall; islands per-unit |
| **Essential** | $300–$500 / LF |
| **Premium** | $500–$900 / LF |
| **Signature** | $900–$1,600+ / LF |

Split when more precision is needed:
- Base cabinets: 1.0× LF rate
- Wall cabinets: 0.7–0.8× LF rate
- Tall/pantry/oven cabinets: 1.6–2.0× LF rate
- Island (per unit, freestanding, finished 4 sides): $2,500–$8,000+
- Door/drawer count is the real labor sink — sanity-check LF against **$180–$320 per door/drawer-front opening**

**Per-component adders:** soft-close upgrade $18–$30/opening; pull-out trash $220–$400; lazy susan $250–$450; spice/utensil pull-outs $120–$280; under-cabinet lighting $30–$45/LF; glass-front mullion doors +$120–$250/door; crown $18–$34/LF; scribed fillers $40–$80 ea; toe-kick drawers $180/ea.

**Key cost drivers:** door/drawer opening count, box construction (frameless Euro vs face-frame), inset vs overlay, species & finish, specialty storage, kitchen layout (galley vs U vs island), demo/template/install of existing space, appliance integration (panel-ready fridge/dishwasher fronts), countertop coordination.

**Form input fields:**
`linear_feet_base`, `linear_feet_wall`, `linear_feet_tall`, `num_islands` + `island_size_ft`, `total_door_openings`, `total_drawer_openings`, `box_construction` (frameless/face-frame), `overlay_or_inset`, `door_style`, `wood_species`, `finish_type`, `specialty_storage[]` (multi-select: trash/lazy-susan/spice/cutlery/appliance-garage), `under_cab_lighting` (y/n), `panel_ready_appliances` count, `demo_existing` (y/n), `layout_type`, `ceiling_height_ft`, `countertop_by` (us/others).

---

### 1.3 Trim & Moulding (baseboard, casing, crown, chair rail)

| Field | Value |
|---|---|
| **Primary basis** | **Per linear foot installed** (material + labor), priced separately by profile type |
| **Essential** | see per-profile below (low end) |
| **Premium** | mid range |
| **Signature** | high end (stain-grade hardwood, large profiles) |

| Profile | $/LF installed (paint-grade) | $/LF (stain-grade hardwood) |
|---|---|---|
| Baseboard (3.5–5.25") | $4.50–$8 | $9–$16 |
| Door/window casing | $5–$9 / LF (≈ $45–$95 per opening) | $11–$20 / LF |
| Crown — single-piece | $7–$12 | $14–$26 |
| Crown — built-up (2–3 pc) | $14–$26 | $26–$48 |
| Chair rail / picture rail | $5–$9 | $10–$18 |

**Key cost drivers:** profile size & number of pieces (built-up crown = exponential labor), inside/outside corner count (each corner is a coped or mitered joint = labor), ceiling height & staging, paint-grade vs stain-grade (stain-grade demands tighter joinery + no caulk hiding gaps), number of door/window openings, removal of existing trim, room out-of-square (1900s–1970s Front Range homes commonly +10–20% labor).

**Form input fields:**
`profile_types[]` (base/casing/crown/chair-rail), per profile: `linear_feet`, `profile_size_in`, `pieces_buildup` (1/2/3), `material_grade` (paint/stain); `num_door_openings`, `num_window_openings`, `num_inside_corners`, `num_outside_corners`, `ceiling_height_ft`, `remove_existing_trim` (y/n), `home_year_built`, `walls_out_of_square` (y/n), `paint_by` (us/others).

---

### 1.4 Wainscoting & Accent Walls (board-and-batten, shiplap, slat, raised panel, picture-frame moulding)

| Field | Value |
|---|---|
| **Primary basis** | **Per square foot of covered wall** |
| **Essential** | $12–$22 / sf |
| **Premium** | $22–$40 / sf |
| **Signature** | $40–$75+ / sf |

By style (Premium-tier midpoints):
- Picture-frame / applied moulding: $14–$28/sf
- Board-and-batten: $18–$34/sf
- Shiplap: $16–$30/sf
- Slat / fluted wall: $30–$60/sf (kerf-cut or individual slats)
- Raised-panel / frame-and-panel wainscoting: $35–$75/sf

**Key cost drivers:** layout complexity (panel count & symmetry math), wall height, electrical/outlet/switch cutouts and reveals, returns at windows/doors, species & finish, whether walls must be skim-coated/leveled first, top cap & ledge detail.

**Form input fields:**
`wall_width_ft`, `wall_height_ft` (→ sf auto-calc), `style` (picture-frame/B&B/shiplap/slat/raised-panel), `num_walls`, `num_outlets_switches`, `num_window_door_returns`, `top_cap` (y/n), `material_grade` (paint/stain), `wall_prep_needed` (y/n), `ceiling_height_ft`, `paint_by` (us/others).

---

### 1.5 Shelving & Floating Shelves

| Field | Value |
|---|---|
| **Primary basis** | **Per shelf (per-unit)**, scaled by length & depth; bracket/cleat system priced in |
| **Essential** | $90–$180 per shelf (paint-grade, 3–4 ft) |
| **Premium** | $180–$380 per shelf (hardwood, hidden cleat) |
| **Signature** | $380–$750+ per shelf (thick solid slab, steel internal rod, live edge) |

Rules of thumb: add ~$35–$60 per additional foot beyond 4 ft; thickness >2.5" (built-up box shelf) +30–50%; hidden floating hardware (steel rod into blocking) +$40–$90/shelf vs visible bracket; into masonry/tile wall +$60–$120/shelf.

**Key cost drivers:** length & thickness, mounting (hidden floating vs bracket vs cleat), wall substrate (drywall+blocking vs masonry vs tile), species & edge profile (square/eased/live-edge), load rating, finish.

**Form input fields:**
`num_shelves`, per shelf or as defaults: `length_ft`, `depth_in`, `thickness_in`, `mount_type` (floating-hidden/bracket/cleat), `wall_substrate` (drywall/masonry/tile/existing-blocking), `wood_species`, `edge_profile`, `finish_type`, `needs_blocking_install` (y/n).

---

### 1.6 Closets (reach-in, walk-in, custom systems)

| Field | Value |
|---|---|
| **Primary basis** | **Per linear foot of wall covered** + per-component (drawers, hanging, shelves) |
| **Essential** | $80–$160 / LF (melamine, ventilated/fixed) |
| **Premium** | $160–$320 / LF (plywood, adjustable, soft-close) |
| **Signature** | $320–$650+ / LF (hardwood, islands, lighting, glass-front) |

**Component adders:** drawer bank (3-drawer) $280–$650; hanging rod section $40–$80 ea; shoe fence shelf $35–$70/LF; valet rod $45–$90; closet island (walk-in) $1,200–$4,000; hamper pull-out $180–$320; LED $22–$40/LF; mirror/glass door per unit.

**Key cost drivers:** total wall LF, walk-in vs reach-in (corners, islands), drawer count, double vs single hang, material (melamine vs ply vs hardwood), lighting, accessory count, ceiling height for full-height towers.

**Form input fields:**
`closet_type` (reach-in/walk-in), `total_wall_ft`, `num_corners`, `num_drawer_banks` + `drawers_per_bank`, `hanging_sections` (single/double), `num_shelves`, `island` (y/n) + size, `material_grade` (melamine/ply/hardwood), `lighting` (y/n), `accessories[]` (valet/hamper/shoe-fence/tie-rack), `height_ft`, `doors_by` (us/others).

---

### 1.7 Custom Furniture (tables, beds, media consoles, desks, benches)

| Field | Value |
|---|---|
| **Primary basis** | **Per-unit / per-project**, estimated bottom-up by **board-foot of material + shop hours** |
| **Method** | (board_feet × species $/bf × 1.3 waste) + (estimated_shop_hours × $75–$120/hr) + finish + hardware, then × tier |
| **Essential** | $600–$2,000 per piece (paint-grade, simple joinery) |
| **Premium** | $2,000–$6,000 per piece (hardwood, mortise-tenon/dovetail) |
| **Signature** | $6,000–$20,000+ per piece (figured hardwoods, hand joinery, heirloom finish) |

Reference shop hours: dining table 25–60 hr; platform bed 30–70 hr; media console 35–80 hr; desk 20–50 hr; bench 8–20 hr.
Species $/bf (Front Range yard, rough): poplar $4–$6; soft maple $5–$7; white oak $8–$12; walnut $12–$18; figured/quartersawn +40–80%.

**Key cost drivers:** size & board-feet, species, joinery method (pocket-screw vs M&T vs hand-cut dovetail), curved/sculpted elements, finish complexity (oil vs catalyzed vs hand-rubbed lacquer), hardware (slides, leaves, metal base), design iterations.

**Form input fields:**
`furniture_type`, `dimensions` (L×W×H), `wood_species`, `joinery_level` (basic/intermediate/heirloom), `finish_type`, `num_drawers`, `hardware_notes`, `design_provided` (y/n — plans vs design-from-scratch), `quantity`, `leaves_extensions` (y/n).

---

### 1.8 Repairs (rot, damaged trim, sticking doors, water damage, matching existing)

| Field | Value |
|---|---|
| **Primary basis** | **Hourly + materials**, often with a **minimum trip/service charge** |
| **Hourly rate** | $75–$120/hr (carpenter); $90–$140/hr finish specialist |
| **Minimum/trip charge** | $150–$350 (covers first 1–2 hrs + travel) |
| **Essential** | $150–$500 (small single repair) |
| **Premium** | $500–$2,000 (multi-item, color/profile matching) |
| **Signature** | $2,000+ (historic restoration, custom milling to match) |

**Key cost drivers:** diagnosis uncertainty (rot extent unknown until opened — biggest unknown), matching existing profile/species/finish (custom milling = big adder), accessibility, age of home, whether it's structural, how many discrete items, finish/paint match.

**Form input fields:**
`repair_items[]` (each: description, location, est_severity), `match_existing_required` (y/n), `custom_milling_needed` (y/n), `damage_type` (rot/water/impact/wear/settling), `extent_known` (y/n — drives confidence), `home_year_built`, `photos` (required), `accessibility` (easy/moderate/difficult), `finish_match` (y/n).

> Repairs default to **Low/Medium confidence** until on-site inspection because hidden damage is the norm.

---

### 1.9 Installation-Only (client-supplied cabinets/IKEA, trim install, hang doors, mount shelving)

| Field | Value |
|---|---|
| **Primary basis** | **Per-unit / per-cabinet** or **per linear foot**, labor only (no shop fabrication) |
| **Cabinet install** | $80–$180 per cabinet (stock/IKEA); $120–$250 (custom/inset, leveling) |
| **Trim install (labor only)** | base $2.50–$4.50/LF; crown $5–$10/LF; casing $30–$60/opening |
| **Door hang (pre-hung)** | $110–$220 per door; slab w/ mortising $180–$400 |
| **Shelf/bracket mount** | $45–$120 per shelf |
| **Essential / Premium / Signature** | tier reflects complexity & leveling precision, not material (client supplies material) |

**Key cost drivers:** number of units, leveling/shimming on out-of-square walls, inset/precision fit, hardware install (hinges, pulls, soft-close adjust), filler/scribe work, removal & disposal of old, floor protection, assembly required (flat-pack adds time).

**Form input fields:**
`install_scope` (cabinets/trim/doors/shelving), `num_units` (cabinets or doors), `linear_feet` (trim), `assembly_required` (y/n — flat-pack), `leveling_difficulty` (easy/moderate/hard), `inset_precision` (y/n), `hardware_install` (y/n), `remove_existing` (y/n), `material_supplied_by` (client), `wall_condition`, `photos`.

---

### 1.10 Design-Build (full-room / multi-element projects: full mudroom, library, kitchen + adjacent built-ins)

| Field | Value |
|---|---|
| **Primary basis** | **Composite** — sum of component estimates above + **design/engineering fee** + **PM/coordination margin** |
| **Design fee** | $500–$3,500 flat, or **5–12% of project value** (often credited toward build if client proceeds) |
| **PM/coordination uplift** | +8–18% on top of summed component subtotals (multi-trade scheduling, sequencing, single point of contact) |
| **Essential** | room packages from ~$4,000 |
| **Premium** | $12,000–$45,000 typical full-room |
| **Signature** | $45,000–$150,000+ (luxury kitchen + integrated millwork) |

**Composite formula:**
`project_total = Σ(component subtotals) × (1 + PM_uplift) + design_fee + contingency(5–12%)`

**Key cost drivers:** number of distinct elements/rooms, design complexity & iteration rounds, trade coordination (electrical for lighting, plumbing for vanities, drywall/paint), site conditions across whole space, sequencing/phasing, single-vs-multi-visit, permit/HOA involvement, contingency for discovery in older homes.

**Form input fields:**
`elements[]` (multi-select of all project types above, each with its own sub-form), `rooms_count`, `design_status` (none/concept/full-plans), `iteration_rounds_expected`, `other_trades_needed[]` (electrical/plumbing/drywall/paint/flooring), `target_start`, `phasing_ok` (y/n), `whole_home_year_built`, `hoa_permit` (y/n), `budget_range`, `contingency_pct`.

---

## 2. Project-Management Triple Constraint Applied to Carpentry

**Plain-language framing for the customer:**

> Every project balances three things: **Price** (what you pay), **Quality** (materials, finish, and detail), and **Time** (how fast it's done). You can optimize for any two, but the third has to flex. Pick what matters most and we'll build the plan around it.

- **Price** = your budget. Pushing it down means simpler materials, fewer custom details, standard finishes.
- **Quality** = the materials, joinery, finish, and level of customization. Higher quality = more hand-work and better wood.
- **Time** = how quickly we start and finish. Speed costs money (overtime, expedited materials, dedicated crew) or costs quality (less cure time, fewer detail passes).

### Priority → Concrete Adjustments

| Customer priority | Scope | Material tier | Finish level | Schedule | Price multiplier |
|---|---|---|---|---|---|
| **Best Price + Quality** *(sacrifice speed)* | Trim to essentials; value-engineer non-visible areas; standard sizes to cut waste | Premium materials where seen, Essential where hidden | Full-quality finish, but **batched with other jobs** | Longest lead — we slot it into shop downtime & batch material orders (typ. **+3–6 weeks**) | **×0.90–0.95** |
| **Fast + Quality** *(sacrifice price)* | Full scope, no compromise; nothing deferred | Premium/Signature, expedited/in-stock species only | Highest finish, but may use **faster-curing catalyzed coatings** & added crew | Dedicated crew, expedited materials, possible overtime (**−30–50% timeline**) | **×1.20–1.40** |
| **Best Price + Fast** *(sacrifice quality)* | Reduced scope; off-the-shelf components; minimize custom milling & scribe | Essential tier; stock profiles & sizes; melamine/MDF over hardwood | Basic finish (factory-prefinished or single-coat); fewer detail passes | Quick because pre-made parts & simple finish (**−20–40% timeline**) | **×0.80–0.90** |
| **Balanced** *(recommended default)* | Right-sized scope; custom where it matters, standard where it doesn't | **Premium** throughout | Sprayed conversion-varnish / soft-close standard | Normal lead time & standard crew | **×1.00 (baseline)** |

*Multipliers stack on the tier base price, not on each other. Always present **Balanced/Premium** as the recommended default and quote the others as explicit trade-offs.*

---

## 3. Estimate Confidence Model

Confidence sets the **range we quote** (low–high) around the point estimate. It is scored from six factors; the **lowest-scoring factor caps the overall confidence** (a single big unknown — e.g., unverified measurements or suspected hidden rot — drags the whole estimate down).

### Qualifying Criteria

| Factor | High | Medium | Low |
|---|---|---|---|
| **Measurement verification** | On-site measured by us, or client measurements confirmed against photos | Client-provided measurements, plausible | Estimated from photos only / no measurements |
| **Photo quality** | Multiple clear, well-lit photos from several angles + context | A few usable photos | Blurry, partial, or no photos |
| **Scope clarity** | Fully specified: style, species, finish, counts all known | Mostly defined, a few open decisions | Vague ("some shelves," "fix the trim") |
| **Home age / condition** | New/recent build, square & plumb | 1980s–2000s, minor settling | Pre-1980 / visible settling / unknown behind surfaces |
| **Install complexity** | Simple, accessible, standard mounting | Moderate (some scribe, normal height) | High (vaulted, masonry, structural, tight access) |
| **Material certainty** | Species, profile, finish all selected & in-stock | Material chosen, availability unconfirmed | Custom milling / matching existing / specialty species |

**Scoring rule:** All six High → **High**. Any factor Low, or 3+ factors Medium → **Low**. Otherwise → **Medium**. (Conservative: bias downward when in doubt.)

### Range Multipliers (applied to the point estimate)

| Confidence | Low multiplier | High multiplier | Effective spread | Customer-facing language |
|---|---|---|---|---|
| **High** | **×0.92** | **×1.12** | ~±10% | "Firm estimate — minor variation only after final measure." |
| **Medium** | **×0.85** | **×1.25** | ~−15% / +25% | "Working estimate — refined after on-site visit." |
| **Low** | **×0.70** | **×1.50** | ~−30% / +50% | "Ballpark range — site inspection required before we commit." |

**Worked example:** Premium built-in, point estimate $8,000.
- High confidence → **$7,360 – $8,960**
- Medium → **$6,800 – $10,000**
- Low → **$5,600 – $12,000**

**Operational rules:**
- Low confidence **requires an on-site visit** before any contract; the quote is explicitly labeled non-binding.
- Repairs and any "match-existing / custom-milling" scope **start at Low** regardless of photos.
- Pre-1980 Front Range homes auto-cap **Home age/condition at Medium** at best (lath-and-plaster, out-of-square framing, hidden conditions).
- Display the **High-confidence path** to the customer (what to provide: measurements, clear photos, finish selections) to move them up a tier and tighten the range.

---

# Materials Rate Table — Front Range / Denver Metro (2025 est.)

> **All figures are editable estimates. Verify against a live supplier quote before issuing any client estimate.** Prices reflect Denver-metro retail/contractor rates as of 2025 and exclude sales tax (Denver combined ~8.81%) and delivery unless noted. "Typical Cost" is the *material cost to Cruz* (your buy price), not the client-facing line. Apply the Suggested Markup, then the Waste Factor on top of net quantity. Many materials span tiers.

### Sheet Goods

| Material | Category | Unit | Typical Denver Cost (2025 est.) | Markup % | Waste % | Tier | Source | Notes |
|---|---|---|---|---|---|---|---|---|
| 3/4" MDF | Sheet good | sheet 4x8 | $48 | 20% | 10% | Essential | Home Depot / Lowe's | Heavy (~95 lb); paint-grade only. Seal edges before paint. |
| 1/2" MDF | Sheet good | sheet 4x8 | $36 | 20% | 10% | Essential | Home Depot / Lowe's | Back panels, shaker center panels. |
| 3/4" paint-grade plywood (G1S/shop) | Sheet good | sheet 4x8 | $62 | 25% | 12% | Essential / Premium | Home Depot, Austin Hardwoods | Cleaner machining than MDF. |
| 3/4" birch plywood (cabinet-grade, PureBond) | Sheet good | sheet 4x8 | $118 | 30% | 12% | Premium | Austin Hardwoods, Home Depot | Verified ~$110–140 live. Standard box/carcase material. |
| 1/2" birch plywood (cabinet-grade) | Sheet good | sheet 4x8 | $78 | 30% | 12% | Premium | Austin Hardwoods | Drawer boxes, backs, partitions. |
| 3/4" maple plywood (cabinet-grade) | Sheet good | sheet 4x8 | $135 | 32% | 12% | Premium / Signature | Austin Hardwoods, Paxton | A1 face; tighter grain than birch. |
| 3/4" prefinished maple plywood (UV) | Sheet good | sheet 4x8 | $115 | 30% | 12% | Premium / Signature | Austin Hardwoods, Paxton | Pre-finished interiors save a finish step. |
| 3/4" rift/quarter-sawn white oak veneer ply | Sheet good | sheet 4x8 | $215 | 35% | 14% | Signature | Austin Hardwoods, Paxton, B&B | Slip/book-match adds cost; order by lot for grain. |
| 1/4" backer ply (birch/maple) | Sheet good | sheet 4x8 | $42 | 25% | 10% | All | Austin Hardwoods, Home Depot | Match face species if visible. |

### Hardwood Lumber (board foot, S4S / surfaced)

| Material | Unit | Typical Cost (2025 est.) | Markup % | Waste % | Tier | Source | Notes |
|---|---|---|---|---|---|---|---|
| Poplar | board foot | $4.50 | 30% | 15% | Essential | Austin Hardwoods, Paxton | Best paint-grade solid; stains poorly. |
| Pine — select | board foot | $4.25 | 30% | 15% | Essential | Home Depot, Austin Hardwoods | Knot-free; stable for trim/paint. |
| Pine — common (#2) | board foot | $2.40 | 30% | 18% | Essential | Home Depot, Lowe's | Knotty; rustic/utility. Higher waste. |
| Soft maple | board foot | $5.50 | 32% | 15% | Premium | Austin Hardwoods, Paxton | Good paint/light-stain alt to hard maple. |
| Hard maple | board foot | $7.50 | 32% | 15% | Premium / Signature | Austin Hardwoods, Sears Trostel | Dense; blotches under stain (condition first). |
| Red oak | board foot | $6.00 | 30% | 15% | Premium | Austin Hardwoods, Paxton | Open grain; economical traditional look. |
| White oak (plain-sawn) | board foot | $8.50 | 32% | 15% | Premium / Signature | Austin Hardwoods, Sears Trostel | Closed grain, rot-resistant; current favorite. |
| White oak — rift/quarter-sawn | board foot | $13.50 | 35% | 18% | Signature | Austin Hardwoods, B&B Rare Woods | Straight grain/ray fleck; higher yield loss. |
| Cherry | board foot | $8.00 | 32% | 15% | Signature | Austin Hardwoods, Sears Trostel | Darkens with UV. |
| Walnut | board foot | $15.00 | 35% | 18% | Signature | Austin Hardwoods (verified $12–18), B&B | Steamed vs unsteamed affects color; sapwood = loss. |

*Board-foot pricing rises with thicker stock (8/4, 12/4) and figured grades — re-quote for non-4/4.*

### Trim & Moulding (linear foot)

| Material | Unit | Typical Cost (2025 est.) | Markup % | Waste % | Tier | Source | Notes |
|---|---|---|---|---|---|---|---|
| MDF base/casing (primed) | linear foot | $1.30 | 25% | 12% | Essential | Home Depot, Lowe's | Cheapest clean profile; avoid wet areas. |
| Pine base/casing | linear foot | $2.20 | 30% | 12% | Essential / Premium | Home Depot, Austin Hardwoods | Paintable or light stain. |
| Poplar trim (milled) | linear foot | $3.10 | 30% | 14% | Premium | Austin Hardwoods, Paxton | Crisp paint finish. |
| Hardwood trim (oak/maple/walnut, stain-grade) | linear foot | $6.50–14.00 | 32% | 15% | Premium / Signature | Austin Hardwoods, Paxton | Price tracks species. |
| Crown — simple single-profile (MDF/poplar) | linear foot | $3.50 | 30% | 15% | Essential / Premium | Home Depot, Austin Hardwoods | Standard 3.5–5.25" sprung crown. |
| Crown — built-up multi-piece (hardwood) | linear foot | $11.00–22.00 | 35% | 18% | Signature | Custom-milled / Paxton | 2–4 stacked members + labor; price per assembled LF. |

> **Profile-complexity note:** trim cost scales with (1) species, (2) number of milled members, (3) profile depth. Built-up crown is priced by the *assembled* LF. Custom router/shaper profiles add a one-time knife/setup charge ($75–250) amortized over the run — flag short runs as setup-cost-sensitive.

### Hardware

| Material | Unit | Typical Cost (2025 est.) | Markup % | Tier | Source | Notes |
|---|---|---|---|---|---|---|
| Concealed Euro hinge (soft-close) | each | $4.50 econ / $7.50 Blum | 35% | All | Rockler, Richelieu | 2–3 per door. Blum on Premium+. |
| Undermount soft-close slide (Blum Tandem) | pair | $28 | 35% | Premium / Signature | Rockler, Richelieu | Full-extension; default upgrade. |
| Side-mount ball-bearing slide | pair | $11 | 35% | Essential | Home Depot, Rockler | Full-ext ~$14; 3/4-ext ~$7. |
| Cabinet pull/knob | each | $3 / $9 / $22+ | 40% | All | Home Depot, Top Knobs, Emtek | Client-selected; treat as allowance if undecided. |
| Shelf pin/bracket (5mm) | each | $0.40 | 40% | All | Rockler, Richelieu | 4 per shelf; buy by box. |
| Hidden floating-shelf rod/bracket (steel) | each | $18 | 40% | Premium / Signature | Rockler, Richelieu | Rate per rod; size to depth/load. |
| Lazy Susan (2-shelf) | each | $95 | 35% | Premium / Signature | Rev-A-Shelf | Corner-cabinet upgrade. |
| Cabinet lift (Blum Aventos) | each | $145 | 35% | Premium / Signature | Richelieu | Gas-strut upper-door lift. |
| Base pull-out (waste/pantry, soft-close) | each | $130 | 35% | Premium / Signature | Rev-A-Shelf | Sized to cabinet width. |

### Fasteners & Adhesives

| Material | Unit | Typical Cost (2025 est.) | Markup % | Tier | Notes |
|---|---|---|---|---|---|
| Pocket screws (Kreg, coarse) | box (~1,000) | $42 | 20% | All | Small box (~250) ~$13. |
| Finish nails (15/16ga) | box | $35 | 20% | All | Per coil/strip box. |
| Wood glue (Titebond II / III) | gallon | $26 / $40 | 20% | All | III = water-resistant. |
| Construction adhesive (PL Premium) | tube (10 oz) | $7 | 20% | All | 28 oz ~$11. |
| Edge banding — pre-glued veneer | roll (250 ft) | $55 | 25% | Premium / Signature | ~$0.22/LF iron-on. |
| Edge banding — per LF basis | linear foot | $0.25 | 25% | Premium / Signature | For small jobs / LF estimating. |

### Finishes (cost per gallon + coverage)

| Material | Unit | Typical Cost (2025 est.) | Coverage (sf/gal) | Markup % | Waste % | Tier | Notes |
|---|---|---|---|---|---|---|---|
| Primer (bonding, BIN/Cover Stain) | gallon | $42 | 300–400 | 25% | 12% | All | Shellac/oil bonding for MDF + slick surfaces. |
| Cabinet/trim paint (SW Emerald Urethane / BM Advance) | gallon | $90 | 350–450 | 25% | 12% | Essential / Premium | Self-leveling enamel; 2 coats. |
| Wood stain (oil/gel) | gallon | $48 | 300–400 | 25% | 12% | Premium / Signature | Quart ~$16; test on actual species. |
| Polyurethane / clear coat | gallon | $60 | 400–500 | 25% | 12% | Premium | 2–3 coats; oil ambers, water stays clear. |
| Conversion varnish / pro spray lacquer | gallon | $75 / $95 (CV) | 200–300 sprayed | 25% | 15% | Signature | Booth-sprayed; highest durability + overspray waste. |

> **Per-tier finish-system guidance ($/sf of finished surface):** Essential (primer + brushed enamel / single-coat stain) **$2.50–4.00/sf**; Premium (sprayed enamel or stain + 2-coat poly) **$5.00–8.00/sf**; Signature (multi-step stain/glaze + catalyzed conversion varnish) **$9.00–16.00/sf**. Rule of thumb: a 20-LF kitchen's finishing alone runs ~$1,200 (Essential) to ~$5,000+ (Signature). Treat finishing as its own line, not folded into material.

### Delivery & Waste Factors

| Item | Unit | Typical Cost (2025 est.) | Notes |
|---|---|---|---|
| Supplier delivery (Austin Hardwoods / Paxton, metro) | per drop | $75–150 | Often free over a $500–1,000 order; ~25 mi radius. |
| Big-box delivery (Home Depot/Lowe's flatbed) | each | $79–99 | Flat fee; sheet-good lead times vary. |
| Specialty/figured freight (out-of-metro) | each | $150–400 | Sears Trostel (Loveland), B&B (Littleton) bundle on routes. |

**Recommended waste factors by material class:** Sheet goods 10–12% (14% for grain-matched veneer); solid hardwood 15% (18–20% from rough stock); premium/figured (walnut, rift QSWO) 18%; trim & moulding 12–15% (18% on built-up crown / short rooms); hardware/fasteners 3–5%; finishes 12% (15% for catalyzed sprays).

> **Contingency note:** waste factors are *quantity* buffers, not profit contingency. Carry a separate **project contingency of 8–12%** (Essential→Signature) on the total estimate to absorb price drift between bid and buy, change orders, and field surprises. On Signature work with long-lead figured lumber, lock material pricing with the supplier or carry 15%.

### How to Read & Maintain This Table

- **Markup vs. margin — don't confuse them.** *Markup* is added to cost; *margin* is the profit share of the sell price. A 30% markup is only a ~23% margin (markup% / (100 + markup%)). To hit a target margin, divide cost by (1 − margin): for a 40% margin, multiply cost by **1.667** (a 66.7% markup), *not* 1.40. Pick target-margin or target-markup and apply consistently.
- **When to re-check prices.** (1) **Quarterly** baseline; (2) before any estimate over ~$10k; (3) on tariff/lumber-futures swings or supplier price-list updates. Sheet goods and softwood pine move fastest; figured hardwoods spike on supply shocks. Always pull a *live* quote on walnut, rift/QSWO, and special-order veneer.
- **Per-tier material multipliers (rationale).** Tiers differ by species/grade, hardware spec, and finish system. Apply a material multiplier to an Essential baseline takeoff for a fast first pass, then refine with line items:

| Tier | Material multiplier | What drives it |
|---|---|---|
| Essential | **1.0** | MDF/paint-grade ply, poplar/pine, side-mount slides, econ hinges, brushed enamel. |
| Premium (default) | **1.5** | Cabinet-grade birch/maple ply, soft/hard maple & oak, Blum undermount soft-close, sprayed enamel/poly. |
| Signature | **2.4** | Walnut/cherry/rift-QSWO, prefinished/veneer ply, Blum Tandem + lifts/pull-outs, conversion-varnish booth finish. |

> Multipliers are *material-only* shorthand for early budgeting; they do **not** include the labor premium luxury work carries. Tune to your last 5–10 jobs and revisit annually.

### Sourcing Note

Verify all figures against live Denver-area quotes before quoting a client. For hardwood lumber and cabinet-grade sheet goods, the primary references are **Austin Hardwoods (Denver)** (broadest Front Range inventory, S4S + sheet stock) and **Frank Paxton Lumber Co. (Denver)**; **Sears Trostel (Loveland/Ft. Collins)** for figured/wide hardwoods on northern jobs; **B&B Rare Woods (Littleton)** for exotics, walnut, and rift/quarter-sawn white oak. For hardware, finishes, fasteners, and specialty items cross-check **Rockler** and **Woodcraft (Denver)** (Blum, Rev-A-Shelf, edge banding, conversion varnish). Use **Home Depot** and **Lowe's** to baseline commodity sheet goods, MDF, pine/common lumber, primers, paints, fasteners — and to confirm same-day availability when a supplier is on lead time.

---

I have national OEWS percentiles and corroborated Colorado/Denver figures. The Denver metro all-occupation mean ($38.45) and Colorado carpenter-specific figure (~$28.51 national mean; Denver runs a premium) are confirmed across sources. I have enough to build the model with properly labeled estimates where exact metro carpenter cells aren't published. Compiling the final spec section now.

---

## Labor-Rate & Shop-Economics Model — Colorado Front Range / Denver Metro

**Data basis & date:** BLS OEWS reference period **May 2024** (Colorado's release was delayed to **July 23, 2025** due to the state's UI-system modernization; older Denver-metro carpenter cells were suppressed in the delayed release). National carpenter percentiles below are pulled from the OEWS-mirrored O*NET file (47-2031, May 2024). Denver-metro and finish-specialty figures are triangulated from PayScale / Salary.com / ZipRecruiter / Indeed (2025–2026 snapshots) and cross-checked against the Denver all-occupation mean of **$38.45/hr** (BLS, May 2024). Where a precise metro cell is unpublished, the figure is labeled **(est.)**. Wages vary ±15–25% by experience, union vs. open-shop, and project tier.

### 1) Wage & Billable-Rate Summary Table

| Role | Typical Denver hourly WAGE (what you pay) | Typical market BILLABLE rate (what you charge) | Source |
|---|---|---|---|
| Carpenter — national OEWS benchmark (47-2031) | Median $30.59 / Mean $28.51; P25 $22.86, P75 $36.36, P90 $47.30 | n/a (input, not billed) | BLS/O*NET OEWS May 2024 |
| Apprentice / helper carpenter (Denver) | $20–$26 (est.) | $55–$75 | ZipRecruiter/Indeed 2025–26 |
| Journeyman carpenter (Denver) | $30–$36 (Journeyman avg $31.36) | $75–$105 | PayScale/Salary.com 2025 |
| Finish / trim carpenter (Denver) | $28–$40 (avg ~$31–$32) | $85–$125 | PayScale/ZipRecruiter 2026 |
| Cabinet installer (Denver) | $24–$35 (avg $24.47–$30; specialists $30–$40) | $85–$130 | ZipRecruiter Jul-2025/Indeed |
| Lead carpenter / foreman (Denver) | $35–$45 (est.) | $105–$140 | PayScale Lead/Foreman 2025 |
| Shop fabricator / cabinetmaker (51-7011) | $26–$38 (est.) | $75–$110 (shop time) | WoodWeb; OEWS 51-7011 |
| Designer / PM (in-house) | $35–$55 / salaried equiv. | $95–$150 (design/PM rate) | Toggl/ServiceTitan norms |

Reference anchors: Denver-Aurora **all-occupation mean = $38.45/hr** (BLS May 2024); Colorado **all-occupation mean = $36.33/hr**; national carpenter mean **$28.51/hr**. Denver carpenters run roughly **5–12% above** the national carpenter mean given local cost of living, supporting a **$30–$34 journeyman wage** as the realistic build-up base.

### 2) Billable-Rate Build-Up — Worked Model

Start from a **journeyman base wage of $32.00/hr**. Each layer is shown as a dollar add and as a percentage of the running subtotal.

**Step A — Labor burden** (employer cost on top of wage)
| Component | % of base wage | $ on $32.00 |
|---|---|---|
| FICA (Social Security + Medicare) | 7.65% | $2.45 |
| FUTA + Colorado SUTA (unemployment) | 2.5% | $0.80 |
| Workers' comp (carpentry class ~code 5403, mid Colorado rate) | 9.0% | $2.88 |
| General liability allocation (per labor hour) | 3.0% | $0.96 |
| Health/benefits + PTO/holiday accrual | 11.0% | $3.52 |
| Small tools, PPE, phone/vehicle stipend per worked hr | 2.5% | $0.80 |
| **Labor burden subtotal** | **~35.7%** | **$11.41** |

**Fully burdened cost of a worked hour = $32.00 + $11.41 = $43.41/hr.** (35.7% burden sits in the 30–40% band typical for open-shop Colorado finish carpentry; roofing/structural runs higher.)

**Step B — Utilization (non-billable factor).** Not every paid hour is billable (drive time, shop cleanup, estimating, rework, rain/PTO). At **70% billable utilization** (≈1,456 billable hrs of ~2,080 paid), divide the burdened cost by 0.70:
- Cost recovery floor = $43.41 ÷ 0.70 = **$62.01/hr** just to break even on that worker.

**Step C — Overhead allocation** (costs not tied to one worker; spread over billable hours). For a 3–5 person Front Range shop, monthly overhead and the per-billable-hour load:

| Overhead item | Monthly | Per billable hr* |
|---|---|---|
| Shop/warehouse rent + utilities (Denver light-industrial) | $3,500 | $7.21 |
| Machinery depreciation + blade/bit/abrasive wear | $1,100 | $2.27 |
| Shop consumables (glue, fasteners, sandpaper, finish supplies non-billed) | $700 | $1.44 |
| Trucks: payment, fuel, insurance, maintenance | $1,800 | $3.71 |
| Software, accounting, marketing, licensing, office | $1,400 | $2.88 |
| Owner/admin & design time not directly billed | $2,800 | $5.77 |
| **Overhead subtotal** | **$11,300** | **$23.28** |

*Basis: 4 billable field/shop staff × 1,456 billable hrs ÷ 12 ≈ **485 billable hrs/month**; $11,300 ÷ 485 ≈ $23.28.

- Running rate after overhead = $62.01 + $23.28 = **$85.29/hr**.

**Step D — Warranty / callback reserve.** Add **3%** for punch-list returns and material warranty: $85.29 × 1.03 = **$87.85/hr**.

**Step E — Target net profit.** Apply margin by dividing (not multiplying) by (1 − margin):
- At **15% net:** $87.85 ÷ 0.85 = **$103.35/hr**
- At **20% net:** $87.85 ÷ 0.80 = **$109.81/hr**
- At **25% net:** $87.85 ÷ 0.75 = **$117.13/hr**

**Recommended shop billable rate (single blended journeyman seat):**

| | Rate | Built on |
|---|---|---|
| **LOW** | **$95/hr** | tighter overhead or 75% utilization, 12–15% net |
| **MID** | **$110/hr** | the model above, 20% net |
| **HIGH** | **$135/hr** | finish specialist, 65% utilization, 25%+ net, premium positioning |

Sensitivity worth noting: dropping utilization from 70% → 65% raises the break-even floor from $62.01 to $66.78 (+7.7%); every 1% of workers' comp moves the final rate ~$0.55–$0.65. Review burden and overhead **annually**.

### 3) Recommended Billable Rates by Tier and by Activity

**By activity** (blended crew, MID column from above as anchor):

| Activity | LOW | MID | HIGH | Notes |
|---|---|---|---|---|
| Shop fabrication (build) | $85 | $100 | $120 | Lower drive/install overhead, higher machine cost |
| On-site install | $95 | $115 | $140 | Travel, site protection, coordination loaded in |
| Finishing / spray | $90 | $110 | $135 | Booth/extraction, masking, multi-coat cure time |
| Design / PM / detailing | $95 | $125 | $160 | Often capped or folded into deposit |

**By market tier** (blended, all-in field+shop rate the customer effectively pays):

| Tier | Blended billable rate | Positioning |
|---|---|---|
| **Essential** (paint-grade, MDF/ply, budget) | **$85–$95/hr** | Run leaner crew, helper-heavy mix, standard profiles |
| **Premium** (recommended default; best balance) | **$105–$120/hr** | Journeyman-led, mix of stain + paint-grade hardwood ply |
| **Signature** (luxury hardwoods, white-glove) | **$130–$165/hr** | Lead-carpenter + dedicated finisher, hand-fit, site protection, PM included |

### 4) Productivity Benchmarks for Estimating

Real labor-hour ranges (build + install separated where relevant). Use the higher end for hardwood/Signature, lower end for paint-grade/Essential. Add 10–20% for old, out-of-level Front Range homes.

| Item | Labor range | Notes |
|---|---|---|
| Cabinet — **build** per LF (shop) | 2.0–4.0 hr/LF | Frameless ~2–3; face-frame 3–4. ~200–250 boxes/wk in a small-medium shop |
| Cabinet — **install** per LF (on-site) | 0.75–1.5 hr/LF | Uppers slower than bases; scribing/filler adds time |
| Upper + lower run combined (build+install) | 3.5–6.0 hr/LF | Drives the $300–$750/LF custom retail seen in market data |
| Built-in bay (e.g., 3 ft wide, floor-to-ceiling) | 8–16 hr/bay | Shelving + face frame + paint-grade; doors/glass push higher |
| Floating shelf (solid, blind-bracket) | 1.0–2.5 hr each | Includes blocking + leveling |
| Crown molding install | 0.17–0.43 hr/LF (≈10–26 min/LF) | Each inside/outside corner adds ~0.25–0.4 hr; two-piece built-up crown ~doubles base time |
| Baseboard install | 0.10–0.20 hr/LF | Long straight runs at the low end |
| Door/window casing | 0.5–1.0 hr per opening side | Mitered vs. plinth/rosette affects time |
| Hang interior pre-hung door | 1.0–2.0 hr each | Slab into existing jamb 2–4 hr; replace jamb adds time |
| Hang exterior door (weatherproofed) | 2.5–4.0 hr each | Threshold, flashing, weatherstrip |
| Wainscoting / accent wall (panel/board-and-batten) | 0.35–0.75 hr/SF | Layout-heavy; pattern complexity drives the range |
| Fireplace surround / mantel | 12–30 hr | Material + hearth detailing dependent |
| Spray finish (shop, doors/parts) | 60–120 SF/hr per coat; commercial ~200 LF/day | Plan 2–3 coats; charge each face/step. Pre-cat lacquer or conversion varnish typical |
| Stain + topcoat (hardwood, multi-step) | 30–60 SF/hr per step | Hand-wipe stain slower than spray |

**Estimating shortcut:** for a Premium-tier custom kitchen of ~40 LF, the WoodWeb/field consensus of "~2 weeks of work" implies **70–90 build+install labor hours** before finishing — at the MID $110/hr blended rate that's **$7,700–$9,900 labor**, consistent with the $300–$750/LF retail band once materials, finishing, and margin are layered in.

---

**Sources:**
- [BLS OEWS Denver-Aurora-Centennial, May 2024](https://www.bls.gov/regions/mountain-plains/news-release/occupationalemploymentandwages_denver.htm) (all-occupation mean $38.45/hr)
- [O*NET / BLS OEWS Carpenters 47-2031, May 2024](https://www.onetonline.org/link/localwages/47-2031.00?st=CO) (national median $30.59, mean $28.51, P25 $22.86, P75 $36.36, P90 $47.30)
- [Colorado CDLE OEWS 2024 press release](https://cdle.colorado.gov/press-releases/press-release-colorado-occupational-employment-and-wages-2024)
- [BLS notice — Colorado May 2024 OEWS publication delay](https://www.bls.gov/oes/notices/2025/colorado-may-2024-oews-estimates.htm)
- [PayScale Journeyman Carpenter, Denver](https://www.payscale.com/research/US/Job=Journeyman_Carpenter/Hourly_Rate/761dc5bf/Denver-CO) · [PayScale Finish Carpenter, Denver](https://www.payscale.com/research/US/Job=Finish_Carpenter/Hourly_Rate/45a8e45a/Denver-CO)
- [ZipRecruiter Cabinet Installer, Denver](https://www.ziprecruiter.com/Salaries/Cabinet-Installer-Salary-in-Denver,CO)
- [SmartBarrel — labor burden in construction](https://smartbarrel.io/blog/labor-burden-in-construction/) · [Markup & Profit — recover overhead and profit in your labor rate](https://www.markupandprofit.com/articles/recover-overhead-and-profit-in-your-labor-rate/) · [ServiceTitan — billable labor rate](https://www.servicetitan.com/field-service-management/billable-labor-rate)
- [WoodWeb — Bid Pricing for Cabinet Jobs](https://woodweb.com/knowledge_base/Bid_Pricing_For_Cabinet_Jobs.html) (shop rate $65–$125/hr; $60–$75/LF raw box) · [WoodWeb — Fine Points of Linear-Foot Pricing](https://woodweb.com/knowledge_base/Fine_Points_of_LinearFoot_Pricing.html)
- [HomeGuide — crown molding cost/time](https://homeguide.com/costs/crown-molding-cost) · [Angi — custom cabinets cost 2026](https://www.angi.com/articles/custom-cabinets-cost.htm)

---

I'll produce the complete pricing calculator specification using the upstream research numbers.

## Pricing Calculator Specification — Cruz Carpentry Estimator

*Front Range / Denver metro, 2026. All multipliers and rates below are editable defaults intended for a config table, not quotes. Built on the labor model ($43.41 burdened cost, $110/hr MID blended billable) and the per-project-type estimation research above.*

---

## 1. Master Variable & Parameter List (All Defaults)

### 1.1 Tier Material Multipliers (`tier_multiplier`)
Applied to the base unit rate to set material/finish grade. The base unit rates in Section 3 are anchored at **Premium = 1.00**.

| Tier | `tier_multiplier` | Default profit margin (net) | Notes |
|---|---|---|---|
| Essential | **0.72** | 0.13 | Paint-grade MDF/poplar/birch ply, slab/Shaker |
| Premium *(default)* | **1.00** | 0.20 | Furniture-grade ply, hardwood faces, sprayed CV/2K, soft-close |
| Signature | **1.55** | 0.25 | Solid hardwood/rift oak/walnut, inset, hand-rubbed, white-glove |

### 1.2 Project-Type Multiplier (`project_type_multiplier`)
Captures inherent labor intensity / risk by category, applied after tier. Default **1.00** unless the category systematically runs hotter or cooler.

| Project type | `project_type_multiplier` |
|---|---|
| Built-ins | 1.00 |
| Custom cabinets / kitchens | 1.10 |
| Trim & moulding | 0.90 |
| Wainscoting / accent walls | 0.95 |
| Shelving / floating shelves | 0.85 |
| Closets | 0.95 |
| Custom furniture | 1.15 |
| Fireplace surround / mantel | 1.10 |
| Repairs | 1.20 |
| Installation-only | 0.80 |
| Design-build / full-room | 1.10 |

### 1.3 Complexity Multiplier (`complexity_multiplier`)

| Band | Value | Trigger examples |
|---|---|---|
| Simple | **0.90** | Straight runs, standard heights ≤8 ft, overlay doors, accessible |
| Moderate *(default)* | **1.00** | Some scribe, normal site, mix of doors/drawers |
| Complex | **1.30** | Inset doors, curves, vaulted/10 ft+, structural, tight access, veneer-match |

### 1.4 Finish Multiplier (`finish_multiplier`)
Applied to the **finishing** cost line (Section 2), not the whole job.

| Finish level | Value |
|---|---|
| None / raw (install-only, client finishes) | **0.00** |
| Paint-grade, brushed/rolled or single-coat spray | **0.85** |
| Sprayed conversion varnish / 2K (Premium default) | **1.00** |
| Stain + multi-step topcoat (hardwood) | **1.35** |
| Hand-rubbed / catalyzed heirloom (Signature) | **1.70** |

### 1.5 Access Multiplier (`access_multiplier`)
Applied to **labor hours**.

| Access | Value |
|---|---|
| Easy (ground floor, clear, ≤8 ft) | **1.00** |
| Moderate (stairs, 9–10 ft, some protection) | **1.10** |
| Difficult (vaulted, scaffold, tight, occupied luxury home) | **1.25** |

### 1.6 Demolition Multiplier (`demolition_multiplier`)
Added as a **separate labor-hour block** = `demo_factor × base_install_hours`.

| Scope | `demolition_multiplier` |
|---|---|
| None | **0.00** |
| Light (remove existing trim/shelving, haul) | **0.15** |
| Moderate (rip out old cabinets/built-in) | **0.30** |
| Heavy (full kitchen tear-out + disposal) | **0.50** |

### 1.7 Install-Difficulty Multiplier (`install_difficulty_multiplier`)
Applied to the **install labor-hour** portion only.

| Difficulty | Value |
|---|---|
| Easy | **1.00** |
| Moderate (normal scribe/level) | **1.15** |
| Hard (heavy shimming, masonry/tile anchoring, inset precision) | **1.35** |

### 1.8 Design / Detailing Multiplier (`design_detailing_multiplier`)
Selects the design-fee model (Section 2, `design_admin`).

| Design status | Fee model | Default |
|---|---|---|
| Client supplies full plans | flat | **$0** |
| Concept exists, we detail | % of subtotal | **6%** (min $500) |
| Design from scratch | % of subtotal | **10%** (min $750, max $3,500) |
| Design-build / multi-room | % of subtotal | **8% PM uplift + design fee** |

### 1.9 Rush / Timeline Multiplier (`rush_multiplier`)
Applied to **subtotal** (after margin, before confidence). Mirrors the triple-constraint table.

| Timeline option | `rush_multiplier` | Profit-margin override |
|---|---|---|
| Batched / flexible (sacrifice speed) | **0.92** | keep tier margin |
| Standard (default) | **1.00** | keep tier margin |
| Fast + Quality (expedited, dedicated crew) | **1.30** | bump net to **0.27** |
| Best-Price + Fast (reduced scope, stock parts) | **0.85** | net **0.12** |

### 1.10 Risk-Buffer Percentages (`risk_buffer`)
**Additive**, summed then applied once to subtotal. Cap total buffer at **+50%**.

| Risk factor | Buffer add |
|---|---|
| Home built pre-1980 (out-of-square, lath/plaster) | **+8%** |
| Unknown wall substrate / hidden conditions | **+7%** |
| Low-quality / missing photos | **+6%** |
| Unverified measurements (no on-site measure) | **+8%** |
| Complex install (vaulted/structural/masonry) | **+7%** |
| Matching existing profile/species/finish | **+10%** |
| Tight timeline coordination risk | **+5%** |
| Unknown rot/water extent (repairs) | **+12%** |

### 1.11 Profit Margins & Floors

| Parameter | Default |
|---|---|
| Essential net margin | **0.13** |
| Premium net margin | **0.20** |
| Signature net margin | **0.25** |
| Rush net-margin override | **0.27** |
| Margin application | divide by (1 − margin) |
| **Minimum project fee** | **$850** (Premium) · $550 (Essential) · $1,500 (Signature) |
| Repair **trip/service minimum** | **$275** (covers first 2 hrs + travel) |
| Warranty/callback reserve | **+3%** (baked into rate, applied to labor+material) |

### 1.12 Labor & Cost Constants

| Constant | Value | Source |
|---|---|---|
| `burdened_cost_hr` | **$43.41/hr** | burden build-up |
| `blended_billable_low` | **$95/hr** | rate model LOW |
| `blended_billable_mid` *(default)* | **$110/hr** | rate model MID |
| `blended_billable_high` | **$135/hr** | rate model HIGH |
| Shop fabrication rate | **$100/hr** | activity table MID |
| On-site install rate | **$115/hr** | activity table MID |
| Finishing/spray rate | **$110/hr** | activity table MID |
| Design/PM rate | **$125/hr** | activity table MID |
| `waste_factor` (sheet goods) | **1.30** | board-foot/sheet waste |
| `waste_factor_lumber` | **1.30** | furniture board-foot |
| `travel_rate` | **$0.70/mi** round-trip + **$45 mobilization/trip** | truck overhead |
| `default_round_trip_mi` | **30 mi** (Denver metro) | — |
| `mobilizations_per_job` | 1 (small) / 2 (multi-day) / 3+ (full-room) | — |

### 1.13 Material Unit Prices (Front Range yards, rough)

| Material | Price |
|---|---|
| Birch/maple plywood sheet (3/4", 4×8) | **$75** Essential / **$95** Premium / **$140** Signature (rift/walnut ply) |
| MDF sheet (3/4", 4×8) | **$48** |
| Poplar (paint-grade) | **$5/bf** |
| Soft maple | **$6/bf** |
| White oak | **$10/bf** |
| Walnut | **$15/bf** |
| Figured/quartersawn | **+60%** |
| Soft-close drawer slide pair | **$28** |
| Soft-close hinge (pair) | **$11** |
| Door/drawer pull | **$9** Essential / **$18** Premium / **$38** Signature |
| LED strip + driver | **$32/LF run** + **$90 driver** |
| Finish material (CV/2K) per coat | **$0.55/SF** |

---

## 2. Core Formulas

All geometry feeds the cost lines; cost lines roll into subtotal → margin → rush → risk → confidence range.

**Geometry**
- `square_inches = length_in × width_in`
- `square_feet = (length_in × width_in) / 144` — or `length_ft × width_ft`
- `cubic_inches = length_in × width_in × thickness_in`
- `linear_feet = sum(run_lengths_ft)`
- `board_feet = (length_in × width_in × thickness_in) / 144` *(per piece; thickness in nominal quarters → inches)*
- `sheet_count = CEILING((total_sf × layers × waste_factor) / 32)` — 32 = usable SF per 4×8 sheet

**Material cost**
- `sheet_material = sheet_count × sheet_price[tier]`
- `lumber_material = board_feet × species_$bf × waste_factor_lumber`
- `material_cost = (sheet_material + lumber_material + trim_stock + panel_stock) × tier_multiplier`

**Labor**
- `labor_hours_base = Σ(quantity × hr_per_unit[from productivity table])`
- `labor_hours = labor_hours_base × complexity_multiplier × access_multiplier`
- `install_hours = install_hours_base × install_difficulty_multiplier × access_multiplier`
- `demo_hours = demolition_multiplier × install_hours_base`
- `total_labor_hours = labor_hours + install_hours + demo_hours`
- `labor_cost = (shop_hours × $100) + (install_hours × $115) + (demo_hours × $115)` *(or single blended `total_labor_hours × $110` when not split)*

**Hardware**
- `hardware = Σ(hinges_pairs × hinge_price) + (slides × slide_price) + (pulls × pull_price) + specialty_storage_$`

**Finishing**
- `finish_sf = exposed_face_sf` (both faces of doors/shelves where applicable)
- `finishing = finish_sf × coats × $0.55 × finish_multiplier  +  (finish_labor_hours × $110)`
- `finish_labor_hours = finish_sf / rate_sf_per_hr` (spray 60–120 SF/hr → use 90; stain step 30–60 → use 45)

**Travel**
- `travel = (round_trip_mi × $0.70 + $45) × mobilizations`

**Design / Admin**
- `design_admin = max(design_min, subtotal_pre_design × design_pct)` *(capped at $3,500 for from-scratch)*
- For design-build: `pm_uplift = subtotal × 0.08` added on top.

**Roll-up**
- `direct_cost = material_cost + labor_cost + hardware + finishing + travel`
- `subtotal_pre_margin = direct_cost × 1.03` *(warranty reserve)*
- `margin_applied = subtotal_pre_margin / (1 − margin[tier])`
- `subtotal = margin_applied + design_admin (+ pm_uplift if design-build)`
- `rush_fee = subtotal × (rush_multiplier − 1)` *(can be negative for batched/value paths)*
- `risk_buffer_pct = MIN(0.50, Σ active_buffers)`
- `risk_buffer = (subtotal + rush_fee) × risk_buffer_pct`
- `point_estimate = MAX(minimum_project_fee[tier], subtotal + rush_fee + risk_buffer)`

**Confidence range (Section 4)**
- `total_estimate_low = point_estimate × confidence_low_mult`
- `total_estimate_high = point_estimate × confidence_high_mult`
- **Final customer-facing range** = `[total_estimate_low, total_estimate_high]`, rounded to nearest $50 (Essential) / $100 (Premium/Signature).

---

## 3. Per-Project-Type Calculator Logic

Each type defines: primary basis, the building-block rates (Premium-anchored; multiply by `tier_multiplier`), component adders applied as flat dollars, and how it feeds the formula. LF/SF base rates already embed labor+material+overhead+profit at Premium; for the engine, decompose into `material_cost`, `labor_cost`, `finishing`, `hardware` using the splits below so multipliers and confidence behave correctly. Where a fast path is needed, the **all-in LF/SF rate** can be used directly and only `confidence`, `rush`, and `risk_buffer` applied.

**Decomposition split of an all-in LF/SF rate** (for the detailed engine): material 30% · labor 45% · finishing 12% · hardware 8% · overhead/profit 5% residual (margin then re-derived). Use this only when not building bottom-up.

### 3.1 Built-Ins
- **Basis:** carcass per LF + component adders.
- **Building blocks (Premium):** $400–$700/LF carcass → engine default **$550/LF**. Inputs: `wall_run_length_ft`, `height_ft`, `depth_in`, `num_bays`, `shelves_per_bay`, `num_doors`+`door_style`+`overlay_or_inset`, `num_drawers`, `back_panel`, `crown_lightrail`, `integrated_lighting`, `scribe_sides`, `wood_species`, `finish_type`, `ceiling_out_of_square`, `obstructions`.
- **Adders (flat $, Premium):** adjustable shelf $40 · fixed/dadoed $65 · door paint-grade $120 / hardwood-inset $260 · drawer+soft-close slides $180 · scribe edge $130 · crown/light rail $25/LF · toe-kick $42/LF · LED $30/LF + $90 driver.
- **Roll-in:** `LF × carcass_rate` → split via decomposition OR build bottom-up (sheet_count for sides/shelves + lumber for face frame). Inset doors push `complexity_multiplier` to 1.30.

### 3.2 Custom Cabinets / Kitchens
- **Basis:** per LF split base(1.0×)/wall(0.75×)/tall(1.8×); islands per-unit.
- **Building blocks (Premium):** base LF default **$700/LF**; sanity-check vs **$250/door-or-drawer opening** labor sink; island $2,500–$8,000 → default $4,500.
- **Adders:** soft-close $24/opening · pull-out trash $310 · lazy susan $350 · spice pull-out $200 · under-cab LED $38/LF · glass mullion door +$185 · crown $26/LF · scribe filler $60 · toe-kick drawer $180.
- **Inputs:** `linear_feet_base/wall/tall`, `num_islands`+`island_size_ft`, `total_door_openings`, `total_drawer_openings`, `box_construction`, `overlay_or_inset`, `door_style`, `wood_species`, `finish_type`, `specialty_storage[]`, `under_cab_lighting`, `panel_ready_appliances`, `demo_existing`, `layout_type`, `ceiling_height_ft`, `countertop_by`.
- **Productivity check:** build 2–4 hr/LF + install 0.75–1.5 hr/LF; combined 3.5–6.0 hr/LF → use 4.5 hr/LF Premium for the labor line.

### 3.3 Trim & Moulding
- **Basis:** per LF installed, per profile.
- **Building blocks (Premium $/LF installed):** baseboard $6.50 / casing $7 (≈$70/opening) / crown single $10 / crown built-up $20 / chair rail $7. Stain-grade = apply `tier_multiplier` 1.55 → e.g. baseboard ~$10/LF.
- **Labor lines (productivity):** crown 0.30 hr/LF + 0.30 hr/corner; baseboard 0.15 hr/LF; casing 0.75 hr/opening-side.
- **Inputs:** `profile_types[]`, per profile `linear_feet`/`profile_size_in`/`pieces_buildup`/`material_grade`; `num_door_openings`, `num_window_openings`, `num_inside_corners`, `num_outside_corners`, `ceiling_height_ft`, `remove_existing_trim`, `home_year_built`, `walls_out_of_square`, `paint_by`.
- Built-up crown sets `complexity_multiplier` 1.30; pre-1980 home adds +8% risk and caps confidence.

### 3.4 Wainscoting / Accent Walls
- **Basis:** per SF covered.
- **Building blocks (Premium $/SF):** picture-frame $21 · B&B $26 · shiplap $23 · slat/fluted $45 · raised-panel $55. Default engine $/SF = chosen style midpoint.
- **Labor (productivity):** 0.35–0.75 hr/SF → use 0.5 hr/SF; +0.25 hr per outlet/switch cutout; +0.4 hr per window/door return.
- **Inputs:** `wall_width_ft`, `wall_height_ft`(→SF), `style`, `num_walls`, `num_outlets_switches`, `num_window_door_returns`, `top_cap`, `material_grade`, `wall_prep_needed`, `ceiling_height_ft`, `paint_by`.

### 3.5 Shelving / Floating Shelves
- **Basis:** per shelf (per-unit).
- **Building blocks (Premium):** $180–$380/shelf → default **$260** (hardwood, hidden cleat, ≤4 ft). +$48/ft beyond 4 ft · thickness >2.5" +40% · hidden steel-rod hardware +$65 · masonry/tile mount +$90.
- **Labor:** 1.0–2.5 hr/shelf → use 1.5 incl. blocking; +`needs_blocking_install` adds 0.5 hr.
- **Inputs:** `num_shelves`, `length_ft`, `depth_in`, `thickness_in`, `mount_type`, `wall_substrate`, `wood_species`, `edge_profile`, `finish_type`, `needs_blocking_install`.

### 3.6 Closets
- **Basis:** per LF wall + component adders.
- **Building blocks (Premium $/LF):** **$240/LF** (ply, adjustable, soft-close). Adders: 3-drawer bank $450 · hanging rod section $60 · shoe fence $50/LF · valet rod $65 · walk-in island $2,400 · hamper pull-out $250 · LED $30/LF.
- **Inputs:** `closet_type`, `total_wall_ft`, `num_corners`, `num_drawer_banks`+`drawers_per_bank`, `hanging_sections`, `num_shelves`, `island`+size, `material_grade`, `lighting`, `accessories[]`, `height_ft`, `doors_by`.

### 3.7 Custom Furniture
- **Basis:** bottom-up board-foot + shop hours (do NOT use LF).
- **Formula:** `(board_feet × species_$bf × 1.30) + (shop_hours × $100) + finishing + hardware`, then `× tier_multiplier × project_type_multiplier(1.15)`.
- **Reference shop hours:** dining table 25–60 (use 40) · platform bed 30–70 (use 50) · media console 35–80 (use 55) · desk 20–50 (use 35) · bench 8–20 (use 14).
- **Species $/bf:** poplar $5 · soft maple $6 · white oak $10 · walnut $15 · figured +60%.
- **Inputs:** `furniture_type`, `dimensions`(L×W×H), `wood_species`, `joinery_level`(basic/intermediate/heirloom → maps to complexity 0.9/1.0/1.3), `finish_type`, `num_drawers`, `hardware_notes`, `design_provided`, `quantity`, `leaves_extensions`.

### 3.8 Repairs
- **Basis:** hourly + materials with trip minimum. **Starts at Low confidence.**
- **Formula:** `MAX($275 trip_min, (est_hours × $95 carpenter | $115 finish) + materials) × project_type_multiplier(1.20)`, +12% unknown-rot buffer if `extent_known = no`.
- **Inputs:** `repair_items[]`(desc/location/severity), `match_existing_required`, `custom_milling_needed`, `damage_type`, `extent_known`, `home_year_built`, `photos`(required), `accessibility`, `finish_match`.
- `match_existing_required` or `custom_milling_needed` → +10% buffer and confidence capped Low.

---

## 4. Confidence Multipliers

Confidence is scored on six factors (measurement, photo, scope, home-age, install-complexity, material-certainty). **Lowest factor caps the result.** Scoring: all six High → High; any Low or 3+ Medium → Low; else Medium. Pre-1980 homes cap home-age at Medium; repairs/match-existing start Low.

| Confidence | `confidence_low_mult` | `confidence_high_mult` | Spread | Customer language |
|---|---|---|---|---|
| **High** | **0.92** | **1.12** | ±10% | "Firm estimate — minor variation after final measure." |
| **Medium** *(default)* | **0.85** | **1.25** | −15% / +25% | "Working estimate — refined after on-site visit." |
| **Low** | **0.70** | **1.50** | −30% / +50% | "Ballpark range — site inspection required before we commit." |

Low confidence forces a mandatory on-site visit and a non-binding label.

---

## 5. Three Fully Worked Examples

### (a) Premium Built-In Entertainment Wall

**Inputs:** 12 LF run, 9 ft tall, 16" deep, 3 bays. 6 adjustable shelves, 4 paint-grade-style hardwood doors (overlay), 2 drawers (soft-close), crown + light rail, integrated LED, 2 scribe sides (ceiling out-of-square), maple, sprayed CV. Home built 1998. On-site measured, good photos. Standard timeline. Round trip 30 mi, 2 mobilizations.

**Bottom-up:**
- **Material:** carcass sheet goods — exposed/structural SF ≈ 12 LF × 9 ft × ~1.8 surfaces ≈ 194 SF → `sheet_count = CEILING((194 × 1 × 1.30)/32) = CEILING(7.88) = 8 sheets × $95 = $760`. Face frame + door stiles maple ≈ 45 bf × $6 × 1.30 = $351. Trim/crown stock $140. Material subtotal = $1,251 × tier 1.00 = **$1,251**.
- **Labor:** built-in bays 3 × ~12 hr = 36 hr shop+install base. Crown/light rail 12 LF × 0.30 = 3.6 hr. Scribe 2 × 1.5 = 3 hr. Base = 42.6 hr. `× complexity 1.00 × access 1.00` (9 ft → moderate access 1.10) → 46.9 hr. Split ~60/40 shop/install: shop 28.1 hr × $100 = $2,810; install 18.8 hr × $115 = $2,162. **Labor = $4,972.**
- **Hardware:** 4 doors × 2 hinges × $11 = $88; 2 drawers × ($28 slide + assume box stock) = $56; 6 pulls × $18 = $108; LED $30×12 + $90 = $450. **Hardware = $702.**
- **Finishing:** exposed face SF ≈ 150 (doors both faces + shelves + face frame). `150 × 3 coats × $0.55 × 1.00 = $248` material; labor 150/90 = 1.67 hr × 3 coats ≈ 5 hr × $110 = $550. **Finishing = $798.**
- **Travel:** (30 × $0.70 + $45) × 2 = (21 + 45) × 2 = **$132.**

**Roll-up:**
- `direct_cost = 1,251 + 4,972 + 702 + 798 + 132 = $7,855`
- warranty `× 1.03 = $8,091`
- margin `/ (1 − 0.20) = $10,113`
- design_admin: concept exists → 6% of 10,113 = $607 (>min) → subtotal = **$10,720**
- rush standard → +$0
- risk_buffer: none active (1998 home, measured, good photos, no match) → 0%
- `point_estimate = MAX($850, $10,720) = $10,720`

**Confidence:** all factors High except install (9 ft + scribe = Moderate) and home-age (1998 = High). One Moderate → **Medium**.
- Low = 10,720 × 0.85 = $9,112 → round $9,100
- High = 10,720 × 1.25 = $13,400

**Customer-facing range: $9,100 – $13,400** *(Working estimate — refined after on-site visit.)* Point estimate ~$10,720.

---

### (b) Signature Kitchen by Linear Foot

**Inputs:** 40 LF total (24 LF base, 12 LF wall, 4 LF tall pantry) + 1 island (8 ft, finished 4 sides). 18 door openings, 10 drawer openings, frameless, **inset** doors, rift white oak, hand-rubbed finish. Specialty: pull-out trash, 2 lazy susans, under-cab LED full run. Panel-ready fridge + DW (2). Demo existing kitchen. Home 1972 (pre-1980). Client-confirmed measurements + good photos, but custom species + inset. Standard timeline. 30 mi, 3 mobilizations.

**LF-rate path (Signature anchor):** base $700/LF × tier 1.55 = ~$1,085/LF effective is high; use Signature LF band directly **$1,150/LF** weighted:
- Base 24 × 1.0 × $1,150 = $27,600
- Wall 12 × 0.75 × $1,150 = $10,350
- Tall 4 × 1.8 × $1,150 = $8,280
- LF subtotal = **$46,230**
- Island (Signature, finished 4 sides, 8 ft) = **$7,500**
- Cabinetry base = **$53,730**

**Adders:** pull-out trash $310; 2 lazy susans × $350 = $700; under-cab LED 36 LF × $38 = $1,368 + $90 driver; inset uplift handled via complexity. Specialty subtotal ≈ **$2,468.**

**Sanity check (door/drawer sink):** 28 openings × $250 = $7,000 labor floor — consistent, embedded in LF rate.

**Multipliers:** `project_type 1.10` (kitchen) and `complexity 1.30` (inset + frameless + island) apply to the labor-weighted portion. Applying a blended **×1.18 effective** to the cabinetry+specialty base ($56,198 × 1.18) = **$66,314** pre-finish-adjust. Hand-rubbed finish premium already in Signature LF rate; add stain-step labor delta: 40 LF × ~6 SF/LF = 240 SF doors/faces, but folded into rate — skip double count.

**Roll-up:**
- `direct/positioned cost = $66,314`
- warranty `× 1.03 = $68,303`
- Signature margin already in LF rate, but re-derive net target: rate band is retail-inclusive, so **do not re-divide**; treat $68,303 as subtotal_pre_design.
- Demo: moderate-heavy 0.30 of install hours. Install portion ≈ 40 LF × 1.5 hr = 60 hr × $115 = $6,900 → demo = 0.30 × 60 = 18 hr × $115 = $2,070. Add **$2,070**.
- Travel: (30×0.70 + 45) × 3 = $198.
- subtotal_pre_design = 68,303 + 2,070 + 198 = **$70,571**
- design_admin: design-from-scratch 10% capped $3,500 → **$3,500**; PM uplift design-build 8% × 70,571 = **$5,646**
- subtotal = 70,571 + 3,500 + 5,646 = **$79,717**
- rush standard → +$0
- risk_buffer: pre-1980 +8%, matching/custom species +10%, complex install +7% = +25% → 79,717 × 0.25 = **$19,929**
- `point_estimate = 79,717 + 19,929 = $99,646`

**Confidence:** measurement Medium (client-confirmed), home-age capped Medium (1972), material Low (custom rift oak + inset, milling/match). One Low factor → **Low**.
- Low = 99,646 × 0.70 = $69,752 → round $69,800
- High = 99,646 × 1.50 = $149,469 → round $149,500

**Customer-facing range: $69,800 – $149,500** *(Ballpark — on-site inspection required before we commit.)* This wide Low-confidence band correctly signals a luxury kitchen needs a site visit; point estimate ~$99,600 lands in the Signature full-kitchen band.

---

### (c) Essential Crown-Moulding Trim Run

**Inputs:** 80 LF single-piece crown, paint-grade MDF, 8 inside corners + 4 outside corners. 9 ft ceilings. No existing trim removal. Home built 2015 (square). Client measured + clear photos, finish painted by others. Standard timeline. 30 mi, 1 mobilization.

**Bottom-up:**
- **Material:** crown MDF stock 80 LF × ~$1.10/LF + waste ≈ $96 + corners blocks → call **$110.** Tier Essential 0.72 already reflected in low stock cost; keep $110.
- **Labor:** crown 80 × 0.30 = 24 hr + corners (8+4) × 0.30 = 3.6 hr = 27.6 hr base. `× complexity 0.90` (single-piece, square home) × `access 1.10` (9 ft) = 27.3 hr. Install rate $115 → **$3,140.** (Essential helper-heavy mix; could blend lower but keep install rate.)
- **Hardware:** none.
- **Finishing:** painted by others → finish_multiplier 0.00 → **$0.**
- **Travel:** (30×0.70 + 45) × 1 = **$66.**

**Roll-up:**
- `direct_cost = 110 + 3,140 + 0 + 0 + 66 = $3,316`
- warranty `× 1.03 = $3,415`
- margin Essential `/ (1 − 0.13) = $3,925`
- design_admin: client supplies plan → **$0** → subtotal = **$3,925**
- rush standard → +$0
- risk_buffer: none (2015 square home, measured, good photos) → 0%
- `point_estimate = MAX($550 Essential min, $3,925) = $3,925`

Sanity vs market: 80 LF single crown × $7–$12 Essential = $560–$960 material+labor-only retail — but that excludes the 9 ft staging and corner labor; our $3,925 reflects 27 install hours at shop billable, which is high for pure crown. **Adjustment:** Essential trim should bill at the **LOW blended $95/hr helper-led**, not $115 install. Re-run labor: 27.3 hr × $95 = $2,594. direct = 110 + 2,594 + 66 = $2,770 × 1.03 = $2,853 / 0.87 = **$3,279** point estimate. This aligns better (≈$41/LF installed all-in, sensible for 9 ft paint-grade crown).

**Confidence:** all factors High (2015 square home, measured, clear photos, stock MDF, simple install at 9 ft = borderline but accessible). → **High.**
- Low = 3,279 × 0.92 = $3,017 → round $3,000
- High = 3,279 × 1.12 = $3,672 → round $3,650

**Customer-facing range: $3,000 – $3,650** *(Firm estimate — minor variation only after final measure.)* Point estimate ~$3,280.

> Engine note from example (c): bind the labor billable rate to tier — Essential → $95/hr, Premium → $115/hr install / $100 shop, Signature → $135/hr — rather than always using the MID install rate, or Essential trim over-prices.

---

**Implementation note for the master doc:** store every value in Sections 1.1–1.13 as a single `pricing_config` table (key, value, unit, tier-scoped flag) so rates are editable without code changes. The formula chain in Section 2 is the canonical order of operations: **geometry → direct cost lines → warranty → margin → design/PM → rush → risk buffer → minimum-fee floor → confidence range → round.** Review burden, overhead, and material unit prices annually per the labor model's sensitivity guidance.

---

All existing tasks are complete and unrelated to this deliverable. I have the grounded data model I need: `public.leads` (id, created_at, name, phone, email, project_type, message, source), the 19 `PROJECT_TYPES`, the three market tiers, and the Supabase rate limiter. I'll synthesize the spec section now.

---

# Lead Scoring, CRM & Admin Operations Spec

This section defines the back-of-house revenue system that sits behind the estimate wizard: how every inbound lead is scored 0-100, categorized, routed with an SLA, managed in the admin dashboard, priced via an editable material-rate table, and worked through automated email/SMS sequences. It is grounded in the existing data model — `public.leads (id, created_at, name, phone, email, project_type, message, source)`, the 19 `PROJECT_TYPES` in `estimate-schema.ts`, and the three market tiers (Essential / Premium / Signature). Where the wizard adds fields beyond today's schema (tier, dimensions, photos, timeline, ZIP, homeowner status), the new columns are named explicitly so the migration is unambiguous.

---

## 1. Lead-Scoring System (0-100)

A lead's score is the sum of 11 weighted factors. Each factor has a fixed point ceiling; raw wizard answers map to a fraction of that ceiling via the rules below. **Weights sum to exactly 100.** Missing/unanswered inputs score per the explicit "unknown" rule for that factor (never silently 0 unless stated). Store the computed integer in a new `leads.lead_score smallint` column plus a `leads.score_breakdown jsonb` column holding the per-factor points for auditability.

### Weight allocation (sums to 100)

| # | Factor | Max pts | Why this weight |
|---|---|---:|---|
| 1 | Budget fit | 18 | Strongest single predictor of close + margin |
| 2 | Project size | 15 | Job value scales revenue directly |
| 3 | Luxury potential | 12 | Signature/Premium jobs carry the best margin |
| 4 | Timeline fit | 11 | Ready-to-go vs. "someday" gates real revenue |
| 5 | Decision readiness | 10 | Homeowner-as-decider + funded = closeable now |
| 6 | Scope clarity | 8 | Clear scope = accurate estimate, less spin |
| 7 | Photo quality | 7 | Good photos let the owner scope without a wasted trip |
| 8 | Measurement completeness | 5 | Dimensions sharpen the estimate range |
| 9 | Location / logistics | 5 | In-zone jobs are profitable; far ones erode margin |
| 10 | Homeowner status | 5 | Owner can authorize; renter usually can't |
| 11 | Material preference | 4 | A stated premium material signals intent + budget |
| | **Total** | **100** | |

### Scoring rules (raw answer → points)

**1. Budget fit — 18 pts.** Wizard field `budget_band` (a select shown on the scope step, framed as a range not a hard number).
- `$25k+` → **18**
- `$12k–$25k` → **15**
- `$6k–$12k` → **11**
- `$2.5k–$6k` → **6**
- `Under $2.5k` → **2**
- `Not sure / want guidance` → **9** (mid-credit — unknown budget on custom work skews high, don't punish the "help me" path)
- No answer → **7**

**2. Project size — 15 pts.** Derived from `project_type` × scope. Base by category, then ± from dimensions/linear footage when present.
- Full-room, custom kitchen, wine cellar, home bar, walk-in closet system, staircase → **15**
- Entertainment center, large built-in wall, mudroom, multi-room trim/crown package, sauna/hot tub, outdoor living → **11**
- Single built-in, vanity, fireplace surround, bookcase, beds/nightstands, doors package → **7**
- Floating shelves, single-room baseboard/casing, accent wall, custom furniture piece → **4**
- Repairs / "Other" → **3**
- Size modifier: if dimensions imply >12 linear ft **or** >40 sq ft face area, **+2** (cap at 15); if clearly small (<3 lin ft / single unit), **−2** (floor at 2).

**3. Luxury potential — 12 pts.** Selected tier is the primary driver; material preference and budget reinforce.
- `Signature` tier → **12**
- `Premium` tier → **9**
- `Essential` tier → **4**
- `Help me choose a tier` → **8** (defaults toward Premium-anchored intent)
- Override-up: if `Essential` selected **but** budget ≥ $12k or a hardwood named, bump to **8** (mismatch favors upsell).

**4. Timeline fit — 11 pts.** Wizard field `timeline`.
- `ASAP / within 1 month` → **11**
- `1–3 months` → **9**
- `3–6 months` → **6**
- `6–12 months` → **3**
- `Just exploring / no date` → **2**
- No answer → **5**

**5. Decision readiness — 10 pts.** Composite signal of "can this person say yes." Sum the sub-signals, cap at 10:
- Provided phone **and** email: **+3** (phone-only **+2**, since phone is required today)
- Homeowner = yes: **+3**
- Timeline ≤ 3 months: **+2**
- Budget band selected (any, not "not sure"): **+2**
- Selected "Not sure / help me decide" on 2+ steps: **−2** (still browsing)

**6. Scope clarity — 8 pts.** Quality of the free-text `message` + structured detail completeness.
- Message ≥ 120 chars **and** names a room/material/dimension → **8**
- Message 40–119 chars with specifics → **6**
- Message < 40 chars or generic ("need shelves") → **3**
- Empty message but conditional detail fields filled → **5**
- Nothing → **1**
- "Not sure yet — help me decide" selected → **4** (consultative, not penalized to floor)

**7. Photo quality — 7 pts.** Count + a lightweight quality flag (resolution ≥ 1000px long edge, not a screenshot/blank).
- 3+ usable photos incl. a wide shot → **7**
- 1–2 usable photos → **5**
- Photos uploaded but low-res / unclear → **2**
- None → **0**

**8. Measurement completeness — 5 pts.**
- All applicable dims provided (W×H×D, or linear ft for trim) → **5**
- Partial dims → **3**
- "I haven't measured yet" / none → **1** (not 0 — this is the encouraged escape hatch)

**9. Location / logistics — 5 pts.** Wizard ZIP → matched against the existing service-areas list (Denver metro / Front Range).
- Core metro (Denver, Aurora, Lakewood, Centennial, Littleton, Arvada, Westminster, Wheat Ridge, Englewood) → **5**
- Outer Front Range (Boulder, Longmont, Castle Rock, Parker, Brighton, Golden, Broomfield) → **4**
- Edge / >45 min drive → **2**
- Out of service area → **0** (also forces Low-fit, see §2)
- No ZIP → **3**

**10. Homeowner status — 5 pts.** Wizard field `homeowner`.
- Homeowner → **5**
- Renter with landlord approval noted → **2**
- Renter / no approval → **0**
- Not answered → **3**

**11. Material preference — 4 pts.** Wizard field `material_pref` (tooltip-explained: paint-grade vs. hardwood).
- Named hardwood (walnut, white oak, cherry, maple) → **4**
- "Premium / best available" → **3**
- Paint-grade / budget → **1**
- "Not sure — recommend for me" → **2**
- None → **2**

> **Computation:** score on every insert and on every edit of a scoring field (DB trigger or server-side recompute on save). Persist `lead_score` + `score_breakdown`. Re-score is idempotent and logged in the audit trail (§4 versioning pattern reused).

---

## 2. Lead Categories (thresholds + qualifying conditions + routing/SLA)

Category is derived, not free-typed. Evaluate in this **priority order** (first match wins, except Luxury and Hot can co-apply — Luxury label takes display priority, Hot SLA always applies if also Hot). Store as `leads.category` (enum) alongside `lead_status` (§3).

| Category | Score gate | Required qualifying conditions | Next action | Response SLA |
|---|---|---|---|---|
| **Hot** | ≥ 72 | Timeline ≤ 3 months **AND** homeowner **AND** (budget band selected OR project size ≥ 11) **AND** in service area | the owner calls personally; book on-site consult on first contact | **Call within 2 business hours**; if after hours, first thing next business morning |
| **Luxury** | ≥ 60 | Tier = Signature **OR** (budget ≥ $12k) **OR** named hardwood + project size ≥ 11 | White-glove path: personal call + tailored follow-up email with portfolio of comparable high-end work; assign to owner, never to a generic queue | **Call within 2 business hours**, same as Hot; never let a Luxury lead sit |
| **Warm** | 45–71 | In service area, homeowner or unknown, timeline ≤ 6 months OR scope clear | Personal email + text within SLA; offer consult; nurture sequence (§5 no-response) if no reply | **Respond within 1 business day** (matches the wizard's stated promise) |
| **Budget** | any, but flagged | Tier = Essential **AND** (budget < $6k OR "under $2.5k") **AND** not otherwise Hot | Send budget-education email (§5) setting honest minimums; offer phased/Essential scope; qualify before booking a trip | **Respond within 1 business day**; do not dispatch on-site until scope clears realistic minimum |
| **Low-fit** | < 45 **or** any disqualifier | Out of service area, renter w/o approval, "just exploring" + no budget + no timeline, or spam-suspect | Polite templated reply (referral if out-of-area); no on-site visit; auto-archive after sequence if no engagement | **Respond within 2 business days**; automated email acceptable |

**Disqualifier overrides (force Low-fit regardless of score):** ZIP out of service area; renter with no landlord approval AND budget < $2.5k; honeypot/rate-limit spam flag. These set `category = low_fit` and `lead_status = lost` with `lost_reason` prefilled.

**Tie-break / co-application rules:**
- A lead scoring ≥ 72 that is also Signature-tier displays as **Luxury** (badge) but inherits the **Hot 2-hour SLA**.
- Budget category can co-exist with Warm score; if `Essential + under $6k` qualifiers hit, label **Budget** even at score 50, because the action (education, no premature trip) differs.

---

## 3. Admin Dashboard Spec

A protected `/admin/leads` route (auth-gated; service-role reads only — public RLS already blocks direct access). Built as a server-rendered table + slide-over detail.

### 3.1 List / table view — columns

| Column | Source | Notes |
|---|---|---|
| Score | `lead_score` | Colored pill: green ≥72, amber 45–71, grey <45 |
| Category | `category` | Badge: Hot (red), Luxury (gold), Warm (amber), Budget (slate), Low-fit (grey) |
| Name | `name` | Links to detail |
| Project type | `project_type` | From the 19 `PROJECT_TYPES` |
| Tier | `tier` | Essential / Premium / Signature / Help-me-choose |
| Est. range | computed | "$8.4k–$11.2k" from calculator (§4) |
| Timeline | `timeline` | |
| Location | `zip` → city | "Aurora, CO" |
| Status | `lead_status` | new / contacted / quoted / scheduled / won / lost |
| SLA | derived | Countdown chip ("Due in 1h 12m") or red "OVERDUE 3h" |
| Received | `created_at` | Relative ("2h ago"), absolute on hover |
| Photos | count | Camera icon + N |

### 3.2 Filters & sorts
- **Filters:** Status (multi), Category (multi), Tier, Project type, Timeline, City/ZIP-radius, Score range slider (0–100), Has-photos (y/n), Date range (created_at), SLA state (Overdue / Due-today / On-track), Source.
- **Sorts:** Score desc (default), SLA urgency (overdue first), Received newest/oldest, Est. value desc, Status.
- **Saved views:** "My overdue Hot leads," "Unworked today," "Luxury pipeline," "This week won."
- **Quick search:** name / phone / email / message full-text.

### 3.3 Inquiry detail view — sections
1. **Header** — name, score pill, category badge, status dropdown, SLA chip, received timestamp, source.
2. **Contact** — phone (click-to-call/text), email (click-to-mail), preferred contact, ZIP/city.
3. **Project** — type, tier (with anchored "RECOMMENDED" note if Premium), scope clarity flag, full `message`.
4. **Dimensions & measurements** — W×H×D or linear ft; "not measured yet" state shown explicitly.
5. **Photos** — gallery thumbnails, click to lightbox; quality flag per image.
6. **Estimate** — calculator output: line items (material, labor, finish), subtotal, markup, waste, **range** (low–high), assumptions used. Editable overrides (§3.4).
7. **Score breakdown** — the 11 factors with awarded/max points (from `score_breakdown` jsonb), so the rep sees *why* it's Hot/Low-fit.
8. **Activity timeline** — every status change, email/SMS sent (with template name), note added, consult scheduled, override applied — timestamped + actor.
9. **Notes** — threaded internal notes.

### 3.4 Action buttons
| Button | Behavior | Side effects |
|---|---|---|
| **Export to CRM** | Push lead to external CRM (HubSpot/Close) via API with retry+timeout | Logs to activity; stores external CRM id |
| **Send email** | Compose from a template (§5) or freehand; sends via transactional email | Logs template + body to activity |
| **Send SMS / text** | Same, via SMS provider; respects opt-out | Logs to activity |
| **Update material rates** | Deep-link to Material Rate Table admin (§4) | — |
| **Override calculator assumptions** | Edit material qty, labor hours, markup %, waste % for *this* lead only; recompute range live | Writes `estimate_overrides` jsonb + audit row |
| **Convert to project** | Creates a `project` record from the lead; carries over scope, tier, photos, estimate | Sets status → scheduled/won path; locks scoring fields |
| **Schedule consultation** | Opens calendar picker; books on-site consult; sends confirmation email/SMS | Status → scheduled; activity entry; optional calendar invite |
| **Add note** | Threaded internal note | Activity entry |
| **Change status** | Dropdown: new → contacted → quoted → scheduled → won/lost | Captures `lost_reason` when → lost; timestamps each transition |

### 3.5 Status state machine (`lead_status`)
`new` → `contacted` → `quoted` → `scheduled` → `won` **or** `lost`.
- **new:** inserted, unworked. Starts SLA clock.
- **contacted:** first human/automated outreach logged. Stops the "first-response" SLA.
- **quoted:** estimate range sent to client.
- **scheduled:** on-site consult booked (date stored).
- **won:** converted to a project (`converted_project_id` set).
- **lost:** with required `lost_reason` (out-of-area, no-budget, ghosted, chose-competitor, duplicate, spam). Lost leads are archived, not deleted (retain for analytics).
- Backward moves allowed but logged (e.g., scheduled → contacted on a reschedule).

---

## 4. Material Rate Table Admin

A new admin-managed table `public.material_rates` powering the estimate calculator, with full versioning so a rate change never silently rewrites historical quotes. RLS on, service-role writes only (mirrors `leads`).

### 4.1 Columns
| Column | Type | Rules |
|---|---|---|
| `id` | uuid PK | |
| `material_name` | text | e.g. "White Oak, 4/4 S4S" — required, ≤120 chars |
| `category` | enum | `hardwood`, `softwood`, `sheet_good`, `hardware`, `finish`, `fastener`, `consumable`, `labor` |
| `unit` | enum | `bd_ft`, `sq_ft`, `lin_ft`, `sheet`, `each`, `hour`, `gallon` |
| `supplier` | text | Vendor name; ≤120 chars |
| `current_cost` | numeric(10,2) | Cost per unit in USD, > 0 |
| `markup_pct` | numeric(5,2) | 0–500; default by tier (Essential 35, Premium 45, Signature 60) |
| `waste_pct` | numeric(5,2) | 0–60; default 12 (hardwood 15, sheet goods 10, trim 8) |
| `tier` | enum | `essential`, `premium`, `signature`, `all` |
| `last_updated` | timestamptz | Auto-set on any cost/markup/waste change |
| `updated_by` | text | Admin actor |
| `notes` | text | ≤500 chars (grade, finish, lead-time) |
| `active` | boolean | Inactive rows excluded from new calculations, retained for history |

**Calculator formula (documented, deterministic):**
`line_cost = current_cost × quantity × (1 + waste_pct/100)`
`line_price = line_cost × (1 + markup_pct/100)`
`estimate_subtotal = Σ line_price`
`range_low = subtotal × 0.90`, `range_high = subtotal × 1.15` (presented as the on-site-verify band; never a fixed "quote").

### 4.2 Edit flow
1. Inline-editable rows in a table (cost, markup %, waste %, active toggle editable directly; name/category/unit require an explicit edit modal).
2. On save, validate ranges (cost > 0; markup 0–500; waste 0–60) and reject out-of-bounds with a specific message.
3. A **"What this changes"** preview: before saving, show how many active estimate templates / open leads reference this material and the resulting range delta (e.g., "Affects 3 Premium templates; raises a 10-bd-ft white-oak run by ~$42").
4. Bulk action: "Apply +X% to all `hardwood` of supplier Y" with the same preview gate.

### 4.3 Versioning / audit
- New table `public.material_rate_versions`: one immutable row per change — `material_id`, `field`, `old_value`, `new_value`, `changed_by`, `changed_at`, optional `reason`.
- On every UPDATE to `material_rates`, a trigger writes the diff to `material_rate_versions` (never overwritten, append-only).
- Estimates **snapshot** the rates used: a lead's `estimate_overrides`/computed range stores the `material_rate_version` ids referenced, so reopening an old lead shows the rate *as it was* when quoted — a later rate change does not retroactively alter a sent quote.
- "View history" per material shows the version timeline; "Revert" creates a *new* version (no destructive rollback).

---

## 5. CRM / Email + SMS Automation

All sends go through a transactional provider with timeout + retry; respect SMS opt-out and the existing Supabase rate limiter. Quiet hours for SMS: 8am–8pm America/Denver. Tone: warm, professional, premium — never pushy. Placeholders: `{first_name}`, `{project_type}`, `{tier}`, `{range_low}`, `{range_high}`, `{phone}` = (720) 280-0812, `{owner}` = owner first name (confirm), `{booking_link}`, `{year}` (fill from owner data — flagged unverified in audit memory; do not assert a review rating).

### 5.1 Trigger → action → timing

| Trigger | Action | Timing | Channel |
|---|---|---|---|
| Lead submitted | Submission confirmation to client | Immediate (≤1 min) | Email (+ SMS if phone-only) |
| Lead submitted | Internal owner notification | Immediate | Email + SMS to the owner |
| Submitted with **no photos** | Missing-photos reminder | +2 hours if still no photos | Email |
| Score ≥ 72 (Hot) / Luxury | Internal "call now" alert | Immediate, high-priority | SMS to the owner |
| Status = contacted, no consult booked | Consultation-booking invitation | +24 h after first contact | Email + SMS |
| Category = Budget | Budget-education email | +1 h (after confirmation) | Email |
| Category = Luxury or Premium tier | Premium/luxury follow-up w/ portfolio | +3 h | Email |
| Timeline = ASAP/≤1mo | Rush-timeline follow-up | +30 min | SMS then Email |
| Estimate computed & approved by rep | Estimate-range summary | On rep send | Email |
| No client reply after first outreach | No-response sequence | Day 0 / 2 / 7 / 21 | Email (+1 SMS at day 2) |
| Consult booked | Confirmation + reminder | On book; reminder 24 h + 2 h before | Email + SMS |
| Status = lost (ghosted) | Sequence stops; archive | After day-21 step | — |

### 5.2 Ready-to-use templates

**A. Submission confirmation (Email)**
**Subject:** We've got your {project_type} project, {first_name} — here's what happens next
**Body:**
> Hi {first_name},
>
> Thanks for reaching out to Cruz Carpentry. Your {project_type} request is in, and a real person — not a call center — is already reviewing it.
>
> {owner} will personally look over your details and photos and reach out within **one business day** to set up a free, no-obligation on-site consult. We'll measure, talk through options, and you decide from there — no pressure, ever.
>
> Prefer to talk now? Call or text us at {phone}.
>
> Talk soon,
> The Cruz Carpentry team
> *Licensed & insured · Serving Denver and the Front Range*

**B. Missing-photos reminder (Email)**
**Subject:** One quick thing to sharpen your {project_type} estimate
**Body:**
> Hi {first_name},
>
> We're looking forward to scoping your {project_type}. A couple of quick phone photos would help us get your estimate as accurate as possible before we visit — even rough shots are perfect:
>
> • A wide shot of the wall or room
> • A close-up of any existing trim or finish
> • The room from the doorway
>
> Just reply to this email with them attached, or text them to {phone}. No worries if you'd rather wait — we'll confirm everything on site either way.
>
> — The Cruz Carpentry team

**C. Consultation-booking invitation (Email/SMS)**
**Subject:** Let's get your free on-site consult on the calendar, {first_name}
**Body (Email):**
> Hi {first_name},
>
> Ready to take the next step on your {project_type}? Every Cruz project starts with a free on-site consult — we measure, walk through your ideas, and you decide with no commitment.
>
> Grab a time that works for you here: {booking_link}
> Or just reply with a few windows and we'll make one work.
>
> — {owner}, Cruz Carpentry
**SMS:** Hi {first_name}, it's {owner} at Cruz Carpentry. Want to book your free on-site consult for your {project_type}? Pick a time: {booking_link} — or reply with what works. Reply STOP to opt out.

**D. Low-budget education (Email)**
**Subject:** Let's make your {project_type} work for your budget
**Body:**
> Hi {first_name},
>
> Thanks for thinking of Cruz Carpentry for your {project_type}. We want to be upfront and respectful of your budget: because everything we build is custom and built by hand, our projects typically start around **$2,500** for a small piece and climb from there with size, materials, and finish.
>
> The good news — there's almost always a smart way to get there:
> • Our **Essential** tier uses durable paint-grade materials for a cleaner price.
> • We can phase a larger project so you build in stages.
> • We're happy to focus the budget where it shows most.
>
> If that fits where you're at, reply here or text {phone} and we'll map out an approach. No pressure either way.
>
> — The Cruz Carpentry team

**E. Premium / luxury follow-up (Email)**
**Subject:** A few of our {project_type} builds we think you'll love, {first_name}
**Body:**
> Hi {first_name},
>
> Your {project_type} sounds like exactly the kind of work we love most — the pieces that become the heart of a home. Since you're leaning {tier}, I wanted to share a few comparable projects so you can see the level of craft and materials we'd bring to yours: [portfolio links].
>
> We work with solid hardwoods — white oak, walnut, cherry — with hand-selected, grain-matched fronts and finishes built to be touched up, not replaced. I'd love to walk your space, take measurements, and sketch some directions with you. It's free and there's no obligation.
>
> When's a good time this week? You can grab a slot at {booking_link} or just reply here.
>
> Warmly,
> {owner} · Cruz Carpentry

**F. Rush-timeline follow-up (SMS then Email)**
**SMS:** Hi {first_name}, {owner} at Cruz Carpentry — saw you're hoping to move quickly on your {project_type}. I can call today to scope it. What's a good time? Or reach me at {phone}. Reply STOP to opt out.
**Email Subject:** On a tight timeline for your {project_type}? Let's move fast.
**Email Body:**
> Hi {first_name},
>
> You mentioned you're hoping to get your {project_type} underway soon — we can help. The quickest path is a short call today or tomorrow so {owner} can scope it and get you on the schedule.
>
> Call or text {phone} anytime, or book the first available consult here: {booking_link}.
>
> — Cruz Carpentry

**G. Estimate-range summary (Email)**
**Subject:** Your Cruz Carpentry estimate for the {project_type}
**Body:**
> Hi {first_name},
>
> Based on what you've shared, here's a preliminary estimate for your {project_type} at the **{tier}** level:
>
> **Estimated range: {range_low}–{range_high}**
>
> A quick note on why it's a range: until we measure on site and confirm materials, this is an informed estimate — not a fixed quote. After the consult, we'll give you a detailed, itemized proposal you can count on.
>
> What's included at a glance:
> • Design & build of your {project_type}
> • {tier}-tier materials and finish
> • Professional installation, scribed and leveled to your space
>
> Ready to lock in the details? Let's book your free on-site consult: {booking_link}. Questions first? Reply here or text {phone}.
>
> — {owner}, Cruz Carpentry

**H. Internal owner notification (Email + SMS to the owner)**
**Email Subject:** [NEW {category} · Score {lead_score}] {first_name} — {project_type} ({city})
**Email Body:**
> New lead — **{category}** (score {lead_score}/100). SLA: **{sla_due}**.
>
> Name: {first_name} {last_name}
> Phone: {phone_client} · Email: {email_client}
> Project: {project_type} · Tier: {tier} · Timeline: {timeline}
> Location: {city}, {zip} · Homeowner: {homeowner}
> Budget: {budget_band} · Photos: {photo_count} · Est: {range_low}–{range_high}
>
> Message: "{message}"
>
> Top score drivers: {top_factors}
> Open in dashboard: {admin_link}
**SMS (Hot/Luxury only):** 🔔 {category} lead, score {lead_score}. {first_name} — {project_type}, {city}. Call within 2h. {admin_link}

**I. No-response follow-up sequence (Day 0 / 2 / 7 / 21)**

*Day 0 — first outreach (Email + SMS).*
**Subject:** Following up on your {project_type}, {first_name}
> Hi {first_name}, {owner} here from Cruz Carpentry. I'd love to help with your {project_type}. Do you have a few minutes this week for a quick call or a free on-site consult? Reply here or text {phone}. — {owner}
**SMS:** Hi {first_name}, {owner} at Cruz Carpentry following up on your {project_type}. Happy to answer any questions or book a free consult — reply here or call {phone}. Reply STOP to opt out.

*Day 2 — gentle nudge + photo offer (Email).*
**Subject:** Still happy to help with your {project_type}
> Hi {first_name}, just circling back. Not sure how to describe the project yet? That's exactly what we're here for — send a photo and we'll take it from there. Or grab a free consult slot: {booking_link}. — Cruz Carpentry

*Day 7 — value + social proof (Email).*
**Subject:** What it's like to build with Cruz Carpentry
> Hi {first_name}, no rush at all on your {project_type} — when you're ready, we'd be glad to help. A bit about how we work: every project is built by hand on the Front Range, scribed and leveled to your space, and starts with a free, no-obligation consult. Here are a few recent builds: [portfolio]. Reply anytime or book here: {booking_link}. — {owner}

*Day 21 — graceful last touch (Email).*
**Subject:** Should we close out your {project_type} request?
> Hi {first_name}, I don't want to crowd your inbox, so this is my last note for now. If your {project_type} is still on the table — this year or next — just reply and we'll pick right back up. We'll keep your details on file and you're always welcome to call or text {phone}. Wishing you the best either way. — {owner}, Cruz Carpentry

*After Day 21 with no engagement:* sequence stops, `lead_status` → `lost`, `lost_reason = ghosted`, lead archived for analytics.

---

### Implementation notes (grounding)
- **New `leads` columns required** for the above: `tier`, `budget_band`, `timeline`, `zip`, `homeowner`, `material_pref`, `photo_count`, `lead_score smallint`, `score_breakdown jsonb`, `category` (enum), `lead_status` (enum, default `new`), `lost_reason`, `estimate_overrides jsonb`, `converted_project_id uuid`. Add as a new idempotent migration following the existing `0001–0004` pattern; keep RLS on with no anon/authenticated policies (service-role writes only, matching today's `leads` posture).
- **New tables:** `public.material_rates`, `public.material_rate_versions`, `public.lead_activity` (timeline), `public.projects` (convert target). Reuse the existing `check_rate_limit` defense and the `withRetry` + timeout wrapper (`src/lib/retry.ts`) for all external CRM/email/SMS calls per the global standard.
- **`source` constraint** must be widened (currently `leads_source_allowed` allows only `website_estimate_form`, `verification_script`) to admit any new wizard source values, or the insert will fail the check constraint.

Relevant existing files: `/Users/tylerdevries/Cruz Carpentry/cruz-carpentry/src/lib/estimate-schema.ts`, `/Users/tylerdevries/Cruz Carpentry/cruz-carpentry/src/app/actions/estimate.ts`, `/Users/tylerdevries/Cruz Carpentry/cruz-carpentry/src/lib/supabase/types.ts`, `/Users/tylerdevries/Cruz Carpentry/cruz-carpentry/supabase/migrations/0001_init.sql`–`0004_rate_limit.sql`.

---

# Technical Implementation, Database Schema & Analytics

> Builds on the existing Next.js 16 (App Router, Turbopack, React 19) / Tailwind v4 / framer-motion 12 stack on Vercel, with Supabase (Postgres + Storage), the existing `estimate-schema.ts` (zod), and the existing Supabase-backed `rate-limit.ts` (in-memory L1 + Supabase L2). Reuses `services.ts` as the single source of project types and tiers. No greenfield rewrite.

## Part 1 — Technical Architecture

### 1.1 Front-End Multi-Step Wizard
**Form runtime.** `react-hook-form` (RHF) v7 + `@hookform/resolvers/zod`. One root `FormProvider` holds the entire intake object; each step reads/writes via `useFormContext`. Validate **per-step** with `trigger(stepFields)` before advancing — never validate the whole form on every keystroke.

**Schema layout.** Extend `estimate-schema.ts`: one master `intakeSchema` plus a `stepSchemas[]` (each a `.pick()`/`.partial()` of the master). The server re-validates the full `intakeSchema` on submit — client step schemas are UX convenience, never the security boundary.

**State machine.** Model navigation as an explicit finite state machine (steps are conditional). Use **XState v5** `createMachine` with typed context, or a hand-rolled reducer for zero deps. Visible steps derive from `project_type` + `tier` (from `services.ts`). Machine exposes `canAdvance`, `nextStep`, `prevStep`, `goToStep(id)`, computed `visibleSteps[]` so progress UI and routing stay in sync.

**Autosave & resume.**
- **L1 localStorage**: debounced 600 ms; key `cruz:intake-draft:v{schemaVersion}` (version invalidates stale shapes).
- **L2 server draft**: debounced 2.5 s; `POST /api/intake/draft` upserts an `inquiries` row with `status='draft'` + `calculator_input jsonb`; returns opaque `draft_token`.
- **Resume-by-link**: magic link `/estimate?draft={draft_token}`; token resume-only, 30-day expiry, write-scoped to one row via a `SECURITY DEFINER` RPC (not broad RLS).
- **Conflict rule**: server `updated_at` wins; if local is newer, prompt "Resume where you left off?" rather than silently overwrite.

### 1.2 File Upload & Storage
- **Private** Supabase Storage bucket `inquiry-photos` (no public URLs ever). Path `{inquiry_id}/{photo_id}.{ext}`.
- Client-side compression (`browser-image-compression`): `maxSizeMB 1.5`, `maxWidthOrHeight 2560`, web worker. Normalize **EXIF orientation to 1** (bake rotation into pixels) and **strip GPS tags**.
- Limits (client + server + bucket policy): max **10 photos**/inquiry, **8 MB**/original, MIME `jpeg/png/webp/heic` (HEIC transcoded client-side). Server validates by **magic byte**, not extension.
- Upload flow: client requests a **signed upload URL** (`POST /api/intake/photos/sign`, checks rate limiter + draft ownership) → client `PUT`s directly to Storage (keeps large bodies off Vercel functions) → `POST /api/intake/photos/commit` inserts the `photos` row.
- Reads: admin-only **short-TTL signed URLs** (300 s). Wizard preview uses the in-memory `ObjectURL` from the upload blob.

### 1.3 Pricing Engine
- Server-only pure-TS module `lib/pricing/engine.ts` (`import 'server-only'`). Pure functions `(input, rateSnapshot) → EstimateResult`; **no `Date.now()`/`Math.random()`**; banker's rounding to cents at defined points.
- Rates are **data, not code**: `material_rates`, `labor_rates`, `pricing_rules` load from DB (cached per request, `unstable_cache`-tagged, revalidated on admin edit).
- **Versioning**: each estimate stores `pricing_rules_id` **and** a denormalized `rules_snapshot jsonb` + `engine_version` (semver of `engine.ts`) so old quotes reproduce byte-for-byte after live rates change.
- Output contract: `{ low, point, high, currency, breakdown[], assumptions[], rules_version, engine_version }`. UI shows a **range**, never a single hard number, with a visible "preliminary, subject to on-site consultation" disclaimer.

### 1.4 Admin Auth & RLS
- **Auth**: Supabase Auth; admins get `app_metadata.role = 'admin'` (server-set, never client-writable). Admin routes guarded by `requireAdmin()` verifying the JWT role server-side.
- **RLS** (project default = deny): intake tables allow **anon INSERT** via SECURITY DEFINER RPC / service path; **SELECT/UPDATE/DELETE = admin only**. Draft resume via `resume_draft(token)` RPC touches exactly one row by token. Rate tables: server SELECT for pricing, admin INSERT only, **append-only versioned** (no destructive edits).
- **Audit trail**: every admin mutation writes `{actor_id, action, table, row_id, before, after, created_at}`; rate edits create a new version row, so the trail is intrinsic.

### 1.5 CRM Integration
- **Default**: a lightweight internal admin as system of record (single-shop business — avoids per-seat CRM cost, keeps PII in one place).
- **Optional external CRM**: pluggable `CrmAdapter { upsertContact, createDeal, attachNote }` (HubSpot Private App or Pipedrive). Sync on `inquiry.submitted` via the job queue, never inline. All external calls: **timeout (10 s) + ≥1 retry** with exponential backoff + jitter; idempotency key = `inquiry_id`.

### 1.6 Notifications — Email & SMS (queued/retryable)
- **Email**: **Resend** (React Email templates) for owner lead alert, customer confirmation + estimate range, resume link, consult confirmation. Webhooks → `email_events`.
- **SMS**: **Twilio** for new-high-score owner alert + optional appointment reminder; respect opt-in (`customers.sms_consent`).
- **Send via a queued job pattern**: insert a `job` row (`type, payload, status, attempts, run_after, idempotency_key`); a **Vercel Cron** (`/api/jobs/drain`, every 1 min) drains due jobs, retries with exponential `run_after`, dead-letters + alerts after max attempts. Each job idempotent → a provider outage queues rather than drops.

### 1.7 Analytics Tooling
- **PostHog** (autocapture off, explicit `capture()` only) for funnels, retention, masked session replay, flags. Revenue-relevant events (`estimate_shown/accepted`, `consultation_booked`, `lead_scored`) emitted **server-side** (PostHog Node SDK) keyed by a stable `distinct_id` so ad-blockers can't drop them. Optional GA4 mirror of top-of-funnel for ad attribution via Measurement Protocol. Gate client analytics behind a consent banner.

### 1.8 Spam & Abuse (defense in depth)
1. **Honeypot** hidden field (`company_website`) → silently drop.
2. **Cloudflare Turnstile** on final submit; server `siteverify` (timeout + retry) required before accept.
3. **Existing rate limiter** on `/api/intake/*` keyed by IP + draft_token (tighter cap on `submit` and `photos/sign`). Return `429 + Retry-After`.
4. **Time-to-submit floor**: reject submits faster than ~3 s from `form_started`.

### 1.9 Accessibility — WCAG 2.2 AA (wizard specifics)
- On step change, move focus to the new step's `<h2>` (`tabIndex=-1`), never trap. Steps as ordered list with `aria-current="step"`; mirror progress in `aria-live="polite"` ("Step 3 of 10: Measurements").
- Errors via `aria-live="assertive"`; invalid fields get `aria-invalid` + `aria-describedby`; on failed Next, focus the **first** invalid field. No color-only signals.
- Real `<label htmlFor>` (no placeholder-as-label); radio "cards" = `<fieldset><legend>` + visually-hidden native radios. Enter never accidentally submits; only the explicit Submit button submits.
- framer-motion gated on `useReducedMotion()`. Target size ≥ **24×24 px** (2.5.8); sticky header/footer must not obscure focus (2.4.11 — use `scroll-margin`). Uploads accept click-to-select (not drag-only, 2.5.7).

### 1.10 Mobile
Mobile-first Tailwind; single-column steps; correct `inputMode`/`type` (`tel`, `email`, `numeric`) + `autoComplete` tokens. Sticky bottom action bar with `env(safe-area-inset-bottom)`; native camera capture (`capture="environment"`); 44×44 px targets; `dvh` not `vh`. Test matrix: iOS Safari, Android Chrome, 320 px min.

### 1.11 Photo Security & Privacy
Private bucket, no public URL/listing, not indexable. Admin reads via 300 s signed URLs. Strip GPS/EXIF client-side; never log signed URLs; never put email/phone in Storage paths. **Retention**: lost/closed inquiries auto-purge photos after **180 days** (Vercel Cron deletes Storage objects + `photos` rows). Customer deletion request → cascade Storage + DB. Won-project photos retained for portfolio **only with explicit consent** (`portfolio_photo_consent`). Log admin signed-URL minting to the audit log.

### 1.12 Error Logging — Sentry
`@sentry/nextjs` across client/server/edge; source maps at build; release = git SHA. Users see "Something went wrong, your draft is saved"; Sentry captures full context with **PII scrubbed** (`beforeSend` redacts email/phone/address). Tag with `step`, `project_type`, `pricing_rules_version`. Alert on pricing-engine exceptions and dead-letter jobs.

### 1.13 Pricing-Assumption Versioning
`pricing_rules` is **append-only and versioned** — each row a complete snapshot (`version`, `semver`, `formula_json`, `tier_multipliers`, `complexity_multipliers`, `regional_factors`, `contingency_pct`, `project_minimums`, `range_spread`, `engine_version`, `is_active`, `effective_from/to`). Activation: create draft → "preview impact" on sample inputs → transaction sets old `effective_to=now()` + new `is_active=true` (partial unique index guarantees one active). At estimate time the engine stamps `pricing_rules_id` + full `rules_snapshot` + `input_snapshot` + `engine_version` onto `estimates` → deterministic re-quote forever.

## Part 2 — Database Schema (Postgres / Supabase)

Conventions for all tables: `id uuid pk default gen_random_uuid()`, `created_at`/`updated_at timestamptz not null default now()` (shared `set_updated_at()` trigger). RLS enabled everywhere; default deny. **anon INSERT** on intake tables via RPC/service path; **SELECT/UPDATE/DELETE admin-only** unless noted.

### `customers`
| Column | Type | Keys / Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| email | citext | NOT NULL, UNIQUE | case-insensitive |
| full_name | text | NOT NULL | |
| phone | text | CHECK E.164-ish | |
| address_line1/2, city | text | | PII |
| region | text | | drives regional_factor |
| postal_code | text | idx | |
| sms_consent / marketing_consent / portfolio_photo_consent | boolean | default false | Twilio opt-in / gallery reuse |
| created_at / updated_at | timestamptz | default now() | |

RLS: admin SELECT/UPDATE; inserts via RPC on submit (upsert on email).

### `inquiries`
| Column | Type | Keys / Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | Storage folder name |
| customer_id | uuid | FK→customers, NULL until submit | |
| project_type_id | uuid | FK→project_types | |
| tier | text | CHECK ('essential','premium','signature') | |
| status | text | default 'draft'; CHECK ('draft','submitted','reviewing','contacted','quoted','scheduled','won','lost') | unified lead+inquiry lifecycle (Part A §A2); `quote_status` is a separate field |
| draft_token | text | UNIQUE NOT NULL | resume-by-link |
| draft_expires_at | timestamptz | | now()+30d |
| calculator_input | jsonb | default '{}' | full wizard snapshot |
| conditional_answers | jsonb | default '{}' | branch Q&A |
| desired_start | date | | |
| timeline_flexibility | text | CHECK ('flexible','standard','asap','rush_priority','fixed_deadline','event_move_in','emergency_repair') | canonical 7 (Part A §A1) |
| budget_band | text | CHECK ('under_1k','1k_2_5k','2_5k_5k','5k_10k','10k_25k','25k_plus','unsure') | canonical 7 (Part A §A1); feeds budget_mismatch |
| referral_source | text | | attribution |
| time_to_submit_ms | integer | | bot signal + analytics |
| device_type | text | CHECK ('mobile','tablet','desktop') | |
| submitted_at | timestamptz | | null until submit |
| created_at / updated_at | timestamptz | default now() | |

Indexes: `unique(draft_token)`, `idx_status`, `idx_customer_id`, `idx_created_at`. Has-many rooms/measurements/photos/estimates/admin_notes/consultation_bookings; 1–1 lead_scores. RLS: anon INSERT/UPDATE via `resume_draft` RPC scoped to own token; admin full SELECT.

### `project_types`
| Column | Type | Notes |
|---|---|---|
| id uuid PK; slug text UNIQUE (matches services.ts); name text; description text | | |
| measurement_mode text CHECK ('linear_ft','sq_ft','unit_count','mixed') | drives Step 6 | |
| requires_measurements boolean default true; is_active boolean; display_order int | gates step in machine | |

RLS: **public SELECT** (wizard render); admin write. Seeded/synced from `services.ts`.

### `rooms`
`id uuid PK; inquiry_id uuid FK→inquiries ON DELETE CASCADE NOT NULL; label text NOT NULL; room_type text; length_in/width_in/height_in numeric(8,2) CHECK>=0; notes text`. Idx `inquiry_id`. Belongs-to inquiries; has-many measurements.

### `measurements`
| Column | Type | Notes |
|---|---|---|
| id uuid PK | | |
| inquiry_id | uuid FK→inquiries CASCADE NOT NULL | `measurements.inquiry_id → inquiries.id` |
| room_id | uuid FK→rooms CASCADE NULL | optional |
| material_id | uuid FK→materials NULL | what's measured |
| measure_type | text CHECK ('linear_ft','sq_ft','unit_count','hours','board_ft') | |
| label | text | e.g. "Left built-in", "Wall A" |
| width_in/height_in/depth_in | numeric(8,2) | for area/volume formulas |
| quantity | numeric(10,2) CHECK>=0 | shelves/drawers/doors/sections/etc. |
| unit | text | 'ft','sqft','each' |
| complexity_flags | jsonb default '[]' | ['curved','inlay','scribe','onsite_finish'] |

Idx `inquiry_id`, `room_id`.

### `photos`
`id uuid PK; inquiry_id FK CASCADE NOT NULL; storage_path text UNIQUE NOT NULL ({inquiry_id}/{id}.{ext}); original_filename text; mime_type text CHECK allowed; byte_size int CHECK >0 AND <=8388608; width_px/height_px int; kind text CHECK ('space','straight_on','closeup','with_tape','obstruction','inspiration','sketch') default 'space'; quality_score int CHECK 0..100; is_portfolio_approved boolean default false; purge_after timestamptz`. Idx `unique(storage_path)`, `inquiry_id`, `purge_after`. Storage policy: path prefix must equal `inquiry_id`.

### `materials`
`id uuid PK; slug text UNIQUE; name text; category text CHECK ('wood_species','sheet_good','hardware','finish','trim','panel','glass'); unit text ('board_ft','sheet','linear_ft','each','pair','gallon'); is_active boolean; display_order int`. Public SELECT (wizard options); admin write. Has-many material_rates.

### `material_rates`
`id uuid PK; material_id FK→materials RESTRICT NOT NULL; tier text CHECK ('essential','premium','signature'); unit_cost numeric(12,4) CHECK>=0; markup_pct numeric(5,4); waste_factor numeric(5,4) default 0.10; supplier text; valid_from timestamptz default now(); valid_to timestamptz; is_current boolean default true; notes text; created_by uuid FK→auth.users`. Partial unique `(material_id, tier) where is_current`. Server SELECT for pricing; admin INSERT (append-only).

### `labor_rates`
`id uuid PK; task_code text NOT NULL ('build_cabinet_lf','install_cabinet_lf','crown_lf','finish_onsite_sf',…); project_type_id FK→project_types NULL; activity text ('shop','install','finish','design'); unit_hours numeric(8,3) CHECK>=0; hourly_rate numeric(10,2) CHECK>=0; tier text; valid_from/valid_to timestamptz; is_current boolean; created_by uuid`. Partial unique `(task_code, project_type_id, tier) where is_current`. Server SELECT; admin write (append-only).

### `pricing_rules`
`id uuid PK; version int UNIQUE; semver text; formula_json jsonb; tier_multipliers jsonb; complexity_multipliers jsonb; finish_multipliers jsonb; access_multipliers jsonb; rush_multipliers jsonb; regional_factors jsonb; contingency_pct numeric(5,4) default 0.10; project_minimums jsonb; range_spread jsonb (per-confidence low/high); margins jsonb (per-tier + rush); min_project_fee int; engine_version text; is_active boolean default false; effective_from/to timestamptz; created_by uuid`. Partial unique `(is_active) where is_active`. Server SELECT; admin INSERT/activate only.

### `estimates`
`id uuid PK; inquiry_id FK CASCADE NOT NULL; pricing_rules_id FK→pricing_rules RESTRICT NOT NULL; rules_snapshot jsonb NOT NULL; engine_version text; input_snapshot jsonb NOT NULL; confidence text CHECK ('high','medium','low'); low_cents/point_cents/high_cents bigint CHECK>=0; currency text default 'USD'; breakdown jsonb NOT NULL; accepted boolean default false; accepted_at timestamptz`. Idx `inquiry_id`, `pricing_rules_id`, `created_at`. Reproducibility: snapshot + input + engine_version = deterministic re-quote.

### `lead_scores`
`id uuid PK; inquiry_id FK CASCADE NOT NULL UNIQUE; score int CHECK 0..100; category text CHECK ('hot','warm','luxury','budget','low_fit'); factors jsonb default '{}' (per-signal contributions); model_version text`. Idx `unique(inquiry_id)`, `category`. Server INSERT/UPDATE; admin SELECT.

### `email_events`
`id uuid PK; inquiry_id FK NULL; customer_id FK NULL; provider text CHECK ('resend','twilio'); provider_message_id text UNIQUE; type text ('confirmation','lead_alert','missing_photos','consult_invite','low_budget','luxury_followup','rush_followup','estimate_summary','nurture'); event text CHECK ('queued','sent','delivered','opened','clicked','bounced','complained','failed'); payload jsonb; occurred_at timestamptz`. Idx `unique(provider_message_id)`, `inquiry_id`, `(type,event)`. Service-role INSERT (webhook); admin SELECT.

### `admin_notes`
`id uuid PK; inquiry_id FK CASCADE NOT NULL; author_id uuid FK→auth.users NOT NULL; body text NOT NULL; is_internal boolean default true`. Idx `inquiry_id`, `created_at`. Admin-only all ops.

### `consultation_bookings`
`id uuid PK; inquiry_id FK CASCADE NOT NULL; customer_id FK CASCADE NOT NULL; scheduled_for timestamptz NOT NULL; duration_min int default 60; mode text CHECK ('on_site','video','phone'); status text default 'booked' CHECK ('booked','confirmed','rescheduled','canceled','completed','no_show'); external_event_id text (Cal.com/Calendar); notes text`. Idx `inquiry_id`, `scheduled_for`, `status`. anon INSERT via RPC scoped to inquiry; admin full.

**Relationship summary:** `customers` 1—N `inquiries` 1—N {`rooms`,`measurements`,`photos`,`estimates`,`admin_notes`,`consultation_bookings`}; `inquiries` 1—1 `lead_scores`, N—1 `project_types`; `measurements` N—1 `rooms`/`materials`; `materials` 1—N `material_rates`; `labor_rates` N—1 `project_types`; `estimates` N—1 `pricing_rules`; `email_events` N—1 `inquiries`/`customers`.

## Part 3 — Analytics Plan

**Base properties on every event:** `distinct_id` (anon, aliased to customer on submit), `session_id`, `inquiry_id`, `device_type`, `viewport_w`, `referrer`, `utm_*`, `app_version` (git SHA), `ts`.

| Event | When | Key properties |
|---|---|---|
| `form_started` | first interaction step 1 | `entry_step`, `resumed_from_draft`, `referral_source` |
| `step_completed` | valid Next | `step_id`, `step_index`, `step_name`, `time_on_step_ms`, `project_type`, `tier` |
| `step_drop_off` | unload without advancing (beacon on `visibilitychange`) | `step_id`, `time_on_step_ms`, `had_validation_error`, `last_field_touched` |
| `photo_uploaded` | commit success | `photo_count_total`, `byte_size`, `mime_type`, `kind`, `compression_ratio` |
| `estimate_shown` | range rendered (server) | `low/point/high_cents`, `project_type`, `tier`, `confidence`, `pricing_rules_version`, `engine_version` |
| `estimate_accepted` | user proceeds from estimate (server) | `estimate_id`, `point_cents`, `time_since_shown_ms` |
| `consultation_booked` | booking row created (server) | `booking_id`, `mode`, `lead_time_days`, `point_cents` |
| `budget_mismatch` | budget band < estimate.low (or > high) | `budget_band`, `estimate_low/high_cents`, `direction` |
| `lead_scored` | post-submit (server) | `score`, `category`, `factors`, `model_version`, `point_cents` |
| `form_submitted` | status → submitted (server) | `project_type`, `tier`, `photo_count`, `room_count`, `time_to_submit_ms`, `budget_band` |

**Derived (in PostHog):** conversion by `project_type × tier`; `avg_estimated_value` (mean `point_cents`); `time_to_submit` distribution; mobile vs desktop via `device_type`.

**Dashboards/funnels:** (1) Acquisition→Lead funnel `form_started → step_completed[per step] → form_submitted → estimate_accepted → consultation_booked` + `step_drop_off` trend to find the bleeding step; (2) Revenue & quality (avg point_cents, accept rate, budget_mismatch rate by type, lead-category mix); (3) Channel/attribution by `utm_source`; (4) Friction/health (median time-on-step, validation-error rate, upload success, split by device); (5) Ops (consultation lead-time + mode mix).

---

---

## Risks & Assumptions

**Pricing data**
- All material/labor figures are **2025 Front Range estimates**, not a live feed. Risk: stale rates → mispriced quotes. Mitigation: admin-editable, version-stamped rate tables; quarterly review cadence; live-quote requirement on walnut/rift-QSWO/special-order veneer and on any estimate >$10k.
- Lumber and sheet-good prices are volatile (tariffs, futures). Mitigation: separate 8–12% project contingency on top of material waste factors; lock supplier pricing on long-lead Signature lumber.

**Estimate accuracy & liability**
- The customer-facing number is a **preliminary range, never a quote**. Always display the disclaimer (see *Form Architecture*). Risk: customer treats range as binding. Mitigation: confidence band widens with missing data; final pricing gated on consultation + verified measurements.
- Unverified measurements / poor photos materially reduce accuracy → confidence multipliers widen the range (and may hide the instant estimate). This is intentional.

**Conversion**
- Long forms abandon (~70%+). Mitigation: 10 short steps, ≤8 required fields total, autosave + resume-by-link, one decision per screen, optional measurements/photos.
- Budget-vs-scope mismatch can scare off good leads. Mitigation: never reject harshly; show the helpful "simplify design / choose budget materials / adjust budget — we'll still review" message and keep the lead.

**Technical**
- Photo uploads on cellular: mitigated by client-side compression + direct-to-Storage signed uploads.
- Third-party outages (Resend/Twilio/CRM): mitigated by queued, idempotent, retryable jobs (graceful degradation).
- PII/photo privacy: private bucket, short-TTL signed URLs, GPS/EXIF stripping, retention/purge policy, consent-gated portfolio reuse.
- Spam: honeypot + Turnstile + existing rate limiter + time-to-submit floor.

**Assumptions to validate with the owner** (see next section): single-shop scale (no per-seat CRM); Premium is the desired default; the business wants instant on-screen ranges (vs. "we'll follow up with a number"); shop billable base ~$32/hr wage, ~70% utilization.

---

## Questions That Still Need Owner Input

1. **Show an instant on-screen estimate range, or "we'll follow up"?** Instant ranges convert better but risk anchoring; a "request review" model is safer for complex/luxury work. (Recommended: show instant range for Essential/Premium with confidence band; for Signature, show "from $X" + consultation.)
2. **Real labor/economics numbers:** actual journeyman wage(s), crew size, true monthly overhead (shop rent, trucks, software, insurance), and **target net margin per tier.** The build-up model uses $32/hr wage, 70% utilization, ~35% burden, 15/22/30% margins — confirm or replace.
3. **Minimum project fee** (we suggest a floor, e.g., $350–$500 for repairs/small jobs) — what's your real minimum?
4. **Service area & travel:** radius before a travel fee; how to price out-of-metro (mountain) jobs.
5. **Design/consultation fee:** free consult vs. paid design that credits toward the project? Drawings/renderings included or extra, and how many revision rounds?
6. **Rush policy:** do you actually take rush work, and what premium (we suggest 1.15–1.35×)? Any blackout/lead-time realities?
7. **Warranty:** what do you warrant and for how long? (Drives the warranty reserve in the billable rate and the customer-facing copy — note current site intentionally avoids invented warranties.)
8. **Supplier buy prices:** your actual costs at Austin Hardwoods / Paxton / Sears Trostel / B&B for the top 15 materials, so the rate table starts from truth.
9. **CRM:** stay on the lightweight internal admin, or sync to HubSpot/Pipedrive? Any existing tool?
10. **Consultation booking:** integrate Cal.com / Google Calendar, or manual scheduling at first?
11. **Photo reuse:** OK to ask consent to feature finished projects in the gallery (ties to the real-photos-only convention)?
12. **Brand voice for emails/SMS:** sign-offs, phone number, who receives owner alerts, and SMS sender identity.
13. **Reviews/social proof:** confirm the "5.0 Google Reviews" claim before using it as trust microcopy (flagged previously as unverified).

---

## Final Build Checklist

**Phase 0 — Foundations**
- [ ] Owner answers the 13 questions above; seed real buy-prices into `material_rates` and real wages into `labor_rates`.
- [ ] Create Supabase tables + RLS policies + `set_updated_at` trigger; private `inquiry-photos` bucket + path-prefix policy.
- [ ] Seed `pricing_rules` v1 (multipliers, margins, minimums, confidence spreads) + `engine_version` 1.0.0.
- [ ] Sync `project_types` from `services.ts`.

**Phase 1 — Pricing engine (server)**
- [ ] Pure `lib/pricing/engine.ts` with all core formulas + per-project-type calculators; unit tests incl. the 3 worked examples; banker's rounding; no `Date.now()`/`Math.random()`.
- [ ] Rate-snapshot loader + caching; estimate stamping (`rules_snapshot` + `input_snapshot` + `engine_version`).
- [ ] Confidence model (High/Medium/Low) + low/high range multipliers.

**Phase 2 — Wizard (front-end)**
- [ ] RHF + zod step schemas extending `estimate-schema.ts`; XState (or reducer) step machine with conditional `visibleSteps`.
- [ ] 10 steps with large image cards, progress indicator, tooltips, "I'm not sure" options, inline validation, smart defaults, Premium pre-selected.
- [ ] Measurement module (multi-block, live sq ft / linear ft / sheet count); Price·Quality·Time chooser; conditional branching per project type/tier/rush/budget.
- [ ] Photo module: drag-drop + camera capture, example shots, per-photo label/annotation, approximate-vs-verified toggle, internal quality score; client compression + EXIF/GPS strip.
- [ ] Autosave (localStorage 600 ms + server draft 2.5 s) + resume-by-link.
- [ ] Summary page + preliminary range w/ confidence band + disclaimer; post-submission screen (thank-you, next steps, book consult, add photos, edit, response window).
- [ ] WCAG 2.2 AA pass (focus mgmt, aria-live, labels, target sizes, reduced motion); mobile pass (320px, dvh, sticky thumb-zone CTA).

**Phase 3 — Lead ops & automation**
- [ ] Lead-scoring function (0–100, weights sum to 100) → `lead_scores`; category routing + SLAs.
- [ ] Admin dashboard (list + filters + detail view + actions: export CRM, send email, edit rates, override assumptions, convert to project, schedule consult, notes, status).
- [ ] Material/labor rate-table admin (append-only versioning + audit + "preview impact").
- [ ] Email/SMS templates + queued retryable jobs (Resend/Twilio); webhooks → `email_events`; owner alert on Hot/Luxury.

**Phase 4 — Hardening & launch**
- [ ] Spam: honeypot + Turnstile (server verify) + rate limiter + time-to-submit floor.
- [ ] Sentry (PII-scrubbed) + structured logs + alerts on pricing-engine errors and dead jobs.
- [ ] PostHog events (Part 3) + funnels/dashboards; consent banner.
- [ ] Photo retention/purge cron; deletion-request flow.
- [ ] QA: 3 worked-example estimates reproduce exactly; cross-device/browser; accessibility audit; load/abuse test on `/api/intake/*`.
- [ ] Soft launch behind a hero CTA A/B test; monitor drop-off + budget-mismatch; tune rates after first 10–15 real jobs.

---

# Audit Reconciliation Log

A 5-dimension completeness audit produced **64 findings** (19 high, 26 medium, 19 low). Every finding and its resolution:

| # | Area | Sev | Type | Finding | Resolution |
|---|---|---|---|---|---|
| 1 | Form Fields & Options Completeness | H | miss | Rooms field with 15 options (Kitchen, Living room, Bedroom, Closet, Mudroom/entryway, Ba… | Part A §A1 — `room` enum (15) added |
| 2 | Form Fields & Options Completeness | H | part | Project types — 16 enumerated options including Entertainment center, Door or window cas… | Part A §A1 — `project_type` enum (18); `entertainment_center`,`casing` added |
| 3 | Form Fields & Options Completeness | M | inco | Internal consistency: Step 2 tooltip references a term not in the option enum | Part A §A1 — `casing` now a real option; tooltip list matches enum |
| 4 | Form Fields & Options Completeness | H | part | Project goals — 10 enumerated goals (Add storage, Improve appearance, Increase home valu… | Part A §A1 — `project_goal[]` (10 motivations) added |
| 5 | Form Fields & Options Completeness | H | inco | Welcome/intent options — 4 required (Submit Custom Project Inquiry, Request Estimate, As… | Part A §A1 — `intent` (4) incl. `existing_client` |
| 6 | Form Fields & Options Completeness | L | part | Measurements — explicit fields for number of shelves/drawers/doors/panels/cabinets/trim … | Part A §A1 — measurement fields incl. num_panels/num_cabinets + computed readout |
| 7 | Form Fields & Options Completeness | M | part | Photo types — 8 required (wide room, straight-on, close-up existing, with tape measure, … | Part A §A1 — `photo_label` (8) |
| 8 | Form Fields & Options Completeness | L | part | Photo capabilities — drag-drop, mobile camera, example photos, per-photo annotation, lab… | Part A §A1 — `photo_note` + `photo_room` added |
| 9 | Form Fields & Options Completeness | H | part | Existing-conditions checklist — full required set (demolition/removal; existing cabinets… | Part A §A1 — full `existing_conditions[]` (23) |
| 10 | Form Fields & Options Completeness | H | part | Materials by tier — full species lists (Essential: MDF, paint-grade ply, pine, poplar, s… | Part A §A1 — full per-tier `material` lists + `recommend_for_me` |
| 11 | Form Fields & Options Completeness | H | part | Finishes — full list (raw, primed, painted, stained, clear-coated, color matched, stain … | Part A §A1 — `finish` (12) |
| 12 | Form Fields & Options Completeness | H | part | Styles — full list (Modern, Minimal, Traditional, Transitional, Rustic, Farmhouse, Craft… | Part A §A1 — `design_style` (12) separate from door style |
| 13 | Form Fields & Options Completeness | H | inco | Budget ranges — 7 required (Under $1,000; $1,000-2,500; $2,500-5,000; $5,000-10,000; $10… | Part A §A1/§A2 — canonical 7-band `budget_band` + in-place DB CHECK patch |
| 14 | Form Fields & Options Completeness | H | part | Timeline — 7 required (Flexible; Standard; ASAP; Rush/priority; Fixed deadline; Event/mo… | Part A §A1/§A2 — canonical 7-value `timeline` + in-place DB CHECK patch |
| 15 | Form Fields & Options Completeness | M | part | Decision readiness — 5 required (Just researching; Planning 3-6 months; Ready 1-2 months… | Part A §A1 — `decision_readiness` (5), wired to lead score |
| 16 | Form Fields & Options Completeness | M | part | Contact — homeowner/renter/property manager/designer/contractor/realtor/investor role op… | Part A §A1 — `contact_role` (7+other) |
| 17 | Form Fields & Options Completeness | L | part | Contact — address (not just ZIP) | Part A §A1 — optional `address` field; street deferred to consult (documented) |
| 18 | Form Fields & Options Completeness | M | part | Post-submission experience — thank-you, preliminary range, review-required note, next st… | Part A §A1 (photos)/§A4 — upload-more, edit-submission, range+confidence, response window |
| 19 | Form Fields & Options Completeness | L | part | Submission summary fields (review of all prior selections before submit) | Part A §A1 — summary renders all canonical fields |
| 20 | Pricing Calculator Completeness | M | miss | Materials cost bucket must include a 'last-updated' field per material | Part A §A2/§A4 — `last_verified` column on material_rates |
| 21 | Pricing Calculator Completeness | M | miss | Finishing cost bucket must include a sanding-labor line | Part A §A4 — sanding/prep labor formula added |
| 22 | Pricing Calculator Completeness | M | part | Finishing cost bucket must include a color/stain-matching multiplier | Part A §A4 — ×1.20 finishing multiplier added |
| 23 | Pricing Calculator Completeness | M | part | Per-project-type calculator logic for Installation-only must appear in Part 7 OR Part 10 | Part A §A4 — §3.9 Install-only calculator added |
| 24 | Pricing Calculator Completeness | M | part | Per-project-type calculator logic for Design-build must appear in Part 7 OR Part 10 | Part A §A4 — §3.10 Design-build calculator added |
| 25 | Pricing Calculator Completeness | H | inco | Labor billable rate must be applied consistently (tier-bound vs MID hardcoded) | Part A §A4 — tier-bound labor rate table |
| 26 | Pricing Calculator Completeness | L | part | Hardware bucket — drawer-box stock cost must be specified (not just slide price) | Part A §A4 — `drawer_box_stock` unit price added |
| 27 | Pricing Calculator Completeness | M | inco | Signature LF-rate path must not double-apply margin (re-derivation rule must be explicit… | Part A §A4 — margin double-count skip rule for LF fast path |
| 28 | Pricing Calculator Completeness | L | part | Minimum project fee floor must be applied before the confidence range and after rush — o… | Part A §A2 — MAX(min_fee,...) unconditional |
| 29 | Part 11 | H | miss | Email automation rule: 'CRM lead creation' (automated push of inbound lead into external… | Part A §A4 — automated CRM-create trigger added |
| 30 | Part 11 | M | miss | Admin dashboard must surface 'material preference' | Part A §A4 — surfaced in admin detail |
| 31 | Part 11 | M | miss | Admin dashboard must surface 'budget range' | Part A §A4 — surfaced in admin detail + filter |
| 32 | Part 11 | M | miss | Admin dashboard must surface 'estimate confidence' | Part A §A4 — surfaced in admin detail |
| 33 | Part 11 | M | part | Admin dashboard must show 'calculated sq in / sq ft / linear ft' (computed areas, not ju… | Part A §A4 — computed measurements surfaced in admin |
| 34 | Part 11 | M | part | Admin dashboard must surface a per-lead 'recommended next action' | Part A §A4 — computed next-action surfaced |
| 35 | Part 11 | M | part | Admin must show explicit 'follow-up status' (which no-response sequence step / next foll… | Part A §A4 — sequence_state surfaced |
| 36 | Part 11 | L | part | Admin must show 'quote status' distinct from lead_status | Part A §A2/§A4 — separate `quote_status` field |
| 37 | Part 11 | L | part | Admin must show 'room/location' — the 'room' half of room/location | Part A §A4 — `room` surfaced in admin detail |
| 38 | Part 11 | L | inco | Score-pill color thresholds vs. category gates internal consistency | Part A §A3 — pill = raw score; category = separate badge (documented) |
| 39 | Technical Implementation, Database Schema, Analytics & Deliverables | L | part | Analytics: conversion by market tier (as a standalone breakdown, distinct from conversio… | Part A §A4 — `conversion_by_tier` standalone metric |
| 40 | Technical Implementation, Database Schema, Analytics & Deliverables | L | part | Analytics: average estimated project value, photo upload rate, budget mismatch rate, lea… | Part A §A4 — named derived metrics |
| 41 | Technical Implementation, Database Schema, Analytics & Deliverables | L | part | Analytics: mobile vs desktop CONVERSION (not just split dimension) | Part A §A4 — conversion split by device_type |
| 42 | Technical Implementation, Database Schema, Analytics & Deliverables | M | inco | Database: material_rates schema must be internally consistent (single source of truth) | Part A §A2 — Part 12 normalized schema canonical |
| 43 | Technical Implementation, Database Schema, Analytics & Deliverables | M | inco | Database: material_rates versioning model must be consistent | Part A §A2 — append-only is_current model canonical |
| 44 | Technical Implementation, Database Schema, Analytics & Deliverables | L | inco | Database: material_rates RLS write policy must be consistent | Part A §A2 — admin-INSERT-only (append-only) canonical |
| 45 | Technical Implementation, Database Schema, Analytics & Deliverables | M | inco | Pricing: customer-facing range spread must be consistent (confidence-driven vs fixed) | Part A §A2 — confidence-driven spread is the only source |
| 46 | Technical Implementation, Database Schema, Analytics & Deliverables | L | part | Analytics: estimate_accepted event consistency with estimates.accepted schema and 'consu… | Part A §A4 — fire server-side with estimates.accepted |
| 47 | Technical Implementation, Database Schema, Analytics & Deliverables | L | part | Versioning of pricing assumptions: engine_version source of truth | Part A §A2 — estimates.engine_version authoritative |
| 48 | Cross-section consistency & correctness | H | inco | Budget bands must match a single canonical set across schema, lead-scoring, and analytic… | Part A §A2 + DB CHECK patch — canonical 7 bands |
| 49 | Cross-section consistency & correctness | H | inco | Timeline enum values in schema must match the customer-facing timeline options (task exp… | Part A §A1/§A2 — canonical 7-value `timeline` + in-place DB CHECK patch |
| 50 | Cross-section consistency & correctness | H | inco | Tier net profit margins must be a single consistent set across the tier strategy, labor … | Part A §A2 + Part 3 patch — 0.13/0.20/0.25 |
| 51 | Cross-section consistency & correctness | H | inco | Step count must be consistent (doc describes a 10-step wizard). | Part A §A2 + Part 5 patch — 10 steps (5 chunks) |
| 52 | Cross-section consistency & correctness | H | inco | Project-type list count and enum values must be consistent (referenced as '19 PROJECT_TY… | Part A §A1 — canonical project_type set; '19' clarified as live-site list |
| 53 | Cross-section consistency & correctness | H | inco | Tier material multipliers (1.0 / 1.5 / 2.4) must agree wherever the same concept appears. | Part A §A2 — Essential- vs Premium-anchored reconciled w/ conversion note |
| 54 | Cross-section consistency & correctness | M | inco | Primary CTA button label must be a single consistent string ('Request Your Free Estimate… | Part A §A2 + patches — one button + one heading string |
| 55 | Cross-section consistency & correctness | H | inco | Lead-category enum must match between the operations spec and the database CHECK constra… | Part A §A3 — deterministic ordered decision table |
| 56 | Cross-section consistency & correctness | M | inco | Rush / fast-quality price multiplier must be one consistent value-range for the same con… | Part A §A2 — engine default vs customer band documented |
| 57 | Cross-section consistency & correctness | L | part | Confidence range multipliers must be identical wherever the confidence model is restated. | Part A §A2 — single confidence source; 0.90/1.15 superseded |
| 58 | Cross-section consistency & correctness | M | inco | Material markup defaults must be consistent between the materials rate table and the sch… | Part A §A2 — 25/32/35 canonical; markup≠margin noted |
| 59 | Cross-section consistency & correctness | M | inco | Minimum project fee values must agree across sections. | Part A §A2 — $275 trip / $550/$850/$1,500 tier mins canonical |
| 60 | Cross-section consistency & correctness | M | inco | Inquiry status enum must be consistent between the operations status machine and the sch… | Part A §A2 + DB CHECK patch — unified 8-state machine |
| 61 | Cross-section consistency & correctness | M | inco | Tier dashboard/category values must not introduce a 'Help-me-choose' tier that the tier … | Resolved in Part A (canonical reference) |
| 62 | Cross-section consistency & correctness | L | inco | Photo upload limits (count, size, MIME) must be consistent across UX, field-list, and sc… | Part A §A2 — 10 / 8MB / jpeg-png-webp-heic canonical |
| 63 | Cross-section consistency & correctness | L | part | Decision-readiness options must be consistent between the form field and the lead-score … | Part A §A1/§A3 — wired into score factor #5 |
| 64 | Cross-section consistency & correctness | L | inco | Worked-example labor billable rate must be consistent with the stated rate model (no mid… | Part A §A4 — tier-bound labor rate table |

> Net effect: the spec now carries one canonical enumeration set, one locked constant set, a deterministic lead-category table, and the previously-missing Install-only/Design-build calculators, sanding & stain-match finishing, tier-bound labor rates, CRM-create automation, and admin/analytics fields. Where a downstream section still shows a superseded value inline, **Part A is authoritative**.
