import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Brain, Save, RotateCcw, History, ChevronDown, ChevronRight,
  Sparkles, MessageSquare, Loader2, Send, Bot, User as UserIcon,
  FileCode2, Eye, Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AiPrompt {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  function_name: string;
  prompt_type: string;
  content: string;
  model: string | null;
  is_active: boolean;
  version: number;
  updated_at: string;
  updated_by: string | null;
}

interface PromptVersion {
  id: string;
  version: number;
  content: string;
  changed_by: string | null;
  change_note: string | null;
  created_at: string;
}

// ─── Admin Copilot System Knowledge ──────────────────────────────────────────
const ADMIN_COPILOT_CONTEXT = `You are the **AACE System Architect Copilot** — an expert on the entire Liza platform architecture, knowledge graph taxonomy, and extraction pipeline.

## YOUR ROLE
You help Process Owners (Architects) understand, debug, and improve the AI prompts that power the AACE knowledge extraction and management system. You have deep knowledge of:

### AACE Taxonomy & Protocol Execution Model
- **7 Categories**: DIRECTIVE (compliance gates), PROCEDURE (executable steps), PLAYBOOK (protocol drivers), KNOWLEDGE (context), RESEARCH (intelligence), PRINCIPLE (decision-making context), PREFERENCE (personalization)
- **Bundle Architecture**: Curated collections of items forming deployable execution units. Each bundle has exactly 1 PLAYBOOK driver, ordered PROCEDUREs with step_order_hint, DIRECTIVEs as gates, and KNOWLEDGE/RESEARCH/PRINCIPLE as context injections.
- **Protocol Execution**: Bundles → Workbook Protocols → Steps + Gates + Context. Operators execute protocols, captures feed back into the knowledge graph.

### Extraction Pipeline Architecture
- **extract-knowledge**: The main extraction engine. Uses structural analysis, phase-level consolidation, and strict category rules. Supports document, chat, task, research, and manual sources. Three depths: quick (flash), guided (flash + advisor), deep (pro).
- **generate-advisor**: Creates domain-specific expert personas to enhance extraction quality. Uses fast model (flash-lite) for classification.
- **refine-extraction**: Post-extraction refinement — split, merge, recategorize, enrich items within the Import Copilot.
- **classify-finding**: Real-time classification of chat messages as knowledge captures with dedup detection.
- **audit-context**: Bulk auditing + conversational copilot for knowledge graph health analysis.
- **generate-protocols**: Deterministic (no AI) — transforms bundles into executable workbook protocols.
- **extract-profile**: ~~Retired~~ — legacy function, fully superseded by extract-knowledge.

### Key Learnings from Testing
1. **PLAYBOOK Over-classification**: The most common extraction error. Frameworks (BANT, DISK), checklists, and step-by-step sequences are NOT PLAYBOOKs. Each bundle should have exactly 1 PLAYBOOK.
2. **Phase Label Collisions**: Documents with sequential phases (A, B, C...) must have unique bundle prefixes. Sub-sections under the same phase use numeric suffixes (C1, C2, C3).
3. **Sub-phase Splitting**: Bundles exceeding 15 items MUST be split into sub-phases, each independently deployable.
4. **Skeleton Detection**: The engine must detect ALL phases referenced in overview diagrams/TOCs, creating skeleton bundles for undocumented ones.
5. **Standalone Item Minimization**: <5% of items should be standalone; nearly all should be inside bundles.
6. **Junction Table Persistence**: Items must be linked to bundles via context_item_bundles (many-to-many), not just the legacy bundle_id column.
7. **Phase-Level Consolidation**: Target 10-18 bundles for large methodology documents. Bundle at the phase level, not per slide/heading.

### Prompt Engineering Guidelines
- Category decision rules must be applied IN ORDER (priority-based)
- The PLAYBOOK Test has 3 questions that must ALL be YES
- Structural analysis must happen BEFORE item extraction
- The Final Validation Checklist (7 checks) must pass before returning results
- Deep mode = more items per bundle, NOT more bundles

## HOW TO HELP
When a user asks about a prompt:
- Explain what it does and how it fits in the pipeline
- Suggest specific improvements based on the learnings above
- Point out potential issues or gaps
- Recommend test scenarios to validate changes
- Explain the downstream impact of changes (e.g., changing extraction rules affects Import Copilot behavior)

Be specific, technical, and actionable. Reference the actual prompt content when discussing improvements.`;

