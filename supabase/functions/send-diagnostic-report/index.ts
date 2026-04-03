import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

interface DimensionScore {
  dimension: string;
  label: string;
  score: number;
  insight: string;
  implication: string;
}

interface RequestBody {
  email: string;
  respondent_role?: string | null;
  team_size?: string | null;
  team_leader_email?: string | null;
  overall: number;
  archetype: { label: string; tagline: string; action: string };
  dimensions: DimensionScore[];
  answers?: Record<string, number> | null;
  scores?: Record<string, number> | null;
  session_id?: string | null;
  diagnostic_result_id?: string;
  results_base_url?: string;
}

const FRIENDLY_LABELS: Record<string, string> = {
  standard_internalization: "Standards Adoption",
  output_consistency: "Delivery Consistency",
  knowledge_compounding: "Knowledge Sharing",
  collective_visibility: "Team Visibility",
  learning_velocity: "Improvement Speed",
};

const DIMENSION_DESCRIPTIONS: Record<string, string> = {
  standard_internalization: "When someone on your team opens an AI chat, does your team's methodology, quality bar, and accumulated thinking actually reach that session, or do they start from a blank prompt every time?",
  output_consistency: "If two people use AI on the same brief, how similar are the results? This measures whether AI amplifies team standards or individual habits.",
  knowledge_compounding: "When someone discovers a better prompt, workflow, or AI technique, does it stay in their chat history or does the whole team benefit?",
  collective_visibility: "Can your team see how each other uses AI? Can juniors learn from seniors' prompting? Can you report on AI effectiveness if asked?",
  learning_velocity: "When a new AI technique or tool update emerges, how quickly does your team evaluate it, adopt it, and update their shared approach?",
};

const COST_TRANSLATIONS: Record<string, { low: string; mid: string; high: string }> = {
  standard_internalization: {
    low: "Every AI session starts from zero. Across a 10-person team, that is roughly 5 to 10 hours per week spent re-explaining context that already exists in your team's methodology docs, past projects, and senior people's heads.",
    mid: "Some standards reach AI sessions, but inconsistently. The 2 to 3 hours per person per week lost to re-prompting is the visible cost. The hidden cost: your best people's judgment is not reaching the work, so output quality depends on who is prompting rather than what the team collectively knows.",
    high: "Your standards are actively shaping AI sessions. That is rare. New hires ramp faster, senior review shifts from correction to strategy, and your methodology travels with the process, not individual people.",
  },
  output_consistency: {
    low: "If two people on your team get the same brief, you will get two very different outputs. That means rework cycles of 3 to 5 hours per deliverable, plus a trust problem: stakeholders can tell when quality depends on who did the work.",
    mid: "Outputs are recognisable but uneven. The 30 to 40% excess senior review time is a symptom, not the root cause. The real issue: your team's quality ceiling is determined by individual capability, not collective knowledge.",
    high: "Stakeholders get your team's quality standard regardless of who delivers. That is a genuine competitive moat. You can grow the team without diluting what makes your work distinctive.",
  },
  knowledge_compounding: {
    low: "Your team pays for the same learning curve every project. When someone figures out a better prompting approach or workflow, it stays with them. You are funding individual experiments, not building collective capability.",
    mid: "Knowledge spreads, but it takes 4 to 6 weeks for a good technique to reach the whole team, if it ever does. The real cost is not the delay. It is that each project starts from scratch instead of standing on the shoulders of the last one.",
    high: "Each project genuinely makes the next one better. Your team's collective capability compounds rather than resets, and survives turnover. This is what separates high-growth teams from the rest.",
  },
  collective_visibility: {
    low: "You have zero visibility into how your team uses AI day-to-day. You cannot answer: who is struggling, who found a breakthrough, or whether AI is actually improving output quality. You are managing a black box.",
    mid: "You have anecdotal visibility through hallway conversations and occasional Slack shares. But the question that matters is unanswerable: is your AI investment making the team more capable, or just faster at mediocre work?",
    high: "Your team can see how colleagues navigate complexity with AI, especially juniors learning from seniors. This is how institutional expertise actually transfers in the AI age.",
  },
  learning_velocity: {
    low: "Projects end and lessons vanish. After 6+ months of AI tool investment, your team's approach has not meaningfully changed. You are spending on licenses but not building capability.",
    mid: "Some learning happens, but it takes a quarter to change how the team works. While your team iterates slowly, competitors who learn faster compound their advantage every month.",
    high: "New techniques reach your whole team within days. In a landscape where AI capabilities change monthly, this speed of adaptation is a genuine strategic advantage.",
  },
};

const STRATEGIC_CONSEQUENCES: Record<string, { low: string; mid: string; high: string }> = {
  standard_internalization: {
    low: "Which means you cannot scale output without scaling your most experienced people. Every new hire multiplies supervision load instead of reducing it.",
    mid: "Which means your growth is throttled by onboarding speed. New people take months to reach the quality bar your best people hit naturally.",
    high: "Which means you can take on more work without proportionally adding senior oversight. Your methodology is doing the quality control, not your calendar.",
  },
  output_consistency: {
    low: "Which means your team's output quality is unpredictable. Stakeholders notice, even if they do not say it yet.",
    mid: "Which means your capacity ceiling is set by your strongest operators, not your team size.",
    high: "Which means your output quality holds as you grow. Consistency lets you systematise execution and focus senior time on strategy.",
  },
  knowledge_compounding: {
    low: "Which means your team is getting linearly better at best while competitors who compound knowledge are improving exponentially. After 12 months, that gap is a different league.",
    mid: "Which means you are one resignation away from losing capabilities you cannot rebuild. Tribal knowledge that is not codified is organisational risk.",
    high: "Which means your competitive advantage accelerates over time. Every project deposits knowledge that makes the next one faster, cheaper, or higher quality.",
  },
  collective_visibility: {
    low: "Which means your leadership decisions about AI investment are based on anecdote, not evidence. You are allocating budget to tools you cannot measure.",
    mid: "Which means you are making workforce and resource planning decisions blind. You do not know which roles AI is genuinely augmenting.",
    high: "Which means you can make data-informed decisions about where AI creates value and where it does not.",
  },
  learning_velocity: {
    low: "Which means competitors who learn faster will compound their advantage every quarter. The gap after 12 months is not linear. It is exponential.",
    mid: "Which means you are adopting AI capabilities 3 to 6 months behind the curve. That delay translates directly to lost competitive positioning.",
    high: "Which means you are turning AI evolution speed into a strategic advantage. Speed of adaptation is the meta-skill that makes every other capability more valuable.",
  },
};

// ── PDF Report Generator ──
interface PdfContext {
  overall: number;
  archetype: { label: string; tagline: string; action: string };
  dimensions: DimensionScore[];
  actionPlan: { steps: { title: string; manual_how: string; platform_how: string }[] };
  weakest: DimensionScore;
  secondWeakest: DimensionScore;
  isAbove55: boolean;
  companyName: string | null;
}

