import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { C } from "../theme";

/* Beat 5 — THE VILLAIN. Drift. Sarah firefights. Days lost. Trust erodes. */
export const S5_TheBreak: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const thread = [
    { who: "Legal",   t: "Cannot approve. SLA language is non-standard.",         tone: C.amber },
    { who: "Finance", t: "Discount above 12% needs CFO sign-off.",                tone: C.primary },
    { who: "CS",      t: "We already promised the customer 18%.",                  tone: C.green },
    { who: "Sarah",   t: "Calling a 30-min sync. Again. Third time this week.",   tone: C.red },
  ];

  return (
    <SceneFrame
      kicker="What actually happens"
      headline="Three days of email. One escalation. The customer notices the silence. Sarah is the bottleneck, not by choice."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", gap: 40, padding: "0 100px", alignItems: "stretch", justifyContent: "center" }}>
        <div style={{ width: 760 }}>
          <Window label="Re: Acme renewal · email thread" accent={C.red}>
            {thread.map((m, i) => {
              const ap = spring({ frame: frame - 30 - i * 28, fps, config: { damping: 18, stiffness: 130 } });
              return (
                <div
                  key={m.who}
                  style={{
                    opacity: ap,
                    transform: `translateX(${(1 - ap) * -16}px)`,
                    padding: "14px 0",
                    borderBottom: i < thread.length - 1 ? `1px solid ${C.border}` : "none",
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      minWidth: 96,
                      fontSize: 12,
                      fontWeight: 900,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: m.tone,
                      paddingTop: 4,
                    }}
                  >
                    {m.who}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text, lineHeight: 1.4 }}>{m.t}</div>
                </div>
              );
            })}
          </Window>
        </div>

        {/* Cost panel */}
        <div
          style={{
            width: 380,
            opacity: interpolate(frame, [140, 200], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [140, 200], [16, 0], { extrapolateRight: "clamp" })}px)`,
          }}
        >
          <Window label="What this week costs" accent={C.red} glow>
            {[
              { k: "Decisions stuck", v: "11" },
              { k: "Slack DMs to Sarah", v: "84" },
              { k: "Ad-hoc syncs", v: "5" },
              { k: "Customer days lost", v: "3" },
            ].map((row, i) => {
              const ap = spring({ frame: frame - 170 - i * 14, fps, config: { damping: 18, stiffness: 130 } });
              return (
                <div
                  key={row.k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 0",
                    borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
                    opacity: ap,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.textMuted }}>{row.k}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: C.red }}>{row.v}</div>
                </div>
              );
            })}
          </Window>
        </div>
      </div>
    </SceneFrame>
  );
};