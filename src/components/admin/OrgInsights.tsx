import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Download, ChevronDown, ChevronUp, Users, TrendingDown, BarChart3 } from "lucide-react";
import { calculateResults, DIMENSION_LABELS, DIMENSION_DESCRIPTIONS, type Dimension } from "@/lib/diagnostic-scoring";
import jsPDF from "jspdf";

interface DiagnosticResult {
  id: string;
  email: string | null;
  archetype: string;
  overall_score: number;
  scores: Record<string, number>;
  answers: Record<string, number>;
  created_at: string;
}

interface OrgData {
  domain: string;
  count: number;
  avgScore: number;
  results: DiagnosticResult[];
  archetypeDistribution: Record<string, number>;
  avgDimensions: Record<string, number>;
  lowestDimension: { key: string; label: string; score: number };
  highestDimension: { key: string; label: string; score: number };
}

const SHORT_LABELS: Record<string, string> = {
  standard_internalization: "Standards Adoption",
  output_consistency: "Delivery Consistency",
  knowledge_compounding: "Knowledge Sharing",
  collective_visibility: "Team Visibility",
  learning_velocity: "Improvement Speed",
};

function getDomain(email: string): string {
  const parts = email.split("@");
  return parts.length > 1 ? parts[1].toLowerCase() : email.toLowerCase();
}

// Common free email providers to filter out
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com",
  "live.com", "msn.com", "me.com", "mac.com", "gmx.com", "gmx.net",
  "fastmail.com", "tutanota.com",
]);

// Founder emails excluded from aggregate analysis
const FOUNDER_EMAILS = new Set(["kristof.eger@lizaos.ai", "istvan.boscha@aliz.ai"]);

