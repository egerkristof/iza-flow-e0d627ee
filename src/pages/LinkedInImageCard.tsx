const DIMENSIONS = [
  { label: "Standard Internalization", score: 35.6, hint: "Do people actually know the standards?" },
  { label: "Output Consistency", score: 38.4, hint: "Does work look the same across the team?" },
  { label: "Collective Visibility", score: 39.8, hint: "Can leaders see what's really happening?" },
  { label: "Knowledge Compounding", score: 40.3, hint: "Does the team get smarter over time?" },
  { label: "Learning Velocity", score: 40.8, hint: "How fast do improvements spread?" },
];

const OVERALL = 39;

export default function LinkedInImageCard() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-8">
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          width: 1200,
          height: 627,
          background: "hsl(0 0% 100%)",
          fontFamily: "'Inter', system-ui, sans-serif",
          boxShadow: "0 4px 40px hsl(222 20% 10% / 0.08)",
        }}
      >
        <div className="relative z-10 flex flex-col h-full px-16 py-11">
          {/* Top — Context + Headline */}
          <div className="flex-none flex items-start justify-between">
            <div>
              <p
                className="text-[13px] font-semibold tracking-[0.15em] uppercase mb-3"
                style={{ color: "hsl(200 90% 40%)" }}
              >
                We asked 60 teams why AI execution fails.
              </p>
              <h1
                className="text-[38px] font-bold leading-[1.15] tracking-tight"
                style={{ color: "hsl(222 47% 11%)" }}
              >
                The problem isn't the AI.
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, hsl(200 90% 40%), hsl(155 72% 36%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  It's the missing standards.
                </span>
              </h1>
            </div>

            {/* Overall score callout */}
            <div
              className="flex-none text-center rounded-2xl px-8 py-5"
              style={{ background: "hsl(210 18% 96%)", minWidth: 150 }}
            >
              <div
                className="text-[64px] font-bold leading-none tracking-tight"
                style={{ color: "hsl(222 47% 11%)" }}
              >
                {OVERALL}
              </div>
              <div
                className="text-base font-medium"
                style={{ color: "hsl(215 14% 45%)" }}
              >
                out of 100
              </div>
              <div
                className="text-[11px] font-semibold tracking-[0.12em] uppercase mt-2"
                style={{ color: "hsl(200 90% 40%)" }}
              >
                Avg. Score
              </div>
            </div>
          </div>

          {/* Middle — Dimension bars */}
          <div className="flex-1 flex flex-col justify-center gap-[14px] mt-4">
            {DIMENSIONS.map((d) => (
              <div key={d.label} className="flex items-center gap-5">
                <div className="text-right" style={{ minWidth: 260 }}>
                  <div
                    className="text-[14px] font-semibold leading-tight"
                    style={{ color: "hsl(222 47% 11%)" }}
                  >
                    {d.label}
                  </div>
                  <div
                    className="text-[11px] font-normal leading-tight mt-0.5"
                    style={{ color: "hsl(215 14% 50%)" }}
                  >
                    {d.hint}
                  </div>
                </div>
                <div
                  className="flex-1 relative h-6 rounded-md overflow-hidden"
                  style={{ background: "hsl(210 18% 94%)" }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-md"
                    style={{
                      width: `${d.score}%`,
                      background: "linear-gradient(90deg, hsl(200 90% 40%), hsl(155 72% 36%))",
                    }}
                  />
                </div>
                <div
                  className="text-[16px] font-bold tabular-nums"
                  style={{ color: "hsl(222 47% 11%)", minWidth: 42 }}
                >
                  {d.score}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom strip */}
          <div
            className="flex-none flex items-center justify-between pt-5 mt-2"
            style={{ borderTop: "1px solid hsl(214 18% 90%)" }}
          >
            <span
              className="text-[14px] font-medium"
              style={{ color: "hsl(215 14% 45%)" }}
            >
              Based on <span style={{ fontWeight: 700, color: "hsl(222 47% 11%)" }}>60</span> team assessments across industries
            </span>
            <div
              className="flex items-center gap-3 rounded-lg px-5 py-2.5"
              style={{ background: "linear-gradient(135deg, hsl(200 90% 40%), hsl(155 72% 36%))" }}
            >
              <span className="text-[15px] font-semibold" style={{ color: "hsl(0 0% 100%)" }}>
                Get your score →
              </span>
              <span className="text-[15px] font-bold" style={{ color: "hsl(0 0% 100% / 0.9)" }}>
                lizaos.ai/diagnostic
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
