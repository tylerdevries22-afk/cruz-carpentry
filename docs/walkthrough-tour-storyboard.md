# Cruz Carpentry — "The Mountain House" Scroll Tour — Storyboard

Scroll-driven, video-scrubbed walkthrough of ONE luxury mountain home. The camera
glides front door → garage in the homepage card order; at each of 16 rooms it
parks and a detail panel reveals. New page: `/tour`. Reference frames are
generated fresh (Higgsfield) to a single locked art direction so the 16 read as
one house.

Decisions locked with owner: fresh unified image set · warm mountain-modern ·
peaks visible in most rooms, golden summer · tour-only (homepage unchanged).

**Visual storyboard:** an interactive page renders all 32 frames as annotated
panels — `public/tour-storyboard.html` (served at `/tour-storyboard.html`), with
frames in `public/tour-frames/`. Each room = 2 shots (establishing + macro
joinery) + a callout (headline + technical spec) + reveal copy, on a ~90s timeline.

---

## A. Art-direction bible (applies to EVERY frame — this is what makes it cohesive)

- **Place:** one contemporary luxury home perched in Colorado Front Range
  evergreens, granite peaks beyond. Summer, golden hour (~5–6pm), warm low sun.
- **Architecture:** timber + stone + blackened steel + floor-to-ceiling glass;
  vaulted, generous scale.
- **Materials:** white-oak & walnut millwork, honed/stacked stone, leathered
  granite, matte-black steel, bronze/brass accents, wool + leather textiles.
- **Light & grade:** warm directional sun raking through glass, long soft shadows;
  filmic warm grade, rich mid-tones, golden highlights, gently desaturated shadows.
