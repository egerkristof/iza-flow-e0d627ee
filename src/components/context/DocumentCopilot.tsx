import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles, X, Send, Loader2, Wand2, Maximize2, Minimize2,
  PenLine, Expand, FileText, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { MockBundle, MockContextItem } from "@/data/mockContextItems";

interface DocumentCopilotProps {
  selectedText: string;
  fullDocument: string;
  bundle: MockBundle;
  items: MockContextItem[];
  otherBundles?: { title: string; description: string }[];
  position: { top: number; left: number };
  onReplace: (newText: string) => void;
  onClose: () => void;
}

const QUICK_ACTIONS = [
  { id: "improve", label: "Improve", icon: Wand2, desc: "Make clearer & more actionable" },
  { id: "expand", label: "Expand", icon: Expand, desc: "Add more detail" },
  { id: "simplify", label: "Simplify", icon: Minimize2, desc: "Make more concise" },
  { id: "rewrite", label: "Rewrite", icon: PenLine, desc: "Rephrase entirely" },
] as const;

export function DocumentCopilot({
  selectedText,
  fullDocument,
  bundle,
  items,
  otherBundles = [],
  position,
  onReplace,
  onClose,
}: DocumentCopilotProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const runAction = useCallback(async (action: string, customInstruction?: string) => {
    setLoading(true);
    setStreaming(true);
    setResult("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Not authenticated", variant: "destructive" });
        setLoading(false);
        setStreaming(false);
        return;
      }

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/document-copilot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            selected_text: selectedText,
            full_document: fullDocument,
            user_instruction: customInstruction || action,
            action,
            bundle_context: {
              title: bundle.title,
              description: bundle.description,
              items: items.map(i => ({
                category: i.category,
                title: i.title,
                content_preview: i.content_preview,
              })),
              other_bundles: otherBundles,
            },
          }),
        }
      );

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "Request failed" }));
        toast({ title: "Copilot error", description: errData.error, variant: "destructive" });
        setLoading(false);
        setStreaming(false);
        return;
      }

      // Stream SSE
      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setResult(accumulated);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (err) {
      toast({ title: "Error", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }, [selectedText, fullDocument, bundle, items, otherBundles, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;
    runAction("edit", instruction);
  };

  const handleAccept = () => {
    onReplace(result);
    onClose();
  };

  // Calculate position, clamped to viewport
  const style: React.CSSProperties = {
    position: "fixed",
    top: Math.min(position.top, window.innerHeight - 320),
    left: Math.min(position.left, window.innerWidth - 380),
    zIndex: 50,
  };

  return (
    <div ref={panelRef} style={style} className="w-[360px] rounded-lg border border-primary/30 bg-card shadow-xl shadow-primary/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-primary/5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Document Copilot</span>
        </div>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onClose}>
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Selected text preview */}
      <div className="px-3 py-2 border-b border-border/30 bg-secondary/30">
        <p className="text-[10px] text-muted-foreground line-clamp-2 font-mono">
          {selectedText.substring(0, 120)}{selectedText.length > 120 ? "…" : ""}
        </p>
      </div>

      {/* Quick actions */}
      {!result && (
        <div className="px-3 py-2 flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map(a => (
            <Button
              key={a.id}
              variant="outline"
              size="sm"
              className="h-6 text-[10px] gap-1 border-border/50"
              onClick={() => runAction(a.id)}
              disabled={loading}
            >
              <a.icon className="h-3 w-3" />
              {a.label}
            </Button>
          ))}
        </div>
      )}

      {/* Custom instruction input */}
      {!result && (
        <form onSubmit={handleSubmit} className="px-3 pb-2 flex gap-1.5">
          <Input
            ref={inputRef}
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
            placeholder="Or type a custom instruction…"
            className="h-7 text-xs"
            disabled={loading}
          />
          <Button type="submit" size="sm" className="h-7 px-2" disabled={loading || !instruction.trim()}>
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
          </Button>
        </form>
      )}

      {/* Loading indicator */}
      {loading && !result && (
        <div className="px-3 py-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Thinking…
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="px-3 py-2 space-y-2">
          <div className="max-h-[160px] overflow-y-auto rounded-md border border-border/30 bg-secondary/20 p-2">
            <p className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
              {result}
              {streaming && <span className="animate-pulse text-primary">▍</span>}
            </p>
          </div>
          {!streaming && (
            <div className="flex items-center gap-1.5">
              <Button size="sm" className="h-6 text-[10px] gap-1 flex-1" onClick={handleAccept}>
                Accept & Replace
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[10px] gap-1"
                onClick={() => { setResult(""); setInstruction(""); }}
              >
                <RotateCcw className="h-3 w-3" /> Try Again
              </Button>
              <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={onClose}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Context indicator */}
      <div className="px-3 py-1.5 border-t border-border/30 bg-muted/30 flex items-center gap-1">
        <FileText className="h-2.5 w-2.5 text-muted-foreground" />
        <span className="text-[9px] text-muted-foreground">
          Context: {bundle.title} • {items.length} items • {otherBundles.length} other bundles
        </span>
      </div>
    </div>
  );
}
