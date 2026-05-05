import { motion } from "framer-motion";

type Props = {
  /** Primary brand color (HSL triplet, e.g. "200 75% 36%"). Drives the whole illustration. */
  teal?: string;
  /** Backward-compat aliases. If provided, teal wins. */
  topColor?: string;
  bottomColor?: string;
  above: string[];
  below: string[];
  aboveLabel?: string;
  belowLabel?: string;
};

/**
 * Annotated iceberg used on /pharma-brief, /space-brief, /satcom-brief.
 *
 * Single monochrome illustration. One color family, one numeric anchor,
 * labels live ON the diagram via thin connector lines. The visual carries
 * the argument; no chip rows or duplicate bullet lists fighting the SVG.
 *
 * Reads cleanly from 360px to desktop because labels are part of the
 * composition rather than separate sections beneath it.
 */
export default function BriefIceberg({
  teal,
  topColor,
  bottomColor,
  above,
  below,
  aboveLabel = "What AI sees today",
  belowLabel = "What actually runs the work",
}: Props) {
  const C = teal ?? topColor ?? bottomColor ?? "200 75% 36%";

  // Layout constants (viewBox 800 x 560)
  // Sky 0..200, water 200..560 with subtle gradient.
  // Iceberg tip pokes ~80px above waterline; mass extends most of the canvas below.
  const W = 800;
  const H = 560;
  const WATER_Y = 200;

  // Tip anchor points (on the iceberg silhouette)
  const tipAnchors = above.slice(0, 4).map((_, i, arr) => {
    // Spread points along the upper facet of the tip, right side
    const t = arr.length === 1 ? 0.5 : i / (arr.length - 1);
    return { x: 410 + t * 18, y: 195 - t * 60 };
  });

  // Mass anchor points (left side of the underwater mass)
  const massAnchors = below.slice(0, 4).map((_, i, arr) => {
    const t = arr.length === 1 ? 0.5 : i / (arr.length - 1);
    return { x: 380 - t * 60, y: 250 + t * 230 };
  });

  return (
    <figure className="relative w-full rounded-2xl border border-border overflow-hidden bg-white">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="block w-full h-auto"
        role="img"
        aria-label="Iceberg: what AI sees above the waterline, what actually runs the work below."
      >
        <defs>
          <linearGradient id="bi-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`hsl(${C} / 0.04)`} />
            <stop offset="100%" stopColor={`hsl(${C} / 0.14)`} />
          </linearGradient>
          <linearGradient id="bi-tip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`hsl(${C} / 0.55)`} />
            <stop offset="100%" stopColor={`hsl(${C} / 0.78)`} />
          </linearGradient>
          <linearGradient id="bi-mass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`hsl(${C} / 0.32)`} />
            <stop offset="100%" stopColor={`hsl(${C} / 0.55)`} />
          </linearGradient>
        </defs>

        {/* Water band */}
        <rect x="0" y={WATER_Y} width={W} height={H - WATER_Y} fill="url(#bi-water)" />

        {/* Waterline */}
        <line
          x1="0"
          y1={WATER_Y}
          x2={W}
          y2={WATER_Y}
          stroke={`hsl(${C} / 0.5)`}
          strokeWidth="1.25"
        />
        {/* Faint ripple ticks */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1={i * 36 + 6}
            y1={WATER_Y + 8}
            x2={i * 36 + 22}
            y2={WATER_Y + 8}
            stroke={`hsl(${C} / 0.18)`}
            strokeWidth="1"
          />
        ))}

        {/* Iceberg — tip (above waterline). Organic asymmetric polygon. */}
        <motion.polygon
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          points="360,200 392,138 415,118 432,135 425,170 440,200"
          fill="url(#bi-tip)"
          stroke={`hsl(${C} / 0.9)`}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Tip facet line for depth */}
        <line
          x1="392"
          y1="138"
          x2="425"
          y2="170"
          stroke={`hsl(${C} / 0.55)`}
          strokeWidth="1"
        />

        {/* Iceberg — mass (below waterline). Wide, organic, asymmetric. */}
        <motion.polygon
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          points="360,200 440,200 510,235 545,295 540,370 495,440 410,485 320,490 235,460 175,395 165,320 195,255 270,215"
          fill="url(#bi-mass)"
          stroke={`hsl(${C} / 0.7)`}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Mass facet lines */}
        <path
          d="M 270 215 L 320 320 L 235 460"
          fill="none"
          stroke={`hsl(${C} / 0.35)`}
          strokeWidth="1"
        />
        <path
          d="M 510 235 L 430 340 L 495 440"
          fill="none"
          stroke={`hsl(${C} / 0.35)`}
          strokeWidth="1"
        />

        {/* === Above-water annotations (right side) === */}
        <g>
          <text
            x={W - 24}
            y="36"
            textAnchor="end"
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 2.4,
              fill: `hsl(${C})`,
            }}
          >
            ABOVE THE WATERLINE
          </text>
          <text
            x={W - 24}
            y="54"
            textAnchor="end"
            style={{
              fontSize: 11,
              fontWeight: 600,
              fill: `hsl(${C} / 0.65)`,
            }}
          >
            {aboveLabel}
          </text>

          {above.slice(0, 4).map((label, i, arr) => {
            const yStart = 80;
            const gap = 26;
            const ly = yStart + i * gap;
            const anchor = tipAnchors[i] ?? tipAnchors[tipAnchors.length - 1];
            const labelX = W - 24;
            // Connector: short horizontal from text, then diagonal to anchor
            const elbowX = 540;
            return (
              <motion.g
                key={label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.08 }}
              >
                <polyline
                  points={`${anchor.x},${anchor.y} ${elbowX},${ly} ${labelX - 8},${ly}`}
                  fill="none"
                  stroke={`hsl(${C} / 0.4)`}
                  strokeWidth="1"
                />
                <circle cx={anchor.x} cy={anchor.y} r="2.5" fill={`hsl(${C})`} />
                <text
                  x={labelX}
                  y={ly + 4}
                  textAnchor="end"
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    fill: `hsl(${C})`,
                  }}
                >
                  {label}
                </text>
              </motion.g>
            );
          })}
        </g>

        {/* === Below-water annotations (left side) === */}
        <g>
          <text
            x="24"
            y={WATER_Y + 30}
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 2.4,
              fill: `hsl(${C})`,
            }}
          >
            BELOW THE WATERLINE
          </text>
          <text
            x="24"
            y={WATER_Y + 48}
            style={{
              fontSize: 11,
              fontWeight: 600,
              fill: `hsl(${C} / 0.7)`,
            }}
          >
            {belowLabel}
          </text>

          {below.slice(0, 4).map((label, i, arr) => {
            const yStart = WATER_Y + 80;
            const gap = 38;
            const ly = yStart + i * gap;
            const anchor = massAnchors[i] ?? massAnchors[massAnchors.length - 1];
            const labelX = 24;
            const elbowX = 150;
            return (
              <motion.g
                key={label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <polyline
                  points={`${labelX + 8},${ly} ${elbowX},${ly} ${anchor.x},${anchor.y}`}
                  fill="none"
                  stroke={`hsl(${C} / 0.4)`}
                  strokeWidth="1"
                />
                <circle cx={anchor.x} cy={anchor.y} r="2.5" fill={`hsl(${C})`} />
                <text
                  x={labelX}
                  y={ly + 4}
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    fill: `hsl(${C})`,
                  }}
                >
                  {label}
                </text>
              </motion.g>
            );
          })}
        </g>

        {/* === Single numeric anchor: 90% in bottom-right whitespace === */}
        <g>
          <text
            x={W - 24}
            y={H - 70}
            textAnchor="end"
            style={{
              fontSize: 92,
              fontWeight: 900,
              letterSpacing: -2,
              fill: `hsl(${C})`,
              opacity: 0.95,
            }}
          >
            90%
          </text>
          <text
            x={W - 24}
            y={H - 38}
            textAnchor="end"
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.4,
              fill: `hsl(${C} / 0.75)`,
            }}
          >
            of the knowledge AI needs
          </text>
          <text
            x={W - 24}
            y={H - 22}
            textAnchor="end"
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.4,
              fill: `hsl(${C} / 0.75)`,
            }}
          >
            sits below the line.
          </text>
        </g>
      </svg>
    </figure>
  );
}
