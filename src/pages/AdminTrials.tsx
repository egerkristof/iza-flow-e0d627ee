import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Trial {
  id: string;
  email: string | null;
  name: string | null;
  company: string | null;
  source_type: string;
  content_preview: string | null;
  result_summary: { bundles?: number; items?: number; categories?: Record<string, number> } | null;
  created_at: string;
}

export default function AdminTrials() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("extraction_trials")
        .select("*")
        .order("created_at", { ascending: false });
      setTrials((data as unknown as Trial[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Extraction Trials</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : trials.length === 0 ? (
        <p className="text-muted-foreground">No trials yet.</p>
      ) : (
        <div className="border rounded-lg overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Company</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Bundles</th>
                <th className="text-left px-4 py-3 font-medium">Items</th>
              </tr>
            </thead>
            <tbody>
              {trials.map((t) => (
                <tr key={t.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {format(new Date(t.created_at), "MMM d, HH:mm")}
                  </td>
                  <td className="px-4 py-3">{t.email || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.company || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted">{t.source_type}</span>
                  </td>
                  <td className="px-4 py-3 font-mono">{t.result_summary?.bundles ?? "—"}</td>
                  <td className="px-4 py-3 font-mono">{t.result_summary?.items ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