// ─── Chat Message Component ─────────────────────────────────────────────────
function ChatMessage({ role, content }: { role: string; content: string }) {
  return (
    <div className={cn("flex gap-2 py-2", role === "user" ? "justify-end" : "justify-start")}>
      {role !== "user" && (
        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
      <div className={cn(
        "max-w-[85%] rounded-lg px-3 py-2 text-sm",
        role === "user"
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-foreground"
      )}>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
      {role === "user" && (
        <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
          <UserIcon className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdminPromptsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch all prompts
  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ["ai-prompts"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .order("function_name, prompt_type");
      if (error) throw error;
      return data as AiPrompt[];
    },
  });

  const selectedPrompt = prompts.find(p => p.slug === selectedSlug);

  // Fetch version history
  const { data: versions = [] } = useQuery({
    queryKey: ["ai-prompt-versions", selectedPrompt?.id],
    enabled: !!selectedPrompt && showHistory,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompt_versions")
        .select("*")
        .eq("prompt_id", selectedPrompt!.id)
        .order("version", { ascending: false });
      if (error) throw error;
      return data as PromptVersion[];
    },
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPrompt || !user) return;
      // Save version history
      await supabase.from("ai_prompt_versions").insert({
        prompt_id: selectedPrompt.id,
        version: selectedPrompt.version,
        content: selectedPrompt.content,
        changed_by: user.id,
        change_note: changeNote || "Updated prompt",
      });
      // Update prompt
      const { error } = await supabase
        .from("ai_prompts")
        .update({
          content: editContent,
          version: selectedPrompt.version + 1,
          updated_by: user.id,
        })
        .eq("id", selectedPrompt.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-prompts"] });
      qc.invalidateQueries({ queryKey: ["ai-prompt-versions"] });
      setEditing(false);
      setChangeNote("");
      toast({ title: "Prompt saved", description: `Version ${(selectedPrompt?.version ?? 0) + 1} saved.` });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const startEditing = useCallback(() => {
    if (selectedPrompt) {
      setEditContent(selectedPrompt.content);
      setEditing(true);
    }
  }, [selectedPrompt]);

  const cancelEditing = useCallback(() => {
    setEditing(false);
    setChangeNote("");
  }, []);

  // Admin copilot chat
  const handleChatSend = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");

    const newMessages = [...chatMessages, { role: "user", content: userMsg }];
    setChatMessages(newMessages);
    setChatLoading(true);

    try {
      // Build context with current prompts
      const promptContext = prompts.map(p =>
        `### ${p.label} (${p.slug})\nFunction: ${p.function_name} | Type: ${p.prompt_type} | Model: ${p.model || "N/A"} | v${p.version}\n\n${p.content.slice(0, 2000)}${p.content.length > 2000 ? "\n[...truncated]" : ""}`
      ).join("\n\n---\n\n");

      const { data, error } = await supabase.functions.invoke("audit-context", {
        body: {
          action: "chat",
          messages: [
            { role: "system", content: ADMIN_COPILOT_CONTEXT + `\n\n## CURRENT PROMPTS IN THE SYSTEM:\n\n${promptContext}` },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          graph_context: [],
        },
      });

      if (error) throw error;

      // Handle streaming response
      if (data instanceof ReadableStream) {
        const reader = data.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";
        setChatMessages(prev => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
          for (const line of lines) {
            const json = line.slice(6);
            if (json === "[DONE]") continue;
            try {
              const parsed = JSON.parse(json);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              assistantContent += delta;
              setChatMessages(prev => {
                const msgs = [...prev];
                msgs[msgs.length - 1] = { role: "assistant", content: assistantContent };
                return msgs;
              });
            } catch { /* skip parse errors */ }
          }
        }
      } else if (typeof data === "string") {
        setChatMessages(prev => [...prev, { role: "assistant", content: data }]);
      }
    } catch (e: any) {
      setChatMessages(prev => [...prev, { role: "assistant", content: `Error: ${e.message}` }]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatMessages, chatLoading, prompts]);

  // Group prompts by function
  const groupedPrompts = prompts.reduce((acc, p) => {
    (acc[p.function_name] = acc[p.function_name] || []).push(p);
    return acc;
  }, {} as Record<string, AiPrompt[]>);

  const functionMeta: Record<string, { icon: string; color: string }> = {
    "extract-knowledge": { icon: "🧠", color: "text-blue-400" },
    "refine-extraction": { icon: "✨", color: "text-amber-400" },
    "generate-advisor": { icon: "🎯", color: "text-emerald-400" },
    "classify-finding": { icon: "🏷️", color: "text-cyan-400" },
    "audit-context": { icon: "🔍", color: "text-purple-400" },
    "extract-profile": { icon: "📄", color: "text-muted-foreground line-through" },
    "generate-protocols": { icon: "⚙️", color: "text-orange-400" },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left: Prompt List */}
      <div className="w-72 border-r border-border/50 flex flex-col bg-card/30">
        <div className="p-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">AI Prompts</h2>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">{prompts.length} prompts across {Object.keys(groupedPrompts).length} functions</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {Object.entries(groupedPrompts).map(([fn, fnPrompts]) => {
              const meta = functionMeta[fn] || { icon: "📦", color: "text-muted-foreground" };
              return (
                <div key={fn} className="space-y-0.5">
                  <div className="text-[10px] font-medium text-muted-foreground px-2 py-1 flex items-center gap-1.5">
                    <span>{meta.icon}</span>
                    <span className="font-mono">{fn}</span>
                  </div>
                  {fnPrompts.map(p => (
                    <button
                      key={p.slug}
                      onClick={() => { setSelectedSlug(p.slug); setEditing(false); setShowHistory(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-xs transition-colors",
                        selectedSlug === p.slug
                          ? "bg-primary/10 text-foreground border border-primary/20"
                          : "hover:bg-muted/50 text-muted-foreground"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{p.label}</span>
                        <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5 shrink-0 ml-1">v{p.version}</Badge>
                      </div>
                      <div className="text-[10px] opacity-60 mt-0.5">{p.prompt_type}</div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Center: Prompt Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedPrompt ? (
          <>
            <div className="p-4 border-b border-border/50 flex items-start justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">{selectedPrompt.label}</h3>
                  <Badge variant="outline" className="text-[10px] font-mono">{selectedPrompt.prompt_type}</Badge>
                  {selectedPrompt.model && (
                    <Badge variant="secondary" className="text-[10px]">{selectedPrompt.model}</Badge>
                  )}
                </div>
                {selectedPrompt.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{selectedPrompt.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                  <span>v{selectedPrompt.version}</span>
                  <span>Updated {new Date(selectedPrompt.updated_at).toLocaleDateString()}</span>
                  <span className="font-mono">{selectedPrompt.slug}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {!editing ? (
                  <>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setShowHistory(!showHistory)}>
                      <History className="h-3 w-3 mr-1" />
                      History
                    </Button>
                    <Button size="sm" className="text-xs h-7" onClick={startEditing}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="Change note..."
                      value={changeNote}
                      onChange={e => setChangeNote(e.target.value)}
                      className="h-7 text-xs w-48"
                    />
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={cancelEditing}>
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" className="text-xs h-7" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                      {saveMutation.isPending ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
                      Save v{selectedPrompt.version + 1}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1">
              {showHistory && versions.length > 0 ? (
                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground">Version History</h4>
                  {versions.map(v => (
                    <div key={v.id} className="border border-border/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">v{v.version}</Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(v.created_at).toLocaleString()}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[10px] h-6"
                          onClick={() => {
                            setEditContent(v.content);
                            setEditing(true);
                            setShowHistory(false);
                          }}
                        >
                          <RotateCcw className="h-2.5 w-2.5 mr-1" />
                          Restore
                        </Button>
                      </div>
                      {v.change_note && (
                        <p className="text-[10px] text-muted-foreground italic">{v.change_note}</p>
                      )}
                      <pre className="text-[10px] text-muted-foreground bg-muted/30 rounded p-2 max-h-32 overflow-auto whitespace-pre-wrap font-mono">
                        {v.content.slice(0, 500)}{v.content.length > 500 ? "..." : ""}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : editing ? (
                <div className="p-4">
                  <Textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="min-h-[calc(100vh-16rem)] font-mono text-xs leading-relaxed resize-none"
                    placeholder="Enter prompt content..."
                  />
                </div>
              ) : (
                <div className="p-4">
                  <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono text-foreground/90">
                    {selectedPrompt.content}
                  </pre>
                </div>
              )}
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <FileCode2 className="h-8 w-8 mx-auto opacity-30" />
              <p className="text-sm">Select a prompt to view or edit</p>
            </div>
          </div>
        )}
      </div>

      {/* Right: Admin Copilot Chat */}
      <div className="w-80 border-l border-border/50 flex flex-col bg-card/30">
        <div className="p-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">System Architect Copilot</h3>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Ask about prompts, architecture, or get improvement suggestions
          </p>
        </div>

        <ScrollArea className="flex-1 px-3 py-2">
          {chatMessages.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Brain className="h-8 w-8 mx-auto text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">
                Ask me about any prompt, the AACE architecture, or how to improve extraction quality.
              </p>
              <div className="space-y-1.5">
                {[
                  "What are the most common extraction mistakes?",
                  "How can I improve PLAYBOOK classification?",
                  "Explain the extraction pipeline flow",
                  "What should I change to improve bundle quality?",
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => { setChatInput(q); }}
                    className="block w-full text-left text-[10px] px-2.5 py-1.5 rounded border border-border/50 hover:border-primary/30 hover:bg-primary/5 text-muted-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {chatMessages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking...
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-3 border-t border-border/50">
          <form
            onSubmit={e => { e.preventDefault(); handleChatSend(); }}
            className="flex gap-1.5"
          >
            <Input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask about prompts..."
              className="text-xs h-8 flex-1"
              disabled={chatLoading}
            />
            <Button type="submit" size="icon" className="h-8 w-8 shrink-0" disabled={chatLoading || !chatInput.trim()}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
