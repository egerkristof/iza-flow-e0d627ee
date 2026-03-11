export type Dimension =
  | "standard_internalization"
  | "output_consistency"
  | "knowledge_compounding"
  | "collective_visibility"
  | "learning_velocity";

export interface DiagnosticQuestion {
  id: string;
  question: string;
  context: string; // struggling-moment scene-setting
  dimension: Dimension;
  options: { label: string; score: number }[];
}

export interface DimensionResult {
  dimension: Dimension;
  label: string;
  score: number; // 0-100
  insight: string;
  implication: string; // business cost translation
}

export interface DiagnosticResult {
  overall: number; // 0-100
  archetype: { label: string; tagline: string; action: string };
  dimensions: DimensionResult[];
}

export const DIMENSION_LABELS: Record<Dimension, string> = {
  standard_internalization: "Standard Internalization",
  output_consistency: "Output Consistency",
  knowledge_compounding: "Knowledge Compounding",
  collective_visibility: "Collective Visibility",
  learning_velocity: "Learning Velocity",
};

export const DIMENSION_SHORT: Record<Dimension, string> = {
  standard_internalization: "Do your standards shape behaviour?",
  output_consistency: "Can anyone deliver your best work?",
  knowledge_compounding: "Does your team get smarter over time?",
  collective_visibility: "Can your team see how each other thinks?",
  learning_velocity: "How fast do improvements spread?",
};

export const QUESTIONS: DiagnosticQuestion[] = [
  // Standard Internalization (Explicit → Tacit), 2 questions
  {
    id: "si1",
    context:
      "Picture this: a team member sits down to work on a client deliverable with AI. They open a new chat window.",
    question:
      "How much of your team's accumulated thinking do they bring into that session?",
    dimension: "standard_internalization",
    options: [
      { label: "They start from scratch. Maybe dig through old chat histories", score: 1 },
      { label: "They have personal shortcuts, but nothing from the wider team", score: 2 },
      { label: "There's a shared reference they can pull from, though it's optional", score: 3 },
      { label: "The team's evolving standards inform every session, adapted to context", score: 4 },
    ],
  },
  {
    id: "si2",
    context:
      "Your team has a defined way of doing a key task — a methodology you've refined over years.",
    question:
      "When someone uses AI to execute that task, what actually happens?",
    dimension: "standard_internalization",
    options: [
      { label: "The defined approach and the AI session are completely disconnected", score: 1 },
      { label: "People know the approach exists but rarely reference it while prompting", score: 2 },
      { label: "Some people paste relevant sections into their prompts manually", score: 3 },
      { label: "The approach is woven into how AI sessions are set up — it's the starting point", score: 4 },
    ],
  },
  // Output Consistency, 2 questions
  {
    id: "oc1",
    context:
      "Two people on your team receive the same client brief. Both use AI to produce the deliverable.",
    question:
      "How similar would the outputs be?",
    dimension: "output_consistency",
    options: [
      { label: "Completely different. You'd think they were on different teams", score: 1 },
      { label: "Similar in tone, but the depth and structure would vary significantly", score: 2 },
      { label: "Recognisably aligned, with some individual variation in approach", score: 3 },
      { label: "Consistently high quality — the team's thinking comes through regardless of who does it", score: 4 },
    ],
  },
  {
    id: "oc2",
    context:
      "Your strongest AI user is on holiday for two weeks. Client work continues without them.",
    question:
      "What happens to the quality of AI-assisted work?",
    dimension: "output_consistency",
    options: [
      { label: "Quality drops noticeably. They're the one who 'gets it'", score: 1 },
      { label: "Some things slip, others are fine — depends on the task", score: 2 },
      { label: "Barely affected — others have picked up similar approaches", score: 3 },
      { label: "No change — their methods have become the team's default", score: 4 },
    ],
  },
  // Knowledge Compounding (Socialization + Combination), 2 questions
  {
    id: "kc1",
    context:
      "Last month, someone on your team discovered a significantly better way to handle a recurring task with AI.",
    question:
      "What happened next?",
    dimension: "knowledge_compounding",
    options: [
      { label: "Nothing. It stayed with them. Others don't know about it", score: 1 },
      { label: "They mentioned it in passing, maybe in a meeting or Slack message", score: 2 },
      { label: "It got written down somewhere, though it's unclear if anyone adopted it", score: 3 },
      { label: "It was reviewed, validated, and folded into the team's standard approach", score: 4 },
    ],
  },
  {
    id: "kc2",
    context:
      "Think about how your team used AI six months ago versus today.",
    question:
      "Has the collective capability genuinely improved?",
    dimension: "knowledge_compounding",
    options: [
      { label: "Honestly, we're doing roughly the same things the same way", score: 1 },
      { label: "Individual people have improved, but the team baseline hasn't moved much", score: 2 },
      { label: "We've gotten better in some areas, though it's been uneven", score: 3 },
      { label: "Clearly better — each project builds on what we learned from the last one", score: 4 },
    ],
  },
  // Collective Visibility (Socialization, Tacit → Tacit), 2 questions
  {
    id: "cv1",
    context:
      "A junior team member wants to learn how a senior colleague navigates ambiguity during an AI session.",
    question:
      "Is that visible to them?",
    dimension: "collective_visibility",
    options: [
      { label: "No. Everyone works in their own private chats. It's a black box", score: 1 },
      { label: "Only if someone explicitly screen-shares or walks them through it", score: 2 },
      { label: "We have some shared spaces, but people rarely look at each other's sessions", score: 3 },
      { label: "Yes — AI work is visible and people actively learn from each other's approaches", score: 4 },
    ],
  },
  {
    id: "cv2",
    context:
      "You're deciding who should use AI for which parts of a project.",
    question:
      "How does that coordination actually work?",
    dimension: "collective_visibility",
    options: [
      { label: "We don't. Everyone decides independently what to use AI for", score: 1 },
      { label: "Informally. People roughly know who's doing what, but there's no system", score: 2 },
      { label: "We have some structure. Certain tasks or roles are designated for AI use", score: 3 },
      { label: "AI tasks are intentionally distributed, tracked, and reviewed as a team", score: 4 },
    ],
  },
  // Learning Velocity (Internalization feedback loop), 2 questions
  {
    id: "lv1",
    context:
      "A major project just wrapped. The team used AI extensively throughout.",
    question:
      "Does your team review how AI was used and what could be improved?",
    dimension: "learning_velocity",
    options: [
      { label: "Never. The project ends and we move on to the next one", score: 1 },
      { label: "Occasionally someone reflects on it, but there's no consistent practice", score: 2 },
      { label: "We usually debrief, though insights don't always lead to concrete changes", score: 3 },
      { label: "Always — structured reviews produce specific updates to our approach", score: 4 },
    ],
  },
  {
    id: "lv2",
    context:
      "A new AI technique emerges that's directly relevant to your team's work.",
    question:
      "How quickly does it reach everyone?",
    dimension: "learning_velocity",
    options: [
      { label: "Slowly. Most people stick with what they already know", score: 1 },
      { label: "One or two early adopters try it; the rest hear about it weeks later", score: 2 },
      { label: "It usually gets discussed within a week; some people adopt it", score: 3 },
      { label: "Within days — someone evaluates it, and if it's better, the team adapts", score: 4 },
    ],
  },
];

