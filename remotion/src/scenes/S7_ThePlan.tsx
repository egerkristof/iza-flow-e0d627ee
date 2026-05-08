import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { C } from "../theme";

/* Beat 7 — THE PLAN. Three concrete steps. Same Sarah, same teams. */
export const S7_ThePlan: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    {
      n: "01",
      title: "Codify",
      desc: "Sarah writes one Playbook for the Acme-class deal: thresholds, exceptions, who can override.",
      sample: "Discount > 12% → Finance review · MSA non-standard → Legal sign-off",
      color: C.primary,
    },
    {
      n: "02",
      title: "Publish",
      desc: "LIZA pushes that Playbook into every surface her team and adjacent teams already use.",
      sample: "Copilot · Glean · Harvey · Salesforce · the team workspace",
      color: C.amber,
    },
    {
      n: "03",
      title: "Inherit",
      desc: "Legal, Finance and CS see the same rule, in their tool, in their language. Same Monday.",
      sample: "Three teams. One source. Zero re-typing.",
      color: C.green,
    },
  ];

  return (
    <SceneFrame
      kicker="The plan · three moves"
      headline="Sarah's policy becomes the rule every tool runs."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22, padding: "0 120px", alignItems: "stretch" }}>
        {steps.map((s, i) => {
          const ap = spring({ frame: frame - 25 - i * 50, fps, config: { damping: 18, stiffness: 110 } });
          return (
            <div
              key={s.n}
              style={{
                opacity: ap,
                transform: `translateX(${(1 - ap) * -24}px)`,
              }}
            >
              <Window label={`Step ${s.n} · ${s.title}`} accent={s.color}>
                <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 18,
                      background: s.color + "18",
                      color: s.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 38,
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    {s.n}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>{s.desc}</div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: s.color,
                        background: s.color + "14",
                        padding: "8px 14px",
                        borderRadius: 8,
                        display: "inline-block",
                      }}
                    >
                      {s.sample}
                    </div>
                  </div>
                </div>
              </Window>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};