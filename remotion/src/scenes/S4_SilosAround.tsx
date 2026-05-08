import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { PersonaPill } from "../components/PersonaRotator";
import { C } from "../theme";

/* Beat 4 · PROBLEM (Philosophical · silos + drift)
   Your team doesn't work alone. Other teams have their own undocumented context.
   Plus the world keeps changing. Knowledge goes stale before anyone notices. */
export const S4_SilosAround: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const others = [
    { name: "Adjacent team A", note: "Has a rule your team needs · never shared", color: C.amber },
    { name: "Adjacent team B", note: "Updated their policy last week · you'll find out next quarter", color: C.primary },
    { name: "Adjacent team C", note: "Working off a doc you wrote 8 months ago", color: C.green },
  ];

  const shifts = [
    "Regulation update · last Thursday",
    "New competitor pricing · this morning",
    "Customer segment redefined · Q3",
  ];

  return (
    <SceneFrame
      kicker="Problem · philosophical"
      headline="Your team doesn't work alone. And the ground keeps moving. Knowledge goes stale before anyone notices."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, padding: "0 100px" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <PersonaPill durationInFrames={durationInFrames} />
          <span style={{ fontSize: 14, fontWeight: 700, color: C.textMuted }}>· depends on three other teams to ship one decision</span>
        </div>

        <div style={{ display: "flex", gap: 22 }}>
          {others.map((o, i) => {
            const ap = spring({ frame: frame - 30 - i * 22, fps, config: { damping: 18, stiffness: 120 } });
            return (
              <div key={o.name} style={{ width: 360, opacity: ap, transform: `translateY(${(1 - ap) * 14}px)` }}>
                <Window label={o.name} accent={o.color}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text, lineHeight: 1.4 }}>{o.note}</div>
                </Window>
              </div>
            );
          })}
        </div>

        <div style={{ width: 1140, marginTop: 4, opacity: interpolate(frame, [140, 180], [0, 1], { extrapolateRight: "clamp" }) }}>
          <Window label="Plus · the world keeps moving" accent={C.red}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {shifts.map((s, i) => {
                const ap = spring({ frame: frame - 170 - i * 14, fps, config: { damping: 18, stiffness: 140 } });
                return (
                  <div key={s}
                    style={{
                      opacity: ap, transform: `translateY(${(1 - ap) * 6}px)`,
                      padding: "10px 16px", borderRadius: 999,
                      background: C.redSoft, color: C.red,
                      fontSize: 14, fontWeight: 800,
                    }}>{s}</div>
                );
              })}
            </div>
          </Window>
        </div>

        <div
          style={{
            opacity: interpolate(frame, [240, 290], [0, 1], { extrapolateRight: "clamp" }),
            fontSize: 18, fontWeight: 900, color: C.red,
          }}
        >
          Silos · plus drift · plus AI at scale. The gap compounds every week.
        </div>
      </div>
    </SceneFrame>
  );
};