async function generateReportPdf(ctx: PdfContext): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const W = 595.28; // A4 width
  const H = 841.89; // A4 height
  const M = 50; // margin
  const CW = W - 2 * M; // content width
  const brandBlue = rgb(0.01, 0.52, 0.78); // #0284c7
  const darkText = rgb(0.1, 0.1, 0.12);
  const mutedText = rgb(0.39, 0.45, 0.53);
  const red = rgb(0.86, 0.15, 0.15);
  const amber = rgb(0.85, 0.53, 0.08);
  const green = rgb(0.09, 0.64, 0.36);
  const lightBg = rgb(0.97, 0.98, 0.99);

  function scoreRgb(score: number) {
    return score <= 33 ? red : score <= 66 ? amber : green;
  }

  // Wrap text into lines that fit within maxWidth
  function wrapText(text: string, font: typeof helvetica, fontSize: number, maxWidth: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // Draw wrapped text, return final Y position
  function drawWrapped(
    page: ReturnType<typeof doc.addPage>,
    text: string,
    x: number,
    y: number,
    font: typeof helvetica,
    fontSize: number,
    color: typeof darkText,
    maxWidth: number,
    lineHeight = 1.4,
  ): number {
    const lines = wrapText(text, font, fontSize, maxWidth);
    let curY = y;
    for (const line of lines) {
      if (curY < M + 30) {
        page = doc.addPage([W, H]);
        curY = H - M;
      }
      page.drawText(line, { x, y: curY, size: fontSize, font, color });
      curY -= fontSize * lineHeight;
    }
    return curY;
  }

  // Track current page so drawWrapped can add pages
  let currentPage = doc.addPage([W, H]);
  let y = H - M;

  // Helper to get/create page with auto-pagination
  function ensureSpace(needed: number): void {
    if (y < M + needed) {
      currentPage = doc.addPage([W, H]);
      y = H - M;
    }
  }

  function drawText(text: string, x: number, yPos: number, opts: { size: number; font: typeof helvetica; color: typeof darkText }) {
    currentPage.drawText(text, { x, y: yPos, ...opts });
  }

  function drawSection(title: string) {
    ensureSpace(60);
    y -= 10;
    currentPage.drawRectangle({ x: M, y: y - 2, width: CW, height: 1, color: rgb(0.88, 0.91, 0.94) });
    y -= 24;
    drawText(title.toUpperCase(), M, y, { size: 9, font: helveticaBold, color: brandBlue });
    y -= 20;
  }

  // ══════════════════════════════════════════
  // PAGE 1: EXECUTIVE SUMMARY
  // ══════════════════════════════════════════

  // Header
  drawText("LIZA OS", M, y, { size: 10, font: helveticaBold, color: brandBlue });
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const dateW = helvetica.widthOfTextAtSize(dateStr, 9);
  drawText(dateStr, W - M - dateW, y, { size: 9, font: helvetica, color: mutedText });
  y -= 30;

  drawText("AI Execution Diagnostic Report", M, y, { size: 22, font: helveticaBold, color: darkText });
  y -= 18;
  if (ctx.companyName) {
    drawText(`Prepared for ${ctx.companyName}`, M, y, { size: 11, font: helvetica, color: mutedText });
    y -= 16;
  }
  y -= 20;

  // Score block
  const scoreStr = String(ctx.overall);
  const scoreFontSize = 72;
  const scoreW = helveticaBold.widthOfTextAtSize(scoreStr, scoreFontSize);
  const scoreBlockX = M;

  // Score background
  currentPage.drawRectangle({ x: M, y: y - 85, width: CW, height: 110, color: lightBg, borderColor: rgb(0.88, 0.91, 0.94), borderWidth: 1 });

  drawText(scoreStr, scoreBlockX + 20, y - 65, { size: scoreFontSize, font: helveticaBold, color: scoreRgb(ctx.overall) });

  // Archetype info next to score
  const infoX = scoreBlockX + scoreW + 50;
  drawText(ctx.archetype.label, infoX, y - 20, { size: 16, font: helveticaBold, color: darkText });
  const tagLines = wrapText(ctx.archetype.tagline, helvetica, 10, CW - scoreW - 80);
  let tagY = y - 38;
  for (const line of tagLines) {
    drawText(line, infoX, tagY, { size: 10, font: helvetica, color: mutedText });
    tagY -= 14;
  }

  // Benchmark line
  drawText(`Industry avg: 35  |  You: ${ctx.overall}  |  ${ctx.isAbove55 ? "Top 1%: 75+" : "Structured: 55+"}`, infoX, tagY - 4, { size: 9, font: helveticaBold, color: mutedText });

  y -= 110;
  y -= 20;

  // Dimension scores table
  drawSection("Dimension Scores");

  for (const d of ctx.dimensions) {
    ensureSpace(30);
    const label = FRIENDLY_LABELS[d.dimension] || d.label;
    drawText(label, M, y, { size: 10, font: helveticaBold, color: darkText });

    // Score bar
    const barX = M + 140;
    const barW = CW - 180;
    const barH = 8;
    currentPage.drawRectangle({ x: barX, y: y - 1, width: barW, height: barH, color: rgb(0.93, 0.94, 0.96) });
    currentPage.drawRectangle({ x: barX, y: y - 1, width: barW * (d.score / 100), height: barH, color: brandBlue });

    const scoreLabel = `${d.score}`;
    const scoreLabelW = helveticaBold.widthOfTextAtSize(scoreLabel, 10);
    drawText(scoreLabel, W - M - scoreLabelW, y, { size: 10, font: helveticaBold, color: scoreRgb(d.score) });

    y -= 24;
  }

  // ══════════════════════════════════════════
  // DIMENSION DEEP DIVE
  // ══════════════════════════════════════════
  drawSection("Dimension Analysis");

  for (const d of ctx.dimensions) {
    ensureSpace(120);
    const label = FRIENDLY_LABELS[d.dimension] || d.label;
    const tier = d.score <= 33 ? "low" : d.score <= 66 ? "mid" : "high";

    // Dimension header with score
    drawText(`${label}: ${d.score}/100`, M, y, { size: 12, font: helveticaBold, color: darkText });
    y -= 16;

    // Description
    const desc = DIMENSION_DESCRIPTIONS[d.dimension] || "";
    if (desc) {
      const descLines = wrapText(desc, helvetica, 8.5, CW);
      for (const line of descLines) {
        ensureSpace(14);
        drawText(line, M, y, { size: 8.5, font: helvetica, color: mutedText });
        y -= 12;
      }
      y -= 4;
    }

    // Insight
    const insightLines = wrapText(d.insight, helvetica, 9.5, CW);
    for (const line of insightLines) {
      ensureSpace(14);
      drawText(line, M, y, { size: 9.5, font: helvetica, color: darkText });
      y -= 13;
    }
    y -= 4;

    // Cost translation
    const cost = COST_TRANSLATIONS[d.dimension]?.[tier];
    if (cost) {
      ensureSpace(16);
      drawText("What this costs your team:", M, y, { size: 9, font: helveticaBold, color: d.score <= 66 ? red : green });
      y -= 14;
      const costLines = wrapText(cost, helvetica, 9, CW - 10);
      for (const line of costLines) {
        ensureSpace(13);
        drawText(line, M + 10, y, { size: 9, font: helvetica, color: darkText });
        y -= 13;
      }
      y -= 4;
    }

    // Strategic consequence
    const conseq = STRATEGIC_CONSEQUENCES[d.dimension]?.[tier];
    if (conseq) {
      ensureSpace(16);
      drawText("Strategic implication:", M, y, { size: 9, font: helveticaBold, color: brandBlue });
      y -= 14;
      const cLines = wrapText(conseq, helvetica, 9, CW - 10);
      for (const line of cLines) {
        ensureSpace(13);
        drawText(line, M + 10, y, { size: 9, font: helvetica, color: darkText });
        y -= 13;
      }
    }

    y -= 20;
  }

  // ══════════════════════════════════════════
  // ACTION PLAN
  // ══════════════════════════════════════════
  drawSection("Your Personalised Action Plan");

  const wLabel = FRIENDLY_LABELS[ctx.weakest.dimension] || ctx.weakest.label;
  const sLabel = FRIENDLY_LABELS[ctx.secondWeakest.dimension] || ctx.secondWeakest.label;
  drawText(`Driven by: ${wLabel} (${ctx.weakest.score}/100) and ${sLabel} (${ctx.secondWeakest.score}/100)`, M, y, { size: 9, font: helvetica, color: mutedText });
  y -= 20;

  for (let i = 0; i < ctx.actionPlan.steps.length; i++) {
    const step = ctx.actionPlan.steps[i];
    ensureSpace(80);

    drawText(`Step ${i + 1}: ${step.title}`, M, y, { size: 11, font: helveticaBold, color: darkText });
    y -= 18;

    drawText("Start here:", M + 10, y, { size: 9, font: helveticaBold, color: darkText });
    y -= 14;
    const manualLines = wrapText(step.manual_how, helvetica, 9, CW - 20);
    for (const line of manualLines) {
      ensureSpace(13);
      drawText(line, M + 10, y, { size: 9, font: helvetica, color: darkText });
      y -= 13;
    }
    y -= 6;

    const platLines = wrapText(step.platform_how, helvetica, 9, CW - 20);
    for (const line of platLines) {
      ensureSpace(13);
      drawText(line, M + 10, y, { size: 9, font: helvetica, color: brandBlue });
      y -= 13;
    }

    y -= 16;
  }

  // ══════════════════════════════════════════
  // LEAD / LAG METRICS
  // ══════════════════════════════════════════
  drawSection("Metrics For Your Two Weakest Areas");

  const metricsData: Record<string, { lead: string; lag: string }> = {
    standard_internalization: {
      lead: "% of AI sessions where your team's reference doc is loaded before prompting",
      lag: "Reduction in senior review/correction time per deliverable",
    },
    output_consistency: {
      lead: "% of deliverables self-checked against a quality reference before submission",
      lag: "Variance in peer-review scores across team members (narrowing)",
    },
    knowledge_compounding: {
      lead: "# of learnings formally promoted to the shared reference per month",
      lag: "Time spent on problems a colleague already solved (trending down)",
    },
    collective_visibility: {
      lead: "# of show-and-tell or paired observation sessions held per month",
      lag: "Junior team members' confidence in AI-assisted tasks (quarterly survey)",
    },
    learning_velocity: {
      lead: "# of shared learnings validated on real work (not just discussed)",
      lag: "Average cycle time from learning surfaced to team-wide adoption",
    },
  };

  for (const d of [ctx.weakest, ctx.secondWeakest]) {
    const m = metricsData[d.dimension];
    if (!m) continue;
    const label = FRIENDLY_LABELS[d.dimension] || d.label;
    ensureSpace(60);

    drawText(`${label} (${d.score}/100)`, M, y, { size: 10, font: helveticaBold, color: darkText });
    y -= 16;
    drawText("Lead indicator:", M + 10, y, { size: 8.5, font: helveticaBold, color: green });
    y -= 12;
    const leadLines = wrapText(m.lead, helvetica, 8.5, CW - 20);
    for (const line of leadLines) {
      ensureSpace(12);
      drawText(line, M + 10, y, { size: 8.5, font: helvetica, color: darkText });
      y -= 12;
    }
    y -= 4;
    drawText("Lag indicator:", M + 10, y, { size: 8.5, font: helveticaBold, color: brandBlue });
    y -= 12;
    const lagLines = wrapText(m.lag, helvetica, 8.5, CW - 20);
    for (const line of lagLines) {
      ensureSpace(12);
      drawText(line, M + 10, y, { size: 8.5, font: helvetica, color: darkText });
      y -= 12;
    }
    y -= 14;
  }

  // ══════════════════════════════════════════
  // COMPARISON TABLE
  // ══════════════════════════════════════════
  const targetLabel = ctx.isAbove55 ? "Top 1% teams (75+)" : "Codified teams (55+)";
  drawSection(`You (${ctx.overall}) vs. ${targetLabel}`);

  const compRows = ctx.isAbove55
    ? [
        ["AI standards", "Documented but unevenly applied", "Embedded in every session automatically"],
        ["Knowledge capture", "Happens when someone remembers", "Systematic, after every session"],
        ["Team learning", "Shared in meetings, adopted slowly", "Compounding: each project lifts the next"],
        ["Quality assurance", "Manual review catches gaps", "Built into the process, not bolted on"],
        ["Competitive moat", "Improving steadily", "Widening gap every quarter"],
      ]
    : [
        ["AI session prep", "Re-explain from scratch", "Standards loaded automatically"],
        ["Output quality", "Depends who does it", "Consistent regardless"],
        ["New technique found", "Stays with one person", "Reaches whole team in days"],
        ["Senior review", "Catching basic errors", "Focused on strategy"],
        ["AI ROI", "Cannot measure it", "Tracked and reported"],
      ];

  // Table header
  ensureSpace(30);
  const col1X = M;
  const col2X = M + 130;
  const col3X = M + 330;

  drawText("", col1X, y, { size: 8, font: helveticaBold, color: mutedText });
  drawText(`You (${ctx.overall})`, col2X, y, { size: 8, font: helveticaBold, color: scoreRgb(ctx.overall) });
  drawText(targetLabel, col3X, y, { size: 8, font: helveticaBold, color: brandBlue });
  y -= 14;
  currentPage.drawRectangle({ x: M, y: y + 4, width: CW, height: 0.5, color: rgb(0.88, 0.91, 0.94) });

  for (const [cat, you, them] of compRows) {
    ensureSpace(16);
    drawText(cat, col1X, y, { size: 8.5, font: helvetica, color: mutedText });
    drawText(you, col2X, y, { size: 8.5, font: helvetica, color: ctx.isAbove55 ? amber : red });
    drawText(them, col3X, y, { size: 8.5, font: helvetica, color: brandBlue });
    y -= 16;
  }

  // ══════════════════════════════════════════
  // FOOTER / CTA
  // ══════════════════════════════════════════
  ensureSpace(60);
  y -= 10;
  currentPage.drawRectangle({ x: M, y: y - 2, width: CW, height: 1, color: rgb(0.88, 0.91, 0.94) });
  y -= 20;
  drawText("Ready to close these gaps structurally?", M, y, { size: 11, font: helveticaBold, color: darkText });
  y -= 16;
  drawText("Book a 20-minute Diagnostic Debrief. We unpack your score, map each gap to the", M, y, { size: 9, font: helvetica, color: mutedText });
  y -= 13;
  drawText("behaviours driving it, and show you how LIZA OS makes it automatic.", M, y, { size: 9, font: helvetica, color: mutedText });
  y -= 16;
  drawText("Book at: calendar.app.google/3v8jevUcsgRQnLyL9", M, y, { size: 9, font: helveticaBold, color: brandBlue });
  y -= 24;
  drawText("LIZA OS  |  The management layer for AI-powered teams  |  lizaos.ai", M, y, { size: 7.5, font: helvetica, color: mutedText });

  // Add page numbers
  const pages = doc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const numStr = `${i + 1} / ${pages.length}`;
    const numW = helvetica.widthOfTextAtSize(numStr, 8);
    p.drawText(numStr, { x: W - M - numW, y: 25, size: 8, font: helvetica, color: mutedText });
  }

  return await doc.save();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, respondent_role, team_size, team_leader_email, overall, archetype, dimensions, answers, scores, session_id, diagnostic_result_id, results_base_url } =
      (await req.json()) as RequestBody;

    if (!email?.trim()) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // ── Step 1: Enrich company/industry from email domain ──
    const FREE_DOMAINS = new Set([
      "gmail.com","yahoo.com","hotmail.com","outlook.com","aol.com",
      "icloud.com","mail.com","protonmail.com","zoho.com","live.com",
      "ymail.com","gmx.com","fastmail.com","tutanota.com","pm.me",
      "hey.com","me.com","msn.com","googlemail.com",
    ]);

    const emailDomain = email.trim().split("@")[1]?.toLowerCase() || "";
    const isPersonalEmail = FREE_DOMAINS.has(emailDomain);

    let companyName: string | null = null;
    let industry: string | null = null;
    let industryRefined: string | null = null;

    if (!isPersonalEmail && emailDomain) {
      try {
        const enrichPrompt = `Given the email domain "${emailDomain}", identify the company name and classify it into TWO industry levels.

Return ONLY valid JSON: {"company_name": "...", "industry": "...", "industry_refined": "..."}

"industry" should be a broad label: "Technology", "Consulting", "Financial Services", "Healthcare", "Manufacturing", "Education", "Retail", "Energy", "Media", "Government", "Legal", "Real Estate", "Telecommunications", "Automotive", "Logistics", "Pharma", "Insurance", "Hospitality", "Non-profit", "Other".

"industry_refined" should be a MORE SPECIFIC sub-category that distinguishes between similar companies. Examples:
- Instead of just "Technology": use "Product / SaaS", "IT Services / Outsourcing", "Digital Agency", "AI / ML", "Developer Tools", "Enterprise Software", "Hardware / IoT"
- Instead of just "Consulting": use "Management Consulting", "IT Consulting", "Strategy Consulting", "HR Consulting"
- Instead of just "Financial Services": use "Banking", "Insurance", "FinTech", "Wealth Management"

Be specific. If a company builds and sells software products, they are "Product / SaaS", not just "Technology". If they do IT projects for clients, they are "IT Services / Outsourcing" or "IT Consulting".

If you cannot determine, use null for that field.`;

        const enrichResp = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-lite",
              messages: [{ role: "user", content: enrichPrompt }],
              temperature: 0.1,
            }),
          }
        );

        if (enrichResp.ok) {
          const enrichData = await enrichResp.json();
          let raw = enrichData.choices?.[0]?.message?.content || "";
          raw = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
          try {
            const parsed = JSON.parse(raw);
            companyName = parsed.company_name || null;
            industry = parsed.industry || null;
            industryRefined = parsed.industry_refined || null;
          } catch {
            console.error("Failed to parse enrichment:", raw);
          }
        }
      } catch (e) {
        console.error("Domain enrichment failed:", e);
      }
    }

    // ── Step 1a: Auto-derive role tier from respondent_role ──
    let roleTier: string | null = null;
    if (respondent_role) {
      const r = respondent_role.toLowerCase();
      if (/\b(ceo|cto|cro|cfo|coo|cio|cmo|chief|founder|co-founder|cofounder|owner|partner|managing director)\b/.test(r)) {
        roleTier = "C-Level";
      } else if (/\b(vp|vice president|director|head of|svp|evp)\b/.test(r)) {
        roleTier = "VP / Director";
      } else if (/\b(manager|team lead|lead|supervisor|principal)\b/.test(r)) {
        roleTier = "Manager / Lead";
      } else {
        roleTier = "Individual Contributor";
      }
    }

    // ── Step 1b: Persist lead data reliably (update existing, then fallback to session, then insert) ──
    const normalizedScores =
      scores && Object.keys(scores).length > 0
        ? scores
        : Object.fromEntries((dimensions || []).map((d) => [d.dimension, d.score]));

    const normalizedAnswers = answers && Object.keys(answers).length > 0 ? answers : {};

    const normalizedTeamLeaderEmail = team_leader_email?.trim().toLowerCase() || null;

    const leadPayload: Record<string, unknown> = {
      email: email.trim(),
      respondent_role: respondent_role?.trim() || null,
      team_size: team_size || null,
      team_leader_email: normalizedTeamLeaderEmail,
      company_name: companyName,
      industry,
      industry_refined: industryRefined,
      role_tier: roleTier,
    };

    let resolvedDiagnosticRecordId: string | null = diagnostic_result_id || null;

    if (resolvedDiagnosticRecordId) {
      const { data: updatedRow, error: updateErr } = await supabaseAdmin
        .from("diagnostic_results")
        .update(leadPayload)
        .eq("id", resolvedDiagnosticRecordId)
        .select("id")
        .maybeSingle();

      if (updateErr) {
        console.error("Email attach by id failed:", updateErr);
      }

      if (!updatedRow?.id) {
        resolvedDiagnosticRecordId = null;
      }
    }

    if (!resolvedDiagnosticRecordId && session_id) {
      const { data: sessionRow, error: sessionLookupErr } = await supabaseAdmin
        .from("diagnostic_results")
        .select("id, email")
        .eq("session_id", session_id)
        .maybeSingle();

      if (sessionLookupErr) {
        console.error("Session lookup failed:", sessionLookupErr);
      }

      if (sessionRow?.id) {
        resolvedDiagnosticRecordId = sessionRow.id;
        if (!sessionRow.email) {
          const { error: sessionUpdateErr } = await supabaseAdmin
            .from("diagnostic_results")
            .update(leadPayload)
            .eq("id", sessionRow.id);

          if (sessionUpdateErr) {
            console.error("Email attach by session_id failed:", sessionUpdateErr);
          }
        }
      }
    }

    if (!resolvedDiagnosticRecordId) {
      const insertPayload = {
        session_id: session_id || null,
        answers: normalizedAnswers,
        scores: normalizedScores,
        archetype: archetype?.label || "Unknown",
        overall_score: overall,
        ...leadPayload,
      };

      const { data: insertedRow, error: insertErr } = await supabaseAdmin
        .from("diagnostic_results")
        .insert(insertPayload)
        .select("id")
        .single();

      if (insertErr) {
        console.error("Fallback insert failed:", insertErr);
        throw new Error("Could not persist diagnostic submission");
      }

      resolvedDiagnosticRecordId = insertedRow.id;
    }

    // ── Step 2: Generate AI action plan ──
    const sorted = [...dimensions].sort((a, b) => a.score - b.score);
    const weakest = sorted[0];
    const secondWeakest = sorted[1];

    // Determine tier-appropriate benchmark target
    const isAbove55 = overall >= 55;
    const targetBenchmark = isAbove55 ? 75 : 55;
    const targetLabel = isAbove55 ? "top 1% teams (75+)" : "codified teams (55+)";
    const aspirationFrame = isAbove55
      ? `This team already scores above 55, placing them in structured territory. The next frontier is 75+, the top 1%, where AI execution becomes a genuine competitive moat. Frame the plan as "What separates top 1% teams (75+) from structured teams." Focus on compounding advantages, institutional memory, and systematic excellence rather than basics.`
      : `Frame the plan as "What teams who score 55+ do differently." This is aspirational, not remedial.`;

    const prompt = `You are an expert advisor on AI execution maturity for operational leaders at mid-market firms (50-1000 employees, sweet spot 50-250).

A team just completed an AI Execution Diagnostic and scored ${overall}/100 overall. Their archetype is "${archetype.label}": ${archetype.tagline}

Their weakest dimension is "${weakest.label}" (${weakest.score}/100): ${weakest.insight}
Their second weakest is "${secondWeakest.label}" (${secondWeakest.score}/100): ${secondWeakest.insight}

For context: the industry average AI execution maturity score is 35/100, based on ServiceNow's 2025 Enterprise AI Maturity Index (4,500 executives surveyed). Fewer than 1% of organisations score above 50. Teams with defined, codified AI standards score 55+. Top 1% teams score 75+, where AI execution becomes a compounding competitive advantage.

${aspirationFrame} Requirements:
1. Each step should be concrete and actionable within 1-2 weeks
2. IMPORTANT: Step 1 must be something ONE person can do alone, today, in under 30 minutes. This lowers activation energy and creates immediate momentum.
3. For each step, include:
   - A clear action title (5-8 words, framed as what high-performers do)
   - What to do manually (2-3 sentences, the "start here" approach)
   - How LIZA OS makes this structural and automatic (1-2 sentences, always start with "With the right infrastructure, like LIZA OS..." to name the platform explicitly)
4. Steps should progress: individual action → codification → compounding
5. Use second person ("you", "your team")
6. Be specific to their archetype and weakest dimensions, not generic advice
7. Use their language: "playbook", "what good looks like", "our way of doing things". Not "governance", "knowledge management"
8. IMPORTANT: Do not use em-dashes anywhere. Use periods, commas, or colons instead.

Return ONLY valid JSON in this exact format:
{
  "steps": [
    {
      "title": "Step title here",
      "manual_how": "What they'd do manually...",
      "platform_how": "How infrastructure makes this structural..."
    }
  ]
}`;

    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      }
    );

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);
      throw new Error(`AI gateway error: ${aiResp.status}`);
    }

    const aiData = await aiResp.json();
    let rawContent = aiData.choices?.[0]?.message?.content || "";
    rawContent = rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let actionPlan: { steps: { title: string; manual_how: string; platform_how: string }[] };
    try {
      actionPlan = JSON.parse(rawContent);
    } catch {
      console.error("Failed to parse AI response:", rawContent);
      actionPlan = {
        steps: [
          {
            title: `Address your ${weakest.label} gap`,
            manual_how: `Start by auditing how your team currently handles ${weakest.label.toLowerCase()}. Identify one recurring task where the gap is most visible and document the current approach vs. the ideal.`,
            platform_how: "With the right infrastructure, like LIZA OS, this audit is automated. The system surfaces gaps and suggests improvements based on your team's actual usage patterns.",
          },
          {
            title: "Create one shared reference point",
            manual_how: "Pick your highest-value workflow and write down the team's best approach. Share it in a doc everyone can access and reference before AI sessions.",
            platform_how: "With the right infrastructure, like LIZA OS, these references are embedded directly into every AI session. No manual lookup needed.",
          },
          {
            title: "Establish a weekly feedback loop",
            manual_how: "Block 15 minutes each week for the team to share what worked and what didn't with AI. Capture the best insights and update your shared reference.",
            platform_how: "With the right infrastructure, like LIZA OS, session reviews are structured and insights automatically feed back into the team's evolving standards.",
          },
        ],
      };
    }

    // ── Step 3: Persist action plan back to the record ──
    if (resolvedDiagnosticRecordId) {
      await supabaseAdmin
        .from("diagnostic_results")
        .update({ email_action_plan: actionPlan })
        .eq("id", resolvedDiagnosticRecordId)
        .then(({ error }) => {
          if (error) console.error("Failed to store action plan:", error);
        });
    }

    // ── Step 3b: Generate PDF report ──
    let pdfBase64: string | null = null;
    try {
      const pdfBytes = await generateReportPdf({
        overall,
        archetype,
        dimensions,
        actionPlan,
        weakest,
        secondWeakest,
        isAbove55,
        companyName,
      });
      // Convert Uint8Array to base64
      const binStr = Array.from(pdfBytes).map(b => String.fromCharCode(b)).join("");
      pdfBase64 = btoa(binStr);
    } catch (pdfErr) {
      console.error("PDF generation failed (non-blocking):", pdfErr);
    }

    // ── Step 4: Build and send user email ──
    const scoreColor =
      overall <= 30 ? "#dc2626"
        : overall <= 55 ? "#f59e0b"
        : overall <= 75 ? "#0284c7"
        : "#16a34a";

    const dimensionRows = dimensions
      .map(
        (d) => {
          const label = FRIENDLY_LABELS[d.dimension] || d.label;
          return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:14px;color:#1a1a2e;font-weight:600;">${label}</span>
          </td>
          <td style="padding:8px 12px;font-size:14px;font-weight:600;color:${d.score <= 33 ? "#dc2626" : d.score <= 66 ? "#f59e0b" : "#16a34a"};text-align:right;border-bottom:1px solid #f0f0f0;">${d.score}/100</td>
        </tr>`;
        }
      )
      .join("");

    const resultsUrl = resolvedDiagnosticRecordId
      ? `${results_base_url || 'https://iza-flow.lovable.app'}/diagnostic?result=${resolvedDiagnosticRecordId}`
      : null;

    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    
    <!-- Header with score -->
    <div style="text-align:center;margin-bottom:20px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Your AI Execution Score</p>
      <p style="margin:0;font-size:56px;font-weight:900;color:${scoreColor};line-height:1;">${overall}</p>
      <p style="margin:8px 0 0;font-size:18px;font-weight:700;color:#1a1a2e;">${archetype.label}</p>
      <p style="margin:8px 0 0;font-size:14px;color:#64748b;line-height:1.5;">${archetype.tagline}</p>
      <div style="margin:14px auto 0;padding:10px 16px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;display:inline-block;">
        <p style="margin:0;font-size:13px;color:#0369a1;font-weight:600;">📎 Your full AI Execution Report is attached as a PDF — save it, share it with your team, or bring it to your debrief call.</p>
      </div>
      ${resultsUrl ? `<p style="margin:10px 0 0;"><a href="${resultsUrl}" style="font-size:12px;color:#0284c7;font-weight:600;text-decoration:underline;">Or view your interactive results online →</a></p>` : ""}
    </div>

    <!-- Benchmark context -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;padding:8px 16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
        <span style="font-size:12px;color:#64748b;">Industry avg: <strong>35</strong></span>
        <span style="margin:0 8px;color:#e2e8f0;">|</span>
        <span style="font-size:12px;color:${scoreColor};font-weight:700;">You: ${overall}</span>
        <span style="margin:0 8px;color:#e2e8f0;">|</span>
        <span style="font-size:12px;color:#64748b;">${isAbove55 ? 'Top 1% teams: <strong>75+</strong>' : 'Codified teams: <strong>55+</strong>'}</span>
      </div>
    </div>

    <!-- Dimension scores -->
    <div style="margin-bottom:24px;">
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Your Breakdown</p>
      <table style="width:100%;border-collapse:collapse;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        ${dimensionRows}
      </table>
    </div>

    <!-- Action Plan -->
    <div style="margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:18px;font-weight:800;color:#1a1a2e;">Your Personalised Action Plan</p>
      <div style="margin-bottom:12px;">
        <span style="display:inline-block;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;background:${weakest.score <= 33 ? "#fef2f2" : "#fffbeb"};color:${weakest.score <= 33 ? "#dc2626" : "#d97706"};margin-right:6px;">${FRIENDLY_LABELS[weakest.dimension] || weakest.label}: ${weakest.score}/100</span>
        <span style="display:inline-block;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;background:${secondWeakest.score <= 33 ? "#fef2f2" : "#fffbeb"};color:${secondWeakest.score <= 33 ? "#dc2626" : "#d97706"};margin-right:6px;">${FRIENDLY_LABELS[secondWeakest.dimension] || secondWeakest.label}: ${secondWeakest.score}/100</span>
        <span style="font-size:12px;color:#94a3b8;">← driving this plan</span>
      </div>
      ${actionPlan.steps
        .map(
          (s, i) => `
        <div style="margin-bottom:16px;padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid #0284c7;">
          <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#1a1a2e;">Step ${i + 1}: ${s.title}${i === 0 ? ' <span style="font-size:11px;font-weight:600;color:#0284c7;">(you can do this one alone, today)</span>' : ''}</p>
          <p style="margin:0 0 8px;font-size:13px;color:#475569;line-height:1.5;">
            <strong style="color:#1a1a2e;">Start here:</strong> ${s.manual_how}
          </p>
          <p style="margin:0;font-size:13px;color:#0284c7;line-height:1.5;">
            🏗️ ${s.platform_how}
          </p>
        </div>`
        )
        .join("")}
    </div>

    <!-- Lead/Lag metrics for weak dimensions -->
    <div style="margin-bottom:24px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#1a1a2e;">Metrics for your two weakest areas</p>
      <p style="margin:0 0 14px;font-size:12px;color:#64748b;">Track these signals as you implement. Lead indicators confirm habits are forming. Lag indicators confirm business results are following.</p>
      ${[weakest, secondWeakest].map(d => {
        const label = FRIENDLY_LABELS[d.dimension] || d.label;
        const metrics: Record<string, { lead: string; lag: string }> = {
          standard_internalization: {
            lead: "% of AI sessions where your team's reference doc is loaded before prompting",
            lag: "Reduction in senior review/correction time per deliverable",
          },
          output_consistency: {
            lead: "% of deliverables self-checked against a quality reference before submission",
            lag: "Variance in peer-review scores across team members (narrowing)",
          },
          knowledge_compounding: {
            lead: "# of learnings formally promoted to the shared reference per month",
            lag: "Time spent on problems a colleague already solved (trending down)",
          },
          collective_visibility: {
            lead: "# of show-and-tell or paired observation sessions held per month",
            lag: "Junior team members' confidence in AI-assisted tasks (quarterly survey)",
          },
          learning_velocity: {
            lead: "# of shared learnings validated on real work (not just discussed)",
            lag: "Average cycle time from learning surfaced to team-wide adoption",
          },
        };
        const m = metrics[d.dimension];
        if (!m) return "";
        return `
        <div style="margin-bottom:12px;${d === secondWeakest ? "" : "padding-bottom:12px;border-bottom:1px solid #e2e8f0;"}">
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1a1a2e;">${label} <span style="font-size:12px;font-weight:600;color:${d.score <= 33 ? "#dc2626" : "#f59e0b"};">(${d.score}/100)</span></p>
          <p style="margin:0 0 4px;font-size:12px;color:#475569;">
            <span style="color:#16a34a;font-weight:600;">▲ Lead:</span> ${m.lead}
          </p>
          <p style="margin:0;font-size:12px;color:#475569;">
            <span style="color:#0284c7;font-weight:600;">▼ Lag:</span> ${m.lag}
          </p>
        </div>`;
      }).join("")}
    </div>

    <!-- Cost of Inaction: Investment Case -->
    <div style="margin-bottom:24px;padding:20px;background:linear-gradient(135deg,#fef2f2 0%,#fff7ed 100%);border-radius:10px;border:1px solid #fecaca;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#dc2626;">Cost of Inaction</p>
      <p style="margin:0 0 6px;font-size:16px;font-weight:800;color:#1a1a2e;">What this gap typically costs</p>
      <p style="margin:0 0 16px;font-size:13px;color:#64748b;line-height:1.5;">Based on patterns across organisations scoring ${overall <= 40 ? "25 to 40" : overall <= 55 ? "40 to 55" : "55 to 70"} on this diagnostic.</p>
      ${(() => {
        const costData: Record<string, { title: string; lines: { icon: string; label: string; detail: string }[] }> = {
          standard_internalization: {
            title: "Standards Adoption",
            lines: overall <= 40 ? [
              { icon: "⏱", label: "Wasted effort", detail: "5 to 10 hrs/week re-explaining context AI should already have" },
              { icon: "⚠️", label: "Governance risk", detail: "No way to ensure AI outputs meet your methodology. Quality depends on who prompts, not what your team knows" },
              { icon: "📉", label: "Senior drag", detail: "Your strongest people review basics instead of doing strategic work. That is the most expensive hour on your payroll, spent on correction" },
            ] : [
              { icon: "⏱", label: "Residual waste", detail: "2 to 4 hrs/week still lost to inconsistent context loading across the team" },
              { icon: "⚠️", label: "Governance gap", detail: "Standards exist but are unevenly applied. Some sessions follow your methodology, others do not. That variance is a compliance and quality risk" },
              { icon: "📉", label: "Onboarding drag", detail: "New hires take months to absorb standards that should be embedded in the process from day one" },
            ],
          },
          output_consistency: {
            title: "Delivery Consistency",
            lines: overall <= 40 ? [
              { icon: "⏱", label: "Rework cost", detail: "3 to 5 hours of rework per deliverable when output quality depends on who did the work" },
              { icon: "⚠️", label: "Quality risk", detail: "Stakeholders receive inconsistent quality. Trust erodes before anyone says it out loud" },
              { icon: "📉", label: "Scaling ceiling", detail: "You cannot grow the team without diluting what makes your work distinctive. Every hire multiplies the variance" },
            ] : [
              { icon: "⏱", label: "Review overhead", detail: "30 to 40% excess senior review time spent catching inconsistencies that a shared standard would prevent" },
              { icon: "⚠️", label: "Key-person dependency", detail: "Quality is tied to specific individuals, not to your team's collective capability. That is a risk you carry every day" },
              { icon: "📉", label: "Capacity ceiling", detail: "Your output capacity is capped by your strongest operators, not your team size" },
            ],
          },
          knowledge_compounding: {
            title: "Knowledge Sharing",
            lines: overall <= 40 ? [
              { icon: "⏱", label: "Duplicate effort", detail: "Every person re-learns from zero. Multiply your team size by the hours lost: that is the cost of no shared memory" },
              { icon: "⚠️", label: "Turnover risk", detail: "When someone leaves, their learned capability walks out with them. No documentation, no transfer, no recovery" },
              { icon: "📉", label: "Linear growth", detail: "Your team improves at best linearly. Competitors who compound knowledge improve exponentially. After 12 months, that gap is a different league" },
            ] : [
              { icon: "⏱", label: "Adoption lag", detail: "4 to 6 weeks before a good technique reaches the whole team, if it ever does. Each project starts from scratch instead of building on the last" },
              { icon: "⚠️", label: "Fragile knowledge", detail: "Learning spreads through conversations, not systems. One reorganisation or departure resets months of progress" },
              { icon: "📉", label: "Missed compounding", detail: "Your team is improving, but each improvement deposits in individual accounts, not a shared one. The compound interest never kicks in" },
            ],
          },
          collective_visibility: {
            title: "Team Visibility",
            lines: overall <= 40 ? [
              { icon: "⏱", label: "Blind investment", detail: "Zero visibility into whether your AI spend is improving output quality or just adding a layer of noise" },
              { icon: "⚠️", label: "Governance void", detail: "You cannot govern what you cannot see. No audit trail, no usage patterns, no way to identify risk or opportunity" },
              { icon: "📉", label: "Talent waste", detail: "Senior breakthroughs stay siloed. Juniors cannot learn from how your best people navigate complexity with AI" },
            ] : [
              { icon: "⏱", label: "Anecdotal only", detail: "You know AI is being used but cannot measure whether it is making the team more capable or just faster at mediocre work" },
              { icon: "⚠️", label: "Unmeasurable ROI", detail: "Leadership asks 'is AI working?' and your honest answer is 'we think so.' That is not a position of strength" },
              { icon: "📉", label: "Missed patterns", detail: "You are making workforce and resource decisions without data on which roles AI genuinely augments versus which just use it as a search engine" },
            ],
          },
          learning_velocity: {
            title: "Improvement Speed",
            lines: overall <= 40 ? [
              { icon: "⏱", label: "Stale capability", detail: "After 6+ months of AI investment, your team's approach has not meaningfully changed. That is a negative ROI trajectory" },
              { icon: "⚠️", label: "Market blindness", detail: "New tools and techniques ship monthly. Your team cannot evaluate how the latest capabilities complement or update your value proposition" },
              { icon: "📉", label: "Compounding gap", detail: "Competitors who learn faster compound their advantage every quarter. After 12 months, the gap is not incremental. It is structural" },
            ] : [
              { icon: "⏱", label: "Slow adoption", detail: "A quarter to change how the team works. In a market where capabilities shift monthly, that delay translates directly to lost positioning" },
              { icon: "⚠️", label: "Missed opportunities", detail: "New AI capabilities that could reshape your offering take months to reach frontline teams. By then, competitors already ship with them" },
              { icon: "📉", label: "Strategic lag", detail: "Your team's creative and strategic potential is consumed by re-solving problems that should already be solved. The highest-value work gets crowded out" },
            ],
          },
        };
        return [weakest, secondWeakest].map(d => {
          const data = costData[d.dimension];
          if (!data) return "";
          const label = FRIENDLY_LABELS[d.dimension] || d.label;
          const scoreTag = '<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;background:' + (d.score <= 33 ? "#fef2f2" : "#fffbeb") + ';color:' + (d.score <= 33 ? "#dc2626" : "#d97706") + ';">' + d.score + '/100</span>';
          const rows = data.lines.map(line =>
            '<tr>' +
            '<td style="padding:6px 0 6px 0;vertical-align:top;width:22px;font-size:14px;">' + line.icon + '</td>' +
            '<td style="padding:6px 8px;vertical-align:top;font-size:12px;font-weight:700;color:#1a1a2e;white-space:nowrap;">' + line.label + '</td>' +
            '<td style="padding:6px 0;font-size:12px;color:#475569;line-height:1.5;">' + line.detail + '</td>' +
            '</tr>'
          ).join("");
          return '<div style="margin-bottom:16px;' + (d === weakest ? 'padding-bottom:16px;border-bottom:1px solid rgba(220,38,38,0.12);' : '') + '">' +
            '<p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#1a1a2e;">' + label + ' ' + scoreTag + '</p>' +
            '<table style="width:100%;border-collapse:collapse;">' + rows + '</table>' +
            '</div>';
        }).join("");
      })()}
    </div>

    <!-- You vs ${targetBenchmark}+ contrast -->
    <div style="margin-bottom:24px;">
      <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1a1a2e;">Your team today vs. ${isAbove55 ? 'top 1% teams (75+)' : 'codified teams (55+)'}</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:12px;">
        <tr style="background:#f8fafc;">
          <td style="padding:6px 10px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;"></td>
          <td style="padding:6px 10px;font-weight:700;color:${scoreColor};text-align:center;border-bottom:1px solid #e2e8f0;">You (${overall})</td>
          <td style="padding:6px 10px;font-weight:700;color:#0284c7;text-align:center;border-bottom:1px solid #e2e8f0;">${targetBenchmark}+ teams</td>
        </tr>
        ${isAbove55 ? `
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">AI standards</td><td style="padding:6px 10px;text-align:center;color:#f59e0b;border-bottom:1px solid #f0f0f0;">Documented but unevenly applied</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Embedded in every session automatically</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">Knowledge capture</td><td style="padding:6px 10px;text-align:center;color:#f59e0b;border-bottom:1px solid #f0f0f0;">Happens when someone remembers</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Systematic, after every session</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">Team learning</td><td style="padding:6px 10px;text-align:center;color:#f59e0b;border-bottom:1px solid #f0f0f0;">Shared in meetings, adopted slowly</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Compounding: each project lifts the next</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">Quality assurance</td><td style="padding:6px 10px;text-align:center;color:#f59e0b;border-bottom:1px solid #f0f0f0;">Manual review catches gaps</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Built into the process, not bolted on</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;">Competitive moat</td><td style="padding:6px 10px;text-align:center;color:#f59e0b;">Improving steadily</td><td style="padding:6px 10px;text-align:center;color:#0284c7;">Widening gap every quarter</td></tr>
        ` : `
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">AI session prep</td><td style="padding:6px 10px;text-align:center;color:#dc2626;border-bottom:1px solid #f0f0f0;">Re-explain from scratch</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Standards loaded automatically</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">Output quality</td><td style="padding:6px 10px;text-align:center;color:#dc2626;border-bottom:1px solid #f0f0f0;">Depends who does it</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Consistent regardless</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">New technique found</td><td style="padding:6px 10px;text-align:center;color:#dc2626;border-bottom:1px solid #f0f0f0;">Stays with one person</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Reaches whole team in days</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">Senior review</td><td style="padding:6px 10px;text-align:center;color:#dc2626;border-bottom:1px solid #f0f0f0;">Catching basic errors</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Focused on strategy</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;">AI ROI</td><td style="padding:6px 10px;text-align:center;color:#dc2626;">Can't measure it</td><td style="padding:6px 10px;text-align:center;color:#0284c7;">Tracked and reported</td></tr>
        `}
      </table>
    </div>

    <!-- CTA -->
    <div style="text-align:center;padding:20px;background:#f0f9ff;border-radius:10px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#1a1a2e;">Ready to close these gaps structurally?</p>
      <p style="margin:0 0 14px;font-size:13px;color:#475569;line-height:1.5;">20 min. We unpack your score, map each gap to the behaviours driving it, and show you how LIZA OS makes standards, knowledge capture, and visibility automatic.</p>
      <a href="${CAL_URL}" style="display:inline-block;padding:12px 28px;background:#0284c7;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Book your Diagnostic Debrief →</a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:16px;border-top:1px solid #e2e8f0;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">LIZA OS · The management layer for AI-powered teams</p>
      <p style="margin:4px 0 0;font-size:11px;color:#cbd5e1;">You received this because you completed the AI Execution Diagnostic.</p>
      <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1;"><a href="https://iza-flow.lovable.app/privacy" style="color:#94a3b8;">Privacy Policy</a> · <a href="mailto:kristof.eger@lizaos.ai" style="color:#94a3b8;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;

    // ── Step 5: Send user email ──
    const emailResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LIZA OS <invite@invite.lizaos.ai>",
        to: [email.trim()],
        subject: `Your AI Execution Report (${overall}/100) · Full PDF attached`,
        html,
        ...(pdfBase64 ? {
          attachments: [{
            filename: `AI-Execution-Report-${overall}.pdf`,
            content: pdfBase64,
          }],
        } : {}),
      }),
    });

    if (!emailResp.ok) {
      const errBody = await emailResp.text();
      console.error("Resend error:", emailResp.status, errBody);
      throw new Error(`Resend error: ${emailResp.status}`);
    }

    // ── Step 6: Notify founders (fire-and-forget) ──
    const founderDimRows = sorted
      .map((d) => {
        const label = FRIENDLY_LABELS[d.dimension] || d.label;
        return `<tr><td style="padding:6px 10px;font-size:13px;color:#1a1a2e;border-bottom:1px solid #eee;">${label}</td><td style="padding:6px 10px;font-size:13px;font-weight:700;text-align:right;color:${d.score <= 33 ? "#dc2626" : d.score <= 66 ? "#f59e0b" : "#16a34a"};border-bottom:1px solid #eee;">${d.score}/100</td><td style="padding:6px 10px;font-size:12px;color:#64748b;border-bottom:1px solid #eee;">${d.insight}</td></tr>`;
      })
      .join("");

    const founderStepsHtml = actionPlan.steps
      .map(
        (s, i) =>
          `<div style="margin-bottom:12px;padding:12px;background:#f0f9ff;border-radius:6px;border-left:3px solid #0284c7;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1a1a2e;">Step ${i + 1}: ${s.title}</p>
            <p style="margin:0 0 6px;font-size:12px;color:#475569;"><strong>Manual:</strong> ${s.manual_how}</p>
            <p style="margin:0;font-size:12px;color:#0284c7;">🏗️ ${s.platform_how}</p>
          </div>`
      )
      .join("");

    const enrichmentLine = companyName || industry || respondent_role || team_size
      ? `<p style="margin:6px 0 16px;font-size:13px;color:#475569;">${[
          respondent_role ? `Role: <strong>${respondent_role}</strong>` : null,
          team_size ? `Team: <strong>${team_size}</strong>` : null,
          companyName ? `Company: <strong>${companyName}</strong>` : null,
          industry ? `Industry: <strong>${industry}</strong>` : null,
        ].filter(Boolean).join(" · ")}</p>`
      : "";

    const founderHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;">
        <h2 style="margin:0 0 4px;font-size:18px;color:#1a1a2e;">Diagnostic Lead: ${email}</h2>
        <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Submitted ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC</p>
        ${enrichmentLine}

        <div style="text-align:center;padding:16px;background:#f8fafc;border-radius:8px;margin-bottom:16px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Overall Score</p>
          <p style="margin:4px 0;font-size:48px;font-weight:900;color:${scoreColor};">${overall}</p>
          <p style="margin:0;font-size:15px;font-weight:700;color:#1a1a2e;">${archetype.label}</p>
          <p style="margin:6px 0 0;font-size:13px;color:#64748b;">${archetype.tagline}</p>
        </div>

        <h3 style="margin:20px 0 8px;font-size:14px;color:#1a1a2e;">Dimension Breakdown</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr style="background:#f1f5f9;"><th style="padding:6px 10px;text-align:left;font-size:12px;color:#64748b;">Dimension</th><th style="padding:6px 10px;text-align:right;font-size:12px;color:#64748b;">Score</th><th style="padding:6px 10px;text-align:left;font-size:12px;color:#64748b;">Insight</th></tr>
          ${founderDimRows}
        </table>

        <h3 style="margin:20px 0 8px;font-size:14px;color:#1a1a2e;">AI-Generated Action Plan (sent to lead)</h3>
        ${founderStepsHtml}

        <div style="margin-top:20px;padding:12px;background:#fef3c7;border-radius:6px;">
          <p style="margin:0;font-size:13px;color:#92400e;"><strong>Next step:</strong> Review in <a href="https://iza-flow.lovable.app/admin/manage" style="color:#0284c7;">Admin Panel → Diagnostics</a> for full Q&A detail.</p>
        </div>
      </div>`;

    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LIZA OS <invite@invite.lizaos.ai>",
        to: ["kristof.eger@lizaos.ai", "istvan.boscha@aliz.ai"],
        subject: `Diagnostic lead: ${email}${companyName ? ` @ ${companyName}` : ""}${normalizedTeamLeaderEmail ? ` [TEAM: ${normalizedTeamLeaderEmail}]` : ""} (${overall}/100, ${archetype.label})`,
        html: founderHtml,
      }),
    }).catch((e) => console.error("Founder notify failed:", e));

    // ── Step 7: Team leader notification — every submission (fire-and-forget) ──
    if (normalizedTeamLeaderEmail) {
      try {
        // Count total team submissions for this leader
        const { count: teamCount } = await supabaseAdmin
          .from("diagnostic_results")
          .select("id", { count: "exact", head: true })
          .eq("team_leader_email", normalizedTeamLeaderEmail)
          .not("email", "is", null);

        const safeTeamCount = teamCount ?? 1;
        const submitterEmail = email.trim();

        const teamLeaderHtml = `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;">
            <div style="text-align:center;margin-bottom:24px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Team AI Execution Update</p>
              <p style="margin:0;font-size:22px;font-weight:900;color:#1a1a2e;">New team member assessed</p>
              <p style="margin:12px 0 0;font-size:14px;color:#64748b;line-height:1.5;">
                <strong style="color:#1a1a2e;">${submitterEmail}</strong> just completed the AI Execution Diagnostic and added their results to your team report.
              </p>
            </div>

            <div style="padding:16px;background:#f8fafc;border-radius:8px;margin-bottom:20px;border:1px solid #e2e8f0;">
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr>
                  <td style="padding:4px 0;color:#64748b;">Submitter</td>
                  <td style="padding:4px 0;font-weight:700;color:#1a1a2e;text-align:right;">${submitterEmail}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#64748b;">Their score</td>
                  <td style="padding:4px 0;font-weight:700;text-align:right;color:${scoreColor};">${overall}/100</td>
                </tr>
                ${respondent_role ? `<tr><td style="padding:4px 0;color:#64748b;">Role</td><td style="padding:4px 0;font-weight:600;text-align:right;color:#1a1a2e;">${respondent_role}</td></tr>` : ""}
                <tr>
                  <td style="padding:4px 0;color:#64748b;">Total team submissions</td>
                  <td style="padding:4px 0;font-weight:700;text-align:right;color:#0284c7;">${safeTeamCount}</td>
                </tr>
              </table>
            </div>

            ${safeTeamCount >= 3 ? `
            <div style="text-align:center;padding:20px;background:#f0f9ff;border-radius:10px;margin-bottom:24px;">
              <p style="margin:0 0 12px;font-size:14px;color:#475569;">With ${safeTeamCount} submissions, your team report is becoming meaningful. Book a call to see your consolidated team insights.</p>
              <a href="${CAL_URL}" style="display:inline-block;padding:12px 28px;background:#0284c7;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Book your Team Debrief (20 min) →</a>
            </div>` : `
            <div style="padding:16px;background:#fffbeb;border-radius:8px;margin-bottom:24px;border:1px solid #fde68a;">
              <p style="margin:0;font-size:13px;color:#92400e;">You have <strong>${safeTeamCount}</strong> submission${safeTeamCount > 1 ? "s" : ""} so far. Once 3+ team members complete the diagnostic, you'll unlock your full team report.</p>
            </div>`}

            <div style="text-align:center;padding-top:16px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">LIZA OS · The management layer for AI-powered teams</p>
              <p style="margin:4px 0 0;font-size:11px;color:#cbd5e1;">You received this because ${submitterEmail} nominated you as their team leader.</p>
              <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1;"><a href="https://iza-flow.lovable.app/privacy" style="color:#94a3b8;">Privacy Policy</a> · <a href="mailto:kristof.eger@lizaos.ai" style="color:#94a3b8;">Unsubscribe</a></p>
            </div>
          </div>`;

        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "LIZA OS <invite@invite.lizaos.ai>",
            to: [normalizedTeamLeaderEmail],
            subject: `Team update: ${submitterEmail} completed the AI Execution Diagnostic (${safeTeamCount} total)`,
            html: teamLeaderHtml,
          }),
        }).catch((e) => console.error("Team leader notify failed:", e));
      } catch (e) {
        console.error("Team leader check failed:", e);
      }
    }

    return new Response(
      JSON.stringify({ success: true, diagnostic_result_id: resolvedDiagnosticRecordId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-diagnostic-report error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
