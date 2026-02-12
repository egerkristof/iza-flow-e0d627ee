import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Rocket, BarChart3, Settings2, Search, Brain, LogOut, ChevronDown,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const roleLabels: Record<AppRole, string> = {
  operator: "🚀 Operator",
  architect: "🏗️ Architect",
  manager: "📊 Manager",
};

const navItems = [
  { title: "Dashboard", url: "/", icon: Brain },
  { title: "Launchpad", url: "/launchpad", icon: Rocket, roles: ["operator"] as AppRole[] },
  { title: "Command Center", url: "/command-center", icon: BarChart3, roles: ["manager"] as AppRole[] },
  { title: "Process Studio", url: "/process-studio", icon: Settings2, roles: ["architect"] as AppRole[] },
];

export function AppSidebar() {
  const { profile, roles, activeRole, setActiveRole, signOut } = useAuth();
  const location = useLocation();

  // Show all nav items (role filtering is soft — all visible for prototype)
  const visibleItems = navItems;

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
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
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
          <span className="truncate text-xs text-sidebar-foreground">
            {profile?.display_name ?? "User"}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={signOut}>
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
