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
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr]">
        {/* SVG iceberg */}
        <div
          className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[260px]"
          style={{ background: `hsl(${teal} / 0.04)` }}
        >
          <svg
            viewBox="0 0 400 320"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              <linearGradient id="brief-ice-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`hsl(${teal} / 0.06)`} />
                <stop offset="100%" stopColor={`hsl(${teal} / 0.22)`} />
              </linearGradient>
              <linearGradient id="brief-ice-top" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`hsl(${teal} / 0.18)`} />
                <stop offset="100%" stopColor={`hsl(${teal} / 0.34)`} />
              </linearGradient>
              <linearGradient id="brief-ice-bot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`hsl(${teal} / 0.30)`} />
                <stop offset="100%" stopColor={`hsl(${teal} / 0.55)`} />
              </linearGradient>
            </defs>

            {/* Water */}
            <rect x="0" y="120" width="400" height="200" fill="url(#brief-ice-water)" />
            {/* Waterline */}
            <line
              x1="0"
              y1="120"
              x2="400"
              y2="120"
              stroke={`hsl(${teal} / 0.5)`}
              strokeWidth="1.2"
              strokeDasharray="5 5"
            />

            {/* Iceberg */}
            <motion.polygon
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              points="170,120 200,40 230,120"
              fill="url(#brief-ice-top)"
              stroke={`hsl(${teal} / 0.7)`}
              strokeWidth="1.2"
            />
            <motion.polygon
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              points="170,120 70,310 330,310 230,120"
              fill="url(#brief-ice-bot)"
              stroke={`hsl(${teal} / 0.55)`}
              strokeWidth="1.2"
            />

            {/* Tip / waterline percentages */}
            <text
              x="200"
              y="30"
              textAnchor="middle"
              style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, fill: `hsl(${teal})` }}
            >
              ~10%
            </text>
            <text
              x="200"
              y="240"
              textAnchor="middle"
              style={{ fontSize: 14, fontWeight: 900, letterSpacing: 2, fill: `hsl(${teal})` }}
            >
              ~90%
            </text>
          </svg>
        </div>

        {/* Labels */}
        <div className="grid grid-rows-2 divide-y divide-border">
          <div className="p-5 sm:p-6">
            <p
              className="text-[10px] font-bold tracking-widest uppercase mb-2"
              style={{ color: `hsl(${teal})` }}
            >
              Above the waterline · {aboveLabel}
            </p>
            <ul className="flex flex-wrap gap-1.5">
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
          <div className="p-5 sm:p-6 bg-muted/30">
            <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-muted-foreground">
              Below the waterline · {belowLabel}
            </p>
            <ul className="space-y-1.5">
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
      </div>
    </div>
  );
}