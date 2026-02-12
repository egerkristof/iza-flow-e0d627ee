import { useState } from "react";
import { Search, X, Globe, Database, Pin, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  source: string;
  relevance: number;
  type: "internal" | "external";
}

const MOCK_RESULTS: SearchResult[] = [
  { id: "1", title: "Q1 Pricing Strategy Update", snippet: "Updated pricing tiers based on market analysis. New enterprise tier at $299/seat with volume discounts…", source: "Strategy Docs", relevance: 0.95, type: "internal" },
  { id: "2", title: "Competitor X Product Launch", snippet: "Competitor X announced new AI-powered features targeting mid-market segment. Key differentiators include…", source: "News Feed", relevance: 0.88, type: "external" },
  { id: "3", title: "Client Success Metrics Framework", snippet: "Standardized KPI framework for measuring client health: NPS, adoption rate, expansion revenue, time-to-value…", source: "Knowledge Base", relevance: 0.82, type: "internal" },
  { id: "4", title: "Industry Benchmark Report 2026", snippet: "SaaS industry benchmarks show median CAC payback of 18 months. Top quartile companies achieve…", source: "Research Papers", relevance: 0.76, type: "external" },
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

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    // Simulate search
    setTimeout(() => {
      const filtered = MOCK_RESULTS.filter(
        (r) => scope === "all" || r.type === scope
      );
      setResults(filtered);
      setSearching(false);
    }, 600);
  };

  const handlePin = (result: SearchResult) => {
    const target =
      activeRole === "operator"
        ? "Workbook Context"
        : activeRole === "manager"
        ? "Task Brief"
        : "Global Bundle";

    toast({
      title: `Pinned to ${target}`,
      description: `"${result.title}" saved to your ${target.toLowerCase()}.`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:w-[480px] flex flex-col gap-0 p-0">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4 text-primary" />
            Research Lens
          </SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-3">
          {/* Search input */}
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search knowledge graph & external sources…"
              className="flex-1 bg-secondary/50"
            />
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
            ]).map((s) => (
              <Button
                key={s.value}
                variant={scope === s.value ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => setScope(s.value)}
              >
                {s.icon}
                {s.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto px-4 pb-4 space-y-2">
          {searching && (
            <div className="text-sm text-muted-foreground animate-pulse py-8 text-center">
              Searching…
            </div>
          )}
          {!searching && results.length === 0 && query && (
            <div className="text-sm text-muted-foreground py-8 text-center">
              No results found. Try different keywords.
            </div>
          )}
          {!searching && results.length === 0 && !query && (
            <div className="text-sm text-muted-foreground py-8 text-center">
              Enter a query to search across internal knowledge and external sources.
            </div>
          )}
          {results.map((result) => (
            <div
              key={result.id}
              className="rounded-lg border border-border/50 bg-card p-4 space-y-2 transition-all hover:border-primary/20"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">{result.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.snippet}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] shrink-0 ${
                    result.type === "internal" ? "border-primary/30 text-primary" : "border-warning/30 text-warning"
                  }`}
                >
                  {result.type === "internal" ? <Database className="h-2.5 w-2.5 mr-1" /> : <Globe className="h-2.5 w-2.5 mr-1" />}
                  {result.source}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-16 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${result.relevance * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{Math.round(result.relevance * 100)}%</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => handlePin(result)}
                >
                  <Pin className="h-3 w-3" />
                  Pin ({activeRole === "operator" ? "Workbook" : activeRole === "manager" ? "Brief" : "Global"})
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
