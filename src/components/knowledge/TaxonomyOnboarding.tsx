import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gavel, BookOpen, ListChecks, Map, SlidersHorizontal,
  FlaskConical, Compass, X, ChevronDown, ChevronUp, HelpCircle,
} from "lucide-react";
import {
  CATEGORY_LABELS, CATEGORY_DESCRIPTIONS, CATEGORY_RELATIONSHIPS,
  CATEGORY_COLORS, type ContextCategory,
} from "@/lib/knowledge-schema";
import { cn } from "@/lib/utils";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

const STORAGE_KEY = "aace-taxonomy-onboarding-dismissed";

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  DIRECTIVE: Gavel,
  KNOWLEDGE: BookOpen,
  PROCEDURE: ListChecks,
  PLAYBOOK: Map,
  PREFERENCE: SlidersHorizontal,
  RESEARCH: FlaskConical,
  PRINCIPLE: Compass,
};

const CATEGORY_ORDER: ContextCategory[] = [
  "PRINCIPLE", "DIRECTIVE", "KNOWLEDGE", "RESEARCH",
  "PROCEDURE", "PLAYBOOK", "PREFERENCE",
];

/** Compact flow showing how categories relate */
const FLOW_STEPS: { from: ContextCategory; to: ContextCategory; verb: string }[] = [
  { from: "PRINCIPLE", to: "DIRECTIVE", verb: "guides" },
  { from: "RESEARCH", to: "KNOWLEDGE", verb: "feeds" },
  { from: "KNOWLEDGE", to: "PROCEDURE", verb: "informs" },
  { from: "PROCEDURE", to: "PLAYBOOK", verb: "composes" },
  { from: "PREFERENCE", to: "PLAYBOOK", verb: "shapes" },
  { from: "DIRECTIVE", to: "PLAYBOOK", verb: "enforces" },
];

interface TaxonomyOnboardingProps {
  /** If true, always show (ignore dismiss state) — for help button */
  forceShow?: boolean;
  onClose?: () => void;
}

export function TaxonomyOnboarding({ forceShow, onClose }: TaxonomyOnboardingProps) {
  const [dismissed, setDismissed] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setDismissed(false);
      return;
    }
    const val = localStorage.getItem(STORAGE_KEY);
    setDismissed(val === "true");
  }, [forceShow]);

  const handleDismiss = () => {
    if (!forceShow) localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
    onClose?.();
  };

  if (dismissed) return null;

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
            <HelpCircle className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Understanding the Knowledge Taxonomy</p>
            <p className="text-[11px] text-muted-foreground">
              Your context is organized into 7 categories that work together.
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleDismiss}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Category pills row */}
      <TooltipProvider delayDuration={100}>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_ORDER.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const color = CATEGORY_COLORS[cat];
            return (
              <Tooltip key={cat}>
                <TooltipTrigger asChild>
                  <span className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium cursor-help transition-colors hover:opacity-80",
                    color
                  )}>
                    <Icon className="h-3 w-3" />
                    {CATEGORY_LABELS[cat]}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[260px] text-xs">
                  <p className="font-semibold mb-0.5">{CATEGORY_LABELS[cat]}</p>
                  <p className="text-muted-foreground">{CATEGORY_DESCRIPTIONS[cat]}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 border-t border-border/50 pt-1">
                    🔗 {CATEGORY_RELATIONSHIPS[cat]}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Relationship flow — compact */}
      <div className="flex flex-wrap items-center gap-1 text-[10px]">
        <span className="text-muted-foreground font-medium mr-1">Flow:</span>
        {FLOW_STEPS.map((step, i) => {
          const FromIcon = CATEGORY_ICONS[step.from];
          const ToIcon = CATEGORY_ICONS[step.to];
          return (
            <span key={i} className="inline-flex items-center gap-0.5 text-muted-foreground">
              {i > 0 && <span className="mx-0.5 text-border">·</span>}
              <FromIcon className="h-2.5 w-2.5" />
              <span className="font-medium text-foreground/70">{CATEGORY_LABELS[step.from]}</span>
              <span className="italic text-primary/60">{step.verb}</span>
              <ToIcon className="h-2.5 w-2.5" />
              <span className="font-medium text-foreground/70">{CATEGORY_LABELS[step.to]}</span>
            </span>
          );
        })}
      </div>

      {/* Expandable detail */}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 text-[10px] gap-1 text-muted-foreground hover:text-foreground px-2"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {expanded ? "Less detail" : "Show all relationships"}
      </Button>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {CATEGORY_ORDER.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const color = CATEGORY_COLORS[cat];
            return (
              <div key={cat} className="flex items-start gap-2 rounded-md px-2.5 py-1.5 bg-card/50 border border-border/30">
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-medium shrink-0 mt-0.5",
                  color
                )}>
                  <Icon className="h-2.5 w-2.5" />
                  {CATEGORY_LABELS[cat]}
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] text-foreground/80 leading-tight">{CATEGORY_DESCRIPTIONS[cat]}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">🔗 {CATEGORY_RELATIONSHIPS[cat]}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dismiss hint */}
      {!forceShow && (
        <p className="text-[9px] text-muted-foreground/60 text-right">
          This guide won't show again after you close it.
        </p>
      )}
    </div>
  );
}

/** Small help button that shows the taxonomy onboarding as a popover-like inline panel */
export function TaxonomyHelpButton({ onOpenDiagram }: { onOpenDiagram: () => void }) {
  const [showInline, setShowInline] = useState(false);

  return (
    <>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => setShowInline(!showInline)}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <p>Learn about the 7 knowledge categories</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {showInline && (
        <div className="absolute top-full right-0 mt-2 z-50 w-[600px] max-w-[calc(100vw-2rem)]">
          <TaxonomyOnboarding forceShow onClose={() => setShowInline(false)} />
        </div>
      )}
    </>
  );
}
