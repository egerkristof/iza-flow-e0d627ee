import { BookOpen, Target, BarChart3, User, LogOut, ChevronDown, FileCode2, Microscope, Home, FlaskConical, ShieldCheck } from "lucide-react";
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
  { title: "Home", url: "/app", icon: Home, hideForRoles: [] as string[] },
  { title: "Execute", url: "/workbooks", icon: BookOpen, hideForRoles: [] as string[] },
  { title: "Design", url: "/context", icon: Target, hideForRoles: ["operator"] },
  { title: "Research", url: "/research-templates", icon: Microscope, hideForRoles: ["operator"] },
  { title: "Oversee", url: "/oversight", icon: BarChart3, hideForRoles: ["operator"] },
  { title: "Learn", url: "/my-knowledge", icon: User, hideForRoles: [] as string[] },
  { title: "Configure", url: "/admin/prompts", icon: FileCode2, hideForRoles: ["operator", "manager"] },
  { title: "Trials", url: "/admin/trials", icon: FlaskConical, hideForRoles: ["operator", "manager"] },
  { title: "Admin", url: "/admin/manage", icon: ShieldCheck, hideForRoles: ["operator", "manager"] },
];

/** LIZA wordmark — matching reference image style */
function LizaWordmark() {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xl font-bold tracking-tight leading-none brand-gradient-text">
          LIZA
        </span>
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/60 leading-none mt-0.5">
          OS
        </span>
      </div>
      <span className="text-[9px] tracking-[0.18em] uppercase text-muted-foreground/35 leading-none font-medium">
        Your Organisational Intelligence
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
                className="w-full justify-between text-xs border-sidebar-border bg-sidebar-accent/60 hover:bg-sidebar-accent text-foreground"
              >
                <span className="text-[13px]">{roleLabels[activeRole]}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {(["operator", "architect", "manager"] as AppRole[]).map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className="text-[13px]"
                >
                  {roleLabels[role]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest uppercase text-muted-foreground/50 mb-1">
            Spaces
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.filter(item => !item.hideForRoles.includes(activeRole)).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
                      activeClassName="sidebar-active text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
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
