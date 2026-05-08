import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneShell, useRotatingPersona } from "../components/SceneShell";
import { C } from "../theme";

/* S1 · CHARACTER (22s) — You're the manager. The standard lives in your head. */
export const Scene1_Character: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const persona = useRotatingPersona(durationInFrames);

  const ringPulse = (Math.sin(frame / 22) + 1) / 2;
  const badgeIn = spring({ frame: frame - 30, fps, config: { damping: 18, stiffness: 120 } });

  return (
    <SceneShell
      kicker="The manager"
      headline="You set the standard."
      caption="Your team meets it because you carry it."
      personaLabel={persona}
      accent={C.primary}
      durationInFrames={durationInFrames}
    >
      {/* Hero: silhouette + standard badge */}
      <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 460, height: 460 }}>
          {/* glow rings */}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.primary}26, transparent 65%)`,
            transform: `scale(${1 + ringPulse * 0.18})` }} />
          <div style={{ position: "absolute", inset: 60, borderRadius: "50%",
            border: `2px dashed ${C.primary}66`, transform: `rotate(${frame * 0.4}deg)` }} />

          {/* silhouette circle */}
          <div style={{ position: "absolute", inset: 110, borderRadius: "50%",
            background: `linear-gradient(160deg, ${C.primary}, #0E6FA3)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 64, fontWeight: 900, letterSpacing: "0.04em",
            boxShadow: `0 30px 80px -20px ${C.primary}aa`,
          }}>YOU</div>

          {/* floating standard badge */}
          <div style={{
            position: "absolute", top: 30, right: -40,
            opacity: badgeIn, transform: `translateY(${(1 - badgeIn) * 16}px) translateY(${ringPulse * 4}px)`,
            background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14,
            padding: "12px 18px",
            boxShadow: "0 18px 40px -18px rgba(11,18,32,0.25)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.18em", color: C.primary, textTransform: "uppercase" }}>
              Standard
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.text, marginTop: 2 }}>How we work</div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
