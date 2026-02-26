import { useState, useCallback } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ExperienceStory } from "@/components/marketing/ExperienceStory";
import { SAMPLE_CONTENT } from "@/data/sampleContent";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import type { ExtractionResult } from "@/lib/knowledge-schema";
import type { ExperiencePreview } from "@/lib/experience-schema";

type Stage = "choose" | "extracting" | "simulating" | "results";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const EXTRACT_PHASES = [
  "Analyzing document structure…",
  "Extracting knowledge elements…",
  "Categorizing items…",
  "Organizing into bundles…",
  "Running quality checks…",
];

const SIMULATE_PHASES = [
  "Generating executable protocols…",
  "Formulating coaching questions…",
  "Building workbook preview…",
  "Projecting operational learnings…",
];

export default function ExtractionEngine() {
  const [stage, setStage] = useState<Stage>("choose");
  const [mode, setMode] = useState<"sample" | "upload" | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [pasteContent, setPasteContent] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [experiencePreview, setExperiencePreview] = useState<ExperiencePreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = useCallback(async (result: ExtractionResult) => {
    setStage("simulating");
    setPhaseIndex(0);

    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev < SIMULATE_PHASES.length - 1 ? prev + 1 : prev));
    }, 3000);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/simulate-experience`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ extraction_result: result }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Simulation failed (${response.status})`);
      }

      const data = await response.json();
      setExperiencePreview(data);
      setStage("results");
    } catch (e) {
      clearInterval(interval);
      // Fall back to showing extraction results only
      console.error("Simulation failed, showing extraction only:", e);
      setExperiencePreview(null);
      setStage("results");
    }
  }, []);

  const runExtraction = useCallback(async (content: string, contentType: string, userEmail?: string) => {
    setStage("extracting");
    setPhaseIndex(0);
    setError(null);

    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev < EXTRACT_PHASES.length - 1 ? prev + 1 : prev));
    }, 4000);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/public-extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          content,
          content_type: contentType,
          email: userEmail || undefined,
          name: name || undefined,
          company: company || undefined,
        }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Extraction failed (${response.status})`);
      }

      const data = await response.json();
      setExtractionResult(data);

      // Proceed to phase 2: simulate experience
      await runSimulation(data);
    } catch (e) {
      clearInterval(interval);
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
      setStage("choose");
    }
  }, [name, company, runSimulation]);

  const handleSample = () => {
    runExtraction(SAMPLE_CONTENT, "text");
  };

  const handleUploadSubmit = async () => {
    if (!email.trim()) return;
    if (pdfFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        runExtraction(base64, "pdf", email);
      };
      reader.readAsDataURL(pdfFile);
    } else if (pasteContent.trim()) {
      runExtraction(pasteContent, "text", email);
    }
  };

  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
      setPdfFile(file);
      setPasteContent("");
    }
  };

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
      setPdfFile(file);
      setPasteContent("");
    }
  };

  const reset = () => {
    setStage("choose");
    setMode(null);
    setExtractionResult(null);
    setExperiencePreview(null);
    setError(null);
    setPasteContent("");
    setPdfFile(null);
    setPhaseIndex(0);
  };

  const isProcessing = stage === "extracting" || stage === "simulating";
  const phases = stage === "simulating" ? SIMULATE_PHASES : EXTRACT_PHASES;
  const processingTitle = stage === "simulating" ? "Building your experience preview…" : "Extracting Knowledge…";

  return (
    <MarketingLayout>
      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{ borderColor: "hsl(var(--primary) / 0.3)", color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.08)" }}>
            <Sparkles className="w-3.5 h-3.5" /> Extraction Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            See your knowledge, <span className="brand-gradient-text">in action</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Paste a document or try our sample. LIZA will extract your knowledge, generate executable protocols, simulate a team workbook, and show projected learnings — the full AI operating model experience.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-4 rounded-xl border flex items-center gap-3"
            style={{ borderColor: "hsl(var(--destructive) / 0.3)", background: "hsl(var(--destructive) / 0.05)" }}>
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* ── Stage: Choose ──────────────────────────────────────────── */}
        {stage === "choose" && !mode && (
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <button onClick={handleSample}
              className="group rounded-2xl border p-8 text-left hover:border-primary/50 transition-all border-border bg-card">
              <FileText className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Try with Sample Content</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Run the full experience on our "Enterprise Client Onboarding Methodology" — no email needed.
              </p>
              <span className="text-xs font-semibold text-primary group-hover:underline">Run extraction →</span>
            </button>
            <button onClick={() => setMode("upload")}
              className="group rounded-2xl border p-8 text-left hover:border-primary/50 transition-all border-border bg-card">
              <Upload className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Upload Your Own</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Paste text or upload a PDF (up to 5MB). Email required to unlock.
              </p>
              <span className="text-xs font-semibold text-primary group-hover:underline">Get started →</span>
            </button>
          </div>
        )}

        {/* ── Upload Mode Form ───────────────────────────────────────── */}
        {stage === "choose" && mode === "upload" && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border p-8 border-border bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-6">Upload Your Content</h3>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="email" className="text-xs text-muted-foreground">Email *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="name" className="text-xs text-muted-foreground">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="company" className="text-xs text-muted-foreground">Company</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" className="mt-1" />
                </div>
              </div>
              {!pdfFile ? (
                <>
                  <Textarea value={pasteContent} onChange={(e) => setPasteContent(e.target.value)}
                    placeholder="Paste your document content here…" className="min-h-[200px] mb-4" />
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs text-muted-foreground">or</span>
                    <div onDragOver={(e) => e.preventDefault()} onDrop={handlePdfDrop}
                      className="flex-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors border-border"
                      onClick={() => document.getElementById("pdf-input")?.click()}>
                      <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Drop a PDF here or click to upload (max 5MB)</p>
                      <input id="pdf-input" type="file" accept=".pdf" className="hidden" onChange={handlePdfSelect} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl mb-6 bg-muted">
                  <FileText className="w-5 h-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{pdfFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(pdfFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button onClick={() => setPdfFile(null)} className="text-xs text-muted-foreground hover:text-foreground">Remove</button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <button onClick={handleUploadSubmit} disabled={!email.trim() || (!pasteContent.trim() && !pdfFile)}
                  className="px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed brand-gradient-btn"
                  style={{ boxShadow: "0 0 20px -4px hsl(var(--primary) / 0.4)" }}>
                  Run Extraction
                </button>
                <button onClick={() => setMode(null)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                Max 20,000 characters for text · Max 5MB for PDF · 3 extractions per email per day
              </p>
            </div>
          </div>
        )}

        {/* ── Stage: Processing (both extracting and simulating) ──── */}
        {isProcessing && (
          <div className="max-w-lg mx-auto text-center py-20">
            <Loader2 className="w-12 h-12 mx-auto mb-6 text-primary animate-spin" />
            <h3 className="text-xl font-semibold text-foreground mb-4">{processingTitle}</h3>
            <div className="flex flex-col gap-2">
              {phases.map((phase, i) => (
                <div key={i} className="flex items-center gap-3 text-sm transition-all duration-500"
                  style={{
                    opacity: i <= phaseIndex ? 1 : 0.3,
                    color: i === phaseIndex ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}>
                  <span className="w-5 text-center">{i < phaseIndex ? "✓" : i === phaseIndex ? "●" : "○"}</span>
                  {phase}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-8">
              {stage === "extracting" ? "Extraction takes 15–30 seconds…" : "Generating your experience preview (~10 seconds)…"}
            </p>
          </div>
        )}

        {/* ── Stage: Results ─────────────────────────────────────────── */}
        {stage === "results" && extractionResult && experiencePreview && (
          <ExperienceStory
            extractionResult={extractionResult}
            experiencePreview={experiencePreview}
            onReset={reset}
          />
        )}

        {/* Fallback: show old results if simulation failed */}
        {stage === "results" && extractionResult && !experiencePreview && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">Experience preview generation failed. Showing extraction results.</p>
            {/* Import the old view as fallback */}
            <ExperienceStory
              extractionResult={extractionResult}
              experiencePreview={{
                protocols: [],
                coaching_questions: [],
                workbook_preview: { title: "", team_members: [], active_protocols: [], current_session: { executor_name: "", protocol_title: "", current_step: "", step_number: 0, total_steps: 0, ai_draft_output: "" } },
                projected_learnings: [],
              }}
              onReset={reset}
            />
          </div>
        )}
      </div>
    </MarketingLayout>
  );
}
