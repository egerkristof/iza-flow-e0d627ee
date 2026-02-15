import { supabase } from "@/integrations/supabase/client";

export interface DuplicateMatch {
  id: string;
  title: string;
  content_full: string;
  category: string;
  bundle_id: string | null;
  similarity: "exact" | "near";
}

/**
 * Normalize text for comparison: lowercase, collapse whitespace, trim.
 */
function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Simple Jaccard similarity on word sets.
 */
function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(normalize(a).split(" "));
  const setB = new Set(normalize(b).split(" "));
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Check for duplicates among existing items for a given owner.
 * Returns matches sorted by similarity (exact first, then near).
 */
export async function findDuplicates(
  ownerId: string,
  title: string,
  contentFull: string,
  excludeId?: string,
): Promise<DuplicateMatch[]> {
  const { data: existing, error } = await supabase
    .from("context_items")
    .select("id, title, content_full, category, bundle_id")
    .eq("owner_id", ownerId)
    .is("deleted_at", null);

  if (error || !existing) return [];

  const normalizedTitle = normalize(title);
  const normalizedContent = normalize(contentFull);
  const matches: DuplicateMatch[] = [];

  for (const item of existing) {
    if (excludeId && item.id === excludeId) continue;

    const itemTitle = normalize(item.title);
    const itemContent = normalize(item.content_full);

    // Exact match: identical title AND content
    if (itemTitle === normalizedTitle && itemContent === normalizedContent) {
      matches.push({ ...item, similarity: "exact" });
      continue;
    }

    // Near match: high similarity in title or content
    const titleSim = jaccardSimilarity(title, item.title);
    const contentSim = jaccardSimilarity(contentFull, item.content_full);

    if (titleSim > 0.8 || contentSim > 0.7 || (titleSim > 0.6 && contentSim > 0.5)) {
      matches.push({ ...item, similarity: "near" });
    }
  }

  // Sort: exact first
  return matches.sort((a, b) => (a.similarity === "exact" ? -1 : 1) - (b.similarity === "exact" ? -1 : 1));
}

/**
 * Merge two content strings by keeping the longer one's structure
 * and appending unique paragraphs from the shorter.
 */
export function mergeContent(contentA: string, contentB: string): string {
  const parasA = contentA.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  const parasB = contentB.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  
  const normalizedA = new Set(parasA.map(normalize));
  const uniqueFromB = parasB.filter(p => !normalizedA.has(normalize(p)));
  
  if (uniqueFromB.length === 0) return contentA;
  return [...parasA, ...uniqueFromB].join("\n\n");
}
