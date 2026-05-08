import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneShell, useRotatingPersona } from "../components/SceneShell";
import { Beat } from "../components/Beat";
import { C } from "../theme";

/* S1 · CHARACTER (22s / 660f)
   Right stage walks through 3 concrete decisions a manager makes every day,
   then collapses them into "all of this lives in your head." */
export const Scene1_Character: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const persona = useRotatingPersona(durationInFrames);

  const moments = [
    { from: 10,  hold: 195, ask: "Junior asks: discount for ACME?", verdict: "Cap 8%. Above → RevOps.",  tag: "PRICING" },
    { from: 195, hold: 195, ask: "Marketing asks: pitch for VP CFO?", verdict: "Lead with outcome, not feature.", tag: "MESSAGE" },
    { from: 380, hold: 195, ask: "Eng asks: ship the new endpoint?",  verdict: "No raw SQL in handlers.",  tag: "QUALITY" },
  ];

  return (
    <SceneShell
      kicker="The manager"
      headline="You are the standard."
      caption="Every day, your team asks. You decide. They learn."
      personaLabel={persona}
      accent={C.primary}
      durationInFrames={durationInFrames}
    >
      <div style={{ position: "relative", width: "100%", height: 460 }}>
        {moments.map((m, i) => (
          <Beat key={i} from={m.from} hold={m.hold}>
            <DecisionCard ask={m.ask} verdict={m.verdict} tag={m.tag} />
          </Beat>
        ))}

        {/* Final beat — they stack into "your head" */}
        <Beat from={575} hold={85}>
          <div style={{ position: "relative", width: 600, height: 360 }}>
            {moments.map((m, i) => (
              <div key={i} style={{
                position: "absolute", left: 80 + i * 30, top: 30 + i * 70, width: 460,
                background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14,
                padding: "14px 18px", boxShadow: "0 18px 40px -22px rgba(11,18,32,0.25)",
                transform: `rotate(${(i - 1) * 1.5}deg)`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.18em", color: C.primary, textTransform: "uppercase" }}>{m.tag}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginTop: 4 }}>{m.verdict}</div>
              </div>
            ))}
            <div style={{
              position: "absolute", left: 0, bottom: -10, right: 0, textAlign: "center",
              fontSize: 18, fontWeight: 900, color: C.textMuted, letterSpacing: "0.04em",
            }}>…and 50 more, all in your head.</div>
          </div>
        </Beat>
      </div>
    </SceneShell>
  );
};

const DecisionCard: React.FC<{ ask: string; verdict: string; tag: string }> = ({ ask, verdict, tag }) => (
  <div style={{ width: 620 }}>
    {/* incoming ask */}
    <div style={{
      background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14,
      padding: "16px 20px", marginBottom: 18,
      boxShadow: "0 18px 40px -22px rgba(11,18,32,0.18)",
    }}>
      <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.18em", color: C.textSubtle, textTransform: "uppercase" }}>Incoming</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginTop: 4 }}>{ask}</div>
    </div>
    {/* arrow */}
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
      <div style={{ width: 2, height: 26, background: C.borderStrong }} />
    </div>
    {/* verdict (the standard) */}
    <div style={{
      background: C.primarySoft, border: `2px solid ${C.primary}`, borderRadius: 14,
      padding: "16px 20px",
      boxShadow: `0 20px 50px -22px ${C.primary}66`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.18em", color: C.primary, textTransform: "uppercase" }}>{tag} · Standard</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color: C.text, marginTop: 4 }}>{verdict}</div>
    </div>
  </div>
);
