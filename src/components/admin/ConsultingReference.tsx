import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen, Target, Users, TrendingUp, Eye, Zap,
  AlertTriangle, ArrowRight, CheckCircle2, Lightbulb,
} from "lucide-react";
import {
  DIMENSION_LABELS,
  DIMENSION_DESCRIPTIONS,
  DIMENSION_SHORT,
  type Dimension,
} from "@/lib/diagnostic-scoring";

/* ── All archetype data from diagnostic-scoring ── */
const ARCHETYPES = [
  {
    max: 30,
    label: "Flying Solo",
    scoreRange: "0–30",
    tagline:
      "Your people are exploring AI, but the explorations never connect. Every session starts from zero, and the team doesn't learn from its own experience.",
    action:
      "Start with one team ritual: a 15-minute weekly show-and-tell where someone demos their best AI technique. Visibility precedes structure.",
    consultingNotes: [
      "These teams are usually enthusiastic about AI individually but have zero shared infrastructure.",
      "Key pain: leadership cannot see what's happening, has no idea if AI is helping or hurting quality.",
      "Low-hanging fruit: introduce even one shared prompt template for a high-frequency task — immediate visibility win.",
      "Common objection: 'We don't want to stifle creativity.' Counter: shared starting points amplify creativity, they don't constrain it.",
      "Risk signal: if this team has client-facing work, quality variance is extremely high. Every deliverable is a coin flip.",
    ],
    typicalProfile: "Early-stage AI adoption. Usually no formal AI strategy. Tool access is distributed but usage is invisible.",
  },
  {
    max: 55,
    label: "Scattered Effort",
    scoreRange: "31–55",
    tagline:
      "AI is being used, but knowledge resets every week. Individual skill isn't becoming team capability. Your team is paying for the same learning curve repeatedly.",
    action:
      "Pick your single highest-value task and create one shared approach for it. Don't try to systematize everything. Prove the model on one workflow first.",
    consultingNotes: [
      "Most common archetype. Teams here feel like they're 'doing AI' but can't point to systematic improvements.",
      "Key pain: the best AI user's methods die in their personal chat history. When they're absent, quality drops.",
      "Focus the conversation on one specific workflow — don't try to boil the ocean. 'What's the one deliverable that matters most?'",
      "These teams often have informal sharing (Slack messages, meeting mentions) but nothing sticks. The insight half-life is ~48 hours.",
      "LIZA OS positioning: 'Your team already has the knowledge. You just need a system that captures it before it evaporates.'",
    ],
    typicalProfile: "6-18 months into AI adoption. Some power users, significant skill variance. Ad-hoc sharing only.",
  },
  {
    max: 75,
    label: "Emerging System",
    scoreRange: "56–75",
    tagline:
      "You have real pieces in place. What's missing is the feedback loop that turns individual learning into collective improvement: the 'last mile' of compounding.",
    action:
      "Introduce structured after-action reviews. You're already capturing knowledge; now close the loop so it feeds back into your standards automatically.",
    consultingNotes: [
      "These teams are genuinely impressive — they have shared resources, some documentation, possibly even prompt libraries.",
      "Key pain: knowledge gets captured but doesn't evolve. The playbook from 3 months ago is still the playbook today.",
      "The missing piece is almost always the feedback loop: execution → learning → standard update → better execution.",
      "These teams respond well to the 'compounding' metaphor. Show them the math: 1% daily improvement = 37x in a year.",
      "LIZA OS positioning: 'You've built the engine. We close the loop so every project automatically makes the next one better.'",
    ],
    typicalProfile: "Structured teams with some process maturity. Often have a 'champion' driving AI adoption formally.",
  },
  {
    max: 100,
    label: "Compound AI Team",
    scoreRange: "76–100",
    tagline:
      "Your team's best thinking is everyone's starting point, and it evolves with every project. You're in the top tier of AI execution maturity.",
    action:
      "Focus on cross-domain transfer. Your system works within teams. Now extend it across practice areas and client verticals.",
    consultingNotes: [
      "Rare. If someone scores here legitimately, they're a potential case study or design partner.",
      "Key opportunity: cross-team and cross-domain knowledge transfer. Their system works but may be siloed to one team or function.",
      "These teams understand the value proposition immediately. The conversation shifts to scale, not convincing.",
      "Watch for: over-reporting bias. Some teams score high because they interpret questions optimistically. Probe during conversation.",
      "LIZA OS positioning: 'You're already doing this manually. We automate the infrastructure so it scales without adding overhead.'",
    ],
    typicalProfile: "Mature AI practice with deliberate processes. Often in consulting, professional services, or knowledge-heavy industries.",
  },
];

