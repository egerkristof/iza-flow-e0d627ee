import { useState, useEffect, useCallback } from "react";
import { Search, Globe, Database, Pin, ChevronDown, Sparkles, Clock, BookOpen, Layers, Lightbulb, BookUp, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ImportCopilotDialog } from "@/components/knowledge/ImportCopilotDialog";
import type { ExtractionResult } from "@/lib/knowledge-schema";

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  source: string;
  relevance: number;
  type: "internal" | "external";
  category?: string;
  lastUpdated?: string;
}

const MOCK_RESULTS: SearchResult[] = [
  { id: "1", title: "Q1 Pricing Strategy Update", snippet: "Updated pricing tiers based on market analysis. New enterprise tier at $299/seat with volume discounts starting at 50 seats. Approval matrix updated for deals above $100K ARR.", source: "Strategy Docs", relevance: 0.95, type: "internal", category: "KNOWLEDGE", lastUpdated: "2d ago" },
  { id: "2", title: "Competitor X Product Launch", snippet: "Competitor X announced new AI-powered features targeting mid-market segment. Key differentiators include automated onboarding and native integrations with 200+ tools.", source: "TechCrunch", relevance: 0.88, type: "external", category: "NEWS", lastUpdated: "5h ago" },
  { id: "3", title: "Client Success Metrics Framework", snippet: "Standardized KPI framework for measuring client health: NPS, adoption rate, expansion revenue, time-to-value. Used across all CS team workbooks.", source: "Knowledge Base", relevance: 0.82, type: "internal", category: "PROCEDURE", lastUpdated: "1w ago" },
  { id: "4", title: "Industry Benchmark Report 2026", snippet: "SaaS industry benchmarks show median CAC payback of 18 months. Top quartile companies achieve 130% net revenue retention. Key growth lever: product-led expansion.", source: "McKinsey Research", relevance: 0.76, type: "external", category: "REPORT", lastUpdated: "3d ago" },
  { id: "5", title: "MEDDPICC Qualification Checklist", snippet: "Complete qualification framework: Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion, Competition. Required for all enterprise deals.", source: "Sales Playbooks", relevance: 0.91, type: "internal", category: "PLAYBOOK", lastUpdated: "4d ago" },
  { id: "6", title: "Data Privacy Regulations — APAC Update", snippet: "New data localization requirements in Singapore and Indonesia effective Q2 2026. Impact assessment required for all client data stored outside local jurisdiction.", source: "Reuters Legal", relevance: 0.72, type: "external", category: "REGULATION", lastUpdated: "1d ago" },
];

// Map external result categories to context_item categories
function mapToContextCategory(cat?: string): string {
  if (!cat) return "RESEARCH";
  const map: Record<string, string> = {
    KNOWLEDGE: "KNOWLEDGE",
    PROCEDURE: "PROCEDURE",
    PLAYBOOK: "PLAYBOOK",
    NEWS: "RESEARCH",
    REPORT: "RESEARCH",
    REGULATION: "DIRECTIVE",
  };
  return map[cat] || "RESEARCH";
}

