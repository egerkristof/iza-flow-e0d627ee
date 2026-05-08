import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, fontFamily } from "../theme";

export const SceneFrame: React.FC<{
  kicker: string;
  headline: string;
  children: React.ReactNode;
  durationInFrames: number;
}> = ({ kicker, headline, children, durationInFrames }) => {
  const frame = useCurrentFrame();
  // Fade in (0-12) and fade out (last 14)
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        fontFamily,
        color: C.text,
        opacity,
      }}
    >
      {/* Subtle dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(11,18,32,0.05) 1px, transparent 0)",
          backgroundSize: "36px 36px",
          opacity: 0.6,
        }}
      />
      {/* Ambient glow */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 25%, rgba(31,143,204,0.10) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: C.primary,
            marginBottom: 18,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          {headline}
        </div>
      </div>

      <AbsoluteFill style={{ top: 280 }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};