import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Validate user
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { workbook_id, bundle_id } = await req.json();
    if (!workbook_id || !bundle_id) {
      return new Response(JSON.stringify({ error: "workbook_id and bundle_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get all context items in this bundle via the junction table (with parent_playbook_id)
    const { data: bundleLinks, error: linkError } = await supabase
      .from("context_item_bundles")
      .select("context_item_id, parent_playbook_id")
      .eq("bundle_id", bundle_id);

    // Also get items with legacy bundle_id
    const { data: legacyItems, error: legacyError } = await supabase
      .from("context_items")
      .select("*")
      .eq("bundle_id", bundle_id);

    if (linkError || legacyError) {
      throw new Error("Failed to fetch bundle items");
    }

    // Build a map of item_id -> parent_playbook_id from junction table
    const parentMap: Record<string, string | null> = {};
    for (const link of (bundleLinks || [])) {
      parentMap[link.context_item_id] = link.parent_playbook_id || null;
    }
    // Legacy items have no parent info
    for (const item of (legacyItems || [])) {
      if (!(item.id in parentMap)) {
        parentMap[item.id] = null;
      }
    }

    const allIds = Object.keys(parentMap);
    if (allIds.length === 0) {
      return new Response(JSON.stringify({ protocols_created: 0, message: "No items in bundle" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch full items
    const { data: items, error: itemError } = await supabase
      .from("context_items")
      .select("*")
      .in("id", allIds)
      .is("deleted_at", null);

    if (itemError) throw itemError;

    // Categorize items
    const playbooks = items.filter((i: any) => i.category === "PLAYBOOK");
    const allProcedures = items.filter((i: any) => i.category === "PROCEDURE");
    const allDirectives = items.filter((i: any) => i.category === "DIRECTIVE");
    const allResearch = items.filter((i: any) => i.category === "RESEARCH");
    const sharedContextItems = items.filter((i: any) =>
      ["KNOWLEDGE", "PRINCIPLE", "PREFERENCE"].includes(i.category) &&
      !parentMap[i.id] // only truly shared items (no parent playbook)
    );
    // RESEARCH items without a parent playbook are also shared context
    const sharedResearch = allResearch.filter((i: any) => !parentMap[i.id]);

    // If no playbooks, create a single protocol from the bundle itself
    const { data: bundle } = await supabase
      .from("bundles")
      .select("title, description")
      .eq("id", bundle_id)
      .single();

    const protocolSources = playbooks.length > 0
      ? playbooks
      : [{ id: items[0]?.id, title: bundle?.title ?? "Protocol", content_full: bundle?.description ?? "" }];

    let protocolsCreated = 0;

    for (let pi = 0; pi < protocolSources.length; pi++) {
      const pb = protocolSources[pi];

      // Get items OWNED by this playbook + items with no parent (shared procedures/directives for legacy data)
      const ownedProcedures = allProcedures.filter((proc: any) => {
        const parent = parentMap[proc.id];
        return parent === pb.id || parent === null; // owned by this playbook OR shared (legacy)
      });
      const ownedDirectives = allDirectives.filter((dir: any) => {
        const parent = parentMap[dir.id];
        return parent === pb.id || parent === null;
      });
      const ownedResearch = allResearch.filter((r: any) => {
        const parent = parentMap[r.id];
        return parent === pb.id; // only explicitly owned research becomes a step
      });

      // Upsert protocol
      const { data: protocol, error: protoError } = await supabase
        .from("workbook_protocols")
        .upsert(
          {
            workbook_id,
            bundle_id,
            source_playbook_id: pb.id,
            title: pb.title,
            description: pb.content_full?.substring(0, 500) ?? null,
            sort_order: pi,
          },
          { onConflict: "workbook_id,source_playbook_id" }
        )
        .select("id")
        .single();

      if (protoError) {
        console.error("Protocol upsert error:", protoError);
        continue;
      }

      // Delete existing steps to regenerate
      await supabase
        .from("protocol_steps")
        .delete()
        .eq("protocol_id", protocol.id);

      // Create steps from owned procedures
      let stepOrder = 0;
      const stepInserts = [];

      for (const proc of ownedProcedures) {
        stepInserts.push({
          protocol_id: protocol.id,
          source_item_id: proc.id,
          title: proc.title,
          description: proc.content_full?.substring(0, 1000) ?? null,
          step_type: "action",
          step_order: stepOrder++,
          is_required: true,
          agent_prompt: proc.content_full ?? null,
        });
      }

      // Insert owned directive gates
      for (const dir of ownedDirectives) {
        stepInserts.push({
          protocol_id: protocol.id,
          source_item_id: dir.id,
          title: `⚡ ${dir.title}`,
          description: dir.content_full?.substring(0, 1000) ?? null,
          step_type: "gate",
          step_order: stepOrder++,
          is_required: true,
          gate_enforcement: dir.enforcement_level ?? "required_ack",
          agent_prompt: `COMPLIANCE GATE: ${dir.content_full}`,
        });
      }

      // Insert owned research steps
      for (const res of ownedResearch) {
        stepInserts.push({
          protocol_id: protocol.id,
          source_item_id: res.id,
          title: `🔬 ${res.title}`,
          description: res.content_full?.substring(0, 1000) ?? null,
          step_type: "research",
          step_order: stepOrder++,
          is_required: true,
          agent_prompt: `RESEARCH: ${res.content_full}`,
        });
      }

      // If no procedures/directives/research, create a single default step from the playbook
      if (stepInserts.length === 0) {
        stepInserts.push({
          protocol_id: protocol.id,
          source_item_id: pb.id,
          title: "Execute Protocol",
          description: pb.content_full?.substring(0, 1000) ?? null,
          step_type: "action",
          step_order: 0,
          is_required: true,
          agent_prompt: pb.content_full ?? null,
        });
      }

      if (stepInserts.length > 0) {
        await supabase.from("protocol_steps").insert(stepInserts);
      }

      // Link SHARED context items (KNOWLEDGE, PRINCIPLE, PREFERENCE) + unowned RESEARCH to every protocol
      const allShared = [...sharedContextItems, ...sharedResearch];
      await supabase
        .from("protocol_context_items")
        .delete()
        .eq("protocol_id", protocol.id);

      if (allShared.length > 0) {
        const contextInserts = allShared.map((ci: any) => ({
          protocol_id: protocol.id,
          context_item_id: ci.id,
          injection_scope: "always",
        }));
        await supabase.from("protocol_context_items").insert(contextInserts);
      }

      protocolsCreated++;
    }

    return new Response(
      JSON.stringify({
        protocols_created: protocolsCreated,
        total_procedures: allProcedures.length,
        total_directives: allDirectives.length,
        total_research_steps: allResearch.filter((r: any) => !!parentMap[r.id]).length,
        shared_context_items: sharedContextItems.length + sharedResearch.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("generate-protocols error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
