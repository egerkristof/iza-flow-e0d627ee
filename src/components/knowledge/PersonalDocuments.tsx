import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Trash2, Linkedin, Award, File, Loader2, BookUp, Sparkles, GitCompareArrows } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PromoteToContextDialog } from "./PromoteToContextDialog";
import { ImportCopilotDialog } from "./ImportCopilotDialog";
import { CompareExtractionsDialog } from "./CompareExtractionsDialog";
import { ExtractionDepthSelector } from "./ExtractionDepthSelector";
import { type ExtractionResult, type ExtractionDepth, type AdvisorPersona, EXTRACTION_DEPTH_META } from "@/lib/knowledge-schema";

const CATEGORIES = [
  { value: "cv", label: "CV / Resume", icon: FileText },
  { value: "linkedin", label: "LinkedIn Export", icon: Linkedin },
  { value: "certification", label: "Certification", icon: Award },
  { value: "gartner", label: "Gartner / Analyst Profile", icon: File },
  { value: "other", label: "Other", icon: File },
] as const;

const categoryLabel = (cat: string) => CATEGORIES.find((c) => c.value === cat)?.label ?? cat;

export function PersonalDocuments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("cv");
  const [promoteDoc, setPromoteDoc] = useState<{ title: string; content: string } | null>(null);
  const [extracting, setExtracting] = useState<string | null>(null);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [extractionDocName, setExtractionDocName] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [compareDoc, setCompareDoc] = useState<{ id: string; name: string } | null>(null);
  const [extractionDepth, setExtractionDepth] = useState<ExtractionDepth>("guided");

  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["personal-documents", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personal_documents")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (doc: { id: string; file_path: string }) => {
      await supabase.storage.from("personal-documents").remove([doc.file_path]);
      const { error } = await supabase.from("personal_documents").delete().eq("id", doc.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["personal-documents"] });
      toast({ title: "Document removed" });
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 20MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadErr } = await supabase.storage
        .from("personal-documents")
        .upload(filePath, file);
      if (uploadErr) throw uploadErr;

      const { error: insertErr } = await supabase.from("personal_documents").insert({
        user_id: user.id,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type || "application/octet-stream",
        document_category: selectedCategory,
        parsed_status: "pending",
      });
      if (insertErr) throw insertErr;

      qc.invalidateQueries({ queryKey: ["personal-documents"] });
      toast({ title: "Document uploaded", description: `${file.name} added as ${categoryLabel(selectedCategory)}` });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleExtract = async (docId: string, docName: string) => {
    setExtracting(docId);
    try {
      // Generate advisor for guided/deep modes
      let advisorPersona: AdvisorPersona | null = null;
      if (extractionDepth !== "quick") {
        try {
          const { data: advData } = await supabase.functions.invoke("generate-advisor", {
            body: { content: docName, meta: { title: docName } },
          });
          if (advData && !advData.error) advisorPersona = advData as AdvisorPersona;
        } catch {}
      }

      const { data, error } = await supabase.functions.invoke("extract-knowledge", {
        body: {
          documentId: docId,
          source_type: "document",
          extraction_depth: extractionDepth,
          ...(advisorPersona ? { advisor_persona: advisorPersona } : {}),
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setExtractionResult(data as ExtractionResult);
      setExtractionDocName(docName);
      setReviewOpen(true);
      qc.invalidateQueries({ queryKey: ["personal-documents"] });
    } catch (err: any) {
      toast({ title: "Extraction failed", description: err.message, variant: "destructive" });
    } finally {
      setExtracting(null);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Profile Documents</CardTitle>
        <CardDescription>
          Upload your CV, LinkedIn PDF, certifications, or analyst profiles. These build your personal knowledge graph.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload controls */}
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-border p-4 bg-muted/30">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.csv,.json"
            onChange={handleUpload}
          />
          <Button
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="gap-2"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Choose File"}
          </Button>
          <ExtractionDepthSelector value={extractionDepth} onChange={setExtractionDepth} compact />
          <span className="text-xs text-muted-foreground">PDF, DOC, TXT, CSV — max 20MB</span>
        </div>

        {/* Documents list */}
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-6 text-center">Loading documents…</div>
        ) : docs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No documents yet. Upload your first profile document above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{doc.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-xs">{categoryLabel(doc.document_category)}</Badge>
                  <Badge variant={doc.parsed_status === "parsed" ? "default" : "outline"} className="text-xs">
                    {doc.parsed_status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-amber-400 hover:text-amber-300"
                    title="Extract preferences & context with AI"
                    disabled={extracting === doc.id}
                    onClick={() => handleExtract(doc.id, doc.file_name)}
                  >
                    {extracting === doc.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    title="Compare all extraction depths"
                    onClick={() => setCompareDoc({ id: doc.id, name: doc.file_name })}
                  >
                    <GitCompareArrows className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-primary hover:text-primary"
                    title="Promote to Context Item"
                    onClick={() => setPromoteDoc({
                      title: doc.file_name,
                      content: `[${categoryLabel(doc.document_category)}] ${doc.description || doc.file_name}\n\nSource: Personal document uploaded ${new Date(doc.created_at).toLocaleDateString()}`,
                    })}
                  >
                    <BookUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => deleteMutation.mutate({ id: doc.id, file_path: doc.file_path })}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <PromoteToContextDialog
          open={!!promoteDoc}
          onOpenChange={(v) => { if (!v) setPromoteDoc(null); }}
          defaultTitle={promoteDoc?.title ?? ""}
          defaultContent={promoteDoc?.content ?? ""}
          sourceLabel="Document"
        />

        <ImportCopilotDialog
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          data={extractionResult}
          sourceName={extractionDocName}
          sourceType="document"
        />

        <CompareExtractionsDialog
          open={!!compareDoc}
          onOpenChange={(v) => { if (!v) setCompareDoc(null); }}
          sourceName={compareDoc?.name ?? ""}
          buildBody={() => ({ documentId: compareDoc?.id ?? "", source_type: "document" })}
          onSelectResult={(data, depth) => {
            setExtractionResult(data);
            setExtractionDocName(`${compareDoc?.name ?? ""} (${EXTRACTION_DEPTH_META[depth].label})`);
            setCompareDoc(null);
            setReviewOpen(true);
          }}
        />
      </CardContent>
    </Card>
  );
}
