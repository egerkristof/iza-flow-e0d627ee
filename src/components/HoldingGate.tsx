import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PASSWORD = "Liz4Holding 2026";
const STORAGE_KEY = "holding-deck-access";

export function HoldingGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const metas: HTMLMetaElement[] = [];
    const add = (name: string, content: string) => {
      const m = document.createElement("meta");
      m.setAttribute("name", name);
      m.setAttribute("content", content);
      document.head.appendChild(m);
      metas.push(m);
    };
    add("robots", "noindex, nofollow, noarchive, nosnippet, noimageindex");
    add("googlebot", "noindex, nofollow");
    add("bingbot", "noindex, nofollow");
    add("GPTBot", "noindex, nofollow");
    add("ChatGPT-User", "noindex, nofollow");
    add("CCBot", "noindex, nofollow");
    add("anthropic-ai", "noindex, nofollow");
    add("ClaudeBot", "noindex, nofollow");
    add("Google-Extended", "noindex, nofollow");
    add("PerplexityBot", "noindex, nofollow");

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    } catch {}

    return () => { metas.forEach((m) => m.remove()); };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold">Restricted</h1>
          <p className="mt-1 text-sm text-muted-foreground">Council-only working draft. Enter the access password to continue.</p>
        </div>
        <Input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          placeholder="Password"
        />
        {error && <p className="text-sm text-destructive">Incorrect password.</p>}
        <Button type="submit" className="w-full">Unlock</Button>
      </form>
    </div>
  );
}