const ARCHETYPES: { max: number; label: string; tagline: string; action: string }[] = [
  {
    max: 30,
    label: "Flying Solo",
    tagline:
      "Your people are exploring AI — but the explorations never connect. Every session starts from zero, and the team doesn't learn from its own experience.",
    action:
      "Start with one team ritual: a 15-minute weekly show-and-tell where someone demos their best AI technique. Visibility precedes structure.",
  },
  {
    max: 55,
    label: "Scattered Effort",
    tagline:
      "AI is being used, but knowledge resets every week. Individual skill isn't becoming team capability — your team is paying for the same learning curve repeatedly.",
    action:
      "Pick your single highest-value task and create one shared approach for it. Don't try to systematize everything — prove the model on one workflow first.",
  },
  {
    max: 75,
    label: "Emerging System",
    tagline:
      "You have real pieces in place. What's missing is the feedback loop that turns individual learning into collective improvement: the 'last mile' of compounding.",
    action:
      "Introduce structured after-action reviews. You're already capturing knowledge; now close the loop so it feeds back into your standards automatically.",
  },
  {
    max: 100,
    label: "Compound AI Team",
    tagline:
      "Your team's best thinking is everyone's starting point, and it evolves with every project. You're in the top tier of AI execution maturity.",
    action:
      "Focus on cross-domain transfer. Your system works within teams — now extend it across practice areas and client verticals.",
  },
];

