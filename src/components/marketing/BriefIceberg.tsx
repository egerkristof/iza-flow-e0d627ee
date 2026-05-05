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
    const t = arr.length === 1 ? 0.5 : i / (arr.length - 1);
    // Spread points along the right ridge of the jagged tip
    return { x: 430 + t * 22, y: 188 - t * 70 };
  });

  // Mass anchor points (left side of the underwater mass)
  const massAnchors = below.slice(0, 4).map((_, i, arr) => {
    const t = arr.length === 1 ? 0.5 : i / (arr.length - 1);
    // Walk down the left flank of the tapering underwater keel
    return { x: 360 - t * 90, y: 240 + t * 250 };
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
          points="330,200 360,170 388,150 405,118 422,92 438,118 452,140 470,165 490,182 510,200"
          fill="url(#bi-tip)"
          stroke={`hsl(${C} / 0.9)`}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Tip facets for crystalline depth */}
        <path
          d="M 422 92 L 405 200 M 422 92 L 470 165 M 388 150 L 452 200"
          fill="none"
          stroke={`hsl(${C} / 0.5)`}
          strokeWidth="1"
        />

        {/* Iceberg — submerged keel. Wide at the waterline, tapering to a craggy point. */}
        <motion.polygon
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          points="330,200 510,200 590,222 640,260 660,310 640,365 600,420 540,460 470,485 420,505 395,520 370,505 345,475 290,445 235,400 195,350 175,295 185,250 240,218"
          fill="url(#bi-mass)"
          stroke={`hsl(${C} / 0.7)`}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Keel facet lines — angular, crystalline */}
        <path
          d="M 240 218 L 320 310 L 370 505"
          fill="none"
          stroke={`hsl(${C} / 0.35)`}
          strokeWidth="1"
        />
        <path
          d="M 590 222 L 500 320 L 540 460"
          fill="none"
          stroke={`hsl(${C} / 0.35)`}
          strokeWidth="1"
        />
        <path
          d="M 420 200 L 430 380 L 395 520"
          fill="none"
          stroke={`hsl(${C} / 0.28)`}
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
