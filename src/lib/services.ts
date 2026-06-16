import type { ComponentType } from "react";
import {
  CabinetIcon,
  BookshelfIcon,
  StairsIcon,
  MoldingIcon,
  ClosetIcon,
  LockerIcon,
  BeamIcon,
  MantelIcon,
  DoorIcon,
  SquareIcon,
  SaunaIcon,
  WineIcon,
} from "@/components/icons/ServiceIcons";

export interface ServiceDetail {
  title: string;
  body: string;
}

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface Service {
  /** URL segment under /services. */
  slug: string;
  /** Two-digit badge number, matches the homepage card order. */
  num: string;
  /** Full service name (homepage card + page H1). */
  title: string;
  /** Condensed name for nav, breadcrumb, and metadata title. */
  shortTitle: string;
  /** Short blurb shown on the homepage card. */
  cardDescription: string;
  Icon: ComponentType;
  /** 16:10 card thumbnail. */
  cardImage: string;
  /** Full-bleed image for the detail-page hero. */
  heroImage: string;
  /** One-line hero subhead. */
  tagline: string;
  /** 2–3 sentence positioning paragraph. */
  intro: string;
  /** Materials & joinery the page highlights. */
  materials: string[];
  /** Three craftsmanship talking points. */
  details: ServiceDetail[];
  faq: ServiceFaq[];
  /**
   * 1-based cruz-NN gallery photos shown in the page's "Selected Work" grid.
   * Real Cruz project photos only — empty means the page omits the gallery.
   */
  galleryIndices: number[];
  /** Pre-selected value for the estimate form (must exist in PROJECT_TYPES). */
  projectType: string;
  seo: { title: string; description: string };
}

