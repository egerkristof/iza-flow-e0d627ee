import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { C } from "../theme";

/* Beat 2 — WORLD. Monday morning. The work in front of her team. */
export const S2_MondayMorning: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { tag: "Deal review",      label: "Acme Corp · €480k renewal",   detail: "Discount request: 18%" },
    { tag: "Pricing exception", label: "Helix Health · pilot → prod", detail: "Multi-year, custom SLA" },
    { tag: "Approval queue",   label: "Northwind · expansion",        detail: "Net-new ARR €120k" },
    { tag: "Escalation",       label: "Globex · churn signal",        detail: "CSM flagged Friday" },
  ];

  return (
    <SceneFrame
      kicker="Monday, 9:14 a.m."
      headline="Her team opens the queue. Real decisions, real money, real customers waiting."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 120px" }}>
        <Window label="Sarah's team queue · this morning" accent={C.primary} style={{ width: 1280 }}>
          {items.map((it, i) => {
            const ap = spring({ frame: frame - 30 - i * 16, fps, config: { damping: 18, stiffness: 130 } });
            return (
              <div
                key={it.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "20px 8px",
                  borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none",
                  opacity: ap,
                  transform: `translateY(${(1 - ap) * 12}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: C.primary,
                    background: C.primarySoft,
                    padding: "6px 12px",
                    borderRadius: 999,
                    minWidth: 200,
                    textAlign: "center",
                  }}
                >
                  {it.tag}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{it.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, marginTop: 2 }}>{it.detail}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.textSubtle, letterSpacing: "0.16em" }}>
                  ASSIGNED · {String.fromCharCode(65 + i)}
                </div>
              </div>
            );
          })}
        </Window>
        <div
          style={{
            marginTop: 32,
            fontSize: 16,
            fontWeight: 700,
            color: C.textMuted,
            opacity: interpolate(frame, [180, 220], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Each one of these touches at least one other team.
        </div>
      </div>
    </SceneFrame>
  );
};