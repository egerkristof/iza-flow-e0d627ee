import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { C } from "../theme";

/* Beat 1 — CHARACTER. Meet Sarah, a real team leader.
   We see her team of 14 around her. This is the hero. */
export const S1_MeetSarah: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sarahScale = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 110 } });
  const ringScale = interpolate(frame, [40, 130], [0.7, 1], { extrapolateRight: "clamp" });

  return (
    <SceneFrame
      kicker="Meet Sarah"
      headline="She runs a 14-person team. Every Monday her team has to decide things that affect Legal, Finance and Customer Success."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", position: "relative" }}>
        {/* Ring of teammates */}
        <div
          style={{
            position: "absolute",
            width: 720 * ringScale,
            height: 720 * ringScale,
            borderRadius: "50%",
            border: `1px dashed ${C.border}`,
            opacity: interpolate(frame, [30, 80], [0, 1], { extrapolateRight: "clamp" }),
          }}
        />
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2 - Math.PI / 2;
          const r = 360;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          const appear = spring({ frame: frame - 50 - i * 3, fps, config: { damping: 18, stiffness: 140 } });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                transform: `translate(${x * appear}px, ${y * appear}px) scale(${appear})`,
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: C.card,
                border: `1.5px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 18,
                color: C.textMuted,
                boxShadow: "0 6px 18px -10px rgba(11,18,32,0.2)",
              }}
            >
              {String.fromCharCode(65 + (i % 26))}
            </div>
          );
        })}
        {/* Sarah avatar */}
        <div
          style={{
            transform: `scale(${sarahScale})`,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.primary}, #66B8E0)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 900,
            fontSize: 60,
            boxShadow: `0 24px 60px -20px ${C.primary}aa`,
          }}
        >
          S
        </div>
        <div
          style={{
            position: "absolute",
            top: "calc(50% + 110px)",
            textAlign: "center",
            fontWeight: 900,
            fontSize: 22,
            color: C.text,
            opacity: interpolate(frame, [80, 120], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Sarah · Head of RevOps
          <div style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, letterSpacing: "0.06em", marginTop: 4 }}>
            Reports to the COO. Owns deal desk + renewals.
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};