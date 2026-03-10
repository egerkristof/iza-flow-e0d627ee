export type Dimension =
  | "playbook_enforcement"
  | "consistency"
  | "knowledge_compounding"
  | "team_coordination"
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
  playbook_enforcement: "Playbook Enforcement",
  consistency: "Consistency",
  knowledge_compounding: "Knowledge Compounding",
  team_coordination: "Team Coordination",
  learning_velocity: "Learning Velocity",
};

export const QUESTIONS: DiagnosticQuestion[] = [
  // Playbook Enforcement (2 questions)
  {
    id: "pe1",
    question: "Where do your team's best prompts and playbooks live?",
    dimension: "playbook_enforcement",
    options: [
      { label: "In people's heads or personal notes", score: 1 },
      { label: "A shared doc that nobody reads", score: 2 },
      { label: "A structured system people actually reference", score: 3 },
      { label: "Enforced inside our AI tools automatically", score: 4 },
    ],
  },
  {
    id: "pe2",
    question: "When a team member starts an AI session, how much structure do they get?",
    dimension: "playbook_enforcement",
    options: [
      { label: "None — they figure it out themselves", score: 1 },
      { label: "Some tips exist but usage is optional", score: 2 },
      { label: "Clear playbooks are available and encouraged", score: 3 },
      { label: "Playbooks are loaded into the session automatically", score: 4 },
    ],
  },
  // Consistency (2 questions)
  {
    id: "co1",
    question: "If two team members do the same task with AI, how similar are the results?",
    dimension: "consistency",
    options: [
      { label: "Wildly different every time", score: 1 },
      { label: "Somewhat similar but inconsistent", score: 2 },
      { label: "Mostly consistent with minor variations", score: 3 },
      { label: "Very consistent — we have standards", score: 4 },
    ],
  },
  {
    id: "co2",
    question: "If your best AI user is out sick, what happens to output quality?",
    dimension: "consistency",
    options: [
      { label: "Quality drops significantly", score: 1 },
      { label: "Noticeable drop in some areas", score: 2 },
      { label: "Barely affected — others know the approach", score: 3 },
      { label: "No change — their methods are everyone's default", score: 4 },
    ],
  },
  // Knowledge Compounding (2 questions)
  {
    id: "kc1",
    question: "When someone finds a better way to do something with AI, what happens?",
    dimension: "knowledge_compounding",
    options: [
      { label: "Nothing — it stays with them", score: 1 },
      { label: "They might mention it in a meeting", score: 2 },
      { label: "It gets documented somewhere", score: 3 },
      { label: "It updates the team's default process", score: 4 },
    ],
  },
  {
    id: "kc2",
    question: "Does your team's AI knowledge compound over time or reset?",
    dimension: "knowledge_compounding",
    options: [
      { label: "Resets every week — we start from scratch", score: 1 },
      { label: "Some things stick, most don't", score: 2 },
      { label: "We capture learnings but rarely revisit them", score: 3 },
      { label: "Every project makes the next one better", score: 4 },
    ],
  },
  // Team Coordination (2 questions)
  {
    id: "tc1",
    question: "Can team members see each other's AI sessions or outputs?",
    dimension: "team_coordination",
    options: [
      { label: "No — everyone works in private chats", score: 1 },
      { label: "Sometimes, if they share manually", score: 2 },
      { label: "We have shared workspaces for AI work", score: 3 },
      { label: "All AI work is visible and coordinated", score: 4 },
    ],
  },
  {
    id: "tc2",
    question: "How does your team coordinate who uses AI for what?",
    dimension: "team_coordination",
    options: [
      { label: "We don't — everyone does their own thing", score: 1 },
      { label: "Informally — people roughly know", score: 2 },
      { label: "We have defined roles and areas", score: 3 },
      { label: "AI tasks are assigned and tracked systematically", score: 4 },
    ],
  },
  // Learning Velocity (2 questions)
  {
    id: "lv1",
    question: "After a project, do you review how AI was used and what worked?",
    dimension: "learning_velocity",
    options: [
      { label: "Never", score: 1 },
      { label: "Occasionally, informally", score: 2 },
      { label: "Usually — we do informal debriefs", score: 3 },
      { label: "Always — structured reviews feed back into playbooks", score: 4 },
    ],
  },
  {
    id: "lv2",
    question: "How quickly does your team adopt new AI techniques or tools?",
    dimension: "learning_velocity",
    options: [
      { label: "Very slowly — stuck in old habits", score: 1 },
      { label: "A few early adopters, rest lag behind", score: 2 },
      { label: "Most people try new things within weeks", score: 3 },
      { label: "New techniques spread across the team within days", score: 4 },
    ],
  },
];

const ARCHETYPES: { max: number; label: string; tagline: string }[] = [
  { max: 30, label: "AI Soloists", tagline: "Your team is fast individually but dumb collectively." },
  { max: 55, label: "Scattered Effort", tagline: "AI is used, but knowledge resets every week." },
  { max: 75, label: "Emerging System", tagline: "You have pieces, but no compounding loop." },
  { max: 100, label: "AI Team", tagline: "Your team's best thinking is everyone's default." },
];

const DIMENSION_INSIGHTS: Record<Dimension, { low: string; mid: string; high: string }> = {
  playbook_enforcement: {
    low: "Your best prompts are invisible to the rest of the company. Every AI session is improvisation.",
    mid: "You have some structure, but it's not enforced. Standards exist on paper, not in practice.",
    high: "Your playbooks are actively enforced. AI sessions start from a shared standard.",
  },
  consistency: {
    low: "Same task, same team, wildly different results. AI amplifies individual variation.",
    mid: "Results are somewhat consistent, but quality depends heavily on who's prompting.",
    high: "Your team produces consistent outputs regardless of who's doing the work.",
  },
  knowledge_compounding: {
    low: "Your AI knowledge resets every week. Best practices die in personal chat histories.",
    mid: "Some knowledge sticks, but your team isn't systematically building on past work.",
    high: "Every project makes the next one better. Learnings flow back into your system.",
  },
  team_coordination: {
    low: "Everyone prompts alone. AI usage is a black box across the team.",
    mid: "Some visibility exists, but coordination is mostly informal and inconsistent.",
    high: "AI work is visible, coordinated, and builds on shared context.",
  },
  learning_velocity: {
    low: "Your team isn't learning from AI usage. The same mistakes repeat across projects.",
    mid: "Learning happens but slowly. New techniques take weeks to spread.",
    high: "Your team adapts fast. New techniques spread across the team within days.",
  },
};

export function calculateResults(answers: Record<string, number>): DiagnosticResult {
  const dimensionScores: Record<Dimension, number[]> = {
    playbook_enforcement: [],
    consistency: [],
    knowledge_compounding: [],
    team_coordination: [],
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
