import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";
import { Window } from "../components/Window";
import { SceneFrame } from "../components/SceneFrame";

const IMPACT = [
  { k: "Open deals affected", v: "23" },
  { k: "Teams using this standard", v: "4" },
  { k: "Similar exceptions last 30d", v: "7" },
];

export const Scene5Update: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelIn = spring({ frame: frame - 12, fps, config: { damping: 18, stiffness: 110 } });
  const rowIn = (i: number) =>
    interpolate(frame, [40 + i * 18, 75 + i * 18], [0, 1], { extrapolateRight: "clamp" });
  const noteIn = interpolate(frame, [115, 145], [0, 1], { extrapolateRight: "clamp" });
  const arrowIn = interpolate(frame, [150, 180], [0, 1], { extrapolateRight: "clamp" });
  const updateIn = spring({ frame: frame - 175, fps, config: { damping: 18, stiffness: 130 } });
  const stampIn = spring({ frame: frame - 210, fps, config: { damping: 12, stiffness: 180 } });

  return (
    <SceneFrame
      kicker="Thursday  ·  16:47"
      headline={
        <>
          Sarah sees the impact, decides,{" "}
          <span style={{ color: C.primary }}>and ships v2.5 in five minutes.</span>
        </>
      }
      durationInFrames={durationInFrames}
    >
      <div style={{ maxWidth: 900, margin: "30px auto 0", padding: "0 60px" }}>
        <div
          style={{
            opacity: panelIn,
            transform: `translateY(${(1 - panelIn) * 20}px)`,
          }}
        >
          <Window label="Sarah K.  ·  Standard owner" accent={C.primary} glow>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.textMuted, marginBottom: 14 }}>
              Impact preview before publishing
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {IMPACT.map((r, i) => (
                <div
                  key={r.k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 17,
                    padding: "12px 16px",
                    background: C.primarySoft,
                    border: `1px solid ${C.primaryRing}`,
                    borderRadius: 10,
                    opacity: rowIn(i),
                    transform: `translateX(${(1 - rowIn(i)) * -10}px)`,
                  }}
                >
                  <span style={{ color: C.text, fontWeight: 700 }}>{r.k}</span>
                  <span style={{ color: C.primary, fontWeight: 900 }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: 15,
                color: C.textMuted,
                fontWeight: 600,
                opacity: noteIn,
                transform: `translateY(${(1 - noteIn) * 8}px)`,
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              "Pattern. Add 22% cap for 2-yr enterprise. Above that needs CFO."
            </div>
          </Window>
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <svg width="40" height="44" viewBox="0 0 40 44" style={{ opacity: arrowIn }}>
            <line
              x1="20" y1="0"
              x2="20"
              y2={interpolate(arrowIn, [0, 1], [4, 30])}
              stroke={C.primary} strokeWidth="3" strokeLinecap="round"
            />
            <polygon
              points={`10,${interpolate(arrowIn, [0, 1], [4, 30])} 30,${interpolate(arrowIn, [0, 1], [4, 30])} 20,${interpolate(arrowIn, [0, 1], [14, 40])}`}
              fill={C.primary}
            />
          </svg>
          <div
            style={{
              marginTop: 8,
              opacity: updateIn,
              transform: `translateY(${(1 - updateIn) * 12}px) scale(${interpolate(updateIn, [0, 1], [0.92, 1])})`,
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 28px",
              background: C.card,
              border: `1px solid ${C.primaryRing}`,
              borderRadius: 14,
              boxShadow: `0 20px 60px -20px ${C.primary}55`,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: C.textSubtle,
              }}
            >
              Q4 Discount Policy
            </span>
            <span style={{ fontSize: 14, color: C.textMuted, textDecoration: "line-through", fontWeight: 700 }}>
              v2.4
            </span>
            <span style={{ fontSize: 18, color: C.textSubtle }}>→</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: C.primary }}>v2.5</span>
            <span
              style={{
                opacity: stampIn,
                transform: `scale(${interpolate(stampIn, [0, 1], [0.6, 1])})`,
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "5px 10px",
                border: `2px solid ${C.green}`,
                color: C.green,
                borderRadius: 6,
                background: C.greenSoft,
                marginLeft: 6,
              }}
            >
              Propagated  ·  4 teams
            </span>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};