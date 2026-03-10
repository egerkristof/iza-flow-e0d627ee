export type Dimension =
  | "standard_internalization"
  | "output_consistency"
  | "knowledge_compounding"
  | "collective_visibility"
  | "learning_velocity";

export interface DiagnosticQuestion {
  id: string;
  question: string;
  dimension: Dimension;
  options: { label: string; score: number }[];
}

export interface DimensionResult {
  dimension: Dimension;
  label: string;
  score: number; // 0-100
  insight: string;
}

export interface DiagnosticResult {
  overall: number; // 0-100
  archetype: { label: string; tagline: string };
  dimensions: DimensionResult[];
}

export const DIMENSION_LABELS: Record<Dimension, string> = {
  standard_internalization: "Do your standards shape behaviour?",
  output_consistency: "Can anyone deliver your best work?",
  knowledge_compounding: "Does your firm get smarter over time?",
  collective_visibility: "Can your team see how each other thinks?",
  learning_velocity: "How fast do improvements spread?",
};

export const QUESTIONS: DiagnosticQuestion[] = [
  // Standard Internalization (Explicit → Tacit) — 2 questions
  {
    id: "si1",
    question:
      "When a team member starts an AI session for a client deliverable, how much of your firm's accumulated thinking do they bring with them?",
    dimension: "standard_internalization",
    options: [
      { label: "They start from scratch — maybe dig through old chat histories", score: 1 },
      { label: "They have personal shortcuts, but nothing from the wider team", score: 2 },
      { label: "There's a shared reference they can pull from, though it's optional", score: 3 },
      { label: "The team's evolving standards inform every session, adapted to context", score: 4 },
    ],
  },
  {
    id: "si2",
    question:
      "Your firm has a defined way of doing a key task. When someone uses AI to do that task, what actually happens?",
    dimension: "standard_internalization",
    options: [
      { label: "The defined approach and the AI session are completely disconnected", score: 1 },
      { label: "People know the approach exists but rarely reference it while prompting", score: 2 },
      { label: "Some people paste relevant sections into their prompts manually", score: 3 },
      { label: "The approach is woven into how AI sessions are set up — it's the starting point", score: 4 },
    ],
  },
  // Output Consistency — 2 questions
  {
    id: "oc1",
    question:
      "If two people on your team tackle the same client brief with AI today, how similar would the outputs be?",
    dimension: "output_consistency",
    options: [
      { label: "Completely different — you'd think they worked at different firms", score: 1 },
      { label: "Similar in tone, but the depth and structure would vary significantly", score: 2 },
      { label: "Recognisably aligned, with some individual variation in approach", score: 3 },
      { label: "Consistently high quality — the firm's thinking comes through regardless of who does it", score: 4 },
    ],
  },
  {
    id: "oc2",
    question:
      "If your strongest AI user is on holiday for two weeks, what happens to the quality of AI-assisted work?",
    dimension: "output_consistency",
    options: [
      { label: "Quality drops noticeably — they're the one who 'gets it'", score: 1 },
      { label: "Some things slip, others are fine — depends on the task", score: 2 },
      { label: "Barely affected — others have picked up similar approaches", score: 3 },
      { label: "No change — their methods have become the team's default", score: 4 },
    ],
  },
  // Knowledge Compounding (Socialization + Combination) — 2 questions
  {
    id: "kc1",
    question:
      "Last month, someone on your team discovered a significantly better way to handle a task with AI. What happened next?",
    dimension: "knowledge_compounding",
    options: [
      { label: "Nothing — it stayed with them. Others don't know about it", score: 1 },
      { label: "They mentioned it in passing, maybe in a meeting or Slack message", score: 2 },
      { label: "It got written down somewhere, though it's unclear if anyone adopted it", score: 3 },
      { label: "It was reviewed, validated, and folded into the team's standard approach", score: 4 },
    ],
  },
  {
    id: "kc2",
    question:
      "Think about how your team used AI six months ago versus today. Has the collective capability genuinely improved?",
    dimension: "knowledge_compounding",
    options: [
      { label: "Honestly, we're doing roughly the same things the same way", score: 1 },
      { label: "Individual people have improved, but the team baseline hasn't moved much", score: 2 },
      { label: "We've gotten better in some areas, though it's been uneven", score: 3 },
      { label: "Clearly better — each project builds on what we learned from the last one", score: 4 },
    ],
  },
  // Collective Visibility (Socialization — Tacit → Tacit) — 2 questions
  {
    id: "cv1",
    question:
      "Can a junior team member see how a senior colleague navigates ambiguity during an AI session?",
    dimension: "collective_visibility",
    options: [
      { label: "No — everyone works in their own private chats. It's a black box", score: 1 },
      { label: "Only if someone explicitly screen-shares or walks them through it", score: 2 },
      { label: "We have some shared spaces, but people rarely look at each other's sessions", score: 3 },
      { label: "Yes — AI work is visible and people actively learn from each other's approaches", score: 4 },
    ],
  },
  {
    id: "cv2",
    question:
      "When your team coordinates on who uses AI for what, how does that actually work?",
    dimension: "collective_visibility",
    options: [
      { label: "We don't — everyone decides independently what to use AI for", score: 1 },
      { label: "Informally — people roughly know who's doing what, but there's no system", score: 2 },
      { label: "We have some structure — certain tasks or roles are designated for AI use", score: 3 },
      { label: "AI tasks are intentionally distributed, tracked, and reviewed as a team", score: 4 },
    ],
  },
  // Learning Velocity (Internalization feedback loop) — 2 questions
  {
    id: "lv1",
    question:
      "After a major project wraps up, does your team review how AI was used and what could be improved?",
    dimension: "learning_velocity",
    options: [
      { label: "Never — the project ends and we move on to the next one", score: 1 },
      { label: "Occasionally someone reflects on it, but there's no consistent practice", score: 2 },
      { label: "We usually debrief, though insights don't always lead to concrete changes", score: 3 },
      { label: "Always — structured reviews produce specific updates to our approach", score: 4 },
    ],
  },
  {
    id: "lv2",
    question:
      "When a new AI technique or tool emerges that's relevant to your work, how quickly does it reach the team?",
    dimension: "learning_velocity",
    options: [
      { label: "Slowly — most people stick with what they already know", score: 1 },
      { label: "One or two early adopters try it; the rest hear about it weeks later", score: 2 },
      { label: "It usually gets discussed within a week; some people adopt it", score: 3 },
      { label: "Within days — someone evaluates it, and if it's better, the team adapts", score: 4 },
    ],
  },
];

