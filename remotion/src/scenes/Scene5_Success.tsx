import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { Beat } from "../components/Beat";
import { C } from "../theme";

/* S5 · SUCCESS (14s / 420f)
   Beat A: concrete metrics tick up.
   Beat B: trajectory + LIZA lockup. */
export const Scene5_Success: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tick = (start: number, end: number, target: number) =>
    Math.round(interpolate(frame, [start, end], [0, target], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  const grow = interpolate(frame, [200, 360], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drift = interpolate(frame, [200, 380], [0, 26], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoIn = spring({ frame: frame - 320, fps, config: { damping: 18, stiffness: 110 } });

  const metrics = [
    { label: "Time to approval", value: `−${tick(20, 160, 82)}%`, color: C.green },
    { label: "Junior errors", value: `${tick(40, 170, 0)}`, color: C.green, suffix: " / week" },
    { label: "Drift across teams", value: `${tick(60, 180, 0)}`, color: C.green },
  ];

  return (
    <SceneShell
      kicker="The outcome"
      headline="Same team. Right direction."
      caption="Your team becomes the benchmark, not the bottleneck."
      accent={C.green}
      durationInFrames={durationInFrames}
    >
      <div style={{ position: "relative", width: "100%", height: 460 }}>
        {/* Beat A — metrics */}
        <Beat from={10} hold={185}>
          <div style={{ width: 880 }}>
            <div style={{ display: "flex", gap: 18, justifyContent: "space-between" }}>
              {metrics.map((m, i) => (
                <div key={i} style={{
                  flex: 1, padding: "26px 22px",
                  background: C.card, border: `2px solid ${C.green}`, borderRadius: 14,
                  boxShadow: `0 22px 50px -22px ${C.green}55`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.18em", color: C.green, textTransform: "uppercase" }}>{m.label}</div>
                  <div style={{ fontSize: 64, fontWeight: 900, color: C.text, lineHeight: 1, marginTop: 8 }}>
                    {m.value}{m.suffix && <span style={{ fontSize: 20, color: C.textMuted, fontWeight: 700 }}>{m.suffix}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 22, textAlign: "center", fontSize: 16, fontWeight: 800, color: C.textMuted }}>
              First 30 days. Same team. With LIZA.
            </div>
          </div>
        </Beat>

        {/* Beat B — trajectory + lockup */}
        <Beat from={195} hold={225}>
          <div style={{ width: 880, position: "relative" }}>
            <svg viewBox="0 0 800 320" style={{ width: "100%", height: 320 }}>
              <line x1="60" y1="170" x2="740" y2="170" stroke={C.border} strokeWidth="2" strokeDasharray="6 8" />

              {/* RED */}
              <g transform={`rotate(${drift} 60 170)`}>
                <line x1="60" y1="170" x2={60 + 600 * grow} y2="170" stroke={C.red} strokeWidth="6" strokeLinecap="round" />
                <polygon points={`${60 + 600 * grow},160 ${60 + 600 * grow + 18},170 ${60 + 600 * grow},180`} fill={C.red} opacity={grow} />
              </g>
              <text x="60" y="140" fontSize="14" fontWeight="900" fill={C.red} letterSpacing="3">WITHOUT LIZA — drifts off-target</text>

              {/* GREEN */}
              <g>
                <line x1="60" y1="170" x2={60 + 600 * grow} y2="170" stroke={C.green} strokeWidth="6" strokeLinecap="round" />
                <polygon points={`${60 + 600 * grow},160 ${60 + 600 * grow + 18},170 ${60 + 600 * grow},180`} fill={C.green} opacity={grow} />
              </g>
              <text x="60" y="210" fontSize="14" fontWeight="900" fill={C.green} letterSpacing="3">WITH LIZA — stays on the standard</text>

              <circle cx="700" cy="170" r="14" fill="none" stroke={C.text} strokeWidth="2" />
              <circle cx="700" cy="170" r="5" fill={C.text} />
              <text x="668" y="245" fontSize="12" fontWeight="900" fill={C.textMuted} letterSpacing="2">YOUR TARGET</text>
            </svg>

            <div style={{
              position: "absolute", bottom: -40, left: 0, right: 0, display: "flex", justifyContent: "center",
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
        </Beat>
      </div>
    </SceneShell>
  );
};
