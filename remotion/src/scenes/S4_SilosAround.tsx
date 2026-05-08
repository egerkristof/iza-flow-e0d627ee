import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { C } from "../theme";

/* Beat 4 — SILOS. Sarah's deal goes out. It hits Legal, Finance, CS.
   Each silo has its own rules, its own AI tools, its own answer. */
export const S4_SilosAround: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const teams = [
    { name: "Legal",   tool: "Harvey + internal RAG", answer: "Block. Needs MSA review.", color: C.amber },
    { name: "Finance", tool: "Copilot + Excel rules", answer: "Approve up to 12% only.",  color: C.primary },
    { name: "CS",      tool: "Glean + playbooks",     answer: "Match the customer ask.",   color: C.green },
  ];

  return (
    <SceneFrame
      kicker="The work spills sideways"
      headline="The same deal lands in three other teams. Each runs on its own tool, its own playbook, its own answer."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36, padding: "0 100px" }}>
        {/* Sarah's deal at top */}
        <div
          style={{
            opacity: interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" }),
            background: C.card,
            border: `1.5px solid ${C.borderStrong}`,
            borderRadius: 14,
            padding: "16px 28px",
            fontWeight: 800,
            fontSize: 18,
            color: C.text,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.18em", color: C.primary }}>SARAH'S DEAL</span>
          Acme Corp · €480k · 18% discount asked
        </div>

        {/* Three branches */}
        <div style={{ display: "flex", gap: 32, alignItems: "stretch" }}>
          {teams.map((t, i) => {
            const ap = spring({ frame: frame - 50 - i * 22, fps, config: { damping: 18, stiffness: 110 } });
            return (
              <div
                key={t.name}
                style={{
                  opacity: ap,
                  transform: `translateY(${(1 - ap) * 18}px)`,
                  width: 380,
                }}
              >
                <Window label={`${t.name} team`} accent={t.color}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Stack
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginTop: 4 }}>{t.tool}</div>
                  <div
                    style={{
                      marginTop: 18,
                      padding: "14px 16px",
                      borderRadius: 10,
                      background: t.color + "18",
                      border: `1px solid ${t.color}55`,
                      fontSize: 18,
                      fontWeight: 900,
                      color: t.color,
                    }}
                  >
                    {t.answer}
                  </div>
                </Window>
              </div>
            );
          })}
        </div>

        <div
          style={{
            opacity: interpolate(frame, [180, 230], [0, 1], { extrapolateRight: "clamp" }),
            fontSize: 18,
            fontWeight: 800,
            color: C.red,
            letterSpacing: "0.06em",
          }}
        >
          One deal. Three policies. No one is wrong. No one agrees.
        </div>
      </div>
    </SceneFrame>
  );
};