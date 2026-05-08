import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { C } from "../theme";

/* Beat 8 — RESOLUTION. New Monday. Same teams. Same answer.
   Sarah ships v2 from one signal. The loop closes. */
export const S8_NewMonday: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const teams = [
    { name: "Legal",   color: C.amber },
    { name: "Finance", color: C.primary },
    { name: "CS",      color: C.green },
  ];

  const stats = [
    { k: "Decisions stuck",      before: "11", after: "1" },
    { k: "Days lost to drift",   before: "3",  after: "0" },
    { k: "Standards refreshed",  before: "—",  after: "v2.5 · live" },
  ];

  return (
    <SceneFrame
      kicker="Next Monday"
      headline="Same Sarah. Same teams. Same standard, in every tool. The loop closes."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, padding: "0 100px" }}>
        {/* Three teams, all green check */}
        <div style={{ display: "flex", gap: 24 }}>
          {teams.map((t, i) => {
            const ap = spring({ frame: frame - 20 - i * 18, fps, config: { damping: 18, stiffness: 130 } });
            return (
              <div
                key={t.name}
                style={{
                  opacity: ap,
                  transform: `translateY(${(1 - ap) * 14}px)`,
                  width: 320,
                  background: C.card,
                  border: `1.5px solid ${t.color}55`,
                  borderRadius: 14,
                  padding: "18px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  boxShadow: `0 14px 40px -20px ${t.color}77`,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: C.greenSoft,
                    color: C.green,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    fontWeight: 900,
                  }}
                >
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.16em", color: t.color, textTransform: "uppercase" }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: C.text, marginTop: 2 }}>
                    Same answer. Cited Playbook PB-014 v2.5.
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats panel */}
        <div
          style={{
            opacity: interpolate(frame, [110, 160], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [110, 160], [16, 0], { extrapolateRight: "clamp" })}px)`,
            width: 1080,
          }}
        >
          <Window label="Sarah's week, before vs after" accent={C.green} glow>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 20, alignItems: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.16em", color: C.textMuted, textTransform: "uppercase" }}>
                Metric
              </div>
              <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.16em", color: C.red, textTransform: "uppercase", textAlign: "center" }}>
                Before
              </div>
              <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.16em", color: C.green, textTransform: "uppercase", textAlign: "center" }}>
                After
              </div>
              {stats.map((s, i) => {
                const ap = spring({ frame: frame - 150 - i * 18, fps, config: { damping: 18, stiffness: 130 } });
                return (
                  <React.Fragment key={s.k}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.text, opacity: ap, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                      {s.k}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: C.red, textAlign: "center", opacity: ap, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                      {s.before}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: C.green, textAlign: "center", opacity: ap, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                      {s.after}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </Window>
        </div>

        <div
          style={{
            opacity: interpolate(frame, [220, 270], [0, 1], { extrapolateRight: "clamp" }),
            fontSize: 24,
            fontWeight: 900,
            color: C.text,
            textAlign: "center",
            letterSpacing: "-0.01em",
          }}
        >
          LIZA. Your standards. Executable. Once.
        </div>
      </div>
    </SceneFrame>
  );
};