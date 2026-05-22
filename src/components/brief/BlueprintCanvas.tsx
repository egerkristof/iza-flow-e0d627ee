import { motion, AnimatePresence } from "framer-motion";
import { DOMAINS, type DomainId, type Scale, type UnitShape } from "@/lib/brief-framework";

type Tier = 0 | 1 | 2 | 3;

export type BlueprintState = {
  function_label?: string;
  unit_shape?: UnitShape;
  scale?: Scale;
  seatPlaced: boolean;
  // Per-domain tier (substrate tier is the maturity tell). undefined = not yet placed.
  pillarTiers: Partial<Record<DomainId, Tier>>;
  activeDomain?: DomainId | null;
  showBeams: boolean;
  keystoneDomain?: DomainId | null;
};

const DOMAIN_ORDER: DomainId[] = ["demand", "capacity", "quality", "economics"];

const tierColor = (t?: Tier) => {
  if (t === undefined) return "hsl(220 10% 70% / 0.25)";
  if (t === 0) return "hsl(0 70% 55%)";
  if (t === 1) return "hsl(35 90% 55%)";
  if (t === 2) return "hsl(190 80% 55%)";
  return "hsl(150 70% 50%)";
};

const tierGlow = (t?: Tier) => {
  if (t === undefined || t === 0) return "0";
  if (t === 1) return "0.25";
  if (t === 2) return "0.55";
  return "0.85";
};

// Pillar geometry: four pillars on corners of the slab
const PILLAR_POS: Record<DomainId, { x: number; baseY: number; topY: (h: number) => number }> = {
  demand:    { x: 130, baseY: 360, topY: (h) => 360 - h },
  capacity:  { x: 300, baseY: 360, topY: (h) => 360 - h },
  quality:   { x: 470, baseY: 360, topY: (h) => 360 - h },
  economics: { x: 640, baseY: 360, topY: (h) => 360 - h },
};

const pillarHeight = (t?: Tier) => {
  if (t === undefined) return 0;
  // Tier 0..3 maps to 70..230 px
  return 70 + t * 55;
};

const PILLAR_W = 70;

