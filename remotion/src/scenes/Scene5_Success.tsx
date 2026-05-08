import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { C } from "../theme";

/* S5 · SUCCESS (14s) — Same speed. Right direction. */
export const Scene5_Success: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Two arrows growing. Red drifts off. Green stays on axis.
  const grow = interpolate(frame, [10, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoIn = spring({ frame: frame - 220, fps, config: { damping: 18, stiffness: 110 } });

  // Red drift angle
  const drift = interpolate(frame, [10, 200], [0, 26], { extrapolateRight: "clamp" });

  return (
    <SceneShell
      kicker="The outcome"
      headline="Same speed. Right direction."
      caption="Your team becomes the benchmark, not the bottleneck."
      accent={C.green}
      durationInFrames={durationInFrames}
    >
      <div style={{ position: "relative", width: "100%", height: 460 }}>
        {/* SVG arrows */}
        <svg viewBox="0 0 800 460" style={{ width: "100%", height: "100%" }}>
          {/* axis dashed line */}
          <line x1="60" y1="230" x2="740" y2="230" stroke={C.border} strokeWidth="2" strokeDasharray="6 8" />

          {/* RED off-axis */}
          <g transform={`rotate(${drift} 60 230)`}>
            <line x1="60" y1="230" x2={60 + 600 * grow} y2="230"
              stroke={C.red} strokeWidth="6" strokeLinecap="round" />
            <polygon
              points={`${60 + 600 * grow},220 ${60 + 600 * grow + 18},230 ${60 + 600 * grow},240`}
              fill={C.red} opacity={grow}
            />
          </g>
          <text x="60" y="200" fontSize="14" fontWeight="900" fill={C.red} letterSpacing="3">
            WITHOUT LIZA
          </text>

          {/* GREEN on-axis */}
          <g>
            <line x1="60" y1="230" x2={60 + 600 * grow} y2="230"
              stroke={C.green} strokeWidth="6" strokeLinecap="round" opacity="0.9" />
            <polygon
              points={`${60 + 600 * grow},220 ${60 + 600 * grow + 18},230 ${60 + 600 * grow},240`}
              fill={C.green} opacity={grow}
            />
          </g>
          <text x="60" y="270" fontSize="14" fontWeight="900" fill={C.green} letterSpacing="3">
            WITH LIZA
          </text>

          {/* target dot */}
          <circle cx="700" cy="230" r="14" fill="none" stroke={C.text} strokeWidth="2" />
          <circle cx="700" cy="230" r="5" fill={C.text} />
          <text x="678" y="305" fontSize="12" fontWeight="900" fill={C.textMuted} letterSpacing="2">
            YOUR TARGET
          </text>
        </svg>

        {/* LIZA logo lockup */}
        <div style={{
          position: "absolute", bottom: -10, left: 0, right: 0,
          display: "flex", justifyContent: "center",
          opacity: logoIn, transform: `translateY(${(1 - logoIn) * 12}px)`,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "12px 22px", background: C.card,
            border: `1.5px solid ${C.border}`, borderRadius: 999,
            boxShadow: "0 18px 40px -18px rgba(11,18,32,0.20)",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.primary}, #0E6FA3)`,
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 14,
            }}>LIZA</div>
            <span style={{ fontSize: 18, fontWeight: 900, color: C.text }}>lizaos.ai</span>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
