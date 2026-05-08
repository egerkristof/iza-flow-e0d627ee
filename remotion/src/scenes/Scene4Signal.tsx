import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";
import { Window } from "../components/Window";
import { SceneFrame } from "../components/SceneFrame";

export const Scene4Signal: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame: frame - 14, fps, config: { damping: 18, stiffness: 100 } });
  const quoteIn = interpolate(frame, [40, 75], [0, 1], { extrapolateRight: "clamp" });
  const tagIn = spring({ frame: frame - 90, fps, config: { damping: 16, stiffness: 140 } });
  const routeIn = interpolate(frame, [115, 150], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneFrame
      kicker="Thursday  ·  16:42"
      headline={
        <>
          A field signal surfaces an edge case.{" "}
          <span style={{ color: C.primary }}>Routed to the standard owner.</span>
        </>
      }
      durationInFrames={durationInFrames}
    >
      <div style={{ maxWidth: 900, margin: "60px auto 0", padding: "0 60px" }}>
        <div
          style={{
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * 24}px)`,
          }}
        >
          <Window label="Field signal  ·  Maya (AE)" accent={C.amber} glow>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.textMuted, marginBottom: 14 }}>
              Flagged from a Copilot answer earlier today
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: C.text,
                lineHeight: 1.4,
                marginBottom: 22,
                opacity: quoteIn,
                transform: `translateY(${(1 - quoteIn) * 8}px)`,
              }}
            >
              "Prospect is asking 25% on a 2-year deal. Standard says 15%. Worth an exception?"
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 8,
                background: `${C.amber}1A`,
                color: C.amber,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                opacity: tagIn,
                transform: `scale(${interpolate(tagIn, [0, 1], [0.85, 1])})`,
              }}
            >
              Edge case  ·  pattern detection ON
            </div>
          </Window>
        </div>

        <div
          style={{
            marginTop: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            opacity: routeIn,
            transform: `translateY(${(1 - routeIn) * 8}px)`,
            fontSize: 18,
            fontWeight: 700,
            color: C.textMuted,
          }}
        >
          <span>Auto-routed to</span>
          <span
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              background: C.primarySoft,
              border: `1px solid ${C.primaryRing}`,
              color: C.primary,
              fontWeight: 900,
            }}
          >
            Sarah K.  ·  Standard owner
          </span>
        </div>
      </div>
    </SceneFrame>
  );
};