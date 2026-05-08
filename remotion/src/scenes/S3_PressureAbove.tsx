import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { PersonaPill } from "../components/PersonaRotator";
import { C } from "../theme";

/* Beat 3 · PROBLEM (Internal · the AI complication)
   You added Copilot + RAG. Now juniors, seniors, and AI each produce a
   different version of "right". The faster you go, the further apart they get. */
export const S3_PressureAbove: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame: frame - 18, fps, config: { damping: 18, stiffness: 110 } });

  const issues = [
    { tag: "Stale policy",   line: "Discount caps doc · last updated 14 months ago" },
    { tag: "Missing context", line: "The exception your senior always makes — never written down" },
    { tag: "Right-sounding wrong", line: "Copilot cites a deprecated SOP with full confidence" },
  ];

  return (
    <SceneFrame
      kicker="Problem · internal"
      headline="Then AI joins the team. Promised speed. But your juniors, your seniors and your Copilot now produce three different answers — faster."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "0 100px" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <PersonaPill durationInFrames={durationInFrames} />
          <span style={{ fontSize: 14, fontWeight: 700, color: C.textMuted }}>· using Copilot, Glean, Harvey, RAG over your drive</span>
        </div>

        <div style={{ width: 1080, opacity: intro, transform: `translateY(${(1 - intro) * 18}px)` }}>
          <Window label="What your AI actually sees" accent={C.amber} glow>
            <div style={{ fontSize: 19, fontWeight: 800, color: C.text, lineHeight: 1.45, marginBottom: 18 }}>
              "Retrieve from the drive. Read the wiki. Answer like our team would."
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {issues.map((it, i) => {
                const ap = spring({ frame: frame - 50 - i * 22, fps, config: { damping: 18, stiffness: 130 } });
                return (
                  <div
                    key={it.tag}
                    style={{
                      opacity: ap,
                      transform: `translateX(${(1 - ap) * -16}px)`,
                      display: "flex",
                      gap: 16,
                      alignItems: "center",
                      padding: "12px 16px",
                      borderRadius: 10,
                      background: C.redSoft,
                      border: `1px solid ${C.red}33`,
                    }}
                  >
                    <div style={{ minWidth: 200, fontSize: 12, fontWeight: 900, letterSpacing: "0.14em", color: C.red, textTransform: "uppercase" }}>
                      {it.tag}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{it.line}</div>
                  </div>
                );
              })}
            </div>
          </Window>
        </div>

        <div
          style={{
            opacity: interpolate(frame, [200, 250], [0, 1], { extrapolateRight: "clamp" }),
            fontSize: 18, fontWeight: 900, color: C.red, letterSpacing: "0.02em",
          }}
        >
          The same gaps your juniors fall into · now at machine speed.
        </div>
      </div>
    </SceneFrame>
  );
};