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

  const generatePDF = (org: OrgData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const addText = (text: string, size: number, style: string = "normal", color: [number, number, number] = [30, 30, 30]) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", style);
      doc.setTextColor(...color);
    };

    const checkNewPage = (needed: number) => {
      if (y + needed > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // ── Header ──
    addText("", 22, "bold", [20, 100, 180]);
    doc.text("AI Execution Readiness", margin, y);
    y += 8;
    addText("", 22, "bold", [20, 100, 180]);
    doc.text("Organisational Insight Report", margin, y);
    y += 12;

    addText("", 10, "normal", [120, 120, 120]);
    doc.text(`Prepared for: ${org.domain}`, margin, y);
    y += 5;
    doc.text(`Based on ${org.count} anonymous team member assessments`, margin, y);
    y += 5;
    doc.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, margin, y);
    y += 5;
    doc.text("Powered by LIZA OS — lizaos.ai", margin, y);
    y += 12;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // ── Executive Summary ──
    addText("", 14, "bold", [30, 30, 30]);
    doc.text("Executive Summary", margin, y);
    y += 8;

    addText("", 10, "normal", [50, 50, 50]);
    const summaryLines = doc.splitTextToSize(
      `${org.count} members of your organisation independently completed the AI Execution Diagnostic. ` +
      `This report aggregates their anonymous responses to surface organisational patterns — not individual performance. ` +
      `The data reveals where your team's AI usage is creating value and where institutional knowledge is leaking.`,
      contentWidth
    );
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 6;

    // ── Overall Score ──
    addText("", 14, "bold", [30, 30, 30]);
    doc.text("Overall Team Score", margin, y);
    y += 8;

    const scoreColor: [number, number, number] = org.avgScore <= 30 ? [220, 38, 38] : org.avgScore <= 55 ? [217, 119, 6] : org.avgScore <= 75 ? [37, 99, 235] : [22, 163, 74];
    addText("", 36, "bold", scoreColor);
    doc.text(`${org.avgScore}`, margin, y);
    addText("", 12, "normal", [120, 120, 120]);
    doc.text("/ 100", margin + 25, y);
    y += 10;

    // Archetype distribution
    const archetypeLabel = Object.entries(org.archetypeDistribution)
      .sort(([, a], [, b]) => b - a)
      .map(([arch, count]) => `${arch} (${count})`)
      .join(", ");
    addText("", 10, "normal", [80, 80, 80]);
    const archLines = doc.splitTextToSize(`Archetype distribution: ${archetypeLabel}`, contentWidth);
    doc.text(archLines, margin, y);
    y += archLines.length * 5 + 8;

    // ── Dimension Breakdown ──
    checkNewPage(80);
    addText("", 14, "bold", [30, 30, 30]);
    doc.text("Dimension Breakdown", margin, y);
    y += 8;

    const dimEntries = Object.entries(org.avgDimensions);
    for (const [key, score] of dimEntries) {
      checkNewPage(18);
      const label = DIMENSION_LABELS[key as Dimension] || SHORT_LABELS[key] || key;
      const barWidth = (score / 100) * (contentWidth - 80);

      addText("", 10, "bold", [50, 50, 50]);
      doc.text(label, margin, y);
      addText("", 10, "bold", scoreColor);
      doc.text(`${score}`, pageWidth - margin - 10, y, { align: "right" });

      y += 4;
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(margin, y, contentWidth - 20, 4, 2, 2, "F");
      const dimColor: [number, number, number] = score <= 33 ? [220, 38, 38] : score <= 66 ? [217, 119, 6] : [22, 163, 74];
      doc.setFillColor(...dimColor);
      doc.roundedRect(margin, y, Math.max(barWidth, 4), 4, 2, 2, "F");
      y += 12;
    }

    // ── Key Findings ──
    checkNewPage(60);
    y += 4;
    addText("", 14, "bold", [30, 30, 30]);
    doc.text("Key Findings", margin, y);
    y += 8;

    // Biggest gap
    addText("", 10, "bold", [220, 38, 38]);
    doc.text(`⚠ Biggest Gap: ${org.lowestDimension.label} (${org.lowestDimension.score}/100)`, margin, y);
    y += 6;
    addText("", 10, "normal", [80, 80, 80]);
    const gapText = doc.splitTextToSize(
      `This is where your team is losing the most institutional value. Multiple team members scored this as your weakest area, suggesting a systemic gap rather than an individual one.`,
      contentWidth
    );
    doc.text(gapText, margin, y);
    y += gapText.length * 5 + 6;

    // Strongest area
    addText("", 10, "bold", [22, 163, 74]);
    doc.text(`✓ Strongest Area: ${org.highestDimension.label} (${org.highestDimension.score}/100)`, margin, y);
    y += 6;
    addText("", 10, "normal", [80, 80, 80]);
    const strengthText = doc.splitTextToSize(
      `Your team collectively rates this as your most developed capability. This can serve as a foundation to build upon when addressing weaker dimensions.`,
      contentWidth
    );
    doc.text(strengthText, margin, y);
    y += strengthText.length * 5 + 8;

    // ── Consistency Insight ──
    checkNewPage(40);
    addText("", 14, "bold", [30, 30, 30]);
    doc.text("Team Alignment", margin, y);
    y += 8;

    // Calculate score variance
    const scores = org.results.map((r) => r.overall_score);
    const scoreRange = Math.max(...scores) - Math.min(...scores);
    const alignmentText = scoreRange > 40
      ? `There is a ${scoreRange}-point spread between your highest and lowest scoring team members. This significant variance suggests fragmented AI adoption — some individuals are far ahead of the team norm. Closing this gap is your highest-leverage opportunity.`
      : scoreRange > 20
        ? `There is a ${scoreRange}-point spread across your team. Your team is somewhat aligned, but pockets of inconsistency exist. Targeted process sharing could reduce this variance quickly.`
        : `Your team scores are tightly clustered (${scoreRange}-point spread). This alignment is positive — improvements can be made uniformly. Your team is ready for structured capability building.`;

    addText("", 10, "normal", [50, 50, 50]);
    const alignLines = doc.splitTextToSize(alignmentText, contentWidth);
    doc.text(alignLines, margin, y);
    y += alignLines.length * 5 + 10;

    // ── Recommendations ──
    checkNewPage(60);
    addText("", 14, "bold", [30, 30, 30]);
    doc.text("Recommended Next Steps", margin, y);
    y += 8;

    const recommendations = [
      {
        title: "1. Address the Gap",
        text: `Focus on "${org.lowestDimension.label}" first. This is where the organisation is bleeding the most execution value. A structured 4-week sprint targeting this dimension would have outsized impact.`,
      },
      {
        title: "2. Build on Strength",
        text: `Leverage your "${org.highestDimension.label}" capability as a template. Document what's working there and replicate the pattern across weaker areas.`,
      },
      {
        title: "3. Make AI Work Visible",
        text: `With ${org.count} team members already aware of their gaps, now is the moment to introduce shared protocols. Individual awareness without collective infrastructure leads to the same scattered effort.`,
      },
    ];

    for (const rec of recommendations) {
      checkNewPage(25);
      addText("", 10, "bold", [20, 100, 180]);
      doc.text(rec.title, margin, y);
      y += 6;
      addText("", 10, "normal", [50, 50, 50]);
      const recLines = doc.splitTextToSize(rec.text, contentWidth);
      doc.text(recLines, margin, y);
      y += recLines.length * 5 + 6;
    }

    // ── Footer CTA ──
    checkNewPage(30);
    y += 6;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    addText("", 11, "bold", [20, 100, 180]);
    doc.text("Ready to close the gap?", margin, y);
    y += 7;
    addText("", 10, "normal", [50, 50, 50]);
    const ctaLines = doc.splitTextToSize(
      "LIZA OS turns diagnostic insights into executable team infrastructure. " +
      "Book a 30-minute walkthrough to see how your team's specific gaps map to concrete improvements. " +
      "Contact: hello@lizaos.ai | lizaos.ai",
      contentWidth
    );
    doc.text(ctaLines, margin, y);

    doc.save(`AI-Execution-Report_${org.domain}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-foreground">Org Insights</h1>
        <p className="text-sm text-muted-foreground">Organisations with 2+ diagnostic submissions — anonymous aggregate reports for decision makers.</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={includeFreeMail ? "secondary" : "outline"}
          size="sm"
          onClick={() => setIncludeFreeMail(!includeFreeMail)}
        >
          {includeFreeMail ? "Hiding free email domains" : "Include free email domains (gmail, etc.)"}
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
                        onClick={(e) => { e.stopPropagation(); generatePDF(org); }}
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
