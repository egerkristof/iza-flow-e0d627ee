import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, overall, archetype, dimensions } =
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

    // Sort dimensions by score ascending — weakest first
    const sorted = [...dimensions].sort((a, b) => a.score - b.score);
    const weakest = sorted[0];
    const secondWeakest = sorted[1];

    // Generate personalized action plan via AI
    const prompt = `You are an expert advisor on AI execution maturity for operational leaders at mid-market firms (50-1000 employees, sweet spot 50-250).

A firm just completed an AI Execution Diagnostic and scored ${overall}/100 overall. Their archetype is "${archetype.label}": ${archetype.tagline}

Their weakest dimension is "${weakest.label}" (${weakest.score}/100): ${weakest.insight}
Their second weakest is "${secondWeakest.label}" (${secondWeakest.score}/100): ${secondWeakest.insight}

For context: the average firm scores 38/100. Firms with defined AI standards score 72+.

Write a personalized 3-step action plan framed as "What firms who score 70+ do differently." This is aspirational, not remedial. Requirements:
1. Each step should be concrete and actionable within 1-2 weeks
2. For each step, include:
   - A clear action title (5-8 words, framed as what high-performers do)
   - What to do manually (2-3 sentences — the "start here" approach)
   - How a platform like LIZA OS makes this structural (1-2 sentences — frame as "With the right infrastructure...")
3. Steps should progress: visibility → codification → compounding
4. Use second person ("you", "your team")
5. Be specific to their archetype and weakest dimensions — not generic advice
6. Use their language: "playbook", "what good looks like", "our way of doing things" — not "governance", "knowledge management"

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
            platform_how: "With the right tooling, this audit is automated — the system surfaces gaps and suggests improvements based on your team's actual usage patterns.",
          },
          {
            title: "Create one shared reference point",
            manual_how: "Pick your highest-value workflow and write down the team's best approach. Share it in a doc everyone can access and reference before AI sessions.",
            platform_how: "With the right tooling, these references are embedded directly into every AI session — no manual lookup needed.",
          },
          {
            title: "Establish a weekly feedback loop",
            manual_how: "Block 15 minutes each week for the team to share what worked and what didn't with AI. Capture the best insights and update your shared reference.",
            platform_how: "With the right tooling, session reviews are structured and insights automatically feed back into the team's evolving standards.",
          },
        ],
      };
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
        (d) => `
        <tr>
          <td style="padding:8px 12px;font-size:14px;color:#1a1a2e;border-bottom:1px solid #f0f0f0;">${d.label}</td>
          <td style="padding:8px 12px;font-size:14px;font-weight:600;color:${d.score <= 33 ? "#dc2626" : d.score <= 66 ? "#f59e0b" : "#16a34a"};text-align:right;border-bottom:1px solid #f0f0f0;">${d.score}/100</td>
        </tr>`
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
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Your AI Execution Score</p>
      <p style="margin:0;font-size:56px;font-weight:900;color:${scoreColor};line-height:1;">${overall}</p>
      <p style="margin:8px 0 0;font-size:18px;font-weight:700;color:#1a1a2e;">${archetype.label}</p>
      <p style="margin:8px 0 0;font-size:14px;color:#64748b;line-height:1.5;max-width:480px;margin-left:auto;margin-right:auto;">${archetype.tagline}</p>
      <div style="margin:16px auto 0;display:inline-block;padding:8px 16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
        <span style="font-size:12px;color:#64748b;">Average firm: <strong>38</strong></span>
        <span style="margin:0 8px;color:#e2e8f0;">|</span>
        <span style="font-size:12px;color:${scoreColor};font-weight:700;">You: ${overall}</span>
        <span style="margin:0 8px;color:#e2e8f0;">|</span>
        <span style="font-size:12px;color:#64748b;">With defined standards: <strong>72+</strong></span>
      </div>
    </div>

    <!-- Dimension scores -->
    <div style="margin-bottom:32px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Your Scores</p>
      <table style="width:100%;border-collapse:collapse;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        ${dimensionRows}
      </table>
    </div>

    <!-- Action Plan -->
    <div style="margin-bottom:32px;">
      <p style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">What firms who score 70+ do differently</p>
      ${stepsHtml}
    </div>

    <!-- CTA -->
    <div style="text-align:center;padding:24px;background:#f0f9ff;border-radius:12px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#1a1a2e;">See what 70+ looks like for your firm</p>
      <p style="margin:0 0 16px;font-size:13px;color:#64748b;">We'll walk through your results and show you how firms like yours made their AI investment compound.</p>
      <a href="${CAL_URL}" style="display:inline-block;padding:12px 28px;background:#0284c7;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Book a 20-Minute Review →</a>
    </div>

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
        subject: `Your AI Execution Score: ${overall}/100 — here's what's leaking`,
        html,
      }),
    });

    if (!emailResp.ok) {
      const errBody = await emailResp.text();
      console.error("Resend error:", emailResp.status, errBody);
      throw new Error(`Resend error: ${emailResp.status}`);
    }

    // Also notify founders
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LIZA OS <invite@invite.lizaos.ai>",
        to: ["kristof.eger@lizaos.ai", "istvan.boscha@aliz.ai"],
        subject: `Diagnostic lead: ${email} — ${overall}/100 (${archetype.label})`,
        html: `<p><strong>${email}</strong> completed the diagnostic.</p><p>Score: ${overall}/100 · ${archetype.label}</p><p>Weakest: ${weakest.label} (${weakest.score}/100)</p>`,
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
