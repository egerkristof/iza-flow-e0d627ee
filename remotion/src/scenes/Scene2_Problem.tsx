import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneShell, useRotatingPersona } from "../components/SceneShell";
import { C } from "../theme";

/* S2 · PROBLEM (18s) — Juniors guess. Copilots invent. */
export const Scene2_Problem: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const persona = useRotatingPersona(durationInFrames);

  const head = spring({ frame: frame - 10, fps, config: { damping: 20, stiffness: 110 } });
  const arrow = spring({ frame: frame - 60, fps, config: { damping: 22, stiffness: 110 } });
  const copilot = spring({ frame: frame - 100, fps, config: { damping: 20, stiffness: 110 } });
  const cross = spring({ frame: frame - 160, fps, config: { damping: 12, stiffness: 140 } });

  return (
    <SceneShell
      kicker="The problem"
      headline="It doesn't scale."
      caption="What lives in your head can't reach AI."
      personaLabel={persona}
      accent={C.red}
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, width: "100%" }}>
        {/* head with tacit dots */}
        <div style={{ position: "relative", width: 320, height: 320,
          opacity: head, transform: `scale(${0.8 + head * 0.2})` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
            background: C.card, border: `2px solid ${C.border}`,
            boxShadow: "0 20px 50px -20px rgba(11,18,32,0.18)" }} />
          {[0,1,2,3,4,5,6].map((i) => {
            const a = (i / 7) * Math.PI * 2 + frame / 80;
            const r = 80 + Math.sin(frame / 20 + i) * 8;
            const x = 160 + Math.cos(a) * r;
            const y = 160 + Math.sin(a) * r;
            return <div key={i} style={{
              position: "absolute", left: x - 6, top: y - 6,
              width: 12, height: 12, borderRadius: 999,
              background: C.primary, opacity: 0.55,
            }} />;
          })}
          <div style={{ position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 900, letterSpacing: "0.22em",
            color: C.textMuted, textTransform: "uppercase",
          }}>Unwritten</div>
        </div>

        {/* arrow */}
        <div style={{ opacity: arrow, transform: `translateX(${(1 - arrow) * -12}px)` }}>
          <div style={{ width: 80, height: 4, background: C.borderStrong, borderRadius: 2 }} />
          <div style={{ marginTop: -2, fontSize: 11, fontWeight: 900,
            letterSpacing: "0.18em", color: C.textSubtle, textTransform: "uppercase",
            textAlign: "center", marginTop: 8,
          }}>Asks</div>
        </div>

        {/* copilot window with wrong answer */}
        <div style={{ width: 380, opacity: copilot, transform: `translateX(${(1 - copilot) * 16}px)` }}>
          <div style={{
            background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 16,
            overflow: "hidden", boxShadow: "0 20px 50px -20px rgba(11,18,32,0.20)",
          }}>
            <div style={{
              padding: "12px 18px", borderBottom: `1px solid ${C.border}`,
              fontSize: 12, fontWeight: 900, letterSpacing: "0.16em",
              color: C.textMuted, textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: C.green }} />
              Copilot
            </div>
            <div style={{ padding: "20px 22px" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text, lineHeight: 1.45 }}>
                "Standard discount is 15%.<br/>Approval not required."
              </div>
              <div style={{
                marginTop: 16, display: "flex", alignItems: "center", gap: 10,
                opacity: cross, transform: `scale(${0.6 + cross * 0.4})`,
                transformOrigin: "left center",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 999,
                  background: C.red, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 18,
                }}>×</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.red }}>
                  Wrong. Your real cap is 8%.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
