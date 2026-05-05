import { motion } from "framer-motion";

type Props = {
  /** Above-the-waterline color (formally defined). HSL triplet, e.g. "152 60% 36%" */
  topColor?: string;
  /** Below-the-waterline color (organizational intelligence). HSL triplet. */
  bottomColor?: string;
  /** Legacy prop: if provided, used for both top & bottom. Prefer topColor/bottomColor. */
  teal?: string;
  above: string[];
  below: string[];
  aboveLabel?: string;
  belowLabel?: string;
};

/**
 * Iceberg used on /pharma-brief, /space-brief, /satcom-brief.
 * Mirrors the deck's Slide 02 metaphor: a sharp green tip above water
 * (~10%, formally defined) and a vast warm mass below (~90%, organizational
 * intelligence). Two-color split makes the asymmetry instantly readable.
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
  // Defaults match the deck: GREEN above, WARM amber below.
  const TOP = topColor ?? teal ?? "152 55% 38%";
  const BOT = bottomColor ?? teal ?? "28 85% 52%";

  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-white">
      {/* === ABOVE: chips ============================================== */}
      <div className="px-5 sm:px-8 pt-5 sm:pt-7 pb-4">
        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3"
          style={{ color: `hsl(${TOP})` }}
        >
          ~10% · {aboveLabel}
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {above.map((a) => (
            <li
              key={a}
              className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md border"
              style={{
                color: `hsl(${TOP})`,
                borderColor: `hsl(${TOP} / 0.35)`,
                background: `hsl(${TOP} / 0.06)`,
              }}
            >
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* === ICEBERG SVG (full-width, scales to mobile) =================== */}
      <div
        className="relative w-full"
        style={{
          background: `linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 100%) 33%, hsl(${BOT} / 0.05) 33%, hsl(${BOT} / 0.18) 100%)`,
        }}
      >
        <svg
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid meet"
          className="block w-full h-auto"
          aria-hidden
        >
          <defs>
            <linearGradient id="bi-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${TOP} / 0.32)`} />
              <stop offset="100%" stopColor={`hsl(${TOP} / 0.55)`} />
            </linearGradient>
            <linearGradient id="bi-bot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${BOT} / 0.42)`} />
              <stop offset="100%" stopColor={`hsl(${BOT} / 0.72)`} />
            </linearGradient>
          </defs>

          {/* Waterline */}
          <line
            x1="0"
            y1="100"
            x2="400"
            y2="100"
            stroke={`hsl(${BOT} / 0.55)`}
            strokeWidth="1.2"
            strokeDasharray="6 6"
          />

          {/* Tip — sharp green pyramid above water */}
          <motion.polygon
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            points="170,100 200,28 230,100"
            fill="url(#bi-top)"
            stroke={`hsl(${TOP} / 0.85)`}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Mass — wide warm pyramid below water */}
          <motion.polygon
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            points="170,100 30,288 370,288 230,100"
            fill="url(#bi-bot)"
            stroke={`hsl(${BOT} / 0.7)`}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Big numeric anchor — only one, on the mass */}
          <text
            x="200"
            y="218"
            textAnchor="middle"
            style={{
              fontSize: 44,
              fontWeight: 900,
              letterSpacing: 3,
              fill: `hsl(${BOT})`,
              opacity: 0.92,
            }}
          >
            ~90%
          </text>
        </svg>
      </div>

      {/* === BELOW: bullets ============================================ */}
      <div
        className="px-5 sm:px-8 pt-4 sm:pt-5 pb-5 sm:pb-7 border-t"
        style={{
          background: `hsl(${BOT} / 0.04)`,
          borderColor: `hsl(${BOT} / 0.2)`,
        }}
      >
        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3"
          style={{ color: `hsl(${BOT})` }}
        >
          ~90% · {belowLabel}
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
          {below.map((b) => (
            <li
              key={b}
              className="flex gap-2 text-xs sm:text-sm font-medium text-foreground/90 leading-snug"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ background: `hsl(${BOT})` }}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
