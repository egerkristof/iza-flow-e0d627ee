import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { C } from "../theme";

/* Beat 5 · GUIDE (StoryBrand 3) — LIZA appears.
   Starts where any real automation should: from your people.
   Ingests your docs (in or out of date), the AACE framework codifies what
   was never written down. */
export const S5_TheBreak: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badge = spring({ frame: frame - 14, fps, config: { damping: 14, stiffness: 110 } });
  const ringPulse = (Math.sin(frame / 14) + 1) / 2;

  const moves = [
    { tag: "Ingests",  text: "Your Drive, SharePoint, wikis, SOPs · in date or out of date" },
    { tag: "Codifies", text: "AACE framework captures the expert reasoning your seniors never wrote down" },
    { tag: "Updates",  text: "A copilot helps you fix the stale stuff and fill the missing pieces" },
  ];

  return (
    <SceneFrame
      kicker="The guide · LIZA"
      headline="Real automation has to start where the work actually starts. With your people. Not your wiki."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36, marginTop: 20 }}>
        <div style={{ position: "relative", width: 220, height: 220 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.primary}22, transparent 70%)`,
            transform: `scale(${1 + ringPulse * 0.25})` }} />
          <div style={{ position: "absolute", inset: 30, borderRadius: "50%",
            border: `2px dashed ${C.primary}66`, transform: `rotate(${frame * 0.6}deg)` }} />
          <div style={{ position: "absolute", inset: 60, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.primary}, #0E6FA3)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 900, fontSize: 36, letterSpacing: "0.04em",
            transform: `scale(${badge})`, boxShadow: `0 30px 80px -20px ${C.primary}aa` }}>LIZA</div>
        </div>

        <div style={{ width: 1080 }}>
          <Window label="LIZA · how she starts" accent={C.primary} glow>
            {moves.map((m, i) => {
              const ap = spring({ frame: frame - 80 - i * 30, fps, config: { damping: 18, stiffness: 130 } });
              return (
                <div key={m.tag} style={{
                  opacity: ap, transform: `translateX(${(1 - ap) * -16}px)`,
                  display: "flex", gap: 18, alignItems: "center",
                  padding: "16px 0",
                  borderBottom: i < moves.length - 1 ? `1px solid ${C.border}` : "none",
                }}>
                  <div style={{
                    minWidth: 130, fontSize: 12, fontWeight: 900, letterSpacing: "0.18em",
                    color: C.primary, textTransform: "uppercase",
                  }}>{m.tag}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text, lineHeight: 1.4 }}>{m.text}</div>
                </div>
              );
            })}
          </Window>
        </div>
      </div>
    </SceneFrame>
  );
};