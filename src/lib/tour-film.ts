// Manifest for the continuous scroll-driven /tour film.
//
// The film is a sequence of short silent clips played back-to-back:
//   opening (exterior → front door)
//   → room 01 (assemble) → travel 01→02 → room 02 (assemble) → travel 02→03 → …
//   → room 16 (assemble)
//
// Rather than scrubbing one giant all-keyframe file, the player treats each clip
// as a SEGMENT on a global timeline. Scroll progress maps to a global time; the
// player seeks the active segment and swaps the <video> source at boundaries,
// preloading neighbours. Snap points are the room segments; the orb rail maps
// each room to its segment.
//
// Assets live in /public/tour-film/: opening.mp4, room-NN.mp4, travel-NN-MM.mp4.

import { TOUR_ROOMS, type TourRoom } from "@/lib/tour";

export type SegmentKind = "opening" | "room" | "travel";

export interface FilmSegment {
  kind: SegmentKind;
  src: string;
  /** Clip length in seconds (must match the encoded asset). */
  duration: number;
  /** Present for room segments — links to the room's copy + orb. */
  roomNum?: string;
}

// Encoded clip durations (seconds). Room assemble clips are trimmed to keep
// momentum; travel + opening are slightly longer for the camera move to read.
const ROOM_DURATION = 5;
const TRAVEL_DURATION = 4;
const OPENING_DURATION = 5;

/**
 * Seconds of crossfade dissolve between every clip in the master. The encoder
 * (scripts that rebuild master.mp4) overlaps each boundary by this much, so the
 * timeline below must subtract the same overlap or scroll→time would drift off
 * the picture. MUST stay in sync with the value passed to ffmpeg's xfade.
 */
export const CROSSFADE = 0.5;

/** Build the ordered segment list from the room data. */
export function buildFilmSegments(rooms: TourRoom[] = TOUR_ROOMS): FilmSegment[] {
  const segments: FilmSegment[] = [
    { kind: "opening", src: "/tour-film/opening.mp4", duration: OPENING_DURATION },
  ];
  rooms.forEach((room, i) => {
    segments.push({
      kind: "room",
      src: `/tour-film/room-${room.num}.mp4`,
      duration: ROOM_DURATION,
      roomNum: room.num,
    });
    const next = rooms[i + 1];
    if (next) {
      segments.push({
        kind: "travel",
        src: `/tour-film/travel-${room.num}-${next.num}.mp4`,
        duration: TRAVEL_DURATION,
      });
    }
  });
  return segments;
}

export interface RoomMark {
  room: TourRoom;
  /** Index of the room's segment in the film. */
  segmentIndex: number;
  /** Global time (s) at the START of the room segment. */
  startTime: number;
  /** Global time (s) at the END of the room segment. */
  endTime: number;
  /** Global time (s) at the MIDDLE of the room segment (snap target). */
  midTime: number;
  /** Position along the whole film as a 0–1 fraction (for the orb rail). */
  fraction: number;
}

export interface FilmTimeline {
  segments: FilmSegment[];
  /** Cumulative start time (s) for each segment, same length as segments. */
  offsets: number[];
  /** Total film duration (s). */
  total: number;
  /** One mark per room, for snap points + the orb rail. */
  rooms: RoomMark[];
}

/** Pre-compute offsets, total duration, and per-room marks. */
export function buildTimeline(rooms: TourRoom[] = TOUR_ROOMS): FilmTimeline {
  const segments = buildFilmSegments(rooms);
  // Each clip is pulled CROSSFADE earlier than a hard concat would place it,
  // because every preceding boundary overlaps its neighbour by that much.
  const offsets: number[] = [];
  let acc = 0;
  segments.forEach((seg, i) => {
    offsets.push(acc - i * CROSSFADE);
    acc += seg.duration;
  });
  const total = acc - (segments.length - 1) * CROSSFADE;

  const marks: RoomMark[] = [];
  segments.forEach((seg, i) => {
    if (seg.kind === "room" && seg.roomNum) {
      const room = rooms.find((r) => r.num === seg.roomNum);
      if (!room) return;
      const startTime = offsets[i];
      const endTime = startTime + seg.duration;
      const midTime = startTime + seg.duration / 2;
      marks.push({
        room,
        segmentIndex: i,
        startTime,
        endTime,
        midTime,
        fraction: midTime / total,
      });
    }
  });

  return { segments, offsets, total, rooms: marks };
}
