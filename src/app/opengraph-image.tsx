import { ImageResponse } from "next/og";

export const alt = "Cruz Carpentry — Custom Carpentry & Fine Millwork";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social share card (no external asset needed).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1C1917",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: -2 }}>
          Cruz Carpentry
        </div>
        <div style={{ width: 90, height: 3, background: "#CA8A04", margin: "30px 0" }} />
        <div style={{ fontSize: 38, color: "#FEF3C7" }}>
          Built by Hand. Built to Last.
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
            marginTop: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Custom Carpentry &amp; Fine Millwork · Colorado
        </div>
      </div>
    ),
    { ...size },
  );
}
