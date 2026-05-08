import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C, fontFamily } from "../theme";

/* Persistent left-rail layout. Same frame structure every scene.
   Only the hero stage on the right changes. Caption ≤ 10 words. */
export const SceneShell: React.FC<{
  kicker: string;
  headline: string;
  caption: string;
  personaLabel?: string;
  accent?: string;
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ kicker, headline, caption, personaLabel, accent = C.primary, durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 16, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);

  const railSpring = spring({ frame: frame - 4, fps, config: { damping: 22, stiffness: 120 } });
  const heroSpring = spring({ frame: frame - 18, fps, config: { damping: 22, stiffness: 110 } });
  const capSpring  = spring({ frame: frame - 36, fps, config: { damping: 22, stiffness: 130 } });

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily, color: C.text, opacity }}>
      <AbsoluteFill style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(11,18,32,0.05) 1px, transparent 0)",
        backgroundSize: "44px 44px", opacity: 0.55,
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 55% 45% at 78% 50%, ${accent}1f 0%, transparent 70%)`,
      }} />

      {/* LEFT RAIL */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 720,
        padding: "120px 70px 200px 110px",
        display: "flex", flexDirection: "column", justifyContent: "center",
        opacity: railSpring, transform: `translateX(${(1 - railSpring) * -24}px)`,
      }}>
        <div style={{
          fontSize: 16, fontWeight: 900, letterSpacing: "0.34em", textTransform: "uppercase",
          color: accent, marginBottom: 22,
        }}>{kicker}</div>

        <div style={{
          fontSize: 60, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.022em",
          color: C.text,
        }}>{headline}</div>

        {personaLabel && (
          <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: accent }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: C.textMuted, letterSpacing: "0.04em" }}>
              {personaLabel}
            </span>
          </div>
        )}
      </div>

      {/* RIGHT HERO STAGE */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, left: 720,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "100px 110px 200px 40px",
        opacity: heroSpring, transform: `translateY(${(1 - heroSpring) * 18}px)`,
      }}>
        <div style={{ width: "100%", maxWidth: 980 }}>{children}</div>
      </div>

      {/* CAPTION */}
      <div style={{
        position: "absolute", bottom: 70, left: 110, right: 110,
        textAlign: "center", opacity: capSpring,
        transform: `translateY(${(1 - capSpring) * 8}px)`,
      }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: C.textMuted }}>{caption}</span>
      </div>
    </AbsoluteFill>
  );
};

const PERSONAS = ["Head of Sales", "Head of Marketing", "Engineering Manager", "Head of Operations"];
export const useRotatingPersona = (durationInFrames: number) => {
  const frame = useCurrentFrame();
  const slice = Math.max(30, Math.floor(durationInFrames / PERSONAS.length));
  const idx = Math.min(PERSONAS.length - 1, Math.max(0, Math.floor(frame / slice)));
  return PERSONAS[idx];
};
