import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { PersonaPill } from "../components/PersonaRotator";
import { C } from "../theme";

/* Beat 2 · PROBLEM (External, StoryBrand 2)
   The standard lives in your seniors' heads. You can't write it all down.
   Juniors do it differently. Output drifts. */
export const S2_MondayMorning: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Three versions of the same task — different people, different output.
  const versions = [
    { who: "Senior",  badge: "S", color: C.primary, headline: "Done the right way",    detail: "Caveats added · context applied · expected exception called out", quality: "100%" },
    { who: "Junior A",badge: "J", color: C.amber,   headline: "Missing the nuance",    detail: "Used the template · skipped the caveat · pricing edge case missed",   quality: "62%" },
    { who: "Junior B",badge: "J", color: C.red,     headline: "Wrong answer, confidently", detail: "Followed an out-of-date doc · contradicts last quarter's call",     quality: "38%" },
  ];

  return (
    <SceneFrame
      kicker="Problem · external"
      headline="Your highest standard lives in the heads of your best people. You can't write it all down. Everyone else fills the gap their own way."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, padding: "0 100px" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <PersonaPill durationInFrames={durationInFrames} />
          <span style={{ fontSize: 14, fontWeight: 700, color: C.textMuted }}>· same task, three people</span>
        </div>

        <div style={{ display: "flex", gap: 22, alignItems: "stretch" }}>
          {versions.map((v, i) => {
            const ap = spring({ frame: frame - 30 - i * 22, fps, config: { damping: 18, stiffness: 120 } });
            return (
              <div key={v.who} style={{ width: 380, opacity: ap, transform: `translateY(${(1 - ap) * 16}px)` }}>
                <Window label={`${v.who} · same task`} accent={v.color}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 38, height: 38, borderRadius: "50%",
                        background: v.color + "22", color: v.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 900, fontSize: 16,
                      }}
                    >{v.badge}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: C.text }}>{v.headline}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, lineHeight: 1.45 }}>{v.detail}</div>
                  <div
                    style={{
                      marginTop: 16, padding: "8px 12px", borderRadius: 8,
                      background: v.color + "14", color: v.color,
                      fontSize: 12, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase",
                      display: "inline-block",
                    }}
                  >quality vs your standard · {v.quality}</div>
                </Window>
              </div>
            );
          })}
        </div>

        <div
          style={{
            opacity: interpolate(frame, [180, 230], [0, 1], { extrapolateRight: "clamp" }),
            fontSize: 18, fontWeight: 800, color: C.red,
          }}
        >
          Same role. Same week. Three different definitions of "done well."
        </div>
      </div>
    </SceneFrame>
  );
};