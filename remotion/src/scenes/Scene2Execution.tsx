import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";
import { Window } from "../components/Window";
import { SceneFrame } from "../components/SceneFrame";

const TOOLS = [
  { name: "Microsoft Copilot", who: "Maya  ·  Account Executive" },
  { name: "Claude", who: "Tom  ·  Deal Desk" },
  { name: "Glean", who: "Priya  ·  Customer Success" },
];

const ANSWER = "20% on multi-year. CFO sign-off above EUR 50k.";

export const Scene2Execution: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questionIn = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 110 } });
  const cardIn = (i: number) =>
    spring({ frame: frame - (50 + i * 18), fps, config: { damping: 20, stiffness: 120 } });
  const answerIn = (i: number) =>
    interpolate(frame, [80 + i * 18, 100 + i * 18], [0, 1], { extrapolateRight: "clamp" });
  const chipIn = (i: number) =>
    spring({ frame: frame - (118 + i * 18), fps, config: { damping: 14, stiffness: 160 } });
  const punchlineIn = interpolate(frame, [185, 200], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneFrame
      kicker="Tuesday  ·  14:02"
      headline={
        <>
          Three people. Three AI tools.{" "}
          <span style={{ color: C.primary }}>One answer your company actually approved.</span>
        </>
      }
      durationInFrames={durationInFrames}
    >
      {/* Question bubble */}
      <div
        style={{
          margin: "30px auto 30px",
          maxWidth: 980,
          padding: "22px 28px",
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          opacity: questionIn,
          transform: `translateY(${(1 - questionIn) * 16}px)`,
          boxShadow: "0 8px 30px -16px rgba(11,18,32,0.18)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.textSubtle,
            marginBottom: 8,
          }}
        >
          Slack  ·  #deal-desk
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.text }}>
          "What's our max discount on a 3-year renewal?"
        </div>
      </div>

      {/* Three tool cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 22,
          padding: "0 100px",
        }}
      >
        {TOOLS.map((t, i) => (
          <div
            key={t.name}
            style={{
              opacity: cardIn(i),
              transform: `translateY(${(1 - cardIn(i)) * 24}px)`,
            }}
          >
            <Window label={t.name} accent={C.primary}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.textMuted, marginBottom: 14 }}>
                {t.who}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: C.text,
                  lineHeight: 1.35,
                  minHeight: 110,
                  opacity: answerIn(i),
                  transform: `translateY(${(1 - answerIn(i)) * 8}px)`,
                }}
              >
                {ANSWER}
              </div>
              <div
                style={{
                  marginTop: 14,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: C.primarySoft,
                  border: `1px solid ${C.primaryRing}`,
                  color: C.primary,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  opacity: chipIn(i),
                  transform: `scale(${interpolate(chipIn(i), [0, 1], [0.85, 1])})`,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: C.primary,
                    boxShadow: `0 0 8px ${C.primary}`,
                  }}
                />
                per Discount Policy v2.4
              </div>
            </Window>
          </div>
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 40,
          fontSize: 22,
          fontWeight: 800,
          color: C.textMuted,
          opacity: punchlineIn,
          transform: `translateY(${(1 - punchlineIn) * 10}px)`,
        }}
      >
        No drift. No rogue prompts.{" "}
        <span style={{ color: C.green }}>The standard executes itself.</span>
      </div>
    </SceneFrame>
  );
};