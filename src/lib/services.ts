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
  DeskIcon,
  HotTubIcon,
  PergolaIcon,
  BarIcon,
  KitchenIcon,
  OfficeIcon,
  WindowSeatIcon,
  GarageIcon,
  BedIcon,
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
    heroImage: "/gallery/cruz-29.webp",
    tagline: "A room you greet yourself in every morning.",
    intro:
      "The right closet turns getting dressed from a scramble into a calm, ordered ritual. We design around what you actually own — the hanging lengths, the drawer counts, the shoe and bag storage — and build it to use every inch from floor to ceiling. The result is bright, organized, and built to last far longer than a clip-together kit.",
    materials: [
      "Furniture-grade panels with solid hardwood edging, not melamine kits",
      "Full-extension, soft-close drawers so nothing hides at the back",
      "Adjustable shelving and hang rods on hand-drilled, reconfigurable pin holes",
      "Solid metal or hardwood hang rods sized to your wardrobe, not a standard length",
      "Integrated LED lighting under shelves and in drawers",
      "Optional glass-front doors, valet rods, hampers, and jewelry inserts",
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
    heroImage: "/gallery/cruz-26.webp",
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
    heroImage: "/gallery/cruz-25.webp",
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
  {
    slug: "desks-libraries",
    num: "13",
    title: "Custom Desks & Home Libraries",
    shortTitle: "Desks & Libraries",
    cardDescription:
      "Built-in desks, paneled studies, and floor-to-ceiling library walls — a home office or reading room built around how you work and what you collect.",
    Icon: DeskIcon,
    cardImage: "/cards/13.webp",
    heroImage: "/cards/13.webp",
    tagline: "A room that works as hard as you do.",
    intro:
      "Whether it's a fitted desk that finally tames the home office or a floor-to-ceiling library with a rolling ladder, a built-in study turns a spare room into the best room in the house. We design around your work, your books, and your space — then build it in solid wood to last a whole career.",
    materials: [
      "Solid hardwoods — walnut, white oak, cherry — with grain-matched fronts",
      "Floor-to-ceiling shelving with a rolling ladder and rail",
      "Integrated desks with drawers, file storage, and hidden cable management",
      "Adjustable and fixed shelving sized to your collection",
      "Paneled walls and wainscoting to finish the room",
      "Integrated, dimmable lighting in shelves and over the desk",
    ],
    details: [
      {
        title: "A wall built for a lifetime of books",
        body: "Floor-to-ceiling shelving — with a ladder where the wall runs tall — turns a collection into the centerpiece of the room, engineered to carry real weight without a sag.",
      },
      {
        title: "A desk built for how you work",
        body: "We plan the desk around your real workflow — monitor height, drawers where you reach, outlets and cords hidden — so the office works as well as it looks.",
      },
      {
        title: "Paneling that makes it a room",
        body: "Wainscot, paneled walls, and a finished ceiling turn four blank walls into a study with the gravity of a room that was always meant to be there.",
      },
    ],
    faq: [
      {
        q: "Can you fit a home office into a small or shared room?",
        a: "Yes — a fitted desk and shelving wall make the most of a tight space, and we can tuck a full office into a closet, a landing, or one wall of a guest room.",
      },
      {
        q: "Can you build a library with a rolling ladder?",
        a: "Absolutely — a ladder on a rail is one of our favorite details, and we build the wall to carry it safely from end to end.",
      },
      {
        q: "Will it match the trim and cabinetry in the rest of my home?",
        a: "Yes. We match species, profile, and finish so a new study reads as original to the house.",
      },
    ],
    galleryIndices: [],
    projectType: "Desks & Libraries",
    seo: {
      title: "Custom Desks & Home Libraries",
      description:
        "Built-in desks, home offices, and floor-to-ceiling library walls for Colorado homes — solid-wood shelving, rolling ladders, and paneled studies built to last.",
    },
  },
  {
    slug: "cedar-hot-tubs",
    num: "14",
    title: "Cedar Hot Tubs & Surrounds",
    shortTitle: "Cedar Hot Tubs",
    cardDescription:
      "Handcrafted cedar soaking tubs and the custom decking, steps, and surrounds that frame them — a backyard wellness retreat in naturally rot-resistant cedar.",
    Icon: HotTubIcon,
    cardImage: "/cards/14.webp",
    heroImage: "/cards/14.webp",
    tagline: "Soak under the Front Range sky.",
    intro:
      "A cedar hot tub is wellness you can feel and smell — naturally rot-resistant wood, tight cooperage, and a surround built right into your deck or patio. We craft the tub, the steps, the screening, and the decking around it as one cohesive cedar retreat, engineered to take the Colorado weather and the heat.",
    materials: [
      "Western red cedar — aromatic, stable, naturally rot- and rot-resistant",
      "Tight stave cooperage and tongue-and-groove construction",
      "Custom cedar decking, steps, skirting, and benches around the tub",
      "Privacy screens and slatted surrounds designed to your yard",
      "Hidden, heat- and weather-rated stainless hardware",
      "Coordinated with your heater, jets, and plumbing",
    ],
    details: [
      {
        title: "Cedar built for water and weather",
        body: "Western red cedar is the time-honored choice for soaking tubs — it resists rot, stays comfortable to the touch, and fills the air with that unmistakable cedar scent.",
      },
      {
        title: "Tub and surround as one design",
        body: "We don't just drop in a tub — we build the decking, steps, screening, and seating around it so the whole retreat reads as one intentional, finished space.",
      },
      {
        title: "Built for the Colorado climate",
        body: "Sun, snow, and freeze-thaw are hard on outdoor wood. We detail the drainage, fasteners, and finishes so the tub and deck hold up season after season.",
      },
    ],
    faq: [
      {
        q: "Do you build the tub itself, or just the surround?",
        a: "Both — we build handcrafted cedar soaking tubs and the custom decking, steps, and screening around them, or just the surround and decking for a tub you already have.",
      },
      {
        q: "Why cedar for a hot tub?",
        a: "Cedar is naturally rot-resistant, stable in heat and moisture, stays cool to the touch, and smells incredible — the traditional standard for fine soaking tubs.",
      },
      {
        q: "Do you handle the heater and plumbing?",
        a: "We build the woodwork and coordinate closely with a licensed plumber and your chosen heater/jet system so everything is installed safely and to spec.",
      },
    ],
    galleryIndices: [],
    projectType: "Cedar Hot Tub",
    seo: {
      title: "Cedar Hot Tubs & Surrounds",
      description:
        "Handcrafted cedar hot tubs, soaking tubs, and custom decking surrounds for Colorado homes — rot-resistant cedar, built for the Front Range climate.",
    },
  },
  {
    slug: "outdoor-living",
    num: "15",
    title: "Outdoor Living — Pergolas & Decks",
    shortTitle: "Outdoor Living",
    cardDescription:
      "Cedar pergolas, custom decks, timber structures, and tongue-and-groove patio ceilings that extend your home into the Colorado outdoors.",
    Icon: PergolaIcon,
    cardImage: "/cards/15.webp",
    heroImage: "/cards/15.webp",
    tagline: "Bring the craftsmanship outside.",
    intro:
      "The Front Range practically lives outdoors half the year. We build the cedar pergolas, decks, and timber structures that turn a backyard into a destination — exposed beams, tongue-and-groove ceilings, built-in benches — all in weather-tough wood, joined to last through Colorado seasons.",
    materials: [
      "Cedar and structural timber, with composite decking options",
      "Exposed timber beams and posts with real joinery",
      "Tongue-and-groove pergola and patio ceilings",
      "Hidden fasteners for clean, splinter-free surfaces",
      "Built-in benches, planters, and integrated lighting",
      "Code-compliant footings engineered for snow load and wind",
    ],
    details: [
      {
        title: "Timber-framed to last",
        body: "Posts, beams, and rafters are sized and joined for real structure — not a kit — so a pergola or deck stands solid through wind, sun, and heavy mountain snow.",
      },
      {
        title: "Ceilings that finish the space",
        body: "A tongue-and-groove ceiling under a pergola or covered patio turns an open frame into an outdoor room, warm overhead and finished like the inside of the house.",
      },
      {
        title: "Built for snow load and sun",
        body: "We detail the footings, flashing, fasteners, and finishes for Colorado's freeze-thaw and intense UV, so the structure ages gracefully instead of greying out and loosening.",
      },
    ],
    faq: [
      {
        q: "Cedar or composite?",
        a: "Both have a place — cedar for natural beauty and structure, composite for low-maintenance decking surfaces. We'll help you choose the right mix for your budget and exposure.",
      },
      {
        q: "Do you handle permits and footings?",
        a: "Yes — we engineer code-compliant footings and pull the required permits so the structure is safe, inspected, and built to last.",
      },
      {
        q: "Can you tie into my existing deck or home?",
        a: "Absolutely — we integrate new pergolas and decks with existing structures and the home's rooflines so the addition looks original.",
      },
    ],
    galleryIndices: [],
    projectType: "Outdoor Living",
    seo: {
      title: "Outdoor Living — Pergolas & Decks",
      description:
        "Custom cedar pergolas, decks, and timber outdoor structures for Colorado homes — exposed beams, T&G ceilings, built to take snow load and Front Range sun.",
    },
  },
  {
    slug: "home-bars",
    num: "16",
    title: "Home Bars & Butler's Pantries",
    shortTitle: "Home Bars",
    cardDescription:
      "Wet bars, beverage stations, and butler's pantries with glass-front display, backlit shelving, and integrated wine and beverage fridges — built for entertaining.",
    Icon: BarIcon,
    cardImage: "/cards/16.webp",
    heroImage: "/cards/16.webp",
    tagline: "Where the party finds its center.",
    intro:
      "A home bar or butler's pantry is the entertaining hub — and a chance to show off real cabinetry. We build wet bars, beverage stations, and sculleries with glass-front uppers, backlit floating shelves, and integrated fridges, finished to match your kitchen and made to handle a crowd.",
    materials: [
      "Hardwood cabinetry — walnut, oak, cherry — to match your kitchen",
      "Glass-front display uppers and backlit floating shelves",
      "Integrated wine and beverage fridges, sinks, and ice makers",
      "Stone, quartz, or butcher-block counters",
      "Dedicated stemware, bottle, and glass storage",
      "Soft-close drawers and doors throughout",
    ],
    details: [
      {
        title: "Display that glows",
        body: "Glass-front cabinets and backlit shelves turn your glassware and favorite bottles into the feature — warm light that makes the whole bar come alive after dark.",
      },
      {
        title: "Built around your appliances",
        body: "Wine fridge, beverage cooler, ice maker, bar sink — we plan the cabinetry around the exact units you want so everything fits flush and runs cleanly.",
      },
      {
        title: "Pairs with the wine cellar",
        body: "A bar and a wine room are a natural duo. We build them to share a material palette and detailing so the entertaining spaces feel like one cohesive design.",
      },
    ],
    faq: [
      {
        q: "Can you build a true wet bar with plumbing?",
        a: "Yes — we build the cabinetry and counters and coordinate with a licensed plumber and electrician for the sink, fridges, and any appliances.",
      },
      {
        q: "Will it match my kitchen?",
        a: "That's the goal — we match species, finish, and hardware so the bar or butler's pantry reads as an extension of the kitchen.",
      },
      {
        q: "Can you fit specific fridges and appliances?",
        a: "Absolutely. Give us the models you want and we build the openings and surrounds to the exact specs.",
      },
    ],
    galleryIndices: [],
    projectType: "Home Bar",
    seo: {
      title: "Home Bars & Butler's Pantries",
      description:
        "Custom home bars, wet bars, and butler's pantries for Colorado homes — glass-front display, backlit shelving, and integrated wine and beverage fridges.",
    },
  },
  {
    slug: "kitchen-islands",
    num: "17",
    title: "Kitchen Islands & Custom Kitchens",
    shortTitle: "Kitchen Islands",
    cardDescription:
      "Statement islands and full custom kitchens — waterfall counters, seated islands, integrated appliances, and cabinetry built around how you cook.",
    Icon: KitchenIcon,
    cardImage: "/gallery/cruz-34.webp",
    heroImage: "/gallery/cruz-34.webp",
    tagline: "The island everyone gathers around.",
    intro:
      "The island is where the kitchen really lives — prep, gather, homework, a glass of wine. We build statement islands and full custom kitchens around the way you actually cook: the right work zones, seating that fits, appliances built in clean, and cabinetry finished to the last reveal.",
    materials: [
      "Solid-wood fronts on furniture-grade cabinet boxes",
      "Waterfall, seated, and double-island configurations",
      "Integrated appliance, sink, and outlet cutouts built to spec",
      "Stone, quartz, or butcher-block countertops",
      "Dovetailed, soft-close drawers and pull-out storage",
      "Spice, tray, trash, and charging organization built in",
    ],
    details: [
      {
        title: "An island built around how you cook",
        body: "Prep zone, seating, storage, and clearances are all planned to your real routine, so the island works as hard as it looks — not just a slab in the middle of the room.",
      },
      {
        title: "Appliances built in clean",
        body: "Range, hood, fridge, dishwasher, microwave drawer — we build the cabinetry to your exact appliance specs so everything sits flush and panels disappear into the design.",
      },
      {
        title: "Storage that disappears",
        body: "Deep pan drawers, pull-out pantries, hidden trash, and tray dividers keep the counters clear and every tool exactly where you reach for it.",
      },
    ],
    faq: [
      {
        q: "Can you build just an island, or a whole kitchen?",
        a: "Both — a standalone statement island, a full custom kitchen, or a refresh of part of an existing one.",
      },
      {
        q: "Can you match my existing cabinetry?",
        a: "Yes. We match species, door style, and finish so a new island or run blends seamlessly with what's there.",
      },
      {
        q: "Do you handle countertops and appliances?",
        a: "We build and install the cabinetry and coordinate closely with your counter fabricator and appliance specs so everything lands flush and on schedule.",
      },
    ],
    galleryIndices: [34, 18, 9, 1, 14, 16, 41],
    projectType: "Custom Cabinetry",
    seo: {
      title: "Kitchen Islands & Custom Kitchens",
      description:
        "Custom kitchen islands and full kitchens for Colorado homes — waterfall and seated islands, integrated appliances, and dovetailed cabinetry built to last.",
    },
  },
  {
    slug: "home-offices",
    num: "18",
    title: "Home Offices & Studies",
    shortTitle: "Home Offices",
    cardDescription:
      "Fitted home offices and studies — built-in desks, dual workstations, file storage, and shelving that turn a spare room into a productive, beautiful workspace.",
    Icon: OfficeIcon,
    cardImage: "/cards/18.webp",
    heroImage: "/cards/18.webp",
    tagline: "Work from home, beautifully.",
    intro:
      "Working from home deserves better than a folding table in the corner. We build fitted offices and studies with wall-to-wall desks, dual workstations, real file storage, and shelving — a workspace organized around your day and finished like the rest of your home.",
    materials: [
      "Hardwood desk cabinetry with grain-matched fronts",
      "Single, dual, or shared workstation layouts",
      "Full-extension file and supply drawers, soft-close",
      "Upper cabinets and open display shelving",
      "Hidden cable management, outlets, and charging",
      "Paneled walls plus task and shelf lighting",
    ],
    details: [
      {
        title: "A desk built for real work",
        body: "Monitor height, keyboard depth, drawers within reach, and cords routed out of sight — the office is planned around how you actually work, not a stock footprint.",
      },
      {
        title: "Storage that ends the clutter",
        body: "Real file drawers, supply storage, and a home for the printer mean the desk stays clear and the paperwork actually has somewhere to go.",
      },
      {
        title: "A room you want to be in",
        body: "Paneling, shelving, and warm lighting turn a spare bedroom into a study with the focus and calm that working from home should have.",
      },
    ],
    faq: [
      {
        q: "Can you fit two workstations in one room?",
        a: "Yes — side-by-side or facing dual desks are a common request, and we plan the layout so both have storage, light, and elbow room.",
      },
      {
        q: "Can you build an office into a closet or small space?",
        a: "Absolutely — a 'cloffice' or a single fitted wall makes a full, tidy workspace out of a closet, a landing, or one corner of a room.",
      },
      {
        q: "Can you hide the printer, cords, and gear?",
        a: "That's the point — we design in cable management, a printer cubby, and closed storage so the tech disappears.",
      },
    ],
    galleryIndices: [],
    projectType: "Desks & Libraries",
    seo: {
      title: "Home Offices & Studies",
      description:
        "Custom built-in home offices and studies for Colorado homes — fitted desks, dual workstations, file storage, and shelving for a beautiful work-from-home space.",
    },
  },
  {
    slug: "window-seats",
    num: "19",
    title: "Window Seats & Banquettes",
    shortTitle: "Window Seats",
    cardDescription:
      "Built-in window seats and breakfast-nook banquettes with hidden storage — the cozy, hardworking corners that make a home feel custom.",
    Icon: WindowSeatIcon,
    cardImage: "/gallery/cruz-19.webp",
    heroImage: "/gallery/cruz-19.webp",
    tagline: "The coziest seat in the house.",
    intro:
      "A window seat or a built-in banquette is the kind of detail people fall in love with — a reading nook in the bay window, a breakfast bench that seats the whole family, storage hidden underneath. We build them to fit the spot exactly, with comfort and storage designed in.",
    materials: [
      "Solid-wood frames and bench bases built to be sat on hard",
      "Lift-top or drawer storage tucked under the seat",
      "Cushion platforms sized for real comfort",
      "Paneling and trim matched to the surrounding room",
      "Integrated bookshelves, cubbies, and side cabinets",
      "Durable, scrubbable finishes for daily use",
    ],
    details: [
      {
        title: "Storage hidden under the seat",
        body: "Lift-top benches or deep drawers turn a seat into a place to stash blankets, games, and seasonal gear — function hiding in plain sight.",
      },
      {
        title: "Built to the exact nook",
        body: "Bay windows, odd corners, and sloped walls are where window seats shine. We template the space so the bench fits like it was framed in with the house.",
      },
      {
        title: "Comfort designed in",
        body: "Seat height, depth, and back angle are planned for how you'll actually sit — and we coordinate cushions so the nook is as comfortable as it is charming.",
      },
    ],
    faq: [
      {
        q: "Can you add storage underneath?",
        a: "Almost always — lift-top seats or drawers are one of the best reasons to build a window seat in the first place.",
      },
      {
        q: "Can you fit a bay window or an awkward corner?",
        a: "Yes — irregular spaces are exactly where a built-in bench beats any piece of furniture. We build to the real conditions of the nook.",
      },
      {
        q: "Do you provide the cushions?",
        a: "We build the bench and platform and coordinate with an upholsterer (or your chosen cushions) so everything fits perfectly.",
      },
    ],
    galleryIndices: [19],
    projectType: "Custom Woodwork",
    seo: {
      title: "Window Seats & Banquettes",
      description:
        "Custom built-in window seats and breakfast-nook banquettes for Colorado homes — hidden storage, fit to the exact nook, comfortable and built to last.",
    },
  },
  {
    slug: "garage-storage",
    num: "20",
    title: "Garage & Storage Systems",
    shortTitle: "Garage Storage",
    cardDescription:
      "Custom garage cabinetry, workbenches, and whole-home storage systems — built-in organization that turns the garage and utility spaces into the tidiest rooms in the house.",
    Icon: GarageIcon,
    cardImage: "/cards/20.webp",
    heroImage: "/cards/20.webp",
    tagline: "Order, built in.",
    intro:
      "The garage doesn't have to be the room where everything gets dumped. We build custom garage cabinetry, workbenches, slat-wall organization, and overhead storage — durable, dialed-in systems that make the garage and every utility space genuinely usable.",
    materials: [
      "Heavy-duty cabinetry and workbenches built for real loads",
      "Slat-wall and hook systems for tools and gear",
      "Overhead and tall storage for seasonal items",
      "Butcher-block or laminate work surfaces",
      "Durable, scrubbable, moisture-tolerant finishes",
      "Lockable and ventilated options where you need them",
    ],
    details: [
      {
        title: "Built for real loads and wear",
        body: "Garage storage takes a beating — heavy tools, totes, gear. We build with the bracing and hardware to carry it, not flimsy kit cabinetry that sags in a season.",
      },
      {
        title: "A workbench that works",
        body: "A solid bench with the right height, storage, and surface turns the garage into a genuine workshop — with everything you reach for within arm's length.",
      },
      {
        title: "Every inch organized",
        body: "Floor cabinets, overhead storage, and slat-wall together get the clutter off the floor and onto a system, so the cars (and the chaos) finally fit.",
      },
    ],
    faq: [
      {
        q: "Do you do garages and other rooms?",
        a: "Yes — garages, mudrooms, pantries, laundry, basements, and utility spaces. Anywhere storage needs to work hard.",
      },
      {
        q: "Is it durable enough for a garage?",
        a: "We build to garage-grade standards — tougher materials, finishes, and hardware than interior cabinetry, sized for heavy daily use.",
      },
      {
        q: "Can you design around my space and doors?",
        a: "Absolutely — we plan around door swings, vehicle clearances, water heaters, and panels so the system fits the real garage.",
      },
    ],
    galleryIndices: [],
    projectType: "Garage & Storage",
    seo: {
      title: "Garage & Storage Systems",
      description:
        "Custom garage cabinetry, workbenches, and storage systems for Colorado homes — heavy-duty, organized built-ins for the garage and every utility space.",
    },
  },
  {
    slug: "bunk-loft-beds",
    num: "21",
    title: "Built-In Bunk & Loft Beds",
    shortTitle: "Bunk & Loft Beds",
    cardDescription:
      "Custom built-in bunk and loft beds with stairs, drawers, and desks — the showpiece of a kids' room, guest room, or mountain cabin.",
    Icon: BedIcon,
    cardImage: "/gallery/cruz-24.webp",
    heroImage: "/gallery/cruz-25.webp",
    tagline: "The bed they'll never want to leave.",
    intro:
      "A built-in bunk or loft bed is the heart of a kids' room or a bunkhouse — and a Colorado-cabin essential. We build them in solid wood with safe stairs and rails, drawers and desks tucked underneath, and the kind of nooks that turn bedtime into the best part of the day.",
    materials: [
      "Solid-wood bed frames engineered to last for years",
      "Built-in staircases or ladders with proper guard rails",
      "Under-bed drawers, desks, and cubby storage",
      "Integrated reading lights and outlets",
      "Finishes safe and durable for kids' rooms",
      "Layouts for two, three, or four built-in sleepers",
    ],
    details: [
      {
        title: "Safe by design",
        body: "Guard rails, sturdy stairs or ladders, and load-tested framing mean a bunk or loft that's genuinely safe for kids — built well beyond a flat-pack bed.",
      },
      {
        title: "Storage and desks built in",
        body: "Drawers, a desk, and shelving tucked under the platform turn a bed into a whole little room — perfect for small bedrooms and bunkhouses.",
      },
      {
        title: "Built for the cabin and the kids' room",
        body: "From a mountain bunkhouse that sleeps the whole family to a magical kids'-room loft, we design the build to the space and the way it'll be used.",
      },
    ],
    faq: [
      {
        q: "Are built-in bunk and loft beds safe for kids?",
        a: "Yes — we engineer guard rails, stairs/ladders, and load capacity to be genuinely safe, while keeping the design clean and built-in.",
      },
      {
        q: "Can you fit several beds into one room?",
        a: "That's a specialty — bunk walls that sleep four, L-shaped layouts, and loft+desk combos all make the most of a small or shared room.",
      },
      {
        q: "Can you add storage and a desk underneath?",
        a: "Absolutely — drawers, a desk, and shelving under the platform are some of the best parts of a custom built-in bed.",
      },
    ],
    galleryIndices: [24, 25],
    projectType: "Custom Woodwork",
    seo: {
      title: "Built-In Bunk & Loft Beds",
      description:
        "Custom built-in bunk and loft beds for Colorado homes and cabins — safe stairs and rails, under-bed drawers and desks, built in solid wood.",
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}
