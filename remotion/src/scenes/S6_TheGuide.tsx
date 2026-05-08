import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { C } from "../theme";

/* Beat 6 · PLAN (StoryBrand 4). Three concrete steps. */
export const S6_TheGuide: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    {
      n: "01",
      title: "Ingest & codify",
      desc: "Connect your Drive, SharePoint, Notion. LIZA turns docs · in date or out · into versioned Playbooks. AACE captures the unwritten expert reasoning.",
      sample: "Docs in · Playbooks out · gaps flagged for you to fill",
      color: C.primary,
    },
    {
      n: "02",
      title: "Learn from the work",
      desc: "Your team works in shared workspaces. LIZA learns how your seniors actually do it. Next time, a junior or an agent can match the same standard.",
      sample: "Senior sets the bar · juniors and agents inherit it · same workspace",
      color: C.amber,
    },
    {
      n: "03",
      title: "Connect across teams",
      desc: "Other teams run LIZA too. The live, current context flows between you · automatically. The silos are gone, not because you held a meeting.",
      sample: "Your team's standard · their team's context · one source of truth",
      color: C.green,
    },
  ];

  return (
    <SceneFrame
      kicker="The plan · three moves"
      headline="From your people, to your team, to every team you work with."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "0 100px" }}>
        {steps.map((s, i) => {
          const ap = spring({ frame: frame - 22 - i * 50, fps, config: { damping: 18, stiffness: 110 } });
          return (
            <div key={s.n} style={{ opacity: ap, transform: `translateX(${(1 - ap) * -24}px)` }}>
              <Window label={`Step ${s.n} · ${s.title}`} accent={s.color}>
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                  <div
                    style={{
                      width: 86, height: 86, borderRadius: 18,
                      background: s.color + "18", color: s.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 36, fontWeight: 900, flexShrink: 0,
                    }}
                  >{s.n}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 6, lineHeight: 1.35 }}>{s.desc}</div>
                    <div
                      style={{
                        fontSize: 13, fontWeight: 800, color: s.color,
                        background: s.color + "14", padding: "6px 12px",
                        borderRadius: 8, display: "inline-block",
                      }}
                    >{s.sample}</div>
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