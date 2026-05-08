import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Window } from "../components/Window";
import { C } from "../theme";

/* Beat 8 · SUCCESS + CALL TO ACTION (StoryBrand 5 + 7).
   The new reality. AI-native team. Connect existing tools via APIs and MCPs. */
export const S8_NewMonday: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stack = [
    "Google Drive", "SharePoint", "Notion", "Slack",
    "Salesforce", "HubSpot", "Jira", "Linear",
    "GitHub", "Copilot", "Glean", "MCPs",
  ];

  const outcomes = [
    "Every person executes at the senior standard",
    "Every agent runs the same playbook · cited and current",
    "Cross-team context flows in real time",
    "Your team becomes the benchmark for the rest of the org",
  ];

  return (
    <SceneFrame
      kicker="The new reality"
      headline="Run your team on AI-native infrastructure. Same SaaS feel. Your existing stack, connected in."
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, padding: "0 100px" }}>
        <div style={{ width: 1080 }}>
          <Window label="Connect what you already use" accent={C.primary}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {stack.map((s, i) => {
                const ap = spring({ frame: frame - 18 - i * 6, fps, config: { damping: 18, stiffness: 140 } });
                return (
                  <div key={s} style={{
                    opacity: ap, transform: `translateY(${(1 - ap) * 6}px)`,
                    padding: "10px 16px", borderRadius: 10,
                    border: `1.5px solid ${C.border}`, background: C.card,
                    fontSize: 15, fontWeight: 800, color: C.text,
                  }}>{s}</div>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, fontWeight: 700, color: C.textMuted, letterSpacing: "0.04em" }}>
              APIs · MCPs · native integrations · zero rip-and-replace
            </div>
          </Window>
        </div>

        <div style={{ width: 1080 }}>
          <Window label="What you get on Monday" accent={C.green} glow>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {outcomes.map((o, i) => {
                const ap = spring({ frame: frame - 80 - i * 18, fps, config: { damping: 18, stiffness: 130 } });
                return (
                  <div key={o} style={{
                    opacity: ap, transform: `translateX(${(1 - ap) * -10}px)`,
                    display: "flex", gap: 12, alignItems: "center",
                    padding: "12px 14px", borderRadius: 10,
                    background: C.greenSoft, border: `1px solid ${C.green}33`,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: C.green, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 900, fontSize: 16, flexShrink: 0,
                    }}>✓</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{o}</div>
                  </div>
                );
              })}
            </div>
          </Window>
        </div>

        <div style={{
          opacity: interpolate(frame, [220, 270], [0, 1], { extrapolateRight: "clamp" }),
          textAlign: "center", marginTop: 6,
        }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: C.text, letterSpacing: "-0.01em" }}>
            Your standards · executable · once.
          </div>
          <div style={{
            marginTop: 14, display: "inline-block",
            background: `linear-gradient(135deg, ${C.primary}, #0E6FA3)`,
            color: "#fff", fontWeight: 900, fontSize: 18,
            padding: "14px 28px", borderRadius: 12,
            letterSpacing: "0.04em",
            boxShadow: `0 20px 50px -20px ${C.primary}aa`,
          }}>
            Talk to us · start with LIZA
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};