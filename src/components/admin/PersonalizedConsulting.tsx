import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserRound, Search, Sparkles, Loader2, ChevronDown, ChevronUp,
  BarChart3, Building2, Users as UsersIcon, Presentation, Download,
} from "lucide-react";
import pptxgen from "pptxgenjs";
import { DIMENSION_LABELS, type Dimension } from "@/lib/diagnostic-scoring";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

interface DiagnosticResult {
  id: string;
  email: string | null;
  archetype: string;
  overall_score: number;
  scores: Record<string, number>;
  answers: Record<string, number>;
  created_at: string;
  session_id: string | null;
  email_action_plan: any;
  respondent_role: string | null;
  team_size: string | null;
  company_name: string | null;
  industry: string | null;
  team_leader_email?: string | null;
}

interface Props {
  results: DiagnosticResult[];
}

const ARCHETYPE_COLORS: Record<string, string> = {
  "Flying Solo": "bg-red-500/15 text-red-700 border-red-300",
  "Scattered Effort": "bg-amber-500/15 text-amber-700 border-amber-300",
  "Emerging System": "bg-blue-500/15 text-blue-700 border-blue-300",
  "Compound AI Team": "bg-emerald-500/15 text-emerald-700 border-emerald-300",
};

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com",
]);

function getDomain(email: string): string {
  const parts = email.split("@");
  return parts.length > 1 ? parts[1].toLowerCase() : email.toLowerCase();
}

type PrepMode = "individual" | "team";

interface TeamGroup {
  label: string;
  type: "company" | "team_leader";
  results: DiagnosticResult[];
  avgScore: number;
  avgDimensions: Record<string, number>;
  archetypeDistribution: Record<string, number>;
  lowestDimension: { key: string; label: string; score: number };
  highestDimension: { key: string; label: string; score: number };
  scoreSpread: number;
}

function buildTeamGroups(results: DiagnosticResult[]): TeamGroup[] {
  const groups: TeamGroup[] = [];

  // Group by team_leader_email
  const leaderMap: Record<string, DiagnosticResult[]> = {};
  const companyMap: Record<string, DiagnosticResult[]> = {};

  for (const r of results) {
    const leader = r.team_leader_email?.toLowerCase().trim();
    if (leader) {
      if (!leaderMap[leader]) leaderMap[leader] = [];
      leaderMap[leader].push(r);
    }
    if (r.email) {
      const domain = getDomain(r.email);
      if (!FREE_EMAIL_DOMAINS.has(domain)) {
        if (!companyMap[domain]) companyMap[domain] = [];
        companyMap[domain].push(r);
      }
    }
  }

  // Team leader groups (minimum 2 members)
  for (const [leader, members] of Object.entries(leaderMap)) {
    if (members.length < 2) continue;
    groups.push(computeGroupStats(`Team: ${leader}`, "team_leader", members));
  }

  // Company groups (minimum 2, only if not already covered by a leader group)
  for (const [domain, members] of Object.entries(companyMap)) {
    if (members.length < 2) continue;
    // Check if a leader group already covers most of these
    const alreadyCovered = groups.some(g =>
      g.type === "team_leader" && g.results.length >= members.length * 0.8
      && g.results.every(r => members.includes(r))
    );
    if (!alreadyCovered) {
      groups.push(computeGroupStats(`Company: ${domain}`, "company", members));
    }
  }

  return groups.sort((a, b) => b.results.length - a.results.length);
}

function computeGroupStats(label: string, type: "company" | "team_leader", members: DiagnosticResult[]): TeamGroup {
  const avgScore = members.reduce((s, r) => s + r.overall_score, 0) / members.length;

  const dimTotals: Record<string, number> = {};
  const dimCounts: Record<string, number> = {};
  const archetypes: Record<string, number> = {};

  for (const r of members) {
    archetypes[r.archetype] = (archetypes[r.archetype] || 0) + 1;
    for (const [dim, score] of Object.entries(r.scores)) {
      dimTotals[dim] = (dimTotals[dim] || 0) + (score as number);
      dimCounts[dim] = (dimCounts[dim] || 0) + 1;
    }
  }

  const avgDimensions: Record<string, number> = {};
  for (const dim of Object.keys(dimTotals)) {
    avgDimensions[dim] = dimTotals[dim] / dimCounts[dim];
  }

  const dimEntries = Object.entries(avgDimensions).sort(([, a], [, b]) => a - b);
  const lowest = dimEntries[0];
  const highest = dimEntries[dimEntries.length - 1];

  const scores = members.map(r => r.overall_score);
  const scoreSpread = Math.max(...scores) - Math.min(...scores);

  return {
    label,
    type,
    results: members,
    avgScore,
    avgDimensions,
    archetypeDistribution: archetypes,
    lowestDimension: { key: lowest[0], label: DIMENSION_LABELS[lowest[0] as Dimension] || lowest[0], score: Math.round(lowest[1]) },
    highestDimension: { key: highest[0], label: DIMENSION_LABELS[highest[0] as Dimension] || highest[0], score: Math.round(highest[1]) },
    scoreSpread,
  };
}

