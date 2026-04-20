import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "liza_calc_session_id";

export function getOrCreateCalcSessionId(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  let id = sessionStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export interface CalcSnapshot {
  team_size: number;
  department: string;
  hourly_cost: number;
  rework_annual: number;
  total_gap: number;
  recoverable: number;
  // Optional richer breakdown for email content (not persisted)
  team_subtotal?: number;
  org_subtotal?: number;
  taxes?: {
    duplication: number;
    inconsistency: number;
    attrition: number;
    onboarding: number;
    handoff: number;
    shadowGovernance: number;
  };
  department_label?: string;
}

export async function upsertCalcSession(
  sessionId: string,
  snapshot: CalcSnapshot,
): Promise<void> {
  try {
    const { team_subtotal, org_subtotal, taxes, department_label, ...persistable } = snapshot;
    void team_subtotal; void org_subtotal; void taxes; void department_label;
    await supabase.from("calculator_sessions").upsert(
      {
        session_id: sessionId,
        ...persistable,
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      },
      { onConflict: "session_id" },
    );
  } catch (err) {
    console.error("calc tracking failed", err);
  }
}

export async function attachLeadToCalcSession(
  sessionId: string,
  lead: { email: string; name?: string; company?: string },
  snapshot?: CalcSnapshot,
): Promise<{ error: string | null }> {
  try {
    // CRITICAL: UPSERT (not UPDATE) so the lead is always captured on the
    // dashboard, even if the engagement gate (10s + interaction) hasn't
    // fired yet and no session row exists. Otherwise leads silently vanish.
    const { team_subtotal, org_subtotal, taxes, department_label, ...persistableSnap } =
      snapshot || ({} as CalcSnapshot);
    void team_subtotal; void org_subtotal; void taxes; void department_label;

    const row = {
      session_id: sessionId,
      email: lead.email,
      name: lead.name || null,
      company: lead.company || null,
      email_captured_at: new Date().toISOString(),
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      // Defaults so NOT NULL columns never fail on a fresh insert
      team_size: persistableSnap.team_size ?? 0,
      department: persistableSnap.department ?? "unknown",
      hourly_cost: persistableSnap.hourly_cost ?? 0,
      rework_annual: persistableSnap.rework_annual ?? 0,
      total_gap: persistableSnap.total_gap ?? 0,
      recoverable: persistableSnap.recoverable ?? 0,
    };

    const { error } = await supabase
      .from("calculator_sessions")
      .upsert(row, { onConflict: "session_id" });
    if (error) {
      console.error("calc lead upsert failed", error);
      return { error: error.message };
    }

    // Fire-and-forget email notifications (internal + user snapshot).
    // Wrapped in try/catch so a transient mail provider issue never blocks
    // the lead from being saved (it's already persisted above).
    try {
      const { error: invokeErr } = await supabase.functions.invoke(
        "notify-calculator-lead",
        {
          body: {
            email: lead.email,
            name: lead.name || null,
            company: lead.company || null,
            session_id: sessionId,
            ...(snapshot || {}),
          },
        },
      );
      if (invokeErr) console.error("notify-calculator-lead returned error", invokeErr);
    } catch (mailErr) {
      console.error("notify-calculator-lead invoke failed", mailErr);
    }

    return { error: null };
  } catch (err: any) {
    console.error("attachLeadToCalcSession threw", err);
    return { error: err?.message || "Unknown error" };
  }
}
