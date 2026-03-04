import { X, Check } from "lucide-react";

const REASONS = [
  {
    number: "01",
    claim: "No way to define and enforce how work gets done.",
    explanation:
      "Your playbooks exist in wikis and shared drives. They never reach the actual workflow. Every person improvises their own version of \"best practice.\"",
    badges: [
      { label: "Wikis", sub: "Confluence, Notion", status: "no" as const, note: "Static pages nobody opens mid-task" },
      { label: "AI Tools", sub: "ChatGPT, Claude", status: "no" as const, note: "Zero awareness of your standards" },
      { label: "LIZA", status: "yes" as const, note: "Your playbooks enforced live, every session" },
    ],
  },
  {
    number: "02",
    claim: "No way to execute as a team.",
    explanation:
      "Everyone uses AI alone. Insights stay in individual chats. What one person learns never reaches the rest. Your team operates as a collection of soloists.",
    badges: [
      { label: "Wikis", sub: "Confluence, Notion", status: "no" as const, note: "Updates are manual and rare" },
      { label: "AI Tools", sub: "ChatGPT, Claude", status: "no" as const, note: "Individual silos, no shared context" },
      { label: "LIZA", status: "yes" as const, note: "Team-wide context in every session" },
    ],
  },
  {
    number: "03",
    claim: "No way to learn and improve across engagements.",
    explanation:
      "Every session starts from scratch. Nothing compounds. Your system never gets smarter no matter how many projects your team completes.",
    badges: [
      { label: "Wikis", sub: "Confluence, Notion", status: "partial" as const, note: "Depends on who writes post-mortems" },
      { label: "AI Tools", sub: "ChatGPT, Claude", status: "no" as const, note: "No memory across users or sessions" },
      { label: "LIZA", status: "yes" as const, note: "Continuous learning loops across the team" },
    ],
  },
];

function Badge({ label, sub, status, note }: { label: string; sub?: string; status: "yes" | "no" | "partial"; note: string }) {
  const isLiza = label === "LIZA";

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 ${isLiza ? "" : ""}`}
      style={isLiza ? { background: "hsl(var(--primary) / 0.08)" } : { background: "hsl(0 0% 100% / 0.03)" }}
    >
      <div className="min-w-0">
        <span
          className={`text-xs font-bold leading-tight ${isLiza ? "" : "text-muted-foreground"}`}
          style={isLiza ? { color: "hsl(var(--primary))" } : undefined}
        >
          {label}
        </span>
        {sub && <span className="block text-[10px] text-muted-foreground/50">{sub}</span>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {status === "yes" && (
          <span
            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "hsl(var(--success) / 0.15)", color: "hsl(var(--success))" }}
          >
            <Check className="w-3.5 h-3.5" /> Yes
          </span>
        )}
        {status === "no" && (
          <span
            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive) / 0.6)" }}
          >
            <X className="w-3.5 h-3.5" /> No
          </span>
        )}
        {status === "partial" && (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            Partial
          </span>
        )}
        <span className="text-[10px] text-muted-foreground/60 max-w-[140px] text-right leading-tight hidden sm:block">{note}</span>
      </div>
    </div>
  );
}

export function ThreeReasonsSection() {
  return (
    <section
      id="three-reasons"
      className="relative py-24 md:py-32 px-6"
      style={{ background: "hsl(var(--card))" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Provocative opener */}
        <p className="text-sm font-bold tracking-[0.2em] uppercase text-primary mb-4">The problem</p>
        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-3 leading-[1.1]">
          Your AI tools make individuals faster.
          <br />
          <span className="text-muted-foreground">They make teams worse.</span>
        </h2>
        <p className="text-base text-muted-foreground max-w-lg mb-20">
          Three structural gaps that no wiki, no prompt library, and no AI chatbot can close.
        </p>

        {/* Stacked reason bands */}
        <div className="space-y-16 md:space-y-20">
          {REASONS.map((r) => (
            <div key={r.number} className="group">
              {/* Number + Claim */}
              <div className="flex items-start gap-4 md:gap-6 mb-5">
                <span
                  className="text-4xl md:text-5xl font-black shrink-0 leading-none"
                  style={{ color: "hsl(var(--primary) / 0.15)" }}
                >
                  {r.number}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight pt-1">
                  {r.claim}
                </h3>
              </div>

              {/* Explanation */}
              <p className="text-base text-muted-foreground leading-relaxed mb-6 ml-0 md:ml-[4.5rem]">
                {r.explanation}
              </p>

              {/* Inline comparison badges */}
              <div className="space-y-2 ml-0 md:ml-[4.5rem]">
                {r.badges.map((b) => (
                  <Badge key={b.label} {...b} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bridge line */}
        <div className="mt-20 pt-10 border-t" style={{ borderColor: "hsl(var(--border))" }}>
          <p className="text-lg md:text-xl font-black text-foreground">
            LIZA OS closes all three gaps.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            One platform. Define, execute, learn. As a team.
          </p>
        </div>
      </div>
    </section>
  );
}
