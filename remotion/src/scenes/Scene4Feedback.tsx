import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";
import { Window } from "../components/Window";
import { SceneFrame } from "../components/SceneFrame";

export const Scene4Feedback: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const signalIn = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 110 } });
  const arrow1 = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: "clamp" });
  const inboxIn = spring({ frame: frame - 70, fps, config: { damping: 20, stiffness: 120 } });
  const noteIn = interpolate(frame, [110, 135], [0, 1], { extrapolateRight: "clamp" });
  const arrow2 = interpolate(frame, [140, 170], [0, 1], { extrapolateRight: "clamp" });
  const updateIn = spring({ frame: frame - 160, fps, config: { damping: 18, stiffness: 130 } });
  const stampIn = spring({ frame: frame - 195, fps, config: { damping: 12, stiffness: 180 } });
  const punchIn = interpolate(frame, [210, 230], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneFrame
      kicker="Thursday  ·  16:42"
      headline={
        <>
          A field signal closes the loop.{" "}
          <span style={{ color: C.primary }}>Sarah ships v2.5 in five minutes.</span>
        </>
      }
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 60px 1fr",
          alignItems: "stretch",
          gap: 24,
          padding: "0 120px",
          marginTop: 30,
        }}
      >
        {/* Field signal */}
        <div
          style={{
            opacity: signalIn,
            transform: `translateY(${(1 - signalIn) * 20}px)`,
          }}
        >
          <Window label="Field signal  ·  Maya (AE)" accent={C.amber}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.textMuted, marginBottom: 10 }}>
              Flagged from Copilot answer
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, lineHeight: 1.4, marginBottom: 14 }}>
              "Prospect is asking 25% on a 2-year deal. Standard says 15%. Worth an exception?"
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                borderRadius: 8,
                background: `${C.amber}1A`,
                color: C.amber,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Edge case  ·  routed to owner
            </div>
          </Window>
        </div>

        {/* Arrow 1 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="60" height="40" viewBox="0 0 60 40">
            <line
              x1="0" y1="20"
              x2={interpolate(arrow1, [0, 1], [6, 50])}
              y2="20"
              stroke={C.primary} strokeWidth="3" strokeLinecap="round"
            />
            <polygon
              points={`${interpolate(arrow1, [0, 1], [6, 50])},10 ${interpolate(arrow1, [0, 1], [6, 60])},20 ${interpolate(arrow1, [0, 1], [6, 50])},30`}
              fill={C.primary}
              opacity={arrow1}
            />
          </svg>
        </div>

        {/* Sarah's inbox / impact */}
        <div
          style={{
            opacity: inboxIn,
            transform: `translateY(${(1 - inboxIn) * 20}px)`,
          }}
        >
          <Window label="Sarah K.  ·  Standard owner" accent={C.primary} glow>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.textMuted, marginBottom: 10 }}>
              Impact preview
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {[
                { k: "Open deals affected", v: "23" },
                { k: "Teams using this standard", v: "4" },
                { k: "Similar exceptions last 30d", v: "7" },
              ].map((r) => (
                <div
                  key={r.k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 15,
                    padding: "10px 14px",
                    background: C.primarySoft,
                    border: `1px solid ${C.primaryRing}`,
                    borderRadius: 10,
                  }}
                >
                  <span style={{ color: C.text, fontWeight: 700 }}>{r.k}</span>
                  <span style={{ color: C.primary, fontWeight: 900 }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: 14,
                color: C.textMuted,
                fontWeight: 600,
                opacity: noteIn,
                transform: `translateY(${(1 - noteIn) * 8}px)`,
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              "Pattern. Add 22% cap for 2-yr enterprise."
            </div>
          </Window>
        </div>
      </div>

      {/* Down arrow + new version */}
      <div
        style={{
          margin: "20px auto 0",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <svg width="40" height="50" viewBox="0 0 40 50" style={{ opacity: arrow2 }}>
          <line
            x1="20" y1="0"
            x2="20"
            y2={interpolate(arrow2, [0, 1], [6, 36])}
            stroke={C.primary} strokeWidth="3" strokeLinecap="round"
          />
          <polygon
            points={`10,${interpolate(arrow2, [0, 1], [6, 36])} 30,${interpolate(arrow2, [0, 1], [6, 36])} 20,${interpolate(arrow2, [0, 1], [16, 46])}`}
            fill={C.primary}
          />
        </svg>

        <div
          style={{
            marginTop: 8,
            position: "relative",
            opacity: updateIn,
            transform: `translateY(${(1 - updateIn) * 14}px) scale(${interpolate(updateIn, [0, 1], [0.92, 1])})`,
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
          <span
            style={{
              fontSize: 14,
              color: C.textMuted,
              textDecoration: "line-through",
              fontWeight: 700,
            }}
          >
            v2.4
          </span>
          <span style={{ fontSize: 18, color: C.textSubtle }}>→</span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: C.primary,
            }}
          >
            v2.5
          </span>
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

      <div
        style={{
          textAlign: "center",
          marginTop: 24,
          fontSize: 20,
          fontWeight: 800,
          color: C.textMuted,
          opacity: punchIn,
          transform: `translateY(${(1 - punchIn) * 10}px)`,
        }}
      >
        Your standards{" "}
        <span style={{ color: C.green }}>learn from the field, not the boardroom.</span>
      </div>
    </SceneFrame>
  );
};