import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResearchLens } from "@/components/ResearchLens";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [lensOpen, setLensOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-border px-4">
            <SidebarTrigger className="mr-2" />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-2 text-xs text-muted-foreground hover:text-foreground"
                title="Research Lens (⌘K)"
                onClick={() => setLensOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Research</span>
                <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-secondary px-1.5 text-[10px] font-mono text-muted-foreground">⌘K</kbd>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
      <ResearchLens open={lensOpen} onOpenChange={setLensOpen} />
    </SidebarProvider>
  );
}
