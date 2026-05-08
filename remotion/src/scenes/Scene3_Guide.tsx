import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { C } from "../theme";

/* S3 · GUIDE (18s) — LIZA codifies the unwritten. */
export const Scene3_Guide: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ringPulse = (Math.sin(frame / 18) + 1) / 2;
  const badge = spring({ frame: frame - 8, fps, config: { damping: 15, stiffness: 110 } });

  const inputs = ["Docs", "Conversations", "Decisions"];
  const out = spring({ frame: frame - 200, fps, config: { damping: 18, stiffness: 110 } });

  return (
    <SceneShell
      kicker="The guide"
      headline="LIZA captures what was never written down."
      caption="Three signals in. One living standard out."
      accent={C.primary}
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 30, width: "100%" }}>
        {/* inputs column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 240 }}>
          {inputs.map((label, i) => {
            const ap = spring({ frame: frame - 30 - i * 26, fps, config: { damping: 20, stiffness: 120 } });
            return (
              <div key={label} style={{
                opacity: ap, transform: `translateX(${(1 - ap) * -16}px)`,
                background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 12,
                padding: "14px 18px",
                boxShadow: "0 12px 28px -16px rgba(11,18,32,0.18)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.18em", color: C.textSubtle, textTransform: "uppercase" }}>
                  Signal {i + 1}
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: C.text, marginTop: 2 }}>{label}</div>
              </div>
            );
          })}
        </div>

        {/* LIZA hub */}
        <div style={{ position: "relative", width: 260, height: 260, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.primary}33, transparent 70%)`,
            transform: `scale(${1 + ringPulse * 0.22})` }} />
          <div style={{ position: "absolute", inset: 30, borderRadius: "50%",
            border: `2px dashed ${C.primary}66`, transform: `rotate(${frame * 0.5}deg)` }} />
          <div style={{ position: "absolute", inset: 60, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.primary}, #0E6FA3)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 900, fontSize: 38, letterSpacing: "0.04em",
            transform: `scale(${badge})`,
            boxShadow: `0 30px 80px -20px ${C.primary}aa` }}>LIZA</div>
        </div>

        {/* output */}
        <div style={{ flex: 1,
          opacity: out, transform: `translateX(${(1 - out) * 20}px)`,
        }}>
          <div style={{
            background: C.card, border: `2px solid ${C.green}`, borderRadius: 14,
            padding: "20px 22px",
            boxShadow: `0 20px 50px -20px ${C.green}55`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.18em", color: C.green, textTransform: "uppercase" }}>
              Playbook · v3.2
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.text, marginTop: 6, lineHeight: 1.2 }}>
              Discount approval policy
            </div>
            <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: C.textMuted, lineHeight: 1.4 }}>
              Cap: 8%. Above 8% needs RevOps sign-off. Owner: you.
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
