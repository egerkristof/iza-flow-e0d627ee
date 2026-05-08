import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { Beat } from "../components/Beat";
import { C } from "../theme";

/* S4 · PLAN (18s / 540f)
   Each step gets its own beat with a concrete payload, then they line up. */
export const Scene4_Plan: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    {
      n: "01", title: "Codify",  color: C.primary,
      payload: { label: "STANDARD CAPTURED", text: '"Discount cap = 8%. Above → RevOps."', sub: "From your head → versioned playbook" },
    },
    {
      n: "02", title: "Cascade", color: C.amber,
      payload: { label: "EVERYONE NOW ANSWERS", text: '"Cap is 8%. Above that needs RevOps."', sub: "Junior · Copilot · New hire — same answer" },
    },
    {
      n: "03", title: "Connect", color: C.green,
      payload: { label: "ALIGNED ACROSS TEAMS", text: "Sales · Marketing · Engineering", sub: "One standard. No silos. No drift." },
    },
  ];

  return (
    <SceneShell
      kicker="The plan"
      headline="Three moves."
      caption="Codify the standard. Cascade it. Connect every team."
      accent={C.primary}
      durationInFrames={durationInFrames}
    >
      <div style={{ position: "relative", width: "100%", height: 460 }}>
        {/* Beat A · Codify */}
        <Beat from={10} hold={170}>
          <StepCard step={steps[0]} active />
        </Beat>
        {/* Beat B · Cascade */}
        <Beat from={170} hold={185}>
          <StepCard step={steps[1]} active />
        </Beat>
        {/* Beat C · Connect — all three line up */}
        <Beat from={355} hold={185}>
          <div style={{ width: 920 }}>
            <div style={{ display: "flex", gap: 16, justifyContent: "space-between" }}>
              {steps.map((s, i) => (
                <div key={s.n} style={{ flex: 1 }}>
                  <StepMini step={s} />
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 26, height: 6, borderRadius: 3,
              background: `linear-gradient(90deg, ${C.primary}, ${C.amber}, ${C.green})`,
            }} />
            <div style={{
              marginTop: 16, textAlign: "center", fontSize: 16, fontWeight: 800, color: C.textMuted,
            }}>
              From your head → to your team → to every team.
            </div>
          </div>
        </Beat>
      </div>
    </SceneShell>
  );
};

const StepCard: React.FC<{ step: any; active?: boolean }> = ({ step }) => (
  <div style={{ width: 720, display: "flex", alignItems: "center", gap: 24 }}>
    <div style={{
      width: 110, height: 110, borderRadius: "50%",
      background: step.color, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 38, fontWeight: 900,
      boxShadow: `0 24px 60px -20px ${step.color}aa`,
      flexShrink: 0,
    }}>{step.n}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 36, fontWeight: 900, color: C.text, lineHeight: 1 }}>{step.title}</div>
      <div style={{
        marginTop: 14, padding: "16px 20px",
        background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 12,
        boxShadow: "0 18px 40px -22px rgba(11,18,32,0.18)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.18em", color: step.color, textTransform: "uppercase" }}>{step.payload.label}</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginTop: 4 }}>{step.payload.text}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textMuted, marginTop: 6 }}>{step.payload.sub}</div>
      </div>
    </div>
  </div>
);

const StepMini: React.FC<{ step: any }> = ({ step }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{
      width: 64, height: 64, borderRadius: "50%", margin: "0 auto",
      background: step.color, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: 22,
      boxShadow: `0 18px 40px -16px ${step.color}aa`,
    }}>{step.n}</div>
    <div style={{ marginTop: 12, fontSize: 22, fontWeight: 900, color: C.text }}>{step.title}</div>
    <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: C.textMuted, lineHeight: 1.35 }}>{step.payload.sub}</div>
  </div>
);
