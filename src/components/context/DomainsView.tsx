import { useState, useMemo, useEffect } from "react";
import {
  TrendingUp, Settings, DollarSign, Users, Code, HeartHandshake, Shield, Target,
  Globe, Plus, Pencil, Trash2, Loader2, Package, Folder,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { MockBundle, MockContextItem } from "@/data/mockContextItems";

// Icon map for domain cards
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, Settings, DollarSign, Users, Code, HeartHandshake, Shield, Target,
  Globe, Package, Folder,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

const COLOR_MAP: Record<string, string> = {
  slate: "from-slate-500/20 to-slate-600/5 border-slate-500/30",
  blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
  amber: "from-amber-500/20 to-amber-600/5 border-amber-500/30",
  emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
  violet: "from-violet-500/20 to-violet-600/5 border-violet-500/30",
  cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/30",
  rose: "from-rose-500/20 to-rose-600/5 border-rose-500/30",
  orange: "from-orange-500/20 to-orange-600/5 border-orange-500/30",
  indigo: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/30",
};

const ICON_COLOR_MAP: Record<string, string> = {
  slate: "text-slate-400",
  blue: "text-blue-400",
  amber: "text-amber-400",
  emerald: "text-emerald-400",
  violet: "text-violet-400",
  cyan: "text-cyan-400",
  rose: "text-rose-400",
  orange: "text-orange-400",
  indigo: "text-indigo-400",
};

const COLOR_OPTIONS = Object.keys(COLOR_MAP);

interface DomainRow {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  tag: string;
  icon: string | null;
  color: string | null;
  is_default: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface DomainsViewProps {
  bundles: MockBundle[];
  items: MockContextItem[];
  onSelectDomain: (tag: string, title: string) => void;
  bundleDomainMap?: Map<string, string[]>;
}

export function DomainsView({ bundles, items, onSelectDomain, bundleDomainMap }: DomainsViewProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch domains from DB
  const { data: domains = [], isPending } = useQuery({
    queryKey: ["domains", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domains")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as DomainRow[];
    },
  });

  // Seed defaults if no domains exist
  const [seeding, setSeeding] = useState(false);
  useEffect(() => {
    if (!user || isPending || domains.length > 0 || seeding) return;
    setSeeding(true);
    (async () => {
      try {
        const { error } = await supabase.rpc("seed_default_domains", { p_user_id: user.id });
        if (error) console.error("Seed error:", error);
        queryClient.invalidateQueries({ queryKey: ["domains"] });
      } finally {
        setSeeding(false);
      }
    })();
  }, [user, isPending, domains.length, seeding]);

  // Compute counts per domain using bundle_domains junction table
  const domainStats = useMemo(() => {
    const stats = new Map<string, { bundleCount: number; itemCount: number }>();
    for (const d of domains) {
      let matchingBundleIds: string[];
      if (bundleDomainMap && bundleDomainMap.size > 0) {
        // Use explicit bundle_domains assignments
        matchingBundleIds = bundles
          .filter(b => (bundleDomainMap.get(b.id) || []).includes(d.id))
          .map(b => b.id);
      } else {
        // Fallback to tag-based matching from items' domain_scope
        const tag = d.tag;
        matchingBundleIds = bundles
          .filter(b =>
            tag === "GLOBAL"
              ? b.domain_tags.some(t => t === "GLOBAL" || t === "general")
              : b.domain_tags.includes(tag)
          )
          .map(b => b.id);
      }
      const matchingItemCount = items.filter(i =>
        i.bundle_id && matchingBundleIds.includes(i.bundle_id)
      ).length;
      stats.set(d.id, { bundleCount: matchingBundleIds.length, itemCount: matchingItemCount });
    }
    return stats;
  }, [domains, bundles, items, bundleDomainMap]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<DomainRow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DomainRow | null>(null);
  const [form, setForm] = useState({ title: "", description: "", tag: "", icon: "Folder", color: "blue" });
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingDomain(null);
    setForm({ title: "", description: "", tag: "", icon: "Folder", color: "blue" });
    setDialogOpen(true);
  };

  const openEdit = (d: DomainRow) => {
    setEditingDomain(d);
    setForm({
      title: d.title,
      description: d.description ?? "",
      tag: d.tag,
      icon: d.icon ?? "Folder",
      color: d.color ?? "blue",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user || !form.title.trim() || !form.tag.trim()) return;
    setSaving(true);
    if (editingDomain) {
      const { error } = await supabase.from("domains").update({
        title: form.title.trim(),
        description: form.description.trim() || null,
        tag: form.tag.trim().toLowerCase(),
        icon: form.icon,
        color: form.color,
      } as any).eq("id", editingDomain.id);
      if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Domain updated" }); }
    } else {
      const maxOrder = domains.length > 0 ? Math.max(...domains.map(d => d.sort_order)) + 1 : 0;
      const { error } = await supabase.from("domains").insert({
        owner_id: user.id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        tag: form.tag.trim().toLowerCase(),
        icon: form.icon,
        color: form.color,
        sort_order: maxOrder,
      } as any);
      if (error) { toast({ title: "Create failed", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Domain created" }); }
    }
    setSaving(false);
    setDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["domains"] });
  };

  const handleDelete = async (d: DomainRow) => {
    const { error } = await supabase.from("domains").delete().eq("id", d.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Domain deleted" }); }
    setDeleteConfirm(null);
    queryClient.invalidateQueries({ queryKey: ["domains"] });
  };

  if (isPending || seeding) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto px-4 pb-4 pt-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {domains.map(domain => {
          const Icon = ICON_MAP[domain.icon ?? "Folder"] ?? Folder;
          const colorClass = COLOR_MAP[domain.color ?? "blue"] ?? COLOR_MAP.blue;
          const iconColor = ICON_COLOR_MAP[domain.color ?? "blue"] ?? "text-primary";
          const stats = domainStats.get(domain.id) ?? { bundleCount: 0, itemCount: 0 };

          return (
            <Card
              key={domain.id}
              className={`group relative cursor-pointer overflow-hidden border bg-gradient-to-br ${colorClass} hover:border-primary/40 transition-all hover:shadow-md hover:shadow-primary/5`}
              onClick={() => onSelectDomain(domain.tag, domain.title)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-background/50 shrink-0`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{domain.title}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                      {domain.description || "No description"}
                    </p>
                  </div>
                  {/* Edit/Delete buttons */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button
                      variant="ghost" size="icon" className="h-6 w-6"
                      onClick={(e) => { e.stopPropagation(); openEdit(domain); }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    {!domain.is_default && (
                      <Button
                        variant="ghost" size="icon" className="h-6 w-6 text-destructive"
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(domain); }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="text-[10px] gap-1">
                    <Package className="h-2.5 w-2.5" />
                    {stats.bundleCount} {stats.bundleCount === 1 ? "bundle" : "bundles"}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {stats.itemCount} items
                  </Badge>
                  <Badge variant="outline" className="text-[10px] ml-auto font-mono">
                    {domain.tag}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Domain card */}
        <Card
          className="cursor-pointer border-dashed border-border/50 hover:border-primary/40 transition-all hover:bg-secondary/10 flex items-center justify-center min-h-[120px]"
          onClick={openCreate}
        >
          <CardContent className="p-4 text-center">
            <Plus className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs font-medium text-muted-foreground">Add Domain</p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDomain ? "Edit Domain" : "Create Domain"}</DialogTitle>
            <DialogDescription>
              {editingDomain ? "Update this domain's details." : "Add a new business domain to organize your playbooks."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Name</Label>
              <Input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Sales & Marketing"
              />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of this domain"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-xs">Tag (used for domain_scope matching)</Label>
              <Input
                value={form.tag}
                onChange={e => setForm({ ...form, tag: e.target.value })}
                placeholder="e.g. sales"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-xs">Icon</Label>
                <Select value={form.icon} onValueChange={v => setForm({ ...form, icon: v })}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map(name => {
                      const I = ICON_MAP[name];
                      return (
                        <SelectItem key={name} value={name}>
                          <span className="flex items-center gap-2">
                            <I className="h-3.5 w-3.5" /> {name}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-xs">Color</Label>
                <Select value={form.color} onValueChange={v => setForm({ ...form, color: v })}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map(c => (
                      <SelectItem key={c} value={c}>
                        <span className="flex items-center gap-2">
                          <span className={`h-3 w-3 rounded-full bg-${c}-500`} />
                          {c}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title.trim() || !form.tag.trim()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {editingDomain ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={open => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete domain "{deleteConfirm?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the domain category. Items and bundles tagged with "{deleteConfirm?.tag}" will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
