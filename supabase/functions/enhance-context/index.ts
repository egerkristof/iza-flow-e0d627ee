import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Hierarchy-aware Context Copilot edge function.
 *
 * Receives the user's message, the current scope (bundle/playbook/step),
 * and the full hierarchy context. Supports @ mentions that resolve to
 * specific context items. Streams the response back.
 *
 * Body shape:
 * {
 *   messages: ChatMessage[],
 *   scope: { level: "bundle" | "playbook" | "step", id: string, title: string },
 *   hierarchy: {
 *     bundle: { id, title, description },
 *     playbooks: [{ id, title, content, children: [{ id, title, content, category }] }],
 *     sharedItems: [{ id, title, content, category }],
 *     currentItem?: { id, title, content, category }  // when at step level
 *   },
 *   referencedItems?: [{ id, title, content, category }]  // resolved @ mentions
 * }
 */

const SYSTEM_PROMPT = `You are a **Context Enhancement Copilot** for the AACE knowledge management platform. You help users enhance, refine, and enrich context items at any level of the hierarchy.

## YOUR ROLE
You adopt the persona of a domain expert based on the bundle's content. Analyze the hierarchy provided and give specific, actionable enhancements.

## HIERARCHY MODEL
- **Bundle**: Top-level container grouping related knowledge
- **Playbook**: Protocol driver within a bundle (strategic intent — WHAT & WHY)
- **Step (PROCEDURE)**: Executable action owned by a playbook (atomic, ordered)
- **Gate (DIRECTIVE)**: Compliance rule owned by a playbook
- **Shared items**: KNOWLEDGE, RESEARCH, PRINCIPLE, PREFERENCE — injected into all protocols

## SCOPE AWARENESS
You know WHERE the user is working:
- **Bundle level**: You can suggest new playbooks, improve shared context, identify gaps
- **Playbook level**: You can refine the strategy, suggest steps, improve gates
- **Step level**: You can detail the action, add context references, suggest research needs

## @ MENTIONS
When the user references items with @, those items are provided in full. Use them to:
- Cross-reference information across the hierarchy
- Suggest how to incorporate referenced knowledge into the current scope
- Identify contradictions or reinforcements between items

## CONTEXT INJECTION GUIDANCE
A key part of your role is helping users define WHAT context each step needs during execution.
When enhancing steps, consider:
- Which bundle-level KNOWLEDGE items should be injected for this step?
- Which RESEARCH items provide relevant data?
- Should this step trigger a research action (competitor analysis, market research, etc.)?
- Are there PRINCIPLES that should guide the AI's behavior during this step?

## RESEARCH STEPS
Steps can have type "research" — these instruct the execution engine to perform research before proceeding.
When you detect that a step needs dynamic information (market data, competitor analysis, current trends), suggest converting it to a research step or adding a research step before it.

## OUTPUT STYLE
- Be concise and specific
- Reference actual items by title when relevant
- Use markdown formatting

## APPLYING SUGGESTIONS
When you suggest content changes to the current item, wrap the suggested replacement content in a fenced block like this:

\`\`\`apply-title
Suggested new title here
\`\`\`

\`\`\`apply-content
Suggested new content here. This will replace the item's full content.
\`\`\`

You can include one or both blocks. Only use these when you have a concrete suggestion for the current scope item.
When suggesting new items (not editing existing ones), specify category, title, and content in normal markdown instead.`;

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const { messages, scope, hierarchy, referencedItems } = body;

    if (!messages || !Array.isArray(messages)) throw new Error("messages array required");

    // Build the context block from hierarchy
    let contextBlock = "\n\n## CURRENT SCOPE\n";
    contextBlock += `Working at **${scope?.level || "bundle"}** level`;
    if (scope?.title) contextBlock += `: "${scope.title}"`;
    contextBlock += "\n";

    if (hierarchy) {
      if (hierarchy.bundle) {
        contextBlock += `\n### Bundle: "${hierarchy.bundle.title}"\n`;
        if (hierarchy.bundle.description) contextBlock += `Description: ${hierarchy.bundle.description}\n`;
      }

      if (hierarchy.playbooks?.length > 0) {
        contextBlock += "\n### Playbooks (Protocol Drivers)\n";
        for (const pb of hierarchy.playbooks) {
          contextBlock += `\n#### 🎯 "${pb.title}"\n`;
          if (pb.content) contextBlock += `Content: ${pb.content.slice(0, 500)}\n`;
          if (pb.children?.length > 0) {
            const procedures = pb.children.filter((c: any) => c.category === "PROCEDURE");
            const directives = pb.children.filter((c: any) => c.category === "DIRECTIVE");
            const others = pb.children.filter((c: any) => !["PROCEDURE", "DIRECTIVE"].includes(c.category));
            if (procedures.length > 0) {
              contextBlock += "Steps:\n";
              procedures.forEach((p: any, i: number) => {
                contextBlock += `  ${i + 1}. [${p.category}] "${p.title}" — ${(p.content || "").slice(0, 200)}\n`;
              });
            }
            if (directives.length > 0) {
              contextBlock += "Gates:\n";
              directives.forEach((d: any) => {
                contextBlock += `  - [DIRECTIVE] "${d.title}" — ${(d.content || "").slice(0, 200)}\n`;
              });
            }
            if (others.length > 0) {
              contextBlock += "Other owned:\n";
              others.forEach((o: any) => {
                contextBlock += `  - [${o.category}] "${o.title}" — ${(o.content || "").slice(0, 200)}\n`;
              });
            }
          }
        }
      }

      if (hierarchy.sharedItems?.length > 0) {
        contextBlock += "\n### Shared Context (injected into all protocols)\n";
        for (const si of hierarchy.sharedItems) {
          contextBlock += `- [${si.category}] "${si.title}" — ${(si.content || "").slice(0, 300)}\n`;
        }
      }

      if (hierarchy.currentItem) {
        contextBlock += `\n### Current Item (focus)\n`;
        contextBlock += `[${hierarchy.currentItem.category}] "${hierarchy.currentItem.title}"\n`;
        contextBlock += `Content: ${hierarchy.currentItem.content || "(empty)"}\n`;
      }
    }

    if (referencedItems?.length > 0) {
      contextBlock += "\n### @ Referenced Items\n";
      for (const ri of referencedItems) {
        contextBlock += `- [${ri.category}] "${ri.title}": ${(ri.content || "").slice(0, 500)}\n`;
      }
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextBlock },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI request failed");
    }

    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("enhance-context error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
