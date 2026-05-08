import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";
import { Window } from "../components/Window";
import { SceneFrame } from "../components/SceneFrame";

const TEAMS = [
  {
    team: "Legal",
    workbook: "Contract Review Workbook",
    inherits: "Approval thresholds  ·  PII handling",
    color: C.primary,
  },
  {
    team: "Finance",
    workbook: "Revenue Recognition Workbook",
    inherits: "Multi-year discount logic",
    color: C.amber,
  },
  {
    team: "Customer Success",
    workbook: "Renewal Playbook",
    inherits: "Discount caps  ·  Escalation rules",
    color: C.green,
  },
];

export const Scene3CrossTeam: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hubIn = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 110 } });
  const lineIn = (i: number) =>
    interpolate(frame, [40 + i * 14, 80 + i * 14], [0, 1], { extrapolateRight: "clamp" });
  const cardIn = (i: number) =>
    spring({ frame: frame - (60 + i * 16), fps, config: { damping: 20, stiffness: 130 } });
  const chipIn = (i: number) =>
    spring({ frame: frame - (130 + i * 14), fps, config: { damping: 14, stiffness: 160 } });
  const punchIn = interpolate(frame, [195, 220], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneFrame
      kicker="Wednesday  ·  10:18"
      headline={
        <>
          One standard.{" "}
          <span style={{ color: C.primary }}>Three other teams inherit it without a meeting.</span>
        </>
      }
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          position: "relative",
          padding: "0 120px",
          marginTop: 30,
          height: 560,
        }}
      >
        {/* Central hub */}
        <div
          style={{
            position: "absolute",
            top: 30,
            left: "50%",
            transform: `translateX(-50%) scale(${interpolate(hubIn, [0, 1], [0.85, 1])})`,
            opacity: hubIn,
            zIndex: 2,
          }}
        >
          <Window label="LIZA  ·  Decision Standard" accent={C.primary} glow>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "4px 10px" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: C.primarySoft,
                  border: `1px solid ${C.primaryRing}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.primary,
                  fontWeight: 900,
                  fontSize: 20,
                }}
              >
                §
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>Q4 Discount Policy v2.4</div>
                <div style={{ fontSize: 13, color: C.textSubtle, fontWeight: 600 }}>
                  Owned by Sarah K.  ·  Live
                </div>
              </div>
            </div>
          </Window>
        </div>

        {/* Connector lines (SVG) */}
        <svg
          width="100%"
          height="560"
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        >
          {[0, 1, 2].map((i) => {
            const startX = "50%";
            const startY = 130;
            const endXPct = 16 + i * 34;
            const endY = 360;
            return (
              <line
                key={i}
                x1={startX}
                y1={startY}
                x2={`${endXPct}%`}
                y2={endY}
                stroke={C.primary}
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeOpacity={lineIn(i) * 0.55}
              />
            );
          })}
        </svg>

        {/* Three workbook cards */}
        <div
          style={{
            position: "absolute",
            top: 320,
            left: 120,
            right: 120,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 24,
          }}
        >
          {TEAMS.map((t, i) => (
            <div
              key={t.team}
              style={{
                opacity: cardIn(i),
                transform: `translateY(${(1 - cardIn(i)) * 24}px)`,
              }}
            >
              <Window label={`${t.team}  ·  Workbook`} accent={t.color}>
                <div style={{ fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 6 }}>
                  {t.workbook}
                </div>
                <div style={{ fontSize: 14, color: C.textMuted, fontWeight: 600, marginBottom: 16 }}>
                  Inherits: {t.inherits}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: C.greenSoft,
                    border: `1px solid ${C.green}40`,
                    color: C.green,
                    fontSize: 13,
                    fontWeight: 800,
                    opacity: chipIn(i),
                    transform: `scale(${interpolate(chipIn(i), [0, 1], [0.85, 1])})`,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: C.green,
                      boxShadow: `0 0 8px ${C.green}`,
                    }}
                  />
                  Auto-synced  ·  v2.4
                </div>
              </Window>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 10,
          fontSize: 22,
          fontWeight: 800,
          color: C.textMuted,
          opacity: punchIn,
          transform: `translateY(${(1 - punchIn) * 10}px)`,
        }}
      >
        Knowledge written once.{" "}
        <span style={{ color: C.primary }}>Reused everywhere it matters.</span>
      </div>
    </SceneFrame>
  );
};