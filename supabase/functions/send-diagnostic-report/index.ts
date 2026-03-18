import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

interface DimensionScore {
  dimension: string;
  label: string;
  score: number;
  insight: string;
  implication: string;
}

interface RequestBody {
  email: string;
  respondent_role?: string | null;
  team_size?: string | null;
  team_leader_email?: string | null;
  overall: number;
  archetype: { label: string; tagline: string; action: string };
  dimensions: DimensionScore[];
  answers?: Record<string, number> | null;
  scores?: Record<string, number> | null;
  session_id?: string | null;
  diagnostic_result_id?: string;
  results_base_url?: string;
}

const FRIENDLY_LABELS: Record<string, string> = {
  standard_internalization: "Standards Adoption",
  output_consistency: "Delivery Consistency",
  knowledge_compounding: "Knowledge Sharing",
  collective_visibility: "Team Visibility",
  learning_velocity: "Improvement Speed",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, respondent_role, team_size, team_leader_email, overall, archetype, dimensions, answers, scores, session_id, diagnostic_result_id, results_base_url } =
      (await req.json()) as RequestBody;

    if (!email?.trim()) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // ── Step 1: Enrich company/industry from email domain ──
    const FREE_DOMAINS = new Set([
      "gmail.com","yahoo.com","hotmail.com","outlook.com","aol.com",
      "icloud.com","mail.com","protonmail.com","zoho.com","live.com",
      "ymail.com","gmx.com","fastmail.com","tutanota.com","pm.me",
      "hey.com","me.com","msn.com","googlemail.com",
    ]);

    const emailDomain = email.trim().split("@")[1]?.toLowerCase() || "";
    const isPersonalEmail = FREE_DOMAINS.has(emailDomain);

    let companyName: string | null = null;
    let industry: string | null = null;
    let industryRefined: string | null = null;

    if (!isPersonalEmail && emailDomain) {
      try {
        const enrichPrompt = `Given the email domain "${emailDomain}", identify the company name and classify it into TWO industry levels.

Return ONLY valid JSON: {"company_name": "...", "industry": "...", "industry_refined": "..."}

"industry" should be a broad label: "Technology", "Consulting", "Financial Services", "Healthcare", "Manufacturing", "Education", "Retail", "Energy", "Media", "Government", "Legal", "Real Estate", "Telecommunications", "Automotive", "Logistics", "Pharma", "Insurance", "Hospitality", "Non-profit", "Other".

"industry_refined" should be a MORE SPECIFIC sub-category that distinguishes between similar companies. Examples:
- Instead of just "Technology": use "Product / SaaS", "IT Services / Outsourcing", "Digital Agency", "AI / ML", "Developer Tools", "Enterprise Software", "Hardware / IoT"
- Instead of just "Consulting": use "Management Consulting", "IT Consulting", "Strategy Consulting", "HR Consulting"
- Instead of just "Financial Services": use "Banking", "Insurance", "FinTech", "Wealth Management"

Be specific. If a company builds and sells software products, they are "Product / SaaS", not just "Technology". If they do IT projects for clients, they are "IT Services / Outsourcing" or "IT Consulting".

If you cannot determine, use null for that field.`;

        const enrichResp = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-lite",
              messages: [{ role: "user", content: enrichPrompt }],
              temperature: 0.1,
            }),
          }
        );

        if (enrichResp.ok) {
          const enrichData = await enrichResp.json();
          let raw = enrichData.choices?.[0]?.message?.content || "";
          raw = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
          try {
            const parsed = JSON.parse(raw);
            companyName = parsed.company_name || null;
            industry = parsed.industry || null;
            industryRefined = parsed.industry_refined || null;
          } catch {
            console.error("Failed to parse enrichment:", raw);
          }
        }
      } catch (e) {
        console.error("Domain enrichment failed:", e);
      }
    }

    // ── Step 1a: Auto-derive role tier from respondent_role ──
    let roleTier: string | null = null;
    if (respondent_role) {
      const r = respondent_role.toLowerCase();
      if (/\b(ceo|cto|cro|cfo|coo|cio|cmo|chief|founder|co-founder|cofounder|owner|partner|managing director)\b/.test(r)) {
        roleTier = "C-Level";
      } else if (/\b(vp|vice president|director|head of|svp|evp)\b/.test(r)) {
        roleTier = "VP / Director";
      } else if (/\b(manager|team lead|lead|supervisor|principal)\b/.test(r)) {
        roleTier = "Manager / Lead";
      } else {
        roleTier = "Individual Contributor";
      }
    }

    // ── Step 1b: Persist lead data reliably (update existing, then fallback to session, then insert) ──
    const normalizedScores =
      scores && Object.keys(scores).length > 0
        ? scores
        : Object.fromEntries((dimensions || []).map((d) => [d.dimension, d.score]));

    const normalizedAnswers = answers && Object.keys(answers).length > 0 ? answers : {};

    const leadPayload: Record<string, unknown> = {
      email: email.trim(),
      respondent_role: respondent_role?.trim() || null,
      team_size: team_size || null,
      company_name: companyName,
      industry,
      industry_refined: industryRefined,
      role_tier: roleTier,
    };

    let resolvedDiagnosticRecordId: string | null = diagnostic_result_id || null;

    if (resolvedDiagnosticRecordId) {
      const { data: updatedRow, error: updateErr } = await supabaseAdmin
        .from("diagnostic_results")
        .update(leadPayload)
        .eq("id", resolvedDiagnosticRecordId)
        .select("id")
        .maybeSingle();

      if (updateErr) {
        console.error("Email attach by id failed:", updateErr);
      }

      if (!updatedRow?.id) {
        resolvedDiagnosticRecordId = null;
      }
    }

    if (!resolvedDiagnosticRecordId && session_id) {
      const { data: sessionRow, error: sessionLookupErr } = await supabaseAdmin
        .from("diagnostic_results")
        .select("id, email")
        .eq("session_id", session_id)
        .maybeSingle();

      if (sessionLookupErr) {
        console.error("Session lookup failed:", sessionLookupErr);
      }

      if (sessionRow?.id) {
        resolvedDiagnosticRecordId = sessionRow.id;
        if (!sessionRow.email) {
          const { error: sessionUpdateErr } = await supabaseAdmin
            .from("diagnostic_results")
            .update(leadPayload)
            .eq("id", sessionRow.id);

          if (sessionUpdateErr) {
            console.error("Email attach by session_id failed:", sessionUpdateErr);
          }
        }
      }
    }

    if (!resolvedDiagnosticRecordId) {
      const insertPayload = {
        session_id: session_id || null,
        answers: normalizedAnswers,
        scores: normalizedScores,
        archetype: archetype?.label || "Unknown",
        overall_score: overall,
        ...leadPayload,
      };

      const { data: insertedRow, error: insertErr } = await supabaseAdmin
        .from("diagnostic_results")
        .insert(insertPayload)
        .select("id")
        .single();

      if (insertErr) {
        console.error("Fallback insert failed:", insertErr);
        throw new Error("Could not persist diagnostic submission");
      }

      resolvedDiagnosticRecordId = insertedRow.id;
    }

    // ── Step 2: Generate AI action plan ──
    const sorted = [...dimensions].sort((a, b) => a.score - b.score);
    const weakest = sorted[0];
    const secondWeakest = sorted[1];

    // Determine tier-appropriate benchmark target
    const isAbove55 = overall >= 55;
    const targetBenchmark = isAbove55 ? 75 : 55;
    const targetLabel = isAbove55 ? "top 1% teams (75+)" : "codified teams (55+)";
    const aspirationFrame = isAbove55
      ? `This team already scores above 55, placing them in structured territory. The next frontier is 75+, the top 1%, where AI execution becomes a genuine competitive moat. Frame the plan as "What separates top 1% teams (75+) from structured teams." Focus on compounding advantages, institutional memory, and systematic excellence rather than basics.`
      : `Frame the plan as "What teams who score 55+ do differently." This is aspirational, not remedial.`;

    const prompt = `You are an expert advisor on AI execution maturity for operational leaders at mid-market firms (50-1000 employees, sweet spot 50-250).

A team just completed an AI Execution Diagnostic and scored ${overall}/100 overall. Their archetype is "${archetype.label}": ${archetype.tagline}

Their weakest dimension is "${weakest.label}" (${weakest.score}/100): ${weakest.insight}
Their second weakest is "${secondWeakest.label}" (${secondWeakest.score}/100): ${secondWeakest.insight}

For context: the industry average AI execution maturity score is 35/100, based on ServiceNow's 2025 Enterprise AI Maturity Index (4,500 executives surveyed). Fewer than 1% of organisations score above 50. Teams with defined, codified AI standards score 55+. Top 1% teams score 75+, where AI execution becomes a compounding competitive advantage.

${aspirationFrame} Requirements:
1. Each step should be concrete and actionable within 1-2 weeks
2. IMPORTANT: Step 1 must be something ONE person can do alone, today, in under 30 minutes. This lowers activation energy and creates immediate momentum.
3. For each step, include:
   - A clear action title (5-8 words, framed as what high-performers do)
   - What to do manually (2-3 sentences, the "start here" approach)
   - How LIZA OS makes this structural and automatic (1-2 sentences, always start with "With the right infrastructure, like LIZA OS..." to name the platform explicitly)
4. Steps should progress: individual action → codification → compounding
5. Use second person ("you", "your team")
6. Be specific to their archetype and weakest dimensions, not generic advice
7. Use their language: "playbook", "what good looks like", "our way of doing things". Not "governance", "knowledge management"
8. IMPORTANT: Do not use em-dashes anywhere. Use periods, commas, or colons instead.

Return ONLY valid JSON in this exact format:
{
  "steps": [
    {
      "title": "Step title here",
      "manual_how": "What they'd do manually...",
      "platform_how": "How infrastructure makes this structural..."
    }
  ]
}`;

    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      }
    );

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);
      throw new Error(`AI gateway error: ${aiResp.status}`);
    }

    const aiData = await aiResp.json();
    let rawContent = aiData.choices?.[0]?.message?.content || "";
    rawContent = rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let actionPlan: { steps: { title: string; manual_how: string; platform_how: string }[] };
    try {
      actionPlan = JSON.parse(rawContent);
    } catch {
      console.error("Failed to parse AI response:", rawContent);
      actionPlan = {
        steps: [
          {
            title: `Address your ${weakest.label} gap`,
            manual_how: `Start by auditing how your team currently handles ${weakest.label.toLowerCase()}. Identify one recurring task where the gap is most visible and document the current approach vs. the ideal.`,
            platform_how: "With the right infrastructure, like LIZA OS, this audit is automated. The system surfaces gaps and suggests improvements based on your team's actual usage patterns.",
          },
          {
            title: "Create one shared reference point",
            manual_how: "Pick your highest-value workflow and write down the team's best approach. Share it in a doc everyone can access and reference before AI sessions.",
            platform_how: "With the right infrastructure, like LIZA OS, these references are embedded directly into every AI session. No manual lookup needed.",
          },
          {
            title: "Establish a weekly feedback loop",
            manual_how: "Block 15 minutes each week for the team to share what worked and what didn't with AI. Capture the best insights and update your shared reference.",
            platform_how: "With the right infrastructure, like LIZA OS, session reviews are structured and insights automatically feed back into the team's evolving standards.",
          },
        ],
      };
    }

    // ── Step 3: Persist action plan back to the record ──
    if (resolvedDiagnosticRecordId) {
      await supabaseAdmin
        .from("diagnostic_results")
        .update({ email_action_plan: actionPlan })
        .eq("id", resolvedDiagnosticRecordId)
        .then(({ error }) => {
          if (error) console.error("Failed to store action plan:", error);
        });
    }

    // ── Step 4: Build and send user email ──
    const scoreColor =
      overall <= 30 ? "#dc2626"
        : overall <= 55 ? "#f59e0b"
        : overall <= 75 ? "#0284c7"
        : "#16a34a";

    const dimensionRows = dimensions
      .map(
        (d) => {
          const label = FRIENDLY_LABELS[d.dimension] || d.label;
          return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:14px;color:#1a1a2e;font-weight:600;">${label}</span>
          </td>
          <td style="padding:8px 12px;font-size:14px;font-weight:600;color:${d.score <= 33 ? "#dc2626" : d.score <= 66 ? "#f59e0b" : "#16a34a"};text-align:right;border-bottom:1px solid #f0f0f0;">${d.score}/100</td>
        </tr>`;
        }
      )
      .join("");

    const resultsUrl = resolvedDiagnosticRecordId
      ? `${results_base_url || 'https://iza-flow.lovable.app'}/diagnostic?result=${resolvedDiagnosticRecordId}`
      : null;

    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    
    <!-- Header with score -->
    <div style="text-align:center;margin-bottom:20px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Your AI Execution Score</p>
      <p style="margin:0;font-size:56px;font-weight:900;color:${scoreColor};line-height:1;">${overall}</p>
      <p style="margin:8px 0 0;font-size:18px;font-weight:700;color:#1a1a2e;">${archetype.label}</p>
      <p style="margin:8px 0 0;font-size:14px;color:#64748b;line-height:1.5;">${archetype.tagline}</p>
      ${resultsUrl ? `<p style="margin:12px 0 0;"><a href="${resultsUrl}" style="font-size:13px;color:#0284c7;font-weight:600;text-decoration:underline;">Bookmark your results: View your full breakdown →</a></p>` : ""}
    </div>

    <!-- Benchmark context -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;padding:8px 16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
        <span style="font-size:12px;color:#64748b;">Industry avg: <strong>35</strong></span>
        <span style="margin:0 8px;color:#e2e8f0;">|</span>
        <span style="font-size:12px;color:${scoreColor};font-weight:700;">You: ${overall}</span>
        <span style="margin:0 8px;color:#e2e8f0;">|</span>
        <span style="font-size:12px;color:#64748b;">${isAbove55 ? 'Top 1% teams: <strong>75+</strong>' : 'Codified teams: <strong>55+</strong>'}</span>
      </div>
    </div>

    <!-- Dimension scores -->
    <div style="margin-bottom:24px;">
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Your Breakdown</p>
      <table style="width:100%;border-collapse:collapse;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        ${dimensionRows}
      </table>
    </div>

    <!-- Action Plan -->
    <div style="margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:18px;font-weight:800;color:#1a1a2e;">Your 3-Step Action Plan</p>
      <div style="margin-bottom:12px;">
        <span style="display:inline-block;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;background:${weakest.score <= 33 ? "#fef2f2" : "#fffbeb"};color:${weakest.score <= 33 ? "#dc2626" : "#d97706"};margin-right:6px;">${FRIENDLY_LABELS[weakest.dimension] || weakest.label}: ${weakest.score}/100</span>
        <span style="display:inline-block;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;background:${secondWeakest.score <= 33 ? "#fef2f2" : "#fffbeb"};color:${secondWeakest.score <= 33 ? "#dc2626" : "#d97706"};margin-right:6px;">${FRIENDLY_LABELS[secondWeakest.dimension] || secondWeakest.label}: ${secondWeakest.score}/100</span>
        <span style="font-size:12px;color:#94a3b8;">← driving this plan</span>
      </div>
      ${actionPlan.steps
        .map(
          (s, i) => `
        <div style="margin-bottom:16px;padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid #0284c7;">
          <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#1a1a2e;">Step ${i + 1}: ${s.title}${i === 0 ? ' <span style="font-size:11px;font-weight:600;color:#0284c7;">(you can do this one alone, today)</span>' : ''}</p>
          <p style="margin:0 0 8px;font-size:13px;color:#475569;line-height:1.5;">
            <strong style="color:#1a1a2e;">Start here:</strong> ${s.manual_how}
          </p>
          <p style="margin:0;font-size:13px;color:#0284c7;line-height:1.5;">
            🏗️ ${s.platform_how}
          </p>
        </div>`
        )
        .join("")}
    </div>

    <!-- Lead/Lag metrics for weak dimensions -->
    <div style="margin-bottom:24px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#1a1a2e;">How you'll know it's working</p>
      <p style="margin:0 0 14px;font-size:12px;color:#64748b;">Track these signals as you implement. Lead indicators tell you the habits are forming. Lag indicators confirm results are following.</p>
      ${[weakest, secondWeakest].map(d => {
        const label = FRIENDLY_LABELS[d.dimension] || d.label;
        const metrics: Record<string, { lead: string; lag: string }> = {
          standard_internalization: {
            lead: "% of AI sessions where your team's reference doc is loaded before prompting",
            lag: "Reduction in senior review/correction time per deliverable",
          },
          output_consistency: {
            lead: "% of deliverables self-checked against a quality reference before submission",
            lag: "Variance in peer-review scores across team members (narrowing)",
          },
          knowledge_compounding: {
            lead: "# of learnings formally promoted to the shared reference per month",
            lag: "Time spent on problems a colleague already solved (trending down)",
          },
          collective_visibility: {
            lead: "# of show-and-tell or paired observation sessions held per month",
            lag: "Junior team members' confidence in AI-assisted tasks (quarterly survey)",
          },
          learning_velocity: {
            lead: "# of shared learnings validated on real work (not just discussed)",
            lag: "Average cycle time from learning surfaced to team-wide adoption",
          },
        };
        const m = metrics[d.dimension];
        if (!m) return "";
        return `
        <div style="margin-bottom:12px;${d === secondWeakest ? "" : "padding-bottom:12px;border-bottom:1px solid #e2e8f0;"}">
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1a1a2e;">${label} <span style="font-size:12px;font-weight:600;color:${d.score <= 33 ? "#dc2626" : "#f59e0b"};">(${d.score}/100)</span></p>
          <p style="margin:0 0 4px;font-size:12px;color:#475569;">
            <span style="color:#16a34a;font-weight:600;">▲ Lead:</span> ${m.lead}
          </p>
          <p style="margin:0;font-size:12px;color:#475569;">
            <span style="color:#0284c7;font-weight:600;">▼ Lag:</span> ${m.lag}
          </p>
        </div>`;
      }).join("")}
    </div>

    <!-- You vs ${targetBenchmark}+ contrast -->
    <div style="margin-bottom:24px;">
      <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1a1a2e;">Your team today vs. ${isAbove55 ? 'top 1% teams (75+)' : 'codified teams (55+)'}</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:12px;">
        <tr style="background:#f8fafc;">
          <td style="padding:6px 10px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;"></td>
          <td style="padding:6px 10px;font-weight:700;color:${scoreColor};text-align:center;border-bottom:1px solid #e2e8f0;">You (${overall})</td>
          <td style="padding:6px 10px;font-weight:700;color:#0284c7;text-align:center;border-bottom:1px solid #e2e8f0;">${targetBenchmark}+ teams</td>
        </tr>
        ${isAbove55 ? `
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">AI standards</td><td style="padding:6px 10px;text-align:center;color:#f59e0b;border-bottom:1px solid #f0f0f0;">Documented but unevenly applied</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Embedded in every session automatically</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">Knowledge capture</td><td style="padding:6px 10px;text-align:center;color:#f59e0b;border-bottom:1px solid #f0f0f0;">Happens when someone remembers</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Systematic, after every session</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">Team learning</td><td style="padding:6px 10px;text-align:center;color:#f59e0b;border-bottom:1px solid #f0f0f0;">Shared in meetings, adopted slowly</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Compounding: each project lifts the next</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">Quality assurance</td><td style="padding:6px 10px;text-align:center;color:#f59e0b;border-bottom:1px solid #f0f0f0;">Manual review catches gaps</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Built into the process, not bolted on</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;">Competitive moat</td><td style="padding:6px 10px;text-align:center;color:#f59e0b;">Improving steadily</td><td style="padding:6px 10px;text-align:center;color:#0284c7;">Widening gap every quarter</td></tr>
        ` : `
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">AI session prep</td><td style="padding:6px 10px;text-align:center;color:#dc2626;border-bottom:1px solid #f0f0f0;">Re-explain from scratch</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Standards loaded automatically</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">Output quality</td><td style="padding:6px 10px;text-align:center;color:#dc2626;border-bottom:1px solid #f0f0f0;">Depends who does it</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Consistent regardless</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">New technique found</td><td style="padding:6px 10px;text-align:center;color:#dc2626;border-bottom:1px solid #f0f0f0;">Stays with one person</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Reaches whole team in days</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;border-bottom:1px solid #f0f0f0;">Senior review</td><td style="padding:6px 10px;text-align:center;color:#dc2626;border-bottom:1px solid #f0f0f0;">Catching basic errors</td><td style="padding:6px 10px;text-align:center;color:#0284c7;border-bottom:1px solid #f0f0f0;">Focused on strategy</td></tr>
        <tr><td style="padding:6px 10px;color:#64748b;">AI ROI</td><td style="padding:6px 10px;text-align:center;color:#dc2626;">Can't measure it</td><td style="padding:6px 10px;text-align:center;color:#0284c7;">Tracked and reported</td></tr>
        `}
      </table>
    </div>

    <!-- CTA -->
    <div style="text-align:center;padding:20px;background:#f0f9ff;border-radius:10px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:14px;color:#475569;">20 min · We'll unpack your score and show you ${isAbove55 ? 'the path from structured (55+) to elite (75+)' : 'what teams scoring 55+ do differently'}.</p>
      <a href="${CAL_URL}" style="display:inline-block;padding:12px 28px;background:#0284c7;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Book your Diagnostic Debrief →</a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:16px;border-top:1px solid #e2e8f0;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">LIZA OS · The management layer for AI-powered teams</p>
      <p style="margin:4px 0 0;font-size:11px;color:#cbd5e1;">You received this because you completed the AI Execution Diagnostic.</p>
      <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1;"><a href="https://iza-flow.lovable.app/privacy" style="color:#94a3b8;">Privacy Policy</a> · <a href="mailto:kristof.eger@lizaos.ai" style="color:#94a3b8;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;

    // ── Step 5: Send user email ──
    const emailResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LIZA OS <invite@invite.lizaos.ai>",
        to: [email.trim()],
        subject: `Your AI Execution Score: ${overall}/100`,
        html,
      }),
    });

    if (!emailResp.ok) {
      const errBody = await emailResp.text();
      console.error("Resend error:", emailResp.status, errBody);
      throw new Error(`Resend error: ${emailResp.status}`);
    }

    // ── Step 6: Notify founders (fire-and-forget) ──
    const founderDimRows = sorted
      .map((d) => {
        const label = FRIENDLY_LABELS[d.dimension] || d.label;
        return `<tr><td style="padding:6px 10px;font-size:13px;color:#1a1a2e;border-bottom:1px solid #eee;">${label}</td><td style="padding:6px 10px;font-size:13px;font-weight:700;text-align:right;color:${d.score <= 33 ? "#dc2626" : d.score <= 66 ? "#f59e0b" : "#16a34a"};border-bottom:1px solid #eee;">${d.score}/100</td><td style="padding:6px 10px;font-size:12px;color:#64748b;border-bottom:1px solid #eee;">${d.insight}</td></tr>`;
      })
      .join("");

    const founderStepsHtml = actionPlan.steps
      .map(
        (s, i) =>
          `<div style="margin-bottom:12px;padding:12px;background:#f0f9ff;border-radius:6px;border-left:3px solid #0284c7;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1a1a2e;">Step ${i + 1}: ${s.title}</p>
            <p style="margin:0 0 6px;font-size:12px;color:#475569;"><strong>Manual:</strong> ${s.manual_how}</p>
            <p style="margin:0;font-size:12px;color:#0284c7;">🏗️ ${s.platform_how}</p>
          </div>`
      )
      .join("");

    const enrichmentLine = companyName || industry || respondent_role || team_size
      ? `<p style="margin:6px 0 16px;font-size:13px;color:#475569;">${[
          respondent_role ? `Role: <strong>${respondent_role}</strong>` : null,
          team_size ? `Team: <strong>${team_size}</strong>` : null,
          companyName ? `Company: <strong>${companyName}</strong>` : null,
          industry ? `Industry: <strong>${industry}</strong>` : null,
        ].filter(Boolean).join(" · ")}</p>`
      : "";

    const founderHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;">
        <h2 style="margin:0 0 4px;font-size:18px;color:#1a1a2e;">Diagnostic Lead: ${email}</h2>
        <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Submitted ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC</p>
        ${enrichmentLine}

        <div style="text-align:center;padding:16px;background:#f8fafc;border-radius:8px;margin-bottom:16px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Overall Score</p>
          <p style="margin:4px 0;font-size:48px;font-weight:900;color:${scoreColor};">${overall}</p>
          <p style="margin:0;font-size:15px;font-weight:700;color:#1a1a2e;">${archetype.label}</p>
          <p style="margin:6px 0 0;font-size:13px;color:#64748b;">${archetype.tagline}</p>
        </div>

        <h3 style="margin:20px 0 8px;font-size:14px;color:#1a1a2e;">Dimension Breakdown</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr style="background:#f1f5f9;"><th style="padding:6px 10px;text-align:left;font-size:12px;color:#64748b;">Dimension</th><th style="padding:6px 10px;text-align:right;font-size:12px;color:#64748b;">Score</th><th style="padding:6px 10px;text-align:left;font-size:12px;color:#64748b;">Insight</th></tr>
          ${founderDimRows}
        </table>

        <h3 style="margin:20px 0 8px;font-size:14px;color:#1a1a2e;">AI-Generated Action Plan (sent to lead)</h3>
        ${founderStepsHtml}

        <div style="margin-top:20px;padding:12px;background:#fef3c7;border-radius:6px;">
          <p style="margin:0;font-size:13px;color:#92400e;"><strong>Next step:</strong> Review in <a href="https://iza-flow.lovable.app/admin/manage" style="color:#0284c7;">Admin Panel → Diagnostics</a> for full Q&A detail.</p>
        </div>
      </div>`;

    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LIZA OS <invite@invite.lizaos.ai>",
        to: ["kristof.eger@lizaos.ai", "istvan.boscha@aliz.ai"],
        subject: `Diagnostic lead: ${email}${companyName ? ` @ ${companyName}` : ""} (${overall}/100, ${archetype.label})`,
        html: founderHtml,
      }),
    }).catch((e) => console.error("Founder notify failed:", e));

    return new Response(
      JSON.stringify({ success: true, diagnostic_result_id: resolvedDiagnosticRecordId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-diagnostic-report error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
