import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";
import { Window } from "../components/Window";
import { SceneFrame } from "../components/SceneFrame";

const ROWS = [
  { time: "Mon 09:14", actor: "Maya  ·  Copilot",  q: "Discount on 3-yr renewal",  v: "v2.4", change: false },
  { time: "Tue 14:02", actor: "Tom  ·  Claude",    q: "Approval threshold 60k",    v: "v2.4", change: false },
  { time: "Wed 10:18", actor: "Legal  ·  Glean",   q: "PII handling in proposals", v: "v2.4", change: false },
  { time: "Thu 16:42", actor: "Maya  ·  Copilot",  q: "Edge case  ·  25% / 2-yr",  v: "v2.4 → v2.5", change: true },
  { time: "Fri 11:05", actor: "Priya  ·  Copilot", q: "Renewal terms (SMB)",       v: "v2.5", change: false },
];

export const Scene6Audit: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tableIn = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 110 } });
  const rowIn = (i: number) =>
    interpolate(frame, [30 + i * 16, 60 + i * 16], [0, 1], { extrapolateRight: "clamp" });
  const statsIn = spring({ frame: frame - 130, fps, config: { damping: 20, stiffness: 120 } });
  const counter = Math.floor(interpolate(frame, [130, 175], [0, 47], { extrapolateRight: "clamp" }));
  const pct = Math.floor(interpolate(frame, [130, 175], [0, 100], { extrapolateRight: "clamp" }));

  return (
    <SceneFrame
      kicker="Friday  ·  16:30"
      headline={
        <>
          Sarah audits the week.{" "}
          <span style={{ color: C.primary }}>Every AI decision tied to a versioned standard.</span>
        </>
      }
      durationInFrames={durationInFrames}
    >
      <div style={{ padding: "20px 140px 0" }}>
        <div
          style={{
            opacity: tableIn,
            transform: `translateY(${(1 - tableIn) * 18}px)`,
          }}
        >
          <Window label="LIZA  ·  Audit Log" accent={C.primary} glow>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "130px 1.1fr 1.4fr 160px 60px",
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
              <div>When</div>
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
                  gridTemplateColumns: "130px 1.1fr 1.4fr 160px 60px",
                  alignItems: "center",
                  padding: "14px 10px",
                  borderBottom: i < ROWS.length - 1 ? `1px solid ${C.border}` : "none",
                  opacity: rowIn(i),
                  transform: `translateX(${(1 - rowIn(i)) * -12}px)`,
                  fontSize: 16,
                }}
              >
                <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.textMuted }}>{r.time}</div>
                <div style={{ fontWeight: 700, color: C.text }}>{r.actor}</div>
                <div style={{ color: C.textMuted, fontWeight: 500 }}>{r.q}</div>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 10px",
                      borderRadius: 6,
                      background: r.change ? C.greenSoft : C.primarySoft,
                      color: r.change ? C.green : C.primary,
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

        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 22,
            opacity: statsIn,
            transform: `translateY(${(1 - statsIn) * 18}px)`,
          }}
        >
          <Stat label="AI decisions this week" value={`${counter}`} accent={C.primary} />
          <Stat label="Bound to a standard" value={`${pct}%`} accent={C.green} />
          <Stat label="Rogue answers" value="0" accent={C.green} />
        </div>
      </div>
    </SceneFrame>
  );
};

const Stat: React.FC<{ label: string; value: string; accent: string }> = ({ label, value, accent }) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: 22,
      boxShadow: "0 12px 30px -20px rgba(11,18,32,0.18)",
    }}
  >
    <div
      style={{
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: C.textSubtle,
        marginBottom: 8,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 52, fontWeight: 900, color: accent, lineHeight: 1 }}>{value}</div>
  </div>
);