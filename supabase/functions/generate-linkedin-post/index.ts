import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type PostFormat = "data_drop" | "contrarian_take" | "playbook_snippet" | "struggling_moment";

interface RequestBody {
  format: PostFormat;
  custom_angle?: string;
}

const FORMAT_INSTRUCTIONS: Record<PostFormat, string> = {
  data_drop: `Write a "Data Drop" post. Use a surprising statistic from the data as the pattern interrupt.
- The stat must be specific, visceral, and stop the scroll
- Unpack what the number actually reveals about a hidden structural problem
- Name the pattern or mechanism if one emerges naturally
- Close with a forward-facing implication, not "agree?"`,

  contrarian_take: `Write a "Contrarian Take" post. Challenge a widely-held belief with evidence.
- Open with the conventional wisdom, then demolish it with data
- Move from surface narrative to underlying structural truth
- Name the gap between what people assume and what the data shows
- Show the real-world consequence of following conventional wisdom
- Close with a sharpened implication that opens thought`,

  playbook_snippet: `Write a "Playbook Snippet" post. Reveal what high-scoring teams do differently.
- Open with a pattern interrupt: a distinction between what most teams do vs. what mature teams do
- 3 specific practices drawn from data patterns, each with why it matters structurally
- Frame the gap as an infrastructure problem, not a knowledge problem
- Soft mention of LIZA OS as "what we're building to close this gap"
- Close by widening the stakes`,

  struggling_moment: `Write a "Struggling Moment" post. Paint a vivid scenario from the data.
- Open with a specific, sensory "Monday morning" scene your ICP lives through
- The scenario must be derived from low scores in a specific dimension
- Describe what they see, feel, hear. Make it visceral.
- The pivot: "This is what a score of X/100 on [dimension] looks like in practice"
- Show how common this is with data
- Close with implication, not preachiness`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { format, custom_angle } = (await req.json()) as RequestBody;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // ── Fetch all diagnostic results and compute segmented aggregates ──
    const FOUNDER_EMAILS = new Set(["kristof.eger@lizaos.ai", "istvan.boscha@aliz.ai"]);

    const { data: allResults, error: fetchErr } = await supabaseAdmin
      .from("diagnostic_results")
      .select("overall_score, scores, archetype, respondent_role, team_size, company_name, industry, email");

    if (fetchErr) throw new Error(`Failed to fetch results: ${fetchErr.message}`);

    const results = (allResults || []).filter(
      (r: any) => !r.email || !FOUNDER_EMAILS.has(r.email.toLowerCase())
    );

    if (results.length < 3) {
      return new Response(
        JSON.stringify({ error: "Need at least 3 submissions to generate meaningful content." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Overall aggregates
    const overallAvg = Math.round(results.reduce((s: number, r: any) => s + r.overall_score, 0) / results.length);

    const dimSums: Record<string, number[]> = {};
    for (const r of results) {
      for (const [key, val] of Object.entries((r.scores || {}) as Record<string, number>)) {
        if (!dimSums[key]) dimSums[key] = [];
        dimSums[key].push(val);
      }
    }
    const dimAvgs: Record<string, number> = {};
    let weakestDim = { key: "", score: 100 };
    let strongestDim = { key: "", score: 0 };
    for (const [key, vals] of Object.entries(dimSums)) {
      const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
      dimAvgs[key] = avg;
      if (avg < weakestDim.score) weakestDim = { key, score: avg };
      if (avg > strongestDim.score) strongestDim = { key, score: avg };
    }

    // Archetype distribution
    const archCounts: Record<string, number> = {};
    for (const r of results) archCounts[r.archetype] = (archCounts[r.archetype] || 0) + 1;

    // Team size segmentation
    const teamSizeSegments: Record<string, { count: number; avgScore: number; scores: number[] }> = {};
    for (const r of results) {
      const seg = r.team_size || "unknown";
      if (!teamSizeSegments[seg]) teamSizeSegments[seg] = { count: 0, avgScore: 0, scores: [] };
      teamSizeSegments[seg].count++;
      teamSizeSegments[seg].scores.push(r.overall_score);
    }
    for (const seg of Object.values(teamSizeSegments)) {
      seg.avgScore = Math.round(seg.scores.reduce((a, b) => a + b, 0) / seg.scores.length);
    }

    // Role segmentation
    const roleSegments: Record<string, { count: number; avgScore: number; scores: number[]; dimScores: Record<string, number[]> }> = {};
    for (const r of results) {
      const role = r.respondent_role?.toLowerCase()?.trim() || "unknown";
      if (!roleSegments[role]) roleSegments[role] = { count: 0, avgScore: 0, scores: [], dimScores: {} };
      roleSegments[role].count++;
      roleSegments[role].scores.push(r.overall_score);
      for (const [key, val] of Object.entries((r.scores || {}) as Record<string, number>)) {
        if (!roleSegments[role].dimScores[key]) roleSegments[role].dimScores[key] = [];
        roleSegments[role].dimScores[key].push(val);
      }
    }
    for (const seg of Object.values(roleSegments)) {
      seg.avgScore = Math.round(seg.scores.reduce((a, b) => a + b, 0) / seg.scores.length);
    }

    // Industry segmentation
    const industrySegments: Record<string, { count: number; avgScore: number; scores: number[] }> = {};
    for (const r of results) {
      const ind = r.industry || "unknown";
      if (!industrySegments[ind]) industrySegments[ind] = { count: 0, avgScore: 0, scores: [] };
      industrySegments[ind].count++;
      industrySegments[ind].scores.push(r.overall_score);
    }
    for (const seg of Object.values(industrySegments)) {
      seg.avgScore = Math.round(seg.scores.reduce((a, b) => a + b, 0) / seg.scores.length);
    }

    const DIM_LABELS: Record<string, string> = {
      standard_internalization: "Standards Adoption",
      output_consistency: "Delivery Consistency",
      knowledge_compounding: "Knowledge Sharing",
      collective_visibility: "Team Visibility",
      learning_velocity: "Improvement Speed",
    };

    // ── Build the prompt ──
    const dataContext = `
PROPRIETARY DIAGNOSTIC DATA (${results.length} respondents):

Overall average score: ${overallAvg}/100
Industry benchmark (ServiceNow 2025, 4,500 execs): 35/100
Teams with codified AI standards: 55+

Dimension averages:
${Object.entries(dimAvgs).map(([k, v]) => `- ${DIM_LABELS[k] || k}: ${v}/100`).join("\n")}
Weakest dimension: ${DIM_LABELS[weakestDim.key] || weakestDim.key} (${weakestDim.score}/100)
Strongest dimension: ${DIM_LABELS[strongestDim.key] || strongestDim.key} (${strongestDim.score}/100)

Archetype distribution:
${Object.entries(archCounts).map(([k, v]) => `- ${k}: ${v} (${Math.round(v / results.length * 100)}%)`).join("\n")}

Team size segments:
${Object.entries(teamSizeSegments).filter(([k]) => k !== "unknown").map(([k, v]) => `- ${k}: n=${v.count}, avg score=${v.avgScore}`).join("\n") || "No team size data yet"}

Role segments (top roles):
${Object.entries(roleSegments)
  .filter(([k]) => k !== "unknown")
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 8)
  .map(([k, v]) => `- ${k}: n=${v.count}, avg score=${v.avgScore}`)
  .join("\n") || "No role data yet"}

Industry segments:
${Object.entries(industrySegments)
  .filter(([k]) => k !== "unknown")
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 8)
  .map(([k, v]) => `- ${k}: n=${v.count}, avg score=${v.avgScore}`)
  .join("\n") || "No industry data yet"}
`;

    const formatInstructions = FORMAT_INSTRUCTIONS[format] || FORMAT_INSTRUCTIONS.data_drop;

    const prompt = `You are the LinkedIn ghostwriter for Kristof Eger, co-founder of LIZA OS. LIZA OS is building the management layer for AI-powered teams. The tagline is "Infrastructure for Complex Work."

Your audience: operational leaders (VPs, Directors, CTOs, Heads of) at mid-market companies (50-250 employees) who are struggling to make AI adoption actually work at a team level.

Voice: Direct, evidence-based, slightly provocative. Not corporate. Not "thought leader" cringe. Think: someone who's seen the data and isn't afraid to say what it means. Use short paragraphs. No em-dashes. No emoji spam (1-2 max, used strategically).

${dataContext}

${formatInstructions}

${custom_angle ? `ADDITIONAL ANGLE/FOCUS: ${custom_angle}` : ""}

IMPORTANT RULES:
1. LinkedIn character limit: keep under 3,000 characters total
2. The hook (first 2 lines) MUST be compelling enough to click "see more". This is the most important part.
3. Use specific numbers from the data. Vague claims kill engagement.
4. Do NOT mention "our diagnostic" or "take our quiz." The data should speak for itself.
5. Reference "our data" or "our research across X teams/leaders" to establish authority.
6. End with something that invites genuine discussion, not a hollow "agree?"
7. Do not use em-dashes anywhere. Use periods, commas, or colons instead.

Return the post as plain text, ready to copy-paste into LinkedIn. No markdown formatting. No code blocks.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);
      if (aiResp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${aiResp.status}`);
    }

    const aiData = await aiResp.json();
    const postContent = aiData.choices?.[0]?.message?.content || "";

    // Clean up any markdown artifacts
    const cleanPost = postContent
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\*\*/g, "")
      .replace(/^#+\s/gm, "")
      .trim();

    return new Response(
      JSON.stringify({
        post: cleanPost,
        format,
        data_snapshot: {
          n: results.length,
          overallAvg,
          weakestDim: DIM_LABELS[weakestDim.key] || weakestDim.key,
          weakestScore: weakestDim.score,
          teamSizeSegments: Object.fromEntries(
            Object.entries(teamSizeSegments)
              .filter(([k]) => k !== "unknown")
              .map(([k, v]) => [k, { count: v.count, avg: v.avgScore }])
          ),
          roleSegments: Object.fromEntries(
            Object.entries(roleSegments)
              .filter(([k]) => k !== "unknown")
              .sort((a, b) => b[1].count - a[1].count)
              .slice(0, 5)
              .map(([k, v]) => [k, { count: v.count, avg: v.avgScore }])
          ),
        },
        char_count: cleanPost.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("generate-linkedin-post error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Failed to generate post" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
