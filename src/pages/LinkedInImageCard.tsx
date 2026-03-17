const DIMENSIONS = [
  { label: "Standard Internalization", score: 35.6, hint: "Do people actually know the standards?" },
  { label: "Output Consistency", score: 38.4, hint: "Does work look the same across the team?" },
  { label: "Collective Visibility", score: 39.8, hint: "Can leaders see what's really happening?" },
  { label: "Knowledge Compounding", score: 40.3, hint: "Does the team get smarter over time?" },
  { label: "Learning Velocity", score: 40.8, hint: "How fast do improvements spread?" },
];

const OVERALL = 39;

/* ─── Card 1: The Hook ─── */
function HookCard() {
  return (
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
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-20 text-center">
        <p
          className="text-[28px] font-bold leading-[1.3] tracking-tight mb-6"
          style={{ color: "hsl(222 47% 11%)" }}
        >
          We asked 60 teams why AI execution fails.
        </p>

        <h1
          className="text-[64px] font-bold leading-[1.1] tracking-tight max-w-[950px]"
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

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-16 py-4"
        style={{ borderTop: "1px solid hsl(214 18% 92%)" }}
      >
        <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ color: "hsl(215 14% 60%)" }}>
          LIZA OS
        </span>
        <span className="text-[13px] font-semibold" style={{ color: "hsl(200 90% 40%)" }}>
          lizaos.ai/diagnostic
        </span>
      </div>
    </div>
  );
}

/* ─── Card 2: The Data ─── */
function DataCard() {
  return (
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
        {/* Header row */}
        <div className="flex-none flex items-start justify-between">
          <div>
            <p
              className="text-[13px] font-semibold tracking-[0.15em] uppercase mb-3"
              style={{ color: "hsl(200 90% 40%)" }}
            >
              The 5 dimensions of AI execution readiness
            </p>
            <h2
              className="text-[30px] font-bold leading-[1.2] tracking-tight"
              style={{ color: "hsl(222 47% 11%)" }}
            >
              Where teams are actually failing
            </h2>
          </div>

          {/* Overall score */}
          <div
            className="flex-none text-center rounded-2xl px-8 py-5"
            style={{ background: "hsl(210 18% 96%)", minWidth: 150 }}
          >
            <div className="text-[64px] font-bold leading-none tracking-tight" style={{ color: "hsl(222 47% 11%)" }}>
              {OVERALL}
            </div>
            <div className="text-base font-medium" style={{ color: "hsl(215 14% 45%)" }}>
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

        {/* Bars */}
        <div className="flex-1 flex flex-col justify-center gap-[14px] mt-4">
          {DIMENSIONS.map((d) => (
            <div key={d.label} className="flex items-center gap-5">
              <div className="text-right" style={{ minWidth: 260 }}>
                <div className="text-[14px] font-semibold leading-tight" style={{ color: "hsl(222 47% 11%)" }}>
                  {d.label}
                </div>
                <div className="text-[11px] font-normal leading-tight mt-0.5" style={{ color: "hsl(215 14% 50%)" }}>
                  {d.hint}
                </div>
              </div>
              <div className="flex-1 relative h-6 rounded-md overflow-hidden" style={{ background: "hsl(210 18% 94%)" }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-md"
                  style={{
                    width: `${d.score}%`,
                    background: "linear-gradient(90deg, hsl(200 90% 40%), hsl(155 72% 36%))",
                  }}
                />
              </div>
              <div className="text-[16px] font-bold tabular-nums" style={{ color: "hsl(222 47% 11%)", minWidth: 42 }}>
                {d.score}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex-none flex items-center justify-between pt-5 mt-2" style={{ borderTop: "1px solid hsl(214 18% 90%)" }}>
          <span className="text-[14px] font-medium" style={{ color: "hsl(215 14% 45%)" }}>
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
  );
}

/* ─── Post Copy ─── */
function PostCopy() {
  const post = `Everyone's talking about context engineering.

Feeding the right data to the right model at the right time.

But we've now assessed 60 teams on AI execution readiness. And the data tells a different story.

The average score: 39 out of 100.

Not because these teams lack tools. Not because they haven't adopted AI.

Because they never codified what "good" looks like.

Standard Internalization scored lowest at 35.6.
That means most teams can't even articulate their own quality bar — let alone teach it to an AI.

Here's the structural problem:

Context engineering gives the AI the facts.
But facts without judgment produce confident mediocrity.

You need Standards Engineering — the discipline of capturing how your best people think, codifying it into executable standards, and making those standards run in every AI session.

Without it:
→ Every team member prompts differently
→ Every output needs senior review
→ AI amplifies inconsistency at scale

The teams scoring above 70 have one thing in common:
They didn't start with AI. They started with standards.

—
Get your own score in 90 seconds.
The link is in the carousel → lizaos.ai/diagnostic`;

  return (
    <div className="max-w-2xl mx-auto mt-16 mb-20 px-8">
      <h3 className="text-lg font-bold mb-4" style={{ color: "hsl(222 47% 11%)" }}>LinkedIn Post Copy</h3>
      <pre
        className="whitespace-pre-wrap text-sm leading-relaxed p-6 rounded-lg"
        style={{
          background: "hsl(210 18% 97%)",
          color: "hsl(222 47% 11%)",
          fontFamily: "'Inter', system-ui, sans-serif",
          border: "1px solid hsl(214 18% 90%)",
        }}
      >
        {post}
      </pre>
    </div>
  );
}

/* ─── Page ─── */
export default function LinkedInImageCard() {
  return (
    <div className="min-h-screen" style={{ background: "hsl(210 18% 96%)" }}>
      <div className="flex flex-col items-center gap-10 py-12">
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(215 14% 50%)" }}>
          Card 1 — Screenshot this
        </p>
        <HookCard />

        <p className="text-xs font-bold tracking-widest uppercase mt-8" style={{ color: "hsl(215 14% 50%)" }}>
          Card 2 — Screenshot this
        </p>
        <DataCard />
      </div>

      <PostCopy />
    </div>
  );
}
