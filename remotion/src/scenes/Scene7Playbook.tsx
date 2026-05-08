import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";
import { Window } from "../components/Window";
import { SceneFrame } from "../components/SceneFrame";

const AACE = [
  {
    tag: "A",
    label: "Assumption",
    text: "Buyer is mid-market, < EUR 200k ARR, renewal motion.",
    color: C.primary,
  },
  {
    tag: "A",
    label: "Action",
    text: "Apply discount cap from Q4 Discount Policy v2.5.",
    color: C.primary,
  },
  {
    tag: "C",
    label: "Constraint",
    text: "Above 22% on a 2-year deal requires CFO + Legal sign-off.",
    color: C.amber,
  },
  {
    tag: "E",
    label: "Evidence",
    text: "Bound to Q4 Discount Policy v2.5  ·  Owner: Sarah K.  ·  Updated Thu 16:47.",
    color: C.green,
  },
];

export const Scene7Playbook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelIn = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 110 } });
  const blockIn = (i: number) =>
    interpolate(frame, [40 + i * 22, 75 + i * 22], [0, 1], { extrapolateRight: "clamp" });
  const lineIn = interpolate(frame, [165, 195], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneFrame
      kicker="The grammar underneath"
      headline={
        <>
          Every playbook is written in{" "}
          <span style={{ color: C.primary }}>AACE</span>
          {" "}— the structure your AI executes.
        </>
      }
      durationInFrames={durationInFrames}
    >
      <div style={{ maxWidth: 1100, margin: "30px auto 0", padding: "0 60px" }}>
        <div
          style={{
            opacity: panelIn,
            transform: `translateY(${(1 - panelIn) * 18}px)`,
          }}
        >
          <Window label="Playbook  ·  Renewal Discount" accent={C.primary} glow>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {AACE.map((b, i) => (
                <div
                  key={b.label}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: "16px 18px",
                    background: "#FAFBFC",
                    border: `1px solid ${C.border}`,
                    borderLeft: `4px solid ${b.color}`,
                    borderRadius: 12,
                    opacity: blockIn(i),
                    transform: `translateX(${(1 - blockIn(i)) * -14}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: `${b.color}1A`,
                      color: b.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {b.tag}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 900,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: b.color,
                        marginBottom: 4,
                      }}
                    >
                      {b.label}
                    </div>
                    <div style={{ fontSize: 18, color: C.text, fontWeight: 600, lineHeight: 1.45 }}>
                      {b.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Window>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 36,
            fontSize: 28,
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
      </div>
    </SceneFrame>
  );
};