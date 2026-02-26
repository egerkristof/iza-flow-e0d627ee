import { useState } from "react";
import { ChevronDown, ChevronRight, ArrowRight, Package, FileText, BarChart3 } from "lucide-react";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  BUNDLE_READINESS_META,
  computeBundleReadiness,
  type ExtractedBundle,
  type ExtractedContextItem,
  type ExtractionResult,
  type ContextCategory,
} from "@/lib/knowledge-schema";

// ── Category Distribution Bar ────────────────────────────────────────────────

const CATEGORY_BAR_COLORS: Record<string, string> = {
  PLAYBOOK: "hsl(25 95% 53%)",
  PROCEDURE: "hsl(185 85% 45%)",
  DIRECTIVE: "hsl(38 92% 50%)",
  KNOWLEDGE: "hsl(217 91% 60%)",
  PRINCIPLE: "hsl(271 81% 56%)",
  RESEARCH: "hsl(155 72% 46%)",
  PREFERENCE: "hsl(330 81% 60%)",
};

function CategoryBar({ categories }: { categories: Record<string, number> }) {
  const total = Object.values(categories).reduce((s, n) => s + n, 0);
  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-3 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
        {Object.entries(categories)
          .filter(([, n]) => n > 0)
          .map(([cat, n]) => (
            <div
              key={cat}
              style={{
                width: `${(n / total) * 100}%`,
                background: CATEGORY_BAR_COLORS[cat] || "hsl(var(--muted-foreground))",
              }}
              title={`${CATEGORY_LABELS[cat as ContextCategory] || cat}: ${n}`}
            />
          ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {Object.entries(categories)
          .filter(([, n]) => n > 0)
          .map(([cat, n]) => (
            <span key={cat} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: CATEGORY_BAR_COLORS[cat] || "hsl(var(--muted-foreground))" }}
              />
              {CATEGORY_LABELS[cat as ContextCategory] || cat} ({n})
            </span>
          ))}
      </div>
    </div>
  );
}

// ── Item Row ─────────────────────────────────────────────────────────────────

function ItemRow({ item }: { item: ExtractedContextItem }) {
  const [open, setOpen] = useState(false);
  const colors = CATEGORY_COLORS[item.category] || "";

  return (
    <div className="border rounded-lg" style={{ borderColor: "hsl(var(--border))" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors"
      >
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        )}
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${colors}`}>
          {CATEGORY_LABELS[item.category]}
        </span>
        <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
        {item.step_order_hint && (
          <span className="ml-auto text-[10px] font-mono text-muted-foreground shrink-0">
            Step {item.step_order_hint}
          </span>
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1">
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {item.content}
          </p>
          {item.output_type && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Output:
              </span>
              <span className="text-xs text-foreground">{item.output_description || item.output_type}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Bundle Card ──────────────────────────────────────────────────────────────

function BundleCard({ bundle }: { bundle: ExtractedBundle }) {
  const [expanded, setExpanded] = useState(false);
  const readiness = computeBundleReadiness(bundle.items, bundle.content_completeness);
  const meta = BUNDLE_READINESS_META[readiness];

  const categoryCounts: Record<string, number> = {};
  for (const item of bundle.items) {
    categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1;
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-accent/30 transition-colors"
      >
        <Package className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{bundle.title}</h3>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${meta.color}`}>
              {meta.icon} {meta.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{bundle.description}</p>
        </div>
        <span className="text-xs font-mono text-muted-foreground shrink-0">
          {bundle.items.length} items
        </span>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="pt-4 pb-3">
            <CategoryBar categories={categoryCounts} />
          </div>
          <div className="flex flex-col gap-2">
            {bundle.items.map((item, i) => (
              <ItemRow key={i} item={item} />
            ))}
          </div>
          {bundle.coverage_gaps && bundle.coverage_gaps.length > 0 && (
            <div className="mt-4 p-3 rounded-lg" style={{ background: "hsl(var(--muted))" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Coverage Gaps
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {bundle.coverage_gaps.map((gap, i) => (
                  <li key={i}>• {gap}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Results View ────────────────────────────────────────────────────────

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

interface ExtractionResultsViewProps {
  result: ExtractionResult;
  onReset: () => void;
}

export function ExtractionResultsView({ result, onReset }: ExtractionResultsViewProps) {
  const bundles = result.bundles ?? [];
  const standaloneItems = result.context_items ?? [];

  const totalItems =
    standaloneItems.length +
    bundles.reduce((sum, b) => sum + b.items.length, 0);

  // Aggregate category counts
  const allCategories: Record<string, number> = {};
  for (const item of standaloneItems) {
    allCategories[item.category] = (allCategories[item.category] ?? 0) + 1;
  }
  for (const bundle of bundles) {
    for (const item of bundle.items) {
      allCategories[item.category] = (allCategories[item.category] ?? 0) + 1;
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Bundles", value: bundles.length, icon: Package },
          { label: "Items Extracted", value: totalItems, icon: FileText },
          { label: "Categories", value: Object.keys(allCategories).length, icon: BarChart3 },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border p-5 text-center"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
          >
            <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Category Distribution */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-foreground mb-3">Category Distribution</h3>
        <CategoryBar categories={allCategories} />
      </div>

      {/* Analysis Notes */}
      {result.analysis_notes && (
        <div
          className="rounded-xl border p-5 mb-8"
          style={{
            borderColor: "hsl(var(--primary) / 0.2)",
            background: "hsl(var(--primary) / 0.05)",
          }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-2">AI Analysis</h3>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {result.analysis_notes}
          </p>
        </div>
      )}

      {/* Bundle Cards */}
      <div className="flex flex-col gap-3 mb-12">
        <h3 className="text-sm font-semibold text-foreground">
          Extracted Bundles ({bundles.length})
        </h3>
        {bundles.map((bundle, i) => (
          <BundleCard key={i} bundle={bundle} />
        ))}
      </div>

      {/* CTA */}
      <div
        className="rounded-2xl border p-8 text-center"
        style={{
          borderColor: "hsl(var(--primary) / 0.3)",
          background: "hsl(var(--primary) / 0.05)",
        }}
      >
        <h3 className="text-xl font-bold text-foreground mb-2">
          Want to deploy these protocols?
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
          LIZA OS turns these extracted bundles into executable protocols your team runs on —
          with AI-assisted execution, compliance gates, and continuous learning loops.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 20px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Book a Discovery Call <ArrowRight className="w-4 h-4" />
          </a>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border text-muted-foreground hover:text-foreground transition-colors"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
