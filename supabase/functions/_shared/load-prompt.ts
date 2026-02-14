import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

/**
 * Load a system prompt from the ai_prompts table by slug.
 * Falls back to the hardcoded fallback on any error (no DB connection, missing row, etc).
 * This lets admins edit prompts in real-time via the AI Prompts admin page.
 */
export async function loadPrompt(slug: string, fallback: string): Promise<string> {
  try {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return fallback;

    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("ai_prompts")
      .select("content")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data?.content) {
      console.warn(`[load-prompt] Slug "${slug}" not found or inactive, using fallback`);
      return fallback;
    }

    return data.content;
  } catch (e) {
    console.warn(`[load-prompt] Error loading "${slug}", using fallback:`, e);
    return fallback;
  }
}
