import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";
import { Window } from "../components/Window";
import { SceneFrame } from "../components/SceneFrame";

const ROWS = [
  { time: "Mon 09:14", actor: "Maya  ·  Copilot",  v: "v2.4", ok: true },
  { time: "Tue 14:02", actor: "Tom  ·  Claude",    v: "v2.4", ok: true },
  { time: "Wed 10:18", actor: "Legal  ·  Glean",   v: "v2.4", ok: true },
  { time: "Thu 16:42", actor: "Maya  ·  Copilot",  v: "v2.4 → v2.5", ok: true, change: true },
  { time: "Fri 11:05", actor: "Priya  ·  Copilot", v: "v2.5", ok: true },
];

const AACE = [
  { tag: "A", label: "Assumption", text: "Buyer is mid-market, < EUR 200k ARR", color: C.primary },
  { tag: "A", label: "Action",     text: "Apply discount cap from Q4 Policy v2.5", color: C.primary },
  { tag: "C", label: "Constraint", text: "Above 22% requires CFO + Legal sign-off", color: C.amber },
  { tag: "E", label: "Evidence",   text: "Bound to Q4 Discount Policy v2.5  ·  Owner: Sarah K.", color: C.green },
];

export const Scene5AuditPlaybook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const auditIn = spring({ frame: frame - 6, fps, config: { damping: 18, stiffness: 110 } });
  const rowIn = (i: number) =>
    interpolate(frame, [20 + i * 8, 40 + i * 8], [0, 1], { extrapolateRight: "clamp" });
  const playbookIn = spring({ frame: frame - 70, fps, config: { damping: 20, stiffness: 120 } });
  const blockIn = (i: number) =>
    interpolate(frame, [100 + i * 14, 125 + i * 14], [0, 1], { extrapolateRight: "clamp" });
  const lineIn = interpolate(frame, [200, 225], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneFrame
      kicker="Friday  ·  16:30"
      headline={
        <>
          Every AI decision this week,{" "}
          <span style={{ color: C.primary }}>tied to a playbook your auditor can read.</span>
        </>
      }
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
          padding: "0 120px",
          marginTop: 30,
        }}
      >
        {/* Audit log */}
        <div
          style={{
            opacity: auditIn,
            transform: `translateY(${(1 - auditIn) * 18}px)`,
          }}
        >
          <Window label="LIZA  ·  Audit Log" accent={C.primary}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 130px 40px",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: C.textSubtle,
                padding: "0 8px 10px",
                borderBottom: `1px solid ${C.border}`,
                marginBottom: 6,
              }}
            >
              <div>When</div>
              <div>Actor / Tool</div>
              <div>Bound to</div>
              <div style={{ textAlign: "right" }}>OK</div>
            </div>
            {ROWS.map((r, i) => (
              <div
                key={r.time}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 130px 40px",
                  alignItems: "center",
                  padding: "10px 8px",
                  borderBottom: i < ROWS.length - 1 ? `1px solid ${C.border}` : "none",
                  opacity: rowIn(i),
                  transform: `translateX(${(1 - rowIn(i)) * -10}px)`,
                  fontSize: 14,
                }}
              >
                <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.textMuted }}>
                  {r.time}
                </div>
                <div style={{ fontWeight: 700, color: C.text }}>{r.actor}</div>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: 6,
                      background: r.change ? C.greenSoft : C.primarySoft,
                      color: r.change ? C.green : C.primary,
                      fontSize: 12,
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
                      width: 24,
                      height: 24,
                      borderRadius: 999,
                      background: C.greenSoft,
                      color: C.green,
                      fontWeight: 900,
                      fontSize: 14,
                    }}
                  >
                    ✓
                  </span>
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 16,
                paddingTop: 12,
                borderTop: `1px solid ${C.border}`,
              }}
            >
              <Stat label="Decisions" value="47" accent={C.primary} />
              <Stat label="Bound" value="100%" accent={C.green} />
              <Stat label="Rogue" value="0" accent={C.green} />
            </div>
          </Window>
        </div>

        {/* Playbook with AACE */}
        <div
          style={{
            opacity: playbookIn,
            transform: `translateY(${(1 - playbookIn) * 18}px)`,
          }}
        >
          <Window label="Playbook  ·  Renewal Discount" accent={C.primary} glow>
            <div
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: C.textSubtle,
                marginBottom: 12,
              }}
            >
              AACE structure  ·  the grammar your AI executes
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {AACE.map((b, i) => (
                <div
                  key={b.label}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 14px",
                    background: "#FAFBFC",
                    border: `1px solid ${C.border}`,
                    borderLeft: `4px solid ${b.color}`,
                    borderRadius: 10,
                    opacity: blockIn(i),
                    transform: `translateX(${(1 - blockIn(i)) * -10}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: `${b.color}1A`,
                      color: b.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {b.tag}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: b.color,
                        marginBottom: 2,
                      }}
                    >
                      {b.label}
                    </div>
                    <div style={{ fontSize: 14, color: C.text, fontWeight: 600, lineHeight: 1.4 }}>
                      {b.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Window>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 32,
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: "-0.01em",
          color: C.text,
          opacity: lineIn,
          transform: `translateY(${(1 - lineIn) * 12}px)`,
        }}
      >
        Your best standard.{" "}
        <span style={{ color: C.primary }}>Executed, audited, evolving.</span>
      </div>
    </SceneFrame>
  );
};

const Stat: React.FC<{ label: string; value: string; accent: string }> = ({ label, value, accent }) => (
  <div style={{ flex: 1 }}>
    <div
      style={{
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: C.textSubtle,
        marginBottom: 4,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 28, fontWeight: 900, color: accent, lineHeight: 1 }}>{value}</div>
  </div>
);