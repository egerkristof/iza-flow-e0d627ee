import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";
import { Window } from "../components/Window";
import { SceneFrame } from "../components/SceneFrame";

const ROWS = [
  { time: "09:14", actor: "Maya  ·  Copilot",  q: "Discount on 3-yr renewal", v: "Policy v2.4", ok: true },
  { time: "10:02", actor: "Tom  ·  Claude",    q: "Approval threshold 60k",    v: "Policy v2.4", ok: true },
  { time: "11:48", actor: "Priya  ·  Glean",   q: "Refund window for SMB",     v: "Policy v2.4", ok: true },
  { time: "13:21", actor: "Maya  ·  Copilot",  q: "Multi-year renewal terms",  v: "Policy v2.4", ok: true },
  { time: "14:55", actor: "Legal  ·  Claude",  q: "PII handling in proposals", v: "Policy v2.4", ok: true },
];

export const Scene3Audit: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tableIn = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 110 } });
  const rowIn = (i: number) =>
    interpolate(frame, [25 + i * 8, 45 + i * 8], [0, 1], { extrapolateRight: "clamp" });
  const counter = Math.floor(interpolate(frame, [40, 110], [0, 47], { extrapolateRight: "clamp" }));
  const compliancePct = Math.floor(interpolate(frame, [40, 110], [0, 100], { extrapolateRight: "clamp" }));
  const statsIn = spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 120 } });
  const lineIn = interpolate(frame, [140, 170], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneFrame
      kicker="Friday  ·  16:30"
      headline={
        <>
          Every AI decision this week,{" "}
          <span style={{ color: C.primary }}>tied to a standard your auditor can read.</span>
        </>
      }
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 30,
          padding: "0 120px",
          marginTop: 30,
        }}
      >
        {/* Audit log */}
        <div
          style={{
            opacity: tableIn,
            transform: `translateY(${(1 - tableIn) * 20}px)`,
          }}
        >
          <Window label="LIZA  ·  Audit Log" accent={C.primary} glow>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "90px 1fr 1fr 150px 60px",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: C.textSubtle,
                padding: "0 10px 12px",
                borderBottom: `1px solid ${C.border}`,
                marginBottom: 8,
              }}
            >
              <div>Time</div>
              <div>Actor / Tool</div>
              <div>Query</div>
              <div>Bound to</div>
              <div style={{ textAlign: "right" }}>OK</div>
            </div>
            {ROWS.map((r, i) => (
              <div
                key={r.time}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr 1fr 150px 60px",
                  alignItems: "center",
                  padding: "12px 10px",
                  borderBottom: i < ROWS.length - 1 ? `1px solid ${C.border}` : "none",
                  opacity: rowIn(i),
                  transform: `translateX(${(1 - rowIn(i)) * -12}px)`,
                  fontSize: 16,
                }}
              >
                <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.textMuted }}>
                  {r.time}
                </div>
                <div style={{ fontWeight: 700, color: C.text }}>{r.actor}</div>
                <div style={{ color: C.textMuted, fontWeight: 500 }}>{r.q}</div>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 10px",
                      borderRadius: 6,
                      background: C.primarySoft,
                      color: C.primary,
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    {r.v}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: C.greenSoft,
                      color: C.green,
                      fontWeight: 900,
                      fontSize: 16,
                    }}
                  >
                    ✓
                  </span>
                </div>
              </div>
            ))}
          </Window>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            opacity: statsIn,
            transform: `translateY(${(1 - statsIn) * 20}px)`,
          }}
        >
          <StatCard label="AI decisions this week" value={`${counter}`} accent={C.primary} />
          <StatCard
            label="Bound to a published standard"
            value={`${compliancePct}%`}
            accent={C.green}
          />
          <StatCard label="Rogue answers" value="0" accent={C.green} subtle="None. Zero. Audited." />
        </div>
      </div>

      {/* Final tagline */}
      <div
        style={{
          textAlign: "center",
          marginTop: 50,
          fontSize: 32,
          fontWeight: 900,
          letterSpacing: "-0.01em",
          color: C.text,
          opacity: lineIn,
          transform: `translateY(${(1 - lineIn) * 12}px)`,
        }}
      >
        Your best standard.{" "}
        <span style={{ color: C.primary }}>Executed every time.</span>
      </div>
    </SceneFrame>
  );
};

const StatCard: React.FC<{ label: string; value: string; accent: string; subtle?: string }> = ({
  label,
  value,
  accent,
  subtle,
}) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 24,
      boxShadow: "0 12px 30px -20px rgba(11,18,32,0.18)",
    }}
  >
    <div
      style={{
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: C.textSubtle,
        marginBottom: 10,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 64, fontWeight: 900, color: accent, lineHeight: 1 }}>{value}</div>
    {subtle && (
      <div style={{ fontSize: 14, color: C.textMuted, fontWeight: 600, marginTop: 8 }}>
        {subtle}
      </div>
    )}
  </div>
);