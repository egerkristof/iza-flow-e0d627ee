import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { C } from "../theme";

/* S4 · PLAN (18s) — Codify, Cascade, Connect. */
export const Scene4_Plan: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { n: "01", title: "Codify",  sub: "Your standard, captured once",   color: C.primary },
    { n: "02", title: "Cascade", sub: "Every junior, every agent",       color: C.amber },
    { n: "03", title: "Connect", sub: "Across teams, in real time",       color: C.green },
  ];

  // animated progress line
  const lineGrow = spring({ frame: frame - 18, fps, config: { damping: 30, stiffness: 70, mass: 1.5 } });

  return (
    <SceneShell
      kicker="The plan"
      headline="Three moves."
      caption="From your head, to your team, to every team."
      accent={C.primary}
      durationInFrames={durationInFrames}
    >
      <div style={{ position: "relative", width: "100%", padding: "40px 0" }}>
        {/* spine line */}
        <div style={{
          position: "absolute", left: 60, right: 60, top: "50%", height: 4,
          background: C.border, borderRadius: 2,
        }} />
        <div style={{
          position: "absolute", left: 60, top: "50%", height: 4,
          width: `calc((100% - 120px) * ${lineGrow})`,
          background: `linear-gradient(90deg, ${C.primary}, ${C.amber}, ${C.green})`,
          borderRadius: 2,
        }} />

        {/* milestones */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 30px", position: "relative" }}>
          {steps.map((s, i) => {
            const ap = spring({ frame: frame - 40 - i * 50, fps, config: { damping: 18, stiffness: 110 } });
            return (
              <div key={s.n} style={{ width: 240, textAlign: "center",
                opacity: ap, transform: `translateY(${(1 - ap) * 16}px)` }}>
                <div style={{
                  width: 78, height: 78, borderRadius: "50%",
                  margin: "0 auto",
                  background: s.color, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 26,
                  boxShadow: `0 20px 50px -16px ${s.color}aa`,
                  border: `4px solid ${C.bg}`,
                }}>{s.n}</div>
                <div style={{ marginTop: 18, fontSize: 26, fontWeight: 900, color: C.text }}>{s.title}</div>
                <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700, color: C.textMuted, lineHeight: 1.35 }}>{s.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};