const DIM_KEYS: Dimension[] = [
  "standard_internalization",
  "output_consistency",
  "knowledge_compounding",
  "collective_visibility",
  "learning_velocity",
];

const DIM_ICONS: Record<Dimension, React.ReactNode> = {
  standard_internalization: <BookOpen className="h-5 w-5" />,
  output_consistency: <Target className="h-5 w-5" />,
  knowledge_compounding: <TrendingUp className="h-5 w-5" />,
  collective_visibility: <Eye className="h-5 w-5" />,
  learning_velocity: <Zap className="h-5 w-5" />,
};

/* ── Detailed dimension consulting content ── */
const DIM_CONSULTING: Record<Dimension, {
  whatItMeasures: string;
  whyItMatters: string;
  lowSignals: string[];
  highSignals: string[];
  talkingPoints: string[];
  lizaOsAngle: string;
}> = {
  standard_internalization: {
    whatItMeasures: "Whether the team's documented standards, methodologies, and accumulated thinking actually reach AI sessions — or whether every session starts from a blank prompt.",
    whyItMatters: "Without this, AI amplifies individual habits instead of team standards. You get 10 different versions of 'how we do things here' depending on who's prompting.",
    lowSignals: [
      "People copy-paste from old chat histories or start from scratch",
      "Standards exist in Confluence/Notion but are never referenced during AI work",
      "New hires have no way to absorb the team's approach through AI sessions",
    ],
    highSignals: [
      "AI sessions are pre-loaded with relevant team context",
      "The team's methodology is the starting point, not an afterthought",
      "New techniques get absorbed into the standard within days",
    ],
    talkingPoints: [
      "Teams without embedded standards spend 30–40% more time on internal review cycles.",
      "Ask: 'If I opened your newest hire's last AI session, would I recognize your team's methodology in it?'",
      "The gap between 'we have standards' and 'standards shape AI behaviour' is where most value leaks.",
    ],
    lizaOsAngle: "LIZA OS injects your team's playbooks, principles, and directives directly into AI sessions — so the team's best thinking is the starting point, not something people have to remember to look up.",
  },
  output_consistency: {
    whatItMeasures: "If two people on the same team use AI on the same brief, how similar would the outputs be? This measures whether AI amplifies team quality or individual variation.",
    whyItMatters: "Inconsistent output means quality depends on who picks up the task. You can't scale a team whose quality is person-dependent.",
    lowSignals: [
      "Same brief produces wildly different deliverables depending on who does it",
      "Quality drops noticeably when a key person is unavailable",
      "Senior review time is spent on alignment, not strategic improvement",
    ],
    highSignals: [
      "Anyone on the team can produce work that meets the standard",
      "Key-person dependency is low — quality survives holidays and turnover",
      "Review time shifts from correction to genuine strategic input",
    ],
    talkingPoints: [
      "Key-person risk: if your best AI user leaves, your quality ceiling leaves with them.",
      "Ask: 'What happens to deliverable quality when [name] is on holiday for two weeks?'",
      "Consistency isn't about removing individuality — it's about raising the floor so everyone starts from the team's best.",
    ],
    lizaOsAngle: "LIZA OS ensures every team member starts from the same playbook and context, so quality variance drops without limiting individual expertise.",
  },
  knowledge_compounding: {
    whatItMeasures: "When someone discovers a better approach, does it stay in their chat history or does the whole team benefit? This measures whether knowledge compounds or resets.",
    whyItMatters: "Without compounding, a 20-person team operates like 20 individuals — each one solving problems the team has already solved.",
    lowSignals: [
      "Best practices die in personal chat histories",
      "The team's AI approach hasn't visibly improved in 6 months",
      "People reinvent solutions that someone else already found",
    ],
    highSignals: [
      "New insights are validated and folded into shared approaches",
      "Each project builds on what was learned from the last one",
      "There's a clear upward trajectory in AI-assisted output quality",
    ],
    talkingPoints: [
      "Every piece of tribal knowledge that stays informal is one resignation away from disappearing entirely.",
      "Ask: 'Can you point to a specific thing your team does better with AI today than 3 months ago — that everyone does?'",
      "The difference between a team that compounds and one that doesn't is exponential over 12 months.",
    ],
    lizaOsAngle: "LIZA OS captures insights from every session and feeds them back into the team's shared context — so each project automatically makes the next one better.",
  },
  collective_visibility: {
    whatItMeasures: "Can team members see how colleagues work with AI? Can juniors learn from seniors' approaches? Can leadership report on AI effectiveness?",
    whyItMatters: "In traditional work, juniors learn by observing seniors. With AI, that apprenticeship model breaks — everyone works in private chat windows.",
    lowSignals: [
      "AI usage is a black box — no one knows how colleagues navigate complexity",
      "Junior team members have no way to learn senior prompting approaches",
      "Leadership cannot report on AI ROI or effectiveness if asked",
    ],
    highSignals: [
      "AI work is visible and people actively learn from each other",
      "AI tasks are intentionally distributed and coordinated",
      "There's enough visibility to make informed decisions about AI investment",
    ],
    talkingPoints: [
      "Without visibility, you're investing in AI tools but can't measure whether they're making you better or just faster at being average.",
      "Ask: 'If your board asked for an AI effectiveness report tomorrow, what would you show them?'",
      "The apprenticeship gap: juniors in AI-heavy teams learn 3-4x slower when they can't see how seniors think.",
    ],
    lizaOsAngle: "LIZA OS makes AI work visible through shared workbooks and session history — restoring the apprenticeship path that private AI chats break.",
  },
  learning_velocity: {
    whatItMeasures: "How quickly the team evaluates new AI techniques, adopts improvements, and updates shared approaches. Speed of collective adaptation.",
    whyItMatters: "AI capabilities change monthly. The team that integrates improvements fastest compounds their advantage every cycle.",
    lowSignals: [
      "Projects end without reviewing how AI was used",
      "New techniques take weeks to spread, if they spread at all",
      "The team's approach is essentially the same as 6 months ago",
    ],
    highSignals: [
      "Structured after-action reviews produce specific process updates",
      "New techniques are evaluated and adopted within days",
      "There's a clear, documented evolution in how the team uses AI",
    ],
    talkingPoints: [
      "Your competitors who learn faster will compound their advantage every quarter. After 12 months, the gap is exponential, not incremental.",
      "Ask: 'After your last major project, did anything about your AI approach change? Specifically what?'",
      "Most teams debrief deliverables but never debrief process. That's where the velocity lives.",
    ],
    lizaOsAngle: "LIZA OS builds structured reviews into every workflow — capturing what worked, what didn't, and automatically feeding improvements back into your playbooks.",
  },
};

