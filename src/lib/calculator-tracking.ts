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
    await supabase.from("calculator_sessions").upsert(
      {
        session_id: sessionId,
        ...snapshot,
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
    const { error } = await supabase
      .from("calculator_sessions")
      .update({
        email: lead.email,
        name: lead.name || null,
        company: lead.company || null,
        email_captured_at: new Date().toISOString(),
      })
      .eq("session_id", sessionId);
    if (error) return { error: error.message };

    // Fire-and-forget email notifications (internal + user snapshot)
    try {
      await supabase.functions.invoke("notify-calculator-lead", {
        body: {
          email: lead.email,
          name: lead.name || null,
          company: lead.company || null,
          ...(snapshot || {}),
        },
      });
    } catch (mailErr) {
      console.error("notify-calculator-lead invoke failed", mailErr);
    }

    return { error: null };
  } catch (err: any) {
    return { error: err?.message || "Unknown error" };
  }
}
