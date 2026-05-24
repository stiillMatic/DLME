import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DL for ME — MIT-style STEM curriculum for engineers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(110,90,255,0.18) 0%, transparent 50%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
            fontSize: "28px",
            color: "#a78bfa",
          }}
        >
          <span style={{ fontSize: "36px" }}>⚙</span>
          <span>DL for ME</span>
        </div>
        <div
          style={{
            fontSize: "76px",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "32px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>From integral calculus</span>
          <span>
            to <span style={{ color: "#a78bfa" }}>neural networks.</span>
          </span>
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#a3a3a3",
            maxWidth: "900px",
            lineHeight: 1.4,
          }}
        >
          A complete MIT-style learning path for mechanical engineering
          students — with interactive demos and 500+ practice problems.
        </div>
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "48px",
            fontSize: "20px",
            color: "#737373",
          }}
        >
          <span>22 courses</span>
          <span>•</span>
          <span>160 lessons</span>
          <span>•</span>
          <span>9 interactive demos</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
