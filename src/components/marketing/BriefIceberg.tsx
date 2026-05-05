import { motion } from "framer-motion";

type Props = {
  teal: string; // hsl triplet, e.g. "200 75% 36%"
  above: string[];
  below: string[];
  aboveLabel?: string;
  belowLabel?: string;
};

/**
 * Compact iceberg used on /pharma-brief, /space-brief, /satcom-brief.
 * Mirrors the deck's Slide 02 metaphor in a single, brief-sized visual:
 * what AI sees (above the waterline) vs. what actually runs the work
 * (below the waterline).
 */
export default function BriefIceberg({
  teal,
  above,
  below,
  aboveLabel = "What AI sees today",
  belowLabel = "What actually runs the work",
}: Props) {
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      {/* === ABOVE THE WATERLINE ============================================ */}
      <div className="px-5 sm:px-8 pt-5 sm:pt-7 pb-3 sm:pb-4">
        <p
          className="text-[10px] font-bold tracking-widest uppercase mb-3"
          style={{ color: `hsl(${teal})` }}
        >
          Above the waterline · {aboveLabel}
        </p>
        <ul className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
          {above.map((a) => (
            <li
              key={a}
              className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-md border"
              style={{
                color: `hsl(${teal})`,
                borderColor: `hsl(${teal} / 0.3)`,
                background: `hsl(${teal} / 0.05)`,
              }}
            >
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* === ICEBERG (full-width, tip above water, mass below) ============== */}
      <div
        className="relative w-full"
        style={{ background: `hsl(${teal} / 0.04)` }}
      >
        <svg
          viewBox="0 0 400 240"
          preserveAspectRatio="xMidYMid meet"
          className="block w-full h-auto"
          aria-hidden
        >
          <defs>
            <linearGradient id="brief-ice-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${teal} / 0.08)`} />
              <stop offset="100%" stopColor={`hsl(${teal} / 0.28)`} />
            </linearGradient>
            <linearGradient id="brief-ice-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${teal} / 0.22)`} />
              <stop offset="100%" stopColor={`hsl(${teal} / 0.40)`} />
            </linearGradient>
            <linearGradient id="brief-ice-bot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${teal} / 0.40)`} />
              <stop offset="100%" stopColor={`hsl(${teal} / 0.65)`} />
            </linearGradient>
          </defs>

          {/* Water */}
          <rect x="0" y="80" width="400" height="160" fill="url(#brief-ice-water)" />
          {/* Waterline */}
          <line
            x1="0"
            y1="80"
            x2="400"
            y2="80"
            stroke={`hsl(${teal} / 0.55)`}
            strokeWidth="1.2"
            strokeDasharray="5 5"
          />

          {/* Iceberg tip (above water) — pyramid */}
          <motion.polygon
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            points="160,80 200,18 240,80"
            fill="url(#brief-ice-top)"
            stroke={`hsl(${teal} / 0.75)`}
            strokeWidth="1.4"
          />
          {/* Iceberg mass (below water) — wide pyramid */}
          <motion.polygon
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            points="160,80 40,232 360,232 240,80"
            fill="url(#brief-ice-bot)"
            stroke={`hsl(${teal} / 0.6)`}
            strokeWidth="1.4"
          />

          {/* Percentage labels */}
          <text
            x="200"
            y="12"
            textAnchor="middle"
            style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, fill: `hsl(${teal})` }}
          >
            ~10%
          </text>
          <text
            x="200"
            y="170"
            textAnchor="middle"
            style={{ fontSize: 22, fontWeight: 900, letterSpacing: 2, fill: `hsl(${teal})` }}
          >
            ~90%
          </text>
        </svg>
      </div>

      {/* === BELOW THE WATERLINE =========================================== */}
      <div className="px-5 sm:px-8 pt-4 sm:pt-5 pb-5 sm:pb-7 bg-muted/30 border-t border-border">
        <p className="text-[10px] font-bold tracking-widest uppercase mb-3 text-muted-foreground">
          Below the waterline · {belowLabel}
        </p>
        <ul className="space-y-2">
          {below.map((b) => (
            <li key={b} className="flex gap-2 text-xs sm:text-sm text-foreground/90 leading-snug">
              <span
                className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ background: `hsl(${teal})` }}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}