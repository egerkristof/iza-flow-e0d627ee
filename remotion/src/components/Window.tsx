import React from "react";
import { C } from "../theme";

export const Window: React.FC<{
  label: string;
  accent?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: boolean;
}> = ({ label, accent = C.primary, children, style, glow }) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: glow
        ? `0 30px 80px -30px ${accent}55, 0 8px 24px -10px rgba(11,18,32,0.10)`
        : "0 12px 30px -16px rgba(11,18,32,0.18)",
      ...style,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 22px",
        borderBottom: `1px solid ${C.border}`,
        background: "#FAFBFC",
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: 999, background: "#E8B33A" }} />
      <span style={{ width: 10, height: 10, borderRadius: 999, background: "#3FBA63" }} />
      <span style={{ width: 10, height: 10, borderRadius: 999, background: "#D8DDE4" }} />
      <span
        style={{
          marginLeft: 10,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: accent,
        }}
      >
        {label}
      </span>
    </div>
    <div style={{ padding: 28 }}>{children}</div>
  </div>
);