/* ── SSE reader helper ── */
async function streamSSE(
  url: string,
  body: object,
  onChunk: (text: string) => void,
) {
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok || !resp.body) {
    const err = await resp.json().catch(() => ({ error: "Failed" }));
    throw new Error(err.error || "Generation failed");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") break;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          fullText += content;
          onChunk(fullText);
        }
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
}

export default function PersonalizedConsulting({ results }: Props) {
  const [mode, setMode] = useState<PrepMode>("individual");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTeamLabel, setSelectedTeamLabel] = useState<string | null>(null);
  const [brief, setBrief] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [generatingSlides, setGeneratingSlides] = useState(false);
  const [showList, setShowList] = useState(true);

  const baseUrl = import.meta.env.VITE_SUPABASE_URL;

  // ── Individual mode data ──
  const filteredIndividual = useMemo(() => {
    const isFounder = (email: string | null) => {
      if (!email) return false;
      const l = email.toLowerCase();
      return l.startsWith("kristof.eger@") || l === "istvan.boscha@aliz.ai";
    };
    let list = results.filter((r) => !isFounder(r.email));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.email?.toLowerCase().includes(q) ||
          r.company_name?.toLowerCase().includes(q) ||
          r.archetype.toLowerCase().includes(q) ||
          r.respondent_role?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [results, search]);

  // ── Team mode data ──
  const teamGroups = useMemo(() => buildTeamGroups(results), [results]);

  const filteredTeams = useMemo(() => {
    if (!search.trim()) return teamGroups;
    const q = search.toLowerCase();
    return teamGroups.filter(g => g.label.toLowerCase().includes(q));
  }, [teamGroups, search]);

  const selectedIndividual = useMemo(
    () => (selectedId ? results.find((r) => r.id === selectedId) || null : null),
    [selectedId, results]
  );

  const selectedTeam = useMemo(
    () => (selectedTeamLabel ? teamGroups.find(g => g.label === selectedTeamLabel) || null : null),
    [selectedTeamLabel, teamGroups]
  );

  // ── Generate individual brief ──
  const generateIndividualBrief = async (result: DiagnosticResult) => {
    setSelectedId(result.id);
    setSelectedTeamLabel(null);
    setShowList(false);
    setBrief("");
    setGenerating(true);
    try {
      await streamSSE(
        `${baseUrl}/functions/v1/generate-consulting-brief`,
        { result },
        (text) => setBrief(text),
      );
    } catch (err: any) {
      setBrief(`**Error:** ${err.message || "Generation failed."}`);
    } finally {
      setGenerating(false);
    }
  };

  // ── Generate team brief ──
  const generateTeamBrief = async (group: TeamGroup) => {
    setSelectedTeamLabel(group.label);
    setSelectedId(null);
    setShowList(false);
    setBrief("");
    setGenerating(true);
    try {
      await streamSSE(
        `${baseUrl}/functions/v1/generate-team-brief`,
        {
          team_label: group.label,
          results: group.results,
          avg_dimensions: group.avgDimensions,
          avg_score: group.avgScore,
          archetype_distribution: group.archetypeDistribution,
          lowest_dimension: group.lowestDimension,
          highest_dimension: group.highestDimension,
          score_spread: group.scoreSpread,
          prep_mode: "presentation",
        },
        (text) => setBrief(text),
      );
    } catch (err: any) {
      setBrief(`**Error:** ${err.message || "Generation failed."}`);
    } finally {
      setGenerating(false);
    }
  };

  // ── Generate PPTX slides for team ──
  const generateTeamSlides = async (group: TeamGroup) => {
    setGeneratingSlides(true);
    try {
      const pptx = new pptxgen();
      pptx.layout = "LAYOUT_WIDE";
      pptx.author = "LIZA OS";
      pptx.subject = `Team Diagnostic: ${group.label}`;

      const DARK = "1A1F2E";
      const PRIMARY = "6366F1";
      const PRIMARY_LIGHT = "818CF8";
      const ACCENT_RED = "EF4444";
      const ACCENT_GREEN = "22C55E";
      const MUTED = "94A3B8";
      const WHITE = "FFFFFF";
      const CARD_BG = "1E2536";

      // Slide 1: Title
      const s1 = pptx.addSlide();
      s1.background = { color: DARK };
      s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: PRIMARY } });
      s1.addText("AI EXECUTION DIAGNOSTIC", { x: 0.8, y: 1.2, w: 11, fontSize: 14, color: PRIMARY_LIGHT, fontFace: "Arial", bold: true, charSpacing: 6 });
      s1.addText(group.label.replace("Team: ", "").replace("Company: ", ""), { x: 0.8, y: 1.8, w: 11, fontSize: 40, color: WHITE, fontFace: "Arial", bold: true });
      s1.addText("Team Performance Review", { x: 0.8, y: 2.8, w: 11, fontSize: 20, color: MUTED, fontFace: "Arial" });
      s1.addText(`${group.results.length} participants  •  Avg score: ${Math.round(group.avgScore)}/100  •  Spread: ${group.scoreSpread} pts`, { x: 0.8, y: 4.0, w: 11, fontSize: 14, color: MUTED, fontFace: "Arial" });

      // Slide 2: At a Glance
      const s2 = pptx.addSlide();
      s2.background = { color: DARK };
      s2.addText("AT A GLANCE", { x: 0.8, y: 0.4, w: 5, fontSize: 12, color: PRIMARY_LIGHT, bold: true, charSpacing: 4, fontFace: "Arial" });
      s2.addShape(pptx.ShapeType.rect, { x: 0.8, y: 0.7, w: 1.5, h: 0.04, fill: { color: PRIMARY } });

      const metrics = [
        { label: "AVG SCORE", value: `${Math.round(group.avgScore)}`, sub: "/100" },
        { label: "MEMBERS", value: `${group.results.length}`, sub: "participants" },
        { label: "SPREAD", value: `${group.scoreSpread}`, sub: group.scoreSpread > 20 ? "fragmented" : group.scoreSpread > 10 ? "moderate" : "aligned" },
      ];
      metrics.forEach((m, i) => {
        const xPos = 0.8 + i * 3.8;
        s2.addShape(pptx.ShapeType.roundRect, { x: xPos, y: 1.2, w: 3.4, h: 1.8, fill: { color: CARD_BG }, rectRadius: 0.1 });
        s2.addText(m.label, { x: xPos + 0.3, y: 1.4, w: 2.8, fontSize: 10, color: MUTED, bold: true, charSpacing: 3, fontFace: "Arial" });
        s2.addText(m.value, { x: xPos + 0.3, y: 1.8, w: 2.8, fontSize: 44, color: WHITE, bold: true, fontFace: "Arial" });
        s2.addText(m.sub, { x: xPos + 0.3, y: 2.5, w: 2.8, fontSize: 12, color: MUTED, fontFace: "Arial" });
      });

      // Archetype distribution
      s2.addText("ARCHETYPE DISTRIBUTION", { x: 0.8, y: 3.5, w: 5, fontSize: 10, color: MUTED, bold: true, charSpacing: 3, fontFace: "Arial" });
      const archEntries = Object.entries(group.archetypeDistribution);
      const archColors: Record<string, string> = { "Flying Solo": "EF4444", "Scattered Effort": "F59E0B", "Emerging System": "3B82F6", "Compound AI Team": "22C55E" };
      archEntries.forEach(([arch, count], i) => {
        const xPos = 0.8 + i * 3;
        s2.addShape(pptx.ShapeType.roundRect, { x: xPos, y: 3.9, w: 2.6, h: 1.0, fill: { color: CARD_BG }, rectRadius: 0.08 });
        s2.addText(`${count}×`, { x: xPos + 0.2, y: 3.95, w: 2.2, fontSize: 24, color: archColors[arch] || PRIMARY_LIGHT, bold: true, fontFace: "Arial" });
        s2.addText(arch, { x: xPos + 0.2, y: 4.45, w: 2.2, fontSize: 11, color: MUTED, fontFace: "Arial" });
      });

      // Slide 3: Dimension Scores
      const s3 = pptx.addSlide();
      s3.background = { color: DARK };
      s3.addText("DIMENSION SCORES", { x: 0.8, y: 0.4, w: 5, fontSize: 12, color: PRIMARY_LIGHT, bold: true, charSpacing: 4, fontFace: "Arial" });
      s3.addShape(pptx.ShapeType.rect, { x: 0.8, y: 0.7, w: 1.5, h: 0.04, fill: { color: PRIMARY } });

      const sortedDims = Object.entries(group.avgDimensions).sort(([, a], [, b]) => b - a);
      sortedDims.forEach(([dim, score], i) => {
        const yPos = 1.2 + i * 0.8;
        const label = DIMENSION_LABELS[dim as Dimension] || dim;
        const barWidth = (score / 100) * 8;
        const isLowest = dim === group.lowestDimension.key;
        const isHighest = dim === group.highestDimension.key;
        const barColor = isLowest ? ACCENT_RED : isHighest ? ACCENT_GREEN : PRIMARY;

        s3.addText(label, { x: 0.8, y: yPos, w: 3.5, fontSize: 13, color: WHITE, fontFace: "Arial" });
        s3.addShape(pptx.ShapeType.roundRect, { x: 4.5, y: yPos + 0.1, w: 8, h: 0.35, fill: { color: CARD_BG }, rectRadius: 0.05 });
        s3.addShape(pptx.ShapeType.roundRect, { x: 4.5, y: yPos + 0.1, w: barWidth, h: 0.35, fill: { color: barColor }, rectRadius: 0.05 });
        s3.addText(`${Math.round(score)}`, { x: 12.7, y: yPos, w: 0.7, fontSize: 13, color: isLowest ? ACCENT_RED : isHighest ? ACCENT_GREEN : MUTED, bold: true, fontFace: "Arial", align: "right" });
      });

      // Slide 4: Perception Gap / Individual Spread
      const s4 = pptx.addSlide();
      s4.background = { color: DARK };
      s4.addText("PERCEPTION GAP", { x: 0.8, y: 0.4, w: 5, fontSize: 12, color: PRIMARY_LIGHT, bold: true, charSpacing: 4, fontFace: "Arial" });
      s4.addShape(pptx.ShapeType.rect, { x: 0.8, y: 0.7, w: 1.5, h: 0.04, fill: { color: PRIMARY } });
      s4.addText("How individual scores compare — wider gaps indicate misaligned perceptions within the team.", { x: 0.8, y: 0.9, w: 11, fontSize: 12, color: MUTED, fontFace: "Arial" });

      // Show each member's overall score as a dot chart
      const sortedMembers = [...group.results].sort((a, b) => b.overall_score - a.overall_score);
      sortedMembers.forEach((member, i) => {
        const yPos = 1.6 + i * 0.45;
        if (yPos > 4.8) return;
        const nameStr = member.email ? member.email.split("@")[0] : `Member ${i + 1}`;
        s4.addText(nameStr, { x: 0.8, y: yPos, w: 2.5, fontSize: 11, color: MUTED, fontFace: "Arial" });
        // Score bar
        const barW = (member.overall_score / 100) * 7;
        s4.addShape(pptx.ShapeType.roundRect, { x: 3.5, y: yPos + 0.05, w: 7, h: 0.28, fill: { color: CARD_BG }, rectRadius: 0.04 });
        s4.addShape(pptx.ShapeType.roundRect, { x: 3.5, y: yPos + 0.05, w: barW, h: 0.28, fill: { color: PRIMARY }, rectRadius: 0.04 });
        s4.addText(`${member.overall_score}`, { x: 10.7, y: yPos, w: 0.8, fontSize: 11, color: WHITE, bold: true, fontFace: "Arial", align: "right" });
        // Archetype badge
        s4.addText(member.archetype, { x: 11.6, y: yPos, w: 1.6, fontSize: 9, color: archColors[member.archetype] || MUTED, fontFace: "Arial" });
      });

      // Slide 5: Key Findings & Action
      const s5 = pptx.addSlide();
      s5.background = { color: DARK };
      s5.addText("KEY FINDINGS", { x: 0.8, y: 0.4, w: 5, fontSize: 12, color: PRIMARY_LIGHT, bold: true, charSpacing: 4, fontFace: "Arial" });
      s5.addShape(pptx.ShapeType.rect, { x: 0.8, y: 0.7, w: 1.5, h: 0.04, fill: { color: PRIMARY } });

      // Weakness card
      s5.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 1.2, w: 5.8, h: 2.4, fill: { color: CARD_BG }, rectRadius: 0.1 });
      s5.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.2, w: 0.06, h: 2.4, fill: { color: ACCENT_RED } });
      s5.addText("BIGGEST GAP", { x: 1.2, y: 1.35, w: 5, fontSize: 10, color: ACCENT_RED, bold: true, charSpacing: 3, fontFace: "Arial" });
      s5.addText(group.lowestDimension.label, { x: 1.2, y: 1.7, w: 5, fontSize: 22, color: WHITE, bold: true, fontFace: "Arial" });
      s5.addText(`Score: ${group.lowestDimension.score}/100`, { x: 1.2, y: 2.3, w: 5, fontSize: 14, color: ACCENT_RED, fontFace: "Arial" });
      s5.addText("This is where operational friction is highest.\nFocus improvement efforts here first.", { x: 1.2, y: 2.7, w: 5, fontSize: 12, color: MUTED, fontFace: "Arial" });

      // Strength card
      s5.addShape(pptx.ShapeType.roundRect, { x: 7, y: 1.2, w: 5.8, h: 2.4, fill: { color: CARD_BG }, rectRadius: 0.1 });
      s5.addShape(pptx.ShapeType.rect, { x: 7, y: 1.2, w: 0.06, h: 2.4, fill: { color: ACCENT_GREEN } });
      s5.addText("STRONGEST AREA", { x: 7.4, y: 1.35, w: 5, fontSize: 10, color: ACCENT_GREEN, bold: true, charSpacing: 3, fontFace: "Arial" });
      s5.addText(group.highestDimension.label, { x: 7.4, y: 1.7, w: 5, fontSize: 22, color: WHITE, bold: true, fontFace: "Arial" });
      s5.addText(`Score: ${group.highestDimension.score}/100`, { x: 7.4, y: 2.3, w: 5, fontSize: 14, color: ACCENT_GREEN, fontFace: "Arial" });
      s5.addText("Leverage this cultural strength to\naddress the gap above.", { x: 7.4, y: 2.7, w: 5, fontSize: 12, color: MUTED, fontFace: "Arial" });

      // Bottom insight
      s5.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 4.0, w: 12, h: 1.2, fill: { color: CARD_BG }, rectRadius: 0.1 });
      s5.addText("RECOMMENDED NEXT STEP", { x: 1.2, y: 4.15, w: 11, fontSize: 10, color: PRIMARY_LIGHT, bold: true, charSpacing: 3, fontFace: "Arial" });
      s5.addText(
        group.scoreSpread > 20
          ? "High score spread indicates the team lacks shared standards. Priority: align on what 'good' looks like through shared protocols and context."
          : group.lowestDimension.score < 40
          ? `Critical gap in ${group.lowestDimension.label}. Start with a 30-day sprint focused on building foundational practices in this dimension.`
          : `Solid baseline. Focus on moving ${group.lowestDimension.label} from 'functional' to 'systematic' through structured knowledge sharing.`,
        { x: 1.2, y: 4.55, w: 11, fontSize: 13, color: WHITE, fontFace: "Arial" }
      );

      // Slide 6: Discussion
      const s6 = pptx.addSlide();
      s6.background = { color: DARK };
      s6.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: PRIMARY } });
      s6.addText("DISCUSSION", { x: 0.8, y: 1.5, w: 11, fontSize: 14, color: PRIMARY_LIGHT, bold: true, charSpacing: 6, fontFace: "Arial" });
      s6.addText("Where do you see the\nbiggest opportunity?", { x: 0.8, y: 2.0, w: 11, fontSize: 36, color: WHITE, bold: true, fontFace: "Arial" });
      s6.addText(`${group.label}  •  ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`, { x: 0.8, y: 4.2, w: 11, fontSize: 14, color: MUTED, fontFace: "Arial" });

      const fileName = `${group.label.replace(/[^a-zA-Z0-9]/g, "_")}_presentation.pptx`;
      await pptx.writeFile({ fileName });
    } catch (err: any) {
      alert(`Slide generation failed: ${err.message}`);
    } finally {
      setGeneratingSlides(false);
    }
  };

  const weakest = selectedIndividual
    ? Object.entries(selectedIndividual.scores).sort(([, a], [, b]) => (a as number) - (b as number))[0]
    : null;
  const strongest = selectedIndividual
    ? Object.entries(selectedIndividual.scores).sort(([, a], [, b]) => (b as number) - (a as number))[0]
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Client Prep
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "individual"
              ? "Select a diagnostic result to generate a personalized consulting brief."
              : "Select a team or company to prepare a presentation walkthrough brief."}
          </p>
        </div>
        <Tabs value={mode} onValueChange={(v) => { setMode(v as PrepMode); setBrief(""); setSelectedId(null); setSelectedTeamLabel(null); setShowList(true); }}>
          <TabsList className="h-8">
            <TabsTrigger value="individual" className="text-xs gap-1.5 px-3">
              <UserRound className="h-3.5 w-3.5" />
              Individual
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs gap-1.5 px-3">
              <UsersIcon className="h-3.5 w-3.5" />
              Team / Company
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Selector card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              {mode === "individual" ? <UserRound className="h-4 w-4 text-primary" /> : <UsersIcon className="h-4 w-4 text-primary" />}
              {mode === "individual" ? "Select Result" : "Select Team / Company"}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowList(!showList)} className="gap-1 text-xs">
              {showList ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showList ? "Collapse" : "Show List"}
            </Button>
          </div>
          {showList && (
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={mode === "individual" ? "Search by email, company, role, archetype…" : "Search by team leader or company domain…"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          )}
        </CardHeader>
        {showList && (
          <CardContent className="pt-0">
            <div className="max-h-[340px] overflow-y-auto divide-y divide-border rounded-md border border-border">
              {mode === "individual" ? (
                filteredIndividual.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">No results found.</p>
                ) : (
                  filteredIndividual.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => generateIndividualBrief(r)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent/50 ${
                        selectedId === r.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground truncate">
                            {r.email || "Anonymous"}
                          </span>
                          {r.company_name && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {r.company_name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${ARCHETYPE_COLORS[r.archetype] || ""}`}>
                            {r.archetype}
                          </Badge>
                          <span className="font-mono text-xs text-muted-foreground">{r.overall_score}/100</span>
                          {r.respondent_role && <span className="text-[10px] text-muted-foreground">{r.respondent_role}</span>}
                          {r.team_size && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <UsersIcon className="h-2.5 w-2.5" /> {r.team_size}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {format(new Date(r.created_at), "MMM d")}
                      </span>
                    </button>
                  ))
                )
              ) : (
                filteredTeams.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">No teams found. Teams require at least 2 members.</p>
                ) : (
                  filteredTeams.map((g) => (
                    <button
                      key={g.label}
                      onClick={() => generateTeamBrief(g)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent/50 ${
                        selectedTeamLabel === g.label ? "bg-primary/5 border-l-2 border-l-primary" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {g.type === "team_leader" ? (
                            <UsersIcon className="h-4 w-4 text-primary shrink-0" />
                          ) : (
                            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <span className="text-sm font-medium text-foreground truncate">{g.label}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-muted-foreground">{g.results.length} members</span>
                          <span className="font-mono text-xs text-muted-foreground">avg {Math.round(g.avgScore)}/100</span>
                          <span className="text-[10px] text-muted-foreground">spread: {g.scoreSpread}pts</span>
                          {Object.entries(g.archetypeDistribution).map(([arch, count]) => (
                            <Badge key={arch} variant="outline" className={`text-[10px] px-1.5 py-0 ${ARCHETYPE_COLORS[arch] || ""}`}>
                              {count}× {arch.split(" ")[0]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-destructive">{g.lowestDimension.label.split(" ")[0]} {g.lowestDimension.score}</p>
                        <p className="text-[10px] text-primary">{g.highestDimension.label.split(" ")[0]} {g.highestDimension.score}</p>
                      </div>
                    </button>
                  ))
                )
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Individual summary */}
      {mode === "individual" && selectedIndividual && (
        <Card>
          <CardContent className="pt-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</p>
                <p className="text-2xl font-bold text-foreground">{selectedIndividual.overall_score}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Archetype</p>
                <Badge variant="outline" className={ARCHETYPE_COLORS[selectedIndividual.archetype] || ""}>
                  {selectedIndividual.archetype}
                </Badge>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Weakest</p>
                <p className="text-sm font-medium text-destructive">
                  {weakest ? `${DIMENSION_LABELS[weakest[0] as Dimension] || weakest[0]} (${weakest[1]})` : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Strongest</p>
                <p className="text-sm font-medium text-primary">
                  {strongest ? `${DIMENSION_LABELS[strongest[0] as Dimension] || strongest[0]} (${strongest[1]})` : "—"}
                </p>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex gap-3 flex-wrap">
              {Object.entries(selectedIndividual.scores).map(([dim, score]) => (
                <div key={dim} className="flex items-center gap-1.5">
                  <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary/70" style={{ width: `${score as number}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{DIMENSION_LABELS[dim as Dimension]?.split(" ")[0] || dim}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{score as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team summary */}
      {mode === "team" && selectedTeam && (
        <Card>
          <CardContent className="pt-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(selectedTeam.avgScore)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Members</p>
                <p className="text-2xl font-bold text-foreground">{selectedTeam.results.length}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Weakest</p>
                <p className="text-sm font-medium text-destructive">
                  {selectedTeam.lowestDimension.label} ({selectedTeam.lowestDimension.score})
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Strongest</p>
                <p className="text-sm font-medium text-primary">
                  {selectedTeam.highestDimension.label} ({selectedTeam.highestDimension.score})
                </p>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex gap-3 flex-wrap">
              {Object.entries(selectedTeam.avgDimensions).map(([dim, score]) => (
                <div key={dim} className="flex items-center gap-1.5">
                  <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary/70" style={{ width: `${Math.round(score)}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{DIMENSION_LABELS[dim as Dimension]?.split(" ")[0] || dim}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{Math.round(score)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Score Spread:</span>
              <Badge variant={selectedTeam.scoreSpread > 20 ? "destructive" : "secondary"} className="text-xs">
                {selectedTeam.scoreSpread} pts {selectedTeam.scoreSpread > 20 ? "(fragmented)" : selectedTeam.scoreSpread > 10 ? "(moderate)" : "(aligned)"}
              </Badge>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground ml-3">Archetypes:</span>
              {Object.entries(selectedTeam.archetypeDistribution).map(([arch, count]) => (
                <Badge key={arch} variant="outline" className={`text-[10px] ${ARCHETYPE_COLORS[arch] || ""}`}>
                  {count}× {arch}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brief output */}
      {(selectedIndividual || selectedTeam) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                {mode === "team" ? <Presentation className="h-4 w-4 text-primary" /> : <Sparkles className="h-4 w-4 text-primary" />}
                {mode === "team" ? "Team Presentation Prep" : "Consulting Brief"}
                {generating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </CardTitle>
              <div className="flex items-center gap-2">
                {mode === "team" && selectedTeam && brief && !generating && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => generateTeamSlides(selectedTeam)}
                    disabled={generatingSlides}
                    className="gap-1.5 text-xs"
                  >
                    {generatingSlides ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                    Download Slides
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (mode === "individual" && selectedIndividual) generateIndividualBrief(selectedIndividual);
                    if (mode === "team" && selectedTeam) generateTeamBrief(selectedTeam);
                  }}
                  disabled={generating}
                  className="gap-1.5 text-xs"
                >
                  <Sparkles className="h-3 w-3" />
                  Regenerate
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {brief ? (
              <div className="prose prose-sm max-w-none dark:prose-invert
                [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-border/40
                [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2
                [&_p]:text-muted-foreground [&_p]:leading-7 [&_p]:my-3
                [&_ul]:my-3 [&_ul]:space-y-2 [&_ul]:pl-5
                [&_ol]:my-3 [&_ol]:space-y-2 [&_ol]:pl-5
                [&_li]:text-muted-foreground [&_li]:leading-7
                [&_strong]:text-foreground [&_strong]:font-semibold
                [&_em]:text-foreground/80
                [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:bg-primary/5 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:rounded-r-md [&_blockquote]:my-4
                [&_hr]:border-border/30 [&_hr]:my-8
              ">
                <ReactMarkdown>{brief}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {generating
                  ? mode === "team"
                    ? "Generating your team presentation prep brief…"
                    : "Generating your personalized consulting brief…"
                  : "Select a result to generate a brief."}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
