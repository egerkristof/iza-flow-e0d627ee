import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);

    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { document_markdown, bundle_id, bundle_title, existing_items, preview_only, apply_operations } = body;

    if (!document_markdown || !bundle_id) {
      return new Response(JSON.stringify({ error: "document_markdown and bundle_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── MODE 2: Apply confirmed operations ──
    if (apply_operations && Array.isArray(apply_operations)) {
      const results = { updated: 0, created: 0, deleted: 0, errors: [] as string[] };

      for (const op of apply_operations) {
        try {
          if (op.op === "update" && op.id) {
            const updateData: Record<string, unknown> = {};
            if (op.title) updateData.title = op.title;
            if (op.content_full) updateData.content_full = op.content_full;
            if (op.category) updateData.category = op.category;

            const { error } = await serviceClient
              .from("context_items")
              .update(updateData)
              .eq("id", op.id)
              .eq("owner_id", user.id);

            if (error) results.errors.push(`Update ${op.id}: ${error.message}`);
            else results.updated++;
          } else if (op.op === "create") {
            const { error } = await serviceClient
              .from("context_items")
              .insert({
                title: op.title,
                content_full: op.content_full || "",
                category: op.category || "KNOWLEDGE",
                owner_id: user.id,
                bundle_id: bundle_id,
              });

            if (error) results.errors.push(`Create "${op.title}": ${error.message}`);
            else results.created++;
          } else if (op.op === "delete" && op.id) {
            const { error } = await serviceClient
              .from("context_items")
              .update({ deleted_at: new Date().toISOString() })
              .eq("id", op.id)
              .eq("owner_id", user.id);

            if (error) results.errors.push(`Delete ${op.id}: ${error.message}`);
            else results.deleted++;
          }
        } catch (e) {
          results.errors.push(`Op ${op.op}: ${e instanceof Error ? e.message : "Unknown error"}`);
        }
      }

      // Log the sync
      try {
        await serviceClient.from("document_sync_logs").insert({
          bundle_id,
          user_id: user.id,
          document_snapshot: document_markdown,
          changeset: { operations: apply_operations },
          summary: `Synced ${results.updated} updated, ${results.created} created, ${results.deleted} removed`,
          items_created: results.created,
          items_updated: results.updated,
          items_deleted: results.deleted,
          errors: results.errors.length > 0 ? results.errors : [],
        });
      } catch (logErr) {
        console.error("Failed to log sync:", logErr);
      }

      return new Response(JSON.stringify({
        success: true,
        summary: "Sync completed",
        results,
        operations: apply_operations,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── MODE 1: AI-powered diff analysis (preview or direct apply) ──
    const existingDesc = (existing_items || []).map((item: any) =>
      `- ID: ${item.id} | Category: ${item.category} | Title: ${item.title} | Parent Playbook: ${item.parent_playbook_id || "none"} | Content: ${(item.content_preview || "").substring(0, 100)}`
    ).join("\n");

    const systemPrompt = `You are a Knowledge Architect that parses structured markdown documents back into discrete context items for a playbook management system.

## YOUR TASK
Given an edited markdown document and the list of existing items that were used to generate it, produce a JSON array of operations to synchronize the playbook items with the document content.

## EXISTING ITEMS IN THIS BUNDLE
${existingDesc || "No existing items"}

## RULES
1. Compare the document structure against the existing items
2. For each section, determine if it maps to an existing item (match by title similarity) or is new
3. Produce operations: "update" (changed content), "create" (new sections), "delete" (removed sections)
4. PLAYBOOKs are ## headings, PROCEDUREs are numbered steps under ### Steps, DIRECTIVEs are blockquotes with ⚠️, PRINCIPLEs are other blockquotes, KNOWLEDGE is #### sections
5. Keep item categories consistent with AACE taxonomy
6. For updates, include the "id" of the existing item plus any changed fields (title, content_full, category)
7. For updates, also include "prev_title" and "prev_content" fields showing the PREVIOUS values for diff display
8. For creates, include: category, title, content_full, parent_playbook_id (if under a playbook)
9. Only include operations for things that actually changed — do NOT include no-op updates

## OUTPUT FORMAT
Return ONLY a JSON object:
\`\`\`json
{
  "operations": [
    { "op": "update", "id": "existing-id", "title": "Updated Title", "content_full": "Updated content...", "prev_title": "Old Title", "prev_content": "Old content..." },
    { "op": "create", "category": "PROCEDURE", "title": "New Step", "content_full": "...", "parent_playbook_id": "pb-id-or-null" },
    { "op": "delete", "id": "removed-item-id", "title": "Removed Item Title" }
  ],
  "summary": "Brief description of changes made"
}
\`\`\``;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `## Document to Parse\n\n${document_markdown}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await response.json();
    const rawContent = aiResult.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : rawContent.trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: rawContent }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // If preview_only, return operations without applying
    if (preview_only) {
      return new Response(JSON.stringify({
        success: true,
        summary: parsed.summary || "Changes detected",
        operations: parsed.operations || [],
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Legacy direct-apply mode (fallback)
    const results = { updated: 0, created: 0, deleted: 0, errors: [] as string[] };
    for (const op of (parsed.operations || [])) {
      try {
        if (op.op === "update" && op.id) {
          const updateData: Record<string, unknown> = {};
          if (op.title) updateData.title = op.title;
          if (op.content_full) updateData.content_full = op.content_full;
          if (op.category) updateData.category = op.category;
          const { error } = await serviceClient.from("context_items").update(updateData).eq("id", op.id).eq("owner_id", user.id);
          if (error) results.errors.push(`Update ${op.id}: ${error.message}`);
          else results.updated++;
        } else if (op.op === "create") {
          const { error } = await serviceClient.from("context_items").insert({
            title: op.title, content_full: op.content_full || "", category: op.category || "KNOWLEDGE",
            owner_id: user.id, bundle_id: bundle_id,
          });
          if (error) results.errors.push(`Create "${op.title}": ${error.message}`);
          else results.created++;
        } else if (op.op === "delete" && op.id) {
          const { error } = await serviceClient.from("context_items").update({ deleted_at: new Date().toISOString() }).eq("id", op.id).eq("owner_id", user.id);
          if (error) results.errors.push(`Delete ${op.id}: ${error.message}`);
          else results.deleted++;
        }
      } catch (e) {
        results.errors.push(`Op ${op.op}: ${e instanceof Error ? e.message : "Unknown error"}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      summary: parsed.summary || "Sync completed",
      results,
      operations: parsed.operations || [],
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("sync-document-to-playbooks error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