const DIMENSION_INSIGHTS: Record<Dimension, { low: string; mid: string; high: string }> = {
  standard_internalization: {
    low: "Your team's best thinking and AI sessions exist in separate worlds. Standards aren't shaping how people actually work with AI.",
    mid: "Standards exist, but they're optional. Some people reference them, most improvise. The gap between 'how we should work' and 'how we actually work' is still wide.",
    high: "Your defined approaches actively shape AI sessions. The team doesn't just know the standard — they've internalized it as their starting point.",
  },
  output_consistency: {
    low: "Same brief, same team, wildly different results. Quality depends entirely on which individual picks up the task.",
    mid: "Outputs are recognisably from the same team, but depth and rigour vary depending on who's prompting. Key-person dependency is high.",
    high: "Your team produces consistently strong work regardless of who does it. The team's quality standard travels with the process, not the person.",
  },
  knowledge_compounding: {
    low: "Discoveries stay with the person who made them. Your AI knowledge resets every week — best practices die in personal chat histories.",
    mid: "Some knowledge sticks, but your team isn't systematically building on past work. Sharing is informal and inconsistent.",
    high: "Every project makes the next one better. New insights are validated and woven into your team's evolving approach.",
  },
  collective_visibility: {
    low: "AI usage is a black box across the team. No one can see how colleagues navigate complexity — especially juniors learning from seniors.",
    mid: "Some visibility exists through ad-hoc sharing, but there's no systematic way for the team to learn from each other's AI work.",
    high: "AI work is visible and intentionally shared. Team members actively learn from each other's approaches and coordinate AI usage strategically.",
  },
  learning_velocity: {
    low: "Your team isn't learning from its own AI usage. The same mistakes and missed opportunities repeat across projects.",
    mid: "Learning happens, but slowly and unevenly. Post-project reviews are inconsistent, and new techniques take weeks to spread.",
    high: "Your team adapts fast. Structured reviews feed improvements back into practice, and new techniques spread across the team within days.",
  },
};

const DIMENSION_IMPLICATIONS: Record<Dimension, { low: string; mid: string; high: string }> = {
  standard_internalization: {
    low: "This means your senior people are spending time supervising and correcting work that should already meet the standard. Research suggests teams without embedded standards spend 30-40% more time on internal review cycles.",
    mid: "You have the foundation, but inconsistent adoption means quality still depends on who's working. Every time someone skips the standard, you're funding re-learning.",
    high: "Your standards are doing the heavy lifting. New hires ramp faster, and senior oversight shifts from correction to genuine strategic review.",
  },
  output_consistency: {
    low: "Inconsistent deliverables are eroding trust and increasing senior review time. When quality depends on the individual, you can't scale without proportionally scaling your best people.",
    mid: "You're close, but key-person dependency means your capacity is capped by your strongest operators. If they leave, so does your quality ceiling.",
    high: "Consistency is your competitive moat. Clients get the team's quality, not an individual's — which means you can grow without diluting what makes you good.",
  },
  knowledge_compounding: {
    low: "Your team is paying the same learning tax on every project. Without compounding, a 20-person team operates like 20 individuals — each one solving problems the team has already solved.",
    mid: "You're capturing some value, but the leakage is significant. Every piece of tribal knowledge that stays informal is one resignation away from disappearing entirely.",
    high: "You're in rare territory. Each project genuinely makes the next one better — this is the compounding effect that separates high-growth teams from the rest.",
  },
  collective_visibility: {
    low: "Your junior people have no apprenticeship path through AI. In traditional work, they'd shadow seniors — with AI, they're left guessing. This extends ramp-up time by months.",
    mid: "Sharing happens, but it's effortful. The insights that would accelerate the whole team are locked behind someone choosing to present. Most don't.",
    high: "You've solved one of the hardest problems in AI adoption: making thinking visible. This is how institutional expertise actually transfers in the AI age.",
  },
  learning_velocity: {
    low: "Your competitors who learn faster will compound their advantage every quarter. After 12 months, the gap between a learning team and a static one isn't incremental — it's exponential.",
    mid: "You're improving, but unevenly. The risk is that your fastest learners outgrow your slowest, creating internal capability gaps that affect client work.",
    high: "Speed of adaptation is your edge. In a landscape where AI capabilities change monthly, the team that integrates improvements fastest wins — and that's you.",
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
    const implications = DIMENSION_IMPLICATIONS[dim];
    const tier = normalized <= 33 ? "low" : normalized <= 66 ? "mid" : "high";
    return {
      dimension: dim,
      label: DIMENSION_SHORT[dim],
      score: normalized,
      insight: insights[tier],
      implication: implications[tier],
    };
  });

  const overall = Math.round(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length);
  const archetype = ARCHETYPES.find((a) => overall <= a.max) || ARCHETYPES[ARCHETYPES.length - 1];

  return { overall, archetype, dimensions };
}
