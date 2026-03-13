import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart3, Zap, BookOpen, MessageCircle, Loader2, Copy, Check,
  RefreshCw, TrendingDown, ChevronDown, ChevronUp, Sparkles,
} from "lucide-react";

type PostFormat = "data_drop" | "contrarian_take" | "playbook_snippet" | "struggling_moment";

interface GeneratedPost {
  post: string;
  format: PostFormat;
  data_snapshot: {
    n: number;
    overallAvg: number;
    weakestDim: string;
    weakestScore: number;
    teamSizeSegments: Record<string, { count: number; avg: number }>;
    roleSegments: Record<string, { count: number; avg: number }>;
  };
  char_count: number;
  generated_at: string;
}

const FORMAT_META: Record<PostFormat, { label: string; icon: React.ReactNode; description: string; color: string }> = {
  data_drop: {
    label: "Data Drop",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "A surprising stat that makes people stop scrolling",
    color: "bg-blue-500/10 text-blue-700 border-blue-200",
  },
  contrarian_take: {
    label: "Contrarian Take",
    icon: <Zap className="h-4 w-4" />,
    description: "Challenge a widely-held belief with evidence",
    color: "bg-orange-500/10 text-orange-700 border-orange-200",
  },
  playbook_snippet: {
    label: "Playbook Snippet",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Actionable practices from high-scoring teams",
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  },
  struggling_moment: {
    label: "Struggling Moment",
    icon: <MessageCircle className="h-4 w-4" />,
    description: "A visceral 'Monday morning' story from the data",
    color: "bg-purple-500/10 text-purple-700 border-purple-200",
  },
};

const FORMATS: PostFormat[] = ["data_drop", "contrarian_take", "playbook_snippet", "struggling_moment"];

export default function LinkedInContentEngine() {
  const { toast } = useToast();
  const [selectedFormat, setSelectedFormat] = useState<PostFormat>("data_drop");
  const [customAngle, setCustomAngle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showAngle, setShowAngle] = useState(false);

  const generatePost = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-linkedin-post", {
        body: {
          format: selectedFormat,
          custom_angle: customAngle.trim() || undefined,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const newPost: GeneratedPost = {
        ...data,
        generated_at: new Date().toISOString(),
      };

      setPosts((prev) => [newPost, ...prev]);
      toast({ title: "Post generated", description: `${FORMAT_META[selectedFormat].label} ready to copy.` });
    } catch (err: any) {
      console.error("Generate error:", err);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: err.message || "Please try again.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const copyPost = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          LinkedIn Content Engine
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate LinkedIn-ready posts from your proprietary diagnostic data. Every post is backed by real numbers.
        </p>
      </div>

      {/* Format Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {FORMATS.map((fmt) => {
          const meta = FORMAT_META[fmt];
          return (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left ${
                selectedFormat === fmt
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {meta.icon}
              <div>
                <div>{meta.label}</div>
                <div className="text-xs font-normal opacity-70">{meta.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Angle */}
      <div>
        <button
          onClick={() => setShowAngle(!showAngle)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          {showAngle ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          Add a custom angle or focus
        </button>
        {showAngle && (
          <Textarea
            placeholder="e.g. 'Focus on the gap between CTOs and team leads' or 'Tie into the recent Gartner AI hype cycle report' or 'Target consulting firms specifically'"
            value={customAngle}
            onChange={(e) => setCustomAngle(e.target.value.slice(0, 500))}
            className="text-sm min-h-[80px]"
          />
        )}
      </div>

      {/* Generate Button */}
      <Button onClick={generatePost} disabled={generating} className="gap-2" size="lg">
        {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {generating ? "Generating…" : `Generate ${FORMAT_META[selectedFormat].label}`}
      </Button>

      {/* Generated Posts */}
      {posts.map((post, idx) => {
        const meta = FORMAT_META[post.format];
        const snap = post.data_snapshot;
        return (
          <Card key={idx} className="border-border overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${meta.color} text-xs border`}>
                    {meta.icon}
                    <span className="ml-1">{meta.label}</span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.char_count} chars · n={snap.n}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 h-8"
                    onClick={() => {
                      setSelectedFormat(post.format);
                      generatePost();
                    }}
                    disabled={generating}
                  >
                    <RefreshCw className={`h-3 w-3 ${generating ? "animate-spin" : ""}`} />
                    Regenerate
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-1.5 h-8"
                    onClick={() => copyPost(post.post, idx)}
                  >
                    {copiedIdx === idx ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedIdx === idx ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* The post itself */}
              <div className="bg-muted/30 rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed font-normal text-foreground border border-border">
                {post.post}
              </div>

              {/* Data snapshot */}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>Avg score: <strong className="text-foreground">{snap.overallAvg}</strong></span>
                <span>Weakest: <strong className="text-foreground">{snap.weakestDim} ({snap.weakestScore})</strong></span>
                {Object.entries(snap.teamSizeSegments).length > 0 && (
                  <span>
                    Team sizes: {Object.entries(snap.teamSizeSegments).map(([k, v]) => `${k}(n=${v.count}, avg=${v.avg})`).join(", ")}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {posts.length === 0 && !generating && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No posts generated yet</p>
            <p className="text-xs mt-1">Select a format and hit generate. Each post uses your latest diagnostic data.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