export const SERVICES: Service[] = [
  {
    slug: "custom-cabinetry",
    num: "01",
    title: "Custom Cabinetry — Kitchen & Bath",
    shortTitle: "Custom Cabinetry",
    cardDescription:
      "Kitchen, bath, and pantry cabinetry built to endure — islands, vanities, and custom storage finished with the precision of a true craftsman.",
    Icon: CabinetIcon,
    cardImage: "/cards/01.webp",
    heroImage: "/gallery/cruz-34.webp",
    tagline: "The hardest-working room in the house, built to outlast the mortgage.",
    intro:
      "A kitchen isn't decoration — it's where your family actually lives. We build cabinetry around the way you cook, store, and gather, then fit every box to the millimeter so doors fall shut with a quiet, solid thump. Nothing here is pulled off a shelf; it's drawn for your room and built by hand on the Front Range.",
    materials: [
      "Solid hardwoods — white oak, walnut, maple, cherry — with hand-selected, grain-matched fronts",
      "Dovetailed solid-wood drawer boxes on full-extension, soft-close slides",
      "Furniture-grade plywood carcasses with solid edge-banding, not particleboard",
      "Hand-applied paint and oil finishes that can be touched up, not replaced",
      "Concealed soft-close hinges, drilled and aligned for dead-square reveals",
      "Built-in organization — pull-out pantries, spice drawers, tray dividers, hidden charging",
    ],
    details: [
      {
        title: "Dovetails you can see",
        body: "Every drawer box is dovetailed solid wood — the joint that's held fine furniture together for centuries. Pull one open and the workmanship is right there, not hidden behind a stapled bottom.",
      },
      {
        title: "Interiors as considered as the doors",
        body: "Adjustable shelves, dividers tailored to what you own, and finished interiors mean the cabinet works as beautifully as it looks — for decades, not seasons.",
      },
      {
        title: "Fit to your room, to the millimeter",
        body: "Walls are never truly square. We scribe to the wall, level every run, and shim where the eye can't see, so the finished line reads perfectly straight.",
      },
    ],
    faq: [
      {
        q: "Can you match cabinetry to my existing kitchen?",
        a: "Yes. We match species, profile, and finish to blend a new run or island into existing cabinetry, or design a full kitchen from scratch.",
      },
      {
        q: "Painted or stained — which lasts longer?",
        a: "Both hold up beautifully when done right. Painted finishes give you any color and a furniture-smooth surface; stained and oiled wood shows the grain and ages with character. We'll walk you through the trade-offs.",
      },
      {
        q: "Do you handle countertops and appliances?",
        a: "We build and install the cabinetry and coordinate closely with your counter fabricator and appliance specs so everything lands flush and on time.",
      },
    ],
    galleryIndices: [1, 9, 14, 16, 18, 41],
    projectType: "Custom Cabinetry",
    seo: {
      title: "Custom Cabinetry",
      description:
        "Handcrafted kitchen, bath, and pantry cabinetry for Colorado Front Range homes — dovetailed drawers, solid-wood fronts, and a flawless, custom fit.",
    },
  },
  {
    slug: "built-in-shelving",
    num: "02",
    title: "Built-In Shelving & Entertainment Centers",
    shortTitle: "Built-In Shelving",
    cardDescription:
      "Floor-to-ceiling built-ins, floating shelves, and media walls designed around your room, your TV, and your home office.",
    Icon: BookshelfIcon,
    cardImage: "/cards/02.webp",
    heroImage: "/gallery/cruz-10.webp",
    tagline: "Storage that becomes architecture.",
    intro:
      "A wall of built-ins anchors a room — it frames your books, hides the cable box, and makes a space feel finished and intentional. We engineer each unit for real load and clean lines, with the bracing tucked out of sight so the shelves look like they grew from the wall.",
    materials: [
      "Hardwood and veneer-core panels chosen for stability and grain continuity",
      "Hidden steel or hardwood cleats for floating shelves — no visible brackets",
      "Adjustable shelving on hand-drilled pin holes that flex as your collection grows",
      "Integrated, dimmable LED lighting recessed into shelves and niches",
      "Solid-wood face frames and paneled backs for depth and sound-dampening",
      "Cable management and ventilation designed in for media and equipment",
    ],
    details: [
      {
        title: "Shelves that float — honestly",
        body: "We build internal support into the wall so shelves carry real weight with no visible hardware. Full visual calm, full structural confidence.",
      },
      {
        title: "Designed around your gear",
        body: "TV size, component depth, speaker placement, and airflow are all planned before a board is cut, so the finished wall fits your equipment instead of fighting it.",
      },
      {
        title: "Lit to show off what's on them",
        body: "Warm, recessed LEDs wash the objects you display — books, art, glass — turning a storage wall into a focal point after dark.",
      },
    ],
    faq: [
      {
        q: "Can a built-in work around an existing fireplace or window?",
        a: "Absolutely — flanking a fireplace or wrapping a window seat is some of our favorite work. We template the existing conditions so the new build fits like it was always there.",
      },
      {
        q: "How much weight can the shelves hold?",
        a: "We size the shelf thickness and span to the load — a full library is no problem. Tell us what's going on them and we engineer accordingly.",
      },
      {
        q: "Painted to match my trim?",
        a: "Yes. We commonly finish built-ins to match existing trim or cabinetry so the room reads as one cohesive design.",
      },
    ],
    galleryIndices: [7, 10, 11, 12, 15, 21],
    projectType: "Built-In Shelving",
    seo: {
      title: "Built-In Shelving & Entertainment Centers",
      description:
        "Custom built-ins, floating shelves, and media walls for Colorado homes — engineered for load, lit to impress, and fit seamlessly to your room.",
    },
  },
  {
    slug: "staircases-railings",
    num: "03",
    title: "Staircases & Railings",
    shortTitle: "Staircases & Railings",
    cardDescription:
      "Custom stairs, newel posts, and railings — from hand-set iron balusters to modern cable rail and reclaimed-wood treads.",
    Icon: StairsIcon,
    cardImage: "/cards/03.webp",
    heroImage: "/gallery/cruz-30.webp",
    tagline: "The spine of the house — structural, and always in view.",
    intro:
      "A staircase is the one built element you touch every day and see from across the room. We build stairs that are dead-solid underfoot and sculptural to look at, whether that's hand-set iron balusters, warm reclaimed treads, or a clean modern cable rail. Every connection is load-tested and every handrail is shaped to sit right in the hand.",
    materials: [
      "Solid hardwood treads — oak, walnut, hickory, or reclaimed timber",
      "Hand-shaped, grain-matched handrails profiled for a comfortable grip",
      "Iron balusters, stainless cable rail, or turned wood spindles to suit the home",
      "Mortised, glued, and wedged joinery — no squeaks, no visible fasteners",
      "Custom newel posts built to anchor the rail and the design",
      "Code-compliant rise, run, and guard heights, verified before install",
    ],
    details: [
      {
        title: "Solid treads, not veneer over MDF",
        body: "Our treads are thick solid hardwood — built to be lived on, and to be sanded and refinished decades from now if you ever want a fresh look.",
      },
      {
        title: "Joinery that tightens with use",
        body: "Balusters and treads are mortised and wedged into the stringers, not surface-screwed. Done right, a stair gets quieter and more solid over the years, not loose and creaky.",
      },
      {
        title: "A handrail shaped for the hand",
        body: "We profile and hand-sand the rail so it flows continuously around turns and feels natural to grip — the detail people notice without knowing why.",
      },
    ],
    faq: [
      {
        q: "Can you reface an existing staircase?",
        a: "Often, yes. Re-treading, new balusters, and a fresh handrail can transform a dated stair without rebuilding the structure — we'll assess what's worth keeping.",
      },
      {
        q: "Do you do modern cable and glass railings too?",
        a: "We do. From traditional iron to minimalist cable rail, we match the railing to the architecture of your home.",
      },
      {
        q: "Are your stairs built to code?",
        a: "Always. Rise, run, guard height, and baluster spacing are verified to local building code and inspected where required.",
      },
    ],
    galleryIndices: [2, 3, 4, 5, 6, 22, 30, 32, 42],
    projectType: "Staircases & Railings",
    seo: {
      title: "Staircases & Railings",
      description:
        "Custom staircases and railings on the Colorado Front Range — solid hardwood treads, iron or cable rail, and joinery that stays solid for life.",
    },
  },
  {
    slug: "trim-molding-wainscoting",
    num: "04",
    title: "Trim, Molding & Wainscoting",
    shortTitle: "Trim & Millwork",
    cardDescription:
      "Crown molding, baseboards, casings, wall paneling, and wainscoting that give a room its finished, architectural soul.",
    Icon: MoldingIcon,
    cardImage: "/cards/04.webp",
    heroImage: "/gallery/cruz-37.webp",
    tagline: "The details that turn a builder-grade box into a home.",
    intro:
      "Trim is the quiet architecture of a room — crown, casing, base, and paneling that frame every wall and doorway. It's also where shortcuts show fastest. We mill to the right proportions, fit each corner tight, and finish so the woodwork reads as one continuous, intentional line around the room.",
    materials: [
      "Solid wood and clear, finger-joint-free stock for paint and stain grade",
      "Custom-milled profiles to match historic trim or create something new",
      "Frame-and-panel wainscoting that floats to allow seasonal wood movement",
      "Coped inside corners and tight, glued miters at every return",
      "Crown, picture rail, box beams, board-and-batten, and raised paneling",
      "Hand-caulked and finished for a seamless, painted-in-place look",
    ],
    details: [
      {
        title: "Coped corners, not caulk-and-pray",
        body: "Inside corners are coped — one piece scribed to the profile of the next — so the joint stays tight even as the house moves with the seasons.",
      },
      {
        title: "Proportion that fits the room",
        body: "Ceiling height, window size, and the home's era all set the right scale for trim. We size the profiles so the woodwork feels designed, never tacked on.",
      },
      {
        title: "Panels built to move",
        body: "Wainscot and raised panels float within their frames, the traditional way, so the wood can expand and contract without cracking the finish.",
      },
    ],
    faq: [
      {
        q: "Can you match the trim in an older home?",
        a: "Yes — we can replicate an existing profile by milling custom knives so additions and repairs disappear into the original woodwork.",
      },
      {
        q: "What's the difference between wainscoting and board-and-batten?",
        a: "Both are paneled wall treatments. Wainscot is typically framed panels with rails and stiles; board-and-batten is a cleaner grid of flat boards and battens. We'll suggest what suits your space.",
      },
      {
        q: "Do you paint the trim too?",
        a: "We install paint-ready and can finish in place, or coordinate with your painter for a flawless final coat.",
      },
    ],
    galleryIndices: [23, 33, 35, 36, 37],
    projectType: "Trim & Millwork",
    seo: {
      title: "Trim, Molding & Wainscoting",
      description:
        "Custom crown molding, casing, wainscoting, and wall paneling for Colorado homes — milled to proportion and fit with coped, lasting joinery.",
    },
  },
  {
    slug: "custom-closets",
    num: "05",
    title: "Custom Closets & Wardrobes",
    shortTitle: "Custom Closets",
    cardDescription:
      "Walk-in suites and reach-in systems with drawers, shelving, and hanging tailored to every inch of your space.",
    Icon: ClosetIcon,
    cardImage: "/cards/05.webp",
    heroImage: "/cards/05.webp",
    tagline: "A room you greet yourself in every morning.",
    intro:
      "The right closet turns getting dressed from a scramble into a calm, ordered ritual. We design around what you actually own — the hanging lengths, the drawer counts, the shoe and bag storage — and build it to use every inch from floor to ceiling. The result is bright, organized, and built to last far longer than a clip-together kit.",
    materials: [
      "Furniture-grade panels with solid hardwood edging, not melamine kits",
      "Full-extension, soft-close drawers so nothing hides at the back",
      "Adjustable shelving and hang rods on hand-drilled, reconfigurable pin holes",
      "Solid metal or hardwood hang rods sized to your wardrobe, not a standard length",
      "Integrated LED lighting under shelves and in drawers",
      "Optional glass-front fronts, valet rods, hampers, and jewelry inserts",
    ],
    details: [
      {
        title: "Every inch earns its keep",
        body: "We plan the layout around your real inventory — long hanging for coats and dresses, doubled rods where you can, drawers where you need them — so no wall goes to waste.",
      },
      {
        title: "Drawers that fully open",
        body: "Full-extension slides mean the back of every drawer is as usable as the front. Soft-close keeps it quiet at 6am.",
      },
      {
        title: "Reconfigurable as life changes",
        body: "Shelves and rods move on a pin system, so the closet can adapt as your wardrobe and needs evolve over the years.",
      },
    ],
    faq: [
      {
        q: "Walk-in or reach-in — do you do both?",
        a: "Both. From a full walk-in dressing room to maximizing a tight reach-in or hallway closet, the approach is the same: a layout built to your space and your stuff.",
      },
      {
        q: "Can it match my bedroom or bath cabinetry?",
        a: "Yes — we can carry a finish and style through from the closet into adjoining cabinetry for a cohesive suite.",
      },
      {
        q: "White, wood, or painted?",
        a: "Your call. Bright painted systems feel clean and airy; wood-tone systems feel warm and rich. We'll show you options for your space.",
      },
    ],
    galleryIndices: [13, 23, 27, 29],
    projectType: "Custom Closets",
    seo: {
      title: "Custom Closets & Wardrobes",
      description:
        "Custom walk-in and reach-in closet systems for Colorado homes — built-in drawers, adjustable shelving, and a layout tailored to every inch.",
    },
  },
  {
    slug: "mudrooms-lockers",
    num: "06",
    title: "Mudrooms, Lockers & Benches",
    shortTitle: "Mudroom & Entryway",
    cardDescription:
      "Hardworking entryways — built-in lockers, cubbies, hooks, and storage benches that keep daily life in order.",
    Icon: LockerIcon,
    cardImage: "/cards/06.webp",
    heroImage: "/cards/06.webp",
    tagline: "Where the chaos of the day gets put in its place.",
    intro:
      "The mudroom is the busiest three feet in the house — boots, backpacks, coats, leashes, all landing at once. We build entry systems that take the abuse of real family life and still look sharp: a bench you can stand on, lockers sized for each person, and hooks and cubbies that actually get used.",
    materials: [
      "Solid-wood and paint-grade construction built for daily wear",
      "Sturdy bench seats engineered to take weight, not just look the part",
      "Stainless or solid-brass hooks and hardware that won't bend or rust",
      "Individual lockers, cubbies, and drawers sized per person",
      "Durable, scrubbable finishes that shrug off wet boots and snow",
      "Optional shoe storage, charging drawers, and concealed bins",
    ],
    details: [
      {
        title: "A bench that takes a beating",
        body: "Seats are built and braced to be stood on and sat on hard, day after day — joined at the corners, not just screwed to a cleat.",
      },
      {
        title: "A spot for every person",
        body: "We lay out lockers and hooks by who uses them, at heights that work for kids and adults, so everything has a home and the floor stays clear.",
      },
      {
        title: "Finishes that survive winter",
        body: "Front Range winters are hard on an entry. We specify tough, washable finishes and rust-proof hardware so the mudroom still looks good in year ten.",
      },
    ],
    faq: [
      {
        q: "Can you fit a mudroom into a small entry or garage wall?",
        a: "Yes — even a single wall can become a hardworking drop zone with a bench, hooks, and cubbies. We design to the space you have.",
      },
      {
        q: "Open lockers or doors?",
        a: "Open cubbies are fast and easy for kids; doors hide the mess for a cleaner look. We often mix both in one run.",
      },
      {
        q: "Can it tie into adjoining cabinetry or laundry?",
        a: "Definitely. Mudrooms often flow into laundry or pantry storage, and we build it all to read as one continuous, finished space.",
      },
    ],
    galleryIndices: [17, 21, 26],
    projectType: "Mudroom & Entryway",
    seo: {
      title: "Mudrooms, Lockers & Benches",
      description:
        "Custom mudroom lockers, benches, and cubbies for Colorado homes — built to take real family wear and keep coats, boots, and bags in order.",
    },
  },
  {
    slug: "exposed-beams-ceilings",
    num: "07",
    title: "Exposed Beams & Wood Ceilings",
    shortTitle: "Beams & Ceilings",
    cardDescription:
      "Beam wraps, coffered and plank ceilings, and range-hood surrounds that bring warmth and character overhead.",
    Icon: BeamIcon,
    cardImage: "/cards/07.webp",
    heroImage: "/gallery/cruz-35.webp",
    tagline: "Look up — the fifth wall, finished in wood.",
    intro:
      "A ceiling in wood changes the whole feel of a room: warmer, taller, more grounded. We build box beams and full beam wraps, coffered grids, plank and tongue-and-groove ceilings, and the timber surrounds that frame a range hood. Whether it's reclaimed timber or new wood finished to look aged, the goal is character that feels original to the house.",
    materials: [
      "Reclaimed timber or new hardwood hand-finished to match a desired age",
      "Hollow box-beam construction that wraps structure without the weight",
      "Coffered grids laid out to the room so the proportions feel right",
      "Tongue-and-groove and shiplap planking for plank ceilings",
      "Hand-planed and wire-brushed textures, not sanded flat",
      "Concealed wiring and mounting so the woodwork looks structural and clean",
    ],
    details: [
      {
        title: "Honest-looking joinery",
        body: "Box beams are mitered and assembled so corners read as solid timber, with peg and strap details where you want the look of true post-and-beam.",
      },
      {
        title: "Texture that catches the light",
        body: "We hand-plane, wire-brush, or lightly distress surfaces so the wood shows grain and depth instead of a flat, factory sheen.",
      },
      {
        title: "Laid out to the room",
        body: "Coffer spacing and plank runs are set to the actual dimensions of your ceiling, so the grid lands symmetrically and the eye reads it as designed.",
      },
    ],
    faq: [
      {
        q: "Can beams go over an existing finished ceiling?",
        a: "Usually yes — box beams and planking can be mounted to the existing structure with no need to open the ceiling, as long as we locate solid framing to fasten to.",
      },
      {
        q: "Reclaimed or new wood?",
        a: "Reclaimed timber brings genuine age and history; new wood can be finished to mimic it for less cost and more consistency. We'll show you both.",
      },
      {
        q: "Do you build range-hood surrounds too?",
        a: "Yes — a timber hood surround is one of the best ways to make a kitchen feel custom, and it ties beautifully into a wood ceiling.",
      },
    ],
    galleryIndices: [28, 33, 35, 39],
    projectType: "Beams & Ceilings",
    seo: {
      title: "Exposed Beams & Wood Ceilings",
      description:
        "Custom box beams, coffered and plank ceilings, and timber range-hood surrounds for Colorado homes — warmth and character built overhead.",
    },
  },
  {
    slug: "fireplace-mantels",
    num: "08",
    title: "Fireplace Mantels & Surrounds",
    shortTitle: "Fireplace Mantel",
    cardDescription:
      "Timber mantels and custom surrounds that turn the fireplace into the natural heart of the room.",
    Icon: MantelIcon,
    cardImage: "/cards/08.webp",
    heroImage: "/gallery/cruz-40.webp",
    tagline: "The piece the whole room gathers around.",
    intro:
      "The fireplace is where a living room finds its center, and the mantel is its frame. We build everything from a single rugged timber beam to a full paneled surround with corbels and trim, scaled and detailed to suit your hearth. Each one is shaped, fit, and finished to look like it has always belonged.",
    materials: [
      "Solid timber mantels — oak, walnut, alder, or reclaimed beams",
      "Full surrounds with corbels, fluting, and panel detail",
      "Heat-aware finishes and clearances built to spec",
      "Concealed steel or hardwood mounting — no visible brackets",
      "Hand-shaped profiles and details, not router-stamped repeats",
      "Coordinated with stone, tile, or plaster surrounds",
    ],
    details: [
      {
        title: "Floats on hidden steel",
        body: "A heavy timber mantel can appear to float because the mounting is engineered into the wall — strong enough to hold a lifetime of stockings and photos, invisible to the eye.",
      },
      {
        title: "Shaped by hand",
        body: "Corbels and profiles are shaped and finished individually, so the details have life and aren't the dead repeat of a factory part.",
      },
      {
        title: "Built to live with heat",
        body: "We set clearances and choose finishes appropriate to your firebox, so the woodwork holds up to the warmth season after season.",
      },
    ],
    faq: [
      {
        q: "Can you build around an existing stone or tile surround?",
        a: "Yes — we template the existing opening and build the mantel or surround to integrate cleanly with stone, tile, or masonry already in place.",
      },
      {
        q: "Reclaimed beam or a built-up mantel?",
        a: "A solid reclaimed beam has rustic character; a built-up hollow mantel gives crisp lines and lets us hide the mounting. Both look fully solid when finished.",
      },
      {
        q: "Is a wood mantel safe above a fireplace?",
        a: "When clearances to the firebox are respected — which we build to code — a wood mantel is both safe and timeless. We'll confirm the requirements for your unit.",
      },
    ],
    galleryIndices: [40],
    projectType: "Fireplace Mantel",
    seo: {
      title: "Fireplace Mantels & Surrounds",
      description:
        "Custom timber mantels and fireplace surrounds for Colorado homes — solid wood, hand-shaped detail, and hidden mounting that floats.",
    },
  },
  {
    slug: "interior-barn-doors",
    num: "09",
    title: "Interior & Barn Doors",
    shortTitle: "Interior & Barn Doors",
    cardDescription:
      "Door hanging, crisp cased openings, and sliding barn doors that shape how your home flows together.",
    Icon: DoorIcon,
    cardImage: "/cards/09.webp",
    heroImage: "/gallery/cruz-20.webp",
    tagline: "A well-made door announces itself every time you touch it.",
    intro:
      "Doors do quiet, constant work — they shape how rooms connect and how a home feels to move through. We build and hang solid interior doors, sliding barn doors, and the crisp cased openings between them, all set dead-plumb so they swing or glide true and latch with a satisfying, solid sound.",
    materials: [
      "Solid-wood, frame-and-panel, and plank-built barn doors",
      "Heavy-duty barn-door track in steel, black iron, or brass",
      "Precision-hung swing doors, shimmed and plumbed to close true",
      "Custom cased openings, jambs, and casing to frame each passage",
      "Soft-close and floor-guide hardware so doors run quiet and straight",
      "Painted, stained, or natural-oil finishes to suit the room",
    ],
    details: [
      {
        title: "Hung to swing true",
        body: "A door is only as good as its hang. We plumb the jamb, shim the hinges, and set the reveals so the door closes with one easy push and an even gap all around.",
      },
      {
        title: "Barn doors that glide, not sag",
        body: "We mount the track into solid blocking and size the hardware to the slab, so a heavy door rolls smoothly for years instead of dropping out of alignment.",
      },
      {
        title: "Panels built to stay flat",
        body: "Frame-and-panel construction lets the wood move with the seasons without warping or splitting, so the door looks as crisp in year ten as on day one.",
      },
    ],
    faq: [
      {
        q: "Will a barn door actually block sound and light?",
        a: "A surface-sliding barn door is great for style and space-saving but leaves small gaps. Where privacy and sound matter most, we'll recommend a pocket or swing door instead — and tell you straight.",
      },
      {
        q: "Can you replace builder doors throughout the house?",
        a: "Yes — swapping flat hollow-core doors for solid panel doors and crisp casing is one of the highest-impact upgrades in a home, and we can do it room by room.",
      },
      {
        q: "Do you make the doors or just hang them?",
        a: "Both. We build custom slabs and barn doors, and we also expertly hang and case doors you've sourced.",
      },
    ],
    galleryIndices: [20],
    projectType: "Interior & Barn Doors",
    seo: {
      title: "Interior & Barn Doors",
      description:
        "Custom barn doors, solid interior doors, and crisp cased openings for Colorado homes — built solid and hung dead-plumb to swing or glide true.",
    },
  },
  {
    slug: "custom-woodwork",
    num: "10",
    title: "Custom Woodwork & Specialty Builds",
    shortTitle: "Custom Woodwork",
    cardDescription:
      "Built-in bunk beds, window seats, feature walls, and one-off pieces — if you can dream it in wood, we can build it.",
    Icon: SquareIcon,
    cardImage: "/cards/10.webp",
    heroImage: "/cards/10.webp",
    tagline: "The builds no catalog has a page for.",
    intro:
      "Some of the best projects don't fit a category — a loft bed with stairs and drawers built into a tricky corner, a window seat sized to a bay, a feature wall, a one-off piece a room was designed around. This is where we love to start from a sketch, solve the problem in wood, and build something that exists nowhere else.",
    materials: [
      "Whatever the piece calls for — solid hardwood, plywood, or mixed materials",
      "Joinery chosen for the job: dovetail, mortise-and-tenon, lap, or floating",
      "Engineered load paths and hidden bracing for seamless, strong builds",
      "Integrated lighting, drawers, and hardware where they make sense",
      "Finishes from natural oil to fully painted, matched to your room",
      "Built to integrate with existing cabinetry and architecture",
    ],
    details: [
      {
        title: "Starts with a conversation",
        body: "Specialty work begins with how the piece will be used and what it needs to feel like. We sketch, refine, and build from there — no template, no compromise.",
      },
      {
        title: "Engineered, not improvised",
        body: "A bunk or loft bed has to be as safe as it is handsome. We calculate the loads and hide the structure so the finished piece is rock-solid and clean-lined.",
      },
      {
        title: "Made to fit the exact spot",
        body: "Odd corners, sloped ceilings, and tight nooks are where custom shines — we build to the real conditions of your space instead of forcing in a stock size.",
      },
    ],
    faq: [
      {
        q: "I have an idea but no drawings — can you help?",
        a: "That's exactly how most of these start. Bring a photo, a rough sketch, or just a description, and we'll help shape it into something buildable.",
      },
      {
        q: "Are built-in bunk and loft beds safe?",
        a: "Yes — we engineer guardrails, ladders, and load capacity to be genuinely safe for kids, while keeping the design clean and built-in.",
      },
      {
        q: "Is there anything you won't take on?",
        a: "If it's made of wood and it'll make your home better, we're interested. The trickier the spot, the more we enjoy it.",
      },
    ],
    galleryIndices: [19, 24, 25],
    projectType: "Custom Woodwork",
    seo: {
      title: "Custom Woodwork & Specialty Builds",
      description:
        "One-of-a-kind built-ins for Colorado homes — loft and bunk beds, window seats, feature walls, and specialty pieces built from a sketch.",
    },
  },
  {
    slug: "cedar-saunas",
    num: "11",
    title: "Custom Cedar Saunas",
    shortTitle: "Cedar Saunas",
    cardDescription:
      "Cedar saunas built for your space — tiered benches, tight tongue-and-groove paneling, and heater surrounds crafted to take the heat and last for years.",
    Icon: SaunaIcon,
    cardImage: "/images/sauna.webp",
    heroImage: "/images/sauna.webp",
    tagline: "A daily ritual, built into your home.",
    intro:
      "A sauna turns a corner of the house into a place to slow down and reset. We build custom cedar saunas fit to your space — tight tongue-and-groove walls, tiered benches shaped for comfort, and a clean heater surround — all engineered to handle heat and humidity and hold up beautifully for years of use.",
    materials: [
      "Western red cedar — aromatic, stable, and naturally suited to heat",
      "Tongue-and-groove walls and ceiling that breathe with the heat",
      "Tiered bench seating shaped and spaced for comfort",
      "Heat-rated, hidden fasteners — nothing hot to the touch",
      "Proper ventilation and clearances designed around the heater",
      "Glass or solid cedar doors with the right hardware for heat",
    ],
    details: [
      {
        title: "Cedar, chosen for the job",
        body: "Western red cedar stays cool to the touch, resists warping in humidity, and fills the room with that unmistakable sauna aroma — the right wood for the work.",
      },
      {
        title: "Benches built for comfort",
        body: "Bench height, depth, and board spacing are set for how you'll actually sit and lie, with smooth, rounded edges and no exposed metal.",
      },
      {
        title: "Engineered for heat and moisture",
        body: "Ventilation, clearances, and concealed heat-rated fasteners are all planned around the heater so the sauna performs safely and lasts.",
      },
    ],
    faq: [
      {
        q: "Indoor or outdoor saunas?",
        a: "We focus on custom indoor cedar saunas fit to a room or basement. Tell us your space and we'll design around it.",
      },
      {
        q: "Do you handle the heater and electrical?",
        a: "We build the sauna and its surround and coordinate with a licensed electrician and your chosen heater so everything is installed safely and to spec.",
      },
      {
        q: "Why cedar over other woods?",
        a: "Cedar's stability in heat and humidity, low heat retention, and natural aroma make it the standard for fine saunas. It simply holds up where other woods don't.",
      },
    ],
    galleryIndices: [],
    projectType: "Cedar Sauna",
    seo: {
      title: "Custom Cedar Saunas",
      description:
        "Custom-built cedar saunas for Colorado homes — tongue-and-groove cedar, tiered benches, and heater surrounds engineered for heat and built to last.",
    },
  },
  {
    slug: "wine-cellars",
    num: "12",
    title: "Wine Cellars & Wine Rooms",
    shortTitle: "Wine Cellars",
    cardDescription:
      "Climate-ready wine rooms with hand-built racking, glass enclosures, and tasting spaces designed around your collection.",
    Icon: WineIcon,
    cardImage: "/cards/12.webp",
    heroImage: "/cards/12.webp",
    tagline: "A room that honors what it holds.",
    intro:
      "A wine room is part cellar, part showpiece — a place to store a collection properly and to show it off. We build the woodwork that makes it sing: hand-built racking cradling every bottle, warm display lighting, and glass-framed enclosures, all designed to work with the climate control that keeps your wine at its best.",
    materials: [
      "Hand-built racking in walnut, oak, or mahogany — individual cradles and bins",
      "Diamond bins, display rows, case storage, and bottle-and-label presentation",
      "Glass-and-wood enclosures framed for an insulated, sealed room",
      "Warm, low-heat LED display lighting that won't harm the wine",
      "Cabinetry and tasting counters built into the design",
      "Woodwork coordinated with your cooling and humidity system",
    ],
    details: [
      {
        title: "Racking built for the bottle",
        body: "Each cradle and bin is sized to hold bottles securely at the right angle, with display rows and label-forward presentation for the ones you're proud of.",
      },
      {
        title: "Lit to show, sized to grow",
        body: "Warm, low-heat lighting makes the wood and the labels glow, and we plan capacity so the collection has room to expand.",
      },
      {
        title: "Built around the climate",
        body: "Wine wants steady temperature and humidity. We frame and finish the room to work with your cooling system and coordinate the seal so the woodwork and the climate work together.",
      },
    ],
    faq: [
      {
        q: "Do you install the cooling system?",
        a: "We build all the woodwork, enclosure, and cabinetry, and coordinate with a climate-control specialist for the cooling and humidity equipment so the room performs as a true cellar.",
      },
      {
        q: "Can a wine room go under the stairs or in a closet?",
        a: "Yes — an under-stair nook, a closet, or a basement corner can all become a beautiful glass-fronted wine display. We design to the space you have.",
      },
      {
        q: "What wood do you recommend for racking?",
        a: "Walnut, oak, and mahogany are favorites for their stability and rich look in a wine room. We'll match the wood to the rest of your home.",
      },
    ],
    galleryIndices: [],
    projectType: "Wine Cellar",
    seo: {
      title: "Wine Cellars & Wine Rooms",
      description:
        "Custom wine cellars and wine rooms for Colorado homes — hand-built racking, glass enclosures, and tasting spaces designed around your collection.",
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}
