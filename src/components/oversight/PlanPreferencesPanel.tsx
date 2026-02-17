import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Loader2, Zap, Target, Scale, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

type Horizon = "next_hour" | "today" | "this_week";

interface PlanPreferences {
  focusMode: "deep_work" | "clear_blockers" | "catch_up";
  priorityWeight: "urgency" | "impact" | "balanced";
  maxItems: number;
}

const FOCUS_OPTIONS: { value: PlanPreferences["focusMode"]; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "deep_work", label: "Deep Work", icon: <Target className="h-3 w-3" />, desc: "Long focus blocks" },
  { value: "clear_blockers", label: "Clear Blockers", icon: <Zap className="h-3 w-3" />, desc: "Unblock progress" },
  { value: "catch_up", label: "Catch Up", icon: <ListOrdered className="h-3 w-3" />, desc: "Process backlog" },
];

const WEIGHT_OPTIONS: { value: PlanPreferences["priorityWeight"]; label: string }[] = [
  { value: "urgency", label: "Urgency first" },
  { value: "balanced", label: "Balanced" },
  { value: "impact", label: "Impact first" },
];

const MAX_ITEMS_RANGE: Record<Horizon, { min: number; max: number; default: number }> = {
  next_hour: { min: 1, max: 3, default: 2 },
  today: { min: 3, max: 7, default: 5 },
  this_week: { min: 5, max: 15, default: 8 },
};

const DEFAULTS: Record<Horizon, PlanPreferences> = {
  next_hour: { focusMode: "clear_blockers", priorityWeight: "urgency", maxItems: 2 },
  today: { focusMode: "deep_work", priorityWeight: "balanced", maxItems: 5 },
  this_week: { focusMode: "catch_up", priorityWeight: "impact", maxItems: 8 },
};

const PREF_KEY_PREFIX = "plan_priorities";

export function PlanPreferencesPanel({
  horizon,
  onGenerate,
  isGenerating,
}: {
  horizon: Horizon;
  onGenerate: (prefs: PlanPreferences) => void;
  isGenerating: boolean;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const prefKey = `${PREF_KEY_PREFIX}_${horizon}`;
  const defaults = DEFAULTS[horizon];
  const range = MAX_ITEMS_RANGE[horizon];

  const [prefs, setPrefs] = useState<PlanPreferences>(defaults);

  const { data: savedPref } = useQuery({
    queryKey: ["plan-prefs", user?.id, horizon],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("working_preferences")
        .select("preference_value")
        .eq("user_id", user!.id)
        .eq("preference_key", prefKey)
        .eq("scope_type", "personal")
        .maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (savedPref?.preference_value) {
      try {
        const parsed = JSON.parse(savedPref.preference_value);
        setPrefs({ ...defaults, ...parsed });
      } catch { /* use defaults */ }
    } else {
      setPrefs(defaults);
    }
  }, [savedPref, horizon]);

  const savePref = useMutation({
    mutationFn: async (newPrefs: PlanPreferences) => {
      if (!user) return;
      const value = JSON.stringify(newPrefs);
      const { data: existing } = await supabase
        .from("working_preferences")
        .select("id")
        .eq("user_id", user.id)
        .eq("preference_key", prefKey)
        .eq("scope_type", "personal")
        .maybeSingle();

      if (existing) {
        await supabase.from("working_preferences").update({ preference_value: value }).eq("id", existing.id);
      } else {
        await supabase.from("working_preferences").insert({
          user_id: user.id,
          preference_key: prefKey,
          preference_value: value,
          scope_type: "personal",
          description: `AI plan preferences for ${horizon}`,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan-prefs", user?.id, horizon] });
    },
  });

  const updatePref = <K extends keyof PlanPreferences>(key: K, val: PlanPreferences[K]) => {
    setPrefs(prev => ({ ...prev, [key]: val }));
  };

  const handleGenerate = () => {
    savePref.mutate(prefs);
    onGenerate(prefs);
  };

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
      {/* Focus Mode */}
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Focus Mode</p>
        <div className="flex gap-1.5">
          {FOCUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => updatePref("focusMode", opt.value)}
              className={`flex-1 flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs transition-colors border ${
                prefs.focusMode === opt.value
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border/50 bg-card hover:border-primary/30 text-muted-foreground"
              }`}
            >
              {opt.icon}
              <div className="text-left">
                <p className="leading-none">{opt.label}</p>
                <p className="text-[9px] opacity-70 mt-0.5">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Priority Weight + Max Items */}
      <div className="flex gap-4">
        <div className="flex-1 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
            <Scale className="h-3 w-3" /> Priority Weight
          </p>
          <div className="flex gap-1">
            {WEIGHT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => updatePref("priorityWeight", opt.value)}
                className={`flex-1 rounded-md px-2 py-1.5 text-[10px] transition-colors border text-center ${
                  prefs.priorityWeight === opt.value
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border/50 bg-card hover:border-primary/30 text-muted-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-32 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
            Max Items
            <Badge variant="secondary" className="text-[8px] ml-auto">{prefs.maxItems}</Badge>
          </p>
          <Slider
            value={[prefs.maxItems]}
            onValueChange={([v]) => updatePref("maxItems", v)}
            min={range.min}
            max={range.max}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-[8px] text-muted-foreground">
            <span>{range.min}</span>
            <span>{range.max}</span>
          </div>
        </div>
      </div>

      {/* Single Generate button */}
      <Button
        size="sm"
        className="w-full text-xs gap-1.5"
        disabled={isGenerating}
        onClick={handleGenerate}
      >
        {isGenerating ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Sparkles className="h-3 w-3" />
        )}
        Generate Suggestions
      </Button>
    </div>
  );
}

export type { PlanPreferences, Horizon };