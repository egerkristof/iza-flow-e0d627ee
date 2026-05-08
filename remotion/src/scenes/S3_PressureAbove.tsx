import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { C } from "../theme";

/* Beat 3 — Pressure from above. Leadership directive lands.
   Generic, ambiguous, "figure it out". */
export const S3_PressureAbove: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const memoSpring = spring({ frame: frame - 25, fps, config: { damping: 18, stiffness: 110 } });
  const arrowOp = interpolate(frame, [80, 130], [0, 1], { extrapolateRight: "clamp" });
  const pulse = (Math.sin(frame / 8) + 1) / 2;

  return (
    <SceneFrame
      kicker="Then the directive lands"
      headline="Leadership tightens Q4 strategy. The memo is one paragraph. Sarah's team has to translate it into 100 daily decisions."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, padding: "0 120px" }}>
        <div
          style={{
            transform: `translateY(${(1 - memoSpring) * 30}px)`,
            opacity: memoSpring,
            width: 980,
          }}
        >
          <Window label="From: COO · Subject: Q4 Margin Discipline" accent={C.amber} glow>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.text, lineHeight: 1.45, marginBottom: 18 }}>
              "Tighten approval thresholds. Protect margin. No new exceptions
              without finance review. Make sure CS keeps NRR above 112%."
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["What is 'tighten'?", "Which thresholds?", "What counts as an exception?", "Who decides escalation?"].map((q, i) => {
                const ap = spring({ frame: frame - 60 - i * 12, fps, config: { damping: 18, stiffness: 140 } });
                return (
                  <div
                    key={q}
                    style={{
                      opacity: ap,
                      transform: `translateY(${(1 - ap) * 8}px)`,
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: C.redSoft,
                      color: C.red,
                      fontWeight: 800,
                      fontSize: 14,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {q}
                  </div>
                );
              })}
            </div>
          </Window>
        </div>

        {/* Arrow down */}
        <div style={{ opacity: arrowOp, fontSize: 40, color: C.textSubtle, transform: `translateY(${pulse * 6}px)` }}>
          ↓
        </div>

        <div
          style={{
            opacity: arrowOp,
            fontSize: 18,
            fontWeight: 800,
            color: C.textMuted,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Sarah's team · 14 people · zero shared definition
        </div>
      </div>
    </SceneFrame>
  );
};