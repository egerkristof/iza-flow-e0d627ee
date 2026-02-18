import { BookOpen, Target, BarChart3, User, LogOut, ChevronDown, FileCode2, Microscope } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/lib/auth";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const roleLabels: Record<AppRole, string> = {
  operator: "Operator",
  architect: "Process Owner",
  manager: "Leader",
};

const navItems = [
  { title: "Dashboard", url: "/", icon: BarChart3, hideForRoles: [] as string[] },
  { title: "Workbooks", url: "/workbooks", icon: BookOpen, hideForRoles: [] as string[] },
  { title: "Playbooks", url: "/context", icon: Target, hideForRoles: ["operator"] },
  { title: "Research", url: "/research-templates", icon: Microscope, hideForRoles: ["operator"] },
  { title: "Oversight", url: "/oversight", icon: BarChart3, hideForRoles: ["operator"] },
  { title: "My Knowledge", url: "/my-knowledge", icon: User, hideForRoles: [] as string[] },
  { title: "AI Prompts", url: "/admin/prompts", icon: FileCode2, hideForRoles: ["operator", "manager"] },
];

/** LIZA geometric wordmark — matches brand lettermark style */
function LizaWordmark() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Orb accent — the brand's circular energy motif */}
      <div
        className="h-5 w-5 rounded-full flex-shrink-0"
        style={{
          background: "var(--gradient-brand)",
          boxShadow: "0 0 10px hsl(200 90% 52% / 0.5), 0 0 20px hsl(155 72% 46% / 0.2)",
        }}
      />
      {/* LIZA tracked caps — geometric brand lettermark */}
      <span
        className="text-sm font-semibold tracking-[0.18em] uppercase"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <span className="text-foreground">LIZ</span>
        <span className="brand-gradient-text font-bold">A</span>
      </span>
    </div>
  );
}

export function AppSidebar() {
  const { profile, activeRole, setActiveRole, signOut } = useAuth();

  return (
    <Sidebar className="w-60 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <LizaWordmark />
      </div>

      <SidebarContent>
        {/* Role switcher */}
        <div className="px-3 pt-4 pb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between text-xs border-border/50 bg-transparent hover:bg-accent"
              >
                <span className="text-muted-foreground uppercase tracking-widest text-[10px]">
                  {roleLabels[activeRole]}
                </span>
                <ChevronDown className="h-3 w-3 opacity-40" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {(["operator", "architect", "manager"] as AppRole[]).map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className="text-xs uppercase tracking-widest"
                >
                  {roleLabels[role]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest uppercase text-muted-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.filter(item => !item.hideForRoles.includes(activeRole)).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent rounded-md transition-colors"
                      activeClassName="sidebar-active text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="text-[13px]">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <span className="truncate text-xs text-sidebar-foreground">{profile?.display_name ?? "User"}</span>
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground/50">{roleLabels[activeRole]}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <NotificationBell />
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={signOut}>
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
