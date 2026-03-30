const METRICS = [
  { value: "15+", label: "Clients (select named, others anonymous)" },
  { value: "8", label: "Countries" },
  { value: "15+", label: "Years combined methodology" },
  { value: "15+", label: "Teams in Beta" },
];

export function MetricsStrip() {
  return (
    <section className="py-10 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black brand-gradient-text mb-1">{m.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
