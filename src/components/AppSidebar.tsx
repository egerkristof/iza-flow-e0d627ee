import { BookOpen, Target, BarChart3, User, LogOut, ChevronDown, FileCode2, Microscope, Brain } from "lucide-react";
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
  { title: "Command", url: "/", icon: BarChart3, hideForRoles: [] as string[] },
  { title: "Execute", url: "/workbooks", icon: BookOpen, hideForRoles: [] as string[] },
  { title: "Design", url: "/context", icon: Target, hideForRoles: ["operator"] },
  { title: "Research", url: "/research-templates", icon: Microscope, hideForRoles: ["operator"] },
  { title: "Oversee", url: "/oversight", icon: BarChart3, hideForRoles: ["operator"] },
  { title: "Learn", url: "/my-knowledge", icon: User, hideForRoles: [] as string[] },
  { title: "Configure", url: "/admin/prompts", icon: FileCode2, hideForRoles: ["operator", "manager"] },
];

/** Original LizaOS logo — Brain icon + wordmark */
function LizaWordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <Brain className="h-5 w-5 text-primary" />
      <span className="text-sm font-semibold tracking-tight">
        <span className="text-foreground">Liza</span>
        <span className="text-primary">OS</span>
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
