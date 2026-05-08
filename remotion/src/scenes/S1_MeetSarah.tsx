import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { PersonaPill } from "../components/PersonaRotator";
import { C } from "../theme";

/* Beat 1 · CHARACTER (StoryBrand 1)
   You are a manager. The persona rotates — sales, marketing, engineering, ops.
   The job is the same: get a team to execute at the highest standard. */
export const S1_MeetSarah: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const youScale = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 110 } });
  const ringScale = interpolate(frame, [30, 110], [0.75, 1], { extrapolateRight: "clamp" });

  return (
    <SceneFrame
      kicker="You · the manager"
      headline="You run a business team. Your job is simple to say and hard to do — get every person executing at the highest standard, every day."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, marginTop: 10 }}>
        <div style={{ position: "relative", width: 720, height: 360, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* Ring */}
          <div
            style={{
              position: "absolute",
              width: 540 * ringScale,
              height: 320 * ringScale,
              borderRadius: "50%",
              border: `1px dashed ${C.border}`,
              opacity: interpolate(frame, [25, 70], [0, 1], { extrapolateRight: "clamp" }),
            }}
          />
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * 270;
            const y = Math.sin(angle) * 150;
            const appear = spring({ frame: frame - 40 - i * 4, fps, config: { damping: 18, stiffness: 140 } });
            const seniority = i % 3 === 0 ? "S" : "J"; // mix of seniors / juniors
            const isSenior = seniority === "S";
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  transform: `translate(${x * appear}px, ${y * appear}px) scale(${appear})`,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: isSenior ? C.primarySoft : C.card,
                  border: `1.5px solid ${isSenior ? C.primary : C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 16,
                  color: isSenior ? C.primary : C.textMuted,
                  boxShadow: "0 6px 18px -10px rgba(11,18,32,0.2)",
                }}
              >
                {seniority}
              </div>
            );
          })}
          {/* You at the centre */}
          <div
            style={{
              transform: `scale(${youScale})`,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.primary}, #66B8E0)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 28,
              letterSpacing: "0.04em",
              boxShadow: `0 24px 60px -20px ${C.primary}aa`,
            }}
          >
            YOU
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.16em", color: C.textSubtle, textTransform: "uppercase" }}>
            you might be →
          </span>
          <PersonaPill durationInFrames={durationInFrames} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.textMuted, letterSpacing: "0.04em", maxWidth: 900, textAlign: "center" }}>
          The department changes. The job doesn't.
        </div>
      </div>
    </SceneFrame>
  );
};