// Data for the cinematic /tour experience. Each room shows its finished
// establishing frame with a single glowing hotspot on the piece we built;
// pressing it expands fullscreen and plays the "assemble" clip (parts come
// together), then reveals a short caption + estimate CTA.
//
// Frames live in /public/tour-frames/NN_est.webp, clips in
// /public/tour-clips/NN.mp4 (silent, ~5s, the reversed Kling disassembly).
// `hotspot` is the marker position as a percentage of the frame (left/top);
// tuned to sit on the built piece in each shot.

export interface TourRoom {
  num: string;
  zone: string;
  title: string;
  /** Short one-line caption shown under the title after the clip plays. */
  caption: string;
  /** Marker position over the built piece, as % of the frame. */
  hotspot: { x: number; y: number };
}

export const TOUR_ROOMS: TourRoom[] = [
  { num: "01", zone: "Arrival", title: "Interior & Exterior Doors",
    caption: "Rift-sawn white oak, frame-and-panel, on a concealed steel pivot — the first thing they touch.",
    hotspot: { x: 42, y: 54 } },
  { num: "02", zone: "Main floor", title: "Mudrooms, Lockers & Benches",
    caption: "Walnut casework, hand-cut dovetail cubbies, soft-close drawers — a place for everything.",
    hotspot: { x: 40, y: 56 } },
  { num: "03", zone: "Main floor", title: "Custom Woodwork & Specialty Builds",
    caption: "Steam-bent white-oak slats, continuous grain-match — the build no catalog has a page for.",
    hotspot: { x: 48, y: 52 } },
  { num: "04", zone: "Main floor", title: "Staircases & Railings",
    caption: "Solid white-oak treads housed in a blackened-steel stringer — the spine of the house.",
    hotspot: { x: 50, y: 52 } },
  { num: "05", zone: "Main floor", title: "Trim, Molding & Wainscoting",
    caption: "White-oak wainscoting, mitered frame-and-panel, shadow-line reveals — the details that make a home.",
    hotspot: { x: 46, y: 56 } },
  { num: "06", zone: "Great room", title: "Exposed Beams & Wood Ceilings",
    caption: "Exposed timber, mortise-and-tenon, tongue-and-groove oak decking — the fifth wall, in wood.",
    hotspot: { x: 50, y: 40 } },
  { num: "07", zone: "Great room", title: "Fireplace Mantels & Surrounds",
    caption: "Live-edge black walnut on a floating steel-pin mount — the piece the room gathers around.",
    hotspot: { x: 50, y: 55 } },
  { num: "08", zone: "Great room", title: "Built-In Shelving & Entertainment",
    caption: "Grain-matched walnut, frameless casework, integrated lighting — storage that becomes architecture.",
    hotspot: { x: 48, y: 50 } },
  { num: "09", zone: "Kitchen", title: "Custom Cabinetry & Kitchens",
    caption: "White oak and walnut, inset doors, dovetailed drawers — the hardest-working room, built to last.",
    hotspot: { x: 48, y: 56 } },
  { num: "10", zone: "Lower level", title: "Wine Cellars & Wine Rooms",
    caption: "Walnut racking, angled bottle cradles, mortise-and-tenon frame — a room that honors what it holds.",
    hotspot: { x: 46, y: 50 } },
  { num: "11", zone: "Lower level", title: "Home Bars & Butler's Pantries",
    caption: "Walnut millwork, waterfall miter, brass rail, backlit shelves — where the party finds its center.",
    hotspot: { x: 48, y: 54 } },
  { num: "12", zone: "Lower level", title: "Home Offices & Libraries",
    caption: "Floor-to-ceiling walnut casework, rolling ladder, solid-wood desk — a room that works as hard as you do.",
    hotspot: { x: 46, y: 50 } },
  { num: "13", zone: "Upper level", title: "Beds, Frames & Nightstands",
    caption: "Solid walnut platform, slatted headboard, pinned corner joinery — the centerpiece of the room you rest in.",
    hotspot: { x: 50, y: 56 } },
  { num: "14", zone: "Upper level", title: "Custom Closets & Wardrobes",
    caption: "White oak and walnut, dovetailed drawers, glass-front uppers — a room you greet yourself in.",
    hotspot: { x: 46, y: 54 } },
  { num: "15", zone: "Outside", title: "Cedar Hot Tubs & Surrounds",
    caption: "Western red cedar, tongue-and-groove staving, chamfered edges, marine finish — built for water and weather.",
    hotspot: { x: 50, y: 56 } },
  { num: "16", zone: "Outside", title: "Garage & Storage Systems",
    caption: "Walnut and oak storage, slat-wall system, solid-wood workbench — order, built in.",
    hotspot: { x: 48, y: 54 } },
];
