import { useState, useEffect, useCallback } from "react";
import { Search, Globe, Database, Pin, ChevronDown, Sparkles, Clock, BookOpen, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

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

interface ResearchLensProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResearchLens({ open, onOpenChange }: ResearchLensProps) {
  const { activeRole } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"all" | "internal" | "external">("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [recentQueries] = useState(["pricing strategy", "competitor analysis", "onboarding metrics"]);

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
      // If no match, show all for scope as fallback
      setResults(filtered.length > 0 ? filtered : MOCK_RESULTS.filter(r => scope === "all" || r.type === scope));
      setSearching(false);
    }, 500);
  }, [query, scope]);

  const handlePinOperator = (result: SearchResult) => {
    toast({ title: "Pinned to Workbook Context", description: `"${result.title}" saved to your current workbook's local memory.` });
  };

  const handlePinManager = (result: SearchResult) => {
    toast({ title: "Pinned to Task Brief", description: `"${result.title}" attached to the active delegation brief.` });
  };

  const handlePinExpertBundle = (result: SearchResult) => {
    toast({ title: "Added to Global Bundle", description: `"${result.title}" promoted to the organizational knowledge graph.` });
  };

  const handlePinExpertPlaybook = (result: SearchResult) => {
    toast({ title: "Added to Active Playbook", description: `"${result.title}" linked to the current playbook as a knowledge asset.` });
  };

  const renderPinButton = (result: SearchResult) => {
    if (activeRole === "operator") {
      return (
        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 hover:text-primary" onClick={() => handlePinOperator(result)}>
          <Pin className="h-3 w-3" />
          <BookOpen className="h-3 w-3" />
          Pin to Workbook
        </Button>
      );
    }

    if (activeRole === "manager") {
      return (
        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 hover:text-primary" onClick={() => handlePinManager(result)}>
          <Pin className="h-3 w-3" />
          Pin to Brief
        </Button>
      );
    }

    // Architect / Process Owner — dropdown with two options (REQ-U-03)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 hover:text-primary">
            <Pin className="h-3 w-3" />
            <Layers className="h-3 w-3" />
            Pin
            <ChevronDown className="h-2.5 w-2.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handlePinExpertBundle(result)}>
            <Layers className="h-3.5 w-3.5 mr-2" />
            Add to Global Bundle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePinExpertPlaybook(result)}>
            <BookOpen className="h-3.5 w-3.5 mr-2" />
            Add to Active Playbook
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const roleHint = activeRole === "operator"
    ? "Results will pin to your current Workbook"
    : activeRole === "manager"
    ? "Results will pin to your Task Brief"
    : "Results can be promoted to Bundles or Playbooks";

  return (
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
  );
}
