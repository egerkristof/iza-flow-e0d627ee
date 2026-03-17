const DIMENSIONS = [
  { label: "Standard Internalization", score: 35.6 },
  { label: "Output Consistency", score: 38.4 },
  { label: "Collective Visibility", score: 39.8 },
  { label: "Knowledge Compounding", score: 40.3 },
  { label: "Learning Velocity", score: 40.8 },
];

const OVERALL = 39;

export default function LinkedInImageCard() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div
        className="relative overflow-hidden"
        style={{
          width: 1200,
          height: 627,
          background: "linear-gradient(145deg, hsl(222 20% 6%), hsl(222 20% 3%))",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* Atmospheric glow */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 20% 10%, hsl(200 90% 52% / 0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 80%, hsl(155 72% 46% / 0.05) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 flex flex-col h-full px-16 py-12">
          {/* Top — Headline */}
          <div className="flex-none">
            <p
              className="text-xs font-bold tracking-[0.25em] uppercase mb-4"
              style={{ color: "hsl(200 90% 52%)" }}
            >
              Standards Debt Report
            </p>
            <h1
              className="text-[42px] font-bold leading-[1.1] tracking-tight max-w-[700px]"
              style={{ color: "hsl(0 0% 96%)" }}
            >
              AI Doesn't Hallucinate.
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, hsl(200 90% 52%), hsl(155 72% 46%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                It Has No Truth.
              </span>
            </h1>
          </div>

          {/* Middle — Score + Bars */}
          <div className="flex-1 flex items-center gap-16 mt-2">
            {/* Overall score */}
            <div className="flex-none text-center" style={{ minWidth: 160 }}>
              <div
                className="text-[80px] font-bold leading-none tracking-tight"
                style={{ color: "hsl(0 0% 96%)" }}
              >
                {OVERALL}
              </div>
              <div
                className="text-lg font-medium mt-1"
                style={{ color: "hsl(215 10% 50%)" }}
              >
                / 100
              </div>
              <div
                className="text-[11px] font-semibold tracking-[0.15em] uppercase mt-3"
                style={{ color: "hsl(200 90% 52% / 0.7)" }}
              >
                Overall Score
              </div>
            </div>

            {/* Dimension bars */}
            <div className="flex-1 flex flex-col gap-4">
              {DIMENSIONS.map((d) => (
                <div key={d.label} className="flex items-center gap-4">
                  <div
                    className="text-[13px] font-medium text-right"
                    style={{ color: "hsl(215 10% 55%)", minWidth: 200 }}
                  >
                    {d.label}
                  </div>
                  <div className="flex-1 relative h-5 rounded-sm overflow-hidden" style={{ background: "hsl(222 14% 10%)" }}>
                    <div
                      className="absolute inset-y-0 left-0 rounded-sm"
                      style={{
                        width: `${d.score}%`,
                        background: "linear-gradient(90deg, hsl(200 90% 52%), hsl(155 72% 46%))",
                        boxShadow: "0 0 12px hsl(200 90% 52% / 0.3)",
                      }}
                    />
                  </div>
                  <div
                    className="text-[15px] font-bold tabular-nums"
                    style={{ color: "hsl(0 0% 88%)", minWidth: 40 }}
                  >
                    {d.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom strip */}
          <div className="flex-none flex items-end justify-between pt-4" style={{ borderTop: "1px solid hsl(222 14% 12%)" }}>
            <div className="flex items-center gap-6">
              <span
                className="text-[13px] font-medium"
                style={{ color: "hsl(215 10% 45%)" }}
              >
                Based on <span style={{ color: "hsl(0 0% 80%)" }}>60</span> team assessments
              </span>
            </div>
            <div className="flex items-center gap-8">
              <span
                className="text-[13px] font-semibold"
                style={{ color: "hsl(200 90% 52%)" }}
              >
                Get your score →{" "}
                <span style={{ color: "hsl(0 0% 92%)" }}>lizaos.ai/diagnostic</span>
              </span>
              <span
                className="text-[11px] font-bold tracking-[0.2em] uppercase"
                style={{ color: "hsl(215 10% 35%)" }}
              >
                LIZA OS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
