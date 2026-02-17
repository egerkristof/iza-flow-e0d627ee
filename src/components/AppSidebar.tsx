import { useLocation } from "react-router-dom";
import { Brain, BookOpen, Target, BarChart3, User, LogOut, ChevronDown, FileCode2, Microscope } from "lucide-react";
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
  operator: "🚀 Operator",
  architect: "🏗️ Process Owner",
  manager: "📊 Leader",
};

const navItems = [
  { title: "Dashboard", url: "/", icon: Brain, hideForRoles: [] as string[] },
  { title: "Workbooks", url: "/workbooks", icon: BookOpen, hideForRoles: [] as string[] },
  { title: "Playbooks", url: "/context", icon: Target, hideForRoles: ["operator"] },
  { title: "Research", url: "/research-templates", icon: Microscope, hideForRoles: ["operator"] },
  { title: "Oversight", url: "/oversight", icon: BarChart3, hideForRoles: [] as string[] },
  { title: "My Knowledge", url: "/my-knowledge", icon: User, hideForRoles: [] as string[] },
  { title: "AI Prompts", url: "/admin/prompts", icon: FileCode2, hideForRoles: ["operator", "manager"] },
];

export function AppSidebar() {
  const { profile, roles, activeRole, setActiveRole, signOut } = useAuth();

  return (
    <Sidebar className="w-60 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <Brain className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sidebar-accent-foreground">LizaOS</span>
      </div>

      <SidebarContent>
        {/* Role switcher */}
        <div className="px-3 pt-4 pb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-between text-xs">
                {roleLabels[activeRole]}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {(["operator", "architect", "manager"] as AppRole[]).map((role) => (
                <DropdownMenuItem key={role} onClick={() => setActiveRole(role)}>
                  {roleLabels[role]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.filter(item => !item.hideForRoles.includes(activeRole)).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
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
          <span className="truncate text-xs text-sidebar-foreground">{profile?.display_name ?? "User"}</span>
          <div className="flex items-center gap-1">
            <NotificationBell />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={signOut}>
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
