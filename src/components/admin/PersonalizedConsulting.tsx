import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  UserRound, Search, Sparkles, Loader2, ChevronDown, ChevronUp,
  BarChart3, Building2, Users as UsersIcon,
} from "lucide-react";
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

export default function PersonalizedConsulting({ results }: Props) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [brief, setBrief] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [showList, setShowList] = useState(true);

  // Filter out founder tests and sort by date
  const filtered = useMemo(() => {
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

  const selected = useMemo(
    () => (selectedId ? results.find((r) => r.id === selectedId) || null : null),
    [selectedId, results]
  );

  const generateBrief = async (result: DiagnosticResult) => {
    setSelectedId(result.id);
    setShowList(false);
    setBrief("");
    setGenerating(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-consulting-brief`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ result }),
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
              setBrief(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (err: any) {
      setBrief(`**Error:** ${err.message || "Generation failed. Please try again."}`);
    } finally {
      setGenerating(false);
    }
  };

  const weakest = selected
    ? Object.entries(selected.scores).sort(([, a], [, b]) => (a as number) - (b as number))[0]
    : null;
  const strongest = selected
    ? Object.entries(selected.scores).sort(([, a], [, b]) => (b as number) - (a as number))[0]
    : null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Client Prep
        </h1>
        <p className="text-sm text-muted-foreground">
          Select a diagnostic result to generate a personalized consulting brief for the debrief call.
        </p>
      </div>

      {/* Result selector */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <UserRound className="h-4 w-4 text-primary" />
              Select Result
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowList(!showList)}
              className="gap-1 text-xs"
            >
              {showList ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showList ? "Collapse" : "Show List"}
            </Button>
          </div>
          {showList && (
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, company, role, archetype…"
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
              {filtered.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground text-center">No results found.</p>
              ) : (
                filtered.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => generateBrief(r)}
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
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${ARCHETYPE_COLORS[r.archetype] || ""}`}
                        >
                          {r.archetype}
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground">{r.overall_score}/100</span>
                        {r.respondent_role && (
                          <span className="text-[10px] text-muted-foreground">{r.respondent_role}</span>
                        )}
                        {r.team_size && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <UsersIcon className="h-2.5 w-2.5" />
                            {r.team_size}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {format(new Date(r.created_at), "MMM d")}
                    </span>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Selected result summary + brief */}
      {selected && (
        <>
          <Card>
            <CardContent className="pt-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</p>
                  <p className="text-2xl font-bold text-foreground">{selected.overall_score}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Archetype</p>
                  <Badge variant="outline" className={ARCHETYPE_COLORS[selected.archetype] || ""}>
                    {selected.archetype}
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
                {Object.entries(selected.scores).map(([dim, score]) => (
                  <div key={dim} className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{ width: `${score as number}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {DIMENSION_LABELS[dim as Dimension]?.split(" ")[0] || dim}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">{score as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Consulting Brief
                  {generating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateBrief(selected)}
                  disabled={generating}
                  className="gap-1.5 text-xs"
                >
                  <Sparkles className="h-3 w-3" />
                  Regenerate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {brief ? (
                <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
                  <ReactMarkdown>{brief}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {generating ? "Generating your personalized consulting brief…" : "Select a result to generate a brief."}
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
