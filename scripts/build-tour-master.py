#!/usr/bin/env python3
"""
Rebuild the /tour master films from the per-clip sources in public/tour-film/.

Every clip is normalised to 1280x720/30fps and crossfaded into the next by
CROSSFADE seconds (a dissolve, so boundaries no longer hard-cut). Clip
durations are forced to the canonical values below, so the output timeline
matches src/lib/tour-film.ts exactly (ROOM=5, TRAVEL=4, OPENING=5, CROSSFADE).

Outputs (small GOP ≈ instant scrub seeks at a fraction of all-intra size):
  master.mp4         1280x720  CRF21  (desktop)
  master-mobile.mp4   960x540  CRF23  (phones / data saver)
  poster.jpg         1280x720  (first frame)

Re-run after regenerating any clip (e.g. the door scenes):
  python3 scripts/build-tour-master.py
"""
import subprocess
import sys
from pathlib import Path

DIR = Path(__file__).resolve().parent.parent / "public" / "tour-film"
OPENING, ROOM, TRAVEL = 5, 5, 4
CROSSFADE = 0.5  # MUST match CROSSFADE in src/lib/tour-film.ts

# Ordered clip list + each clip's canonical duration, matching buildFilmSegments.
clips = [("opening.mp4", OPENING)]
for i in range(1, 17):
    clips.append((f"room-{i:02d}.mp4", ROOM))
    if i < 16:
        clips.append((f"travel-{i:02d}-{i + 1:02d}.mp4", TRAVEL))

missing = [c for c, _ in clips if not (DIR / c).exists()]
if missing:
    sys.exit(f"Missing clips: {missing}")

# Normalise each input, then chain xfades. xfade offset k = (sum of durations
# 0..k) - (k+1)*CROSSFADE — the point in the accumulated stream where the
# dissolve into the next clip begins.
norm = []
for idx, (_, dur) in enumerate(clips):
    norm.append(
        f"[{idx}:v]trim=0:{dur},setpts=PTS-STARTPTS,fps=30,"
        f"scale=1280:720:force_original_aspect_ratio=increase,"
        f"crop=1280:720,setsar=1[c{idx}]"
    )

chain = []
prev = "c0"
running = clips[0][1]
for k in range(1, len(clips)):
    off = running - CROSSFADE
    out = "vout" if k == len(clips) - 1 else f"x{k}"
    chain.append(
        f"[{prev}][c{k}]xfade=transition=fade:duration={CROSSFADE}:offset={off:.3f}[{out}]"
    )
    prev = out
    running += clips[k][1] - CROSSFADE

filtergraph = ";".join(norm + chain)
inputs = []
for c, _ in clips:
    inputs += ["-i", str(DIR / c)]

master = DIR / "master.mp4"
mobile = DIR / "master-mobile.mp4"
poster = DIR / "poster.jpg"

print(f"Encoding {master.name} (crossfade={CROSSFADE}s, {len(clips)} clips)…")
subprocess.run(
    ["ffmpeg", "-y", *inputs, "-filter_complex", filtergraph, "-map", "[vout]",
     "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "21",
     "-x264-params", "keyint=5:min-keyint=5:scenecut=0",
     "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart",
     str(master)],
    check=True,
)

print(f"Encoding {mobile.name} (540p)…")
subprocess.run(
    ["ffmpeg", "-y", "-i", str(master), "-an", "-vf", "scale=960:540:flags=lanczos",
     "-c:v", "libx264", "-preset", "slow", "-crf", "23",
     "-x264-params", "keyint=5:min-keyint=5:scenecut=0",
     "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart",
     str(mobile)],
    check=True,
)

print(f"Regenerating {poster.name}…")
subprocess.run(
    ["ffmpeg", "-y", "-i", str(master), "-frames:v", "1", "-q:v", "2", str(poster)],
    check=True,
)

dur = subprocess.check_output(
    ["ffprobe", "-v", "error", "-show_entries", "format=duration",
     "-of", "default=noprint_wrappers=1:nokey=1", str(master)]
).decode().strip()
print(f"Done. master duration={dur}s (timeline expects "
      f"{OPENING + 16 * ROOM + 15 * TRAVEL - (len(clips) - 1) * CROSSFADE}s)")
