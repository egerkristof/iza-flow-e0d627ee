import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { Beat } from "../components/Beat";
import { C } from "../theme";

/* S3 · GUIDE (18s / 540f)
   Beat A: raw signals (Slack, meeting, decision email) stream in.
   Beat B: LIZA detects the pattern.
   Beat C: a living Playbook materialises line-by-line. */
export const Scene3_Guide: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Playbook lines reveal one by one in beat C
  const lines = [
    "Cap = 8% (no exceptions below)",
    "8–15% → RevOps approval required",
    "Above 15% → CFO + Manager sign-off",
    "Owner: you · Updated: today",
  ];
  const lineProg = (i: number) => interpolate(frame, [380 + i * 28, 408 + i * 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneShell
      kicker="The guide"
      headline="LIZA codifies what was never written down."
      caption="Watch what's in your head become a living standard."
      accent={C.primary}
      durationInFrames={durationInFrames}
    >
      <div style={{ position: "relative", width: "100%", height: 460 }}>
        {/* Beat A — raw signals streaming */}
        <Beat from={10} hold={170}>
          <div style={{ width: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.22em", color: C.textSubtle, textTransform: "uppercase", marginBottom: 14 }}>
              Signals LIZA listens to
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { src: "Slack · #pricing",   q: '"Cap is 8% — above that ping me."' },
                { src: "Meeting · Mon 9:30", q: '"We never go above 15% without CFO."' },
                { src: "Decision · Email",   q: '"Approved 12% for ACME (RevOps signed)."' },
              ].map((s, i) => {
                const ap = spring({ frame: frame - 18 - i * 26, fps, config: { damping: 20, stiffness: 110 } });
                return (
                  <div key={i} style={{
                    opacity: ap, transform: `translateX(${(1 - ap) * -16}px)`,
                    background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 12,
                    padding: "14px 18px", display: "flex", alignItems: "center", gap: 16,
                    boxShadow: "0 14px 30px -18px rgba(11,18,32,0.18)",
                  }}>
                    <div style={{ width: 6, height: 36, borderRadius: 4, background: C.primary }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.18em", color: C.textSubtle, textTransform: "uppercase" }}>{s.src}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginTop: 2 }}>{s.q}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Beat>

        {/* Beat B — pattern detected */}
        <Beat from={170} hold={205}>
          <div style={{ width: 700, textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              padding: "8px 16px", borderRadius: 999,
              background: C.primarySoft, border: `1.5px solid ${C.primary}`,
              fontSize: 12, fontWeight: 900, letterSpacing: "0.22em", color: C.primary, textTransform: "uppercase",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: C.primary }} /> LIZA · pattern detected
            </div>
            <div style={{ marginTop: 22, fontSize: 32, fontWeight: 900, color: C.text, lineHeight: 1.2 }}>
              "Discount cap = 8%. Above that needs RevOps."
            </div>
            <div style={{ marginTop: 18, fontSize: 14, fontWeight: 700, color: C.textMuted }}>
              Source: 3 messages · 1 meeting · 1 decision · agreed by you
            </div>
          </div>
        </Beat>

        {/* Beat C — living playbook */}
        <Beat from={375} hold={165}>
          <div style={{ width: 720 }}>
            <div style={{
              background: C.card, border: `2px solid ${C.green}`, borderRadius: 14,
              padding: "22px 26px", boxShadow: `0 22px 50px -22px ${C.green}55`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.22em", color: C.green, textTransform: "uppercase" }}>
                  Playbook · Discount Approval · v3.2
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.textSubtle }}>LIVE</div>
              </div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {lines.map((l, i) => (
                  <div key={i} style={{
                    opacity: lineProg(i),
                    transform: `translateY(${(1 - lineProg(i)) * 8}px)`,
                    display: "flex", gap: 12, alignItems: "center",
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, background: C.greenSoft,
                      border: `1.5px solid ${C.green}`, color: C.green,
                      display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14,
                    }}>✓</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Beat>
      </div>
    </SceneShell>
  );
};