const ARCHETYPES: { max: number; label: string; tagline: string }[] = [
  {
    max: 30,
    label: "Unconnected Exploration",
    tagline: "Your people are exploring — but the explorations never connect. Every AI session starts from zero.",
  },
  {
    max: 55,
    label: "Scattered Effort",
    tagline: "AI is being used, but knowledge resets every week. Individual skill isn't becoming team capability.",
  },
  {
    max: 75,
    label: "Emerging System",
    tagline: "You have real pieces in place. What's missing is the loop that turns individual learning into collective improvement.",
  },
  {
    max: 100,
    label: "Adaptive AI Team",
    tagline: "Your team's best thinking is everyone's starting point — and it evolves with every project.",
  },
];

const DIMENSION_INSIGHTS: Record<Dimension, { low: string; mid: string; high: string }> = {
  standard_internalization: {
    low: "Your firm's best thinking and AI sessions exist in separate worlds. Standards aren't shaping how people actually work with AI.",
    mid: "Standards exist, but they're optional. Some people reference them, most improvise. The gap between 'how we should work' and 'how we actually work' is wide.",
    high: "Your defined approaches actively shape AI sessions. The team doesn't just know the standard — they've internalized it as their starting point.",
  },
  output_consistency: {
    low: "Same brief, same team, wildly different results. Quality depends entirely on which individual picks up the task.",
    mid: "Outputs are recognisably from the same firm, but depth and rigour vary depending on who's prompting. Key-person dependency is high.",
    high: "Your team produces consistently strong work regardless of who does it. The firm's quality standard travels with the process, not the person.",
  },
  knowledge_compounding: {
    low: "Discoveries stay with the person who made them. Your AI knowledge resets every week — best practices die in personal chat histories.",
    mid: "Some knowledge sticks, but your team isn't systematically building on past work. Sharing is informal and inconsistent.",
    high: "Every project makes the next one better. New insights are validated and woven into the team's evolving approach.",
  },
  collective_visibility: {
    low: "AI usage is a black box across the team. No one can see how colleagues navigate complexity — especially juniors learning from seniors.",
    mid: "Some visibility exists through ad-hoc sharing, but there's no systematic way for the team to learn from each other's AI work.",
    high: "AI work is visible and intentionally shared. Team members actively learn from each other's approaches and the firm coordinates AI usage strategically.",
  },
  learning_velocity: {
    low: "Your team isn't learning from its own AI usage. The same mistakes and missed opportunities repeat across projects.",
    mid: "Learning happens, but slowly and unevenly. Post-project reviews are inconsistent, and new techniques take weeks to spread.",
    high: "Your team adapts fast. Structured reviews feed improvements back into practice, and new techniques spread across the team within days.",
  },
};

export function calculateResults(answers: Record<string, number>): DiagnosticResult {
  const dimensionScores: Record<Dimension, number[]> = {
    standard_internalization: [],
    output_consistency: [],
    knowledge_compounding: [],
    collective_visibility: [],
    learning_velocity: [],
  };

  for (const q of QUESTIONS) {
    const score = answers[q.id];
    if (score != null) {
      dimensionScores[q.dimension].push(score);
    }
  }

  const dimensions: DimensionResult[] = (Object.keys(dimensionScores) as Dimension[]).map((dim) => {
    const scores = dimensionScores[dim];
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const normalized = Math.round(((avg - 1) / 3) * 100);
    const insights = DIMENSION_INSIGHTS[dim];
    const insight = normalized <= 33 ? insights.low : normalized <= 66 ? insights.mid : insights.high;
    return { dimension: dim, label: DIMENSION_LABELS[dim], score: normalized, insight };
  });

  const overall = Math.round(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length);
  const archetype = ARCHETYPES.find((a) => overall <= a.max) || ARCHETYPES[ARCHETYPES.length - 1];

  return { overall, archetype, dimensions };
}
