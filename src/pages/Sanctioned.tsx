import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck, Lock, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listSanctioned, type SanctionedWorkflow, type Visibility } from "@/components/frame/chat-storage";

const VIS_ICON: Record<Visibility, typeof Lock> = {
  private: Lock,
  team: Users,
  org: Globe,
};

const VIS_LABEL: Record<Visibility, string> = {
  private: "Private",
  team: "Team",
  org: "Organization",
};

export default function SanctionedPage() {
  const [items, setItems] = useState<SanctionedWorkflow[]>([]);

  useEffect(() => {
    setItems(listSanctioned());
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-12 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="h-8 -ml-2">
            <Link to="/framed-chat"><ArrowLeft className="h-4 w-4 mr-1" /> Back to chat</Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold">Sanctioned Workflows</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Approved ways of working</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Chats that have been promoted to reusable workflows. Sanction means "this is the approved way to do this task," not that it runs automatically.
        </p>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <ShieldCheck className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No sanctioned workflows yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              When a chat reaches a Frame Score of 100 and is sanctioned, it will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-2">Workflow</th>
                  <th className="text-left font-medium px-4 py-2">Visibility</th>
                  <th className="text-right font-medium px-4 py-2">Score</th>
                  <th className="text-right font-medium px-4 py-2">Sanctioned</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((w) => {
                  const Icon = VIS_ICON[w.visibility];
                  return (
                    <tr key={w.id} className="border-t">
                      <td className="px-4 py-3 font-medium truncate max-w-[280px]">{w.title}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Icon className="h-3 w-3" />
                          {VIS_LABEL[w.visibility]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-emerald-600">
                        {w.frameScore}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground tabular-nums">
                        {new Date(w.sanctionedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
                          <Link to={`/framed-chat/${w.chatId}`}>Open</Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}