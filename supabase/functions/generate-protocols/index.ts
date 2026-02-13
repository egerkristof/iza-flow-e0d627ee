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

    // Get all context items in this bundle via the junction table
    const { data: bundleLinks, error: linkError } = await supabase
      .from("context_item_bundles")
      .select("context_item_id")
      .eq("bundle_id", bundle_id);

    // Also get items with legacy bundle_id
    const { data: legacyItems, error: legacyError } = await supabase
      .from("context_items")
      .select("*")
      .eq("bundle_id", bundle_id);

    if (linkError || legacyError) {
      throw new Error("Failed to fetch bundle items");
    }

    // Merge IDs
    const junctionIds = (bundleLinks || []).map((l: any) => l.context_item_id);
    const legacyIds = (legacyItems || []).map((i: any) => i.id);
    const allIds = [...new Set([...junctionIds, ...legacyIds])];

    if (allIds.length === 0) {
      return new Response(JSON.stringify({ protocols_created: 0, message: "No items in bundle" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch full items
    const { data: items, error: itemError } = await supabase
      .from("context_items")
      .select("*")
      .in("id", allIds);

    if (itemError) throw itemError;

    // Categorize items
    const playbooks = items.filter((i: any) => i.category === "PLAYBOOK");
    const procedures = items.filter((i: any) => i.category === "PROCEDURE");
    const directives = items.filter((i: any) => i.category === "DIRECTIVE");
    const contextItems = items.filter((i: any) =>
      ["KNOWLEDGE", "RESEARCH", "PRINCIPLE", "PREFERENCE"].includes(i.category)
    );

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

      // Create steps from procedures
      let stepOrder = 0;
      const stepInserts = [];

      for (const proc of procedures) {
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

      // Insert directive gates at appropriate positions
      for (const dir of directives) {
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

      // If no procedures/directives, create a single default step from the playbook
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

      // Link context items (KNOWLEDGE, RESEARCH, PRINCIPLE, PREFERENCE)
      await supabase
        .from("protocol_context_items")
        .delete()
        .eq("protocol_id", protocol.id);

      if (contextItems.length > 0) {
        const contextInserts = contextItems.map((ci: any) => ({
          protocol_id: protocol.id,
          context_item_id: ci.id,
          injection_scope: ci.category === "PREFERENCE" ? "always" : "always",
        }));
        await supabase.from("protocol_context_items").insert(contextInserts);
      }

      protocolsCreated++;
    }

    return new Response(
      JSON.stringify({
        protocols_created: protocolsCreated,
        steps_from_procedures: procedures.length,
        gates_from_directives: directives.length,
        context_items_linked: contextItems.length,
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
