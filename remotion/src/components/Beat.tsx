import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

/* A "beat" inside a scene: appears at `from`, holds, then fades for the next.
   Use `hold` for the steady duration in frames. Default fade = 12 frames. */
export const Beat: React.FC<{
  from: number;
  hold: number;
  fade?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ from, hold, fade = 12, children, style }) => {
  const frame = useCurrentFrame();
  const inOp  = interpolate(frame, [from, from + fade], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [from + hold - fade, from + hold], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(inOp, outOp);
  if (opacity <= 0.001) return null;
  const lift = interpolate(frame, [from, from + fade], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity, transform: `translateY(${lift}px)`, ...style }}>
      {children}
    </div>
  );
};
