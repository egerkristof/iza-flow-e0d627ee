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
  overall: number;
  archetype: { label: string; tagline: string; action: string };
  dimensions: DimensionScore[];
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

const FRIENDLY_DESCRIPTIONS: Record<string, string> = {
  standard_internalization: "When someone opens an AI chat, does your team's methodology and quality bar actually reach that session, or do they start from a blank prompt every time?",
  output_consistency: "If two people use AI on the same brief, how similar are the results? Does AI amplify team standards or individual habits?",
  knowledge_compounding: "When someone discovers a better prompt or AI technique, does it stay in their chat history or does the whole team benefit?",
  collective_visibility: "Can your team see how each other uses AI? Can juniors learn from seniors' prompting? Can you report on AI effectiveness if asked?",
  learning_velocity: "When a new AI technique or tool update emerges, how quickly does your team evaluate, adopt, and update their shared approach?",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, overall, archetype, dimensions, diagnostic_result_id, results_base_url } =
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

    // Sort dimensions by score ascending, weakest first
    const sorted = [...dimensions].sort((a, b) => a.score - b.score);
    const weakest = sorted[0];
    const secondWeakest = sorted[1];

    // Generate personalized action plan via AI
    const prompt = `You are an expert advisor on AI execution maturity for operational leaders at mid-market firms (50-1000 employees, sweet spot 50-250).

A team just completed an AI Execution Diagnostic and scored ${overall}/100 overall. Their archetype is "${archetype.label}": ${archetype.tagline}

Their weakest dimension is "${weakest.label}" (${weakest.score}/100): ${weakest.insight}
Their second weakest is "${secondWeakest.label}" (${secondWeakest.score}/100): ${secondWeakest.insight}

For context: the industry average AI execution maturity score is 35/100, based on ServiceNow's 2025 Enterprise AI Maturity Index (4,500 executives surveyed). Fewer than 1% of organisations score above 50. Teams with defined, codified AI standards score 55+.

Write a personalized 3-step action plan framed as "What teams who score 55+ do differently." This is aspirational, not remedial. Requirements:
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
    let rawContent =
      aiData.choices?.[0]?.message?.content || "";

    // Strip markdown code fences if present
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

    // Store action plan in diagnostic_results if we have the ID
    if (diagnostic_result_id) {
      try {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );
        await supabaseAdmin
          .from("diagnostic_results")
          .update({ email_action_plan: actionPlan })
          .eq("id", diagnostic_result_id);
      } catch (e) {
        console.error("Failed to store action plan:", e);
      }
    }

    // Build the email HTML
    const scoreColor =
      overall <= 30
        ? "#dc2626"
        : overall <= 55
          ? "#f59e0b"
          : overall <= 75
            ? "#0284c7"
            : "#16a34a";

    const dimensionRows = dimensions
      .map(
        (d) => {
          const label = FRIENDLY_LABELS[d.dimension] || d.label;
          const desc = FRIENDLY_DESCRIPTIONS[d.dimension] || "";
          return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:14px;color:#1a1a2e;font-weight:600;">${label}</span>
            ${desc ? `<br/><span style="font-size:11px;color:#94a3b8;font-style:italic;">${desc}</span>` : ""}
          </td>
          <td style="padding:8px 12px;font-size:14px;font-weight:600;color:${d.score <= 33 ? "#dc2626" : d.score <= 66 ? "#f59e0b" : "#16a34a"};text-align:right;border-bottom:1px solid #f0f0f0;vertical-align:top;">${d.score}/100</td>
        </tr>`;
        }
      )
      .join("");

    const stepsHtml = actionPlan.steps
      .map(
        (s, i) => `
        <div style="margin-bottom:20px;padding:16px;background:#f8fafc;border-radius:8px;border-left:3px solid #0284c7;">
          <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#1a1a2e;">Step ${i + 1}: ${s.title}</p>
          <p style="margin:0 0 10px;font-size:13px;color:#475569;line-height:1.6;">
            <strong style="color:#1a1a2e;">Start here:</strong> ${s.manual_how}
          </p>
          <p style="margin:0;font-size:13px;color:#0284c7;line-height:1.6;">
            🏗️ ${s.platform_how}
          </p>
        </div>`
      )
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    
    <!-- Header with score -->
    <div style="text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Your AI Execution Score</p>
      <p style="margin:0;font-size:56px;font-weight:900;color:${scoreColor};line-height:1;">${overall}</p>
      <p style="margin:8px 0 0;font-size:18px;font-weight:700;color:#1a1a2e;">${archetype.label}</p>
      <p style="margin:8px 0 0;font-size:14px;color:#64748b;line-height:1.5;max-width:480px;margin-left:auto;margin-right:auto;">${archetype.tagline}</p>
    </div>

    <!-- Results framing: what teams are actually achieving (reframed as questions) -->
    <div style="margin-bottom:28px;padding:20px;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
      <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#166534;">How do teams scoring 55+ compare?</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#166534;">⏱️ How much time do seniors spend reviewing AI output?</td>
          <td style="padding:6px 0;font-size:13px;font-weight:700;color:#166534;text-align:right;">40–60% less</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#166534;">📋 If two people get the same brief, how similar are results?</td>
          <td style="padding:6px 0;font-size:13px;font-weight:700;color:#166534;text-align:right;">Within 10%</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#166534;">🚀 How long before new hires deliver at team standard?</td>
          <td style="padding:6px 0;font-size:13px;font-weight:700;color:#166534;text-align:right;">Half the time</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#166534;">🔄 How often does the team re-prompt for the same task?</td>
          <td style="padding:6px 0;font-size:13px;font-weight:700;color:#166534;text-align:right;">Near zero</td>
        </tr>
      </table>
      <p style="margin:12px 0 0;font-size:12px;color:#4ade80;">These are teams who codified their standards and made them available to every AI session.</p>
    </div>

    <!-- Benchmark context -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;padding:8px 16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
        <span style="font-size:12px;color:#64748b;">Industry average: <strong>35</strong></span>
        <span style="margin:0 8px;color:#e2e8f0;">|</span>
        <span style="font-size:12px;color:${scoreColor};font-weight:700;">You: ${overall}</span>
        <span style="margin:0 8px;color:#e2e8f0;">|</span>
        <span style="font-size:12px;color:#64748b;">Codified teams: <strong>55+</strong></span>
      </div>
      <p style="margin:8px 0 0;font-size:10px;color:#94a3b8;max-width:460px;margin-left:auto;margin-right:auto;">Benchmarked against ServiceNow's 2025 Enterprise AI Maturity Index (4,500 C-level execs, 16 countries). Fewer than 1% of organisations score above 50.</p>
      <p style="margin:6px 0 0;font-size:10px;color:#cbd5e1;max-width:460px;margin-left:auto;margin-right:auto;">Scoring: 10 scenario-based questions across 5 dimensions, each scored 1-4 on observable team behaviours. Dimension scores normalised to 0-100. Overall = unweighted mean of all dimensions.</p>
    </div>

    <!-- Dimension scores -->
    <div style="margin-bottom:28px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Your Breakdown</p>
      <table style="width:100%;border-collapse:collapse;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        ${dimensionRows}
      </table>
    </div>

    <!-- CTA — placed ABOVE action plan for visibility -->
    <div style="text-align:center;padding:24px;background:#f0f9ff;border-radius:12px;margin-bottom:28px;">
      <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#1a1a2e;">See what 55+ looks like for your team</p>
      <p style="margin:0 0 16px;font-size:13px;color:#64748b;">We'll walk through your results and show you how teams like yours made their AI investment compound.</p>
      <a href="${CAL_URL}" style="display:inline-block;padding:12px 28px;background:#0284c7;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Book a Discovery Call →</a>
      <p style="margin:12px 0 0;"><a href="https://lizaos.ai" style="font-size:13px;color:#0284c7;text-decoration:underline;">How LIZA OS works →</a></p>
    </div>

    <!-- Action Plan with context -->
    <div style="margin-bottom:28px;">
      <p style="margin:0 0 8px;font-size:18px;font-weight:800;color:#1a1a2e;">Your 3-Step Action Plan</p>
      <div style="margin-bottom:16px;">
        <span style="display:inline-block;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;background:${weakest.score <= 33 ? "#fef2f2" : "#fffbeb"};color:${weakest.score <= 33 ? "#dc2626" : "#d97706"};margin-right:6px;">${FRIENDLY_LABELS[weakest.dimension] || weakest.label}: ${weakest.score}/100</span>
        <span style="display:inline-block;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;background:${secondWeakest.score <= 33 ? "#fef2f2" : "#fffbeb"};color:${secondWeakest.score <= 33 ? "#dc2626" : "#d97706"};margin-right:6px;">${FRIENDLY_LABELS[secondWeakest.dimension] || secondWeakest.label}: ${secondWeakest.score}/100</span>
        <span style="font-size:12px;color:#94a3b8;">← driving this plan</span>
      </div>
      <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">These two areas are where your team is losing the most value from its AI investment. Here's what teams who closed these gaps did first.</p>
      ${stepsHtml}
    </div>

    <!-- Re-engagement: link back to results -->
    ${diagnostic_result_id ? `
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${results_base_url || 'https://iza-flow.lovable.app'}/diagnostic?result=${diagnostic_result_id}" style="font-size:13px;color:#0284c7;text-decoration:underline;">View your full results online →</a>
    </div>` : ""}

    <!-- Footer -->
    <div style="text-align:center;padding-top:16px;border-top:1px solid #e2e8f0;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">LIZA OS · The management layer for AI-powered teams</p>
      <p style="margin:4px 0 0;font-size:11px;color:#cbd5e1;">You received this because you completed the AI Execution Diagnostic and provided your email to receive results.</p>
      <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1;"><a href="https://iza-flow.lovable.app/privacy" style="color:#94a3b8;">Privacy Policy</a> · <a href="mailto:kristof.eger@lizaos.ai" style="color:#94a3b8;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;

    // Send via Resend
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

    // Also notify founders with full results
    const founderDimRows = sorted
      .map(
        (d) => {
          const label = FRIENDLY_LABELS[d.dimension] || d.label;
          return `<tr><td style="padding:6px 10px;font-size:13px;color:#1a1a2e;border-bottom:1px solid #eee;">${label}</td><td style="padding:6px 10px;font-size:13px;font-weight:700;text-align:right;color:${d.score <= 33 ? "#dc2626" : d.score <= 66 ? "#f59e0b" : "#16a34a"};border-bottom:1px solid #eee;">${d.score}/100</td><td style="padding:6px 10px;font-size:12px;color:#64748b;border-bottom:1px solid #eee;">${d.insight}</td></tr>`;
        }
      )
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

    const founderHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;">
        <h2 style="margin:0 0 4px;font-size:18px;color:#1a1a2e;">Diagnostic Lead: ${email}</h2>
        <p style="margin:0 0 16px;font-size:13px;color:#64748b;">Submitted ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC</p>

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

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LIZA OS <invite@invite.lizaos.ai>",
        to: ["kristof.eger@lizaos.ai", "istvan.boscha@aliz.ai"],
        subject: `Diagnostic lead: ${email} (${overall}/100, ${archetype.label})`,
        html: founderHtml,
      }),
    }).catch((e) => console.error("Founder notify failed:", e));

    return new Response(
      JSON.stringify({ success: true }),
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
