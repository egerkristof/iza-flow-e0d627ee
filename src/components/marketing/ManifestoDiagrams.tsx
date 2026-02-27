/**
 * Visual diagrams for the Manifesto page:
 * 1. Knowledge Creation Paradox (unified vision ↔ diverse paths)
 * 2. SECI Flywheel (Nonaka's 4-quadrant cycle)
 */

export function KnowledgeParadoxDiagram() {
  return (
    <div className="my-12 max-w-md mx-auto">
      {/* Top box */}
      <div
        className="rounded-xl border p-5 text-center"
        style={{
          borderColor: "hsl(var(--primary) / 0.3)",
          background: "hsl(var(--primary) / 0.04)",
        }}
      >
        <p className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: "hsl(var(--primary))" }}>
          Unified Vision
        </p>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          Values · North Star · Shared conviction
        </p>
      </div>

      {/* Connector + friction zone */}
      <div className="flex flex-col items-center py-2">
        <div className="w-px h-4" style={{ background: "hsl(var(--primary) / 0.25)" }} />
        <div
          className="rounded-lg px-5 py-3 text-center border"
          style={{
            background: "var(--gradient-brand-btn)",
            borderColor: "transparent",
          }}
        >
          <p className="text-xs font-bold tracking-[0.12em] uppercase" style={{ color: "hsl(var(--primary-foreground))" }}>
            Friction Zone
          </p>
          <p className="text-xs mt-0.5" style={{ color: "hsl(var(--primary-foreground) / 0.8)" }}>
            Where tacit knowledge is created &amp; exchanged
          </p>
        </div>
        <div className="w-px h-4" style={{ background: "hsl(var(--primary) / 0.25)" }} />
      </div>

      {/* Bottom box */}
      <div
        className="rounded-xl border p-5 text-center"
        style={{
          borderColor: "hsl(var(--primary) / 0.3)",
          background: "hsl(var(--primary) / 0.04)",
        }}
      >
        <p className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: "hsl(var(--primary))" }}>
          Diverse Paths
        </p>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          Scenarios · Experiments · Sounding boards
        </p>
      </div>
    </div>
  );
}

export function SECIFlywheelDiagram() {
  const quadrants = [
    { label: "Socialisation", sub: "Tacit → Tacit", desc: "Sharing through experience" },
    { label: "Externalisation", sub: "Tacit → Explicit", desc: "Articulating the unspoken" },
    { label: "Combination", sub: "Explicit → Explicit", desc: "Creating new forms" },
    { label: "Internalisation", sub: "Explicit → Tacit", desc: "Learning by doing" },
  ];

  return (
    <div className="my-12 max-w-sm mx-auto">
      <div className="grid grid-cols-2 gap-px rounded-xl overflow-hidden border" style={{ borderColor: "hsl(var(--primary) / 0.2)" }}>
        {quadrants.map((q, i) => (
          <div
            key={q.label}
            className="p-4 text-center"
            style={{ background: i % 2 === 0 ? "hsl(var(--primary) / 0.04)" : "hsl(var(--primary) / 0.08)" }}
          >
            <p className="text-xs font-bold tracking-[0.1em] uppercase" style={{ color: "hsl(var(--primary))" }}>
              {q.label}
            </p>
            <p className="text-[11px] font-medium mt-1" style={{ color: "hsl(var(--foreground))" }}>
              {q.sub}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
              {q.desc}
            </p>
          </div>
        ))}
      </div>
      {/* Flywheel arrow hint */}
      <p className="text-center text-xs mt-3 font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
        ↻ The loop compounds with every cycle
      </p>
    </div>
  );
}
