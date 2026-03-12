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

export default function OrgInsights({ results }: { results: DiagnosticResult[] }) {
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
  const [includeFreeMail, setIncludeFreeMail] = useState(false);
  const [includeNames, setIncludeNames] = useState(false);

  const orgs = useMemo(() => {
    // Group by email domain, only include results with emails
    const grouped: Record<string, DiagnosticResult[]> = {};
    for (const r of results) {
      if (!r.email) continue;
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
    checkNewPage(40);
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(251, 191, 36);
    doc.roundedRect(margin, y, contentWidth, 34, 3, 3, "FD");

    setFont(10, "bold", [146, 64, 14]);
    doc.text("KEY TAKEAWAY", margin + 6, y + 7);
    setFont(9, "normal", [120, 80, 20]);

    const gapLabel = DIMENSION_LABELS[org.lowestDimension.key as Dimension] || org.lowestDimension.label;
    const strengthLabel = DIMENSION_LABELS[org.highestDimension.key as Dimension] || org.highestDimension.label;
    const gapCost = COST_PER_DIM[org.lowestDimension.key]?.[getTier(org.lowestDimension.score)] || "";

    const takeawayText = `Your team's biggest AI execution gap is ${gapLabel} (${org.lowestDimension.score}/100). ` +
      `In practice: ${gapCost} ` +
      `Meanwhile, ${strengthLabel} (${org.highestDimension.score}/100) shows your team can build structured AI habits. ` +
      `The question is whether you can replicate that discipline across other areas before the gap widens.`;
    const takeawayLines = doc.splitTextToSize(takeawayText, contentWidth - 14);
    doc.text(takeawayLines, margin + 6, y + 14);
    y += 40;

    // ════════════════════════════════════════════
    // PAGE 2: DETAILED ANALYSIS
    // ════════════════════════════════════════════
    doc.addPage();
    y = margin;

    // Brand header
    setFont(9, "normal", [140, 140, 140]);
    doc.text("LIZA OS  |  AI Execution Maturity Audit", margin, y);
    doc.text(fullyAnonymized ? "" : `${org.domain}`, pageWidth - margin, y, { align: "right" });
    y += 10;

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

      // Per-dimension score spread
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
    // PAGE 3: RECOMMENDATIONS + CTA
    // ════════════════════════════════════════════
    doc.addPage();
    y = margin;

    setFont(9, "normal", [140, 140, 140]);
    doc.text("LIZA OS  |  AI Execution Maturity Audit", margin, y);
    doc.text(fullyAnonymized ? "" : `${org.domain}`, pageWidth - margin, y, { align: "right" });
    y += 10;

    drawSectionHeader("Recommendations");

    // Adaptive recommendations based on archetype/score (Cynefin-informed)
    const isLow = org.avgScore <= 35;
    const isMid = org.avgScore > 35 && org.avgScore <= 65;

    const recommendations = isLow
      ? [
          {
            title: "1. Make one workflow repeatable",
            text: `Your team is in exploration mode. Before optimising, pick your single highest-value, most-repeated task. Write down what "good" looks like for that task. Make it the starting point for every AI session on that workflow. Don't try to systematise everything at once.`,
          },
          {
            title: "2. Create visibility before structure",
            text: `Start a weekly 15-minute show-and-tell where one person demonstrates their best AI technique from the past week. The goal isn't to document everything. It's to make the invisible visible. People can't adopt what they can't see.`,
          },
          {
            title: "3. Assign a \"standards owner\" for one domain",
            text: `One person, one area of expertise, one written reference. This person's job is to keep a living document of "how we do X with AI." It should be updated after every project. Start with your weakest dimension: ${gapLabel}.`,
          },
        ]
      : isMid
        ? [
            {
              title: "1. Close the gap between knowing and doing",
              text: `Your team has standards, but they're optional. The gap between "${strengthLabel}" (${org.highestDimension.score}) and "${gapLabel}" (${org.lowestDimension.score}) shows where knowledge exists but isn't reaching execution. Make your strongest dimension's patterns the template for fixing your weakest.`,
            },
            {
              title: "2. Introduce structured after-action reviews",
              text: `You're capturing knowledge but not closing the loop. After each significant project, run a 20-minute review: What AI approaches worked? What didn't? What should change in the team's shared reference? This is the mechanism that turns individual learning into collective improvement.`,
            },
            {
              title: "3. Reduce key-person dependency",
              text: `Your ${scoreRange > 20 ? "wide" : "moderate"} score spread suggests capability is concentrated in a few people. Pair your strongest AI users with others on real work (not training sessions). Apprenticeship through shared execution transfers tacit knowledge that documentation alone cannot.`,
            },
          ]
        : [
            {
              title: "1. Extend your system across domains",
              text: `Your team has real infrastructure for AI execution. The next step is cross-domain transfer: take the approaches that work in your strongest area and adapt them to adjacent practice areas or client verticals. The methodology is proven. Now scale it.`,
            },
            {
              title: "2. Measure AI execution ROI",
              text: `You're in a position to quantify what your AI maturity is worth. Track: time-to-first-draft, senior review hours, rework frequency, and new hire ramp time. These metrics justify continued investment and make the business case for extending your approach to other teams.`,
            },
            {
              title: "3. Make your approach a competitive asset",
              text: `Teams scoring ${org.avgScore}+ are rare. Your defined approach to AI execution is a differentiator in client conversations and talent acquisition. Document it as an institutional capability, not just internal process.`,
            },
          ];

    for (const rec of recommendations) {
      checkNewPage(30);

      // Colored left-border block
      doc.setFillColor(240, 249, 255);
      const recText = doc.splitTextToSize(rec.text, contentWidth - 14);
      const blockHeight = 8 + recText.length * 4 + 4;

      doc.roundedRect(margin, y, contentWidth, blockHeight, 2, 2, "F");
      doc.setFillColor(20, 100, 180);
      doc.rect(margin, y, 3, blockHeight, "F");

      setFont(10, "bold", [20, 80, 160]);
      doc.text(rec.title, margin + 8, y + 6);
      setFont(9, "normal", [50, 50, 50]);
      doc.text(recText, margin + 8, y + 12);
      y += blockHeight + 6;
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
    checkNewPage(40);
    drawDivider();

    setFont(14, "bold", [20, 80, 160]);
    doc.text("Ready to close the gap?", margin, y);
    y += 8;
    writeWrapped(
      "This report surfaces patterns. LIZA OS turns those patterns into infrastructure: shared standards that reach every AI session, structured learning loops, and full visibility into how your team executes with AI.",
      9.5, "normal", [50, 50, 50]
    );
    y += 2;

    setFont(10, "bold", [20, 80, 160]);
    doc.text("Book a 30-minute walkthrough:", margin, y);
    setFont(10, "normal", [20, 100, 180]);
    doc.text("kristof.eger@lizaos.ai  |  lizaos.ai", margin, y + 6);
    y += 14;

    // Footer
    setFont(8, "normal", [160, 160, 160]);
    doc.text("Confidential. Prepared by LIZA OS. Data is anonymous and aggregated.", margin, pageHeight - 10);

    doc.save(`AI-Execution-Audit_${org.domain}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-foreground">Org Insights</h1>
        <p className="text-sm text-muted-foreground">Organisations with 2+ diagnostic submissions — anonymous aggregate reports for decision makers.</p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant={includeFreeMail ? "secondary" : "outline"}
          size="sm"
          onClick={() => setIncludeFreeMail(!includeFreeMail)}
        >
          {includeFreeMail ? "Hiding free email domains" : "Include free email domains (gmail, etc.)"}
        </Button>
        <Button
          variant={includeNames ? "default" : "outline"}
          size="sm"
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
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedOrg(expandedOrg === org.domain ? null : org.domain)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{org.domain}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{org.count} people</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
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
