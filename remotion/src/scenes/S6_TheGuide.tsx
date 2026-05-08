import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { C } from "../theme";

/* Beat 6 — THE GUIDE. LIZA enters. The mentor offers a different path. */
export const S6_TheGuide: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badge = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 110 } });
  const ringPulse = (Math.sin(frame / 14) + 1) / 2;

  const lines = [
    "Sarah's standards are real. They're just stuck in her head.",
    "Make them executable, once.",
    "Every tool, every team, every Monday.",
  ];

  return (
    <SceneFrame
      kicker="There is another way"
      headline="Sarah doesn't need more tools. She needs her standards to actually run."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50, marginTop: 40 }}>
        {/* LIZA badge */}
        <div style={{ position: "relative", width: 240, height: 240 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.primary}22, transparent 70%)`,
              transform: `scale(${1 + ringPulse * 0.25})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 30,
              borderRadius: "50%",
              border: `2px dashed ${C.primary}66`,
              transform: `rotate(${frame * 0.6}deg)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 60,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.primary}, #0E6FA3)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 40,
              letterSpacing: "0.04em",
              transform: `scale(${badge})`,
              boxShadow: `0 30px 80px -20px ${C.primary}aa`,
            }}
          >
            LIZA
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          {lines.map((l, i) => {
            const ap = spring({ frame: frame - 60 - i * 36, fps, config: { damping: 18, stiffness: 130 } });
            return (
              <div
                key={l}
                style={{
                  opacity: ap,
                  transform: `translateY(${(1 - ap) * 12}px)`,
                  fontSize: i === 1 ? 36 : 24,
                  fontWeight: i === 1 ? 900 : 700,
                  color: i === 1 ? C.text : C.textMuted,
                  textAlign: "center",
                  letterSpacing: i === 1 ? "-0.01em" : "0",
                }}
              >
                {l}
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};