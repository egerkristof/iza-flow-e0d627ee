import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    // Verify user
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) throw new Error("Unauthorized");

    const { documentId } = await req.json();
    if (!documentId) throw new Error("documentId required");

    // Fetch document metadata
    const adminClient = createClient(supabaseUrl, supabaseKey);
    const { data: doc, error: docError } = await adminClient
      .from("personal_documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();
    if (docError || !doc) throw new Error("Document not found");

    // Download file content
    const { data: fileData, error: dlError } = await adminClient.storage
      .from("personal-documents")
      .download(doc.file_path);
    if (dlError || !fileData) throw new Error("Failed to download file");

    // Extract text from the file
    const textContent = await fileData.text();

    // Call Lovable AI to extract structured data
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert at analyzing professional profile documents. Extract structured information that can be used to personalize AI interactions. Return results via the extract_profile tool.`,
          },
          {
            role: "user",
            content: `Analyze this profile document and extract relevant working preferences and context items.\n\nDocument (${doc.file_name}, category: ${doc.document_category}):\n\n${textContent.slice(0, 15000)}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_profile",
              description: "Extract working preferences and context items from a profile document",
              parameters: {
                type: "object",
                properties: {
                  preferences: {
                    type: "array",
                    description: "Working style preferences extracted from the document",
                    items: {
                      type: "object",
                      properties: {
                        preference_key: {
                          type: "string",
                          enum: [
                            "tone", "communication_style", "response_depth", "focus_areas",
                            "excluded_topics", "preferred_frameworks", "output_format",
                            "principles", "prohibitions", "expertise", "past_experiences",
                          ],
                        },
                        preference_value: { type: "string", description: "The extracted preference value" },
                        condition_label: { type: "string", description: "Optional context label" },
                      },
                      required: ["preference_key", "preference_value"],
                      additionalProperties: false,
                    },
                  },
                  context_items: {
                    type: "array",
                    description: "Knowledge or research context items worth capturing",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        content: { type: "string" },
                        category: {
                          type: "string",
                          enum: ["KNOWLEDGE", "RESEARCH", "DIRECTIVE"],
                        },
                      },
                      required: ["title", "content", "category"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["preferences", "context_items"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_profile" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI extraction failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No extraction result");

    const extracted = JSON.parse(toolCall.function.arguments);

    // Update document parsed status
    await adminClient
      .from("personal_documents")
      .update({ parsed_status: "parsed" })
      .eq("id", documentId);

    return new Response(JSON.stringify(extracted), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("extract-profile error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
