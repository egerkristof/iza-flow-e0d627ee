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
    const {
      document_markdown,
      original_document,
      bundle_id,
      bundle_title,
      existing_items,
      preview_only,
      apply_operations,
    } = body;

    if (!document_markdown || !bundle_id) {
      return new Response(JSON.stringify({ error: "document_markdown and bundle_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── MODE 2: Apply confirmed operations ──
    if (apply_operations && Array.isArray(apply_operations)) {
      return await applyOperations(serviceClient, user.id, bundle_id, document_markdown, apply_operations, corsHeaders);
    }

    // ── MODE 1: AI-powered diff analysis ──

    // Build a precise existing-items map with FULL content
    const existingDesc = (existing_items || []).map((item: any) =>
      `<item id="${item.id}" category="${item.category}" title="${item.title}" parent_playbook="${item.parent_playbook_id || "none"}">\n${item.content_full || ""}\n</item>`
    ).join("\n\n");

    // Compute a line-level diff between the baseline and edited document
    // to give the AI precise context about what actually changed
    let diffHint = "";
    if (original_document) {
      // Normalize both documents for comparison
      const origTrimmed = original_document.trim();
      const newTrimmed = document_markdown.trim();
      
      if (origTrimmed === newTrimmed) {
        return new Response(JSON.stringify({
          success: true,
          summary: "No changes detected",
          operations: [],
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Use a smarter diff: find actual changed lines
      const origLines = origTrimmed.split("\n");
      const newLines = newTrimmed.split("\n");
      const changes: string[] = [];
      const maxLen = Math.max(origLines.length, newLines.length);
      
      for (let i = 0; i < maxLen; i++) {
        const origLine = origLines[i] ?? "";
        const newLine = newLines[i] ?? "";
        if (origLine !== newLine) {
          changes.push(`Line ${i + 1}:\n  OLD: ${origLine}\n  NEW: ${newLine}`);
        }
      }
      
      if (changes.length > 0) {
        diffHint = `\n## ACTUAL LINE-LEVEL CHANGES (only these lines differ from the baseline)\nThere are exactly ${changes.length} changed lines:\n\n${changes.slice(0, 100).join("\n\n")}\n\nIMPORTANT: ONLY generate operations for items affected by these specific line changes. If a heading changed from "Customer Contract Flow" to "Customer Contract Flow 2", that is ONE update to ONE item's title. Do NOT touch any other items.`;
      }
    }

    const systemPrompt = `You are a PRECISION DIFF ENGINE. Your job is to detect ONLY the exact changes between an edited markdown document and the existing structured items.

## CRITICAL RULES — READ CAREFULLY

1. You MUST compare the document content against each existing item's FULL content (provided below in <item> tags)
2. ONLY produce operations for items where the title OR content has ACTUALLY changed character-by-character
3. If a section's content is identical or semantically identical to the existing item, DO NOT include it
4. Minor whitespace or formatting differences are NOT changes — ignore them
5. If only a title changed (e.g., "Flow" → "Flow 2"), produce an update with ONLY the new title
6. Do NOT rewrite or rephrase content — only report actual textual differences
7. When in doubt, DO NOT include the operation
8. An update operation should include ONLY the fields that changed (title and/or content_full)
9. For updates, also include "prev_title" and "prev_content" showing the PREVIOUS values

## EXISTING ITEMS IN THIS BUNDLE
${existingDesc || "No existing items"}
${diffHint}

## CATEGORY MAPPING
- PLAYBOOKs = ## headings
- PROCEDUREs = numbered steps under ### Steps  
- DIRECTIVEs = blockquotes with ⚠️
- PRINCIPLEs = other blockquotes
- KNOWLEDGE = #### sections

## OUTPUT FORMAT
Return ONLY valid JSON:
{
  "operations": [
    { "op": "update", "id": "existing-id", "title": "New Title", "prev_title": "Old Title" },
    { "op": "update", "id": "existing-id", "content_full": "New content...", "prev_content": "Old content..." },
    { "op": "create", "category": "PROCEDURE", "title": "New Step", "content_full": "..." },
    { "op": "delete", "id": "removed-item-id", "title": "Removed Item Title" }
  ],
  "summary": "Changed title of 'Customer Contract Flow' to 'Customer Contract Flow 2'"
}

If nothing changed, return: { "operations": [], "summary": "No changes detected" }`;

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
          { role: "user", content: `## Edited Document\n\n${document_markdown}` },
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

    // ── CRITICAL: Filter out no-op operations where nothing actually changed ──
    const existingMap = new Map((existing_items || []).map((item: any) => [item.id, item]));
    const validatedOps = (parsed.operations || []).filter((op: any) => {
      if (op.op === "create" || op.op === "delete") return true;
      if (op.op === "update" && op.id) {
        const existing = existingMap.get(op.id);
        if (!existing) return true; // can't validate, keep it
        
        // Check if title actually changed
        const titleChanged = op.title && op.title.trim() !== existing.title?.trim();
        // Check if content actually changed
        const contentChanged = op.content_full && op.content_full.trim() !== (existing.content_full || "").trim();
        // Check if category changed
        const categoryChanged = op.category && op.category !== existing.category;
        
        return titleChanged || contentChanged || categoryChanged;
      }
      return false;
    });

    const filteredSummary = validatedOps.length === 0
      ? "No changes detected"
      : parsed.summary || `${validatedOps.length} change(s) detected`;

    // If preview_only, return operations without applying
    if (preview_only) {
      return new Response(JSON.stringify({
        success: true,
        summary: filteredSummary,
        operations: validatedOps,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Legacy direct-apply mode (fallback)
    return await applyOperations(serviceClient, user.id, bundle_id, document_markdown, validatedOps, corsHeaders);
  } catch (err) {
    console.error("sync-document-to-playbooks error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ── Shared apply logic ──
async function applyOperations(
  serviceClient: any,
  userId: string,
  bundleId: string,
  documentMarkdown: string,
  operations: any[],
  headers: Record<string, string>,
) {
  const results = { updated: 0, created: 0, deleted: 0, errors: [] as string[] };

  for (const op of operations) {
    try {
      if (op.op === "update" && op.id) {
        const updateData: Record<string, unknown> = {};
        if (op.title) updateData.title = op.title;
        if (op.content_full) updateData.content_full = op.content_full;
        if (op.category) updateData.category = op.category;

        if (Object.keys(updateData).length === 0) continue;

        const { error } = await serviceClient
          .from("context_items")
          .update(updateData)
          .eq("id", op.id)
          .eq("owner_id", userId);

        if (error) results.errors.push(`Update ${op.id}: ${error.message}`);
        else results.updated++;
      } else if (op.op === "create") {
        const { error } = await serviceClient
          .from("context_items")
          .insert({
            title: op.title,
            content_full: op.content_full || "",
            category: op.category || "KNOWLEDGE",
            owner_id: userId,
            bundle_id: bundleId,
          });

        if (error) results.errors.push(`Create "${op.title}": ${error.message}`);
        else results.created++;
      } else if (op.op === "delete" && op.id) {
        const { error } = await serviceClient
          .from("context_items")
          .update({ deleted_at: new Date().toISOString() })
          .eq("id", op.id)
          .eq("owner_id", userId);

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
      bundle_id: bundleId,
      user_id: userId,
      document_snapshot: documentMarkdown,
      changeset: { operations },
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
    operations,
  }), {
    headers: { ...headers, "Content-Type": "application/json" },
  });
}