- **Setting presence:** granite peaks + pines visible through glass in most rooms.
- **Subject:** the handcrafted WOODWORK itself is the hero of every frame — grain,
  joinery, millwork in sharp focus — not the furniture, view, or room at large
  (this is a carpentry company's portfolio). Hyperrealistic editorial-photo look,
  never a 3D-render look.
- **People:** none. Occasional hands-only craft beat (a hand along a banister).
- **Camera:** slow, weighty, cinematic — dolly-ins, gentle cranes, tilt-ups;
  always moving forward/inward; shallow-ish depth; subtle motion blur.
- **Continuity rules:** sun always from camera-left (west); every room change at a
  threshold (doorway/stair landing); identical grade across all clips.
- **Aspect:** 16:9 primary (desktop scrub); vertical reframe / scroll-snap on mobile.

**Shared prompt suffix (append to every still):**
> *"…luxury mountain-modern interior, white oak & walnut millwork, honed stone,
> blackened steel, floor-to-ceiling glass framing evergreen forest and granite
> peaks, golden-hour summer light, warm filmic grade, no people, architectural
> photography, ultra-detailed, cinematic, 16:9."*

---

## B. The house & route (one coherent floor plan)

| Zone | Stations |
|---|---|
| Approach → main floor | 01 entry door · 02 mudroom · 03 entry-gallery woodwork · 04 foyer stair · 05 gallery hall · 06 great-room beams · 07 stone fireplace · 08 built-ins · 09 chef's kitchen |
| Descend the stair → walk-out lower level | 10 wine room · 11 entertaining bar · 12 library/study |
| Ascend → primary level | 13 primary suite · 14 walk-in closet |
| Out & away | 15 deck cedar hot tub · 16 showpiece garage |

The **stair (04)** is the connective device — established early, then used to
descend (09→10) and ascend (12→13).

---

## C. Storyboard — Intro + 16 stations + Outro

Each station = one generated still → image-to-video clip. *Frame* = the subject
half of the Higgsfield `generate_image` prompt (the shared suffix is appended).
*Reveal* headline = card title, sub = card tagline (live copy); body bullets pull
from each service's `details[]`.

**INTRO (pre-01):** Aerial-to-eye approach up a stone drive through pines toward
the lit home at golden hour; slow push to the front door. Title: *"Cruz Carpentry
— a walk through the work."*

**01 · Interior & Exterior Doors**
- *Frame:* a grand white-oak pivot front door with blackened-steel hardware in a
  stone-and-timber entry, warm light spilling through sidelight glass.
- *Camera:* push through the opening door into the foyer. *Park:* on the door's edge/joinery.
- *Reveal:* "A well-made door announces itself every time you touch it." → *threshold into foyer.*

**02 · Mudrooms, Lockers & Benches**
- *Frame:* refined mudroom off the foyer — walnut lockers, leather-topped bench,
  slate floor, cubbies, a window to pines.
- *Camera:* turn in, dolly along the lockers. *Park:* on the bench + brass hooks.
- *Reveal:* "Where the chaos of the day gets put in its place." → *back into the entry gallery.*

**03 · Custom Woodwork & Specialty Builds**
- *Frame:* a sculptural bespoke feature in the entry gallery — a curved white-oak
  slat wall / floating console, art-lit, peaks through a slot window.
- *Camera:* lateral track past the curve. *Park:* on the curve's craftsmanship.
- *Reveal:* "The builds no catalog has a page for." → *toward the stair.*

**04 · Staircases & Railings**
- *Frame:* a floating white-oak + blackened-steel cantilevered staircase rising
  past a two-story glass wall framing granite peaks.
- *Camera:* slow crane up the flight. *Park:* on a tread/steel junction.
- *Reveal:* "The spine of the house — structural, and always in view." → *down the gallery hall.*

**05 · Trim, Molding & Wainscoting**
- *Frame:* a gallery hallway in white-oak wainscoting + crisp shadow-line trim,
  raking golden light, long wool runner.
- *Camera:* glide down the hall, light raking the trim. *Park:* on a reveal/corner.
- *Reveal:* "The details that turn a builder-grade box into a home." → *into the great room.*

**06 · Exposed Beams & Wood Ceilings**
- *Frame:* a vaulted great room with a timber beam ceiling and glass gable framing
  the peaks; tilt up.
- *Camera:* enter, **tilt up** to the beams. *Park:* on the beam joinery against sky.
- *Reveal:* "Look up — the fifth wall, finished in wood." → *down to the hearth.*

**07 · Fireplace Mantels & Surrounds** ★ pilot candidate
- *Frame:* a floor-to-ceiling stacked-stone hearth with a live-edge walnut mantel
  and blackened-steel surround, fire glowing, peaks beyond the glass.
- *Camera:* settle/dolly toward the hearth. *Park:* on the mantel + fire.
- *Reveal:* "The piece the whole room gathers around." → *pan to the built-ins.*

**08 · Built-In Shelving & Entertainment Centers**
- *Frame:* a great-room media/library wall — walnut built-ins with integrated
  lighting flanking the stone fireplace, styled with books/objects.
- *Camera:* lateral pan along the wall. *Park:* on a lit niche.
- *Reveal:* "Storage that becomes architecture." → *into the open kitchen.*

**09 · Custom Cabinetry & Kitchens** ★ pilot candidate
- *Frame:* the ACTUAL homepage kitchen (the `custom-cabinetry` card image) brought
  into the tour and style-matched to the set — same marble waterfall island, pro
  range + wood hood, twin pendants, stainless fridge and cabinetry layout, now
  regraded to golden-hour luxury-mountain with a large window framing granite peaks.
- *Camera:* glide along the island. *Park:* on a drawer/dovetail detail.
- *Reveal:* "The hardest-working room in the house, built to outlast the mortgage." → *descend the stair.*

**10 · Wine Cellars & Wine Rooms**
- *Frame:* a glass-walled wine room off the lower landing — walnut racking, stone,
  moody accent light, bottles.
- *Camera:* descend + push into the glass room. *Park:* on the racking.
- *Reveal:* "A room that honors what it holds." → *to the bar.*

**11 · Home Bars & Butler's Pantries**
- *Frame:* a lower-level entertaining bar — backlit stone, walnut, brass rail,
  glass to a dusk valley.
- *Camera:* swing to the lit bar back. *Park:* on the brass + backlight.
- *Reveal:* "Where the party finds its center." → *into the study.*

**12 · Home Offices & Libraries**
- *Frame:* a walnut-paneled library/study — floor-to-ceiling shelves, rolling
  ladder, desk, window to peaks.
- *Camera:* into the room, slow dolly to the desk. *Park:* on the shelf joinery.
- *Reveal:* "A room that works as hard as you do." → *ascend the stair.*

**13 · Beds, Frames & Nightstands**  *(replaces the current bunk-bed image)*
- *Frame:* a primary suite — walnut platform bed, upholstered headboard, matching
  nightstands, a glass wall to golden-hour peaks.
- *Camera:* ascend + reveal the bed as centerpiece. *Park:* on the headboard/frame.
- *Reveal:* "The centerpiece of the room you rest in." → *through into the closet.*

**14 · Custom Closets & Wardrobes**
- *Frame:* a luxury walk-in — walnut wardrobes, leather-topped island, brass,
  lit display shelving, a window with a view.
- *Camera:* through the doorway, dolly to the island. *Park:* on a lit drawer.
- *Reveal:* "A room you greet yourself in every morning." → *out to the deck.*

**15 · Cedar Hot Tubs & Surrounds**
- *Frame:* TIGHT on the cedar hot tub's tongue-and-groove siding against a matching
  cedar plank wall — the cedar cladding and joinery fill the frame, faint steam.
  No deck, no floor, no wide landscape (per owner: just the tub siding + the wall).
- *Camera:* slow lateral glide across the cedar boards. *Park:* on the grain + joinery.
- *Reveal:* "Soak under the Front Range sky." → *to the garage.*

**16 · Garage & Storage Systems**
- *Frame:* a showpiece garage — walnut/steel storage millwork, polished floor, a
  classic car, glass garage door to the drive + peaks.
- *Camera:* final move into the bay. *Park:* on the cabinetry.
- *Reveal:* "Order, built in." → *outro.*

**OUTRO (post-16):** drone-rise off the home as dusk settles over the peaks. End
card + CTA: *"Built by hand on the Front Range — request a free estimate."* → `/estimate`.

---

## D. Production sequence (what I execute after approval)

1. **Generate 16 stills** with `generate_image` using one locked style suffix +
   per-room subject above → review as a 4×4 set for cohesion before any video.
2. **Grade/curate** the set (regenerate any outliers) so all 16 match.
3. **Stills → motion:** `media_import_url` each → image-to-video (`generate_video`
   + `motion_control` camera preset per the camera spec) → 16 clips (+ intro/outro).
4. **Stitch + encode** for scroll-scrub (image-sequence/canvas player + an H.264
   proxy with dense keyframes); `upscale_video` for final.
5. **Build `/tour`** (separate phase): pinned stage, scroll→currentTime, 16 park
   windows + reveal panels, "you-are-here" floor meter, reduced-motion/mobile
   scroll-snap fallback, crawlable text list, nav + sitemap + metadata.

**Pilot first:** generate ONE hero room to lock the look before the full set.

## E. Defaults carried (say if any are wrong)
Silent scrub video + optional ambient/music toggle (no VO) · hands-only craft
beats · golden hour throughout, dusk at the hot tub · reveal expands in place AND
links to `/services/[slug]` · photoreal.
