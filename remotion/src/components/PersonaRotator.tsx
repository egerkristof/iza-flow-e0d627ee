import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C } from "../theme";

/* Spine: same manager, rotating department label.
   Cycles through 4 personas across the duration of a scene. */
const PERSONAS = [
  { label: "Head of Sales",        sub: "Pipeline · deals · forecasts" },
  { label: "Head of Marketing",    sub: "Campaigns · briefs · launches" },
  { label: "Engineering Manager",  sub: "Specs · reviews · releases" },
  { label: "Head of Operations",   sub: "Process · vendors · approvals" },
];

export const PersonaRotator: React.FC<{
  durationInFrames: number;
  startAt?: number;
  width?: number;
}> = ({ durationInFrames, startAt = 0, width = 360 }) => {
  const frame = useCurrentFrame();
  const local = frame - startAt;
  // 4 personas across remaining duration
  const slice = Math.max(30, Math.floor((durationInFrames - startAt) / PERSONAS.length));
  const idx = Math.min(PERSONAS.length - 1, Math.max(0, Math.floor(local / slice)));
  const within = local - idx * slice;
  const fadeIn = interpolate(within, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(within, [slice - 10, slice], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);
  const p = PERSONAS[idx];

  return (
    <div
      style={{
        width,
        background: C.card,
        border: `1.5px solid ${C.border}`,
        borderRadius: 14,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 12px 30px -16px rgba(11,18,32,0.18)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.primary}, #66B8E0)`,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        YOU
      </div>
      <div style={{ opacity, transform: `translateY(${(1 - opacity) * 4}px)` }}>
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.18em", color: C.textSubtle, textTransform: "uppercase" }}>
          You could be
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: C.text, lineHeight: 1.1, marginTop: 2 }}>{p.label}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginTop: 2 }}>{p.sub}</div>
      </div>
    </div>
  );
};

/* Tiny inline pill version */
export const PersonaPill: React.FC<{ durationInFrames: number; startAt?: number }> = ({ durationInFrames, startAt = 0 }) => {
  const frame = useCurrentFrame();
  const local = frame - startAt;
  const slice = Math.max(30, Math.floor((durationInFrames - startAt) / PERSONAS.length));
  const idx = Math.min(PERSONAS.length - 1, Math.max(0, Math.floor(local / slice)));
  const within = local - idx * slice;
  const fadeIn = interpolate(within, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(within, [slice - 10, slice], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);
  return (
    <span
      style={{
        display: "inline-block",
        background: C.primarySoft,
        color: C.primary,
        fontWeight: 900,
        fontSize: 14,
        letterSpacing: "0.04em",
        padding: "6px 14px",
        borderRadius: 999,
        opacity,
      }}
    >
      {PERSONAS[idx].label}
    </span>
  );
};