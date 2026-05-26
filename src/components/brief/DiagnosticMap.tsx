import { motion } from "framer-motion";
import {
  STREAMS,
  AUDITS,
  BUNDLE_TYPES,
  type StreamId,
  type StreamStatus,
  type AuditId,
  type AuditStatus,
  type BundleStatus,
  type BundleTypeId,
} from "@/lib/operator-framework";

// Exec-register relabels for the audit ring. Keeps the engine intact while
// surfacing language a Head of AI Strategy can hand to a CFO or board.
const AUDIT_EXEC_LABEL: Record<AuditId, string> = {
  cost: "Throughput",
  best_practice: "Trust",
  security: "Exposure",
  decision: "Auditability",
  drift: "Defensibility",
};

// ─── DiagnosticMap ───────────────────────────────────────────────────────────
// One persistent visual that travels with the user from the first question
// through the verdict. Renders the LIZA operator framework as a single picture:
//
//   - Four stream arms (Strategy / Market / State / Signal) reaching into the
//     center. Color and dashing encode lit / partial / dark.
//   - A surrounding ring of 5 audit walls (Cost / Best practice / Security /
//     Decision / Drift). Color encodes green / amber / red.
//   - An inner ring of 6 bundle dots (Playbook / Procedure / Directive /
//     Principle / Preference / Knowledge). Filled / hollow / empty.
//   - A center "moment of work" pill.
//
// The same component renders the empty skeleton, the live-extraction state,
// the user-confirmed state, and the final annotated debrief. The picture is
// the diagnosis.

export type StreamMap = Partial<Record<StreamId, StreamStatus>>;
export type AuditMap = Partial<Record<AuditId, AuditStatus>>;
export type BundleMap = Partial<Record<BundleTypeId, BundleStatus>>;

const STREAM_COLOR: Record<StreamStatus, string> = {
  lit: "155 72% 46%",
  partial: "38 92% 50%",
  dark: "0 70% 55%",
};

const AUDIT_COLOR: Record<AuditStatus, string> = {
  green: "155 72% 46%",
  amber: "38 92% 50%",
  red: "0 70% 55%",
};

const BUNDLE_FILL: Record<BundleStatus, number> = {
  have: 1,
  partial: 0.5,
  missing: 0,
};

// Position of each stream on the compass (in degrees, 0 = top, clockwise)
const STREAM_ANGLE: Record<StreamId, number> = {
  strategy: 0, // top
  state: 90, // right
  signal: 180, // bottom
  market: 270, // left
};

// Convert polar (degrees from top, clockwise) to cartesian within viewBox
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Build an SVG arc path between two angles at radius r
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