/* ── Scoring methodology ── */
const SCORING_METHODOLOGY = {
  basis: "10 scenario-based questions across 5 dimensions. Each question scored 1–4 based on observable team behaviours — not aspirations.",
  normalization: "Raw scores (1–4 avg per dimension) are normalized to 0–100 using: ((avg - 1) / 3) × 100.",
  overall: "The overall score is the unweighted mean of all 5 dimension scores.",
  benchmarks: [
    { label: "Industry Average", value: 35, note: "Calibrated against ServiceNow's 2025 Enterprise AI Maturity Index" },
    { label: "Structured Teams", value: "55+", note: "Teams with deliberate AI processes and some shared infrastructure" },
    { label: "Top Tier", value: "75+", note: "Compound AI teams with active feedback loops" },
  ],
};

export default function ConsultingReference() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Consulting Reference
        </h1>
        <p className="text-sm text-muted-foreground">
          Complete reference for interpreting diagnostic results, guiding conversations, and delivering insights to clients.
        </p>
      </div>

      {/* ── Scoring Methodology ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            Scoring Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-3">
            <div>
              <p className="font-medium text-foreground">Assessment Basis</p>
              <p className="text-muted-foreground">{SCORING_METHODOLOGY.basis}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Normalization</p>
              <p className="text-muted-foreground">{SCORING_METHODOLOGY.normalization}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Overall Score</p>
              <p className="text-muted-foreground">{SCORING_METHODOLOGY.overall}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="font-medium text-foreground mb-2">Benchmark Reference Points</p>
            <div className="grid gap-2">
              {SCORING_METHODOLOGY.benchmarks.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <Badge variant="outline" className="min-w-[60px] justify-center font-mono text-xs">
                    {b.value}
                  </Badge>
                  <div>
                    <span className="font-medium text-foreground">{b.label}</span>
                    <span className="text-muted-foreground ml-2">— {b.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Archetypes ── */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Maturity Archetypes
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Each respondent is placed into one of four archetypes based on their overall score. Use these profiles to frame the conversation.
        </p>

        <div className="space-y-4">
          {ARCHETYPES.map((arch) => (
            <Card key={arch.label} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base">{arch.label}</CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    Score {arch.scoreRange}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{arch.tagline}</p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-1">Typical Profile</p>
                  <p className="text-muted-foreground">{arch.typicalProfile}</p>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-1 flex items-center gap-1.5">
                    <ArrowRight className="h-3.5 w-3.5 text-primary" />
                    Recommended First Action
                  </p>
                  <p className="text-muted-foreground">{arch.action}</p>
                </div>

                <Separator />

                <div>
                  <p className="font-medium text-foreground mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    Consulting Notes &amp; Talking Points
                  </p>
                  <ul className="space-y-1.5">
                    {arch.consultingNotes.map((note, i) => (
                      <li key={i} className="flex gap-2 text-muted-foreground">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* ── Dimensions Deep Dive ── */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Dimension Deep Dive
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Detailed reference for each of the five diagnostic dimensions. Use during client conversations to explain scores, identify gaps, and frame recommendations.
        </p>

        <div className="space-y-6">
          {DIM_KEYS.map((dim) => {
            const consulting = DIM_CONSULTING[dim];
            return (
              <Card key={dim} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {DIM_ICONS[dim]}
                    </div>
                    <div>
                      <CardTitle className="text-base">{DIMENSION_LABELS[dim]}</CardTitle>
                      <p className="text-xs text-muted-foreground italic mt-0.5">
                        "{DIMENSION_SHORT[dim]}"
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium text-foreground mb-1">What It Measures</p>
                    <p className="text-muted-foreground">{consulting.whatItMeasures}</p>
                  </div>

                  <div>
                    <p className="font-medium text-foreground mb-1">Why It Matters</p>
                    <p className="text-muted-foreground">{consulting.whyItMatters}</p>
                  </div>

                  <div>
                    <p className="font-medium text-foreground mb-1">Full Description</p>
                    <p className="text-muted-foreground">{DIMENSION_DESCRIPTIONS[dim]}</p>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-destructive mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Low Score Signals (0–33)
                      </p>
                      <ul className="space-y-1.5">
                        {consulting.lowSignals.map((s, i) => (
                          <li key={i} className="flex gap-2 text-muted-foreground">
                            <span className="text-destructive mt-0.5 shrink-0">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-primary mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        High Score Signals (67–100)
                      </p>
                      <ul className="space-y-1.5">
                        {consulting.highSignals.map((s, i) => (
                          <li key={i} className="flex gap-2 text-muted-foreground">
                            <span className="text-primary mt-0.5 shrink-0">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="font-medium text-foreground mb-2 flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                      Conversation Talking Points
                    </p>
                    <ul className="space-y-1.5">
                      {consulting.talkingPoints.map((tp, i) => (
                        <li key={i} className="flex gap-2 text-muted-foreground">
                          <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                          <span>{tp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                    <p className="font-medium text-primary text-xs mb-1">LIZA OS Positioning</p>
                    <p className="text-muted-foreground">{consulting.lizaOsAngle}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
