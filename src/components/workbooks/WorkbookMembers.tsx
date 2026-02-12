import { useState } from "react";
import { Plus, Crown, Pencil, Eye, UserMinus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorkbookMember {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: "owner" | "editor" | "member" | "viewer";
  joinedAt: string;
  tasksAssigned: number;
  tasksCompleted: number;
}

const MOCK_MEMBERS: WorkbookMember[] = [
  { id: "u0", name: "You", initials: "ME", email: "you@company.com", role: "owner", joinedAt: "Dec 1, 2025", tasksAssigned: 5, tasksCompleted: 3 },
  { id: "u1", name: "Sarah Chen", initials: "SC", email: "sarah@company.com", role: "editor", joinedAt: "Dec 5, 2025", tasksAssigned: 8, tasksCompleted: 6 },
  { id: "u2", name: "Mike Ross", initials: "MR", email: "mike@company.com", role: "member", joinedAt: "Dec 10, 2025", tasksAssigned: 3, tasksCompleted: 1 },
  { id: "u3", name: "Lisa Park", initials: "LP", email: "lisa@company.com", role: "editor", joinedAt: "Jan 2, 2026", tasksAssigned: 4, tasksCompleted: 4 },
  { id: "u4", name: "James Ko", initials: "JK", email: "james@company.com", role: "viewer", joinedAt: "Jan 15, 2026", tasksAssigned: 0, tasksCompleted: 0 },
];

const roleIcons: Record<string, React.ReactNode> = {
  owner: <Crown className="h-3 w-3 text-yellow-400" />,
  editor: <Pencil className="h-3 w-3 text-primary" />,
  member: <UserPlus className="h-3 w-3 text-muted-foreground" />,
  viewer: <Eye className="h-3 w-3 text-muted-foreground" />,
};

const roleColors: Record<string, string> = {
  owner: "border-yellow-400/30 text-yellow-400",
  editor: "border-primary/30 text-primary",
  member: "",
  viewer: "text-muted-foreground",
};

export function WorkbookMembers({ workbookId }: { workbookId: string }) {
  const [members] = useState(MOCK_MEMBERS);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{members.length} members</p>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setInviteOpen(true)}>
          <Plus className="h-3 w-3" /> Invite Member
        </Button>
      </div>

      <div className="space-y-2">
        {members.map(m => (
          <div key={m.id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">{m.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{m.name}</span>
                <Badge variant="outline" className={`text-[10px] gap-1 ${roleColors[m.role]}`}>
                  {roleIcons[m.role]} {m.role}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{m.email}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Tasks: {m.tasksCompleted}/{m.tasksAssigned}</p>
              <p className="text-[10px] text-muted-foreground">Joined {m.joinedAt}</p>
            </div>
            {m.role !== "owner" && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0">
                <UserMinus className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite Member</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input placeholder="colleague@company.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Role</label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor — can edit content and manage tasks</SelectItem>
                  <SelectItem value="member">Member — can view and contribute</SelectItem>
                  <SelectItem value="viewer">Viewer — read-only access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={() => setInviteOpen(false)} disabled={!inviteEmail.trim()}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Compact member list for the right sidebar */
export function MembersSidebarPanel({ workbookId }: { workbookId: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-muted-foreground">Team ({MOCK_MEMBERS.length})</p>
      <div className="space-y-1">
        {MOCK_MEMBERS.map(m => (
          <div key={m.id} className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-1.5 text-xs">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{m.initials}</AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate">{m.name}</span>
            {roleIcons[m.role]}
          </div>
        ))}
      </div>
    </div>
  );
}