interface ResearchLensProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResearchLens({ open, onOpenChange }: ResearchLensProps) {
  const { user, activeRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"all" | "internal" | "external">("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [recentQueries] = useState(["pricing strategy", "competitor analysis", "onboarding metrics"]);

  // Extraction state
  const [extracting, setExtracting] = useState<string | null>(null); // result id or "bulk"
  const [extractionData, setExtractionData] = useState<ExtractionResult | null>(null);
  const [extractionSourceName, setExtractionSourceName] = useState("");
  const [showImportCopilot, setShowImportCopilot] = useState(false);

  // Global keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      const q = query.toLowerCase();
      const filtered = MOCK_RESULTS.filter(r =>
        (scope === "all" || r.type === scope) &&
        (r.title.toLowerCase().includes(q) || r.snippet.toLowerCase().includes(q) || r.source.toLowerCase().includes(q))
      );
      setResults(filtered.length > 0 ? filtered : MOCK_RESULTS.filter(r => scope === "all" || r.type === scope));
      setSearching(false);
    }, 500);
  }, [query, scope]);

  // ── Save to My Knowledge (all roles) ──
  const handleSaveToKnowledge = async (result: SearchResult) => {
    if (!user) return;
    const category = mapToContextCategory(result.category);
    const { error } = await supabase.from("context_items").insert({
      owner_id: user.id,
      title: result.title,
      content_full: result.snippet,
      category,
      capture_status: "draft",
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["captures-inbox"] });
    queryClient.invalidateQueries({ queryKey: ["captures-inbox-count"] });
    toast({
      title: "Saved to My Knowledge",
      description: `"${result.title}" added as a draft capture. Review it in My Knowledge → Captures.`,
    });
  };

  // ── Pin to Workbook Context (operators) ──
  const handlePinToWorkbook = (result: SearchResult) => {
    toast({ title: "Pinned to Workbook Context", description: `"${result.title}" saved to your current workbook's local memory.` });
  };

  // ── Add to Global Bundle (architects) ──
  const handleAddToBundle = (result: SearchResult) => {
    toast({ title: "Added to Global Bundle", description: `"${result.title}" promoted to the organizational knowledge graph.` });
  };

  // ── Pin to Task Brief (managers) ──
  const handlePinToBrief = (result: SearchResult) => {
    toast({ title: "Pinned to Task Brief", description: `"${result.title}" attached to the active delegation brief.` });
  };

  // ── Deep Extract via Import Copilot ──
  const handleDeepExtract = async (items: SearchResult[], label: string) => {
    const extractId = items.length === 1 ? items[0].id : "bulk";
    setExtracting(extractId);
    try {
      const content = items.map(r =>
        `## ${r.title}\nSource: ${r.source} | Type: ${r.type} | Category: ${r.category || "N/A"}\n\n${r.snippet}`
      ).join("\n\n---\n\n");

      const { data, error } = await supabase.functions.invoke("extract-knowledge", {
        body: {
          source_type: "research",
          content,
          meta: { title: label, source: items.map(r => r.source).join(", ") },
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setExtractionData(data as ExtractionResult);
      setExtractionSourceName(label);
      setShowImportCopilot(true);
    } catch (err: any) {
      toast({ title: "Extraction failed", description: err.message, variant: "destructive" });
    } finally {
      setExtracting(null);
    }
  };

  const renderPinButton = (result: SearchResult) => {
    // All roles get a dropdown with "Save to My Knowledge" as the primary action
    // plus role-specific options
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 hover:text-primary">
            <Pin className="h-3 w-3" />
            Save
            <ChevronDown className="h-2.5 w-2.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Primary action — available to all roles */}
          <DropdownMenuItem onClick={() => handleSaveToKnowledge(result)}>
            <Lightbulb className="h-3.5 w-3.5 mr-2" />
            Save to My Knowledge
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleDeepExtract([result], result.title)}
            disabled={extracting === result.id}
          >
            {extracting === result.id ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <BookUp className="h-3.5 w-3.5 mr-2" />}
            Deep Extract via Copilot
          </DropdownMenuItem>

          {activeRole === "operator" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlePinToWorkbook(result)}>
                <BookOpen className="h-3.5 w-3.5 mr-2" />
                Pin to Workbook
              </DropdownMenuItem>
            </>
          )}

          {activeRole === "manager" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlePinToBrief(result)}>
                <Pin className="h-3.5 w-3.5 mr-2" />
                Pin to Task Brief
              </DropdownMenuItem>
            </>
          )}

          {activeRole === "architect" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAddToBundle(result)}>
                <Layers className="h-3.5 w-3.5 mr-2" />
                Add to Global Bundle
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const roleHint = "Save results to your knowledge or pin to workbooks & bundles";

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[440px] sm:w-[500px] flex flex-col gap-0 p-0">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              Research Lens
            </span>
            <Badge variant="secondary" className="text-[10px] font-normal">⌘K</Badge>
          </SheetTitle>
          <p className="text-[11px] text-muted-foreground mt-1">{roleHint}</p>
        </SheetHeader>

        <div className="p-4 space-y-3 border-b border-border/50">
          {/* Search input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search knowledge graph & external sources…"
                className="pl-9 bg-secondary/50"
                autoFocus={open}
              />
            </div>
            <Button size="icon" onClick={handleSearch} disabled={searching}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Scope toggles */}
          <div className="flex gap-2">
            {([
              { value: "all" as const, label: "All", icon: null },
              { value: "internal" as const, label: "Internal", icon: <Database className="h-3 w-3" /> },
              { value: "external" as const, label: "External", icon: <Globe className="h-3 w-3" /> },
            ]).map(s => (
              <Button
                key={s.value}
                variant={scope === s.value ? "default" : "outline"}
                size="sm"
                className="text-xs gap-1"
                onClick={() => setScope(s.value)}
              >
                {s.icon}{s.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {/* Empty / recent state */}
            {!searching && results.length === 0 && !query && (
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground text-center">Search across internal knowledge and external sources.</p>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recent Searches</p>
                  <div className="space-y-1">
                    {recentQueries.map(q => (
                      <button
                        key={q}
                        className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors text-left"
                        onClick={() => { setQuery(q); }}
                      >
                        <Clock className="h-3 w-3" />{q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {searching && (
              <div className="flex flex-col items-center gap-2 py-12">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">Searching…</span>
              </div>
            )}

            {!searching && results.length === 0 && query && (
              <div className="text-sm text-muted-foreground py-12 text-center">No results found. Try different keywords.</div>
            )}

            {!searching && results.length > 1 && (
              <div className="flex justify-end pb-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5"
                  onClick={() => handleDeepExtract(results, `Research: "${query}"`)}
                  disabled={extracting === "bulk"}
                >
                  {extracting === "bulk" ? <Loader2 className="h-3 w-3 animate-spin" /> : <BookUp className="h-3 w-3" />}
                  Extract All {results.length} Results via Copilot
                </Button>
              </div>
            )}

            {!searching && results.map(result => (
              <div key={result.id} className="rounded-lg border border-border/50 bg-card p-4 space-y-2.5 transition-all hover:border-primary/20">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium truncate">{result.title}</h4>
                      {result.category && (
                        <Badge variant="outline" className="text-[9px] shrink-0">{result.category}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.snippet}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={`text-[9px] gap-1 ${result.type === "internal" ? "text-primary" : "text-warning"}`}
                    >
                      {result.type === "internal" ? <Database className="h-2.5 w-2.5" /> : <Globe className="h-2.5 w-2.5" />}
                      {result.source}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1 w-12 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${result.relevance * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{Math.round(result.relevance * 100)}%</span>
                    </div>
                    {result.lastUpdated && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />{result.lastUpdated}
                      </span>
                    )}
                  </div>
                  {renderPinButton(result)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>

    <ImportCopilotDialog
      open={showImportCopilot}
      onOpenChange={setShowImportCopilot}
      data={extractionData}
      sourceName={extractionSourceName}
      sourceType="research"
    />
    </>
  );
}
