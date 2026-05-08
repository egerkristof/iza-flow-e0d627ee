import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { C } from "../theme";

/* Beat 7 · STAKES (StoryBrand 6 · "what's at stake if you don't act").
   Without LIZA — silos compound, AI does the wrong thing faster, drift wins. */
export const S7_ThePlan: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cols = [
    {
      tag: "Without LIZA",
      tone: C.red,
      bullets: [
        "Standards stay in your seniors' heads",
        "AI accelerates the wrong answer",
        "Silos harden · cross-team context never arrives",
        "Every quarter the gap between juniors and seniors widens",
      ],
      kicker: "You go faster · in the wrong direction",
    },
    {
      tag: "With LIZA",
      tone: C.green,
      bullets: [
        "Your highest standard is captured · once",
        "Every person and every agent inherits it",
        "Context flows across teams in real time",
        "Your team becomes the benchmark, not the bottleneck",
      ],
      kicker: "Same speed · in the right direction",
    },
  ];

  return (
    <SceneFrame
      kicker="What's at stake"
      headline="The choice isn't whether AI joins your team. It's which version of your team it amplifies."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", gap: 28, padding: "0 100px", justifyContent: "center" }}>
        {cols.map((c, i) => {
          const ap = spring({ frame: frame - 24 - i * 36, fps, config: { damping: 18, stiffness: 110 } });
          return (
            <div key={c.tag} style={{ width: 540, opacity: ap, transform: `translateY(${(1 - ap) * 16}px)` }}>
              <Window label={c.tag} accent={c.tone} glow={i === 1}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {c.bullets.map((b, j) => {
                    const bp = spring({ frame: frame - 60 - i * 36 - j * 14, fps, config: { damping: 18, stiffness: 130 } });
                    return (
                      <div key={b} style={{
                        opacity: bp, transform: `translateX(${(1 - bp) * -10}px)`,
                        display: "flex", gap: 12, alignItems: "flex-start",
                      }}>
                        <div style={{
                          marginTop: 8, width: 8, height: 8, borderRadius: "50%",
                          background: c.tone, flexShrink: 0,
                        }} />
                        <div style={{ fontSize: 17, fontWeight: 700, color: C.text, lineHeight: 1.4 }}>{b}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{
                  marginTop: 18, padding: "10px 14px", borderRadius: 10,
                  background: c.tone + "14", color: c.tone,
                  fontSize: 14, fontWeight: 900, letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>{c.kicker}</div>
              </Window>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};