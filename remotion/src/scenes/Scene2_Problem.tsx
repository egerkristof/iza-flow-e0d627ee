import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneShell, useRotatingPersona } from "../components/SceneShell";
import { Beat } from "../components/Beat";
import { C } from "../theme";

/* S2 · PROBLEM (18s / 540f)
   Beat A: junior guesses wrong.
   Beat B: copilot invents wrong.
   Beat C: errors compound. */
export const Scene2_Problem: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const persona = useRotatingPersona(durationInFrames);

  // counter for compounding beat
  const counter = Math.min(64, Math.floor(interpolate(frame, [360, 520], [0, 64], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));

  return (
    <SceneShell
      kicker="The problem"
      headline="It doesn't scale."
      caption="Juniors guess. Copilots invent. The gap compounds."
      personaLabel={persona}
      accent={C.red}
      durationInFrames={durationInFrames}
    >
      <div style={{ position: "relative", width: "100%", height: 460 }}>
        {/* Beat A — junior guesses */}
        <Beat from={10} hold={170}>
          <ChatRow
            who="Junior · Slack"
            ask="What's the discount cap for ACME?"
            answer="I think 15%? Going with that."
            verdict="Wrong. Real cap is 8%."
          />
        </Beat>

        {/* Beat B — copilot invents */}
        <Beat from={170} hold={185}>
          <ChatRow
            who="Copilot · Inline"
            ask="@copilot draft discount approval for ACME"
            answer={'"Standard discount 15%. Approval not required."'}
            verdict="Invented. No source. No standard."
          />
        </Beat>

        {/* Beat C — compounding */}
        <Beat from={355} hold={185}>
          <div style={{ width: 720, textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: "0.22em", color: C.textSubtle, textTransform: "uppercase" }}>
              Same gap, every day, across the team
            </div>
            <div style={{
              marginTop: 22, display: "flex", justifyContent: "center", gap: 18,
            }}>
              {[
                { label: "Day 1", v: Math.min(2, counter) },
                { label: "Week 1", v: Math.min(14, counter) },
                { label: "Month 1", v: counter },
              ].map((b, i) => (
                <div key={i} style={{
                  width: 200, padding: "22px 18px",
                  background: C.card, border: `2px solid ${C.red}`, borderRadius: 14,
                  boxShadow: `0 22px 50px -22px ${C.red}66`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.18em", color: C.red, textTransform: "uppercase" }}>{b.label}</div>
                  <div style={{ fontSize: 56, fontWeight: 900, color: C.text, lineHeight: 1, marginTop: 6 }}>{b.v}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, marginTop: 4 }}>silent errors</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 22, fontSize: 16, fontWeight: 800, color: C.textMuted }}>
              You catch the loud ones. The quiet ones become the new normal.
            </div>
          </div>
        </Beat>
      </div>
    </SceneShell>
  );
};

const ChatRow: React.FC<{ who: string; ask: string; answer: string; verdict: string }> = ({ who, ask, answer, verdict }) => (
  <div style={{ width: 700 }}>
    <div style={{
      background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 16,
      overflow: "hidden", boxShadow: "0 22px 50px -22px rgba(11,18,32,0.20)",
    }}>
      <div style={{
        padding: "12px 18px", borderBottom: `1px solid ${C.border}`,
        fontSize: 12, fontWeight: 900, letterSpacing: "0.18em",
        color: C.textMuted, textTransform: "uppercase",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: C.primary }} />
        {who}
      </div>
      <div style={{ padding: "20px 22px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.textMuted, marginBottom: 12 }}>{ask}</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text, lineHeight: 1.35 }}>{answer}</div>
        <div style={{
          marginTop: 18, display: "flex", alignItems: "center", gap: 12,
          padding: "10px 14px", background: C.redSoft, border: `1.5px solid ${C.red}`, borderRadius: 10,
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 999, background: C.red, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16,
          }}>×</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.red }}>{verdict}</div>
        </div>
      </div>
    </div>
  </div>
);