export function BlueprintCanvas({ state }: { state: BlueprintState }) {
  const { seatPlaced, pillarTiers, activeDomain, showBeams, keystoneDomain, function_label, unit_shape, scale } = state;

  // Top points for beams
  const topPoints: Record<DomainId, { x: number; y: number } | null> = DOMAIN_ORDER.reduce((acc, d) => {
    const t = pillarTiers[d];
    if (t === undefined) { acc[d] = null; return acc; }
    const h = pillarHeight(t);
    acc[d] = { x: PILLAR_POS[d].x, y: PILLAR_POS[d].topY(h) };
    return acc;
  }, {} as Record<DomainId, { x: number; y: number } | null>);

  // Weak beams: where either endpoint is tier <=1
  const isWeak = (a: DomainId, b: DomainId) =>
    (pillarTiers[a] ?? 0) <= 1 || (pillarTiers[b] ?? 0) <= 1;

  return (
    <div className="relative w-full h-full min-h-[420px] bg-[hsl(220_15%_8%)] rounded-2xl border border-border/40 overflow-hidden">
      {/* Header band */}
      <div className="absolute top-0 left-0 right-0 z-10 px-5 py-3 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/50 border-b border-white/10 bg-black/20 backdrop-blur">
        <span>Operating Architecture</span>
        <span className="tabular-nums">
          {function_label ? function_label.split("/")[0].trim() : "Awaiting seat"}
          {scale && <span className="ml-2 opacity-60">{scale}</span>}
        </span>
      </div>

      <svg viewBox="0 0 770 430" className="w-full h-full block" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Blueprint grid */}
          <pattern id="blueprint-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="hsl(200 60% 70% / 0.08)" strokeWidth="1" />
          </pattern>
          <pattern id="blueprint-grid-major" width="160" height="160" patternUnits="userSpaceOnUse">
            <path d="M 160 0 L 0 0 0 160" fill="none" stroke="hsl(200 60% 70% / 0.14)" strokeWidth="1" />
          </pattern>

          {/* Pillar gradient */}
          {DOMAIN_ORDER.map((d) => {
            const c = tierColor(pillarTiers[d]);
            return (
              <linearGradient key={d} id={`pillar-${d}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity="0.95" />
                <stop offset="100%" stopColor={c} stopOpacity="0.35" />
              </linearGradient>
            );
          })}

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="770" height="430" fill="url(#blueprint-grid)" />
        <rect width="770" height="430" fill="url(#blueprint-grid-major)" />

        {/* Foundation slab */}
        <AnimatePresence>
          {seatPlaced && (
            <motion.g
              key="slab"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Slab top (perspective trapezoid) */}
              <polygon
                points="60,360 720,360 690,395 90,395"
                fill="hsl(220 20% 14%)"
                stroke="hsl(200 60% 70% / 0.5)"
                strokeWidth="1"
              />
              <polygon
                points="60,360 720,360 700,378 80,378"
                fill="hsl(220 30% 18%)"
                stroke="hsl(200 60% 70% / 0.3)"
                strokeWidth="0.5"
              />
              {/* Foundation label */}
              <text x="385" y="418" textAnchor="middle" fontSize="9" fill="hsl(200 60% 80% / 0.7)" letterSpacing="2" fontFamily="ui-monospace, monospace">
                FOUNDATION · {unit_shape ? unit_shape.replace("_", " ").toUpperCase() : "UNIT"}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Beams (connect tops of placed pillars) */}
        <AnimatePresence>
          {showBeams && DOMAIN_ORDER.map((d, i) => {
            const next = DOMAIN_ORDER[i + 1];
            if (!next) return null;
            const a = topPoints[d];
            const b = topPoints[next];
            if (!a || !b) return null;
            const weak = isWeak(d, next);
            return (
              <motion.line
                key={`beam-${d}-${next}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={weak ? "hsl(0 70% 55%)" : "hsl(150 70% 55%)"}
                strokeWidth={weak ? 1.5 : 2.5}
                strokeDasharray={weak ? "4 4" : "0"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: weak ? 0.7 : 0.9 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              >
                {weak && (
                  <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.6s" repeatCount="indefinite" />
                )}
              </motion.line>
            );
          })}
        </AnimatePresence>

        {/* Pillars */}
        {DOMAIN_ORDER.map((d) => {
          const t = pillarTiers[d];
          if (t === undefined) {
            // Ghost outline showing where the pillar will land
            const pos = PILLAR_POS[d];
            const isActive = activeDomain === d;
            return (
              <g key={`ghost-${d}`}>
                <rect
                  x={pos.x - PILLAR_W / 2}
                  y={pos.baseY - 70}
                  width={PILLAR_W}
                  height={70}
                  fill="none"
                  stroke={isActive ? "hsl(200 80% 70%)" : "hsl(200 60% 70% / 0.2)"}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                >
                  {isActive && (
                    <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />
                  )}
                </rect>
                <text x={pos.x} y={pos.baseY + 18} textAnchor="middle" fontSize="9" fill="hsl(200 60% 75% / 0.55)" letterSpacing="1.5" fontFamily="ui-monospace, monospace">
                  {DOMAINS.find((x) => x.id === d)?.label.toUpperCase()}
                </text>
              </g>
            );
          }

          const h = pillarHeight(t);
          const pos = PILLAR_POS[d];
          const color = tierColor(t);
          const glow = tierGlow(t);
          const isKeystone = keystoneDomain === d;

          return (
            <motion.g
              key={`pillar-${d}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              filter={Number(glow) > 0 ? "url(#glow)" : undefined}
            >
              {/* Pillar shaft, grows up from base */}
              <motion.rect
                x={pos.x - PILLAR_W / 2}
                y={pos.baseY - h}
                width={PILLAR_W}
                height={h}
                fill={`url(#pillar-${d})`}
                stroke={color}
                strokeWidth="1"
                initial={{ height: 0, y: pos.baseY }}
                animate={{ height: h, y: pos.baseY - h }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ opacity: 0.3 + Number(glow) * 0.7 }}
              />
              {/* Top cap */}
              <motion.rect
                x={pos.x - PILLAR_W / 2 - 4}
                y={pos.baseY - h - 4}
                width={PILLAR_W + 8}
                height={4}
                fill={color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              />
              {/* Tier ticks on side */}
              {[1, 2, 3].map((tk) => (
                tk <= t && (
                  <motion.line
                    key={tk}
                    x1={pos.x + PILLAR_W / 2 + 2}
                    y1={pos.baseY - tk * 55}
                    x2={pos.x + PILLAR_W / 2 + 10}
                    y2={pos.baseY - tk * 55}
                    stroke={color}
                    strokeWidth="1.5"
                    initial={{ opacity: 0, x1: pos.x + PILLAR_W / 2 }}
                    animate={{ opacity: 1, x1: pos.x + PILLAR_W / 2 + 2 }}
                    transition={{ duration: 0.3, delay: 0.8 + tk * 0.1 }}
                  />
                )
              ))}
              {/* Domain label */}
              <text x={pos.x} y={pos.baseY + 18} textAnchor="middle" fontSize="9" fill="hsl(200 70% 85%)" letterSpacing="1.5" fontFamily="ui-monospace, monospace">
                {DOMAINS.find((x) => x.id === d)?.label.toUpperCase()}
              </text>
              {/* Tier readout above cap */}
              <text x={pos.x} y={pos.baseY - h - 12} textAnchor="middle" fontSize="10" fill={color} fontFamily="ui-monospace, monospace" fontWeight="600">
                T{t}
              </text>

              {/* Keystone capstone */}
              {isKeystone && (
                <motion.g
                  initial={{ opacity: 0, y: -60, scale: 0.4 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
                >
                  <polygon
                    points={`${pos.x},${pos.baseY - h - 30} ${pos.x + 22},${pos.baseY - h - 12} ${pos.x},${pos.baseY - h - 4} ${pos.x - 22},${pos.baseY - h - 12}`}
                    fill="hsl(45 95% 60%)"
                    stroke="hsl(45 95% 75%)"
                    strokeWidth="1.5"
                    filter="url(#glow)"
                  />
                  <text x={pos.x} y={pos.baseY - h - 38} textAnchor="middle" fontSize="9" fill="hsl(45 95% 75%)" letterSpacing="2" fontFamily="ui-monospace, monospace">
                    KEYSTONE
                  </text>
                </motion.g>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-white/40 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: tierColor(0) }} />T0 Tacit</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: tierColor(1) }} />T1 Recorded</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: tierColor(2) }} />T2 Standard</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: tierColor(3) }} />T3 Executable</span>
        </div>
        <span>{Object.keys(pillarTiers).length}/4 pillars</span>
      </div>
    </div>
  );
}