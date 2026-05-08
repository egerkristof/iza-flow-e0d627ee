import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";
import { Window } from "../components/Window";
import { SceneFrame } from "../components/SceneFrame";

const RULES = [
  { k: "Discount cap", v: "15% standard / 20% multi-year" },
  { k: "Approval threshold", v: "> EUR 50k requires CFO + Legal" },
  { k: "PII in prompts", v: "Blocked. Logged." },
];

export const Scene1Standard: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Doc on left enters, slides slightly, then arrow + standard appears
  const docIn = spring({ frame: frame - 12, fps, config: { damping: 18, stiffness: 90 } });
  const arrowIn = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: "clamp" });
  const standardIn = spring({ frame: frame - 70, fps, config: { damping: 20, stiffness: 120 } });
  const ruleIn = (i: number) =>
    interpolate(frame, [95 + i * 14, 115 + i * 14], [0, 1], { extrapolateRight: "clamp" });
  const stampIn = spring({ frame: frame - 158, fps, config: { damping: 12, stiffness: 180 } });

  return (
    <SceneFrame
      kicker="Monday  ·  9:04 AM"
      headline={
        <>
          The VP of Sales publishes the new policy.{" "}
          <span style={{ color: C.primary }}>LIZA turns it into a versioned standard.</span>
        </>
      }
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px 1.4fr",
          alignItems: "center",
          gap: 40,
          padding: "0 140px",
          marginTop: 40,
        }}
      >
        {/* Doc */}
        <div
          style={{
            opacity: docIn,
            transform: `translateY(${(1 - docIn) * 24}px)`,
          }}
        >
          <Window label="Q4 Discount Policy.docx" accent={C.textMuted}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[1, 0.86, 0.92, 0.7, 0.88, 0.6].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: 10,
                    width: `${w * 100}%`,
                    background: i % 2 === 0 ? "#D9DEE5" : "#E6EAF0",
                    borderRadius: 6,
                  }}
                />
              ))}
              <div style={{ height: 1, background: C.border, margin: "8px 0" }} />
              {[0.78, 0.95, 0.5].map((w, i) => (
                <div
                  key={`b${i}`}
                  style={{
                    height: 10,
                    width: `${w * 100}%`,
                    background: "#E6EAF0",
                    borderRadius: 6,
                  }}
                />
              ))}
              <div
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  color: C.textSubtle,
                  fontWeight: 600,
                }}
              >
                Drafted by Sarah K., CRO  ·  4 pages
              </div>
            </div>
          </Window>
        </div>

        {/* Arrow */}
        <div
          style={{
            opacity: arrowIn,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg width="80" height="40" viewBox="0 0 80 40">
            <line
              x1="0"
              y1="20"
              x2={interpolate(arrowIn, [0, 1], [10, 70])}
              y2="20"
              stroke={C.primary}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <polygon
              points={`${interpolate(arrowIn, [0, 1], [10, 70])},10 ${interpolate(arrowIn, [0, 1], [10, 80])},20 ${interpolate(arrowIn, [0, 1], [10, 70])},30`}
              fill={C.primary}
              opacity={arrowIn}
            />
          </svg>
        </div>

        {/* LIZA Standard */}
        <div
          style={{
            opacity: standardIn,
            transform: `translateY(${(1 - standardIn) * 24}px)`,
            position: "relative",
          }}
        >
          <Window label="LIZA  ·  Decision Standard" accent={C.primary} glow>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: C.primarySoft,
                  border: `1px solid ${C.primaryRing}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.primary,
                  fontWeight: 900,
                  fontSize: 22,
                }}
              >
                §
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.1 }}>
                  Q4 Discount Policy
                </div>
                <div style={{ fontSize: 14, color: C.textSubtle, fontWeight: 600, marginTop: 4 }}>
                  v2.4  ·  Owned by Sarah K.  ·  Effective today
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {RULES.map((r, i) => (
                <div
                  key={r.k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 18px",
                    background: C.primarySoft,
                    border: `1px solid ${C.primaryRing}`,
                    borderRadius: 12,
                    opacity: ruleIn(i),
                    transform: `translateX(${(1 - ruleIn(i)) * -16}px)`,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{r.k}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>{r.v}</span>
                </div>
              ))}
            </div>

            {/* Versioned stamp */}
            <div
              style={{
                position: "absolute",
                top: 18,
                right: 22,
                opacity: stampIn,
                transform: `scale(${interpolate(stampIn, [0, 1], [0.6, 1])}) rotate(-6deg)`,
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "6px 12px",
                border: `2px solid ${C.green}`,
                color: C.green,
                borderRadius: 6,
                background: C.greenSoft,
              }}
            >
              Live  ·  Versioned
            </div>
          </Window>
        </div>
      </div>
    </SceneFrame>
  );
};