export default function OrgInsights({ results }: { results: DiagnosticResult[] }) {
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
  const [includeFreeMail, setIncludeFreeMail] = useState(false);
  const [includeNames, setIncludeNames] = useState(false);

  const orgs = useMemo(() => {
    // Group by email domain, only include results with emails
    const grouped: Record<string, DiagnosticResult[]> = {};
    for (const r of results) {
      if (!r.email) continue;
      if (FOUNDER_EMAILS.has(r.email.toLowerCase())) continue;
      const domain = getDomain(r.email);
      if (!includeFreeMail && FREE_EMAIL_DOMAINS.has(domain)) continue;
      if (!grouped[domain]) grouped[domain] = [];
      grouped[domain].push(r);
    }

    // Only keep orgs with 2+ submissions
    const orgList: OrgData[] = [];
    for (const [domain, items] of Object.entries(grouped)) {
      if (items.length < 2) continue;

      const avgScore = Math.round(items.reduce((s, r) => s + r.overall_score, 0) / items.length);

      // Archetype distribution
      const archetypeDist: Record<string, number> = {};
      for (const r of items) {
        archetypeDist[r.archetype] = (archetypeDist[r.archetype] || 0) + 1;
      }

      // Average dimension scores
      const dimSums: Record<string, number[]> = {};
      for (const r of items) {
        for (const [key, val] of Object.entries(r.scores as Record<string, number>)) {
          if (!dimSums[key]) dimSums[key] = [];
          dimSums[key].push(val);
        }
      }
      const avgDimensions: Record<string, number> = {};
      let lowest = { key: "", label: "", score: 100 };
      let highest = { key: "", label: "", score: 0 };
      for (const [key, vals] of Object.entries(dimSums)) {
        const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
        avgDimensions[key] = avg;
        const label = SHORT_LABELS[key] || key;
        if (avg < lowest.score) lowest = { key, label, score: avg };
        if (avg > highest.score) highest = { key, label, score: avg };
      }

      orgList.push({
        domain,
        count: items.length,
        avgScore,
        results: items,
        archetypeDistribution: archetypeDist,
        avgDimensions,
        lowestDimension: lowest,
        highestDimension: highest,
      });
    }

    return orgList.sort((a, b) => b.count - a.count);
  }, [results, includeFreeMail]);

  const generatePDF = (org: OrgData, showParticipants: boolean, fullyAnonymized: boolean = false) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // ── Helpers ──
    const setFont = (size: number, style: string = "normal", color: [number, number, number] = [30, 30, 30]) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", style);
      doc.setTextColor(...color);
    };

    const checkNewPage = (needed: number) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    const drawDivider = () => {
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    };

    const drawSectionHeader = (title: string) => {
      checkNewPage(30);
      // Light background band
      doc.setFillColor(245, 247, 250);
      doc.rect(margin - 4, y - 4, contentWidth + 8, 12, "F");
      setFont(11, "bold", [20, 80, 160]);
      doc.text(title.toUpperCase(), margin, y + 4);
      y += 16;
    };

    const writeWrapped = (text: string, size: number, style: string, color: [number, number, number], maxWidth: number = contentWidth): number => {
      setFont(size, style, color);
      const lines = doc.splitTextToSize(text, maxWidth);
      const lineHeight = size * 0.45;
      checkNewPage(lines.length * lineHeight + 4);
      doc.text(lines, margin, y);
      const height = lines.length * lineHeight;
      y += height + 3;
      return height;
    };

    // ── AI-specific dimension cost estimates (per team of 10) ──
    const COST_PER_DIM: Record<string, { low: string; mid: string; high: string }> = {
      standard_internalization: {
        low: "Every AI chat starts from zero. People re-explain methodology, tone, and constraints each session. ~5-10 hrs/week wasted on context that already exists.",
        mid: "Some people paste standards into prompts, most don't. AI outputs vary because the starting context varies. ~2-4 hrs/week lost to partial re-prompting.",
        high: "Your team's standards are the starting point for every AI session. Prompts build on shared context, not individual memory.",
      },
      output_consistency: {
        low: "Two people prompting the same brief get wildly different outputs. AI amplifies individual habits, not team standards. 3-5 hr rework cycles per deliverable.",
        mid: "AI outputs are recognisable but uneven. Quality depends on who writes the prompt, not what the team knows. ~30-40% excess review time.",
        high: "AI produces consistent results regardless of who prompts. The team's quality standard travels with the prompt setup, not the person.",
      },
      knowledge_compounding: {
        low: "When someone finds a better prompt, workflow, or AI technique, it stays in their chat history. The team re-solves problems someone already cracked.",
        mid: "Techniques spread informally (Slack, meetings) but take 4-6 weeks to reach the team. No system to capture what works.",
        high: "Better AI techniques are validated and folded into shared approaches. Each project's AI usage improves the next.",
      },
      collective_visibility: {
        low: "Nobody can see how colleagues use AI. No way to know who's struggling, who found a breakthrough, or whether AI is improving output quality.",
        mid: "Occasional demos or Slack shares, but no systematic view. You can't report on AI usage patterns or ROI if asked today.",
        high: "AI work is visible across the team. Juniors learn from seniors' prompting patterns. Usage is coordinated, not accidental.",
      },
      learning_velocity: {
        low: "After 6+ months of AI tool spend, the team's prompting approach hasn't changed. Same mistakes, same workarounds, every project.",
        mid: "Learning happens but takes a full quarter to change how the team prompts. New AI capabilities go unused for weeks.",
        high: "New AI techniques reach the whole team within days. Prompt patterns, tool updates, and workflow improvements spread fast.",
      },
    };

    const STRATEGIC_PER_DIM: Record<string, { low: string; mid: string; high: string }> = {
      standard_internalization: {
        low: "Which means you can't scale output without scaling your most experienced people. Every new hire multiplies supervision load instead of reducing it.",
        mid: "Which means your growth is throttled by onboarding speed. New people take months to reach the quality bar your best people hit naturally.",
        high: "Which means you can take on more work without proportionally adding senior oversight. Your methodology is doing the quality control, not your calendar.",
      },
      output_consistency: {
        low: "Which means your team's output quality is unpredictable. You're investing in AI tools but getting individual-level variance instead of team-level consistency.",
        mid: "Which means your capacity ceiling is set by your strongest operators, not your team size.",
        high: "Which means your output quality holds as you grow. Consistency lets you systematise execution and focus senior time on strategy rather than correction.",
      },
      knowledge_compounding: {
        low: "Which means your team is getting linearly better at best while competitors who compound knowledge are improving exponentially.",
        mid: "Which means you're one resignation away from losing capabilities you can't rebuild. Tribal knowledge that isn't codified is organisational risk.",
        high: "Which means your competitive advantage accelerates over time. Every project deposits knowledge that makes the next one faster or higher quality.",
      },
      collective_visibility: {
        low: "Which means your leadership decisions about AI investment are based on anecdote, not evidence.",
        mid: "Which means you're making workforce and resource planning decisions blind. You don't know which roles AI is genuinely augmenting.",
        high: "Which means you can make data-informed decisions about where AI creates value and where it doesn't.",
      },
      learning_velocity: {
        low: "Which means competitors who learn faster will compound their advantage every quarter. After 12 months, that gap is exponential.",
        mid: "Which means you're adopting AI capabilities 3 to 6 months behind the curve, translating directly to lost competitive positioning.",
        high: "Which means you're turning AI evolution speed into a strategic advantage, not just keeping pace.",
      },
    };

    const getScoreColor = (score: number): [number, number, number] =>
      score <= 30 ? [220, 38, 38] : score <= 55 ? [217, 119, 6] : score <= 75 ? [37, 99, 235] : [22, 163, 74];

    const getTier = (score: number): "low" | "mid" | "high" =>
      score <= 33 ? "low" : score <= 66 ? "mid" : "high";

    // ════════════════════════════════════════════
    // PAGE 1: COVER + EXECUTIVE DASHBOARD
    // ════════════════════════════════════════════

    // Brand line
    setFont(9, "normal", [140, 140, 140]);
    doc.text("LIZA OS", pageWidth - margin, y, { align: "right" });
    y += 6;

    // Title block
    setFont(24, "bold", [20, 80, 160]);
    doc.text("AI Execution Maturity Audit", margin, y);
    y += 10;
    setFont(14, "normal", [80, 80, 80]);
    doc.text("Your team has AI tools. Is that investment compounding?", margin, y);
    y += 14;

    // Meta line
    const displayName = fullyAnonymized ? "Anonymous Organisation" : org.domain;
    setFont(9, "normal", [140, 140, 140]);
    doc.text(`Prepared for: ${displayName}`, margin, y);
    y += 4;
    doc.text(`${org.count} team member assessments (anonymised)  |  ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, margin, y);
    y += 4;

    if (!fullyAnonymized && showParticipants) {
      const participantEmails = org.results
        .map(r => r.email)
        .filter(Boolean)
        .sort() as string[];
      if (participantEmails.length > 0) {
        setFont(8, "normal", [100, 100, 100]);
        doc.text("Participants: " + participantEmails.join(", "), margin, y, { maxWidth: contentWidth });
        const partLines = doc.splitTextToSize("Participants: " + participantEmails.join(", "), contentWidth);
        y += partLines.length * 3.5;
      }
    } else {
      setFont(8, "italic", [140, 140, 140]);
      doc.text(fullyAnonymized
        ? "All identifying information has been removed. This report may be shared publicly."
        : "Individual participant names have been withheld. Results are presented in aggregate only.",
        margin, y);
      y += 4;
    }
    y += 4;

    drawDivider();

    // ── Score Dashboard (visual, scannable) ──
    const overallColor = getScoreColor(org.avgScore);

    // Score + archetype in a visual block
    const dashY = y;
    setFont(48, "bold", overallColor);
    doc.text(`${org.avgScore}`, margin + 2, dashY + 16);
    setFont(14, "normal", [140, 140, 140]);
    doc.text("/ 100", margin + 38, dashY + 16);

    // Dominant archetype
    const dominantArchetype = Object.entries(org.archetypeDistribution)
      .sort(([, a], [, b]) => b - a)[0];
    setFont(12, "bold", [30, 30, 30]);
    doc.text(dominantArchetype ? dominantArchetype[0] : "Mixed", margin + 2, dashY + 24);

    // Benchmark comparison (right side)
    const benchX = margin + 90;
    setFont(9, "bold", [140, 140, 140]);
    doc.text("BENCHMARK COMPARISON", benchX, dashY + 2);

    const benchmarks = [
      { label: "Industry average", value: 35, color: [140, 140, 140] as [number, number, number] },
      { label: "Your organisation", value: org.avgScore, color: overallColor },
      { label: "Structured teams", value: 55, color: [22, 163, 74] as [number, number, number] },
    ];

    benchmarks.forEach((b, i) => {
      const bY = dashY + 8 + i * 7;
      setFont(9, "normal", [80, 80, 80]);
      doc.text(b.label, benchX, bY);
      setFont(9, "bold", b.color);
      doc.text(`${b.value}`, benchX + 70, bY, { align: "right" });
    });

    y = dashY + 32;

    // Benchmark methodology explanation
    setFont(7.5, "italic", [130, 130, 130]);
    const benchNote = doc.splitTextToSize(
      "Scoring methodology: Each dimension is scored 0-100 based on team responses across 10 scenario-based questions mapping AI execution behaviours to five maturity dimensions. " +
      "\"Industry average\" (35) is calibrated against ServiceNow's 2025 Enterprise AI Maturity Index, which surveyed 4,500 C-level executives across 16 countries and found the global average dropped from 44 to 35 year-over-year, with fewer than 1% of organisations scoring above 50. " +
      "\"Structured teams\" (55+) represent organisations that have codified their methodology into repeatable AI workflows, run feedback loops, and maintain cross-team visibility. " +
      "The overall score is the weighted average of five dimensions measuring how effectively your team's collective knowledge reaches AI-assisted work.",
      contentWidth
    );
    doc.text(benchNote, margin, y);
    y += benchNote.length * 3.2 + 4;
    drawDivider();

    // ── Dimension Scorecard (compact visual) ──
    drawSectionHeader("Dimension Scorecard");

    const dimEntries = Object.entries(org.avgDimensions);
    for (const [key, score] of dimEntries) {
      checkNewPage(22);
      const label = DIMENSION_LABELS[key as Dimension] || SHORT_LABELS[key] || key;
      const desc = DIMENSION_DESCRIPTIONS[key as Dimension] || "";
      const dimColor = getScoreColor(score);
      const barMaxWidth = contentWidth - 50;
      const barWidth = (score / 100) * barMaxWidth;

      // Label + score on same line
      setFont(10, "bold", [40, 40, 40]);
      doc.text(label, margin, y);
      setFont(10, "bold", dimColor);
      doc.text(`${score}`, pageWidth - margin, y, { align: "right" });
      y += 3;

      // Description
      if (desc) {
        setFont(7.5, "italic", [130, 130, 130]);
        doc.text(doc.splitTextToSize(desc, contentWidth - 10)[0], margin, y + 1);
        y += 4;
      }

      // Progress bar
      doc.setFillColor(235, 235, 235);
      doc.roundedRect(margin, y, barMaxWidth, 3.5, 1.5, 1.5, "F");
      doc.setFillColor(...dimColor);
      doc.roundedRect(margin, y, Math.max(barWidth, 3), 3.5, 1.5, 1.5, "F");
      y += 9;
    }

    y += 4;

    // ── Key Takeaway Box ──
    const gapLabel = DIMENSION_LABELS[org.lowestDimension.key as Dimension] || org.lowestDimension.label;
    const strengthLabel = DIMENSION_LABELS[org.highestDimension.key as Dimension] || org.highestDimension.label;
    const gapCost = COST_PER_DIM[org.lowestDimension.key]?.[getTier(org.lowestDimension.score)] || "";
    const takeawayText = `Your team's biggest AI execution gap is ${gapLabel} (${org.lowestDimension.score}/100). ` +
      `In practice: ${gapCost} ` +
      `Meanwhile, ${strengthLabel} (${org.highestDimension.score}/100) shows your team can build structured AI habits. ` +
      `The question is whether you can replicate that discipline across other areas before the gap widens.`;
    setFont(9, "normal", [120, 80, 20]);
    const takeawayLines = doc.splitTextToSize(takeawayText, contentWidth - 14);
    const takeawayBoxHeight = 16 + takeawayLines.length * 3.8;
    checkNewPage(takeawayBoxHeight + 4);
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(251, 191, 36);
    doc.roundedRect(margin, y, contentWidth, takeawayBoxHeight, 3, 3, "FD");
    setFont(10, "bold", [146, 64, 14]);
    doc.text("KEY TAKEAWAY", margin + 6, y + 7);
    setFont(9, "normal", [120, 80, 20]);
    doc.text(takeawayLines, margin + 6, y + 14);
    y += takeawayBoxHeight + 6;

    // ── Brand header helper for continuation pages ──
    const addBrandHeader = () => {
      setFont(9, "normal", [140, 140, 140]);
      doc.text("LIZA OS  |  AI Execution Maturity Audit", margin, margin);
      doc.text(fullyAnonymized ? "" : `${org.domain}`, pageWidth - margin, margin, { align: "right" });
    };

    // ════════════════════════════════════════════
    // DIMENSION ANALYSIS (flows naturally)
    // ════════════════════════════════════════════
    drawSectionHeader("Dimension Analysis");

    // Each dimension gets a detailed block
    for (const [key, score] of dimEntries) {
      checkNewPage(45);
      const label = DIMENSION_LABELS[key as Dimension] || SHORT_LABELS[key] || key;
      const desc = DIMENSION_DESCRIPTIONS[key as Dimension] || "";
      const dimColor = getScoreColor(score);
      const tier = getTier(score);
      const cost = COST_PER_DIM[key]?.[tier] || "";

      // Dimension header with colored left border
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y - 2, contentWidth, 5, 1, 1, "F");
      doc.setFillColor(...dimColor);
      doc.rect(margin, y - 2, 3, 5, "F");

      setFont(10, "bold", [30, 30, 30]);
      doc.text(label, margin + 6, y + 1.5);
      setFont(10, "bold", dimColor);
      doc.text(`${score}/100`, pageWidth - margin, y + 1.5, { align: "right" });
      y += 7;

      // What it measures
      if (desc) {
        setFont(8, "italic", [100, 100, 100]);
        const descLines = doc.splitTextToSize(`What this measures: ${desc}`, contentWidth - 4);
        doc.text(descLines, margin + 2, y);
        y += descLines.length * 3.5 + 2;
      }

      // Business impact
      if (cost) {
        const impactLabel = tier === "high" ? "Strength:" : "Business impact:";
        const labelColor: [number, number, number] = tier === "high" ? [22, 163, 74] : tier === "low" ? [180, 40, 40] : [160, 100, 10];
        const labelWidth = tier === "high" ? 24 : 32;

        setFont(8.5, "bold", labelColor);
        doc.text(impactLabel, margin + 2, y);

        setFont(8.5, "normal", [60, 60, 60]);
        const costLines = doc.splitTextToSize(cost, contentWidth - labelWidth - 6);
        doc.text(costLines, margin + 2 + labelWidth, y);
        y += costLines.length * 3.8 + 2;
      }

      // Strategic consequence
      const strategicText = STRATEGIC_PER_DIM[key]?.[tier];
      if (strategicText) {
        checkNewPage(12);
        setFont(8.5, "bold", [20, 80, 160]);
        doc.text("→", margin + 2, y);
        setFont(8.5, "italic", [40, 60, 100]);
        const stratLines = doc.splitTextToSize(strategicText, contentWidth - 10);
        doc.text(stratLines, margin + 8, y);
        y += stratLines.length * 3.8 + 2;
      }

      const dimScores = org.results
        .map(r => (r.scores as Record<string, number>)[key])
        .filter(s => s != null)
        .sort((a, b) => a - b);
      if (dimScores.length > 1) {
        const dimRange = dimScores[dimScores.length - 1] - dimScores[0];
        setFont(8, "normal", [100, 100, 100]);
        doc.text(`Team spread: ${dimRange} points (${dimScores[0]} to ${dimScores[dimScores.length - 1]})`, margin + 2, y);
        y += 5;
      }

      y += 4;
    }

    // ── Team Alignment Analysis ──
    drawSectionHeader("Team Alignment");

    const scores = org.results.map((r) => r.overall_score).sort((a, b) => a - b);
    const scoreRange = scores[scores.length - 1] - scores[0];
    const median = scores[Math.floor(scores.length / 2)];

    // Stats row
    setFont(9, "normal", [80, 80, 80]);
    doc.text(`Respondents: ${org.count}   |   Median: ${median}   |   Range: ${scoreRange} points (${scores[0]} to ${scores[scores.length - 1]})`, margin, y);
    y += 7;

    const alignmentText = scoreRange > 40
      ? `A ${scoreRange}-point spread indicates fragmented AI adoption. Some team members are significantly ahead of others. This variance means your team's collective output is limited by its least capable members' AI usage, not its best. Closing this alignment gap is your highest-leverage opportunity before investing in new tools or training.`
      : scoreRange > 20
        ? `A ${scoreRange}-point spread shows moderate alignment with some inconsistency. Targeted knowledge-sharing, where stronger members' approaches become the team default, would reduce this variance within weeks.`
        : `A tight ${scoreRange}-point spread is encouraging. Your team is aligned in how they use AI, which means improvements can be rolled out uniformly. You're ready for structured capability building.`;

    writeWrapped(alignmentText, 9, "normal", [50, 50, 50]);
    y += 4;

    // Archetype distribution
    const archetypeEntries = Object.entries(org.archetypeDistribution).sort(([, a], [, b]) => b - a);
    setFont(9, "bold", [80, 80, 80]);
    doc.text("Archetype distribution:", margin, y);
    setFont(9, "normal", [60, 60, 60]);
    doc.text(archetypeEntries.map(([arch, count]) => `${arch} (${count})`).join("  |  "), margin + 42, y);
    y += 10;

    // ════════════════════════════════════════════
    // YOUR IMPROVEMENT ROADMAP (consolidated)
    // ════════════════════════════════════════════
    const weakDimensions = dimEntries
      .filter(([, score]) => score < 67)
      .sort(([, a], [, b]) => a - b); // weakest first

    if (weakDimensions.length > 0) {
      // Only start new page if we're more than 40% down the current one
      if (y > pageHeight * 0.4) {
        doc.addPage();
        y = margin;
        addBrandHeader();
        y += 10;
      }

      drawSectionHeader("Your Improvement Roadmap");

      // Score-aware intro framing
      const introText = org.avgScore <= 35
        ? `Your team is in the early stages of structured AI execution. The roadmap below focuses on the foundations: making one workflow repeatable, creating visibility, and building a feedback loop. Each dimension is prioritised by impact, with actions you can start this week.`
        : org.avgScore <= 65
          ? `Your team has real pieces in place, but knowledge isn't consistently reaching execution. The roadmap below targets the specific dimensions where the gap between "what your team knows" and "what reaches AI sessions" is widest. Start with #1 and build sequentially.`
          : `Your team is ahead of most. The roadmap below focuses on the remaining dimensions where structured improvement would extend your advantage. These are refinements, not rebuilds.`;

      writeWrapped(introText, 9, "normal", [50, 50, 50]);
      y += 4;

      const DIMENSION_ACTIONS: Record<string, { low: { thisWeek: string; thisMonth: string; liza: string }; mid: { thisWeek: string; thisMonth: string; liza: string } }> = {
        standard_internalization: {
          low: {
            thisWeek: "Pick your single most-repeated task type. Gather your two strongest operators for 60 minutes. Have them walk through their best recent output and reverse-engineer the pattern: what structure did they use, what quality criteria did they check, what context did they load before prompting? Write this as a one-page reference document. This isn't about perfection. It's about making the implicit explicit. The goal is a starting point that prevents the next person from beginning with a blank prompt.",
            thisMonth: "Make this reference the mandatory starting point for every AI session on that task type. Before anyone prompts, they confirm they've loaded the reference. After two weeks, compare outputs from sessions that used the reference versus those that didn't. The difference will be obvious. Then pick a second task type and repeat the process. You're building the habit of 'start from what we know' rather than 'start from scratch'.",
            liza: "On LIZA OS, this reference becomes a governed Playbook that auto-injects into every AI session for that task type. No manual loading, no forgetting, no drift. When someone improves the approach, the update reaches every future session automatically.",
          },
          mid: {
            thisWeek: "Audit your existing standards: how many people actually reference them during AI sessions? Ask five team members individually this week. You'll likely find that the gap between 'exists' and 'used' is your real problem. Most teams have documentation that people know about but rarely pull into their AI work. Identify which standards are being used, which are ignored, and why. The 'why' is critical: is it access, awareness, or perceived irrelevance?",
            thisMonth: "Make standards non-optional for your weakest workflow. Create a pre-session checklist: before any AI work on this task, confirm the standard is loaded. Review compliance weekly for the first month. Track not just whether people loaded it, but whether the outputs improved. After four weeks, you'll have hard evidence of the impact, which makes the case for extending to other workflows.",
            liza: "On LIZA OS, Mandates enforce minimum context requirements before a session can begin. The system won't let someone start a task without the relevant standards loaded. No checklists, no willpower, no 'I forgot'. Compliance becomes structural, not aspirational.",
          },
        },
        output_consistency: {
          low: {
            thisWeek: "Run a blind test: give the same brief to three people on your team. Don't tell them others are doing the same task. Compare outputs side by side. Document specifically where they diverge: is it structure, depth, quality criteria, analytical approach, or tone? Share the comparison with the team — not to judge, but to make the variance visible. Most teams are shocked by how different the outputs are. That shock is the catalyst for change.",
            thisMonth: "Create a 'quality reference output' for your most common deliverable type. This is the benchmark: the standard that represents your team's best work. After each AI-assisted deliverable, the author compares against this reference before delivery. Track how many deliverables meet the bar versus fall short. After a month, update the reference to incorporate any improvements. This creates a ratchet: quality can only go up.",
            liza: "On LIZA OS, Context Bundles ensure every team member's AI session starts with the same standards, examples, and quality criteria. Consistency becomes a design property of the system, not a function of individual discipline. When standards evolve, every session inherits the update.",
          },
          mid: {
            thisWeek: "Identify your top two operators whose AI outputs consistently meet the quality bar. Have them document their full prompt setup: what context they provide, what instructions they give the AI, what they check before finalising, and crucially, what mistakes they've learned to avoid. This isn't just about their prompts. It's about their decision-making process: how they navigate ambiguity, when they push back on AI output, and what 'good enough' looks like to them.",
            thisMonth: "Turn their approach into the team default. Pair each of them with two others on real client work (not training exercises). The stronger person co-executes with the other, narrating their decisions in real time. After three paired sessions per person, the prompting patterns should start becoming muscle memory. Measure: are the paired operators' solo outputs improving? If yes, extend to the next pair.",
            liza: "On LIZA OS, the strongest operator's approach becomes the baseline context stack that everyone inherits. Quality travels with the system, not the person. When your best people leave on holiday, the standard stays.",
          },
        },
        knowledge_compounding: {
          low: {
            thisWeek: "Start a 'wins log': a shared document or Slack channel where anyone posts an AI technique that worked well. One sentence describing the technique, one example of the result. Lower the bar to near zero for sharing. The goal isn't documentation. It's making sharing a reflex rather than a chore. Appoint one person to post the first entry today. Publicly thank anyone who contributes this week.",
            thisMonth: "Every two weeks, review the wins log as a team in a 15-minute session. Vote on the top technique. The winner gets formally written into your shared reference document and becomes the default approach for that task type. This creates a virtuous cycle: people share because they see sharing leads to adoption, and adoption makes the team better. After three cycles, you'll have a living, evolving knowledge base that grows with every project.",
            liza: "On LIZA OS, Session Debriefs automatically capture what worked at the end of every execution session and surface winning techniques as proposed updates to your Playbooks. No manual logging needed. The knowledge loop closes itself.",
          },
          mid: {
            thisWeek: "Review your last three projects. For each, identify one AI technique or prompt pattern that worked well but never reached the wider team. Write each one down in two sentences: what it is and why it worked. You'll likely find 3-5 techniques that could have saved the team significant time if they'd been shared. This exercise makes the cost of not compounding viscerally real.",
            thisMonth: "Introduce a structured 20-minute after-action review at the close of every significant project. Three questions only: What AI approaches worked? What didn't? What one change should we make to the team's shared reference? Assign one person to implement the agreed change within 48 hours. The 48-hour deadline is critical: without it, insights evaporate. Track the changes made over a quarter. You'll see your shared reference evolving from a static document into living institutional memory.",
            liza: "On LIZA OS, after-action reviews are structured into the Protocol execution flow. Insights captured during Session Debriefs feed directly into your governed context stack, ensuring they automatically reach the next project. No manual transfer, no forgotten learnings.",
          },
        },
        collective_visibility: {
          low: {
            thisWeek: "Run a 15-minute show-and-tell: one person demonstrates their best AI technique from the past week. Screen-share the actual session. Show the prompt, the context they loaded, the decisions they made when the AI gave a subpar response. Rotate the presenter each week. The goal is to make the invisible visible. Most teams have no idea how their colleagues actually work with AI. This single ritual changes that.",
            thisMonth: "Create a shared space where AI work is visible. Even a simple shared folder of notable AI sessions is a start. The key requirement: juniors should be able to see how seniors navigate ambiguity, not just the polished final output. Consider pairing a junior with a senior for one task per week where the junior observes the full AI workflow. This is the apprenticeship model adapted for the AI age.",
            liza: "On LIZA OS, the team's AI work is visible through shared Workbooks. Every session, every decision, every context injection is observable. Seniors' thinking becomes a learning resource. Delegation includes full visibility into how tasks were executed, not just whether they were completed.",
          },
          mid: {
            thisWeek: "Map your team's current AI usage: who uses AI for what tasks, how often, and with what level of sophistication? A simple survey or 1:1 conversations will reveal patterns you can't see today. You'll likely discover that some people are using AI for tasks others don't even know are possible, and vice versa. This map becomes your coordination baseline.",
            thisMonth: "Designate intentional AI coordination for your next project: who handles which AI-assisted tasks, with what context loaded, reviewed by whom. This isn't about control. It's about preventing duplication and ensuring the right context reaches the right sessions. Track whether intentional distribution improves output quality compared to ad-hoc assignment. After one project cycle, the evidence will speak for itself.",
            liza: "On LIZA OS, delegation and task assignment flow through structured Workbooks with full visibility into who's executing what, with which context, and what the outcomes were. Coordination becomes a feature of the system, not a management overhead.",
          },
        },
        learning_velocity: {
          low: {
            thisWeek: "Block 30 minutes this week for one person to evaluate a new AI technique relevant to your work. Their only deliverable: a two-sentence verdict shared with the team: 'try it' or 'skip it', with one sentence explaining why. This is deliberately minimal. The point isn't a comprehensive evaluation. It's establishing the rhythm of continuous scanning and rapid assessment.",
            thisMonth: "Make this a weekly rotation. Each week, one person evaluates one technique or tool update. If the verdict is 'try it', someone else tests it on real work the following week. If it works, it gets written into the team's shared reference. Build a rhythm of evaluate, test, adopt. After a month, you'll have tested four techniques and possibly adopted one or two. That's four more than most teams manage in a quarter.",
            liza: "On LIZA OS, new techniques can be tested as Playbook variants and compared against existing approaches through structured Protocol execution. You can run A/B tests on your own methodology: does the new approach produce better results than the current one? Data replaces opinion.",
          },
          mid: {
            thisWeek: "Review your last quarter: identify one AI capability or technique your team should have adopted but didn't. Trace the root cause: was it awareness (nobody knew), priority (nobody had time), or mechanism (no way to integrate it into existing workflows)? The root cause determines the fix. Most teams assume the problem is awareness when it's actually mechanism.",
            thisMonth: "Shorten your adoption cycle with a formal process: when someone identifies a promising technique, set a one-week deadline for evaluation and a two-week deadline for team-wide rollout if validated. Assign an owner for each evaluation. Track cycle time from 'someone spotted this' to 'the whole team uses it'. Your goal: under three weeks. Currently, most mid-maturity teams take 6-8 weeks or never complete the cycle at all.",
            liza: "On LIZA OS, validated improvements are promoted directly into your context stack and automatically reach every future session. Adoption isn't a communication problem anymore. It's a one-click operation that propagates instantly across the entire team.",
          },
        },
      };

      weakDimensions.forEach(([key, score], index) => {
        const label = DIMENSION_LABELS[key as Dimension] || SHORT_LABELS[key] || key;
        const dimColor = getScoreColor(score);
        const tier = score <= 33 ? "low" : "mid";
        const actions = DIMENSION_ACTIONS[key]?.[tier];
        if (!actions) return;

        const lineH = 3.8;
        const textW = contentWidth - 28; // tighter inner margin to prevent overflow
        setFont(9, "normal", [50, 50, 50]);
        const weekLines = doc.splitTextToSize(actions.thisWeek, textW);
        const monthLines = doc.splitTextToSize(actions.thisMonth, textW);
        setFont(8.5, "normal", [20, 80, 160]);
        const lizaLines = doc.splitTextToSize(actions.liza, textW - 8);

        // LIZA box height
        const lizaBoxH = 6 + (lizaLines.length * lineH) + 4;

        const blockH = 10 + 6 + 5 + (weekLines.length * lineH) + 8 + 5 + (monthLines.length * lineH) + 8 + lizaBoxH + 6;

        checkNewPage(blockH + 12);

        // Priority number + dimension label
        setFont(12, "bold", dimColor);
        doc.text(`${index + 1}.`, margin, y + 3);
        setFont(12, "bold", [30, 30, 30]);
        doc.text(label, margin + 10, y + 3);
        setFont(10, "bold", dimColor);
        doc.text(`${score}/100`, pageWidth - margin, y + 3, { align: "right" });
        y += 12;

        // Background card
        doc.setFillColor(248, 250, 255);
        doc.roundedRect(margin + 4, y, contentWidth - 8, blockH - 12, 2, 2, "F");
        doc.setFillColor(...dimColor);
        doc.rect(margin + 4, y, 3, blockH - 12, "F");

        let innerY = y + 7;

        // This Week
        setFont(9.5, "bold", [30, 30, 30]);
        doc.text("This week:", margin + 14, innerY);
        innerY += 5.5;
        setFont(9, "normal", [50, 50, 50]);
        doc.text(weekLines, margin + 14, innerY);
        innerY += weekLines.length * lineH + 8;

        // This Month
        setFont(9.5, "bold", [30, 30, 30]);
        doc.text("This month:", margin + 14, innerY);
        innerY += 5.5;
        setFont(9, "normal", [50, 50, 50]);
        doc.text(monthLines, margin + 14, innerY);
        innerY += monthLines.length * lineH + 8;

        // LIZA OS highlighted box
        const lizaBoxY = innerY - 2;
        doc.setFillColor(230, 244, 255);
        doc.setDrawColor(37, 99, 235);
        doc.roundedRect(margin + 10, lizaBoxY, contentWidth - 22, lizaBoxH, 2, 2, "FD");

        // Small LIZA OS label
        setFont(7.5, "bold", [37, 99, 235]);
        doc.text("LIZA OS", margin + 14, lizaBoxY + 5);

        setFont(8.5, "normal", [20, 70, 140]);
        doc.text(lizaLines, margin + 14, lizaBoxY + 10);

        y += blockH - 2;
      });

      y += 6;
    }

    // ── What 55+ Teams See (ROI frame) ──
    checkNewPage(50);
    y += 4;
    drawSectionHeader("What Teams Scoring 55+ Report");

    const roiItems = [
      ["Time spent re-prompting / re-explaining context", "Near zero"],
      ["AI output quality variance across team", "Within 10%"],
      ["Senior review time on AI-assisted work", "Down 40-60%"],
      ["Time for new hires to match team AI quality", "Cut by half"],
      ["Prompt patterns and techniques retained after turnover", "90%+ preserved"],
      ["Time to adopt a new AI tool or technique team-wide", "Under 1 week"],
    ];

    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, y, contentWidth, roiItems.length * 7 + 6, 3, 3, "F");

    roiItems.forEach(([label, value], i) => {
      const ry = y + 5 + i * 7;
      setFont(9, "normal", [22, 101, 52]);
      doc.text(label, margin + 6, ry);
      setFont(9, "bold", [22, 101, 52]);
      doc.text(value, pageWidth - margin - 6, ry, { align: "right" });
    });
    y += roiItems.length * 7 + 14;

    // ── CTA ──
    // Only force new page if we're past the halfway point
    if (y > pageHeight * 0.5) {
      doc.addPage();
      y = margin;
      addBrandHeader();
      y += 10;
    }

    setFont(16, "bold", [20, 80, 160]);
    doc.text("Your Next Step", margin, y);
    y += 10;
    writeWrapped(
      "This report surfaces where your team stands. The improvement roadmap gives you concrete actions to start this week. " +
      "But the hardest part isn't knowing what to do. It's sustaining change across projects, people, and priorities.",
      9.5, "normal", [50, 50, 50]
    );
    y += 6;

    // CTA box — prominent, full-width
    const ctaDesc = org.avgScore <= 55
      ? "We'll walk through your team's scores in detail, identify the single highest-leverage gap to close first, discuss a concrete 30-day implementation plan, and show you exactly how teams at your maturity level use LIZA OS to make these improvements structural and automatic."
      : org.avgScore <= 75
        ? "We'll walk through your team's dimension profile, discuss how to systematise what's already working, identify where targeted investment will have the most impact, and show you how LIZA OS can turn your existing strengths into compounding advantages across the team."
        : "We'll discuss how to extend your structured approach to new domains, help you build the case for ROI measurement, and show you how LIZA OS can scale your proven methodology across teams and verticals.";

    setFont(9, "normal", [50, 50, 50]);
    const ctaDescLines = doc.splitTextToSize(ctaDesc, contentWidth - 24);
    const ctaBoxH = 18 + (ctaDescLines.length * 3.8) + 30;

    // Blue gradient-style box
    doc.setFillColor(20, 80, 160);
    doc.roundedRect(margin, y, contentWidth, ctaBoxH, 4, 4, "F");

    // Title
    setFont(14, "bold", [255, 255, 255]);
    doc.text("Book Your Diagnostic Debrief", margin + 12, y + 14);

    // Description
    setFont(9, "normal", [210, 225, 255]);
    doc.text(ctaDescLines, margin + 12, y + 22);

    // What's included bullets
    const bulletY = y + 22 + (ctaDescLines.length * 3.8) + 6;
    setFont(8.5, "normal", [180, 210, 255]);
    const bullets = [
      "✓ Results walkthrough    ✓ Implementation guidance    ✓ LIZA OS demo    ✓ 30-day action plan"
    ];
    doc.text(bullets[0], margin + 12, bulletY);

    y += ctaBoxH + 8;

    // Schedule link
    setFont(10, "bold", [20, 80, 160]);
    doc.text("Schedule:", margin, y);
    setFont(10, "normal", [20, 100, 180]);
    doc.text("calendar.app.google/3v8jevUcsgRQnLyL9", margin + 22, y);
    y += 6;
    setFont(9, "normal", [100, 100, 100]);
    doc.text("kristof.eger@lizaos.ai  |  lizaos.ai", margin, y);
    y += 14;

    // Footer
    setFont(8, "normal", [160, 160, 160]);
    doc.text(fullyAnonymized
      ? "Prepared by LIZA OS. All identifying information removed for public distribution."
      : "Confidential. Prepared by LIZA OS. Data is anonymous and aggregated.",
      margin, pageHeight - 10);

    const fileName = fullyAnonymized
      ? `AI-Execution-Audit_Anonymous_${new Date().toISOString().slice(0, 10)}.pdf`
      : `AI-Execution-Audit_${org.domain}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  };

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-foreground">Org Insights</h1>
        <p className="text-sm text-muted-foreground">Organisations with 2+ diagnostic submissions. Anonymous aggregate reports for decision makers.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        <Button
          variant={includeFreeMail ? "secondary" : "outline"}
          size="sm"
          className="w-full sm:w-auto text-xs"
          onClick={() => setIncludeFreeMail(!includeFreeMail)}
        >
          {includeFreeMail ? "Hiding free email domains" : "Include free email domains (gmail, etc.)"}
        </Button>
        <Button
          variant={includeNames ? "default" : "outline"}
          size="sm"
          className="w-full sm:w-auto text-xs"
          onClick={() => setIncludeNames(!includeNames)}
        >
          {includeNames ? "📋 PDF includes participant names" : "🔒 PDF is anonymised"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organisations
          </CardTitle>
          <CardDescription>
            {orgs.length} organisation{orgs.length !== 1 ? "s" : ""} with 2+ submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orgs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No organisations with 2+ submissions found yet.</p>
          ) : (
            <div className="space-y-3">
              {orgs.map((org) => (
                <div key={org.domain} className="rounded-lg border border-border overflow-hidden">
                  {/* Org Header Row */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedOrg(expandedOrg === org.domain ? null : org.domain)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground break-all">{org.domain}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{org.count} people</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap pl-13 sm:pl-0">
                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-black tabular-nums" style={{
                          color: org.avgScore <= 30 ? "hsl(0 72% 51%)" : org.avgScore <= 55 ? "hsl(38 92% 50%)" : org.avgScore <= 75 ? "hsl(200 90% 40%)" : "hsl(155 72% 36%)"
                        }}>{org.avgScore}</p>
                        <p className="text-[10px] text-muted-foreground">avg score</p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={(e) => { e.stopPropagation(); generatePDF(org, includeNames); }}
                      >
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-muted-foreground"
                        onClick={(e) => { e.stopPropagation(); generatePDF(org, false, true); }}
                        title="Download fully anonymised report for public sharing"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Public
                      </Button>

                      {expandedOrg === org.domain
                        ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      }
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {expandedOrg === org.domain && (
                    <div className="border-t border-border bg-muted/20 p-5 space-y-5">
                      {/* Dimension bars */}
                      <div>
                        <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                          <BarChart3 className="h-3.5 w-3.5" />
                          Avg Dimension Scores
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(org.avgDimensions).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-2">
                              <span className="text-[11px] text-muted-foreground w-24 shrink-0 text-right">{SHORT_LABELS[key] || key}</span>
                              <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{
                                  width: `${val}%`,
                                  backgroundColor: val <= 33 ? "hsl(0 72% 51%)" : val <= 66 ? "hsl(38 92% 50%)" : "hsl(155 72% 36%)"
                                }} />
                              </div>
                              <span className="text-[11px] font-bold tabular-nums w-8">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key findings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                            <span className="text-xs font-bold text-destructive">Biggest Gap</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{org.lowestDimension.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Score: {org.lowestDimension.score}/100</p>
                        </div>
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <BarChart3 className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-bold text-primary">Strongest Area</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{org.highestDimension.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Score: {org.highestDimension.score}/100</p>
                        </div>
                      </div>

                      {/* Archetype distribution */}
                      <div>
                        <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">Archetype Distribution</h4>
                        <div className="flex gap-2 flex-wrap">
                          {Object.entries(org.archetypeDistribution).sort(([, a], [, b]) => b - a).map(([arch, count]) => (
                            <Badge key={arch} variant="outline" className="text-xs gap-1">
                              {arch} <span className="font-bold text-primary">×{count}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Score spread */}
                      <div>
                        <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">Individual Score Spread (Anonymous)</h4>
                        <div className="flex items-end gap-1 h-12">
                          {org.results
                            .map((r) => r.overall_score)
                            .sort((a, b) => a - b)
                            .map((score, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-t"
                                style={{
                                  height: `${(score / 100) * 100}%`,
                                  minWidth: 8,
                                  maxWidth: 24,
                                  backgroundColor: score <= 30 ? "hsl(0 72% 51%)" : score <= 55 ? "hsl(38 92% 50%)" : score <= 75 ? "hsl(200 90% 40%)" : "hsl(155 72% 36%)",
                                  opacity: 0.7,
                                }}
                                title={`Score: ${score}`}
                              />
                            ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-muted-foreground">Low: {Math.min(...org.results.map((r) => r.overall_score))}</span>
                          <span className="text-[10px] text-muted-foreground">High: {Math.max(...org.results.map((r) => r.overall_score))}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