export function DiagnosticMap({
  streams,
  audits,
  bundle,
  caption,
  highlightStream,
  compact = false,
}: {
  streams?: StreamMap;
  audits?: AuditMap;
  bundle?: BundleMap;
  caption?: string; // verdict text rendered under the center pill
  highlightStream?: StreamId; // pulse arrow on this arm (used to point at the move)
  compact?: boolean; // smaller font sizes for sticky placement
}) {
  const s = streams ?? {};
  const a = audits ?? {};
  const b = bundle ?? {};

  // viewBox 0..520 with center at 260,260
  const CX = 260;
  const CY = 260;
  const STREAM_R = 200; // where stream label sits
  const STREAM_INNER_R = 70; // where arm meets center pill
  const AUDIT_R = 235; // audit wall ring
  const BUNDLE_R = 100; // bundle dot ring (between center and stream arms)

  // Audit walls: 5 equal arcs around the ring with small gaps
  const auditCount = AUDITS.length;
  const arcLen = 360 / auditCount;
  const gap = 6; // degrees of empty space between walls

  return (
    <div className="w-full">
      <div
        className="relative w-full rounded-2xl border overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at center, hsl(var(--card)) 0%, hsl(var(--background)) 100%)",
          borderColor: "hsl(var(--border))",
          aspectRatio: "1 / 1",
        }}
      >
        {/* Subtle grid backdrop */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <svg viewBox="0 0 520 520" className="absolute inset-0 w-full h-full">
          {/* ── Audit wall ring (outer) ── */}
          {AUDITS.map((audit, i) => {
            const startDeg = i * arcLen + gap / 2;
            const endDeg = (i + 1) * arcLen - gap / 2;
            const status = a[audit.id];
            const color = status ? AUDIT_COLOR[status] : "var(--border)";
            const isResolved = !!status;
            // Label position at arc midpoint
            const midDeg = (startDeg + endDeg) / 2;
            const labelPos = polar(CX, CY, AUDIT_R + 18, midDeg);
            return (
              <g key={audit.id}>
                <motion.path
                  d={arcPath(CX, CY, AUDIT_R, startDeg, endDeg)}
                  fill="none"
                  stroke={`hsl(${color})`}
                  strokeWidth={isResolved ? 6 : 2}
                  strokeLinecap="round"
                  opacity={isResolved ? 0.85 : 0.3}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.08 }}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: compact ? 9 : 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fill: isResolved
                      ? `hsl(${color})`
                      : "hsl(var(--muted-foreground))",
                  }}
                >
                  {AUDIT_EXEC_LABEL[audit.id]}
                </text>
              </g>
            );
          })}

          {/* ── Stream arms ── */}
          {STREAMS.map((stream) => {
            const angle = STREAM_ANGLE[stream.id];
            const status = s[stream.id];
            const color = status ? STREAM_COLOR[status] : "var(--border)";
            const isResolved = !!status;
            const outer = polar(CX, CY, STREAM_R, angle);
            const inner = polar(CX, CY, STREAM_INNER_R, angle);
            const labelPos = polar(CX, CY, STREAM_R, angle);
            const isHighlight = highlightStream === stream.id;
            return (
              <g key={stream.id}>
                <motion.line
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={`hsl(${color})`}
                  strokeWidth={isHighlight ? 5 : isResolved ? 3 : 1.5}
                  strokeLinecap="round"
                  strokeDasharray={
                    status === "dark" ? "4 5" : status === "partial" ? "8 4" : "0"
                  }
                  opacity={isResolved ? 0.85 : 0.35}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                {/* Arm endpoint dot */}
                <motion.circle
                  cx={outer.x}
                  cy={outer.y}
                  r={isHighlight ? 9 : 6}
                  fill={`hsl(${color})`}
                  opacity={isResolved ? 1 : 0.4}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
                {isHighlight && (
                  <motion.circle
                    cx={outer.x}
                    cy={outer.y}
                    r={14}
                    fill="none"
                    stroke={`hsl(${color})`}
                    strokeWidth={2}
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <text
                  x={labelPos.x}
                  y={
                    angle === 0
                      ? labelPos.y - 18
                      : angle === 180
                      ? labelPos.y + 22
                      : labelPos.y - 14
                  }
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: compact ? 11 : 12,
                    fontWeight: 800,
                    fill: isResolved
                      ? `hsl(${color})`
                      : "hsl(var(--muted-foreground))",
                  }}
                >
                  {stream.label}
                </text>
              </g>
            );
          })}

          {/* ── Bundle dot ring (inner) ── */}
          {BUNDLE_TYPES.map((bt, i) => {
            const deg = (360 / BUNDLE_TYPES.length) * i - 90;
            const pos = polar(CX, CY, BUNDLE_R, deg);
            const status = b[bt.id];
            const fill =
              status === "have"
                ? "hsl(var(--primary))"
                : status === "partial"
                ? "hsl(var(--primary) / 0.4)"
                : "transparent";
            const stroke =
              status === "have"
                ? "hsl(var(--primary))"
                : status === "partial"
                ? "hsl(var(--primary))"
                : "hsl(var(--border))";
            return (
              <motion.circle
                key={bt.id}
                cx={pos.x}
                cy={pos.y}
                r={5}
                fill={fill}
                stroke={stroke}
                strokeWidth={1.5}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
              >
                <title>
                  {bt.label}
                  {status ? `: ${status}` : ""}
                </title>
              </motion.circle>
            );
          })}

          {/* ── Center pill ── */}
          <g>
            <rect
              x={CX - 60}
              y={CY - 22}
              width={120}
              height={44}
              rx={10}
              fill="hsl(var(--background))"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
            <text
              x={CX}
              y={CY - 4}
              textAnchor="middle"
              style={{
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fill: "hsl(var(--primary))",
              }}
            >
              Moment of work
            </text>
            <text
              x={CX}
              y={CY + 12}
              textAnchor="middle"
              style={{
                fontSize: 11,
                fontWeight: 800,
                fill: "hsl(var(--foreground))",
              }}
            >
              Decision container
            </text>
          </g>
        </svg>
      </div>

      {/* Caption: the verdict, rendered as a single line under the map */}
      {caption && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-center text-sm md:text-base font-bold leading-snug max-w-[44ch] mx-auto"
        >
          {caption}
        </motion.p>
      )}
    </div>
  );
}

// Convenience: convert the diagnosis's stream_coverage / audit_coverage /
// bundle_gaps shapes into the simpler maps the visual consumes.
export function streamMapFromCoverage(
  coverage: Record<StreamId, { status: StreamStatus }>,
): StreamMap {
  return (Object.keys(coverage) as StreamId[]).reduce<StreamMap>((acc, k) => {
    acc[k] = coverage[k]?.status;
    return acc;
  }, {});
}

export function auditMapFromCoverage(
  coverage: Record<AuditId, { status: AuditStatus }>,
): AuditMap {
  return (Object.keys(coverage) as AuditId[]).reduce<AuditMap>((acc, k) => {
    acc[k] = coverage[k]?.status;
    return acc;
  }, {});
}

export function bundleMapFromGaps(
  gaps: { type: BundleTypeId; status: BundleStatus }[],
): BundleMap {
  return gaps.reduce<BundleMap>((acc, g) => {
    acc[g.type] = g.status;
    return acc;
  }, {});
}

// Pick the weakest stream (first dark, else first partial) to highlight as the
// move target. Returns null if nothing is dark/partial.
export function pickHighlightStream(streams: StreamMap): StreamId | undefined {
  const order: StreamId[] = ["strategy", "market", "state", "signal"];
  const dark = order.find((s) => streams[s] === "dark");
  if (dark) return dark;
  const partial = order.find((s) => streams[s] === "partial");
  return partial;
}